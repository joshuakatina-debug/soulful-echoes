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
    ? `Compose this piece ${phrases.join(", ")}.`
    : "";

  return [foundation + ".", flavorSentence, PRODUCTION_RULES]
    .filter(Boolean)
    .join(" ");
}

/**
 * Build a SHORT music prompt (<400 chars) for MusicAPI's
 * gpt_description_prompt field. Truncates safely to 390 chars.
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

  const keywords = soulKeywords.join(", ");
  const style = phrases.join(", ");
  const prompt =
    `Instrumental only. No vocals. Create a ${coreEmotion} piece for ${archetypeName}. ` +
    `It should feel ${keywords}. Musical style: ${style}. ` +
    `Cinematic, emotional, high quality.`;

  return prompt.length > 390 ? prompt.slice(0, 390) : prompt;
}
