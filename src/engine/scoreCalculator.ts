/**
 * scoreCalculator.ts
 *
 * Soul Engine — Score Calculator.
 *
 * Converts the user's raw quiz answers (A/B/C/D) into a 6-dimension
 * ScoreProfile in the same 1–5 space the archetypes live in.
 *
 * Per-answer point values:
 *   A = 1,  B = 2,  C = 4,  D = 5
 *
 * The six official Soul Sounds dimensions (see archetypes.ts):
 *   energy, focus, thinking, structure, risk, influence
 *
 * Each dimension is fed by a single question (Q1–Q6), so the raw
 * dimension value lands on the 1–5 scale that matches the archetype
 * vectors directly — no rescaling needed.
 *
 * This module is pure and React-free; it only depends on data/types.
 */

import type { OptionKey } from "@/types/Question";
import type { ArchetypeDimensions } from "@/data/archetypes";

export type DimensionKey = keyof ArchetypeDimensions;

export const DIMENSIONS: DimensionKey[] = [
  "energy",
  "focus",
  "thinking",
  "structure",
  "risk",
  "influence",
];

/** Point value awarded by each answer option. */
export const ANSWER_POINTS: Record<OptionKey, number> = {
  a: 1,
  b: 2,
  c: 4,
  d: 5,
};

/** A single quiz answer tagged with the dimension the question scores. */
export interface DimensionAnswer {
  dimension: DimensionKey;
  option: OptionKey;
}

/**
 * Aggregate per-dimension answers into a user ScoreProfile.
 *
 * Any dimension with no answers defaults to 0.
 */
export function calculateScores(
  answers: DimensionAnswer[],
): ArchetypeDimensions {
  const scores: ArchetypeDimensions = {
    energy: 0,
    focus: 0,
    thinking: 0,
    structure: 0,
    risk: 0,
    influence: 0,
  };

  for (const { dimension, option } of answers) {
    scores[dimension] += ANSWER_POINTS[option];
  }

  return scores;
}

