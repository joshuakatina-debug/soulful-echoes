/**
 * archetypes.ts
 *
 * Soul Sounds — Archetype scoring data.
 *
 * Holds ONLY the data the Soul Engine needs to match a user to an
 * archetype: a stable id, a human display name, and the six official
 * core dimension values on a 1–5 scale (matching the answer point
 * values A=1, B=2, C=4, D=5). Presentation copy lives in
 * archetypeContent.ts, keyed by id.
 *
 * The six official Soul Sounds core dimensions:
 *   - energy     (1 = stillness, 5 = vitality)
 *   - focus      (1 = open / wandering, 5 = sharp / directed)
 *   - thinking   (1 = intuitive / feeling, 5 = analytical / reasoned)
 *   - structure  (1 = fluid / improvisational, 5 = ordered / composed)
 *   - risk       (1 = grounded / safe, 5 = daring / exploratory)
 *   - influence  (1 = inward / personal, 5 = outward / world-shaping)
 *
 * This list contains the 18 OFFICIAL Soul Sounds archetypes. Do not
 * add placeholder or invented archetypes.
 */

export interface ArchetypeDimensions {
  energy: number;
  focus: number;
  thinking: number;
  structure: number;
  risk: number;
  influence: number;
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
    dimensions: { energy: 3, focus: 4, thinking: 4, structure: 3, risk: 3, influence: 3 },
  },
  {
    id: "activist",
    displayName: "The Activist",
    dimensions: { energy: 5, focus: 4, thinking: 3, structure: 3, risk: 4, influence: 5 },
  },
  {
    id: "companion",
    displayName: "The Companion",
    dimensions: { energy: 3, focus: 3, thinking: 5, structure: 3, risk: 2, influence: 2 },
  },
  {
    id: "anchor",
    displayName: "The Anchor",
    dimensions: { energy: 2, focus: 4, thinking: 4, structure: 5, risk: 1, influence: 3 },
  },
  {
    id: "champion",
    displayName: "The Champion",
    dimensions: { energy: 5, focus: 5, thinking: 4, structure: 4, risk: 4, influence: 5 },
  },
  {
    id: "achiever",
    displayName: "The Achiever",
    dimensions: { energy: 4, focus: 5, thinking: 3, structure: 5, risk: 3, influence: 4 },
  },
  {
    id: "muse",
    displayName: "The Muse",
    dimensions: { energy: 3, focus: 2, thinking: 5, structure: 2, risk: 4, influence: 3 },
  },
  {
    id: "imagineer",
    displayName: "The Imagineer",
    dimensions: { energy: 4, focus: 3, thinking: 4, structure: 2, risk: 4, influence: 3 },
  },
  {
    id: "philosopher",
    displayName: "The Philosopher",
    dimensions: { energy: 2, focus: 5, thinking: 3, structure: 4, risk: 2, influence: 2 },
  },
  {
    id: "architect",
    displayName: "The Architect",
    dimensions: { energy: 3, focus: 5, thinking: 2, structure: 5, risk: 2, influence: 3 },
  },
  {
    id: "guardian",
    displayName: "The Guardian",
    dimensions: { energy: 3, focus: 4, thinking: 4, structure: 5, risk: 1, influence: 3 },
  },
  {
    id: "confidant",
    displayName: "The Confidant",
    dimensions: { energy: 2, focus: 4, thinking: 5, structure: 3, risk: 2, influence: 2 },
  },
  {
    id: "pathfinder",
    displayName: "The Pathfinder",
    dimensions: { energy: 4, focus: 4, thinking: 3, structure: 3, risk: 4, influence: 4 },
  },
  {
    id: "adventurer",
    displayName: "The Adventurer",
    dimensions: { energy: 5, focus: 3, thinking: 3, structure: 2, risk: 5, influence: 4 },
  },
  {
    id: "maverick",
    displayName: "The Maverick",
    dimensions: { energy: 5, focus: 3, thinking: 2, structure: 1, risk: 5, influence: 5 },
  },
  {
    id: "bear",
    displayName: "The Bear",
    dimensions: { energy: 3, focus: 3, thinking: 5, structure: 4, risk: 2, influence: 4 },
  },
  {
    id: "dreamer",
    displayName: "The Dreamer",
    dimensions: { energy: 2, focus: 1, thinking: 4, structure: 1, risk: 3, influence: 2 },
  },
  {
    id: "peacemaker",
    displayName: "The Peacemaker",
    dimensions: { energy: 2, focus: 3, thinking: 5, structure: 3, risk: 1, influence: 1 },
  },
];
