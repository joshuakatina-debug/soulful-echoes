import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { meta } from "@/lib/meta";
import { resetQuizProgress } from "@/lib/quiz-reset";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Soul Sounds — Discover the Sound of Your Soul" },
      {
        name: "description",
        content:
          "Take a one-minute quiz and receive a personalized instrumental piece inspired by your unique spirit.",
      },
      { property: "og:title", content: "Soul Sounds — Discover the Sound of Your Soul" },
      {
        property: "og:description",
        content:
          "A reflective listening experience. Twelve questions, one Soul Archetype, one instrumental composition made for you.",
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
      {/* Ambient orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-[oklch(0.55_0.18_305)] opacity-25 blur-3xl animate-float-slow" />
        <div
          className="absolute top-1/3 -right-40 h-[34rem] w-[34rem] rounded-full bg-[oklch(0.82_0.13_85)] opacity-20 blur-3xl animate-float-slow"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.32_0.1_260)] opacity-35 blur-3xl animate-float-slow"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      <div className="relative z-10">
        <Nav />
        <Hero />
        <HowItWorks />
        <EmotionalPromise />
        <SamplePreview />
        <FAQ />
        <Footer />
      </div>
    </main>
  );
}

function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-primary animate-breathe" />
        <span className="font-display text-xl tracking-wide text-foreground">Soul Sounds</span>
      </div>
      <Link
        to="/quiz"
        className="btn-ghost hidden rounded-full px-5 py-2 text-sm sm:inline-flex"
      >
        Start the Quiz
      </Link>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 pb-28 text-center sm:pt-32">
      <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] text-muted-foreground backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
        A personalized instrumental experience
      </div>

      <h1
        className="font-display animate-fade-up text-5xl leading-[1.05] sm:text-6xl md:text-7xl"
        style={{ animationDelay: "0.1s" }}
      >
        Discover the <span className="text-gradient italic">Sound of Your Soul</span>
      </h1>

      <p
        className="animate-fade-up mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        style={{ animationDelay: "0.22s" }}
      >
        Take a one-minute quiz and receive a personalized instrumental piece
        inspired by your unique spirit.
      </p>

      <div
        className="animate-fade-up mt-12 flex flex-col items-center gap-5"
        style={{ animationDelay: "0.36s" }}
      >
        <Link
          to="/quiz"
          className="btn-primary inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-medium tracking-wide"
        >
          Start the Quiz
        </Link>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground/90">
          No singing. No lyrics. Just a custom instrumental reflection of you.
        </p>
      </div>

      <div className="hairline animate-fade-up mt-24 w-40" style={{ animationDelay: "0.5s" }} />
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Answer 12 simple questions",
      body: "Quiet, honest prompts about how you feel, remember, and dream.",
    },
    {
      n: "02",
      title: "Receive your Soul Archetype",
      body: "A reflection of your inner landscape — its texture, color, and tone.",
    },
    {
      n: "03",
      title: "Hear your personalized Soul Sound",
      body: "A short instrumental composition shaped around who you are.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeader eyebrow="How it works" title="A short, gentle journey." />
      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="glass-card animate-fade-up rounded-3xl p-8"
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}
          >
            <div className="font-display text-3xl text-primary">{s.n}</div>
            <h3 className="font-display mt-4 text-2xl text-foreground">{s.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmotionalPromise() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="font-display animate-fade-up text-3xl leading-snug text-foreground sm:text-4xl">
        “This isn't just AI music. It's a personal listening experience
        designed to feel{" "}
        <span className="text-gradient italic">reflective, meaningful, and uniquely yours.</span>”
      </p>
      <div className="hairline mx-auto mt-12 w-32" />
    </section>
  );
}

function SamplePreview() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeader eyebrow="A glimpse" title="Sample Soul Sound" centered />
      <div className="glass-card-warm animate-fade-up mt-12 rounded-[2rem] p-8 sm:p-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <PlayButton />
          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Preview · coming soon
            </div>
            <h3 className="font-display mt-2 text-2xl text-foreground">
              A reflection in strings & light
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your own composition will be revealed at the end of the quiz.
            </p>
          </div>
        </div>
        <Waveform />
      </div>
    </section>
  );
}

function PlayButton() {
  return (
    <button
      type="button"
      disabled
      aria-label="Sample audio coming soon"
      className="group relative grid h-20 w-20 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-primary disabled:cursor-not-allowed"
    >
      <span className="absolute inset-0 rounded-full bg-primary/10 animate-breathe" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7 translate-x-[2px]">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}

function Waveform() {
  const bars = Array.from({ length: 48 });
  return (
    <div
      aria-hidden
      className="mt-8 flex h-16 items-center justify-between gap-[3px] opacity-70"
    >
      {bars.map((_, i) => (
        <span
          key={i}
          className="block w-[3px] origin-center rounded-full bg-gradient-to-t from-primary/40 to-accent/60 animate-wave"
          style={{
            height: `${20 + Math.sin(i * 0.6) * 22 + Math.cos(i * 0.31) * 14}px`,
            animationDelay: `${(i % 12) * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

function FAQ() {
  const items = [
    {
      q: "How long does it take?",
      a: "About one minute. Twelve short questions, no overthinking required.",
    },
    {
      q: "Is the music instrumental?",
      a: "Yes — entirely instrumental. No vocals, no lyrics. Just texture, mood, and melody.",
    },
    {
      q: "Is this a personality test?",
      a: "It's gentler than that. Think of it as a reflection — a way to translate how you feel inside into sound.",
    },
    {
      q: "Can I share my Soul Sound?",
      a: "Sharing will be available soon, so you can pass your composition to the people who'd love it most.",
    },
  ];

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeader eyebrow="Quiet answers" title="You might be wondering…" centered />
      <div className="mt-12 space-y-3">
        {items.map((it, i) => (
          <FAQItem key={it.q} {...it} defaultOpen={i === 0} />
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <Link
          to="/quiz"
          className="btn-primary inline-flex items-center justify-center rounded-full px-10 py-4 text-base font-medium tracking-wide"
        >
          Start the Quiz
        </Link>
        <span className="text-sm text-muted-foreground">12 questions · about 1 minute</span>
      </div>
    </section>
  );
}

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-lg text-foreground sm:text-xl">{q}</span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 text-primary transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted-foreground">{a}</p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : ""}>
      <div className="text-[11px] uppercase tracking-[0.3em] text-primary/80">{eyebrow}</div>
      <h2 className="font-display mt-3 text-4xl text-foreground sm:text-5xl">{title}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-12 pt-8 text-center">
      <div className="hairline mx-auto mb-8 w-24" />
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Soul Sounds · made to be felt
      </p>
    </footer>
  );
}
