const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

Deno.serve(async function (req) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    const priceId = Deno.env.get("STRIPE_PRICE_ID");
    const siteUrl = Deno.env.get("SITE_URL");

    if (!stripeSecret) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    if (!priceId) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_PRICE_ID" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    if (!siteUrl) {
      return new Response(JSON.stringify({ error: "Missing SITE_URL" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const form = new URLSearchParams();
    form.append("payment_method_types[0]", "card");
    form.append("mode", "payment");
    form.append("line_items[0][price]", priceId);
    form.append("line_items[0][quantity]", "1");
    form.append("success_url", siteUrl + "/complete?session_id={CHECKOUT_SESSION_ID}");
    form.append("cancel_url", siteUrl + "/results");


    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + stripeSecret,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: form.toString()
    });

    const data = await stripeResponse.json();

    if (!stripeResponse.ok) {
      return new Response(JSON.stringify({
        error: data && data.error && data.error.message ? data.error.message : "Stripe checkout failed",
        stripe: data
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      id: data.id,
      url: data.url
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error && error.message ? error.message : "Unknown function error"
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
});
