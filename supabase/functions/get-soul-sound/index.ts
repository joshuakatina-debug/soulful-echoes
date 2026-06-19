// deno-lint-ignore-file no-explicit-any
// Looks up the permanent Soul Sound record for a paid checkout session.
// This is the source-of-truth read used by the client on every page load.
//
// Behavior:
// - If audio_url is a `storage://` marker we mint a fresh signed URL.
// - If audio_url is a legacy upstream URL (e.g. audiopipe.suno.ai) we try
//   to migrate it into Storage on the fly. The upstream CDN serves an
//   HTTP 200 with a zero-byte body once the file is expired — that case
//   is treated as "no valid audio" and the row is downgraded to
//   `status='expired'` so the client can trigger a fresh generation
//   (generate-soul-sound only short-circuits on `status='ready'`).
import {
  adminClient,
  isStorageUrl,
  migrateUpstreamToStorage,
  resolveAudioUrl,
  storageKeyFor,
} from "../_shared/audio-storage.ts";

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

    const db = adminClient();

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

    let effectiveStatus: string = data.status;
    let effectiveAudioUrl: string | null = data.audio_url ?? null;

    // Legacy migration: copy the upstream audio into Storage on first
    // recovery so subsequent loads (and subsequent devices) get a stable
    // signed URL instead of an expired Suno link.
    if (
      effectiveStatus === "ready" &&
      effectiveAudioUrl &&
      !isStorageUrl(effectiveAudioUrl)
    ) {
      const key = storageKeyFor(data.session_id, data.task_id ?? null);
      const migrated = await migrateUpstreamToStorage(db, key, effectiveAudioUrl);
      if (migrated) {
        const { error: updErr } = await db
          .from("soul_sounds")
          .update({ audio_url: migrated })
          .eq("session_id", data.session_id);
        if (updErr) {
          console.error("[get-soul-sound] failed to persist migrated url", updErr);
        } else {
          console.log(
            `[get-soul-sound] migrated legacy audio for session ${data.session_id}`,
          );
        }
        effectiveAudioUrl = migrated;
      } else {
        // The upstream file is gone. Mark the row so the client can kick
        // off a one-off regeneration (generate-soul-sound will not
        // short-circuit because status !== 'ready').
        console.warn(
          `[get-soul-sound] legacy audio expired for session ${data.session_id}; marking as expired`,
        );
        const { error: updErr } = await db
          .from("soul_sounds")
          .update({
            status: "expired",
            audio_url: null,
            task_id: null,
            error_message: "upstream_audio_expired",
          })
          .eq("session_id", data.session_id);
        if (updErr) console.error("[get-soul-sound] expire mark failed", updErr);
        effectiveStatus = "expired";
        effectiveAudioUrl = null;
      }
    }

    const playable = await resolveAudioUrl(db, effectiveAudioUrl);

    return new Response(
      JSON.stringify({
        exists: true,
        sessionId: data.session_id,
        archetypeId: data.archetype_id,
        archetypeName: data.archetype_name,
        status: effectiveStatus,
        taskId: data.task_id,
        audioUrl: playable,
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
