"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import {
  FEATURED_GAME_ID,
  GAME_META,
  fetchFeaturedLeaderboard,
  filterEntriesByGame,
  filterEntriesByScope,
  formatScoreValue,
  formatTimeMetric,
  getConsecutiveDayStreak,
  getDailyFeaturedGameId,
  getFastestEntry,
  getGapToLeader,
  getLocalAttempts,
  getPersonalBest,
  getRankedEntries,
  getStoredPlayerName,
  toShareableResult,
  type ChallengeEntry,
  type GameId,
  type LeaderboardScope,
  type ShareableResult,
} from "@/lib/challenge";
import { ShareModal } from "@/components/ShareModal";

type FeaturedChallengeHubProps = {
  locale: Locale;
  onStartGame: (gameId: GameId) => void;
};

export function FeaturedChallengeHub({ locale, onStartGame }: FeaturedChallengeHubProps) {
  const [scope, setScope] = useState<LeaderboardScope>("today");
  const [featuredEntries, setFeaturedEntries] = useState<ChallengeEntry[]>([]);
  const [localEntries] = useState<ChallengeEntry[]>(() => getLocalAttempts());
  const [shareTarget, setShareTarget] = useState<ShareableResult | null>(null);
  const [playerName, setPlayerName] = useState(() => getStoredPlayerName());

  useEffect(() => {
    void fetchFeaturedLeaderboard().then((entries) => setFeaturedEntries(entries));
  }, []);

  const handleCloseShare = () => {
    setShareTarget(null);
    setPlayerName(getStoredPlayerName());
  };

  const featuredLocal = useMemo(
    () => filterEntriesByGame(localEntries, FEATURED_GAME_ID),
    [localEntries],
  );
  const leaderboardSource = featuredEntries.length > 0 ? featuredEntries : featuredLocal;
  const scopedEntries = useMemo(
    () => filterEntriesByScope(leaderboardSource, scope),
    [leaderboardSource, scope],
  );
  const rankedEntries = useMemo(() => getRankedEntries(scopedEntries).slice(0, 8), [scopedEntries]);
  const bestOverall = useMemo(() => getPersonalBest(leaderboardSource), [leaderboardSource]);
  const fastestOverall = useMemo(() => getFastestEntry(leaderboardSource), [leaderboardSource]);
  const myBestFeatured = useMemo(() => getPersonalBest(featuredLocal), [featuredLocal]);
  const streak = useMemo(() => getConsecutiveDayStreak(featuredLocal), [featuredLocal]);
  const gapToLeader = useMemo(() => getGapToLeader(leaderboardSource, myBestFeatured), [leaderboardSource, myBestFeatured]);

  const dailyGameId = getDailyFeaturedGameId();
  const dailyAttempts = filterEntriesByGame(localEntries, dailyGameId);
  const dailyTop = getPersonalBest(filterEntriesByScope(dailyAttempts, "today"));
  const dailyMine = getPersonalBest(dailyAttempts);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-amber-300/20 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_28%),linear-gradient(140deg,rgba(2,6,23,0.94),rgba(15,23,42,0.9))] p-5 shadow-[0_0_60px_rgba(245,158,11,0.1)] backdrop-blur-xl sm:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex rounded-full border border-amber-300/30 bg-amber-500/10 px-4 py-1 text-[11px] font-semibold tracking-[0.22em] text-amber-100">
              {locale === "ar" ? "لعبة التحدي الرئيسية" : "SIGNATURE CHALLENGE"}
            </div>
            <h3 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {locale === "ar" ? "تحدي اللعبة الأفضل" : "Best Game Challenge"}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {locale === "ar"
                ? "سرعة القرار أصبحت ساحة المنافسة الأساسية في MirrorMind. عد تنازلي حاد، استجابة أسرع، ولوحة صدارة تضغط عليك حتى تكسر رقمك."
                : "Decision Speed is now MirrorMind's signature battleground. Sharp countdown, faster reactions, and a leaderboard built to push you past your personal best."}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <StatTile
                label={locale === "ar" ? "اللعبة المميزة" : "Featured Game"}
                value={GAME_META[FEATURED_GAME_ID].name[locale]}
                tone="amber"
              />
              <StatTile
                label={locale === "ar" ? "أفضل نتيجة" : "Best Score"}
                value={bestOverall ? formatScoreValue(locale, bestOverall.score) : "--"}
                tone="amber"
              />
              <StatTile
                label={locale === "ar" ? "أسرع وقت" : "Fastest Time"}
                value={fastestOverall ? formatTimeMetric(locale, fastestOverall.timeMs) : "--"}
                tone="cyan"
              />
              <StatTile
                label={locale === "ar" ? "أفضل لاعب" : "Top Player"}
                value={bestOverall?.playerName ?? (locale === "ar" ? "لم يبدأ بعد" : "No challenger yet")}
                tone="violet"
              />
              <StatTile
                label={locale === "ar" ? "أفضل محاولة لك" : "Your Best Attempt"}
                value={myBestFeatured ? formatScoreValue(locale, myBestFeatured.score) : "--"}
                tone="emerald"
              />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onStartGame(FEATURED_GAME_ID)}
                className="h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-semibold text-white shadow-[0_0_24px_rgba(245,158,11,0.22)] transition hover:opacity-95 active:scale-[0.99]"
              >
                {locale === "ar" ? "ابدأ تحدي اللعبة الأفضل" : "Start the Best Game Challenge"}
              </button>
              {myBestFeatured && (
                <button
                  type="button"
                  onClick={() => setShareTarget(toShareableResult(myBestFeatured))}
                  className="h-12 rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  {locale === "ar" ? "شارك أفضل نتيجتك" : "Share Your Best Result"}
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-900/55 p-5 backdrop-blur-xl">
            <p className="text-xs tracking-[0.2em] text-white/55">
              {locale === "ar" ? "شعور التحدي العالمي" : "WORLD CHALLENGE FEEL"}
            </p>
            <div className="mt-4 space-y-4">
              <PressureRow
                label={locale === "ar" ? "رقمك الشخصي" : "Your Personal Best"}
                value={myBestFeatured ? formatScoreValue(locale, myBestFeatured.score) : "--"}
              />
              <PressureRow
                label={locale === "ar" ? "أسرع وقت لك" : "Your Fastest Time"}
                value={myBestFeatured ? formatTimeMetric(locale, myBestFeatured.timeMs) : "--"}
              />
              <PressureRow
                label={locale === "ar" ? "سلسلة التحدي" : "Your Streak"}
                value={locale === "ar" ? `${streak} يوم` : `${streak} day${streak === 1 ? "" : "s"}`}
              />
              <PressureRow
                label={locale === "ar" ? "اقتربت من الصدارة" : "Close to the Lead"}
                value={
                  gapToLeader
                    ? gapToLeader.scoreGap > 0
                      ? locale === "ar"
                        ? `يفصلك ${gapToLeader.scoreGap} نقطة`
                        : `${gapToLeader.scoreGap} points away`
                      : gapToLeader.timeGapMs !== null && gapToLeader.timeGapMs > 0
                        ? locale === "ar"
                          ? `أبطأ بـ ${formatTimeMetric(locale, gapToLeader.timeGapMs)}`
                          : `${formatTimeMetric(locale, gapToLeader.timeGapMs)} slower`
                        : locale === "ar"
                          ? "أنت على القمة"
                          : "You are tied for the top"
                    : locale === "ar"
                      ? "هل تستطيع كسر الرقم؟"
                      : "Can you break the top score?"
                }
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs tracking-[0.2em] text-slate-400">
                {locale === "ar" ? "لوحة الصدارة" : "LEADERBOARD"}
              </p>
              <h4 className="mt-2 text-2xl font-bold text-white">
                {locale === "ar" ? "من يسيطر على التحدي الآن؟" : "Who owns the challenge right now?"}
              </h4>
            </div>
            <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
              {([
                ["today", locale === "ar" ? "اليوم" : "Today"],
                ["week", locale === "ar" ? "هذا الأسبوع" : "This Week"],
                ["all", locale === "ar" ? "كل الوقت" : "All Time"],
              ] as [LeaderboardScope, string][]).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScope(value)}
                  className={[
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    scope === value ? "bg-white text-slate-950" : "text-slate-300 hover:text-white",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {rankedEntries.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-5 text-sm text-slate-400">
                {locale === "ar"
                  ? "لم تُسجّل أي نتائج بعد. ابدأ الجولة الأولى وكن أول اسم على اللوحة."
                  : "No results yet. Start the first run and claim the top slot."}
              </div>
            )}
            {rankedEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 text-sm font-bold text-white">
                  #{entry.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{entry.playerName}</p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-300">
                      {entry.badge[locale]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {locale === "ar" ? "التاريخ" : "Date"}: {new Date(entry.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB")}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-lg font-bold text-white">{formatScoreValue(locale, entry.score)}</p>
                  <p className="text-xs text-slate-400">{formatTimeMetric(locale, entry.timeMs)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-cyan-300/20 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_28%),rgba(15,23,42,0.92)] p-5 backdrop-blur-xl sm:p-6">
            <p className="text-xs tracking-[0.2em] text-cyan-200/70">
              {locale === "ar" ? "تحدي اليوم" : "DAILY FEATURED CHALLENGE"}
            </p>
            <h4 className="mt-2 text-2xl font-bold text-white">{locale === "ar" ? "تحدي اليوم" : "Today’s Challenge"}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {locale === "ar"
                ? `اليوم نسلّط الضوء على ${GAME_META[dailyGameId].name.ar}. العب الآن، سجّل محاولتك، وشاركها مباشرة.`
                : `Today we spotlight ${GAME_META[dailyGameId].name.en}. Play now, log your run, and share it immediately.`}
            </p>

            <div className="mt-4 grid gap-3">
              <StatTile
                label={locale === "ar" ? "تحدي اليوم" : "Today’s Game"}
                value={GAME_META[dailyGameId].name[locale]}
                tone="cyan"
              />
              <StatTile
                label={locale === "ar" ? "أفضل نتيجة اليوم" : "Top Result Today"}
                value={dailyTop ? `${dailyTop.playerName} · ${formatScoreValue(locale, dailyTop.score)}` : "--"}
                tone="violet"
              />
              <StatTile
                label={locale === "ar" ? "محاولتك" : "Your Attempt"}
                value={dailyMine ? formatScoreValue(locale, dailyMine.score) : (locale === "ar" ? "لا توجد محاولة" : "No attempt yet")}
                tone="emerald"
              />
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => onStartGame(dailyGameId)}
                className="h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 px-5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                {locale === "ar" ? "ابدأ تحدي اليوم" : "Start Today’s Challenge"}
              </button>
              <button
                type="button"
                disabled={!dailyMine}
                onClick={() => dailyMine && setShareTarget(toShareableResult(dailyMine))}
                className="h-12 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {locale === "ar" ? "شارك نتيجتك" : "Share Your Result"}
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-xs tracking-[0.2em] text-slate-400">
              {locale === "ar" ? "اسمك الحالي" : "CURRENT PLAYER NAME"}
            </p>
            <h4 className="mt-2 text-xl font-bold text-white">{playerName || (locale === "ar" ? "سيظهر عند أول مشاركة" : "Will appear on first share")}</h4>
            <p className="mt-2 text-sm text-slate-400">
              {locale === "ar"
                ? "سيُستخدم اسم العرض في بطاقات المشاركة، نتائج التحدي، ولوحة الصدارة."
                : "Your display name is used in share cards, challenge results, and leaderboard entries."}
            </p>
          </section>
        </div>
      </section>

      <ShareModal locale={locale} open={shareTarget !== null} result={shareTarget} onClose={handleCloseShare} />
    </div>
  );
}

function StatTile({ label, value, tone }: { label: string; value: string; tone: "amber" | "cyan" | "violet" | "emerald" }) {
  const tones = {
    amber: "border-amber-300/20 bg-amber-500/8 text-amber-100",
    cyan: "border-cyan-300/20 bg-cyan-500/8 text-cyan-100",
    violet: "border-violet-300/20 bg-violet-500/8 text-violet-100",
    emerald: "border-emerald-300/20 bg-emerald-500/8 text-emerald-100",
  };

  return (
    <div className={["rounded-2xl border px-4 py-3", tones[tone]].join(" ")}>
      <p className="text-[11px] tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function PressureRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-sm text-slate-300">{label}</p>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}