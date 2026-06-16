/**
 * archetypes.ts
 *
 * Soul Sounds — Archetype scoring data.
 *
 * This file holds ONLY the data the Soul Engine needs to match a user
 * to an archetype: a stable id, a human display name, and six
 * dimension values in the range 0–10. Presentation copy (identity,
 * keywords, emotional journey, etc.) lives separately in
 * archetypeContent.ts, keyed by the same id.
 *
 * The six dimensions are the core axes of the Soul Engine:
 *   - energy      (0 = stillness, 10 = vitality)
 *   - focus       (0 = open / wandering, 10 = sharp / directed)
 *   - structure   (0 = fluid / improvisational, 10 = ordered / composed)
 *   - risk        (0 = grounded / safe, 10 = daring / exploratory)
 *   - warmth      (0 = cool / spacious, 10 = warm / intimate)
 *   - intensity   (0 = gentle, 10 = powerful)
 */

export interface ArchetypeDimensions {
  energy: number;
  focus: number;
  structure: number;
  risk: number;
  warmth: number;
  intensity: number;
}

export interface ArchetypeScoring {
  id: string;
  displayName: string;
  dimensions: ArchetypeDimensions;
}

export const archetypes: ArchetypeScoring[] = [
  {
    id: "dreamer",
    displayName: "The Dreamer",
    dimensions: { energy: 3, focus: 2, structure: 2, risk: 6, warmth: 7, intensity: 3 },
  },
  {
    id: "sage",
    displayName: "The Sage",
    dimensions: { energy: 3, focus: 9, structure: 8, risk: 3, warmth: 5, intensity: 4 },
  },
  {
    id: "wanderer",
    displayName: "The Wanderer",
    dimensions: { energy: 6, focus: 3, structure: 2, risk: 8, warmth: 6, intensity: 5 },
  },
  {
    id: "guardian",
    displayName: "The Guardian",
    dimensions: { energy: 5, focus: 8, structure: 9, risk: 2, warmth: 8, intensity: 6 },
  },
  {
    id: "mystic",
    displayName: "The Mystic",
    dimensions: { energy: 2, focus: 7, structure: 4, risk: 6, warmth: 6, intensity: 4 },
  },
  {
    id: "luminary",
    displayName: "The Luminary",
    dimensions: { energy: 8, focus: 8, structure: 6, risk: 7, warmth: 8, intensity: 8 },
  },
  {
    id: "alchemist",
    displayName: "The Alchemist",
    dimensions: { energy: 6, focus: 7, structure: 5, risk: 9, warmth: 5, intensity: 7 },
  },
  {
    id: "voyager",
    displayName: "The Voyager",
    dimensions: { energy: 8, focus: 6, structure: 4, risk: 9, warmth: 4, intensity: 7 },
  },
  {
    id: "healer",
    displayName: "The Healer",
    dimensions: { energy: 4, focus: 6, structure: 6, risk: 3, warmth: 10, intensity: 3 },
  },
  {
    id: "poet",
    displayName: "The Poet",
    dimensions: { energy: 4, focus: 5, structure: 4, risk: 5, warmth: 8, intensity: 4 },
  },
  {
    id: "warrior",
    displayName: "The Warrior",
    dimensions: { energy: 9, focus: 9, structure: 7, risk: 8, warmth: 3, intensity: 10 },
  },
  {
    id: "monarch",
    displayName: "The Monarch",
    dimensions: { energy: 7, focus: 8, structure: 9, risk: 5, warmth: 6, intensity: 9 },
  },
  {
    id: "muse",
    displayName: "The Muse",
    dimensions: { energy: 6, focus: 4, structure: 3, risk: 7, warmth: 9, intensity: 5 },
  },
  {
    id: "hermit",
    displayName: "The Hermit",
    dimensions: { energy: 2, focus: 8, structure: 6, risk: 3, warmth: 4, intensity: 3 },
  },
  {
    id: "rebel",
    displayName: "The Rebel",
    dimensions: { energy: 9, focus: 6, structure: 2, risk: 10, warmth: 4, intensity: 9 },
  },
  {
    id: "lover",
    displayName: "The Lover",
    dimensions: { energy: 6, focus: 5, structure: 5, risk: 6, warmth: 10, intensity: 7 },
  },
  {
    id: "architect",
    displayName: "The Architect",
    dimensions: { energy: 5, focus: 10, structure: 10, risk: 4, warmth: 4, intensity: 6 },
  },
  {
    id: "child",
    displayName: "The Child",
    dimensions: { energy: 8, focus: 3, structure: 2, risk: 7, warmth: 9, intensity: 5 },
  },
];
