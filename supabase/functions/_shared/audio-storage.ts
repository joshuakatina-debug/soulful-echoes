// deno-lint-ignore-file no-explicit-any
// Shared helpers for persisting Soul Sound audio into Supabase Storage so
// generated MP3s remain playable long after the upstream MusicAPI / Suno
// CDN expires the original file.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export const SOUL_SOUNDS_BUCKET = "soul-sounds";
export const STORAGE_URL_PREFIX = "storage://";
// Default sign duration when handing a URL back to the browser. 7 days is
// long enough that a single results-page session is never going to outlive
// it, and short enough that a leaked URL self-expires quickly.
export const DEFAULT_SIGN_SECONDS = 7 * 24 * 60 * 60;
// For URLs embedded in delivery emails we need them to outlive the user's
// inbox. Supabase allows arbitrarily long signed URLs; 5 years is plenty.
export const EMAIL_SIGN_SECONDS = 5 * 365 * 24 * 60 * 60;

export function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function isStorageUrl(u: string | null | undefined): u is string {
  return !!u && u.startsWith(STORAGE_URL_PREFIX);
}

export function storagePathFromUrl(u: string): string | null {
  if (!isStorageUrl(u)) return null;
  // storage://soul-sounds/<key>
  const rest = u.slice(STORAGE_URL_PREFIX.length);
  const slash = rest.indexOf("/");
  if (slash < 0) return null;
  return rest.slice(slash + 1);
}

export function buildStorageUrl(path: string): string {
  return `${STORAGE_URL_PREFIX}${SOUL_SOUNDS_BUCKET}/${path}`;
}

// Best-effort: download bytes from a (possibly expired) upstream audio URL.
// Returns null if the response is not a real audio payload — for example
// Suno's CDN serves an HTTP 200 with `content-type: audio/mp3` and a body
// of 0 bytes once the file is gone, which is exactly the silent breakage
// we are migrating away from.
export async function downloadAudio(
  url: string,
): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "audio/mpeg, audio/mp3, audio/*" },
    });
    if (!res.ok) {
      console.warn(`[audio-storage] download ${url} -> HTTP ${res.status}`);
      return null;
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength < 1024) {
      console.warn(
        `[audio-storage] download ${url} returned ${buf.byteLength} bytes — treating as expired`,
      );
      return null;
    }
    const contentType = res.headers.get("content-type") ?? "audio/mpeg";
    return { bytes: buf, contentType };
  } catch (e) {
    console.warn(`[audio-storage] download ${url} threw`, e);
    return null;
  }
}

// Uploads MP3 bytes to the private soul-sounds bucket and returns the
// `storage://` marker stored in soul_sounds.audio_url. Overwrites any
// existing object at the same key (idempotent for retries).
export async function uploadAudioToStorage(
  db: ReturnType<typeof adminClient>,
  key: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<string> {
  const { error } = await db.storage.from(SOUL_SOUNDS_BUCKET).upload(
    key,
    bytes,
    { contentType, upsert: true, cacheControl: "31536000" },
  );
  if (error) throw error;
  return buildStorageUrl(key);
}

// Convenience: download an upstream URL and persist it. Returns the
// `storage://` marker, or null if the upstream payload is empty/invalid.
export async function migrateUpstreamToStorage(
  db: ReturnType<typeof adminClient>,
  key: string,
  upstreamUrl: string,
): Promise<string | null> {
  const dl = await downloadAudio(upstreamUrl);
  if (!dl) return null;
  return uploadAudioToStorage(db, key, dl.bytes, dl.contentType);
}

// Resolve any audio_url value (storage:// marker OR a plain URL) into a
// URL the browser can actually play. Returns null when the input is
// missing. Signed URLs are minted on the fly for storage:// markers.
export async function resolveAudioUrl(
  db: ReturnType<typeof adminClient>,
  audioUrl: string | null | undefined,
  expiresIn: number = DEFAULT_SIGN_SECONDS,
): Promise<string | null> {
  if (!audioUrl) return null;
  if (!isStorageUrl(audioUrl)) return audioUrl;
  const path = storagePathFromUrl(audioUrl);
  if (!path) return null;
  const { data, error } = await db.storage
    .from(SOUL_SOUNDS_BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) {
    console.error("[audio-storage] createSignedUrl failed", path, error);
    return null;
  }
  return data?.signedUrl ?? null;
}

export function storageKeyFor(sessionId: string | null, taskId: string | null): string {
  const base = sessionId || taskId || crypto.randomUUID();
  // Strip anything outside the safe key alphabet so callers can pass raw
  // Stripe / MusicAPI identifiers directly.
  const safe = base.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${safe}.mp3`;
}
