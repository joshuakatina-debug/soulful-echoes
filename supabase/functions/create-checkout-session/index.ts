// Stripe Checkout session creator for the Complete Soul Sounds Reveal.
// No auth, one-time payment, single price.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

    const priceId =
      Deno.env.get("STRIPE_PRICE_ID") ?? "price_1Tjg8Z0zjh0XE9BLIKlEXMzR";

    let body: { origin?: string; cancel_path?: string } = {};
    try {
      body = await req.json();
    } catch (_) {
      // body optional
    }

    const origin =
      Deno.env.get("SITE_URL") ??
      body.origin ??
      req.headers.get("origin") ??
      "";

    if (!origin) {
      return new Response(
        JSON.stringify({ error: "Unable to determine site origin" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const cancelPath = body.cancel_path ?? "/results";

    const form = new URLSearchParams();
    form.append("mode", "payment");
    form.append("line_items[0][price]", priceId);
    form.append("line_items[0][quantity]", "1");
    form.append(
      "success_url",
      `${origin}/complete?session_id={CHECKOUT_SESSION_ID}`,
    );
    form.append("cancel_url", `${origin}${cancelPath}`);

    const stripeRes = await fetch(
      "https://api.stripe.com/v1/checkout/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${stripeSecret}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString(),
      },
    );

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      console.error("Stripe create session error:", session);
      return new Response(
        JSON.stringify({ error: session?.error?.message ?? "Stripe error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ id: session.id, url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
