/**
 * flavorMappings.ts
 *
 * Official Soul Sounds flavor mappings.
 *
 * Translates Questions 7–12 (Tempo, Instrumentation, Mood, Warmth,
 * Atmosphere, Intensity) into natural-language musical phrases that
 * the prompt generator combines with each archetype's
 * `promptFoundation` to produce a personalized composition prompt.
 *
 * Keys (a/b/c/d) match the option values used by the quiz.
 */

export type FlavorOption = "a" | "b" | "c" | "d";
export type FlavorCategory =
  | "tempo"
  | "instrumentation"
  | "mood"
  | "warmth"
  | "atmosphere"
  | "intensity";

export type FlavorMappings = Record<FlavorCategory, Record<FlavorOption, string>>;

export const flavorMappings: FlavorMappings = {
  tempo: {
    a: "at a slow, unhurried tempo around 60 BPM",
    b: "at a relaxed, gently flowing tempo near 80 BPM",
    c: "at an energetic, forward-moving tempo around 110 BPM",
    d: "at a fast, lively tempo near 130 BPM",
  },
  instrumentation: {
    a: "built around acoustic instruments — piano, strings, and soft woodwinds",
    b: "primarily acoustic, with a few subtle modern textures woven through",
    c: "a balanced blend of acoustic warmth and modern electronic textures",
    d: "rooted in modern electronic sounds and richly layered synths",
  },
  mood: {
    a: "with a deeply reflective emotional tone",
    b: "with a calm, thoughtful emotional tone",
    c: "with a bright, optimistic emotional tone",
    d: "with a joyful, celebratory emotional tone",
  },
  warmth: {
    a: "rendered with an intimate, close, personal warmth",
    b: "rendered with a warm, inviting presence",
    c: "rendered with an open, spacious sense of air",
    d: "rendered with a grand, cinematic openness",
  },
  atmosphere: {
    a: "set within an organic atmosphere of forests, mountains, and natural air",
    b: "set within a cozy, grounded natural atmosphere",
    c: "set within a dreamlike, ethereal landscape",
    d: "set beneath vast skies and a sweeping, celestial expanse",
  },
  intensity: {
    a: "carried with a gentle, tender dynamic intensity",
    b: "carried with calm but confident dynamics",
    c: "carried with bold, assertive dynamics",
    d: "carried with powerful, commanding dynamics",
  },
};

/** Standard Soul Sounds production rules, appended to every prompt. */
export const PRODUCTION_RULES =
  "Production: fully instrumental, no vocals and no lyrics, high-fidelity studio mix, smooth and natural dynamic range, seamless arrangement approximately 2–3 minutes in length, mastered for emotional clarity and immersive, headphone-ready listening.";

/** Maps a quiz category label to its flavor mapping key. */
export const CATEGORY_TO_FLAVOR: Record<string, FlavorCategory> = {
  Tempo: "tempo",
  Instrumentation: "instrumentation",
  Mood: "mood",
  Warmth: "warmth",
  Atmosphere: "atmosphere",
  Intensity: "intensity",
};
