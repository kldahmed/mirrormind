import {
  DIMENSION_LABELS,
  QUESTIONS,
  type DimensionKey,
  type DimensionImpact,
} from "@/data/questions";

export type DimensionScores = Record<DimensionKey, number>;

export type PersonalityTypeId =
  | "strategist"
  | "visionary"
  | "explorer"
  | "architect";

export type PersonalityProfile = {
  id: PersonalityTypeId;
  name: string;
  description: string;
  strengths: string[];
  blindSpots: string[];
  shareHeadline: string;
};

const ZERO_IMPACT: DimensionImpact = {
  logic: 0,
  creativity: 0,
  empathy: 0,
  risk: 0,
};

const PROFILES: Record<PersonalityTypeId, PersonalityProfile> = {
  strategist: {
    id: "strategist",
    name: "The Strategist",
    description:
      "You navigate complexity with precision and composure. Your mind naturally builds frameworks, spots leverage points, and turns ambiguity into reliable direction.",
    strengths: [
      "Systems thinking under pressure",
      "Clear prioritization and long-term planning",
      "Confident decision-making with calculated risk",
    ],
    blindSpots: [
      "Can over-index on control before action",
      "May undervalue emotional context in fast calls",
      "Sometimes delays experimentation for certainty",
    ],
    shareHeadline: "I am The Strategist — precision, structure, and high-leverage thinking.",
  },
  visionary: {
    id: "visionary",
    name: "The Visionary",
    description:
      "You detect future possibilities before they become obvious. You combine imaginative range with emotional intelligence to inspire movement toward what is next.",
    strengths: [
      "Original ideation and narrative framing",
      "Inspires others around ambitious directions",
      "Finds creative paths through constraints",
    ],
    blindSpots: [
      "Can outpace practical execution details",
      "May pursue novelty when focus is needed",
      "Sometimes underestimates resource limits",
    ],
    shareHeadline: "I am The Visionary — imagination, intuition, and future-shaping energy.",
  },
  explorer: {
    id: "explorer",
    name: "The Explorer",
    description:
      "You are energized by motion, uncertainty, and discovery. You turn unknown territory into opportunity by acting boldly and learning in real time.",
    strengths: [
      "Rapid adaptation in changing environments",
      "High initiative and action bias",
      "Comfort with experimentation and uncertainty",
    ],
    blindSpots: [
      "Can move faster than alignment allows",
      "May skip reflection after early success",
      "Sometimes sacrifices depth for momentum",
    ],
    shareHeadline: "I am The Explorer — bold choices, rapid learning, and forward motion.",
  },
  architect: {
    id: "architect",
    name: "The Architect",
    description:
      "You blend logic and creativity into elegant structures that last. You are at your best when designing systems, products, or ideas that balance beauty and rigor.",
    strengths: [
      "Integrates imagination with technical depth",
      "Designs scalable solutions with coherence",
      "Balances detail quality with strategic intent",
    ],
    blindSpots: [
      "Can over-refine before sharing early drafts",
      "May prefer design purity over speed",
      "Sometimes isolates when collaboration is needed",
    ],
    shareHeadline: "I am The Architect — elegant systems, creative rigor, and intentional design.",
  },
};

const weightedArchetypeScores = (scores: DimensionScores) => ({
  strategist:
    scores.logic * 0.46 +
    scores.risk * 0.29 +
    scores.creativity * 0.14 +
    scores.empathy * 0.11,
  visionary:
    scores.creativity * 0.46 +
    scores.empathy * 0.29 +
    scores.risk * 0.14 +
    scores.logic * 0.11,
  explorer:
    scores.risk * 0.46 +
    scores.creativity * 0.29 +
    scores.logic * 0.14 +
    scores.empathy * 0.11,
  architect:
    scores.logic * 0.42 +
    scores.creativity * 0.34 +
    scores.empathy * 0.16 +
    (100 - scores.risk) * 0.08,
});

const calculateMaxDimensionTotals = (): DimensionImpact => {
  return QUESTIONS.reduce(
    (runningMax, question) => {
      const maxPerDimension = question.options.reduce(
        (maxes, option) => {
          (Object.keys(maxes) as DimensionKey[]).forEach((dimension) => {
            maxes[dimension] = Math.max(maxes[dimension], option.impact[dimension]);
          });
          return maxes;
        },
        { ...ZERO_IMPACT }
      );

      (Object.keys(runningMax) as DimensionKey[]).forEach((dimension) => {
        runningMax[dimension] += maxPerDimension[dimension];
      });

      return runningMax;
    },
    { ...ZERO_IMPACT }
  );
};

const MAX_DIMENSION_TOTALS = calculateMaxDimensionTotals();

export const calculateDimensionScores = (
  selectedOptionIndexes: number[]
): DimensionScores => {
  const rawTotals = QUESTIONS.reduce(
    (running, question, index) => {
      const optionIndex = selectedOptionIndexes[index];
      const selectedOption = question.options[optionIndex] ?? question.options[0];

      (Object.keys(running) as DimensionKey[]).forEach((dimension) => {
        running[dimension] += selectedOption.impact[dimension];
      });

      return running;
    },
    { ...ZERO_IMPACT }
  );

  return (Object.keys(rawTotals) as DimensionKey[]).reduce((percentages, dimension) => {
    const maxValue = MAX_DIMENSION_TOTALS[dimension];
    percentages[dimension] = maxValue > 0 ? Math.round((rawTotals[dimension] / maxValue) * 100) : 0;
    return percentages;
  }, {} as DimensionScores);
};

export const resolvePersonalityType = (scores: DimensionScores): PersonalityTypeId => {
  const weighted = weightedArchetypeScores(scores);

  return (Object.entries(weighted) as [PersonalityTypeId, number][]).sort(
    (left, right) => right[1] - left[1]
  )[0][0];
};

export const getPersonalityResult = (selectedOptionIndexes: number[]) => {
  const scores = calculateDimensionScores(selectedOptionIndexes);
  const typeId = resolvePersonalityType(scores);

  return {
    typeId,
    scores,
    profile: PROFILES[typeId],
    labels: DIMENSION_LABELS,
  };
};