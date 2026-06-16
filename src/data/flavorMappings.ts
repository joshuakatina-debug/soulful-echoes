/**
 * flavorMappings.ts
 *
 * Mapping tables that translate Soul Engine scoring dimensions into
 * musical "flavor" descriptors (tempo, instrumentation, mood, warmth,
 * atmosphere, intensity, etc.).
 *
 * The prompt generator will combine an archetype's base musical
 * flavors with these per-dimension mappings to produce a rich,
 * personalized prompt for the music composition step.
 *
 * This file only declares the export shape for now — mappings will be
 * authored in a later milestone.
 */

/**
 * A mapping from a scoring dimension (e.g. "tempo", "warmth") to a
 * lookup of bucketed values and their descriptive flavor strings.
 *
 * Example (future):
 *   { tempo: { low: "slow and meditative", high: "driving and alive" } }
 */
export type FlavorMappings = Record<string, Record<string, string>>;

/** Master flavor mapping table. To be populated. */
export const flavorMappings: FlavorMappings = {};
