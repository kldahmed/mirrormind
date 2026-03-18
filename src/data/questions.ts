export type DimensionKey = "logic" | "creativity" | "empathy" | "risk";

export type DimensionImpact = Record<DimensionKey, number>;

export type QuestionOption = {
  text: string;
  impact: DimensionImpact;
};

export type Question = {
  id: number;
  prompt: string;
  options: QuestionOption[];
};

export const DIMENSION_LABELS: Record<DimensionKey, string> = {
  logic: "Logic",
  creativity: "Creativity",
  empathy: "Empathy",
  risk: "Risk",
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "A critical project suddenly changes direction. Your first move is to:",
    options: [
      {
        text: "Map new constraints and re-plan the system before acting.",
        impact: { logic: 5, creativity: 2, empathy: 1, risk: 2 },
      },
      {
        text: "Sketch three bold alternatives and pitch the strongest vision.",
        impact: { logic: 2, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: "Check team morale and align people before touching execution.",
        impact: { logic: 1, creativity: 2, empathy: 5, risk: 1 },
      },
      {
        text: "Move fast with a live experiment and adjust from real feedback.",
        impact: { logic: 2, creativity: 3, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 2,
    prompt: "When learning something new, you absorb it best by:",
    options: [
      {
        text: "Breaking it into principles and understanding the model.",
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 1 },
      },
      {
        text: "Turning ideas into metaphors, visuals, and prototypes.",
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 2 },
      },
      {
        text: "Discussing it deeply with others and sensing perspective shifts.",
        impact: { logic: 1, creativity: 2, empathy: 5, risk: 1 },
      },
      {
        text: "Jumping in immediately and learning through uncertainty.",
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 3,
    prompt: "In group decisions, people rely on you for:",
    options: [
      {
        text: "Clarity, evidence, and a clean decision framework.",
        impact: { logic: 5, creativity: 1, empathy: 2, risk: 1 },
      },
      {
        text: "Unexpected concepts that unlock a new direction.",
        impact: { logic: 2, creativity: 5, empathy: 1, risk: 3 },
      },
      {
        text: "The ability to harmonize conflict and include every voice.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "Your courage to commit when others hesitate.",
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 4,
    prompt: "A weekend with no obligations sounds most appealing if you:",
    options: [
      {
        text: "Deep-dive into strategy games, systems, or long-form analysis.",
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 1 },
      },
      {
        text: "Build something expressive: writing, design, or sound.",
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 2 },
      },
      {
        text: "Reconnect with friends and meaningful one-on-one moments.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "Take an unplanned trip and follow pure instinct.",
        impact: { logic: 1, creativity: 3, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 5,
    prompt: "What best describes your relationship with failure?",
    options: [
      {
        text: "A signal to improve the model and reduce future error.",
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 2 },
      },
      {
        text: "A remix point that often leads to better ideas.",
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: "A human moment that deserves reflection and compassion.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "The cost of playing big; I recover quickly and push on.",
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 6,
    prompt: "When conflict appears, your instinct is to:",
    options: [
      {
        text: "Isolate the facts and resolve the root contradiction.",
        impact: { logic: 5, creativity: 1, empathy: 2, risk: 2 },
      },
      {
        text: "Reframe the situation and search for a third option.",
        impact: { logic: 2, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: "Read emotional subtext and de-escalate with care.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "Address it directly and decisively before it grows.",
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 7,
    prompt: "Your ideal work environment is:",
    options: [
      {
        text: "Structured, focused, and rich with measurable goals.",
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 1 },
      },
      {
        text: "Flexible, imaginative, and open to wild exploration.",
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: "Supportive, collaborative, and people-centered.",
        impact: { logic: 1, creativity: 2, empathy: 5, risk: 1 },
      },
      {
        text: "Fast-paced, high-stakes, and full of bold bets.",
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 8,
    prompt: "A difficult decision must be made quickly. You prioritize:",
    options: [
      {
        text: "Expected value and long-term consequence modeling.",
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 2 },
      },
      {
        text: "Novel upside that others might overlook.",
        impact: { logic: 2, creativity: 5, empathy: 1, risk: 3 },
      },
      {
        text: "Human impact and preserving trust first.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "Momentum: act now, tune later with real outcomes.",
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 9,
    prompt: "Which compliment feels most accurate to you?",
    options: [
      {
        text: "You think with sharp precision.",
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 1 },
      },
      {
        text: "You see possibilities before anyone else.",
        impact: { logic: 1, creativity: 5, empathy: 1, risk: 3 },
      },
      {
        text: "You make people feel truly understood.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "You are fearless when it matters.",
        impact: { logic: 1, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 10,
    prompt: "When facing ambiguity, you are most likely to:",
    options: [
      {
        text: "Reduce uncertainty with models, data, and assumptions.",
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 2 },
      },
      {
        text: "Use imagination to design several compelling futures.",
        impact: { logic: 2, creativity: 5, empathy: 1, risk: 3 },
      },
      {
        text: "Talk to people impacted and calibrate to lived reality.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "Treat uncertainty as opportunity and move anyway.",
        impact: { logic: 1, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 11,
    prompt: "Your energy spikes most when you are:",
    options: [
      {
        text: "Solving a complex puzzle no one else has cracked.",
        impact: { logic: 5, creativity: 2, empathy: 1, risk: 2 },
      },
      {
        text: "Inventing original concepts and shaping future narratives.",
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: "Helping someone transform through honest conversation.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "Leaping into uncertain territory with real stakes.",
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 12,
    prompt: "At your best, your decision style feels like:",
    options: [
      {
        text: "A calculated sequence with elegant internal logic.",
        impact: { logic: 5, creativity: 2, empathy: 1, risk: 2 },
      },
      {
        text: "A spark that turns into a breakthrough direction.",
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: "An intuitive read of people and what they need most.",
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: "A bold commitment that creates momentum for everyone.",
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
];