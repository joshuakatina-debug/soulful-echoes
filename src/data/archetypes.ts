/**
 * archetypes.ts
 *
 * Soul Sounds — Archetype scoring data.
 *
 * Holds ONLY the data the Soul Engine needs to match a user to an
 * archetype: a stable id, a human display name, and six dimension
 * values in the range 0–10. Presentation copy (identity, keywords,
 * emotional journey, etc.) lives in archetypeContent.ts, keyed by id.
 *
 * The six dimensions are the core axes of the Soul Engine:
 *   - energy      (0 = stillness, 10 = vitality)
 *   - focus       (0 = open / wandering, 10 = sharp / directed)
 *   - structure   (0 = fluid / improvisational, 10 = ordered / composed)
 *   - risk        (0 = grounded / safe, 10 = daring / exploratory)
 *   - warmth      (0 = cool / spacious, 10 = warm / intimate)
 *   - intensity   (0 = gentle, 10 = powerful)
 *
 * This list contains the 18 OFFICIAL Soul Sounds archetypes. Do not
 * add placeholder or invented archetypes.
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
    id: "idealist",
    displayName: "The Idealist",
    dimensions: { energy: 5, focus: 7, structure: 5, risk: 6, warmth: 8, intensity: 6 },
  },
  {
    id: "activist",
    displayName: "The Activist",
    dimensions: { energy: 9, focus: 8, structure: 6, risk: 8, warmth: 6, intensity: 9 },
  },
  {
    id: "companion",
    displayName: "The Companion",
    dimensions: { energy: 5, focus: 6, structure: 6, risk: 3, warmth: 10, intensity: 4 },
  },
  {
    id: "anchor",
    displayName: "The Anchor",
    dimensions: { energy: 4, focus: 7, structure: 9, risk: 2, warmth: 8, intensity: 5 },
  },
  {
    id: "champion",
    displayName: "The Champion",
    dimensions: { energy: 9, focus: 9, structure: 7, risk: 7, warmth: 7, intensity: 10 },
  },
  {
    id: "achiever",
    displayName: "The Achiever",
    dimensions: { energy: 8, focus: 10, structure: 9, risk: 5, warmth: 5, intensity: 8 },
  },
  {
    id: "muse",
    displayName: "The Muse",
    dimensions: { energy: 6, focus: 4, structure: 3, risk: 7, warmth: 9, intensity: 5 },
  },
  {
    id: "imagineer",
    displayName: "The Imagineer",
    dimensions: { energy: 7, focus: 5, structure: 4, risk: 8, warmth: 7, intensity: 6 },
  },
  {
    id: "philosopher",
    displayName: "The Philosopher",
    dimensions: { energy: 3, focus: 9, structure: 7, risk: 4, warmth: 5, intensity: 4 },
  },
  {
    id: "architect",
    displayName: "The Architect",
    dimensions: { energy: 5, focus: 10, structure: 10, risk: 4, warmth: 4, intensity: 6 },
  },
  {
    id: "guardian",
    displayName: "The Guardian",
    dimensions: { energy: 5, focus: 8, structure: 9, risk: 2, warmth: 8, intensity: 6 },
  },
  {
    id: "confidant",
    displayName: "The Confidant",
    dimensions: { energy: 4, focus: 7, structure: 6, risk: 3, warmth: 9, intensity: 4 },
  },
  {
    id: "pathfinder",
    displayName: "The Pathfinder",
    dimensions: { energy: 7, focus: 8, structure: 6, risk: 8, warmth: 6, intensity: 7 },
  },
  {
    id: "adventurer",
    displayName: "The Adventurer",
    dimensions: { energy: 9, focus: 5, structure: 3, risk: 10, warmth: 6, intensity: 8 },
  },
  {
    id: "maverick",
    displayName: "The Maverick",
    dimensions: { energy: 9, focus: 6, structure: 2, risk: 10, warmth: 4, intensity: 9 },
  },
  {
    id: "bear",
    displayName: "The Bear",
    dimensions: { energy: 6, focus: 6, structure: 8, risk: 3, warmth: 9, intensity: 7 },
  },
  {
    id: "dreamer",
    displayName: "The Dreamer",
    dimensions: { energy: 3, focus: 2, structure: 2, risk: 6, warmth: 7, intensity: 3 },
  },
  {
    id: "peacemaker",
    displayName: "The Peacemaker",
    dimensions: { energy: 3, focus: 6, structure: 6, risk: 2, warmth: 9, intensity: 2 },
  },
];
