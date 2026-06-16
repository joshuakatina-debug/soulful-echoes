/**
 * soul-result.ts
 *
 * Bridge between the quiz UI (localStorage answers) and the Soul Engine.
 *
 * Reads the answers stored by /quiz, runs them through the scoring
 * engine, and persists the result so /results can display it.
 *
 * Notes on dimension mapping:
 *   Only Questions 1–6 feed scoring. Their categories map onto the
 *   archetype data dimensions positionally:
 *
 *     Q1 Energy    -> energy
 *     Q2 Focus     -> focus
 *     Q3 Thinking  -> warmth     (spec name "Thinking")
 *     Q4 Structure -> structure
 *     Q5 Risk      -> risk
 *     Q6 Influence -> intensity  (spec name "Influence")
 *
 * Answer values:
 *   A = 1, B = 2, C = 4, D = 5
 *
 * The archetype vectors live on a 0–10 scale (and each archetype dim
 * is fed by two questions in the long-form spec), so single-question
 * dimension scores are doubled to land in the same 0–10 space.
 */

import {
  archetypes,
  type ArchetypeDimensions,
  type ArchetypeScoring,
} from "@/data/archetypes";
import { findNearestArchetype } from "@/engine/nearestNeighbor";
import type { OptionKey } from "@/types/Question";

export const RESULT_STORAGE_KEY = "soul-sounds:result";

const ANSWER_POINTS: Record<OptionKey, number> = { a: 1, b: 2, c: 4, d: 5 };

/** Quiz category (Q1–Q6) -> archetype dimension key. */
const CATEGORY_TO_DIMENSION: Record<string, keyof ArchetypeDimensions> = {
  Energy: "energy",
  Focus: "focus",
  Thinking: "warmth",
  Structure: "structure",
  Risk: "risk",
  Influence: "intensity",
};

export interface StoredMatch {
  id: string;
  displayName: string;
  distance: number;
}

export interface StoredSoulResult {
  scores: ArchetypeDimensions;
  bestMatch: StoredMatch;
  secondMatch: StoredMatch | null;
  thirdMatch: StoredMatch | null;
  totalScore: number;
  computedAt: string;
}

function toStoredMatch(m: {
  archetype: ArchetypeScoring;
  distance: number;
}): StoredMatch {
  return {
    id: m.archetype.id,
    displayName: m.archetype.displayName,
    distance: m.distance,
  };
}

/**
 * Build a user score profile from quiz answers.
 *
 * @param answers          questionId -> selected option ("a" | "b" | "c" | "d")
 * @param categoryLookup   questionId -> question category string
 */
export function buildScoreProfile(
  answers: Record<number, string>,
  categoryLookup: Record<number, string>,
): ArchetypeDimensions {
  const profile: ArchetypeDimensions = {
    energy: 0,
    focus: 0,
    structure: 0,
    risk: 0,
    warmth: 0,
    intensity: 0,
  };

  for (const [qid, option] of Object.entries(answers)) {
    const category = categoryLookup[Number(qid)];
    const dim = CATEGORY_TO_DIMENSION[category];
    if (!dim) continue; // Q7–Q12 do not feed scoring
    const points = ANSWER_POINTS[option as OptionKey];
    if (points === undefined) continue;
    profile[dim] += points * 2; // scale 1/2/4/5 -> 2/4/8/10
  }

  return profile;
}

/** Run the engine and produce a result ready to persist. */
export function computeSoulResult(
  answers: Record<number, string>,
  categoryLookup: Record<number, string>,
): StoredSoulResult | null {
  const scores = buildScoreProfile(answers, categoryLookup);
  const result = findNearestArchetype(scores, archetypes);
  if (!result) return null;

  return {
    scores,
    bestMatch: toStoredMatch(result.bestMatch),
    secondMatch: result.secondMatch ? toStoredMatch(result.secondMatch) : null,
    thirdMatch: result.thirdMatch ? toStoredMatch(result.thirdMatch) : null,
    totalScore: result.totalScore,
    computedAt: new Date().toISOString(),
  };
}

export function saveSoulResult(result: StoredSoulResult): void {
  try {
    localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
  } catch {
    /* ignore */
  }
}

export function loadSoulResult(): StoredSoulResult | null {
  try {
    const raw = localStorage.getItem(RESULT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredSoulResult;
  } catch {
    return null;
  }
}
