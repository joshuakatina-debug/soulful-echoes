// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import {
  EMAIL_SIGN_SECONDS,
  resolveAudioUrl,
} from "../_shared/audio-storage.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

const SITE_URL = "https://getsoulsounds.com";

const ARCHETYPES: Record<string, { name: string; coreEmotion: string; soulIdentity: string }> = {
  idealist: { name: "The Idealist", coreEmotion: "Quiet Conviction", soulIdentity: "You believe that the world changes one quiet act of integrity at a time. Guided by a deep sense of purpose, you strive to live in alignment with your values even when no one is watching. You are thoughtful, patient, and steady, believing that true influence comes through character rather than recognition. While others may chase quick results, you understand that lasting change is built slowly through consistency, humility, and hope. Your life reminds others that doing what is right is always worth pursuing." },
  activist: { name: "The Activist", coreEmotion: "Purposeful Resolve", soulIdentity: "You are driven by a desire to make the world a better place and to help others become their best selves. You combine strong principles with genuine compassion, stepping forward when others need guidance or encouragement. Your passion is contagious, and your heart is always searching for ways to serve a greater purpose. You inspire people through both your convictions and your kindness." },
  companion: { name: "The Companion", coreEmotion: "Gentle Compassion", soulIdentity: "You have a gift for seeing the needs of others and responding with warmth, generosity, and care. People feel valued in your presence because you naturally offer encouragement, support, and understanding. Your kindness is grounded in strong values, making you both dependable and nurturing. You bring comfort to others simply by being yourself." },
  anchor: { name: "The Anchor", coreEmotion: "Joyful Belonging", soulIdentity: "You have a remarkable ability to make people feel welcomed, appreciated, and celebrated. Your warmth draws others in, while your energy motivates them to become the best version of themselves. You thrive when building connections and creating meaningful experiences. Wherever you go, you bring a sense of belonging and joy." },
  champion: { name: "The Champion", coreEmotion: "Victorious Hope", soulIdentity: "You are ambitious, charismatic, and deeply motivated to make a positive impact. Your confidence inspires others, and your ability to connect with people allows you to lead with both strength and heart. You naturally encourage those around you to dream bigger and achieve more. Your greatest gift is helping others believe in what is possible." },
  achiever: { name: "The Achiever", coreEmotion: "Focused Excellence", soulIdentity: "You are driven to master your craft and leave a meaningful mark on the world. You combine determination with creativity, always seeking excellence while remaining true to your individuality. People admire your competence, vision, and dedication. You show others that success is most fulfilling when it reflects who you truly are." },
  muse: { name: "The Muse", coreEmotion: "Inspired Wonder", soulIdentity: "You bring passion, creativity, and emotional depth to everything you do. You are uniquely attuned to beauty, meaning, and self-expression, yet you also possess the drive to share your gifts with the world. Your authenticity inspires others to embrace their own uniqueness. You remind people that life is meant to be lived vividly and wholeheartedly." },
  imagineer: { name: "The Imagineer", coreEmotion: "Quiet Wonder", soulIdentity: "You see the world through a lens of imagination, wonder, and profound insight. Deeply independent and creative, you are drawn to ideas, experiences, and emotions that others may overlook. Your originality allows you to uncover hidden beauty and meaning in everyday life. You inspire others to embrace their true selves without apology." },
  philosopher: { name: "The Philosopher", coreEmotion: "Quiet Wisdom", soulIdentity: "You possess a deep and curious mind that seeks understanding beneath the surface of things. Thoughtful, introspective, and imaginative, you are constantly exploring life's mysteries and asking meaningful questions. Your wisdom often emerges from quiet reflection, offering perspectives that help others see the world in new ways. You remind people that knowledge can be both practical and beautiful." },
  architect: { name: "The Architect", coreEmotion: "Confident Clarity", soulIdentity: "You are a natural problem solver with a talent for understanding complex situations. Thoughtful, observant, and dependable, you excel at finding solutions where others see obstacles. Your calm, analytical approach brings clarity during uncertainty. People trust your judgment because you combine intelligence with reliability." },
  guardian: { name: "The Guardian", coreEmotion: "Steady Security", soulIdentity: "You are steadfast, thoughtful, and deeply committed to protecting what matters most. You value loyalty, responsibility, and preparedness, helping create stability for those around you. Your careful judgment allows you to anticipate challenges and navigate them with wisdom. Others find strength in your dependability and trustworthiness." },
  confidant: { name: "The Confidant", coreEmotion: "Faithful Hope", soulIdentity: "You bring together loyalty, warmth, and an uplifting spirit. People are naturally drawn to you because they know they can count on your support and honesty. You help others feel safe while encouraging them to embrace new possibilities. Your combination of reliability and optimism makes you a trusted friend and companion." },
  pathfinder: { name: "The Pathfinder", coreEmotion: "Joyful Discovery", soulIdentity: "You are fueled by curiosity, possibility, and a love of life's adventures. You naturally see opportunities where others see obstacles, approaching each day with enthusiasm and optimism. Your adventurous spirit encourages people to step beyond their comfort zones and embrace the unknown with confidence. You remind others that some of life's greatest rewards are found by simply taking the first step." },
  adventurer: { name: "The Adventurer", coreEmotion: "Fearless Momentum", soulIdentity: "You combine bold ambition with the confidence to turn possibility into reality. Energetic, resilient, and decisive, you embrace challenges with an unwavering belief that growth comes through action. Rather than waiting for opportunities to appear, you create them. Your fearless determination inspires others to pursue their dreams with courage and conviction." },
  maverick: { name: "The Maverick", coreEmotion: "Unshakable Courage", soulIdentity: "You are bold, independent, and fiercely committed to living life on your own terms. You challenge limitations, embrace freedom, and inspire others to pursue their convictions without fear. Your courage gives people permission to think differently, act boldly, and refuse to settle for less than what they believe is possible. Your greatest strength is empowering others to discover their own." },
  bear: { name: "The Bear", coreEmotion: "Quiet Strength", soulIdentity: "You possess a quiet strength that makes others feel safe and protected. Calm yet powerful, you stand firmly for the people and values you care about. You lead through presence rather than force, offering stability during difficult times. Your courage is matched by your compassion, reminding others that true strength is measured by the lives it protects." },
  dreamer: { name: "The Dreamer", coreEmotion: "Quiet Hope", soulIdentity: "You see the world through a lens of hope, harmony, and possibility. Gentle, thoughtful, and idealistic, you seek peace while believing in a better future. Your calming presence helps others slow down, reflect, and reconnect with what truly matters. You inspire people to pursue harmony without losing sight of their deepest values, reminding them that hope is often the quiet force that changes the world." },
  peacemaker: { name: "The Peacemaker", coreEmotion: "Quiet Harmony", soulIdentity: "You have a rare ability to bring people together while remaining grounded in your own strength. Calm under pressure and naturally diplomatic, you help resolve conflict and create understanding. People trust you because you listen deeply and act with fairness. Your presence reminds others that strength and peace can coexist, and that unity is often built through quiet wisdom rather than loud persuasion." },
};

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtml(opts: {
  archetypeName: string;
  coreEmotion: string;
  coreIdentity: string;
  resultsUrl: string;
  audioUrl: string;
}) {
  const { archetypeName, coreEmotion, coreIdentity, resultsUrl, audioUrl } = opts;
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Your Soul Sound is Ready</title></head>
<body style="margin:0;padding:0;background:#f5f2ec;font-family:Georgia,'Times New Roman',serif;color:#2a2724;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f2ec;padding:48px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;padding:48px 40px;">
        <tr><td style="text-align:center;font-size:13px;letter-spacing:0.24em;text-transform:uppercase;color:#8a8276;padding-bottom:32px;">Soul Sounds</td></tr>
        <tr><td style="text-align:center;font-size:28px;line-height:1.3;color:#2a2724;padding-bottom:8px;">Your Soul Sound is ready</td></tr>
        <tr><td style="text-align:center;font-size:18px;color:#5a5347;padding-bottom:32px;font-style:italic;">${escapeHtml(archetypeName)}</td></tr>
        <tr><td style="padding-bottom:24px;">
          <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8276;padding-bottom:6px;">Core Emotion</div>
          <div style="font-size:17px;color:#2a2724;">${escapeHtml(coreEmotion)}</div>
        </td></tr>
        <tr><td style="padding-bottom:36px;">
          <div style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#8a8276;padding-bottom:6px;">Core Identity</div>
          <div style="font-size:16px;line-height:1.65;color:#3d3833;">${escapeHtml(coreIdentity)}</div>
        </td></tr>
        <tr><td align="center" style="padding-bottom:20px;">
          <a href="${resultsUrl}" style="display:inline-block;background:#2a2724;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:999px;font-size:15px;letter-spacing:0.05em;">Listen to Your Soul Sound</a>
        </td></tr>
        <tr><td align="center" style="padding-bottom:40px;">
          <a href="${audioUrl}" style="color:#5a5347;font-size:14px;text-decoration:underline;">Download Your Soul Sound</a>
        </td></tr>
        <tr><td style="border-top:1px solid #e8e3da;padding-top:28px;text-align:center;font-size:14px;line-height:1.6;color:#5a5347;">
          Thank you for allowing us to create something uniquely yours.<br><br>
          — Soul Sounds
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildText(opts: { archetypeName: string; coreEmotion: string; coreIdentity: string; resultsUrl: string; audioUrl: string; }) {
  return `Your Soul Sound is ready

${opts.archetypeName}

Core Emotion: ${opts.coreEmotion}

Core Identity:
${opts.coreIdentity}

Listen to Your Soul Sound: ${opts.resultsUrl}
Download Your Soul Sound: ${opts.audioUrl}

Thank you for allowing us to create something uniquely yours.

— Soul Sounds`;
}

async function fetchStripeEmail(sessionId: string): Promise<string | null> {
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecret) return null;
  try {
    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${stripeSecret}` } },
    );
    const data = await res.json();
    if (!res.ok) {
      console.error("[email] stripe fetch failed", data);
      return null;
    }
    return data?.customer_details?.email ?? data?.customer_email ?? null;
  } catch (e) {
    console.error("[email] stripe fetch error", e);
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Feature flag: temporarily disable transactional email sending.
    // Set EMAIL_ENABLED=true in Supabase Secrets to re-enable.
    const emailEnabled =
      (Deno.env.get("EMAIL_ENABLED") ?? "false").toLowerCase() === "true";
    if (!emailEnabled) {
      console.log("[email] skipped — EMAIL_ENABLED flag is off");
      return new Response(
        JSON.stringify({ skipped: true, reason: "email_disabled" }),
        { status: 200, headers: corsHeaders },
      );
    }

    const { session_id } = (await req.json().catch(() => ({}))) as {
      session_id?: string;
    };
    if (!session_id) {
      return new Response(JSON.stringify({ error: "Missing session_id" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const db = admin();
    const { data: row, error: rowErr } = await db
      .from("soul_sounds")
      .select(
        "session_id, status, audio_url, archetype_id, archetype_name, customer_email, email_sent_at",
      )
      .eq("session_id", session_id)
      .maybeSingle();

    if (rowErr || !row) {
      console.error("[email] row lookup failed", rowErr);
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    if (row.status !== "ready" || !row.audio_url) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "not_ready" }),
        { status: 200, headers: corsHeaders },
      );
    }

    if (row.email_sent_at) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "already_sent" }),
        { status: 200, headers: corsHeaders },
      );
    }

    // Resolve customer email — from cache or from Stripe.
    let email = row.customer_email ?? null;
    if (!email) {
      email = await fetchStripeEmail(session_id);
      if (email) {
        await db
          .from("soul_sounds")
          .update({ customer_email: email })
          .eq("session_id", session_id);
      }
    }

    if (!email) {
      await db
        .from("soul_sounds")
        .update({
          email_status: "failed",
          email_error: "No customer email on Stripe session",
        })
        .eq("session_id", session_id);
      return new Response(
        JSON.stringify({ error: "No customer email" }),
        { status: 422, headers: corsHeaders },
      );
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("FROM_EMAIL") ?? "hello@getsoulsounds.com";
    if (!resendKey) {
      await db
        .from("soul_sounds")
        .update({
          email_status: "failed",
          email_error: "RESEND_API_KEY not configured",
        })
        .eq("session_id", session_id);
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 503, headers: corsHeaders },
      );
    }

    const archetypeId = (row.archetype_id ?? "").toLowerCase();
    const meta = ARCHETYPES[archetypeId];
    const archetypeName = row.archetype_name ?? meta?.name ?? "Your Soul Archetype";
    const coreEmotion = meta?.coreEmotion ?? "";
    const coreIdentity = meta?.soulIdentity ?? "";

    const playableAudioUrl =
      (await resolveAudioUrl(db, row.audio_url, EMAIL_SIGN_SECONDS)) ??
      row.audio_url;

    const resultsUrl = `${SITE_URL}/results?session_id=${encodeURIComponent(session_id)}`;
    const html = buildHtml({
      archetypeName,
      coreEmotion,
      coreIdentity,
      resultsUrl,
      audioUrl: playableAudioUrl,
    });
    const text = buildText({
      archetypeName,
      coreEmotion,
      coreIdentity,
      resultsUrl,
      audioUrl: playableAudioUrl,
    });

    const fromHeader = `Soul Sounds <${fromEmail}>`;
    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromHeader,
        to: [email],
        subject: "Your Soul Sound is Ready",
        html,
        text,
      }),
    });

    const sendData: any = await sendRes.json().catch(() => ({}));

    if (!sendRes.ok) {
      const errMsg =
        sendData?.message ?? sendData?.error ?? `Resend ${sendRes.status}`;
      console.error("[email] resend failed", sendRes.status, sendData);
      await db
        .from("soul_sounds")
        .update({
          email_status: "failed",
          email_error: String(errMsg).slice(0, 500),
        })
        .eq("session_id", session_id);
      return new Response(
        JSON.stringify({ error: "Email send failed" }),
        { status: 502, headers: corsHeaders },
      );
    }

    await db
      .from("soul_sounds")
      .update({
        email_sent_at: new Date().toISOString(),
        email_status: "sent",
        email_error: null,
      })
      .eq("session_id", session_id);

    console.log(`[email] sent to ${email} session=${session_id}`);
    return new Response(
      JSON.stringify({ sent: true, id: sendData?.id ?? null }),
      { status: 200, headers: corsHeaders },
    );
  } catch (e) {
    console.error("send-soul-sound-email error", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
