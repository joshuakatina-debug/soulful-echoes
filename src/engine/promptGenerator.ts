/**
 * promptGenerator.ts
 *
 * Soul Engine — Prompt Generator.
 *
 * Combines an archetype's `promptFoundation` with the user's
 * Questions 7–12 answers (Tempo, Instrumentation, Mood, Warmth,
 * Atmosphere, Intensity) via the official flavor mappings, then
 * appends the standard production rules.
 *
 * No music generation happens here — this only produces the
 * natural-language prompt string.
 */

import {
  flavorMappings,
  PRODUCTION_RULES,
  type FlavorCategory,
  type FlavorOption,
} from "@/data/flavorMappings";

export interface FlavorAnswers {
  tempo?: FlavorOption;
  instrumentation?: FlavorOption;
  mood?: FlavorOption;
  warmth?: FlavorOption;
  atmosphere?: FlavorOption;
  intensity?: FlavorOption;
}

const ORDER: FlavorCategory[] = [
  "tempo",
  "instrumentation",
  "mood",
  "warmth",
  "atmosphere",
  "intensity",
];

function phraseFor(category: FlavorCategory, option?: FlavorOption): string | null {
  if (!option) return null;
  return flavorMappings[category][option] ?? null;
}

/**
 * Build the full Soul Sounds music composition prompt.
 *
 * @param promptFoundation  The archetype's foundation sentence.
 * @param answers           User's selected options for Q7–Q12.
 */
export function generateSoundPrompt(
  promptFoundation: string,
  answers: FlavorAnswers,
): string {
  const phrases = ORDER
    .map((cat) => phraseFor(cat, answers[cat]))
    .filter((p): p is string => Boolean(p));

  const foundation = promptFoundation.trim().replace(/[.!?]+$/, "");
  const flavorSentence = phrases.length
    ? `Let the music move ${phrases.join(", ")}.`
    : "";

  return [foundation + ".", flavorSentence, PRODUCTION_RULES]
    .filter(Boolean)
    .join(" ");
}

/**
 * Build a SHORT music prompt (<=390 chars) for MusicAPI's
 * gpt_description_prompt field. Keeps flavor phrases intact rather
 * than reducing them to single words.
 */
export function generateShortMusicPrompt(params: {
  archetypeName: string;
  coreEmotion: string;
  soulKeywords: string[];
  answers: FlavorAnswers;
}): string {
  const { archetypeName, coreEmotion, soulKeywords, answers } = params;

  const phrases = ORDER
    .map((cat) => phraseFor(cat, answers[cat]))
    .filter((p): p is string => Boolean(p));

  const keywords = soulKeywords.slice(0, 3).join(", ");

  const base =
    `Private instrumental soul theme for ${archetypeName}. ` +
    `Core feeling: ${coreEmotion}. ` +
    (keywords ? `Character: ${keywords}. ` : "") +
    (phrases.length ? `Sound: ${phrases.slice(0, 3).join("; ")}. ` : "") +
    `Intimate, restrained, human, handmade. Avoid corporate, stock, trailer, motivational, generic cinematic music. Natural ending.`;

  return base.length > 390 ? base.slice(0, 387).trimEnd() + "..." : base;
}
