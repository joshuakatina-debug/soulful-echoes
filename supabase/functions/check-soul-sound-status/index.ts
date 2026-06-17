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

    // While generating, MusicAPI returns { type: "not_ready", error: "..." } — keep polling.
    if (data?.type === "not_ready") {
      console.log(`[status] task_id=${task_id} not_ready, continuing to poll`);
      return new Response(
        JSON.stringify({
          task_id,
          status: "pending",
          audioUrl: null,
          imageUrl: null,
          duration: null,
          title: null,
          taskId: task_id,
        }),
        { status: 200, headers: corsHeaders },
      );
    }

    const clips: any[] = Array.isArray(data?.data) ? data.data : [];
    const clip = clips[0] ?? {};

    const status: string | null = clip?.state ?? null;
    const audioUrl: string | null = clip?.audio_url ?? null;
    const imageUrl: string | null = clip?.image_url ?? null;
    const duration = clip?.duration ?? null;
    const title: string | null = clip?.title ?? null;

    console.log(
      `[status] task_id=${task_id} state=${status} audio_url=${audioUrl ? "yes" : "no"} clips=${clips.length}`,
    );

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
