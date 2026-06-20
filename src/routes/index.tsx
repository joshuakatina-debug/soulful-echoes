import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, ReactNode } from "react";
import { meta } from "@/lib/meta";
import { resetQuizProgress } from "@/lib/quiz-reset";
import { analytics } from "@/lib/analytics";
import closeup from "@/assets/photos/closeup.jpg.asset.json";
import subway from "@/assets/photos/subway.jpg.asset.json";
import listening from "@/assets/photos/listening.jpg.asset.json";
import rooftop from "@/assets/photos/rooftop.jpg.asset.json";
import records from "@/assets/photos/records.jpg.asset.json";
import cassette from "@/assets/photos/cassette.jpg.asset.json";

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
          "A quiet three-minute experience to hear what your personality sounds like.",
      },
      { property: "og:title", content: "Your personality already has a sound." },
      {
        property: "og:description",
        content: "A quiet three-minute experience to hear what your personality sounds like.",
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
    <main className="bg-paper relative min-h-screen overflow-hidden text-charcoal">
      <Nav />
      <Hero />
      <Reactions />
      <Tease />
      <Journey />
      <FinalCTA />
      <FloatingCTA />
    </main>
  );
}

/* ---------- Nav ---------- */

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-7xl items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
      <span className="font-display text-base tracking-[0.02em] text-ivory mix-blend-difference sm:text-lg">
        Soul Sounds
      </span>
      <span className="text-[10px] uppercase tracking-[0.3em] text-ivory mix-blend-difference">
        A quiet experience
      </span>
    </header>
  );
}

/* ---------- Hero: full-bleed cinematic ---------- */

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <PhotoSlot
        label="Close-up portrait — sunlit eyes through fabric"
        src={closeup.url}
        objectPosition="50% 40%"
        className="absolute inset-0 animate-slow-zoom"
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/75"
      />
      <div aria-hidden className="film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-14 sm:px-10 sm:pb-20">
        <p
          className="animate-fade-up text-[11px] uppercase tracking-[0.4em] text-ivory/80"
          style={{ animationDelay: "0.1s" }}
        >
          Chapter One
        </p>
        <h1
          className="font-display animate-fade-up mt-4 max-w-3xl text-[2.6rem] leading-[1.02] text-ivory sm:text-6xl md:text-7xl"
          style={{ animationDelay: "0.25s" }}
        >
          Your personality already has a sound.
        </h1>
        <p
          className="animate-fade-up mt-5 max-w-md text-base leading-relaxed text-ivory/85 sm:text-lg"
          style={{ animationDelay: "0.45s" }}
        >
          A three-minute experience to hear what yours sounds like.
        </p>

        <div
          className="animate-fade-up mt-8 flex flex-col items-start gap-4 sm:mt-10"
          style={{ animationDelay: "0.65s" }}
        >
          <PrimaryCTA label="Begin" source="hero" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-ivory/70">
            Free · 3 minutes · No sign-up
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Primary CTA ---------- */

function PrimaryCTA({ label, source }: { label: string; source: string }) {
  return (
    <Link
      to="/quiz"
      onClick={() => handleBeginDiscoveryClick(`${label} (${source})`)}
      className="group inline-flex items-center gap-3 rounded-full bg-ivory px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-charcoal transition-all duration-500 hover:bg-charcoal hover:text-ivory sm:px-10 sm:py-5 sm:text-[13px]"
    >
      {label}
      <svg
        className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

/* ---------- Reactions ---------- */

function Reactions() {
  const items = [
    {
      src: subway.url,
      pos: "60% 40%",
      quote: "It found me on the train home.",
      caption: "Mira, 28",
    },
    {
      src: listening.url,
      pos: "55% 40%",
      quote: "I closed my eyes and just listened.",
      caption: "Ana, 31",
    },
    {
      src: rooftop.url,
      pos: "55% 35%",
      quote: "I sat with it until the sun went down.",
      caption: "Theo, 24",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-36">
      <p className="text-[11px] uppercase tracking-[0.35em] text-warm-gray">
        What people say
      </p>
      <div className="hairline mt-4 mb-12 w-24" />
      <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
        {items.map((it, i) => (
          <figure
            key={it.caption}
            className="animate-fade-up flex flex-col gap-5"
            style={{ animationDelay: `${0.05 + i * 0.1}s` }}
          >
            <PhotoSlot
              label={`Portrait — ${it.caption}`}
              src={it.src}
              objectPosition={it.pos}
              className="aspect-[4/5] w-full"
            />
            <blockquote className="font-display text-2xl leading-snug text-charcoal sm:text-3xl">
              "{it.quote}"
            </blockquote>
            <figcaption className="text-[11px] uppercase tracking-[0.3em] text-warm-gray">
              {it.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------- Tease ---------- */

function Tease() {
  return (
    <section className="relative w-full overflow-hidden bg-charcoal py-32 text-ivory sm:py-44">
      <div aria-hidden className="film-grain absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
        <p className="font-display text-3xl leading-[1.15] sm:text-5xl md:text-6xl">
          Some things can't be explained.
          <br />
          <span className="text-clay">Only heard.</span>
        </p>
      </div>
    </section>
  );
}

/* ---------- Journey ---------- */

function Journey() {
  const steps = [
    {
      n: "01",
      title: "Answer a few quiet questions",
      body: "Nothing intrusive. Nothing clever. Just you.",
      src: cassette.url,
      pos: "50% 50%",
    },
    {
      n: "02",
      title: "Discover your Soul Archetype",
      body: "A portrait of who you are when no one's watching.",
      src: records.url,
      pos: "50% 35%",
    },
    {
      n: "03",
      title: "Hear what you sound like",
      body: "An original piece, composed for you.",
      src: rooftop.url,
      pos: "55% 35%",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10 sm:py-40">
      <p className="text-[11px] uppercase tracking-[0.35em] text-warm-gray">
        The experience
      </p>
      <h2 className="font-display mt-4 max-w-2xl text-4xl leading-[1.05] text-charcoal sm:text-6xl">
        Three minutes. One sound. Yours.
      </h2>
      <div className="mt-16 grid gap-16 sm:grid-cols-3 sm:gap-10">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="animate-fade-up flex flex-col gap-6"
            style={{ animationDelay: `${0.05 + i * 0.1}s` }}
          >
            <PhotoSlot
              label={`Step ${s.n} — ${s.title}`}
              src={s.src}
              objectPosition={s.pos}
              className="aspect-[4/5] w-full"
            />
            <div>
              <p className="font-display text-clay text-lg">{s.n}</p>
              <h3 className="font-display mt-2 text-2xl leading-snug text-charcoal sm:text-3xl">
                {s.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-warm-gray">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCTA() {
  return (
    <section className="relative h-[90svh] min-h-[560px] w-full overflow-hidden">
      <PhotoSlot
        label="Final — eyes closed, headphones, listening"
        src={listening.url}
        objectPosition="55% 35%"
        className="absolute inset-0"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/50" />
      <div aria-hidden className="film-grain absolute inset-0" />
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-end px-6 pb-16 text-center sm:pb-24">
        <h2 className="font-display text-4xl leading-[1.05] text-ivory sm:text-6xl">
          Your sound is already within you.
        </h2>
        <p className="mt-5 max-w-md text-base text-ivory/85 sm:text-lg">
          It only takes three minutes to hear it.
        </p>
        <div className="mt-10">
          <PrimaryCTA label="Begin" source="footer" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Floating CTA ---------- */

function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () =>
      setVisible(window.scrollY > window.innerHeight * 0.8);
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
          onClick={() => handleBeginDiscoveryClick("Begin (floating)")}
          className="btn-primary inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-xs font-medium uppercase tracking-[0.25em] shadow-[var(--shadow-print)]"
        >
          Begin
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

/* ---------- Photo slot ---------- */

function PhotoSlot({
  className = "",
  label,
  src,
  objectPosition = "50% 50%",
  children,
}: {
  className?: string;
  label: string;
  src?: string;
  objectPosition?: string;
  children?: ReactNode;
}) {
  if (children) {
    return <div className={`relative overflow-hidden bg-sand ${className}`}>{children}</div>;
  }
  if (src) {
    return (
      <div className={`relative overflow-hidden bg-sand ${className}`}>
        <img
          src={src}
          alt={label}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
        />
      </div>
    );
  }
  return (
    <div
      className={`relative overflow-hidden bg-sand ${className}`}
      role="img"
      aria-label={label}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, oklch(0.62 0.085 45 / 0.35), oklch(0.48 0.055 110 / 0.35) 50%, oklch(0.28 0.012 60 / 0.6))",
        }}
      />
      <div aria-hidden className="film-grain absolute inset-0" />
      <div className="absolute inset-0 flex items-end p-5">
        <span className="text-[10px] uppercase tracking-[0.3em] text-ivory/70">
          Photo · {label}
        </span>
      </div>
    </div>
  );
}
