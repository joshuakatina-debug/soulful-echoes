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
    question: "When you're at your best, which feels most natural?",
    options: opts(
      "I enjoy quiet moments to think before I speak.",
      "I usually observe first, then join in.",
      "I naturally enjoy engaging with the people around me.",
      "I come alive through conversation and interaction.",
    ),
  },
  {
    id: 2,
    category: "Focus",
    question: "What tends to motivate your decisions most?",
    options: opts(
      "The people and opportunities around me.",
      "A balance between outside influence and my own convictions.",
      "My own values and beliefs.",
      "My inner purpose, regardless of what others think.",
    ),
  },
  {
    id: 3,
    category: "Thinking",
    question: "When making an important decision, you usually rely most on…",
    options: opts(
      "What feels right.",
      "How people may be affected.",
      "What makes the most sense.",
      "Careful analysis and logic.",
    ),
  },
  {
    id: 4,
    category: "Structure",
    question: "Your ideal day usually feels…",
    options: opts(
      "Completely open and spontaneous.",
      "Mostly flexible with a loose plan.",
      "Fairly organized.",
      "Carefully planned from beginning to end.",
    ),
  },
  {
    id: 5,
    category: "Risk",
    question: "When a new opportunity appears…",
    options: opts(
      "I usually wait until I'm confident it's the right choice.",
      "I like to think it through before deciding.",
      "I'm willing to take calculated risks.",
      "I get excited about trying something new.",
    ),
  },
  {
    id: 6,
    category: "Influence",
    question: "People usually describe you as…",
    options: opts(
      "Gentle and accommodating.",
      "Quietly confident.",
      "Naturally influential.",
      "Someone who confidently takes charge.",
    ),
  },
  {
    id: 7,
    category: "Tempo",
    question: "Which pace feels most like you?",
    options: opts("Slow and unhurried", "Relaxed", "Energetic", "Fast and lively"),
  },
  {
    id: 8,
    category: "Instrumentation",
    question: "Which sound are you naturally drawn toward?",
    options: opts(
      "Acoustic instruments",
      "Mostly acoustic with a few modern elements",
      "A balanced mix",
      "Modern electronic sounds",
    ),
  },
  {
    id: 9,
    category: "Mood",
    question: "Which emotional atmosphere feels most like home?",
    options: opts(
      "Deeply reflective",
      "Calm and thoughtful",
      "Bright and optimistic",
      "Joyful and celebratory",
    ),
  },
  {
    id: 10,
    category: "Warmth",
    question: "Which musical setting feels most comfortable?",
    options: opts(
      "Intimate and personal",
      "Warm and inviting",
      "Open and spacious",
      "Grand and cinematic",
    ),
  },
  {
    id: 11,
    category: "Atmosphere",
    question: "Which environment feels most inspiring?",
    options: opts(
      "Forests, mountains, and nature",
      "Cozy natural spaces",
      "Dreamlike landscapes",
      "Vast skies and the stars",
    ),
  },
  {
    id: 12,
    category: "Intensity",
    question: "Which emotional energy feels most like you?",
    options: opts("Gentle", "Calm but confident", "Bold", "Powerful"),
  },
];
