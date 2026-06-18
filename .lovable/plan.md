I’ll do this without changing frontend code or backend code.

Plan:
1. Invoke the deployed `create-checkout-session` Edge Function once.
2. Open the Edge Function logs for `create-checkout-session`.
3. Find the latest `DEBUG_ENV` log emitted by `Deno.env.get("STRIPE_PRICE_ID")`.
4. Report the exact `STRIPE_PRICE_ID` value shown in that latest log.