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

// Funnel timing keys
const QUIZ_START_TS_KEY = "ga:quiz:startTs";
const SOUND_GEN_TS_KEY = "ga:soundgen:startTs";
const SESSION_ID_KEY = "ga:session_id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    const existing = sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) return existing;
    const id =
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    sessionStorage.setItem(SESSION_ID_KEY, id);
    return id;
  } catch {
    return `s_${Date.now()}`;
  }
}

export const analytics = {
  beginDiscovery(opts: { buttonText: string; pageLocation?: string }) {
    if (!onceSession("begin_discovery")) return;
    send("begin_discovery", {
      button_text: opts.buttonText,
      page_location:
        opts.pageLocation ??
        (typeof window !== "undefined" ? window.location.href : ""),
    });
  },

  quizStarted(opts?: { source?: string | null }) {
    if (!onceSession("quiz_started")) return;
    try {
      localStorage.setItem(QUIZ_START_TS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    const session_id = getOrCreateSessionId();
    const source =
      opts?.source ??
      (typeof document !== "undefined" && document.referrer
        ? document.referrer
        : undefined);
    send("quiz_started", {
      session_id,
      ...(source ? { source } : {}),
    });
  },

  quizProgress(opts: { questionNumber: number; totalQuestions: number }) {
    const key = `quiz_progress:${opts.questionNumber}`;
    if (!onceSession(key)) return;
    const percent =
      opts.totalQuestions > 0
        ? Math.round((opts.questionNumber / opts.totalQuestions) * 100)
        : 0;
    send("quiz_progress", {
      question_number: opts.questionNumber,
      total_questions: opts.totalQuestions,
      percent_complete: percent,
    });
  },

  quizCompleted(opts: {
    archetypeName: string;
    totalQuestions?: number;
    flavor?: Record<string, string | undefined> | null;
  }) {
    if (!onceSession("quiz_completed")) return;
    const flavor = buildFlavor(opts.flavor);
    let completionSeconds: number | undefined;
    try {
      const raw = localStorage.getItem(QUIZ_START_TS_KEY);
      if (raw) {
        const start = parseInt(raw, 10);
        if (!Number.isNaN(start)) {
          completionSeconds = Math.max(0, Math.round((Date.now() - start) / 1000));
        }
      }
    } catch {
      /* ignore */
    }
    send("quiz_completed", {
      archetype_name: opts.archetypeName,
      ...(opts.totalQuestions ? { total_questions: opts.totalQuestions } : {}),
      ...(completionSeconds !== undefined
        ? { completion_time_seconds: completionSeconds }
        : {}),
      ...(flavor ? { flavor } : {}),
    });
  },

  resultsViewed(opts?: {
    archetype?: string | null;
    flavor?: Record<string, string | undefined> | null;
  }) {
    if (!onceSession("results_viewed")) return;
    const flavor = buildFlavor(opts?.flavor);
    send("results_viewed", {
      ...(opts?.archetype ? { archetype: opts.archetype } : {}),
      ...(flavor ? { flavor } : {}),
    });
  },

  soulSoundGenerationStarted() {
    try {
      localStorage.setItem(SOUND_GEN_TS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  },

  soulSoundGenerated(opts: { archetype?: string | null }) {
    if (!onceSession("soul_sound_generated")) return;
    let generationSeconds: number | undefined;
    try {
      const raw = localStorage.getItem(SOUND_GEN_TS_KEY);
      if (raw) {
        const start = parseInt(raw, 10);
        if (!Number.isNaN(start)) {
          generationSeconds = Math.max(0, Math.round((Date.now() - start) / 1000));
        }
      }
    } catch {
      /* ignore */
    }
    send("soul_sound_generated", {
      ...(opts.archetype ? { archetype: opts.archetype } : {}),
      ...(generationSeconds !== undefined
        ? { generation_time_seconds: generationSeconds }
        : {}),
    });
  },

  checkoutStarted(opts?: { product?: string; price?: number; currency?: string }) {
    if (!onceSession("checkout_started")) return;
    send("checkout_started", {
      product: opts?.product ?? "soul_sound_full_reflection",
      price: opts?.price ?? 14.99,
      currency: opts?.currency ?? "USD",
    });
  },

  purchaseCompleted(opts: {
    transactionId: string;
    archetypeName?: string | null;
    flavor?: Record<string, string | undefined> | null;
    product?: string;
    value?: number;
    currency?: string;
  }) {
    if (!opts.transactionId) return;
    // Permanent dedupe per Stripe session id — fires exactly once ever.
    if (!oncePersistent(`purchase:${opts.transactionId}`)) return;
    const flavor = buildFlavor(opts.flavor);
    send("purchase_completed", {
      product: opts.product ?? "soul_sound_full_reflection",
      value: opts.value ?? 14.99,
      currency: opts.currency ?? "USD",
      transaction_id: opts.transactionId,
      ...(opts.archetypeName ? { archetype_name: opts.archetypeName } : {}),
      ...(flavor ? { flavor } : {}),
    });
  },

  soulSoundPlayed(opts?: { archetype?: string | null }) {
    send("soul_sound_played", {
      ...(opts?.archetype ? { archetype: opts.archetype } : {}),
    });
  },

  soulSoundDownloaded() {
    if (!onceSession("soul_sound_downloaded")) return;
    send("soul_sound_downloaded");
  },
};
