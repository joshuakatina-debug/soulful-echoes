import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { questions } from "@/lib/quiz-data";
import { analytics } from "@/lib/analytics";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "The Journey — Soul Sounds" },
      { name: "description", content: "Twelve questions to uncover the music of your soul." },
    ],
  }),
  component: Quiz,
});

const STORAGE_KEY = "soul-sounds:answers";
const STEP_KEY = "soul-sounds:step";

function Quiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [transitioning, setTransitioning] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const a = localStorage.getItem(STORAGE_KEY);
      const s = localStorage.getItem(STEP_KEY);
      if (a) setAnswers(JSON.parse(a));
      if (s) setStep(Math.min(Math.max(parseInt(s, 10) || 0, 0), questions.length - 1));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      localStorage.setItem(STEP_KEY, String(step));
    } catch {}
  }, [answers, step, hydrated]);

  // Fire quiz_started once when Question 1 is displayed.
  useEffect(() => {
    if (!hydrated) return;
    if (step !== 0) return;
    analytics.quizStarted();
  }, [hydrated, step]);

  const total = questions.length;
  const current = questions[step];
  const selected = answers[current.id];

  function select(value: string) {
    if (step === 0) analytics.quizStarted();
    setAnswers((a) => ({ ...a, [current.id]: value }));
    // Fire progress per answered question (deduped per question_number).
    analytics.quizProgress({
      questionNumber: step + 1,
      totalQuestions: total,
    });
  }


  function go(delta: number) {
    if (transitioning) return;
    const nextStep = step + delta;
    if (nextStep < 0) return;
    if (nextStep >= total) {
      navigate({ to: "/calculating" });
      return;
    }
    setTransitioning(true);
    setTimeout(() => {
      setStep(nextStep);
      setTransitioning(false);
    }, 280);
  }

  return (
    <main className="bg-night relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.55_0.18_305)] opacity-25 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-[oklch(0.45_0.14_30)] opacity-20 blur-3xl animate-float-slow" style={{ animationDelay: "-9s" }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-8 sm:py-12">
        <header className="flex items-center justify-between">
          <Link to="/" className="font-display text-lg text-foreground/70 hover:text-foreground transition">
            Soul Sounds
          </Link>
        </header>

        {/* Immersive progress */}
        <div className="mt-10 text-center">
          <p className="font-display text-xl text-foreground/80 sm:text-2xl">Discovering Your Soul</p>
          <p className="mt-3 text-sm italic text-foreground/55">
            Don't overthink it — choose what feels most like you.
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {Array.from({ length: total }).map((_, i) => {
              const filled = i < step || (i === step && !!selected);
              const active = i === step;
              return (
                <span
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-700 ease-out ${
                    active ? "w-8" : "w-5"
                  }`}
                  style={{
                    background: filled
                      ? "var(--gradient-primary)"
                      : "oklch(1 0 0 / 0.12)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="flex flex-1 items-center justify-center py-10">
          <div
            key={current.id}
            className={`w-full transition-all duration-300 ease-out ${
              transitioning ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
            }`}
          >
            <div className="glass-card rounded-3xl p-8 sm:p-12">
              <p className="text-center text-xs uppercase tracking-[0.3em] text-foreground/50">
                {current.category}
              </p>
              <h2 className="mt-4 font-display text-center text-3xl leading-tight text-foreground sm:text-4xl">
                {current.question}
              </h2>
              {current.subtitle && (
                <p className="mt-3 text-center text-sm text-muted-foreground">{current.subtitle}</p>
              )}

              <div className="mt-10 grid gap-3">
                {current.options.map((opt) => {
                  const isSelected = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => select(opt.value)}
                      className={`group relative overflow-hidden rounded-2xl border px-6 py-5 text-left text-base transition-all duration-300 ${
                        isSelected
                          ? "border-primary/60 bg-[oklch(0.82_0.13_85/0.08)] shadow-[var(--shadow-glow)]"
                          : "border-foreground/10 bg-[oklch(1_0_0/0.03)] hover:border-foreground/25 hover:bg-[oklch(1_0_0/0.06)] hover:-translate-y-0.5"
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                            isSelected ? "border-primary bg-primary" : "border-foreground/30"
                          }`}
                        >
                          {isSelected && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
                        </span>
                        <span className="text-foreground/90">{opt.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center justify-between gap-4 pb-2">
          <button
            onClick={() => go(-1)}
            disabled={step === 0}
            className="btn-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium"
          >
            ← Previous
          </button>
          <button
            onClick={() => go(1)}
            disabled={!selected}
            className="btn-primary inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium"
          >
            {step === total - 1 ? "Reveal my sound" : "Next →"}
          </button>
        </div>
      </div>
    </main>
  );
}
