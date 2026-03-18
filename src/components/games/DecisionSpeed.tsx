"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShareModal } from "@/components/ShareModal";
import { DECISION_SCENARIOS, type DecisionScenario } from "@/data/gameData";
import {
  fetchFeaturedLeaderboard,
  filterEntriesByGame,
  getBadgeForScore,
  getLocalAttempts,
  getPersonalBest,
  type ShareableResult,
} from "@/lib/challenge";
import type { DecisionStyle } from "@/lib/gameScores";
import type { Locale } from "@/lib/i18n";

type Phase = "intro" | "countdown" | "playing" | "result";

type DecisionSpeedProps = {
  locale: Locale;
  onComplete: (style: DecisionStyle, score: number, reactionMs: number) => void;
  onBack: () => void;
};

const TIMER_SECS = 3;
const COUNTDOWN_START = 3;
const now = () => Date.now();

const styleLabels: Record<DecisionStyle, { ar: string; en: string }> = {
  analytical: { ar: "تحليلي", en: "Analytical" },
  social: { ar: "اجتماعي", en: "Social" },
  impulsive: { ar: "عفوي", en: "Impulsive" },
};

const styleDescs: Record<DecisionStyle, { ar: string; en: string }> = {
  analytical: {
    ar: "أنت تفكر قبل أن تتصرف — عقلك يبحث دائماً عن المنطق",
    en: "You think before you act — your mind always seeks logic",
  },
  social: {
    ar: "أنت تراعي الآخرين دائماً — طبيعتك اجتماعية ودافئة",
    en: "You always consider others — you're naturally social and warm",
  },
  impulsive: {
    ar: "أنت سريع وجريء — تثق بحدسك الأول وتتصرف على الفور",
    en: "You're fast and bold — you trust your first instinct",
  },
};

function computeStyle(choices: (DecisionStyle | null)[]): DecisionStyle {
  const counts: Record<DecisionStyle, number> = { analytical: 0, social: 0, impulsive: 0 };
  for (const c of choices) if (c) counts[c]++;
  return (Object.keys(counts) as DecisionStyle[]).reduce((a, b) => (counts[a] >= counts[b] ? a : b));
}

export function DecisionSpeed({ locale, onComplete, onBack }: DecisionSpeedProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choices, setChoices] = useState<(DecisionStyle | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECS);
  const [selected, setSelected] = useState<number | null>(null);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(COUNTDOWN_START);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [topReference, setTopReference] = useState<{ score: number; timeMs: number | null } | null>(null);
  const [previousBest, setPreviousBest] = useState<{ score: number; timeMs: number | null } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentQ: DecisionScenario | undefined = DECISION_SCENARIOS[questionIndex];

  useEffect(() => {
    const localBest = getPersonalBest(filterEntriesByGame(getLocalAttempts(), "decision"));
    setPreviousBest(localBest ? { score: localBest.score, timeMs: localBest.timeMs } : null);
    void fetchFeaturedLeaderboard().then((entries) => {
      const top = getPersonalBest(entries);
      setTopReference(top ? { score: top.score, timeMs: top.timeMs } : null);
    });
  }, []);

  const advance = useCallback(
    (choiceIndex: number | null) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const rt = now() - startTimeRef.current;
      const style = choiceIndex !== null ? currentQ?.choices[choiceIndex]?.type ?? null : null;
      setReactionTimes((prev) => [...prev, rt]);
      setChoices((prev) => [...prev, style]);
      setSelected(choiceIndex);
      setTimeout(() => {
        if (questionIndex + 1 >= DECISION_SCENARIOS.length) {
          setPhase("result");
        } else {
          setQuestionIndex((i) => i + 1);
          setTimeLeft(TIMER_SECS);
          setSelected(null);
          startTimeRef.current = now();
        }
      }, 350);
    },
    [questionIndex, currentQ],
  );

  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdown(COUNTDOWN_START);
    const interval = setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          clearInterval(interval);
          setQuestionIndex(0);
          setChoices([]);
          setReactionTimes([]);
          setSelected(null);
          setTimeLeft(TIMER_SECS);
          setPhase("playing");
          return 0;
        }
        return value - 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    startTimeRef.current = now();
    setTimeLeft(TIMER_SECS);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          advance(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, questionIndex, advance]);

  const finalStyle = choices.length > 0 ? computeStyle(choices) : "analytical";
  const avgReaction =
    reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 3000;
  const speedScore = Math.max(0, Math.round(100 - (avgReaction / (TIMER_SECS * 1000)) * 100));
  const answeredCount = choices.filter((value) => value !== null).length;
  const missedCount = choices.length - answeredCount;
  const shareResult = useMemo<ShareableResult>(
    () => ({
      id: "decision",
      icon: "⚡",
      title: { ar: "سرعة القرار", en: "Decision Speed" },
      score: speedScore,
      timeMs: avgReaction,
      timeKind: "reaction",
      badge: getBadgeForScore(
        "decision",
        speedScore,
        topReference && (speedScore > topReference.score || (speedScore === topReference.score && avgReaction < (topReference.timeMs ?? Infinity)))
          ? 1
          : undefined,
      ),
      subtitle: styleDescs[finalStyle],
    }),
    [avgReaction, finalStyle, speedScore, topReference],
  );
  const isNewPersonalBest =
    previousBest === null ||
    speedScore > previousBest.score ||
    (speedScore === previousBest.score && avgReaction < (previousBest.timeMs ?? Infinity));
  const isTopHighlight =
    topReference !== null &&
    (speedScore > topReference.score || (speedScore === topReference.score && avgReaction < (topReference.timeMs ?? Infinity)));

  if (phase === "intro") {
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="text-6xl">⚡</div>
          <h2 className="text-3xl font-bold text-white">{locale === "ar" ? "سرعة القرار" : "Decision Speed"}</h2>
          <p className="max-w-sm text-base text-slate-300">
            {locale === "ar"
              ? "هذا هو التحدي الرئيسي. ٨ مواقف خاطفة، ٣ ثوانٍ فقط، ولوحة صدارة لا ترحم."
              : "This is the signature challenge. 8 flash situations, only 3 seconds each, and a ruthless leaderboard."}
          </p>
          <div className="grid w-full max-w-lg gap-3 sm:grid-cols-3">
            <IntroStat label={locale === "ar" ? "العد التنازلي" : "Countdown"} value={locale === "ar" ? "3..2..1" : "3..2..1"} />
            <IntroStat label={locale === "ar" ? "نوع القياس" : "Metric"} value={locale === "ar" ? "متوسط رد الفعل" : "Average reaction"} />
            <IntroStat label={locale === "ar" ? "هدفك" : "Target"} value={locale === "ar" ? "اكسر رقمك" : "Beat your best"} />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPhase("countdown")}
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(245,158,11,0.4)] transition hover:opacity-90 active:scale-95"
            >
              {locale === "ar" ? "ابدأ التحدي ⚡" : "Start Challenge ⚡"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-slate-500/50 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              {locale === "ar" ? "رجوع" : "Back"}
            </button>
          </div>
        </motion.div>
      </GameContainer>
    );
  }

  if (phase === "countdown") {
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex min-h-[360px] w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-[32px] border border-amber-300/20 bg-[radial-gradient(circle,rgba(251,191,36,0.18),transparent_30%),rgba(2,6,23,0.9)] p-8 text-center"
        >
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            className="text-8xl font-black tracking-tight text-white sm:text-9xl"
          >
            {countdown > 0 ? countdown : locale === "ar" ? "ابدأ" : "GO"}
          </motion.div>
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-amber-100/75">
            {locale === "ar" ? "هل تستطيع كسر الرقم؟" : "Can you break the score?"}
          </p>
          <div className="pointer-events-none absolute inset-0 border border-white/5" />
        </motion.div>
      </GameContainer>
    );
  }

  if (phase === "result") {
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-xl flex-col items-center gap-6 text-center"
        >
          <div className="text-5xl">🧠</div>
          <p className="text-xs tracking-widest text-amber-300/80">{locale === "ar" ? "نتيجة التحدي" : "Challenge Result"}</p>
          <h2 className="text-3xl font-bold text-white">{styleLabels[finalStyle][locale]}</h2>
          <p className="text-base leading-relaxed text-slate-300">{styleDescs[finalStyle][locale]}</p>

          <div className="inline-flex rounded-full border border-amber-300/30 bg-amber-500/10 px-4 py-1 text-sm font-semibold text-amber-100">
            {shareResult.badge[locale]}
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3">
            <ResultStat
              label={locale === "ar" ? "النتيجة" : "Score"}
              value={`${speedScore}`}
              accent="text-amber-300"
            />
            <ResultStat
              label={locale === "ar" ? "متوسط رد الفعل" : "Avg Reaction"}
              value={`${(avgReaction / 1000).toFixed(2)}s`}
              accent="text-cyan-300"
            />
            <ResultStat
              label={locale === "ar" ? "الإجابات السريعة" : "Fast Picks"}
              value={`${answeredCount}/${DECISION_SCENARIOS.length}`}
              accent="text-emerald-300"
            />
          </div>

          {(isNewPersonalBest || isTopHighlight) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
            >
              {isNewPersonalBest && (
                <p className="text-sm font-semibold text-emerald-300">
                  {locale === "ar" ? "رقم شخصي جديد. هذا أفضل أداء لك حتى الآن." : "New personal best. This is your strongest run so far."}
                </p>
              )}
              {isTopHighlight && (
                <p className="mt-2 text-sm font-semibold text-amber-200">
                  {locale === "ar" ? "أنت الآن في منطقة القمة. هذا الأداء يهدد الصدارة." : "You are in top-score territory. This run threatens the lead."}
                </p>
              )}
            </motion.div>
          )}

          <div className="grid w-full gap-3 sm:grid-cols-2">
            <ResultStat
              label={locale === "ar" ? "أخطاء الوقت" : "Missed By Timeout"}
              value={`${missedCount}`}
              accent="text-rose-300"
            />
            <ResultStat
              label={locale === "ar" ? "الهدف التالي" : "Next Goal"}
              value={locale === "ar" ? "هل تستطيع كسر الرقم؟" : "Can you beat the top score?"}
              accent="text-violet-300"
            />
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="rounded-full border border-cyan-300/40 bg-cyan-500/18 px-8 py-3 text-sm font-bold text-cyan-50 transition hover:bg-cyan-500/28 active:scale-95"
            >
              {locale === "ar" ? "شارك التحدي" : "Share Challenge"}
            </button>
            <button
              type="button"
              onClick={() => onComplete(finalStyle, speedScore, avgReaction)}
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.3)] transition hover:opacity-90 active:scale-95"
            >
              {locale === "ar" ? "حفظ النتيجة" : "Save Result"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-slate-500/50 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              {locale === "ar" ? "رجوع" : "Back"}
            </button>
          </div>

          <ShareModal locale={locale} open={isShareOpen} result={shareResult} onClose={() => setIsShareOpen(false)} />
        </motion.div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, x: locale === "ar" ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: locale === "ar" ? 30 : -30 }}
          transition={{ duration: 0.3 }}
          className="flex w-full max-w-lg flex-col gap-5"
        >
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {questionIndex + 1} / {DECISION_SCENARIOS.length}
            </span>
            <span className={timeLeft <= 1 ? "text-red-400" : "text-amber-300"}>⏱ {timeLeft}s</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-slate-700">
            <motion.div
              className={[
                "h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400",
                timeLeft <= 1 ? "shadow-[0_0_18px_rgba(248,113,113,0.6)]" : "",
              ].join(" ")}
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / TIMER_SECS) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <LiveStat label={locale === "ar" ? "النتيجة الحالية" : "Live Score"} value={`${Math.max(0, Math.round(100 - (reactionTimes.reduce((sum, value) => sum + value, 0) / Math.max(1, reactionTimes.length || 1) / (TIMER_SECS * 1000)) * 100))}`} />
            <LiveStat label={locale === "ar" ? "الإجابات" : "Answered"} value={`${answeredCount}`} />
            <LiveStat label={locale === "ar" ? "الضغط" : "Pressure"} value={timeLeft <= 1 ? (locale === "ar" ? "عالٍ" : "High") : (locale === "ar" ? "مستقر" : "Stable")} />
          </div>

          {/* Scenario */}
          <div className={[
            "rounded-2xl border p-6 text-center transition",
            timeLeft <= 1 ? "border-red-400/25 bg-red-500/10" : "border-amber-400/20 bg-amber-500/10",
          ].join(" ")}>
            <p className="text-xl font-bold leading-snug text-white sm:text-2xl">{currentQ?.situation[locale]}</p>
          </div>

          {/* Choices */}
          <div className="grid gap-3">
            {currentQ?.choices.map((choice, i) => {
              const isSelected = selected === i;
              const isDimmed = selected !== null && !isSelected;
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => selected === null && advance(i)}
                  disabled={selected !== null}
                  animate={{ opacity: isDimmed ? 0.35 : 1, scale: isSelected ? 1.02 : 1 }}
                  whileHover={selected === null ? { scale: 1.015 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  className={[
                    "w-full rounded-xl border px-5 py-4 text-sm font-semibold transition-colors duration-150",
                    isSelected
                      ? "border-amber-400/60 bg-amber-500/25 text-white"
                      : "border-slate-600/50 bg-slate-800/60 text-slate-100 hover:border-amber-300/40 hover:bg-slate-700/70",
                    selected !== null ? "cursor-default" : "cursor-pointer",
                  ].join(" ")}
                >
                  {choice.text[locale]}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </GameContainer>
  );
}

function IntroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function ResultStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={["mt-2 text-2xl font-bold", accent].join(" ")}>{value}</p>
    </div>
  );
}

function LiveStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-center">
      <p className="text-[11px] tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function GameContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="relative z-10 mx-auto flex min-h-[80vh] w-full max-w-2xl items-center justify-center px-5 py-12 sm:px-8"
    >
      {children}
    </motion.div>
  );
}
