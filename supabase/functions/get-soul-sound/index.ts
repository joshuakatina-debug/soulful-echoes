// deno-lint-ignore-file no-explicit-any
// Looks up the permanent Soul Sound record for a paid checkout session.
// This is the source-of-truth read used by the client on every page load.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    const { session_id } = (await req.json()) as { session_id?: string };
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data, error } = await db
      .from("soul_sounds")
      .select(
        "session_id, archetype_id, archetype_name, status, task_id, audio_url, image_url, duration, title",
      )
      .eq("session_id", session_id)
      .maybeSingle();

    if (error) {
      console.error("[get-soul-sound] error", error);
      return new Response(
        JSON.stringify({ error: "Lookup failed" }),
        { status: 500, headers: corsHeaders },
      );
    }

    if (!data) {
      return new Response(JSON.stringify({ exists: false }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({
        exists: true,
        sessionId: data.session_id,
        archetypeId: data.archetype_id,
        archetypeName: data.archetype_name,
        status: data.status,
        taskId: data.task_id,
        audioUrl: data.audio_url,
        imageUrl: data.image_url,
        duration: data.duration,
        title: data.title,
      }),
      { status: 200, headers: corsHeaders },
    );
  } catch (err) {
    console.error("get-soul-sound error", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
