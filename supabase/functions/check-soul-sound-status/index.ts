// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

interface StatusRequest {
  task_id?: string;
  session_id?: string;
}

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

    const { task_id, session_id } = (await req.json()) as StatusRequest;
    if (!task_id) {
      return new Response(JSON.stringify({ error: "Missing task_id" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = admin();

    // If the row is already marked ready, short-circuit (no MusicAPI call).
    if (session_id) {
      const { data: row } = await db
        .from("soul_sounds")
        .select("status, audio_url, image_url, duration, title, task_id")
        .eq("session_id", session_id)
        .maybeSingle();
      if (row?.status === "ready" && row.audio_url) {
        return new Response(
          JSON.stringify({
            status: "succeeded",
            audioUrl: row.audio_url,
            imageUrl: row.image_url,
            duration: row.duration,
            title: row.title,
            taskId: row.task_id ?? task_id,
            cached: true,
          }),
          { status: 200, headers: corsHeaders },
        );
      }
    }

    const musicApiKey = Deno.env.get("MUSICAPI_KEY");
    if (!musicApiKey) {
      return new Response(
        JSON.stringify({ error: "Music generation service is not configured" }),
        { status: 503, headers: corsHeaders },
      );
    }

    const upstream = await fetch(
      `https://api.musicapi.ai/api/v1/sonic/task/${encodeURIComponent(task_id)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${musicApiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error("MusicAPI status failed", upstream.status, JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Failed to fetch task status" }),
        { status: 502, headers: corsHeaders },
      );
    }

    if (data?.type === "not_ready") {
      return new Response(
        JSON.stringify({
          status: "processing",
          audioUrl: null,
          taskId: task_id,
        }),
        { status: 200, headers: corsHeaders },
      );
    }

    const clips: any[] = Array.isArray(data?.data) ? data.data : [];
    const clip = clips[0] ?? {};

    const state: string | null = clip?.state ?? null;
    const audioUrl: string | null = clip?.audio_url ?? null;
    const imageUrl: string | null = clip?.image_url ?? null;
    const duration = clip?.duration ?? null;
    const title: string | null = clip?.title ?? null;
    const status = audioUrl ? "succeeded" : (state ?? "processing");

    console.log(
      `[status] task_id=${task_id} session=${session_id} state=${state} audio=${audioUrl ? "yes" : "no"}`,
    );

    // Persist a successful generation as PERMANENT.
    if (audioUrl) {
      const target = session_id
        ? db.from("soul_sounds").update({
            status: "ready",
            audio_url: audioUrl,
            image_url: imageUrl,
            duration,
            title,
            task_id,
            error_message: null,
          }).eq("session_id", session_id)
        : db.from("soul_sounds").update({
            status: "ready",
            audio_url: audioUrl,
            image_url: imageUrl,
            duration,
            title,
            error_message: null,
          }).eq("task_id", task_id);
      const { error: updErr } = await target;
      if (updErr) console.error("[status] persist error", updErr);
    } else if (
      state &&
      ["failed", "error", "rejected", "cancelled", "canceled"].includes(
        state.toLowerCase(),
      )
    ) {
      // Allow retry: clear the in-flight task_id so the next generate call can start one.
      const target = session_id
        ? db.from("soul_sounds").update({
            status: "failed",
            error_message: state,
            task_id: null,
          }).eq("session_id", session_id)
        : db.from("soul_sounds").update({
            status: "failed",
            error_message: state,
          }).eq("task_id", task_id);
      await target;
    }

    return new Response(
      JSON.stringify({
        status,
        audioUrl,
        imageUrl,
        duration,
        title,
        taskId: task_id,
      }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("check-soul-sound-status error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
