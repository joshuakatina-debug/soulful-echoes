export type QuizOption = { value: string; label: string };
export type QuizQuestion = {
  id: number;
  question: string;
  subtitle?: string;
  options: QuizOption[];
};

export const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "When you close your eyes, what landscape appears?",
    options: [
      { value: "ocean", label: "An endless ocean at dusk" },
      { value: "forest", label: "A quiet forest after rain" },
      { value: "city", label: "A glowing city skyline" },
      { value: "desert", label: "A desert under starlight" },
    ],
  },
  {
    id: 2,
    question: "What time of day feels most like you?",
    options: [
      { value: "dawn", label: "The hush before dawn" },
      { value: "noon", label: "Bright, open noon" },
      { value: "dusk", label: "Golden hour, slow and warm" },
      { value: "midnight", label: "The stillness of midnight" },
    ],
  },
  {
    id: 3,
    question: "Which emotion do you sit with most often?",
    options: [
      { value: "longing", label: "A gentle longing" },
      { value: "joy", label: "Quiet, steady joy" },
      { value: "wonder", label: "Open-mouthed wonder" },
      { value: "melancholy", label: "Tender melancholy" },
    ],
  },
  {
    id: 4,
    question: "Pick a texture you'd want to touch.",
    options: [
      { value: "velvet", label: "Worn velvet" },
      { value: "stone", label: "Cool river stone" },
      { value: "silk", label: "Loose silk" },
      { value: "linen", label: "Sun-warmed linen" },
    ],
  },
  {
    id: 5,
    question: "How do you move through the world?",
    options: [
      { value: "drift", label: "I drift and observe" },
      { value: "stride", label: "I stride with intention" },
      { value: "dance", label: "I dance between things" },
      { value: "linger", label: "I linger in small moments" },
    ],
  },
  {
    id: 6,
    question: "Which sound feels like home?",
    options: [
      { value: "piano", label: "A distant piano" },
      { value: "rain", label: "Rain on a window" },
      { value: "strings", label: "Strings swelling slowly" },
      { value: "synth", label: "Warm analog synths" },
    ],
  },
  {
    id: 7,
    question: "What do you crave most right now?",
    options: [
      { value: "rest", label: "Deep, weightless rest" },
      { value: "spark", label: "A creative spark" },
      { value: "connection", label: "Tender connection" },
      { value: "clarity", label: "Crystalline clarity" },
    ],
  },
  {
    id: 8,
    question: "Choose a color that feels like your inner weather.",
    options: [
      { value: "lavender", label: "Soft lavender" },
      { value: "amber", label: "Burning amber" },
      { value: "teal", label: "Deep teal" },
      { value: "rose", label: "Dusty rose" },
    ],
  },
  {
    id: 9,
    question: "What memory pulls at you?",
    options: [
      { value: "childhood", label: "A childhood summer" },
      { value: "love", label: "A first, quiet love" },
      { value: "journey", label: "A long journey home" },
      { value: "loss", label: "Something gently lost" },
    ],
  },
  {
    id: 10,
    question: "When you create, you tend to be…",
    options: [
      { value: "intuitive", label: "Intuitive and flowing" },
      { value: "precise", label: "Precise and crafted" },
      { value: "playful", label: "Playful and surprising" },
      { value: "patient", label: "Patient and layered" },
    ],
  },
  {
    id: 11,
    question: "Where do you feel the music in your body?",
    options: [
      { value: "chest", label: "In my chest, slow and full" },
      { value: "spine", label: "Up my spine" },
      { value: "feet", label: "In my feet, ready to move" },
      { value: "throat", label: "In my throat, ready to sing" },
    ],
  },
  {
    id: 12,
    question: "If your soul had a single word, it would be…",
    options: [
      { value: "still", label: "Still" },
      { value: "wild", label: "Wild" },
      { value: "tender", label: "Tender" },
      { value: "luminous", label: "Luminous" },
    ],
  },
];

export type SoulProfile = {
  name: string;
  tagline: string;
  description: string;
  palette: string;
  genres: string[];
};

export const profiles: Record<string, SoulProfile> = {
  ethereal: {
    name: "The Ethereal Dreamer",
    tagline: "Music that floats, breathes, and dissolves into light.",
    description:
      "You move through life like a slow tide — sensitive, imaginative, and quietly luminous. Your sound is ambient and cinematic, built from drifting pads, distant pianos, and choral whispers.",
    palette: "Lavender mist, moonstone, soft gold",
    genres: ["Ambient", "Neo-classical", "Dream pop"],
  },
  ember: {
    name: "The Quiet Ember",
    tagline: "Warm, intimate songs that glow from the inside.",
    description:
      "There's a steady fire in you — gentle but unwavering. Your sound is acoustic and close, like a voice in a candlelit room: folk strings, brushed drums, and breath you can almost feel.",
    palette: "Amber, terracotta, cream",
    genres: ["Indie folk", "Acoustic", "Singer-songwriter"],
  },
  pulse: {
    name: "The Midnight Pulse",
    tagline: "A heartbeat in neon — patient, hypnotic, alive.",
    description:
      "You carry quiet electricity. Your sound moves in slow, deliberate waves: warm analog synths, deep low end, and rhythms that feel like walking through a sleeping city.",
    palette: "Indigo, teal, electric rose",
    genres: ["Synthwave", "Downtempo", "Electronic"],
  },
  luminous: {
    name: "The Luminous Wanderer",
    tagline: "Open, expansive sound for those who keep looking up.",
    description:
      "You're curious, open-hearted, and a little nomadic. Your sound is widescreen — orchestral swells, airy guitars, and rhythms that lift like a horizon coming into view.",
    palette: "Sky, peach, soft white",
    genres: ["Cinematic", "Post-rock", "Indie orchestral"],
  },
};

export function computeProfile(answers: Record<number, string>): SoulProfile {
  const scores = { ethereal: 0, ember: 0, pulse: 0, luminous: 0 };
  const map: Record<string, keyof typeof scores> = {
    ocean: "ethereal", forest: "ember", city: "pulse", desert: "luminous",
    dawn: "ethereal", noon: "luminous", dusk: "ember", midnight: "pulse",
    longing: "ethereal", joy: "luminous", wonder: "luminous", melancholy: "ember",
    velvet: "ember", stone: "pulse", silk: "ethereal", linen: "luminous",
    drift: "ethereal", stride: "luminous", dance: "pulse", linger: "ember",
    piano: "ethereal", rain: "ember", strings: "luminous", synth: "pulse",
    rest: "ethereal", spark: "pulse", connection: "ember", clarity: "luminous",
    lavender: "ethereal", amber: "ember", teal: "pulse", rose: "ember",
    childhood: "luminous", love: "ember", journey: "luminous", loss: "ethereal",
    intuitive: "ethereal", precise: "pulse", playful: "luminous", patient: "ember",
    chest: "ember", spine: "pulse", feet: "luminous", throat: "ethereal",
    still: "ethereal", wild: "pulse", tender: "ember", luminous: "luminous",
  };
  for (const v of Object.values(answers)) {
    const k = map[v];
    if (k) scores[k]++;
  }
  const top = (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as keyof typeof profiles;
  return profiles[top];
}
