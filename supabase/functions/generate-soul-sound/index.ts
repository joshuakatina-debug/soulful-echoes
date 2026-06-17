import { createClient } from "@supabase/supabase-js";

interface SoulSoundRequest {
  archetypeId: string;
  promptText: string;
  userId?: string;
}

Deno.serve(async (req: Request) => {
  // CORS headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const body: SoulSoundRequest = await req.json();
    const { archetypeId, promptText } = body;

    if (!archetypeId || !promptText) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: archetypeId, promptText" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // The MusicAPI.ai key is stored as a Supabase secret — accessed here via Deno.env.get()
    const musicApiKey = Deno.env.get("MUSICAPI_KEY");

    if (!musicApiKey) {
      console.error("MUSICAPI_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Music generation service is not configured" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Placeholder: MusicAPI.ai integration will be wired here in the next step.
    // The generated audio URL will be stored in Supabase Storage and returned.

    return new Response(
      JSON.stringify({
        success: true,
        message: "generate-soul-sound placeholder — MusicAPI.ai integration pending",
        archetypeId,
        promptPreview: promptText.substring(0, 200) + "...",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
