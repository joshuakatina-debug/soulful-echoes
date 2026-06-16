/**
 * nearestNeighbor.ts
 *
 * Soul Engine — Nearest Neighbor Matcher.
 *
 * Compares the user's 6-dimension ScoreProfile against every archetype
 * in the archetype data file and ranks them by weighted Manhattan
 * distance (sum of absolute differences, weighted per dimension).
 *
 * Dimension weights (lower distance == better match):
 *   energy     × 1
 *   focus      × 2
 *   thinking   × 1
 *   structure  × 1
 *   risk       × 1
 *   influence  × 2
 *
 * The matcher reads archetype vectors from src/data/archetypes.ts —
 * no archetype-specific logic is hardcoded here.
 */

import {
  archetypes as defaultArchetypes,
  type ArchetypeDimensions,
  type ArchetypeScoring,
} from "@/data/archetypes";
import { DIMENSIONS, type DimensionKey } from "./scoreCalculator";

/** Per-dimension weight applied to the absolute difference. */
export const DIMENSION_WEIGHTS: Record<DimensionKey, number> = {
  energy: 1,
  focus: 2,
  thinking: 1,
  structure: 1,
  risk: 1,
  influence: 2,
};


export interface ArchetypeMatch {
  archetype: ArchetypeScoring;
  /** Weighted sum of absolute differences. Lower = closer. */
  distance: number;
}

export interface NearestArchetypeResult {
  bestMatch: ArchetypeMatch;
  secondMatch: ArchetypeMatch | null;
  thirdMatch: ArchetypeMatch | null;
  /** Distance of the best match (kept for convenience / debugging). */
  totalScore: number;
  /** Full ranking, lowest distance first. */
  ranked: ArchetypeMatch[];
}

/** Weighted Manhattan distance between a user profile and an archetype. */
function weightedDistance(
  user: ArchetypeDimensions,
  archetype: ArchetypeDimensions,
): number {
  let total = 0;
  for (const dim of DIMENSIONS) {
    total += Math.abs(user[dim] - archetype[dim]) * DIMENSION_WEIGHTS[dim];
  }
  return total;
}

/**
 * Rank all archetypes against the user's score profile.
 *
 * Returns null only when the archetype catalog is empty.
 */
export function findNearestArchetype(
  userScores: ArchetypeDimensions,
  archetypes: ArchetypeScoring[] = defaultArchetypes,
): NearestArchetypeResult | null {
  if (archetypes.length === 0) return null;

  const ranked: ArchetypeMatch[] = archetypes
    .map((archetype) => ({
      archetype,
      distance: weightedDistance(userScores, archetype.dimensions),
    }))
    .sort((a, b) => a.distance - b.distance);

  return {
    bestMatch: ranked[0],
    secondMatch: ranked[1] ?? null,
    thirdMatch: ranked[2] ?? null,
    totalScore: ranked[0].distance,
    ranked,
  };
}
