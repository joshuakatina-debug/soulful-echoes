import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadSoulResult, type StoredSoulResult } from "@/lib/soul-result";
import { archetypeContent } from "@/data/archetypeContent";
import { generateSoundPrompt, generateShortMusicPrompt, type FlavorAnswers } from "@/engine/promptGenerator";
import type { FlavorOption } from "@/data/flavorMappings";
import { supabase } from "@/integrations/supabase/client";

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
  return v === "complete" || v === "completed" || v === "success" || v === "succeeded" || v === "finished";
}

function isFailure(s?: string | null) {
  if (!s) return false;
  const v = s.toLowerCase();
  return v === "failed" || v === "error" || v === "rejected" || v === "cancelled" || v === "canceled";
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

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [{ title: "Your Soul Is Ready — Soul Sounds" }],
  }),
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloadMode, setDownloadMode] = useState<"download" | "open">("download");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const timeoutTimerRef = useRef<number | null>(null);


  useEffect(() => {
    setResult(loadSoulResult());
    setFlavorAnswers(loadFlavorAnswers());
    const t = setTimeout(() => setResultReady(true), 250);
    return () => clearTimeout(t);
  }, []);


  useEffect(() => {
    return () => {
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
      if (timeoutTimerRef.current) window.clearTimeout(timeoutTimerRef.current);
    };
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


  async function pollOnce(taskId: string) {
    try {
      const { data, error } = await supabase.functions.invoke("check-soul-sound-status", {
        body: { task_id: taskId },
      });
      if (error) {
        console.error("status invoke error", error);
        return;
      }
      const status = (data?.status as string | undefined) ?? null;
      const audioUrl = (data?.audioUrl as string | undefined) ?? null;
      if (audioUrl) {
        stopPolling();
        setSound({
          kind: "ready",
          audioUrl,
          imageUrl: data?.imageUrl ?? null,
          duration: data?.duration ? Number(data.duration) : null,
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

  async function handleGenerate() {
    if (!promptText) return;
    setDownloadMode("download");
    setSound({ kind: "loading" });


    try {
      console.log(`Short MusicAPI prompt length: ${shortPrompt.length}`);
      const { data, error } = await supabase.functions.invoke("generate-soul-sound", {
        body: { promptText, shortPrompt },
      });
      if (error || !data?.task_id) {
        console.error("generate invoke error", error, data);
        setSound({
          kind: "error",
          message: "Your Soul Sound needs a little more time. Please try again.",
        });
        return;
      }
      const taskId: string = data.task_id;

      void pollOnce(taskId);
      pollTimerRef.current = window.setInterval(() => pollOnce(taskId), POLL_INTERVAL_MS);
      timeoutTimerRef.current = window.setTimeout(() => {
        stopPolling();
        setSound((prev) =>
          prev.kind === "ready"
            ? prev
            : { kind: "error", message: "Your Soul Sound needs a little more time. Please try again." },
        );
      }, POLL_TIMEOUT_MS);
    } catch (e) {
      console.error("generate error", e);
      setSound({
        kind: "error",
        message: "Your Soul Sound needs a little more time. Please try again.",
      });
    }
  }

  const archetypeId = result?.bestMatch.id ?? null;
  const content = archetypeId ? archetypeContent[archetypeId] : null;

  if (!resultReady) {
    return (
      <main className="bg-night relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.82_0.13_85)] opacity-15 blur-3xl animate-float-slow" />
          <div
            className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.55_0.18_305)] opacity-20 blur-3xl animate-float-slow"
            style={{ animationDelay: "-7s" }}
          />
        </div>
      </main>
    );
  }

  if (!result || !content) {
    return (
      <main className="bg-night relative min-h-screen overflow-hidden">
        <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="font-display text-2xl text-foreground/80">
            Your soul result is not ready yet.
          </p>
          <Link
            to="/quiz"
            className="btn-primary mt-8 inline-block rounded-full px-8 py-3 text-sm font-medium"
          >
            Take the quiz
          </Link>
        </div>
      </main>
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
              <div className="mx-auto mt-6 max-w-xl space-y-1 text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>Some parts of us reveal themselves immediately.</p>
                <p>Others become clearer as we continue looking.</p>
                <p>Your archetype is only the beginning.</p>
              </div>
            </div>

            <div className="mt-16 sm:mt-20 grid gap-5 sm:grid-cols-2">
              {/* Emotional Blueprint */}
              <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm transition duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] sm:p-8">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.05] blur-2xl" />
                <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                  Emotional Blueprint
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                  A deeper understanding of the emotional patterns that shape your life.
                </p>
              </article>

              {/* Creative Nature */}
              <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm transition duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] sm:p-8">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.55_0.18_305)] opacity-[0.05] blur-2xl" />
                <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                  Creative Nature
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                  The ways you naturally create, imagine, and bring beauty into the world.
                </p>
              </article>

              {/* Relationships */}
              <article className="group relative overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm transition duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] sm:p-8">
                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.05] blur-2xl" />
                <h3 className="font-display relative text-xl text-foreground/90 sm:text-2xl">
                  Relationships
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-foreground/70">
                  How you naturally build trust, offer care, and connect with others.
                </p>
              </article>

              {/* Growth */}
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


            {/* Soul Sound */}
            <article className="group relative mt-5 overflow-hidden rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 backdrop-blur-sm transition duration-500 hover:border-foreground/[0.12] hover:bg-foreground/[0.04] sm:p-8">
              <h3 className="font-display text-xl text-foreground/80 sm:text-2xl">
                Soul Sound
              </h3>
              <div className="mt-5 flex items-center gap-5">
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-foreground/[0.10] via-foreground/[0.05] to-foreground/[0.02] blur-[2px]" />
                <div className="min-w-0 flex-1">
                  <div className="flex h-10 items-end gap-1 blur-[1px]">
                    {[35, 55, 25, 70, 45, 80, 30, 60, 40, 75, 50, 35, 65, 45, 85, 55, 40, 70, 30, 60].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-foreground/20"
                        style={{ height: `${h}%`, opacity: 0.3 + (i % 3) * 0.15 }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-foreground/40 blur-[0.5px]">Your Soul Sound</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground/40 opacity-70 transition duration-500 group-hover:opacity-100">
                  <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground/45 blur-[0.5px]">
                An original piece of music inspired by the rhythm of your journey.
              </p>
            </article>

            <div className="mt-16 text-center sm:mt-20">
              <button
                type="button"
                className="btn-primary rounded-full px-8 py-3 text-sm font-medium"
              >
                Continue Discovering
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
