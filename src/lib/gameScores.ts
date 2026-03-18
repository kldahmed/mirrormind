export type DecisionStyle = "analytical" | "social" | "impulsive";

export type MindScores = {
  personalityType: string | null;
  personalityName: { ar: string; en: string } | null;
  decisionStyle: DecisionStyle | null;
  decisionScore: number | null; // 0-100 reaction speed score
  memoryScore: number | null; // 0-100
  riskScore: number | null; // 0-100 (higher = more risk-taking)
  intuitionScore: number | null; // 0-100
  focusScore: number | null; // 0-100
};

const STORAGE_KEY = "mirrormind_scores_v1";

const emptyScores = (): MindScores => ({
  personalityType: null,
  personalityName: null,
  decisionStyle: null,
  decisionScore: null,
  memoryScore: null,
  riskScore: null,
  intuitionScore: null,
  focusScore: null,
});

export const getScores = (): MindScores => {
  if (typeof window === "undefined") return emptyScores();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyScores(), ...JSON.parse(raw) } : emptyScores();
  } catch {
    return emptyScores();
  }
};

export const saveScore = <K extends keyof MindScores>(key: K, value: MindScores[K]) => {
  if (typeof window === "undefined") return;
  const current = getScores();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, [key]: value }));
};

export const clearScores = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

export const computedMindScore = (scores: MindScores): number | null => {
  const values = [
    scores.memoryScore,
    scores.riskScore,
    scores.intuitionScore,
    scores.focusScore,
    scores.decisionScore,
  ].filter((v): v is number => v !== null);
  if (values.length === 0) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
};
