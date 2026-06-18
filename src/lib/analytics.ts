// Centralized GA4 analytics service for Soul Sounds funnel events.
// All event firing goes through here so we can dedupe and keep one source of truth.

type Params = Record<string, unknown>;

function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  w.gtag(...args);
}

// Per-tab dedupe (cleared when the browser tab closes).
function onceSession(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const k = `ga:once:${key}`;
    if (sessionStorage.getItem(k)) return false;
    sessionStorage.setItem(k, "1");
    return true;
  } catch {
    return true;
  }
}

// Permanent dedupe (survives refreshes, new tabs, new sessions).
function oncePersistent(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const k = `ga:done:${key}`;
    if (localStorage.getItem(k)) return false;
    localStorage.setItem(k, "1");
    return true;
  } catch {
    return true;
  }
}

function send(event: string, params?: Params) {
  gtag("event", event, params ?? {});
}

function buildFlavor(answers?: Record<string, string | undefined> | null): string | undefined {
  if (!answers) return undefined;
  const parts = Object.entries(answers)
    .filter(([, v]) => !!v)
    .map(([k, v]) => `${k}:${v}`);
  return parts.length ? parts.join(",") : undefined;
}

export const analytics = {
  quizStarted() {
    if (!onceSession("quiz_started")) return;
    send("quiz_started");
  },

  quizCompleted(opts: {
    archetypeName: string;
    flavor?: Record<string, string | undefined> | null;
  }) {
    if (!onceSession("quiz_completed")) return;
    const flavor = buildFlavor(opts.flavor);
    send("quiz_completed", {
      archetype_name: opts.archetypeName,
      ...(flavor ? { flavor } : {}),
    });
  },

  resultsViewed() {
    if (!onceSession("results_viewed")) return;
    send("results_viewed");
  },

  checkoutStarted() {
    if (!onceSession("checkout_started")) return;
    send("checkout_started");
  },

  purchaseCompleted(opts: {
    transactionId: string;
    archetypeName?: string | null;
    flavor?: Record<string, string | undefined> | null;
  }) {
    if (!opts.transactionId) return;
    // Permanent dedupe per Stripe session id — fires exactly once ever.
    if (!oncePersistent(`purchase:${opts.transactionId}`)) return;
    const flavor = buildFlavor(opts.flavor);
    send("purchase_completed", {
      value: 14.99,
      currency: "USD",
      transaction_id: opts.transactionId,
      ...(opts.archetypeName ? { archetype_name: opts.archetypeName } : {}),
      ...(flavor ? { flavor } : {}),
    });
  },

  soulSoundPlayed() {
    if (!onceSession("soul_sound_played")) return;
    send("soul_sound_played");
  },

  soulSoundDownloaded() {
    if (!onceSession("soul_sound_downloaded")) return;
    send("soul_sound_downloaded");
  },
};
