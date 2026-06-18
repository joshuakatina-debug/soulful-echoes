## Goal
Checkout is now working end-to-end with the correct `STRIPE_PRICE_ID`. Remove the temporary debug log we added for diagnosis.

## Change
- `supabase/functions/create-checkout-session/index.ts`: delete the `console.log("DEBUG_ENV", { STRIPE_PRICE_ID, SITE_URL })` line that runs just before the Stripe call. Leave all other logic untouched.

## Deploy & verify
1. Redeploy `create-checkout-session`.
2. Invoke it once — expect status 200 with a `cs_test_...` session URL.
3. Check function logs and confirm no `DEBUG_ENV` line appears for the new invocation.
