import type { LocalizedText } from "@/data/gameData";

export type GameId = "decision" | "memory" | "risk" | "intuition" | "focus";
export type ShareableId = GameId | "profile";
export type TimeKind = "time" | "reaction" | null;
export type LeaderboardScope = "today" | "week" | "all";

export type ShareableResult = {
  id: ShareableId;
  icon: string;
  title: LocalizedText;
  score: number;
  timeMs: number | null;
  timeKind: TimeKind;
  badge: LocalizedText;
  subtitle?: LocalizedText;
};

export type ChallengeEntry = {
  id: string;
  gameId: GameId;
  playerName: string;
  score: number;
  timeMs: number | null;
  timeKind: TimeKind;
  badge: LocalizedText;
  createdAt: string;
};

export const FEATURED_GAME_ID: GameId = "decision";

export const GAME_META: Record<GameId, { name: LocalizedText; icon: string; accent: string }> = {
  decision: {
    name: { ar: "سرعة القرار", en: "Decision Speed" },
    icon: "⚡",
    accent: "amber",
  },
  memory: {
    name: { ar: "اختبار الذاكرة", en: "Memory Flash" },
    icon: "🔮",
    accent: "violet",
  },
  risk: {
    name: { ar: "مخاطرة أم أمان", en: "Risk or Safe" },
    icon: "🎲",
    accent: "rose",
  },
  intuition: {
    name: { ar: "اختبار الحدس", en: "Intuition Test" },
    icon: "👁",
    accent: "cyan",
  },
  focus: {
    name: { ar: "تحدي التركيز", en: "Focus Challenge" },
    icon: "🎯",
    accent: "emerald",
  },
};

const PLAYER_KEY = "mirrormind_player_name";
const LEGACY_PLAYER_KEYS = ["mirrormind_player_v1"];
const ATTEMPTS_KEY = "mirrormind_attempts_v2";
export const MIN_PLAYER_NAME_LENGTH = 2;
export const MAX_PLAYER_NAME_LENGTH = 20;
const MAX_ATTEMPTS = 180;

const dayMs = 24 * 60 * 60 * 1000;

export const sanitizeDisplayName = (value: string): string => {
  const normalized = value.normalize("NFKC");
  const clean = normalized
    .replace(/[^\p{L}\p{N}\s._-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

  return Array.from(clean).slice(0, MAX_PLAYER_NAME_LENGTH).join("");
};

export const isValidPlayerName = (value: string) =>
  sanitizeDisplayName(value).length >= MIN_PLAYER_NAME_LENGTH;

export const getStoredPlayerName = (): string => {
  if (typeof window === "undefined") return "";

  const keys = [PLAYER_KEY, ...LEGACY_PLAYER_KEYS];
  for (const key of keys) {
    const rawValue = localStorage.getItem(key);
    const sanitized = sanitizeDisplayName(rawValue ?? "");

    if (!isValidPlayerName(sanitized)) {
      if (rawValue) {
        localStorage.removeItem(key);
      }
      continue;
    }

    if (key !== PLAYER_KEY) {
      localStorage.setItem(PLAYER_KEY, sanitized);
      localStorage.removeItem(key);
    }

    return sanitized;
  }

  return "";
};

export const requirePlayerName = (rawName?: string) => {
  const sanitized = sanitizeDisplayName(rawName ?? getStoredPlayerName());
  if (!isValidPlayerName(sanitized)) {
    throw new Error("Player name is required");
  }

  return sanitized;
};

export const setStoredPlayerName = (value: string) => {
  if (typeof window === "undefined") return;
  const sanitized = sanitizeDisplayName(value);
  if (isValidPlayerName(sanitized)) {
    localStorage.setItem(PLAYER_KEY, sanitized);
    return;
  }
  localStorage.removeItem(PLAYER_KEY);
};

export const formatShareDateTime = (value: Date) => {
  const day = `${value.getDate()}`.padStart(2, "0");
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const year = value.getFullYear();
  const hours = `${value.getHours()}`.padStart(2, "0");
  const minutes = `${value.getMinutes()}`.padStart(2, "0");
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

export const formatTimeMetric = (locale: "ar" | "en", timeMs: number | null) => {
  if (timeMs === null) return locale === "ar" ? "غير متاح" : "N/A";
  const seconds = (timeMs / 1000).toFixed(2);
  return locale === "ar" ? `${seconds} ثانية` : `${seconds}s`;
};

export const formatScoreValue = (locale: "ar" | "en", score: number, withUnit = true) => {
  if (!withUnit) return `${score}`;
  return locale === "ar" ? `${score} نقطة` : `${score}`;
};

export const getDailyFeaturedGameId = (seedDate = new Date()): GameId => {
  const ids = Object.keys(GAME_META) as GameId[];
  const utcIndex = Math.floor(Date.UTC(seedDate.getFullYear(), seedDate.getMonth(), seedDate.getDate()) / dayMs);
  return ids[utcIndex % ids.length];
};

export const getBadgeForScore = (gameId: ShareableId, score: number, rank?: number): LocalizedText => {
  if (rank === 1) {
    return { ar: "متصدر اليوم", en: "Top Player" };
  }
  if (gameId === "focus" && score >= 82) {
    return { ar: "سيد التركيز", en: "Focus Master" };
  }
  if (gameId === "decision" && score >= 88) {
    return { ar: "رد فعل خارق", en: "Lightning Reflex" };
  }
  if (score >= 92) {
    return { ar: "لا يُهزم", en: "Unbeatable" };
  }
  if (score >= 75) {
    return { ar: "عقل سريع", en: "Fast Mind" };
  }
  return { ar: "أفضل محاولة", en: "Best Attempt" };
};

const compareEntries = (left: ChallengeEntry, right: ChallengeEntry) => {
  if (right.score !== left.score) return right.score - left.score;
  if (left.timeMs !== null && right.timeMs !== null && left.timeMs !== right.timeMs) {
    return left.timeMs - right.timeMs;
  }
  if (left.timeMs === null && right.timeMs !== null) return 1;
  if (left.timeMs !== null && right.timeMs === null) return -1;
  return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
};

export const getLocalAttempts = (): ChallengeEntry[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChallengeEntry[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveLocalAttempt = (entry: ChallengeEntry) => {
  if (typeof window === "undefined") return;
  const current = getLocalAttempts();
  const next = [entry, ...current].slice(0, MAX_ATTEMPTS);
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(next));
};

export const buildChallengeEntry = (params: {
  gameId: GameId;
  score: number;
  timeMs: number | null;
  timeKind: TimeKind;
  playerName?: string;
}) => {
  const playerName = requirePlayerName(params.playerName);
  return {
    id: `${params.gameId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    gameId: params.gameId,
    playerName,
    score: params.score,
    timeMs: params.timeMs,
    timeKind: params.timeKind,
    badge: getBadgeForScore(params.gameId, params.score),
    createdAt: new Date().toISOString(),
  } satisfies ChallengeEntry;
};

export const filterEntriesByGame = (entries: ChallengeEntry[], gameId: GameId) =>
  entries.filter((entry) => entry.gameId === gameId);

export const filterEntriesByScope = (
  entries: ChallengeEntry[],
  scope: LeaderboardScope,
  now = new Date(),
) => {
  if (scope === "all") return [...entries].sort(compareEntries);

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWindow = scope === "today" ? startOfToday : startOfToday - 6 * dayMs;

  return entries
    .filter((entry) => {
      const ts = new Date(entry.createdAt).getTime();
      return ts >= startOfWindow;
    })
    .sort(compareEntries);
};

export const getRankedEntries = (entries: ChallengeEntry[]) =>
  [...entries].sort(compareEntries).map((entry, index) => ({ ...entry, rank: index + 1 }));

export const getPersonalBest = (entries: ChallengeEntry[]) => {
  const [best] = [...entries].sort(compareEntries);
  return best ?? null;
};

export const getFastestEntry = (entries: ChallengeEntry[]) => {
  return [...entries]
    .filter((entry) => entry.timeMs !== null)
    .sort((left, right) => (left.timeMs ?? Infinity) - (right.timeMs ?? Infinity))[0] ?? null;
};

export const getConsecutiveDayStreak = (entries: ChallengeEntry[]) => {
  const uniqueDays = Array.from(
    new Set(entries.map((entry) => new Date(entry.createdAt).toISOString().slice(0, 10))),
  ).sort((left, right) => right.localeCompare(left));

  if (uniqueDays.length === 0) return 0;

  let streak = 1;
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const prev = new Date(uniqueDays[index - 1]);
    const current = new Date(uniqueDays[index]);
    const diff = Math.round((prev.getTime() - current.getTime()) / dayMs);
    if (diff !== 1) break;
    streak += 1;
  }

  return streak;
};

export const getGapToLeader = (entries: ChallengeEntry[], personalBest: ChallengeEntry | null) => {
  if (!personalBest) return null;
  const leader = getPersonalBest(entries);
  if (!leader) return null;
  const scoreGap = Math.max(0, leader.score - personalBest.score);

  if (scoreGap > 0) {
    return { scoreGap, timeGapMs: null };
  }

  if (leader.timeMs !== null && personalBest.timeMs !== null) {
    return { scoreGap: 0, timeGapMs: Math.max(0, personalBest.timeMs - leader.timeMs) };
  }

  return { scoreGap: 0, timeGapMs: null };
};

export const toShareableResult = (entry: ChallengeEntry): ShareableResult => ({
  id: entry.gameId,
  icon: GAME_META[entry.gameId].icon,
  title: GAME_META[entry.gameId].name,
  score: entry.score,
  timeMs: entry.timeMs,
  timeKind: entry.timeKind,
  badge: entry.badge,
});

export const buildShareText = (params: {
  locale: "ar" | "en";
  playerName: string;
  result: ShareableResult;
  sharedAt: Date;
  siteUrl?: string;
}) => {
  const sharedDate = formatShareDateTime(params.sharedAt);
  const timeLine =
    params.result.timeMs !== null
      ? params.locale === "ar"
        ? `الوقت: ${formatTimeMetric(params.locale, params.result.timeMs)}`
        : `Time: ${formatTimeMetric(params.locale, params.result.timeMs)}`
      : null;

  const lines =
    params.locale === "ar"
      ? [
          `أنا ${params.playerName} لعبت ${params.result.title.ar} على MirrorMind 🧠`,
          `النتيجة: ${formatScoreValue(params.locale, params.result.score)}`,
          ...(timeLine ? [timeLine] : []),
          `تاريخ المشاركة: ${sharedDate}`,
          `اللقب: ${params.result.badge.ar}`,
          "هل تستطيع هزيمتي؟",
        ]
      : [
          `I'm ${params.playerName} and I played ${params.result.title.en} on MirrorMind 🧠`,
          `Score: ${formatScoreValue(params.locale, params.result.score, false)}`,
          ...(timeLine ? [timeLine] : []),
          `Shared: ${sharedDate}`,
          `Badge: ${params.result.badge.en}`,
          "Can you beat me?",
        ];

  if (params.siteUrl) {
    lines.push(params.siteUrl);
  }

  return lines.join("\n");
};

export const fetchFeaturedLeaderboard = async () => {
  try {
    const response = await fetch(`/api/challenge?gameId=${FEATURED_GAME_ID}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Failed to load leaderboard");
    const payload = (await response.json()) as { entries: ChallengeEntry[] };
    return payload.entries;
  } catch {
    return filterEntriesByGame(getLocalAttempts(), FEATURED_GAME_ID);
  }
};

export const submitFeaturedAttempt = async (entry: ChallengeEntry) => {
  saveLocalAttempt(entry);

  try {
    await fetch("/api/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // Local persistence is the durable fallback for the current client.
  }
};