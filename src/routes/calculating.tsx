import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { questions } from "@/lib/quiz-data";
import { computeSoulResult, saveSoulResult } from "@/lib/soul-result";

export const Route = createFileRoute("/calculating")({
  head: () => ({
    meta: [
      { title: "We noticed a pattern — Soul Sounds" },
    ],
  }),
  component: Calculating,
});

function Calculating() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Compute & persist the Soul result from stored quiz answers.
    try {
      const raw = localStorage.getItem("soul-sounds:answers");
      const answers: Record<number, string> = raw ? JSON.parse(raw) : {};
      const categoryLookup: Record<number, string> = Object.fromEntries(
        questions.map((q) => [q.id, q.category]),
      );
      const result = computeSoulResult(answers, categoryLookup);
      if (result) saveSoulResult(result);
    } catch {
      /* ignore — results page will fall back to placeholder */
    }

    // Allow a brief, intentional pause before showing the button.
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  function handleReveal() {
    setLeaving(true);
    setTimeout(() => navigate({ to: "/results" }), 600);
  }

  return (
    <main className={`bg-night relative flex min-h-screen items-center justify-center overflow-hidden px-6 transition-opacity duration-[600ms] ease-out ${leaving ? "opacity-0" : "opacity-100"}`}>
      {/* Warm ambient glow — two soft, slow-moving orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-[45%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.08] blur-3xl animate-breathe"
        />
        <div
          className="absolute left-[60%] top-[55%] h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.55_0.18_305)] opacity-[0.06] blur-3xl animate-breathe"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-xl text-center">
        {/* Subtle pulse indicator */}
        <div className="mb-12 flex justify-center">
          <div className="relative h-3 w-3">
            <div className="absolute inset-0 rounded-full bg-[oklch(0.82_0.13_85)] opacity-60 animate-breathe" />
            <div
              className="absolute -inset-2 rounded-full border border-[oklch(0.82_0.13_85/0.25)] animate-breathe"
              style={{ animationDelay: "-1.5s" }}
            />
          </div>
        </div>

        <h1
          className={`font-display text-4xl leading-tight text-foreground transition-all duration-1000 sm:text-5xl ${
            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          We noticed a pattern.
        </h1>

        <p
          className={`mt-8 text-base leading-relaxed text-muted-foreground transition-all duration-1000 delay-200 sm:text-lg ${
            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Your responses formed a clear shape — a way you move through the world, connect with others, and carry what’s inside you.
          <br className="hidden sm:block" />{" "}
          Now we’ll give that pattern a name.
        </p>

        <div
          className={`mt-14 transition-all duration-700 delay-500 ${
            ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <button
            type="button"
            onClick={handleReveal}
            className="btn-primary inline-flex items-center gap-3 rounded-full px-10 py-4 text-sm font-medium tracking-wide"
          >
            Reveal My Archetype
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-80"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
}
