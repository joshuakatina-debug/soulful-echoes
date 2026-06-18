import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CalmBlank } from "@/components/CalmBlank";

export const Route = createFileRoute("/complete")({
  component: CompletePage,
  head: () => ({
    meta: [
      { title: "Your complete reflection is ready" },
      {
        name: "description",
        content:
          "Thank you for supporting Soul Sounds. Continue into the full experience.",
      },
    ],
  }),
});

type State =
  | { kind: "loading" }
  | { kind: "paid" }
  | { kind: "unpaid"; status?: string }
  | { kind: "error"; message: string };

function CompletePage() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setState({ kind: "error", message: "Missing session reference." });
      return;
    }

    let cancelled = false;
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
          } catch (_) {
            // ignore
          }
          setState({ kind: "paid" });
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
  }, []);

  if (state.kind === "loading") return <CalmBlank />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.55_0.18_305/0.12),_transparent_60%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        {state.kind === "paid" && (
          <>
            <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
              Your complete reflection is ready.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-foreground/70 sm:text-lg">
              Thank you for supporting Soul Sounds. Continue into the full
              experience.
            </p>
            <Link
              to="/results"
              className="mt-10 rounded-full border border-foreground/20 bg-foreground/[0.04] px-8 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40 hover:bg-foreground/[0.08]"
            >
              Continue
            </Link>
          </>
        )}

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
