/**
 * questions.ts
 *
 * Canonical source of the 12 Soul Sounds quiz questions.
 *
 * This file will hold the structured Question[] used by both the UI
 * (to render the journey) and the Soul Engine (to score answers).
 * Each option will eventually carry scoring weights that map into the
 * same dimensions used by archetypes.ts.
 *
 * For now this file only declares the export shape — no question data
 * has been migrated here yet. The live quiz still reads from
 * src/lib/quiz-data.ts; migration will happen in a later milestone.
 */

import type { Question } from "@/types/Question";

/** The official 12-question Soul Sounds quiz. To be populated. */
export const questions: Question[] = [];
