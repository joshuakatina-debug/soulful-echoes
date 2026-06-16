import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadSoulResult, type StoredSoulResult } from "@/lib/soul-result";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Soul Is Ready — Soul Sounds" },
    ],
  }),
  component: Results,
});

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-foreground/10 pt-6 first:border-t-0 first:pt-0">
      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <div className="mt-2 text-foreground/85">{children}</div>
    </div>
  );
}

function Results() {
  const [result, setResult] = useState<StoredSoulResult | null>(null);
  useEffect(() => {
    setResult(loadSoulResult());
  }, []);
  const archetypeName = result?.bestMatch.displayName ?? "Your Soul Archetype";
  return (
    <main className="bg-night relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/3 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.82_0.13_85)] opacity-15 blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[oklch(0.55_0.18_305)] opacity-20 blur-3xl animate-float-slow" style={{ animationDelay: "-7s" }} />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12">
        <Link to="/" className="font-display text-lg text-foreground/70 hover:text-foreground transition">
          Soul Sounds
        </Link>

        <div className="animate-fade-up mt-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">A composition has begun</p>
          <h1 className="font-display mt-4 text-5xl leading-tight text-foreground sm:text-6xl">
            Your Soul <span className="italic text-gradient">Is Ready</span>
          </h1>
        </div>

        <div className="animate-fade-up glass-card mt-12 rounded-3xl p-8 sm:p-12" style={{ animationDelay: "0.2s" }}>
          <div className="space-y-8">
            <Section label="Archetype Name">
              <p className="font-display text-3xl text-foreground sm:text-4xl">{archetypeName}</p>
            </Section>

            <Section label="Soul Identity">
              <p className="leading-relaxed">
                A placeholder reflection of who you are — open-hearted, curious, attuned to the
                quiet music inside everyday moments. Your full Soul Identity will appear here once
                the composition is complete.
              </p>
            </Section>

            <Section label="Soul Keywords">
              <div className="mt-1 flex flex-wrap gap-2">
                {["Reflective", "Warm", "Cinematic", "Open", "Tender"].map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-foreground/15 bg-[oklch(1_0_0/0.04)] px-3 py-1 text-sm"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </Section>

            <Section label="Soul Sound">
              <div className="glass-card-warm mt-2 flex items-center justify-between rounded-2xl px-5 py-4">
                <div>
                  <p className="font-display text-xl text-foreground">A Quiet Horizon</p>
                  <p className="text-sm text-muted-foreground">Cinematic · Ambient · Warm strings</p>
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Soon</span>
              </div>
            </Section>
          </div>
        </div>

        <div className="mt-10 mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/quiz" className="btn-ghost rounded-full px-6 py-3 text-sm font-medium">
            Take the journey again
          </Link>
          <Link to="/" className="btn-primary rounded-full px-8 py-3 text-sm font-medium">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
