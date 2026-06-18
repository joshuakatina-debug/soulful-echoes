export type QuizOption = { value: string; label: string };
export type QuizQuestion = {
  id: number;
  category: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
};

const opts = (a: string, b: string, c: string, d: string): QuizOption[] => [
  { value: "a", label: a },
  { value: "b", label: b },
  { value: "c", label: c },
  { value: "d", label: d },
];

export const questions: QuizQuestion[] = [
  {
    id: 1,
    category: "Energy",
    question: "After a long week, what brings you back to yourself?",
    options: opts(
      "Time alone where I can fully exhale",
      "A quiet place before I rejoin the world",
      "Being with people who lift my spirit",
      "Movement, energy, and something happening around me",
    ),
  },
  {
    id: 2,
    category: "Focus",
    question: "When you're facing an important decision, what matters most?",
    options: opts(
      "The people I care about",
      "Finding a balance between everyone involved",
      "Staying true to who I am",
      "Following what feels like my deeper purpose",
    ),
  },
  {
    id: 3,
    category: "Thinking",
    question: "When the answer isn't obvious, what do you lean on most?",
    options: opts(
      "What feels right",
      "How it will affect the people around me",
      "What seems clear and practical",
      "Careful reasoning",
    ),
  },
  {
    id: 4,
    category: "Structure",
    question: "If tomorrow were completely yours, what would it look like?",
    options: opts(
      "I'd make it up as I go",
      "I'd have a loose plan",
      "I'd like some structure",
      "I'd plan it out ahead of time",
    ),
  },
  {
    id: 5,
    category: "Risk",
    question: "When a new opportunity comes along, you're most likely to...",
    options: opts(
      "Wait until it feels certain",
      "Think it through carefully",
      "Take the chance if it feels worthwhile",
      "Jump in and trust myself",
    ),
  },
  {
    id: 6,
    category: "Influence",
    question: "People who know you well would probably say you...",
    options: opts(
      "Help others feel safe",
      "Bring a quiet sense of confidence",
      "Naturally draw people in",
      "Inspire people to take action",
    ),
  },
  {
    id: 7,
    category: "Tempo",
    question: "Which pace feels most natural to you?",
    options: opts(
      "Slow and unhurried",
      "Relaxed and steady",
      "Energetic and moving forward",
      "Fast and full of momentum",
    ),
  },
  {
    id: 8,
    category: "Instrumentation",
    question: "Which atmosphere feels most like home?",
    options: opts(
      "Natural and organic",
      "Warm with a touch of something modern",
      "A balance of old and new",
      "Modern and futuristic",
    ),
  },
  {
    id: 9,
    category: "Mood",
    question: "Which feeling feels most like home?",
    options: opts(
      "Quiet reflection",
      "Calm contentment",
      "Hope and optimism",
      "Joy and excitement",
    ),
  },
  {
    id: 10,
    category: "Warmth",
    question: "What kind of space do you feel most drawn to?",
    options: opts(
      "Close, intimate, and personal",
      "Warm, welcoming, and grounded",
      "Open, spacious, and breathable",
      "Wide, cinematic, and expansive",
    ),
  },
  {
    id: 11,
    category: "Atmosphere",
    question: "Where do you feel most like yourself?",
    options: opts(
      "Surrounded by nature",
      "Somewhere warm and familiar",
      "In places that feel dreamlike",
      "Beneath wide-open skies",
    ),
  },
  {
    id: 12,
    category: "Intensity",
    question: "When you walk into a room, your energy is usually...",
    options: opts(
      "Gentle and reassuring",
      "Calm and quietly confident",
      "Bold and expressive",
      "Strong and unmistakable",
    ),
  },
];
