/**
 * QuizResult.ts
 *
 * Type definitions for the output of a completed quiz.
 *
 * A QuizResult captures everything the Soul Engine produces after the
 * user finishes all 12 questions: the raw answers, the computed score
 * profile, the matched archetype, and (eventually) the generated music
 * prompt. The UI will consume this object to render the results page.
 *
 * No logic lives here — only the shape of the data.
 */

import type { Archetype } from "./Archetype";
import type { OptionKey } from "./Question";

/** Map of questionId -> chosen option key. */
export type QuizAnswers = Record<number, OptionKey>;

/** Aggregated score profile across all scoring dimensions. */
export type ScoreProfile = Record<string, number>;

/** Final result returned by the Soul Engine. */
export interface QuizResult {
  /** Raw answers the user selected. */
  answers: QuizAnswers;
  /** Aggregated scores per dimension. */
  scores: ScoreProfile;
  /** Archetype matched via nearest-neighbor search. */
  archetype: Archetype;
  /** Optional generated prompt for the music composition step. */
  soundPrompt?: string;
  /** ISO timestamp when the result was computed. */
  computedAt: string;
}
