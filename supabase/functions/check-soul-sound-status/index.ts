interface StatusRequest {
  task_id: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

function pickFirst<T>(...values: Array<T | undefined | null>): T | null {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return null;
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

    const { task_id } = (await req.json()) as StatusRequest;
    if (!task_id) {
      return new Response(JSON.stringify({ error: "Missing task_id" }), {
        status: 400,
        headers: corsHeaders,
      });
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

    console.log(`[status] task_id=${task_id} full response:`, JSON.stringify(data));

    // Normalize across possible MusicAPI response shapes
    const root = data?.data ?? data;
    const output = root?.output ?? root?.result ?? {};
    const clipsCandidate =
      root?.clips ??
      root?.data?.clips ??
      output?.clips ??
      output?.songs ??
      output?.tracks ??
      root?.songs ??
      root?.tracks ??
      [];
    const clips: any[] = Array.isArray(clipsCandidate) ? clipsCandidate : [];
    const firstClip = clips[0] ?? {};

    const status = pickFirst<string>(
      root?.status,
      root?.state,
      output?.status,
      output?.state,
      firstClip?.status,
      firstClip?.state,
    );

    const progress = pickFirst<number>(
      root?.progress,
      output?.progress,
      firstClip?.progress,
    );

    const audio_url = pickFirst<string>(
      root?.audio_url,
      output?.audio_url,
      firstClip?.audio_url,
      firstClip?.audio,
      root?.audio,
      output?.audio,
      firstClip?.url,
      output?.url,
    );

    const image_url = pickFirst<string>(
      root?.image_url,
      output?.image_url,
      firstClip?.image_url,
      firstClip?.image,
      root?.image,
    );

    const duration = pickFirst<number>(
      root?.duration,
      output?.duration,
      firstClip?.duration,
      firstClip?.metadata?.duration,
    );

    console.log(
      `[status] task_id=${task_id} status=${status} progress=${progress} audio_url=${audio_url ? "yes" : "no"} clips=${clips.length}`,
    );

    return new Response(
      JSON.stringify({
        task_id,
        status,
        progress,
        audio_url,
        image_url,
        duration,
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
