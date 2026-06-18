import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadSoulResult, type StoredSoulResult } from "@/lib/soul-result";
import { archetypeContent } from "@/data/archetypeContent";
import {
  generateSoundPrompt,
  generateShortMusicPrompt,
  type FlavorAnswers,
} from "@/engine/promptGenerator";
import type { FlavorOption } from "@/data/flavorMappings";
import { supabase } from "@/integrations/supabase/client";
import { CalmBlank } from "@/components/CalmBlank";
import { analytics } from "@/lib/analytics";


const ANSWERS_STORAGE_KEY = "soul-sounds:answers";
const POLL_INTERVAL_MS = 15_000;
const POLL_TIMEOUT_MS = 5 * 60_000;

type SoundStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; audioUrl: string; imageUrl?: string | null; duration?: number | null }
  | { kind: "error"; message: string };

function isSuccess(s?: string | null) {
  if (!s) return false;
  const v = s.toLowerCase();
  return (
    v === "complete" ||
    v === "completed" ||
    v === "success" ||
    v === "succeeded" ||
    v === "finished"
  );
}

function isFailure(s?: string | null) {
  if (!s) return false;
  const v = s.toLowerCase();
  return (
    v === "failed" || v === "error" || v === "rejected" || v === "cancelled" || v === "canceled"
  );
}

function loadFlavorAnswers(): FlavorAnswers {
  try {
    const raw = localStorage.getItem(ANSWERS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    const get = (id: number) =>
      (["a", "b", "c", "d"] as const).includes(parsed[id] as FlavorOption)
        ? (parsed[id] as FlavorOption)
        : undefined;
    return {
      tempo: get(7),
      instrumentation: get(8),
      mood: get(9),
      warmth: get(10),
      atmosphere: get(11),
      intensity: get(12),
    };
  } catch {
    return {};
  }
}

function ResultsPending() {
  return <CalmBlank />;
}

function ResultsError({ error, reset }: { error: Error; reset: () => void }) {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowError(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!showError) {
    return <CalmBlank />;
  }

  return (
    <CalmBlank>
      <div className="relative z-10 mx-auto max-w-md px-6 text-center">
        <h1 className="font-display text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          >
            Try again
          </button>
          <Link
            to="/"
            className="btn-ghost inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
          >
            Go home
          </Link>
        </div>
      </div>
    </CalmBlank>
  );
}

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [{ title: "Your Soul Is Ready — Soul Sounds" }],
  }),
  pendingComponent: ResultsPending,
  errorComponent: ResultsError,
  component: Results,
});


function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function Results() {
  const [result, setResult] = useState<StoredSoulResult | null>(null);
  const [flavorAnswers, setFlavorAnswers] = useState<FlavorAnswers>({});
  const [sound, setSound] = useState<SoundStatus>({ kind: "idle" });
  const [phase, setPhase] = useState(0);
  const [resultReady, setResultReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadMode, setDownloadMode] = useState<"download" | "open">("download");
  const [isPaid, setIsPaid] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lookupDone, setLookupDone] = useState(false);
  const [recordExists, setRecordExists] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const timeoutTimerRef = useRef<number | null>(null);
  const soundSectionRef = useRef<HTMLElement | null>(null);
  const autoStartedRef = useRef(false);

  useEffect(() => {
    setResult(loadSoulResult());
    setFlavorAnswers(loadFlavorAnswers());
    try {
      // URL is the source of truth for the purchase identifier. localStorage
      // is only a performance cache so refreshes feel instant.
      const urlParams = new URLSearchParams(window.location.search);
      const urlSid = urlParams.get("session_id");
      const localSid = localStorage.getItem("soulSoundsSessionId");
      const sid = urlSid || localSid;

      if (urlSid) {
        // A session_id in the URL means this is a paid reveal — works on any
        // device, any browser, even with cleared storage.
        try {
          localStorage.setItem("soulSoundsSessionId", urlSid);
          localStorage.setItem("soulSoundsPaid", "true");
        } catch {
          // ignore
        }
        setIsPaid(true);
      } else {
        setIsPaid(localStorage.getItem("soulSoundsPaid") === "true");
      }

      if (sid) setSessionId(sid);
      if (localStorage.getItem("soulSoundsAutoGenerate") === "true") {
        setAutoGenerate(true);
        localStorage.removeItem("soulSoundsAutoGenerate");
      }

      // Optimistic cache: if we already have a ready Soul Sound stored locally
      // for this session, show it immediately. We still validate against the DB
      // below, but this avoids any flash of the loading/generate UI on refresh.
      if (sid) {
        const cachedRaw = localStorage.getItem(`soulSound:${sid}`);
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            if (cached?.audioUrl) {
              setSound({
                kind: "ready",
                audioUrl: cached.audioUrl,
                imageUrl: cached.imageUrl ?? null,
                duration: cached.duration ?? null,
              });
              setRecordExists(true);
            }
          } catch {
            // ignore
          }
        }
      }
    } catch (_) {
      // ignore
    }

    const readyT = setTimeout(() => setResultReady(true), 250);
    const fallbackT = setTimeout(() => setShowFallback(true), 3000);
    return () => {
      clearTimeout(readyT);
      clearTimeout(fallbackT);
    };
  }, []);



  useEffect(() => {
    return () => {
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
      if (timeoutTimerRef.current) window.clearTimeout(timeoutTimerRef.current);
    };
  }, []);

  // Fire results_viewed once when results page mounts.
  useEffect(() => {
    analytics.resultsViewed();
  }, []);

  // Reveal sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3200),
      setTimeout(() => setPhase(6), 4000),
      setTimeout(() => setPhase(7), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const archetypeIdForPrompt = result?.bestMatch.id ?? null;
  const promptText = useMemo(() => {
    if (!archetypeIdForPrompt) return "";
    const c = archetypeContent[archetypeIdForPrompt];
    if (!c) return "";
    return generateSoundPrompt(c.promptFoundation, flavorAnswers);
  }, [archetypeIdForPrompt, flavorAnswers]);

  const shortPrompt = useMemo(() => {
    if (!result || !archetypeIdForPrompt) return "";
    const c = archetypeContent[archetypeIdForPrompt];
    if (!c) return "";
    return generateShortMusicPrompt({
      archetypeName: result.bestMatch.displayName,
      coreEmotion: c.coreEmotion,
      soulKeywords: c.soulKeywords,
      answers: flavorAnswers,
    });
  }, [result, archetypeIdForPrompt, flavorAnswers]);

  function stopPolling() {
    if (pollTimerRef.current) {
      window.clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (timeoutTimerRef.current) {
      window.clearTimeout(timeoutTimerRef.current);
      timeoutTimerRef.current = null;
    }
  }

  function handleEnded() {
    setIsPlaying(false);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused || audio.ended) {
      void audio.play();
    } else {
      audio.pause();
    }
  }

  async function handleDownload() {
    if (sound.kind !== "ready") return;
    analytics.soulSoundDownloaded();
    if (downloadMode === "open") {
      window.open(sound.audioUrl, "_blank", "noopener,noreferrer");
      return;
    }
    try {
      const response = await fetch(sound.audioUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `soul-sound-${archetypeName.toLowerCase().replace(/\s+/g, "-")}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed, falling back to open in new tab", e);
      setDownloadMode("open");
      window.open(sound.audioUrl, "_blank", "noopener,noreferrer");
    }
  }

  function persistReadyLocally(sid: string | null, payload: {
    audioUrl: string;
    imageUrl?: string | null;
    duration?: number | null;
    title?: string | null;
  }) {
    if (!sid) return;
    try {
      localStorage.setItem(`soulSound:${sid}`, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  async function pollOnce(taskId: string, sid: string | null) {
    try {
      const { data, error } = await supabase.functions.invoke("check-soul-sound-status", {
        body: { task_id: taskId, session_id: sid },
      });
      if (error) {
        console.error("status invoke error", error);
        return;
      }
      const status = (data?.status as string | undefined) ?? null;
      const audioUrl = (data?.audioUrl as string | undefined) ?? null;
      if (audioUrl) {
        stopPolling();
        const ready = {
          kind: "ready" as const,
          audioUrl,
          imageUrl: data?.imageUrl ?? null,
          duration: data?.duration ? Number(data.duration) : null,
        };
        setSound(ready);
        setRecordExists(true);
        persistReadyLocally(sid, {
          audioUrl,
          imageUrl: data?.imageUrl ?? null,
          duration: data?.duration ? Number(data.duration) : null,
          title: data?.title ?? null,
        });
        return;
      }
      if (isFailure(status)) {
        stopPolling();
        setSound({
          kind: "error",
          message: "Your Soul Sound needs a little more time. Please try again.",
        });
      }
    } catch (e) {
      console.error("poll error", e);
    }
  }

  function startPolling(taskId: string, sid: string | null) {
    stopPolling();
    void pollOnce(taskId, sid);
    pollTimerRef.current = window.setInterval(
      () => pollOnce(taskId, sid),
      POLL_INTERVAL_MS,
    );
    timeoutTimerRef.current = window.setTimeout(() => {
      stopPolling();
      setSound((prev) =>
        prev.kind === "ready"
          ? prev
          : {
              kind: "error",
              message: "Your Soul Sound needs a little more time. Please try again.",
            },
      );
    }, POLL_TIMEOUT_MS);
  }

  async function handleGenerate() {
    if (!promptText) return;
    if (!isPaid) return;
    if (!sessionId) return;
    setDownloadMode("download");
    setSound({ kind: "loading" });

    try {
      const { data, error } = await supabase.functions.invoke("generate-soul-sound", {
        body: {
          session_id: sessionId,
          archetype_id: result?.bestMatch.id ?? null,
          archetype_name: result?.bestMatch.displayName ?? null,
          promptText,
          shortPrompt,
        },
      });
      if (error) {
        console.error("generate invoke error", error, data);
        setSound({
          kind: "error",
          message: "Your Soul Sound needs a little more time. Please try again.",
        });
        return;
      }

      // Server may return an already-ready record (idempotent guard).
      if (data?.status === "ready" && data?.audioUrl) {
        setSound({
          kind: "ready",
          audioUrl: data.audioUrl,
          imageUrl: data.imageUrl ?? null,
          duration: data.duration ? Number(data.duration) : null,
        });
        setRecordExists(true);
        persistReadyLocally(sessionId, {
          audioUrl: data.audioUrl,
          imageUrl: data.imageUrl ?? null,
          duration: data.duration ? Number(data.duration) : null,
          title: data.title ?? null,
        });
        return;
      }

      const taskId: string | undefined = data?.task_id;
      if (!taskId) {
        setSound({
          kind: "error",
          message: "Your Soul Sound needs a little more time. Please try again.",
        });
        return;
      }
      setRecordExists(true);
      startPolling(taskId, sessionId);
    } catch (e) {
      console.error("generate error", e);
      setSound({
        kind: "error",
        message: "Your Soul Sound needs a little more time. Please try again.",
      });
    }
  }

  // Source of truth: ask the database if a Soul Sound already exists for this
  // paid session. This runs on every page load, including refreshes and visits
  // from new browsers/devices. If a finished sound exists we display it and
  // never call MusicAPI. If one is in flight we resume polling its task_id.
  useEffect(() => {
    if (!sessionId) {
      setLookupDone(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-soul-sound", {
          body: { session_id: sessionId },
        });
        if (cancelled) return;
        if (error) {
          console.error("get-soul-sound error", error);
          setLookupDone(true);
          return;
        }
        if (data?.exists) {
          // A DB record proves this session was paid — flip the flag so any
          // UI gated on isPaid (e.g. hiding the Generate button) is correct
          // even when the user lands here without local payment state.
          setIsPaid(true);
          try {
            localStorage.setItem("soulSoundsPaid", "true");
          } catch {
            // ignore
          }

          // Reconstruct the result from the DB record when local state is
          // missing (e.g. user returns on a new browser/device). archetype_id
          // is the only identifier we need — all reveal copy is keyed by it.
          if (data.archetypeId && archetypeContent[data.archetypeId]) {
            setResult((prev) =>
              prev ?? {
                scores: { energy: 0, focus: 0, thinking: 0, structure: 0, risk: 0, influence: 0 },
                bestMatch: {
                  id: data.archetypeId,
                  displayName: data.archetypeName ?? data.archetypeId,
                  distance: 0,
                },
                secondMatch: null,
                thirdMatch: null,
                totalScore: 0,
                computedAt: new Date().toISOString(),
              },
            );
          }
          if (data.status === "ready" && data.audioUrl) {
            setRecordExists(true);
            setSound({
              kind: "ready",
              audioUrl: data.audioUrl,
              imageUrl: data.imageUrl ?? null,
              duration: data.duration ? Number(data.duration) : null,
            });
            persistReadyLocally(sessionId, {
              audioUrl: data.audioUrl,
              imageUrl: data.imageUrl ?? null,
              duration: data.duration ? Number(data.duration) : null,
              title: data.title ?? null,
            });
          } else if (data.status === "generating" && data.taskId) {
            setRecordExists(true);
            setSound({ kind: "loading" });
            startPolling(data.taskId, sessionId);
          }
          // If status === "failed", leave recordExists=false so the user can
          // retry exactly once via the Try Again button.
        }

      } catch (e) {
        console.error("get-soul-sound exception", e);
      } finally {
        if (!cancelled) setLookupDone(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Auto-start generation when the user just completed payment AND no record
  // exists yet for this session. Guarded by lookupDone + recordExists so we
  // never race the DB lookup and accidentally start a duplicate job.
  useEffect(() => {
    if (!autoGenerate) return;
    if (!isPaid) return;
    if (!promptText) return;
    if (!sessionId) return;
    if (!lookupDone) return;
    if (recordExists) return;
    if (autoStartedRef.current) return;
    if (sound.kind !== "idle") return;
    autoStartedRef.current = true;
    const t = setTimeout(() => {
      void handleGenerate();
      soundSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoGenerate, isPaid, promptText, sessionId, lookupDone, recordExists, sound.kind]);

  // Auto-scroll into the finished player when the sound is ready.
  useEffect(() => {
    if (sound.kind !== "ready") return;
    const t = setTimeout(() => {
      soundSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => clearTimeout(t);
  }, [sound.kind]);

  const archetypeId = result?.bestMatch.id ?? null;
  const content = archetypeId ? archetypeContent[archetypeId] : null;

  // While the initial mount + DB lookup are in flight, stay on the calm
  // blank surface. The lookup is only relevant when a sessionId exists.
  const waitingForLookup = !!sessionId && !lookupDone;
  if (!resultReady || waitingForLookup) {
    return <CalmBlank />;
  }

  if (!result || !content) {
    // No local quiz state, no recoverable paid record. Show a calm recovery
    // message instead of an indefinite blank screen.
    return (
      <CalmBlank>
        <div className="relative z-10 mx-auto max-w-md px-6 text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            We couldn't find your reflection on this device.
          </h1>
          <p className="mt-4 text-sm text-foreground/65">
            Return home to begin a new reflection, or reopen the link from your confirmation email on the device where you took the quiz.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/"
              className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium"
            >
              Return Home
            </Link>
          </div>
        </div>
      </CalmBlank>
    );
  }



  const archetypeName = result.bestMatch.displayName;

  return (
    <main className="bg-night relative min-h-screen overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.82_0.13_85)] opacity-15 blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.55_0.18_305)] opacity-20 blur-3xl animate-float-slow"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      {/* Transition overlay: bridges the fade from /calculating */}
      <div
        className={`absolute inset-0 z-50 bg-[oklch(0.16_0.03_280)] transition-opacity duration-[600ms] ease-out ${
          phase >= 1 ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Nav */}
        <nav
          className={`mb-24 flex items-center justify-between transition-all duration-700 ease-out sm:mb-32 ${
            phase >= 7 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
          }`}
        >
          <Link
            to="/"
            className="font-display text-lg text-foreground/70 transition hover:text-foreground"
          >
            Soul Sounds
          </Link>
        </nav>

        {/* === STAGE 2: THE ARCHETYPE REVEAL === */}

        {/* Heading: Your Soul Archetype */}
        <div
          className={`pt-8 text-center transition-all duration-700 ease-out ${
            phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Your Soul Archetype
          </p>
        </div>

        {/* Hero: Archetype Name */}
        <div
          className={`mt-6 text-center transition-all duration-1000 ease-out ${
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="font-display text-6xl leading-[0.95] text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
            {archetypeName}
          </h1>
          <p className="font-display mt-5 text-xl italic text-foreground/50 sm:text-2xl">
            {content.subtitle}
          </p>
        </div>

        {/* Core Emotion */}
        <div
          className={`mt-28 text-center transition-all duration-700 ease-out sm:mt-36 ${
            phase >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Core Emotion
          </p>
          <p className="font-display text-4xl text-foreground sm:text-5xl md:text-6xl">
            {content.coreEmotion}
          </p>
        </div>

        {/* Soul Keywords */}
        <div
          className={`mt-28 transition-all duration-700 ease-out sm:mt-36 ${
            phase >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Your Soul Keywords
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {content.soulKeywords.slice(0, 5).map((k) => (
              <span
                key={k}
                className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-5 py-2 text-sm text-foreground/80 backdrop-blur-sm"
              >
                {capitalize(k)}
              </span>
            ))}
          </div>
        </div>

        {/* Core Identity */}
        <div
          className={`mt-28 transition-all duration-700 ease-out sm:mt-36 ${
            phase >= 6 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="mb-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Core Identity
          </p>
          <p className="font-display mx-auto max-w-2xl text-center text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
            {content.soulIdentity}
          </p>
        </div>

        {/* === SOUL SOUND (editorial centerpiece) === */}
        <div
          className={`transition-all duration-1000 ease-out ${
            phase >= 7 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <section id="soul-sound-section" ref={soundSectionRef} className="mt-24 sm:mt-32">
            <article className="relative overflow-hidden rounded-[2rem] border border-foreground/[0.10] bg-foreground/[0.03] px-6 py-14 backdrop-blur-sm sm:px-14 sm:py-20">
              <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.10] blur-3xl" />
              <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-[oklch(0.55_0.18_305)] opacity-[0.10] blur-3xl" />

              <div className="relative text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                  Your Soul Sound
                </p>
                <h2 className="font-display mt-6 text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl">
                  Now hear it in sound.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/70 sm:text-lg">
                  An original instrumental reflection shaped by the rhythm, feeling, and movement of your archetype.
                </p>
              </div>

              <div className="relative mt-12">
                {sound.kind === "idle" && (
                  <div className="text-center">
                    {isPaid ? (
                      // After payment, never show a Generate button. We either
                      // (a) auto-start the one-and-only generation, (b) resume
                      // an in-flight task, or (c) display the permanent sound.
                      // While the DB lookup is in flight, show the calm
                      // composing surface instead of an actionable button.
                      <div className="flex flex-col items-center justify-center px-4 py-10 text-center animate-fade-up">
                        <div
                          className="flex h-12 items-center justify-center gap-1.5"
                          aria-hidden="true"
                        >
                          {[0, 1, 2, 3, 4].map((i) => (
                            <span
                              key={i}
                              className="block w-1.5 rounded-full bg-[oklch(0.82_0.13_85)]/60 animate-wave"
                              style={{
                                height: `${16 + (i % 3) * 10}px`,
                                animationDelay: `${i * 0.12}s`,
                              }}
                            />
                          ))}
                        </div>
                        <p className="mt-6 text-sm italic text-foreground/65">
                          Preparing your Soul Sound…
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <p className="mx-auto max-w-md text-sm italic text-foreground/60">
                          Your Soul Sound is ready to be composed when you continue.
                        </p>
                        <ContinueDiscoveringButton />
                      </div>
                    )}
                  </div>
                )}

                {sound.kind === "loading" && (
                  <div className="flex flex-col items-center justify-center px-4 py-14 text-center animate-fade-up">
                    {/* Gentle pulsing waveform */}
                    <div
                      className="flex h-16 items-center justify-center gap-1.5"
                      aria-hidden="true"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <span
                          key={i}
                          className="block w-1.5 rounded-full bg-[oklch(0.82_0.13_85)]/70 animate-wave"
                          style={{
                            height: `${20 + (i % 3) * 14}px`,
                            animationDelay: `${i * 0.12}s`,
                          }}
                        />
                      ))}
                    </div>

                    <h3 className="font-display mt-8 text-2xl text-foreground sm:text-3xl">
                      Composing your Soul Sound
                    </h3>
                    <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-foreground/75 sm:text-base">
                      Every Soul Sound is created uniquely for the person who inspired it.
                    </p>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground/65 sm:text-base">
                      We're translating your archetype into rhythm, emotion, and atmosphere.
                    </p>
                    <p className="mt-6 text-xs italic tracking-wide text-muted-foreground">
                      This usually takes about one minute.
                    </p>
                  </div>
                )}

                {sound.kind === "error" && (
                  <div className="text-center py-10">
                    <p className="text-sm text-foreground/70">{sound.message}</p>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="btn-primary mt-6 rounded-full px-8 py-3 text-sm font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {sound.kind === "ready" && (
                  <div className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 sm:p-8 animate-fade-up">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition hover:scale-105"
                      >
                        {isPlaying ? (
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        ) : (
                          <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                      <div className="min-w-0 flex-1 text-center sm:text-left">
                        <p className="font-display text-lg text-foreground">
                          {archetypeName} — Soul Sound
                        </p>
                        <p className="text-sm text-foreground/60">
                          {sound.duration
                            ? `${Math.round(sound.duration)} seconds`
                            : "An original composition inspired by your archetype"}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="btn-ghost rounded-full px-6 py-2 text-sm font-medium"
                        >
                          {downloadMode === "open"
                            ? "Open / Download Soul Sound"
                            : "Download Soul Sound"}
                        </button>
                      </div>
                    </div>
                    <audio
                      ref={audioRef}
                      key={sound.audioUrl}
                      src={sound.audioUrl}
                      loop={false}
                      className="mt-6 w-full"
                      controls
                      onEnded={handleEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    {downloadMode === "open" && (
                      <p className="mt-4 text-center text-xs text-foreground/50">
                        If it opens in a new tab, use your browser's download option.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </article>
          </section>
        </div>

        {/* === THERE'S MORE TO DISCOVER === */}
        <div
          className={`transition-all duration-1000 ease-out ${
            phase >= 7 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <section className="mt-28 sm:mt-36">
            <div className="text-center">
              <p className="font-display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
                There's More to Discover
              </p>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {isPaid
                  ? "Your complete reflection. The deeper dimensions of your archetype, revealed."
                  : "Your archetype is the beginning. These deeper reflections are waiting when you're ready to continue."}
              </p>
            </div>

            {isPaid ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm sm:p-8">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.05] blur-2xl" />
                  <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                    Emotional Blueprint
                  </h3>
                  <p className="font-display relative mt-3 text-lg text-foreground/80">
                    {content.coreEmotion}
                  </p>
                  <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                    {content.soulIdentity}
                  </p>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm sm:p-8">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.55_0.18_305)] opacity-[0.05] blur-2xl" />
                  <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                    Creative Nature
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                    {content.corePurpose}
                  </p>
                  <div className="relative mt-4 flex flex-wrap gap-2">
                    {content.soulKeywords.map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 text-xs text-foreground/70"
                      >
                        {capitalize(k)}
                      </span>
                    ))}
                  </div>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm sm:p-8">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.05] blur-2xl" />
                  <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                    Relationships
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                    How others experience your presence:
                  </p>
                  <p className="relative mt-2 text-sm leading-relaxed text-foreground/80">
                    {content.desiredListenerExperience}
                  </p>
                </article>

                <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm sm:p-8">
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.55_0.18_305)] opacity-[0.05] blur-2xl" />
                  <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                    Growth
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                    Your emotional journey and transformation:
                  </p>
                  <p className="relative mt-2 text-sm leading-relaxed text-foreground/80">
                    {content.emotionalJourney}
                  </p>
                </article>
              </div>
            ) : (
              <>
                <div className="mt-12 grid gap-5 sm:grid-cols-2">
                  <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm transition duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] sm:p-8">
                    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.05] blur-2xl" />
                    <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                      Emotional Blueprint
                    </h3>
                    <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                      A deeper understanding of the emotional patterns that shape your life.
                    </p>
                  </article>

                  <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm transition duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] sm:p-8">
                    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.55_0.18_305)] opacity-[0.05] blur-2xl" />
                    <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                      Creative Nature
                    </h3>
                    <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                      The ways you naturally create, imagine, and bring beauty into the world.
                    </p>
                  </article>

                  <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm transition duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] sm:p-8">
                    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.05] blur-2xl" />
                    <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                      Relationships
                    </h3>
                    <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                      How you naturally build trust, offer care, and connect with others.
                    </p>
                  </article>

                  <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm transition duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] sm:p-8">
                    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.55_0.18_305)] opacity-[0.05] blur-2xl" />
                    <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                      Growth
                    </h3>
                    <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                      The places where your greatest transformation often begins.
                    </p>
                  </article>
                </div>

                <div className="mt-12 text-center">
                  <ContinueDiscoveringButton />
                </div>
              </>
            )}
          </section>
        </div>

      </div>
    </main>
  );
}

function ContinueDiscoveringButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            origin: window.location.origin,
            cancel_path: "/results",
          },
        },
      );
      if (error) throw new Error(error.message);
      if (!data?.url) throw new Error("No checkout URL returned.");
      window.location.href = data.url;
    } catch (err) {
      setError((err as Error).message ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-full border border-foreground/20 bg-foreground/[0.04] px-8 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40 hover:bg-foreground/[0.08] disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Opening checkout…" : "Continue Discovering"}
      </button>
      {error && (
        <p className="text-xs text-foreground/60">{error}</p>
      )}
    </div>
  );
}
