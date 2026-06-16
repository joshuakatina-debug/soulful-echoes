/**
 * archetypes.ts
 *
 * Canonical catalog of Soul Sounds archetypes.
 *
 * Each archetype defines a "soul identity" the user can be matched
 * with after completing the quiz. The nearest-neighbor engine compares
 * a user's score profile against each archetype's vector to determine
 * the closest match.
 *
 * This file only declares the export shape for now — the archetype
 * library will be authored in a later milestone.
 */

import type { Archetype } from "@/types/Archetype";

/** The full set of Soul Sounds archetypes. To be populated. */
export const archetypes: Archetype[] = [];
