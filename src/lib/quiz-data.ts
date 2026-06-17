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
    question: "How do you recharge?",
    options: opts(
      "Quiet time alone",
      "Watching before joining in",
      "Being around people",
      "In the middle of the action",
    ),
  },
  {
    id: 2,
    category: "Focus",
    question: "What usually guides you?",
    options: opts(
      "The people around me",
      "A mix of others and myself",
      "My own values",
      "My inner purpose",
    ),
  },
  {
    id: 3,
    category: "Thinking",
    question: "How do you decide?",
    options: opts(
      "I follow what feels right",
      "I think about who it affects",
      "I look at what makes sense",
      "I weigh the logic carefully",
    ),
  },
  {
    id: 4,
    category: "Structure",
    question: "Your ideal day is…",
    options: opts(
      "Totally spontaneous",
      "Loosely planned",
      "Mostly organized",
      "Carefully planned",
    ),
  },
  {
    id: 5,
    category: "Risk",
    question: "When something new shows up…",
    options: opts(
      "I wait until I'm sure",
      "I think it through first",
      "I take a smart risk",
      "I jump in",
    ),
  },
  {
    id: 6,
    category: "Influence",
    question: "People see you as…",
    options: opts(
      "Gentle",
      "Quietly confident",
      "Naturally magnetic",
      "A leader",
    ),
  },
  {
    id: 7,
    category: "Tempo",
    question: "Your natural pace is…",
    options: opts("Slow", "Easy", "Lively", "Fast"),
  },
  {
    id: 8,
    category: "Instrumentation",
    question: "Which sound pulls you in?",
    options: opts(
      "Acoustic and organic",
      "Mostly acoustic, a touch modern",
      "A blend of both",
      "Modern and electronic",
    ),
  },
  {
    id: 9,
    category: "Mood",
    question: "Which mood feels like home?",
    options: opts(
      "Deeply reflective",
      "Calm and thoughtful",
      "Bright",
      "Joyful",
    ),
  },
  {
    id: 10,
    category: "Warmth",
    question: "Which space feels right?",
    options: opts(
      "Intimate",
      "Warm",
      "Open",
      "Cinematic",
    ),
  },
  {
    id: 11,
    category: "Atmosphere",
    question: "Where do you feel most alive?",
    options: opts(
      "In nature",
      "In cozy places",
      "In dreamy landscapes",
      "Under wide open skies",
    ),
  },
  {
    id: 12,
    category: "Intensity",
    question: "Your energy is…",
    options: opts("Gentle", "Calm but sure", "Bold", "Powerful"),
  },
];
