
ALTER TABLE public.soul_sounds
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS email_sent_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS email_status text,
  ADD COLUMN IF NOT EXISTS email_error text;
