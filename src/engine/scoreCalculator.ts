/**
 * scoreCalculator.ts
 *
 * Soul Engine — Score Calculator.
 *
 * Responsibility: take the user's raw quiz answers and the question
 * catalog, and aggregate the option weights into a multidimensional
 * ScoreProfile. This profile is the input to the nearest-neighbor
 * archetype matcher.
 *
 * No scoring logic is implemented yet — this file only defines the
 * function signature so the rest of the engine can be wired up
 * incrementally without breaking types.
 */

import type { Question } from "@/types/Question";
import type { QuizAnswers, ScoreProfile } from "@/types/QuizResult";

/**
 * Aggregate answer weights into a ScoreProfile.
 *
 * @param answers  Map of questionId -> selected option key
 * @param questions  The question catalog (with option weights)
 * @returns A ScoreProfile keyed by scoring dimension
 */
export function calculateScores(
  _answers: QuizAnswers,
  _questions: Question[],
): ScoreProfile {
  // TODO: implement in a later milestone.
  return {};
}
