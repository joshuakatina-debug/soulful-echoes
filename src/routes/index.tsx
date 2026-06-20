import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, ReactNode } from "react";
import { meta } from "@/lib/meta";
import { resetQuizProgress } from "@/lib/quiz-reset";
import { analytics } from "@/lib/analytics";

function handleBeginDiscoveryClick(buttonText: string) {
  resetQuizProgress();
  analytics.beginDiscovery({ buttonText });
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your personality already has a sound." },
      {
        name: "description",
        content:
          "Answer 12 simple questions to discover the music that sounds most like you.",
      },
      {
        property: "og:title",
        content: "Your personality already has a sound.",
      },
      {
        property: "og:description",
        content: "Answer 12 simple questions to discover the music that sounds most like you.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  useEffect(() => {
    meta.viewContent({ contentName: "landing", contentCategory: "landing" });
  }, []);
  return (
    <main className="bg-night relative min-h-screen overflow-hidden">
      <AmbientBackdrop />

      <div className="relative z-10">
        <Nav />
        <Hero />
        <ReactionsStrip />
        <Tease text={<>Some things can't be explained.<br />Only heard.</>} />
        <Journey />
        <FinalCTA />
      </div>

      <FloatingCTA />
    </main>
  );
}

/* ---------- Ambient cinematic backdrop ---------- */

function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-[oklch(0.55_0.18_305)] opacity-25 blur-3xl animate-float-slow" />
      <div
        className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full bg-[oklch(0.82_0.13_85)] opacity-20 blur-3xl animate-float-slow"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.32_0.1_260)] opacity-40 blur-3xl animate-float-slow"
        style={{ animationDelay: "-12s" }}
      />
      <Particles />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}

function Particles() {
  const dots = Array.from({ length: 28 });
  return (
    <div className="absolute inset-0">
      {dots.map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const size = 1 + ((i * 7) % 3);
        const delay = (i % 10) * -1.3;
        const dur = 8 + (i % 6);
        return (
          <span
            key={i}
            className="absolute block rounded-full bg-white/40 animate-breathe"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.15 + (i % 5) * 0.06,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
              filter: "blur(0.4px)",
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------- Nav (tiny, doesn't compete) ---------- */

function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-4 sm:pt-5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
        <span className="font-display text-sm tracking-wide text-foreground/80 sm:text-base">
          Soul Sounds
        </span>
      </div>
    </header>
  );
}

/* ---------- Hero (compressed, reward-focused) ---------- */

function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-2xl flex-col items-center justify-center px-6 pb-6 pt-2 text-center">
      <h1
        className="font-display animate-fade-up text-[2.25rem] leading-[1.05] sm:text-5xl md:text-6xl"
        style={{ animationDelay: "0.1s" }}
      >
        Your personality already has a{" "}
        <span className="text-gradient italic">sound</span>.
      </h1>

      <p
        className="animate-fade-up mt-3 max-w-md text-base text-muted-foreground sm:text-lg"
        style={{ animationDelay: "0.3s" }}
      >
        Answer 12 simple questions to discover the music that sounds most like you.
      </p>

      <div
        className="animate-fade-up mt-5 flex w-full max-w-sm flex-col items-center gap-3 sm:mt-6"
        style={{ animationDelay: "0.5s" }}
      >
        <Payoff />
        <BigCTA label="Discover My Soul Sound" source="hero" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <ReassuranceChip>Free</ReassuranceChip>
          <ReassuranceChip>3 Minutes</ReassuranceChip>
          <ReassuranceChip>Instant Results</ReassuranceChip>
        </div>
      </div>
    </section>
  );
}

/* ---------- Big primary CTA (alive, premium) ---------- */

function BigCTA({
  label,
  source,
  size = "lg",
}: {
  label: string;
  source: string;
  size?: "lg" | "md";
}) {
  const pad =
    size === "lg"
      ? "px-8 py-5 text-lg sm:px-14 sm:py-5 sm:text-xl"
      : "px-8 py-3.5 text-sm sm:text-base";
  return (
    <Link
      to="/quiz"
      onClick={() => handleBeginDiscoveryClick(`${label} (${source})`)}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold tracking-wide whitespace-nowrap"
    >
      {/* ambient glow layers (behind the button) */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/50 blur-2xl opacity-70 transition-opacity duration-500 group-hover:opacity-100 animate-breathe"
      />
      <span
        aria-hidden
        className="absolute inset-[-25%] rounded-full bg-primary/20 blur-3xl opacity-60 animate-breathe"
        style={{ animationDelay: "-3s" }}
      />
      <span
        className={`btn-primary relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full transition-transform duration-500 group-hover:scale-[1.03] ${pad}`}
      >
        {label}
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
        </svg>
        {/* gentle shimmer */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent bg-[length:200%_100%] opacity-60 animate-[shimmer_4s_ease-in-out_infinite]"
        />
      </span>
    </Link>
  );
}

/* ---------- Reactions strip (tight, no big padding) ---------- */

function ReactionsStrip() {
  const items = [
    "I wasn't expecting to cry.",
    "It felt incredibly personal.",
    "I listened three times.",
    "I've never heard anything like this.",
  ];
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((q, i) => (
          <blockquote
            key={q}
            className="glass-card animate-fade-up rounded-2xl px-5 py-4 text-center"
            style={{ animationDelay: `${0.05 + i * 0.08}s` }}
          >
            <p className="font-display text-base italic text-foreground/90 sm:text-lg">
              "{q}"
            </p>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

/* ---------- Tease line (small, not a big pause) ---------- */

function Tease({ text }: { text: ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-10 text-center sm:py-14">
      <p className="font-display animate-fade-up text-2xl leading-snug text-foreground sm:text-3xl md:text-4xl">
        <span className="text-gradient italic">{text}</span>
      </p>
    </section>
  );
}

/* ---------- Journey (compact, horizontal on desktop) ---------- */

function Journey() {
  const steps = [
    { n: "1", t: "Answer a few quiet questions" },
    { n: "2", t: "Discover your Soul Archetype" },
    { n: "3", t: "Hear what you sound like" },
  ];
  return (
    <section className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="glass-card animate-fade-up flex items-center gap-4 rounded-2xl p-4 sm:flex-col sm:gap-3 sm:p-6 sm:text-center"
            style={{ animationDelay: `${0.05 + i * 0.08}s` }}
          >
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] font-display text-primary">
              {s.n}
            </div>
            <div className="font-display text-base text-foreground sm:text-lg">
              {s.t}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Final CTA (close the loop) ---------- */

function FinalCTA() {
  return (
    <section className="mx-auto max-w-2xl px-6 pb-32 pt-6 text-center sm:pt-10">
      <p className="font-display text-2xl leading-tight text-foreground sm:text-4xl">
        Your sound is already within you.
      </p>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">
        It only takes three minutes to hear it.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <BigCTA label="Discover My Soul Sound" source="footer" />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <ReassuranceChip>Free</ReassuranceChip>
          <ReassuranceChip>3 Minutes</ReassuranceChip>
          <ReassuranceChip>Instant Results</ReassuranceChip>
        </div>
      </div>
    </section>
  );
}

/* ---------- Persistent floating CTA ---------- */

function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto">
        <Link
          to="/quiz"
          onClick={() => handleBeginDiscoveryClick("Discover My Soul Sound (floating)")}
          className="btn-primary inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap px-6 py-3 text-sm font-semibold tracking-wide shadow-2xl sm:px-8 sm:py-3.5 sm:text-base"
        >
          Discover My Soul Sound
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ---------- Payoff preview (above CTA) ---------- */

function Payoff() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center backdrop-blur-sm">
      <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground/80">
        In the next 3 minutes you’ll discover:
      </p>
      <ul className="flex flex-col items-center gap-0.5 text-sm text-foreground/90 sm:flex-row sm:justify-center sm:gap-4">
        <li className="flex items-center gap-1.5">
          <span aria-hidden>✨</span>
          Your Soul Archetype
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden>🧠</span>
          Your Core Identity
        </li>
        <li className="flex items-center gap-1.5">
          <span aria-hidden>🎼</span>
          Your unique Soul Sound
        </li>
      </ul>
    </div>
  );
}

/* ---------- Premium reassurance chips ---------- */

function ReassuranceChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium tracking-wide text-foreground/80">
      <svg
        className="h-3 w-3 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
      </svg>
      {children}
    </span>
  );
}
