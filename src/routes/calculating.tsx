import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { questions } from "@/lib/quiz-data";
import { computeSoulResult, saveSoulResult } from "@/lib/soul-result";

export const Route = createFileRoute("/calculating")({
  head: () => ({
    meta: [
      { title: "Discovering Your Soul — Soul Sounds" },
    ],
  }),
  component: Calculating,
});

const MESSAGES = [
  "Listening to your responses...",
  "Discovering your archetype...",
  "Understanding your spirit...",
  "Composing your Soul Sound...",
];

function Calculating() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

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

    const i = setInterval(() => setIdx((n) => (n + 1) % MESSAGES.length), 2200);
    const t = setTimeout(() => navigate({ to: "/results" }), 8400);
    return () => {
      clearInterval(i);
      clearTimeout(t);
    };
  }, [navigate]);

  return (
    <main className="bg-night relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.55_0.18_305)] opacity-20 blur-3xl animate-breathe" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Glowing orb */}
        <div className="relative h-44 w-44">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,oklch(0.95_0.08_85),oklch(0.72_0.16_55)_45%,oklch(0.4_0.16_305)_85%)] shadow-[0_0_120px_oklch(0.82_0.13_85/0.5)] animate-breathe" />
          <div className="absolute inset-0 rounded-full ring-1 ring-[oklch(1_0_0/0.15)]" />
          <div
            className="absolute -inset-6 rounded-full border border-[oklch(0.82_0.13_85/0.2)] animate-breathe"
            style={{ animationDelay: "-2s" }}
          />
          <div
            className="absolute -inset-12 rounded-full border border-[oklch(0.55_0.18_305/0.2)] animate-breathe"
            style={{ animationDelay: "-4s" }}
          />
        </div>

        <h1 className="font-display mt-14 text-3xl text-foreground sm:text-4xl">
          Discovering Your Soul<span className="opacity-60">...</span>
        </h1>

        <div className="mt-6 h-6 text-sm tracking-wide text-muted-foreground sm:text-base">
          <span key={idx} className="animate-fade-up inline-block">
            {MESSAGES[idx]}
          </span>
        </div>
      </div>
    </main>
  );
}
