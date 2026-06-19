// Centralized helper to reset quiz-only progress before starting a fresh run.
// Preserves paid Soul Sound records and Stripe session recovery data.

export function resetQuizProgress() {
  if (typeof window === "undefined") return;
  try {
    // Quiz answers / step / intermediate result
    localStorage.removeItem("soul-sounds:answers");
    localStorage.removeItem("soul-sounds:step");
    localStorage.removeItem("soul-sounds:result");

    // Re-allow per-session funnel events to fire on the new run
    sessionStorage.removeItem("ga:once:quiz_started");
    sessionStorage.removeItem("ga:once:quiz_completed");
    sessionStorage.removeItem("ga:once:results_viewed");
    sessionStorage.removeItem("ga:once:checkout_started");
    sessionStorage.removeItem("meta:once:view_content:results_preview");
    sessionStorage.removeItem("meta:once:initiate_checkout");
  } catch {
    // ignore storage errors
  }
}
