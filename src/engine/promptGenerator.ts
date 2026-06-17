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
 * Build a SHORT music prompt (<=350 chars) for MusicAPI's
 * gpt_description_prompt field. Shortens by removing adjectives
 * rather than truncating mid-sentence.
 */
export function generateShortMusicPrompt(params: {
  archetypeName: string;
  coreEmotion: string;
  soulKeywords: string[];
  answers: FlavorAnswers;
}): string {
  const { archetypeName, coreEmotion, soulKeywords, answers } = params;

  // Shorten a style phrase to its last word (e.g. "warm and intimate" -> "intimate").
  const shortPhrase = (p: string) => {
    const cleaned = p.replace(/[.,;]/g, "").trim();
    const words = cleaned.split(/\s+/);
    return words[words.length - 1] || cleaned;
  };

  const stylePhrases = ORDER
    .map((cat) => phraseFor(cat, answers[cat]))
    .filter((p): p is string => Boolean(p))
    .map(shortPhrase);

  const MAX = 350;

  const build = (keywords: string[], styles: string[]) => {
    const kw = keywords.join(", ");
    const st = styles.join(", ");
    const styleSegment = st ? ` Style: ${st}.` : "";
    return (
      `Instrumental, no vocals. ${archetypeName}. ` +
      `Core emotion: ${coreEmotion}. ` +
      `Feel: ${kw}.${styleSegment} ` +
      `Cinematic, emotional, polished.`
    );
  };

  let keywords = soulKeywords.slice(0, 5);
  let styles = stylePhrases.slice();
  let prompt = build(keywords, styles);

  // Drop style phrases from the end until under the limit.
  while (prompt.length > MAX && styles.length > 0) {
    styles.pop();
    prompt = build(keywords, styles);
  }
  // Then drop keywords from the end.
  while (prompt.length > MAX && keywords.length > 1) {
    keywords.pop();
    prompt = build(keywords, styles);
  }

  return prompt;
}
