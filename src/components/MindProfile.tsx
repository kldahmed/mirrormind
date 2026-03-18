"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FEATURED_GAME_ID,
  fetchFeaturedLeaderboard,
  filterEntriesByGame,
  formatScoreValue,
  formatTimeMetric,
  getFastestEntry,
  getLocalAttempts,
  getPersonalBest,
} from "@/lib/challenge";
import type { Locale } from "@/lib/i18n";
import { computedMindScore, getScores, type MindScores } from "@/lib/gameScores";

type Props = { locale: Locale; onGoToGames: () => void; onGoToTest: () => void };

type MetricDef = {
  key: keyof MindScores;
  label: { ar: string; en: string };
  icon: string;
  color: string;
  bar: string;
  gameId: string;
};

const METRICS: MetricDef[] = [
  { key: "memoryScore", label: { ar: "الذاكرة", en: "Memory" }, icon: "🔮", color: "text-violet-300", bar: "from-violet-400 to-purple-400", gameId: "memory" },
  { key: "riskScore", label: { ar: "الجرأة", en: "Risk" }, icon: "🎲", color: "text-rose-300", bar: "from-rose-400 to-red-400", gameId: "risk" },
  { key: "intuitionScore", label: { ar: "الحدس", en: "Intuition" }, icon: "👁", color: "text-cyan-300", bar: "from-cyan-400 to-teal-400", gameId: "intuition" },
  { key: "focusScore", label: { ar: "التركيز", en: "Focus" }, icon: "🎯", color: "text-emerald-300", bar: "from-emerald-400 to-green-400", gameId: "focus" },
  { key: "decisionScore", label: { ar: "سرعة القرار", en: "Decision Speed" }, icon: "⚡", color: "text-amber-300", bar: "from-amber-400 to-orange-400", gameId: "decision" },
];

function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ * (1 - score / 100) }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        transform={`rotate(90, ${size / 2}, ${size / 2})`}
        fill="white" fontSize={size / 4.5} fontWeight={700}
      >
        {score}
      </text>
    </svg>
  );
}

export function MindProfile({ locale, onGoToGames, onGoToTest }: Props) {
  const [scores] = useState<MindScores | null>(() => getScores());
  const [featuredTopScore, setFeaturedTopScore] = useState<number | null>(null);
  const [myFastestTime] = useState<number | null>(() => getFastestEntry(filterEntriesByGame(getLocalAttempts(), FEATURED_GAME_ID))?.timeMs ?? null);
  const [myBestScore] = useState<number | null>(() => getPersonalBest(filterEntriesByGame(getLocalAttempts(), FEATURED_GAME_ID))?.score ?? null);

  useEffect(() => {
    void fetchFeaturedLeaderboard().then((entries) => {
      const top = getPersonalBest(entries);
      setFeaturedTopScore(top?.score ?? null);
    });
  }, []);

  if (!scores) return null;

  const mindScore = computedMindScore(scores);
  const completedGames = METRICS.filter((m) => scores[m.key] !== null).length;
  const totalGames = METRICS.length;
  const challengeGap = featuredTopScore !== null && myBestScore !== null ? Math.max(0, featuredTopScore - myBestScore) : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45 }}
      className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex rounded-full border border-indigo-300/30 bg-indigo-500/10 px-4 py-1 text-xs font-medium tracking-widest text-indigo-200">
          {locale === "ar" ? "ملفك الذهني" : "Your Mind Profile"}
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {locale === "ar" ? "خريطة عقلك" : "Your Mind Map"}
        </h2>
        <p className="mt-2 text-slate-400">
          {completedGames === 0
            ? (locale === "ar" ? "العب الألعاب لتكتشف ملفك" : "Play games to build your profile")
            : `${completedGames}/${totalGames} ${locale === "ar" ? "ألعاب مكتملة" : "games completed"}`}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Left: overall score + personality */}
        <div className="space-y-5">
          {/* Mind Score */}
          <div className="rounded-3xl border border-white/15 bg-slate-900/50 p-6 backdrop-blur-xl text-center">
            <p className="text-xs tracking-widest text-slate-400 mb-4">
              {locale === "ar" ? "النتيجة الذهنية الكلية" : "Overall Mind Score"}
            </p>
            {mindScore !== null ? (
              <div className="flex flex-col items-center gap-3">
                <ScoreRing score={mindScore} size={120} />
                <p className="text-sm text-slate-300">
                  {mindScore >= 75
                    ? (locale === "ar" ? "عقل متميز 🏆" : "Outstanding Mind 🏆")
                    : mindScore >= 55
                      ? (locale === "ar" ? "عقل قوي ⭐" : "Strong Mind ⭐")
                      : (locale === "ar" ? "في طريق التطور 🌱" : "Growing Mind 🌱")}
                </p>
              </div>
            ) : (
              <div className="py-6">
                <p className="text-4xl mb-3">🌑</p>
                <p className="text-sm text-slate-400">
                  {locale === "ar" ? "العب لعبة واحدة على الأقل" : "Play at least one game"}
                </p>
                <button
                  type="button"
                  onClick={onGoToGames}
                  className="mt-4 rounded-full border border-violet-300/40 bg-violet-500/15 px-4 py-2 text-sm text-violet-200 hover:bg-violet-500/25 transition"
                >
                  {locale === "ar" ? "ابدأ الألعاب" : "Start Games"}
                </button>
              </div>
            )}
          </div>

          {/* Personality */}
          <div className="rounded-3xl border border-white/15 bg-slate-900/50 p-6 backdrop-blur-xl">
            <p className="text-xs tracking-widest text-slate-400 mb-2">
              {locale === "ar" ? "نوع الشخصية" : "Personality Type"}
            </p>
            {scores.personalityName ? (
              <>
                <p className="text-2xl font-bold text-white">{scores.personalityName[locale]}</p>
                {scores.decisionStyle && (
                  <p className="mt-1 text-sm text-slate-300">
                    {locale === "ar" ? "أسلوب القرار: " : "Decision style: "}
                    <span className="text-cyan-300 font-semibold">
                      {{
                        analytical: locale === "ar" ? "المحلّل" : "Analytical",
                        social: locale === "ar" ? "الاجتماعي" : "Social",
                        impulsive: locale === "ar" ? "التلقائي" : "Impulsive",
                      }[scores.decisionStyle]}
                    </span>
                  </p>
                )}
              </>
            ) : (
              <div>
                <p className="text-slate-400 text-sm">
                  {locale === "ar" ? "لم تكمل اختبار الشخصية بعد" : "Personality test not completed yet"}
                </p>
                <button
                  type="button"
                  onClick={onGoToTest}
                  className="mt-3 rounded-full border border-cyan-300/40 bg-cyan-500/15 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-500/25 transition"
                >
                  {locale === "ar" ? "ابدأ الاختبار" : "Take the Test"}
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-amber-300/20 bg-amber-500/8 p-6 backdrop-blur-xl">
            <p className="text-xs tracking-widest text-amber-200/80 mb-2">
              {locale === "ar" ? "تحدي اللعبة الأفضل" : "Best Game Challenge"}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-slate-300">{locale === "ar" ? "رقمك الشخصي" : "Your Best Score"}</span>
                <span className="font-semibold text-white">
                  {myBestScore !== null ? formatScoreValue(locale, myBestScore) : "--"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-slate-300">{locale === "ar" ? "أسرع وقت لك" : "Your Fastest Time"}</span>
                <span className="font-semibold text-white">
                  {myFastestTime !== null ? formatTimeMetric(locale, myFastestTime) : "--"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-slate-300">{locale === "ar" ? "اقتربت من الصدارة" : "Close to the Lead"}</span>
                <span className="font-semibold text-white">
                  {challengeGap !== null
                    ? challengeGap === 0
                      ? (locale === "ar" ? "أنت على القمة" : "You are on top")
                      : locale === "ar"
                        ? `${challengeGap} نقطة`
                        : `${challengeGap} points`
                    : (locale === "ar" ? "ابدأ التحدي" : "Start the challenge")}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onGoToGames}
              className="mt-4 w-full rounded-2xl border border-amber-300/30 bg-amber-500/15 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/25"
            >
              {locale === "ar" ? "هل تستطيع كسر الرقم؟" : "Can You Break the Score?"}
            </button>
          </div>
        </div>

        {/* Right: game scores */}
        <div className="rounded-3xl border border-white/15 bg-slate-900/50 p-6 backdrop-blur-xl sm:p-8">
          <h3 className="text-lg font-bold text-white mb-6">
            {locale === "ar" ? "نتائج الألعاب" : "Game Results"}
          </h3>
          <div className="space-y-5">
            {METRICS.map((m, i) => {
              const val = scores[m.key] as number | null;
              return (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`flex items-center gap-2 text-sm font-semibold ${m.color}`}>
                      <span>{m.icon}</span>
                      {m.label[locale]}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {val !== null ? `${val}%` : (locale === "ar" ? "لم تُلعب" : "Not played")}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700/40">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${m.bar}`}
                      initial={{ width: 0 }}
                      animate={{ width: val !== null ? `${val}%` : "0%" }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {completedGames < totalGames && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-sm text-slate-400">
                {locale === "ar"
                  ? `${totalGames - completedGames} ألعاب متبقية`
                  : `${totalGames - completedGames} games remaining`}
              </p>
              <button
                type="button"
                onClick={onGoToGames}
                className="mt-3 rounded-full border border-violet-300/30 bg-violet-500/15 px-5 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-500/25 transition"
              >
                {locale === "ar" ? "تابع الألعاب 🎮" : "Continue Playing 🎮"}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
