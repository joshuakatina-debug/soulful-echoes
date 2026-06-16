import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { questions, computeProfile } from "@/lib/quiz-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "The Journey — Soul Sounds" },
      { name: "description", content: "Twelve questions to uncover the music of your soul." },
    ],
  }),
  component: Quiz,
});

function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [done, setDone] = useState(false);

  const total = questions.length;
  const current = questions[step];
  const selected = answers[current?.id];
  const progress = ((step + (selected ? 1 : 0)) / total) * 100;

  const profile = useMemo(() => (done ? computeProfile(answers) : null), [done, answers]);

  function select(value: string) {
    setAnswers((a) => ({ ...a, [current.id]: value }));
  }
  function next() {
    if (step < total - 1) setStep(step + 1);
    else setDone(true);
  }
  function prev() {
    if (step > 0) setStep(step - 1);
  }
  function restart() {
    setAnswers({});
    setStep(0);
    setDone(false);
  }

  return (
    <main className="bg-aurora relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/4 h-96 w-96 rounded-full bg-[oklch(0.88_0.09_320)] opacity-40 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.9_0.08_50)] opacity-40 blur-3xl animate-float-slow" style={{ animationDelay: "-8s" }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link to="/" className="font-display text-xl text-foreground/80 hover:text-foreground transition">
            Soul Sounds
          </Link>
          {!done && (
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {String(step + 1).padStart(2, "0")} <span className="opacity-50">/ {total}</span>
            </span>
          )}
        </header>

        {/* Progress */}
        {!done && (
          <div className="mt-6 h-[2px] w-full overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, backgroundImage: "var(--gradient-primary)" }}
            />
          </div>
        )}

        {/* Body */}
        <div className="flex flex-1 items-center justify-center py-12">
          {!done ? (
            <div key={current.id} className="animate-fade-up w-full">
              <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Question {step + 1}
              </p>
              <h2 className="font-display mt-4 text-center text-4xl leading-tight text-foreground sm:text-5xl">
                {current.question}
              </h2>

              <div className="mt-10 grid gap-3">
                {current.options.map((opt) => {
                  const isSelected = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => select(opt.value)}
                      className={`group glass-card rounded-2xl px-6 py-5 text-left text-base transition-all duration-300 hover:-translate-y-0.5 ${
                        isSelected
                          ? "ring-2 ring-primary/60 shadow-[var(--shadow-glow)]"
                          : ""
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-foreground/30 bg-white/50"
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
          ) : (
            <Results profile={profile!} restart={restart} />
          )}
        </div>

        {/* Footer nav */}
        {!done && (
          <div className="flex items-center justify-between gap-4 pb-4">
            <button
              onClick={prev}
              disabled={step === 0}
              className="btn-ghost inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium"
            >
              ← Previous
            </button>
            <button
              onClick={next}
              disabled={!selected}
              className="btn-primary inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium"
            >
              {step === total - 1 ? "Reveal my sound" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function Results({ profile, restart }: { profile: ReturnType<typeof computeProfile>; restart: () => void }) {
  return (
    <div className="animate-fade-up w-full text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Your soul sounds like</p>
      <h1 className="font-display mt-4 text-5xl leading-tight text-foreground sm:text-6xl">
        <span className="italic text-primary">{profile.name}</span>
      </h1>
      <p className="font-display mt-4 text-2xl text-foreground/80">{profile.tagline}</p>

      <div className="glass-card mx-auto mt-10 max-w-xl rounded-3xl p-8 text-left">
        <p className="text-base leading-relaxed text-foreground/85">{profile.description}</p>

        <div className="mt-6 border-t border-foreground/10 pt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Palette</p>
          <p className="mt-1 text-foreground/80">{profile.palette}</p>
        </div>
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Sonic territory</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {profile.genres.map((g) => (
              <span key={g} className="rounded-full border border-foreground/15 bg-white/40 px-3 py-1 text-sm text-foreground/80">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button onClick={restart} className="btn-ghost rounded-full px-6 py-3 text-sm font-medium">
          Take it again
        </button>
        <Link to="/" className="btn-primary rounded-full px-8 py-3 text-sm font-medium">
          Back to home
        </Link>
      </div>
    </div>
  );
}
