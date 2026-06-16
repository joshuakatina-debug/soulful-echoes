/**
 * promptGenerator.ts
 *
 * Soul Engine — Prompt Generator.
 *
 * Responsibility: turn a matched archetype plus the user's ScoreProfile
 * into a rich, descriptive prompt that a downstream music model can use
 * to compose the user's personalized Soul Sound. It combines the
 * archetype's base musical flavors with the per-dimension descriptors
 * defined in src/data/flavorMappings.ts.
 *
 * No generation logic is implemented yet — this file only defines the
 * function signature so the engine pipeline can be assembled.
 */

import type { Archetype } from "@/types/Archetype";
import type { ScoreProfile } from "@/types/QuizResult";
import type { FlavorMappings } from "@/data/flavorMappings";

/**
 * Build a music-composition prompt for a given archetype + profile.
 *
 * @param archetype  The user's matched archetype
 * @param scores  The user's aggregated score profile
 * @param flavors  Mapping tables translating scores into musical flavors
 * @returns A natural-language prompt string
 */
export function generateSoundPrompt(
  _archetype: Archetype,
  _scores: ScoreProfile,
  _flavors: FlavorMappings,
): string {
  // TODO: implement in a later milestone.
  return "";
}
