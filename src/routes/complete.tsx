import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/complete")({
  component: CompletePage,
  head: () => ({
    meta: [
      { title: "Your complete reflection is being prepared" },
      {
        name: "description",
        content:
          "Thank you for supporting Soul Sounds. Your complete reflection is being prepared.",
      },
    ],
  }),
});

type State =
  | { kind: "verifying" }
  | { kind: "unpaid"; status?: string }
  | { kind: "error"; message: string };

const MIN_DWELL_MS = 2400;

function CompletePage() {
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ kind: "verifying" });
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setState({ kind: "error", message: "Missing session reference." });
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "verify-checkout-session",
          { body: { session_id: sessionId } },
        );
        if (cancelled) return;
        if (error) {
          setState({ kind: "error", message: error.message });
          return;
        }
        if (data?.payment_status === "paid") {
          try {
            localStorage.setItem("soulSoundsPaid", "true");
            localStorage.setItem("soulSoundsAutoGenerate", "true");
          } catch (_) {
            // ignore
          }
          const elapsed = Date.now() - startedAt;
          const wait = Math.max(0, MIN_DWELL_MS - elapsed);
          setTimeout(() => {
            if (cancelled) return;
            setLeaving(true);
            setTimeout(() => navigate({ to: "/results" }), 600);
          }, wait);
        } else {
          setState({ kind: "unpaid", status: data?.payment_status });
        }
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: (err as Error).message ?? "Verification failed.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (state.kind === "verifying") {
    return (
      <main
        className={`bg-night relative flex min-h-screen items-center justify-center overflow-hidden px-6 transition-opacity duration-[600ms] ease-out ${
          leaving ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[45%] h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.82_0.13_85)] opacity-[0.08] blur-3xl animate-breathe" />
          <div
            className="absolute left-[60%] top-[55%] h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.55_0.18_305)] opacity-[0.06] blur-3xl animate-breathe"
            style={{ animationDelay: "-3s" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-xl text-center animate-fade-up">
          <div className="mb-12 flex justify-center">
            <div className="relative h-3 w-3">
              <div className="absolute inset-0 rounded-full bg-[oklch(0.82_0.13_85)] opacity-60 animate-breathe" />
              <div
                className="absolute -inset-2 rounded-full border border-[oklch(0.82_0.13_85/0.25)] animate-breathe"
                style={{ animationDelay: "-1.5s" }}
              />
            </div>
          </div>

          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Thank you.
          </h1>
          <p className="mt-8 text-base leading-relaxed text-foreground/70 sm:text-lg">
            Your complete reflection is being prepared.
          </p>
          <p className="mt-3 text-sm italic text-muted-foreground">
            This should only take a moment.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.55_0.18_305/0.12),_transparent_60%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        {state.kind === "unpaid" && (
          <>
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">
              We couldn't confirm your payment yet.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-foreground/70">
              If you just completed checkout, give it a moment and refresh. If
              the issue continues, you can return and try again.
            </p>
            <div className="mt-10 flex gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full border border-foreground/20 bg-foreground/[0.04] px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
              >
                Try again
              </button>
              <Link
                to="/results"
                className="rounded-full px-6 py-3 text-sm font-medium text-foreground/70 transition hover:text-foreground"
              >
                Back to results
              </Link>
            </div>
          </>
        )}

        {state.kind === "error" && (
          <>
            <h1 className="font-display text-3xl text-foreground sm:text-4xl">
              Something interrupted the confirmation.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-foreground/70">
              {state.message} You can try again in a moment.
            </p>
            <div className="mt-10 flex gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full border border-foreground/20 bg-foreground/[0.04] px-6 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
              >
                Try again
              </button>
              <Link
                to="/results"
                className="rounded-full px-6 py-3 text-sm font-medium text-foreground/70 transition hover:text-foreground"
              >
                Back to results
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
