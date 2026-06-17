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
  const ENDING = "Natural ending. No abrupt cutoff.";

  // Strip overused generic/corporate language.
  const BANNED = /\b(cinematic|polished|corporate|inspirational|anthemic|motivational)\b/gi;

  const labeledStyles = ORDER
    .map((cat) => {
      const raw = phraseFor(cat, answers[cat]);
      if (!raw) return null;
      const cleaned = raw.replace(BANNED, "").replace(/\s+/g, " ").trim();
      const short = shortPhrase(cleaned);
      return short || null;
    })
    .filter((s): s is string => Boolean(s));

  const cleanedKeywords = soulKeywords
    .map((k) => k.replace(BANNED, "").trim())
    .filter((k) => k.length > 0);

  const build = (keywords: string[], styles: string[]) => {
    const kwTop = keywords.slice(0, 3).join(", ");
    const character = kwTop ? ` Character: ${kwTop}.` : "";
    const sound = styles.length ? ` Sound: ${styles.join(", ")}.` : "";
    return (
      `Instrumental, no vocals. A personal soul theme for ${archetypeName}. ` +
      `Core feeling: ${coreEmotion}.${character}${sound} ` +
      `Intimate, human, emotionally specific. ${ENDING}`
    );
  };

  let keywords = cleanedKeywords.slice(0, 3);
  let styles = labeledStyles.slice();
  let prompt = build(keywords, styles);

  while (prompt.length > MAX && styles.length > 0) {
    styles.pop();
    prompt = build(keywords, styles);
  }
  while (prompt.length > MAX && keywords.length > 1) {
    keywords.pop();
    prompt = build(keywords, styles);
  }

  // Silence unused-var lint for stylePhrases (kept for backwards compat).
  void stylePhrases;

  return prompt;
}
