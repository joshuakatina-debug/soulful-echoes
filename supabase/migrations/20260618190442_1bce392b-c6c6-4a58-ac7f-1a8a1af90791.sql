
CREATE TABLE public.soul_sounds (
  session_id TEXT PRIMARY KEY,
  archetype_id TEXT,
  archetype_name TEXT,
  prompt_text TEXT,
  short_prompt TEXT,
  task_id TEXT,
  audio_url TEXT,
  image_url TEXT,
  duration NUMERIC,
  title TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.soul_sounds TO service_role;

ALTER TABLE public.soul_sounds ENABLE ROW LEVEL SECURITY;

-- Intentionally no policies for anon/authenticated. All access goes through
-- edge functions running with the service role. This enforces the permanence
-- and single-generation rules at the database layer.

CREATE OR REPLACE FUNCTION public.set_soul_sounds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER soul_sounds_set_updated_at
BEFORE UPDATE ON public.soul_sounds
FOR EACH ROW EXECUTE FUNCTION public.set_soul_sounds_updated_at();

CREATE INDEX soul_sounds_task_id_idx ON public.soul_sounds (task_id);
