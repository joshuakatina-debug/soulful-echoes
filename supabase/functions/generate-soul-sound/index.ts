interface GenerateRequest {
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

    const { promptText, shortPrompt } = (await req.json()) as GenerateRequest;
    const source = (shortPrompt ?? promptText ?? "").toString();
    if (!source) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Safety net: enforce MusicAPI's <400 char limit on gpt_description_prompt.
    const finalPrompt = source.length > MAX_PROMPT_LEN
      ? source.slice(0, MAX_PROMPT_LEN)
      : source;
    console.log(`MusicAPI prompt length: ${finalPrompt.length}`);

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

    console.log("[create] full response:", JSON.stringify(data));

    // MusicAPI may return task_id at top level or nested under data
    const taskId =
      data?.task_id ??
      data?.data?.task_id ??
      data?.id ??
      data?.data?.id ??
      null;

    console.log(`[create] task_id=${taskId}`);

    if (!taskId) {
      console.error("MusicAPI response missing task_id", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "No task_id returned by music service" }),
        { status: 502, headers: corsHeaders },
      );
    }

    return new Response(JSON.stringify({ task_id: taskId }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("generate-soul-sound error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
