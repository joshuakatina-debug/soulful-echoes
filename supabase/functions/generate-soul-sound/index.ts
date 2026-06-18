// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

interface GenerateRequest {
  session_id?: string;
  archetype_id?: string;
  archetype_name?: string;
  promptText: string;
  shortPrompt?: string;
}

const MAX_PROMPT_LEN = 390;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

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

    const body = (await req.json()) as GenerateRequest;
    const { session_id, archetype_id, archetype_name, promptText, shortPrompt } = body;

    if (!session_id) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const source = (shortPrompt ?? promptText ?? "").toString();
    if (!source) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = admin();

    // ---- GUARD RAIL: never start a 2nd MusicAPI job for the same session ----
    const { data: existing, error: lookupErr } = await db
      .from("soul_sounds")
      .select(
        "session_id, status, task_id, audio_url, image_url, duration, title",
      )
      .eq("session_id", session_id)
      .maybeSingle();

    if (lookupErr) {
      console.error("[generate] lookup error", lookupErr);
      return new Response(
        JSON.stringify({ error: "Database lookup failed" }),
        { status: 500, headers: corsHeaders },
      );
    }

    if (existing?.status === "ready" && existing.audio_url) {
      console.log(`[generate] session ${session_id} already ready — returning stored`);
      return new Response(
        JSON.stringify({
          status: "ready",
          task_id: existing.task_id,
          audioUrl: existing.audio_url,
          imageUrl: existing.image_url,
          duration: existing.duration,
          title: existing.title,
          cached: true,
        }),
        { status: 200, headers: corsHeaders },
      );
    }

    if (existing?.task_id && existing.status === "generating") {
      console.log(
        `[generate] session ${session_id} already generating task ${existing.task_id} — resuming`,
      );
      return new Response(
        JSON.stringify({
          status: "generating",
          task_id: existing.task_id,
          resumed: true,
        }),
        { status: 200, headers: corsHeaders },
      );
    }

    // Safety net: enforce MusicAPI's <400 char limit on gpt_description_prompt.
    const finalPrompt =
      source.length > MAX_PROMPT_LEN ? source.slice(0, MAX_PROMPT_LEN) : source;
    console.log(`[generate] MusicAPI prompt length: ${finalPrompt.length}`);

    const musicApiKey = Deno.env.get("MUSICAPI_KEY");
    if (!musicApiKey) {
      console.error("MUSICAPI_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Music generation service is not configured" }),
        { status: 503, headers: corsHeaders },
      );
    }

    const upstream = await fetch("https://api.musicapi.ai/api/v1/sonic/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${musicApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task_type: "create_music",
        custom_mode: false,
        mv: "sonic-v5",
        gpt_description_prompt: finalPrompt,
        tags: "instrumental, intimate, organic, reflective, no vocals",
      }),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("MusicAPI create failed", upstream.status, JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Failed to start music generation" }),
        { status: 502, headers: corsHeaders },
      );
    }

    const taskId =
      data?.task_id ??
      data?.data?.task_id ??
      data?.id ??
      data?.data?.id ??
      null;

    console.log(`[generate] task_id=${taskId} session=${session_id}`);

    if (!taskId) {
      console.error("MusicAPI response missing task_id", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "No task_id returned by music service" }),
        { status: 502, headers: corsHeaders },
      );
    }

    // Persist the generation as in-flight so a refresh cannot start a second one.
    const { error: upsertErr } = await db.from("soul_sounds").upsert(
      {
        session_id,
        archetype_id: archetype_id ?? existing?.archetype_id ?? null,
        archetype_name: archetype_name ?? existing?.archetype_name ?? null,
        prompt_text: promptText ?? null,
        short_prompt: shortPrompt ?? null,
        task_id: taskId,
        status: "generating",
        error_message: null,
      },
      { onConflict: "session_id" },
    );
    if (upsertErr) {
      console.error("[generate] upsert error", upsertErr);
      // Don't fail the request — generation is already in flight upstream.
    }

    return new Response(
      JSON.stringify({ status: "generating", task_id: taskId }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("generate-soul-sound error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
