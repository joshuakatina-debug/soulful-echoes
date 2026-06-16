import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Soul Sounds — Discover the music of your inner world" },
      { name: "description", content: "A cinematic 12-question journey to uncover the sound of your soul." },
      { property: "og:title", content: "Soul Sounds" },
      { property: "og:description", content: "Discover the music of your inner world." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="bg-aurora relative min-h-screen overflow-hidden">
      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-[oklch(0.85_0.1_320)] opacity-40 blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.88_0.1_50)] opacity-40 blur-3xl animate-float-slow" style={{ animationDelay: "-6s" }} />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[oklch(0.85_0.08_200)] opacity-40 blur-3xl animate-float-slow" style={{ animationDelay: "-12s" }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-foreground/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
          Soul Sounds
        </div>

        <h1 className="font-display animate-fade-up text-5xl leading-[1.05] text-foreground sm:text-7xl md:text-8xl" style={{ animationDelay: "0.1s" }}>
          The music<br />
          <span className="italic text-primary">of your inner world.</span>
        </h1>

        <p className="animate-fade-up mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl" style={{ animationDelay: "0.25s" }}>
          A quiet, cinematic journey of twelve questions — to uncover the sound,
          texture, and color of your soul.
        </p>

        <div className="animate-fade-up mt-12 flex flex-col items-center gap-4 sm:flex-row" style={{ animationDelay: "0.4s" }}>
          <Link
            to="/quiz"
            className="btn-primary inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-medium"
          >
            Begin the journey
          </Link>
          <span className="text-sm text-muted-foreground">12 questions · about 3 minutes</span>
        </div>

        <div className="animate-fade-up mt-24 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3" style={{ animationDelay: "0.55s" }}>
          {[
            { t: "Soft & Cinematic", d: "Designed to feel like dusk." },
            { t: "Honest Questions", d: "No right or wrong answers." },
            { t: "Your Soul Profile", d: "A sound only you could be." },
          ].map((f) => (
            <div key={t(f.t)} className="glass-card rounded-3xl p-6 text-left">
              <h3 className="font-display text-xl text-foreground">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function t(s: string) { return s; }
