// Centralized Meta Pixel service. All fbq calls go through here so we keep
// one source of truth for dedupe and event params.

type Params = Record<string, unknown>;

function fbq(...args: unknown[]) {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (typeof w.fbq !== "function") return;
    w.fbq(...args);
  } catch {
    // Never let analytics throw into the UI.
  }
}

function onceSession(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const k = `meta:once:${key}`;
    if (sessionStorage.getItem(k)) return false;
    sessionStorage.setItem(k, "1");
    return true;
  } catch {
    return true;
  }
}

function oncePersistent(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const k = `meta:done:${key}`;
    if (localStorage.getItem(k)) return false;
    localStorage.setItem(k, "1");
    return true;
  } catch {
    return true;
  }
}

export const META_PIXEL_ID: string | undefined =
  (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || undefined;

export const meta = {
  pageView() {
    fbq("track", "PageView");
  },

  viewContent(opts?: { contentName?: string; contentCategory?: string }) {
    const key = `view_content:${opts?.contentName ?? "default"}`;
    if (!onceSession(key)) return;
    const params: Params = {};
    if (opts?.contentName) params.content_name = opts.contentName;
    if (opts?.contentCategory) params.content_category = opts.contentCategory;
    fbq("track", "ViewContent", params);
  },

  initiateCheckout(opts?: { value?: number; currency?: string }) {
    if (!onceSession("initiate_checkout")) return;
    fbq("track", "InitiateCheckout", {
      value: opts?.value ?? 14.99,
      currency: opts?.currency ?? "USD",
    });
  },

  purchase(opts: {
    transactionId: string;
    value?: number;
    currency?: string;
  }) {
    if (!opts.transactionId) return;
    if (!oncePersistent(`purchase:${opts.transactionId}`)) return;
    fbq(
      "track",
      "Purchase",
      {
        value: opts.value ?? 14.99,
        currency: opts.currency ?? "USD",
      },
      { eventID: opts.transactionId },
    );
  },
};
