/**
 * Archetype.ts
 *
 * Type definitions for a Soul Sounds archetype.
 *
 * An Archetype is one of the curated "soul identities" a user can be
 * matched with after completing the quiz (e.g. "The Quiet Horizon",
 * "The Wandering Flame"). Each archetype has a coordinate in the same
 * scoring space used by questions, so the nearest-neighbor engine can
 * find the closest match to a user's profile.
 *
 * No logic lives here — only the shape of the data.
 */

/**
 * Coordinate of an archetype in the Soul Engine's scoring space.
 * Keys must match the dimensions used by question option weights.
 */
export type ArchetypeVector = Record<string, number>;

/** A single Soul Sounds archetype definition. */
export interface Archetype {
  /** Stable identifier, e.g. "quiet-horizon". */
  id: string;
  /** Display name, e.g. "The Quiet Horizon". */
  name: string;
  /** Short poetic identity statement shown on the results page. */
  identity: string;
  /** A handful of evocative keywords describing this archetype. */
  keywords: string[];
  /** Position in scoring space for nearest-neighbor matching. */
  vector: ArchetypeVector;
  /**
   * Musical flavor tags that the prompt generator will later combine
   * with user-specific flavor mappings to produce a composition prompt.
   */
  musicalFlavors?: string[];
}
