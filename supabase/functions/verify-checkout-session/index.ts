// Verifies a Stripe Checkout Session and returns payment_status.
// On a paid session, also fires a server-side Meta Conversions API Purchase
// event, deduplicated with the browser Pixel via event_id = session_id.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sendMetaCAPIPurchase(opts: {
  sessionId: string;
  value: number;
  currency: string;
  email?: string | null;
  sourceUrl?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  const pixelId = Deno.env.get("META_PIXEL_ID");
  const accessToken = Deno.env.get("META_ACCESS_TOKEN");
  if (!pixelId || !accessToken) {
    console.warn("Meta CAPI not configured (missing META_PIXEL_ID or META_ACCESS_TOKEN); skipping");
    return;
  }
  try {
    const userData: Record<string, unknown> = {};
    if (opts.email) {
      userData.em = [await sha256Hex(opts.email)];
    }
    if (opts.clientIp) userData.client_ip_address = opts.clientIp;
    if (opts.userAgent) userData.client_user_agent = opts.userAgent;

    const payload = {
      data: [
        {
          event_name: "Purchase",
          event_time: Math.floor(Date.now() / 1000),
          event_id: opts.sessionId,
          action_source: "website",
          event_source_url: opts.sourceUrl ?? undefined,
          user_data: userData,
          custom_data: {
            currency: opts.currency,
            value: opts.value,
          },
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v19.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("Meta CAPI error:", res.status, text);
    } else {
      console.log("Meta CAPI Purchase sent for session", opts.sessionId);
    }
  } catch (err) {
    console.error("Meta CAPI exception (non-fatal):", err);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) {
      return new Response(
        JSON.stringify({ error: "STRIPE_SECRET_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = new URL(req.url);
    let sessionId = url.searchParams.get("session_id");
    let sourceUrl: string | null = null;
    if (req.method === "POST") {
      try {
        const body = await req.json();
        sessionId = sessionId ?? body?.session_id ?? null;
        sourceUrl = body?.source_url ?? null;
      } catch (_) {
        // ignore
      }
    }

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Missing session_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      {
        headers: { Authorization: `Bearer ${stripeSecret}` },
      },
    );
    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error("Stripe retrieve session error:", session);
      return new Response(
        JSON.stringify({ error: session?.error?.message ?? "Stripe error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fire CAPI Purchase only on paid sessions. Never block the response.
    if (session?.payment_status === "paid") {
      const amountTotal: number | undefined = session.amount_total;
      const currency: string = (session.currency ?? "usd").toUpperCase();
      const value =
        typeof amountTotal === "number" ? amountTotal / 100 : 14.99;
      const email: string | null =
        session?.customer_details?.email ?? session?.customer_email ?? null;
      const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
      const userAgent = req.headers.get("user-agent");

      // Fire-and-forget; do not await so verification stays fast and any
      // CAPI failure cannot interrupt the purchase flow.
      sendMetaCAPIPurchase({
        sessionId,
        value,
        currency,
        email,
        sourceUrl,
        clientIp,
        userAgent,
      }).catch((err) => console.error("Meta CAPI background error:", err));
    }

    return new Response(
      JSON.stringify({
        payment_status: session.payment_status,
        status: session.status,
        amount_total: session.amount_total,
        currency: session.currency,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("verify-checkout-session error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
