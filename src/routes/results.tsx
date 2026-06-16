import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadSoulResult, type StoredSoulResult } from "@/lib/soul-result";
import { archetypeContent } from "@/data/archetypeContent";

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
  useEffect(() => {
    setResult(loadSoulResult());
  }, []);

  const archetypeId = result?.bestMatch.id ?? null;
  const content = archetypeId ? archetypeContent[archetypeId] : null;

  const archetypeName = result?.bestMatch.displayName ?? "Your Soul Archetype";
  const subtitle = content?.subtitle ?? "A soul waiting to be discovered.";
  const soulIdentity = content?.soulIdentity ?? (
    <>
      A reflection of who you are — open-hearted, curious, attuned to the quiet
      music inside everyday moments. Your full Soul Identity will appear here
      once the composition is complete.
    </>
  );
  const keywords = content?.soulKeywords ?? [
    "Reflective", "Warm", "Cinematic", "Open", "Tender",
  ];
  const coreEmotion = content?.coreEmotion ?? "Quiet Harmony";

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
            {subtitle}
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
            {soulIdentity}
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
            {keywords.map((k) => (
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
            {coreEmotion}
          </p>
        </section>

        {/* Section 5 — Divider + Soul Sound */}
        <section
          className="animate-reveal mt-24 sm:mt-32"
          style={{ animationDelay: "0.95s" }}
        >
          <div className="hairline mb-12" />
          <p className="mb-10 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Your Soul Sound
          </p>

          <div className="glass-card-warm rounded-3xl px-8 py-12 sm:px-12 sm:py-16">
            <AudioPlaceholder />
          </div>
        </section>

        {/* CTAs */}
        <div
          className="animate-reveal mt-20 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          style={{ animationDelay: "1.15s" }}
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
