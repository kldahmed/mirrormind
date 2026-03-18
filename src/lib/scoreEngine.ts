import {
  DIMENSION_LABELS,
  QUESTIONS,
  type DimensionImpact,
  type DimensionKey,
} from "@/data/questions";
import { PERSONALITY_TYPES, type PersonalityTypeId } from "@/data/personalityTypes";

export type DimensionScores = Record<DimensionKey, number>;

const ZERO_IMPACT: DimensionImpact = {
  logic: 0,
  creativity: 0,
  empathy: 0,
  risk: 0,
};

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
        { ...ZERO_IMPACT },
      );

      (Object.keys(runningMax) as DimensionKey[]).forEach((dimension) => {
        runningMax[dimension] += maxPerDimension[dimension];
      });

      return runningMax;
    },
    { ...ZERO_IMPACT },
  );
};

const MAX_DIMENSION_TOTALS = calculateMaxDimensionTotals();

export const calculateDimensionScores = (selectedOptionIndexes: number[]): DimensionScores => {
  const rawTotals = QUESTIONS.reduce(
    (running, question, index) => {
      const optionIndex = selectedOptionIndexes[index];
      const selectedOption = question.options[optionIndex] ?? question.options[0];

      (Object.keys(running) as DimensionKey[]).forEach((dimension) => {
        running[dimension] += selectedOption.impact[dimension];
      });

      return running;
    },
    { ...ZERO_IMPACT },
  );

  return (Object.keys(rawTotals) as DimensionKey[]).reduce((percentages, dimension) => {
    const maxValue = MAX_DIMENSION_TOTALS[dimension];
    percentages[dimension] = maxValue > 0 ? Math.round((rawTotals[dimension] / maxValue) * 100) : 0;
    return percentages;
  }, {} as DimensionScores);
};

const resolvePersonalityType = (scores: DimensionScores): PersonalityTypeId => {
  const weighted = (Object.keys(PERSONALITY_TYPES) as PersonalityTypeId[]).reduce(
    (accumulator, profileId) => {
      const weights = PERSONALITY_TYPES[profileId].archetypeWeights;
      accumulator[profileId] =
        scores.logic * weights.logic +
        scores.creativity * weights.creativity +
        scores.empathy * weights.empathy +
        scores.risk * weights.risk;
      return accumulator;
    },
    {} as Record<PersonalityTypeId, number>,
  );

  return (Object.entries(weighted) as [PersonalityTypeId, number][]).sort(
    (left, right) => right[1] - left[1],
  )[0][0];
};

export const getPersonalityResult = (selectedOptionIndexes: number[]) => {
  const scores = calculateDimensionScores(selectedOptionIndexes);
  const typeId = resolvePersonalityType(scores);

  return {
    typeId,
    scores,
    profile: PERSONALITY_TYPES[typeId],
    labels: DIMENSION_LABELS,
  };
};
