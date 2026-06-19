import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { meta } from "@/lib/meta";
import { resetQuizProgress } from "@/lib/quiz-reset";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Soul Sounds — Discover your Soul Sound" },
      {
        name: "description",
        content:
          "Discover your Soul Sound. A cinematic, personal listening experience — it's already within you.",
      },
      { property: "og:title", content: "Soul Sounds — Discover your Soul Sound" },
      {
        property: "og:description",
        content: "It's already within you. Begin your discovery.",
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
        <CuriosityLine text="What does your inner world sound like?" />
        <Journey />
        <CuriosityLine
          text={
            <>
              Some discoveries can't be explained.
              <br />
              Only experienced.
            </>
          }
        />
        <Reactions />
        <CuriosityLine
          text={
            <>
              The music isn't created.
              <br />
              It's uncovered.
            </>
          }
        />
        <FAQ />
        <Footer />
      </div>

      <FloatingCTA />
    </main>
  );
}

/* ---------- Ambient cinematic backdrop ---------- */

function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {/* Slow drifting light orbs */}
      <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-[oklch(0.55_0.18_305)] opacity-25 blur-3xl animate-float-slow" />
      <div
        className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full bg-[oklch(0.82_0.13_85)] opacity-20 blur-3xl animate-float-slow"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.32_0.1_260)] opacity-40 blur-3xl animate-float-slow"
        style={{ animationDelay: "-12s" }}
      />

      {/* Subtle particles */}
      <Particles />

      {/* Soft vignette */}
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

/* ---------- Nav ---------- */

function Nav() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-6 sm:pt-8">
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-primary animate-breathe" />
        <span className="font-display text-lg tracking-wide text-foreground sm:text-xl">
          Soul Sounds
        </span>
      </div>
    </header>
  );
}

/* ---------- Hero (full-screen, cinematic) ---------- */

function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[100svh] max-w-3xl flex-col items-center justify-center px-6 pb-24 pt-4 text-center -mt-16">
      <div
        className="animate-fade-up text-[11px] uppercase tracking-[0.4em] text-primary/80"
        style={{ animationDelay: "0.05s" }}
      >
        Soul Sounds
      </div>

      <h1
        className="font-display animate-fade-up mt-6 text-5xl leading-[1.05] sm:text-6xl md:text-7xl"
        style={{ animationDelay: "0.2s" }}
      >
        Discover your <span className="text-gradient italic">Soul Sound.</span>
      </h1>

      <p
        className="animate-fade-up mt-6 text-lg text-muted-foreground sm:text-xl"
        style={{ animationDelay: "0.4s" }}
      >
        It's already within you.
      </p>

      <div
        className="animate-fade-up mt-10 flex flex-col items-center gap-5"
        style={{ animationDelay: "0.6s" }}
      >
        <GlowButton />
        <Chips />
      </div>

      {/* Scroll cue */}
      <div
        className="animate-fade-up absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animationDelay: "1s" }}
      >
        <svg
          className="h-5 w-5 animate-bounce text-muted-foreground/50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}

function GlowButton({ size = "lg" }: { size?: "lg" | "md" }) {
  const pad =
    size === "lg"
      ? "px-12 py-5 text-base sm:text-lg"
      : "px-7 py-3 text-sm";
  return (
    <Link
      to="/quiz"
      onClick={() => resetQuizProgress()}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium tracking-wide ${pad}`}
    >
      {/* Glow halo */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/40 blur-xl opacity-60 transition-opacity duration-500 group-hover:opacity-100 animate-breathe"
      />
      {/* Button face */}
      <span className="btn-primary relative inline-flex items-center justify-center rounded-full px-[inherit] py-[inherit] transition-transform duration-500 group-hover:scale-[1.03]">
        Begin Your Discovery
      </span>
    </Link>
  );
}

function Chips() {
  const chips = [
    { icon: "⏱", label: "3 min" },
    { icon: "🎧", label: "Personalized" },
    { icon: "✨", label: "Free" },
  ];
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground/90 sm:text-sm">
      {chips.map((c) => (
        <span
          key={c.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm"
        >
          <span aria-hidden>{c.icon}</span>
          <span>{c.label}</span>
        </span>
      ))}
    </div>
  );
}

/* ---------- Curiosity Line ---------- */

function CuriosityLine({ text }: { text: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl px-6 py-28 text-center sm:py-36">
      <p className="font-display animate-fade-up text-3xl leading-snug text-foreground sm:text-4xl md:text-5xl">
        <span className="text-gradient italic">{text}</span>
      </p>
      <div className="hairline mx-auto mt-10 w-24" />
    </section>
  );
}

/* ---------- Journey timeline ---------- */

function Journey() {
  const steps = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
          <path strokeLinecap="round" d="M4 7h16M4 12h10M4 17h16" />
        </svg>
      ),
      title: "Answer a few questions",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      ),
      title: "Discover your Soul Archetype",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-6 w-6">
          <path strokeLinecap="round" d="M9 18V6l10-2v12" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      ),
      title: "Hear your Soul Sound",
    },
  ];

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <div className="flex flex-col items-center gap-10">
        {steps.map((s, i) => (
          <div key={s.title} className="flex w-full flex-col items-center gap-10">
            <div
              className="animate-fade-up flex flex-col items-center gap-4 text-center"
              style={{ animationDelay: `${0.1 + i * 0.15}s` }}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-primary backdrop-blur-sm">
                {s.icon}
              </div>
              <div className="font-display text-xl text-foreground sm:text-2xl">{s.title}</div>
            </div>
            {i < steps.length - 1 && (
              <div
                aria-hidden
                className="h-16 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Emotional reactions ---------- */

function Reactions() {
  const items = [
    "I wasn't expecting to cry.",
    "It felt incredibly personal.",
    "I listened three times.",
    "I've never experienced anything like this.",
  ];
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((q, i) => (
          <blockquote
            key={q}
            className="glass-card animate-fade-up rounded-2xl p-6 text-center"
            style={{ animationDelay: `${0.1 + i * 0.1}s` }}
          >
            <p className="font-display text-lg italic text-foreground/90 sm:text-xl">
              “{q}”
            </p>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ (kept minimal) ---------- */

function FAQ() {
  const items = [
    {
      q: "How long does it take?",
      a: "About three minutes. A few quiet questions, no overthinking required.",
    },
    {
      q: "Is the music instrumental?",
      a: "Yes — entirely instrumental. No vocals, no lyrics. Just texture, mood, and melody.",
    },
    {
      q: "Is this a personality test?",
      a: "It's gentler than that. A reflection — a way to translate how you feel inside into sound.",
    },
  ];

  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <div className="space-y-3">
        {items.map((it, i) => (
          <FAQItem key={it.q} {...it} defaultOpen={i === 0} />
        ))}
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
        <span className="font-display text-base text-foreground sm:text-lg">{q}</span>
        <span
          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-primary transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
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

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="mx-auto max-w-3xl px-6 pb-32 pt-8 text-center">
      <div className="font-display text-2xl text-foreground sm:text-3xl">
        Step inside the experience.
      </div>
      <div className="mt-8 flex justify-center">
        <GlowButton />
      </div>
    </footer>
  );
}

/* ---------- Persistent floating CTA ---------- */

function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto">
        <Link
          to="/quiz"
          onClick={() => resetQuizProgress()}
          className="btn-primary inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium tracking-wide shadow-lg sm:text-base"
        >
          Begin Your Discovery
        </Link>
      </div>
    </div>
  );
}
