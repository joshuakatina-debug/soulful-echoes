/**
 * Question.ts
 *
 * Type definitions for a single Soul Sounds quiz question.
 *
 * A Question represents one step in the 12-question personality journey.
 * Each question belongs to a category (Energy, Focus, Thinking, etc.) and
 * exposes four answer options (a, b, c, d). Every option carries the
 * scoring weights that the Soul Engine will later use to compute an
 * archetype profile.
 *
 * No logic lives here — only the shape of the data.
 */

/** Identifier for one of the four possible answers on a question. */
export type OptionKey = "a" | "b" | "c" | "d";

/**
 * Scoring weights attached to a single answer option.
 *
 * The Soul Engine will read these values to build a multidimensional
 * profile of the user. Concrete dimension names will be finalized in a
 * later milestone; for now this is an open-ended record so the data
 * layer can evolve without breaking types.
 */
export type OptionWeights = Record<string, number>;

/** A single selectable answer within a question. */
export interface QuestionOption {
  /** Stable key used for selection state and scoring. */
  key: OptionKey;
  /** Human-readable label shown in the UI. */
  label: string;
  /** Scoring contribution applied when this option is chosen. */
  weights?: OptionWeights;
}

/** A single quiz question. */
export interface Question {
  /** Stable numeric id (1–12). */
  id: number;
  /** Short category label, e.g. "Energy", "Focus", "Thinking". */
  category: string;
  /** Main question text shown to the user. */
  question: string;
  /** Optional secondary line displayed under the question. */
  subtitle?: string;
  /** The four answer options. */
  options: QuestionOption[];
}
