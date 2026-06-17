import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadSoulResult, type StoredSoulResult } from "@/lib/soul-result";
import { archetypeContent } from "@/data/archetypeContent";
import { generateSoundPrompt, type FlavorAnswers } from "@/engine/promptGenerator";
import type { FlavorOption } from "@/data/flavorMappings";
import { supabase } from "@/integrations/supabase/client";

const ANSWERS_STORAGE_KEY = "soul-sounds:answers";
const POLL_INTERVAL_MS = 15_000;
const POLL_TIMEOUT_MS = 2 * 60_000;

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
  return v === "failed" || v === "error" || v === "cancelled" || v === "canceled";
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

function AudioPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        className="flex h-20 w-20 items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 transition hover:bg-foreground/10 hover:scale-105"
        aria-label="Play placeholder"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-foreground/60 ml-1"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <div className="flex items-end gap-1.5 h-8">
        {[35, 55, 25, 70, 45, 80, 30, 60, 40, 75, 50, 35, 65, 45, 85, 55, 40, 70, 30, 60].map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-foreground/20 animate-wave"
            style={{
              height: `${h}%`,
              animationDelay: `${i * 0.08}s`,
              opacity: 0.3 + (i % 3) * 0.15,
            }}
          />
        ))}
      </div>

      <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
        Your personalized instrumental composition will appear here.
      </p>
    </div>
  );
}

function Results() {
  const [result, setResult] = useState<StoredSoulResult | null>(null);
  const [flavorAnswers, setFlavorAnswers] = useState<FlavorAnswers>({});
  const [sound, setSound] = useState<SoundStatus>({ kind: "idle" });
  const pollTimerRef = useRef<number | null>(null);
  const timeoutTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setResult(loadSoulResult());
    setFlavorAnswers(loadFlavorAnswers());
  }, []);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) window.clearInterval(pollTimerRef.current);
      if (timeoutTimerRef.current) window.clearTimeout(timeoutTimerRef.current);
    };
  }, []);

  const archetypeIdForPrompt = result?.bestMatch.id ?? null;
  const promptText = useMemo(() => {
    if (!archetypeIdForPrompt) return "";
    const c = archetypeContent[archetypeIdForPrompt];
    if (!c) return "";
    return generateSoundPrompt(c.promptFoundation, flavorAnswers);
  }, [archetypeIdForPrompt, flavorAnswers]);

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

  async function pollOnce(taskId: string) {
    try {
      const { data, error } = await supabase.functions.invoke("check-soul-sound-status", {
        body: { task_id: taskId },
      });
      if (error) {
        console.error("status invoke error", error);
        return;
      }
      const status = data?.status as string | undefined;
      const audioUrl = data?.audio_url as string | undefined;
      if (audioUrl && (isSuccess(status) || !status)) {
        stopPolling();
        setSound({
          kind: "ready",
          audioUrl,
          imageUrl: data?.image_url ?? null,
          duration: data?.duration ?? null,
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
    setSound({ kind: "loading" });
    try {
      const { data, error } = await supabase.functions.invoke("generate-soul-sound", {
        body: { promptText },
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
      // Kick off polling immediately, then every 15s.
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

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16 sm:py-24">
        {/* Top nav */}
        <nav className="animate-reveal mb-20 flex items-center justify-between">
          <Link
            to="/"
            className="font-display text-lg text-foreground/70 transition hover:text-foreground"
          >
            Soul Sounds
          </Link>
        </nav>

        {/* Section 1 — Reveal */}
        <section className="animate-reveal text-center" style={{ animationDelay: "0.15s" }}>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            You are...
          </p>
          <h1 className="font-display mt-6 text-5xl leading-tight text-gradient sm:text-6xl md:text-7xl">
            {archetypeName}
          </h1>
          <p className="font-display mt-5 text-xl italic text-foreground/60 sm:text-2xl">
            {content.subtitle}
          </p>
        </section>

        {/* Section 2 — Soul Identity */}
        <section
          className="animate-reveal mt-24 sm:mt-32"
          style={{ animationDelay: "0.35s" }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Soul Identity
          </p>
          <p className="font-display text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
            {content.soulIdentity}
          </p>
        </section>

        {/* Section 3 — Soul Keywords */}
        <section
          className="animate-reveal mt-24 sm:mt-32"
          style={{ animationDelay: "0.55s" }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Your Soul Keywords
          </p>
          <div className="flex flex-wrap gap-3">
            {content.soulKeywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-4 py-1.5 text-sm text-foreground/80 backdrop-blur-sm"
              >
                {capitalize(k)}
              </span>
            ))}
          </div>
        </section>

        {/* Section 4 — Core Emotion */}
        <section
          className="animate-reveal mt-24 text-center sm:mt-32"
          style={{ animationDelay: "0.75s" }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Core Emotion
          </p>
          <p className="font-display text-4xl text-gradient sm:text-5xl md:text-6xl">
            {content.coreEmotion}
          </p>
        </section>

        {/* Section 5 — Core Purpose */}
        <section
          className="animate-reveal mt-24 sm:mt-32"
          style={{ animationDelay: "0.85s" }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Core Purpose
          </p>
          <p className="font-display text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
            {content.corePurpose}
          </p>
        </section>

        {/* Section 6 — Emotional Journey */}
        <section
          className="animate-reveal mt-24 sm:mt-32"
          style={{ animationDelay: "0.95s" }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Emotional Journey
          </p>
          <p className="font-display text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
            {content.emotionalJourney}
          </p>
        </section>

        {/* Section 7 — Desired Listener Experience */}
        <section
          className="animate-reveal mt-24 sm:mt-32"
          style={{ animationDelay: "1.05s" }}
        >
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Desired Listener Experience
          </p>
          <p className="font-display text-2xl leading-relaxed text-foreground/90 sm:text-3xl">
            {content.desiredListenerExperience}
          </p>
        </section>

        {/* Section 8 — Divider + Soul Sound */}
        <section
          className="animate-reveal mt-24 sm:mt-32"
          style={{ animationDelay: "1.15s" }}
        >
          <div className="hairline mb-12" />
          <p className="mb-10 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Your Soul Sound
          </p>

          <div className="glass-card-warm rounded-3xl px-8 py-12 sm:px-12 sm:py-16">
            {sound.kind === "idle" && (
              <div className="flex flex-col items-center gap-6 text-center">
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  Generate the instrumental composition shaped by your soul.
                </p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!promptText}
                  className="btn-primary rounded-full px-8 py-3 text-sm font-medium disabled:opacity-50"
                >
                  Generate My Soul Sound
                </button>
              </div>
            )}

            {sound.kind === "loading" && (
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex items-end gap-1.5 h-8">
                  {[35, 55, 25, 70, 45, 80, 30, 60, 40, 75, 50, 35, 65, 45, 85, 55, 40, 70, 30, 60].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-foreground/30 animate-wave"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.08}s`,
                        opacity: 0.3 + (i % 3) * 0.15,
                      }}
                    />
                  ))}
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                  Composing your Soul Sound. This usually takes 30–90 seconds.
                </p>
              </div>
            )}

            {sound.kind === "ready" && (
              <div className="flex flex-col items-center gap-6">
                {sound.imageUrl && (
                  <img
                    src={sound.imageUrl}
                    alt="Soul Sound cover"
                    className="h-32 w-32 rounded-2xl object-cover shadow-lg"
                  />
                )}
                <audio
                  controls
                  src={sound.audioUrl}
                  className="w-full max-w-md"
                  preload="metadata"
                >
                  Your browser does not support the audio element.
                </audio>
                {sound.duration ? (
                  <p className="text-xs text-muted-foreground">
                    {Math.round(sound.duration)}s
                  </p>
                ) : null}
              </div>
            )}

            {sound.kind === "error" && (
              <div className="flex flex-col items-center gap-6 text-center">
                <p className="max-w-sm text-sm leading-relaxed text-foreground/80">
                  {sound.message}
                </p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="btn-primary rounded-full px-8 py-3 text-sm font-medium"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Section 9 — Music Prompt Preview (collapsible) */}
        {promptText && (
          <section
            className="animate-reveal mt-16 sm:mt-20"
            style={{ animationDelay: "1.25s" }}
          >
            <details className="group rounded-2xl border border-foreground/10 bg-foreground/[0.02] px-6 py-5 backdrop-blur-sm transition open:bg-foreground/[0.04] sm:px-8 sm:py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Music Prompt Preview
                </span>
                <span className="text-foreground/40 transition group-open:rotate-180">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </summary>
              <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/75 sm:text-base">
                {promptText}
              </p>
            </details>
          </section>
        )}



        {/* CTAs */}
        <div
          className="animate-reveal mt-20 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          style={{ animationDelay: "1.35s" }}
        >
          <Link
            to="/quiz"
            className="btn-ghost rounded-full px-6 py-3 text-sm font-medium"
          >
            Take the journey again
          </Link>
          <Link
            to="/"
            className="btn-primary rounded-full px-8 py-3 text-sm font-medium"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
