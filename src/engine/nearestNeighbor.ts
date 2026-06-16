/**
 * nearestNeighbor.ts
 *
 * Soul Engine — Nearest Neighbor Matcher.
 *
 * Responsibility: given a user's ScoreProfile and the full archetype
 * catalog, return the archetype whose vector is closest to the user's
 * profile in scoring space (typically by Euclidean or cosine distance).
 *
 * No matching logic is implemented yet — this file only defines the
 * function signature so downstream consumers can be scaffolded.
 */

import type { Archetype } from "@/types/Archetype";
import type { ScoreProfile } from "@/types/QuizResult";

/**
 * Find the archetype closest to the given score profile.
 *
 * @param scores  Aggregated user scores
 * @param archetypes  Catalog of candidate archetypes
 * @returns The best-matching archetype, or null if none can be matched
 */
export function findNearestArchetype(
  _scores: ScoreProfile,
  _archetypes: Archetype[],
): Archetype | null {
  // TODO: implement in a later milestone.
  return null;
}
