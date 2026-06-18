## Plan

Add a temporary diagnostic log to `supabase/functions/create-checkout-session/index.ts` right before `stripe.checkout.sessions.create(...)`:

```js
console.log("DEBUG_ENV", {
  STRIPE_PRICE_ID: Deno.env.get("STRIPE_PRICE_ID"),
  SITE_URL: Deno.env.get("SITE_URL"),
});
```

Steps:
1. Insert the log line above the Stripe call (no other code changes).
2. Redeploy `create-checkout-session`.
3. Invoke the function once via `curl_edge_functions`.
4. Fetch `edge_function_logs` and report the exact logged `STRIPE_PRICE_ID` and `SITE_URL` values back to you.
5. Wait for your confirmation, then remove the log and redeploy.

No frontend changes. `STRIPE_SECRET_KEY` is never logged.