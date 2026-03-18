"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShareModal } from "@/components/ShareModal";
import { MEMORY_SYMBOLS } from "@/data/gameData";
import { getBadgeForScore, type ShareableResult } from "@/lib/challenge";
import type { Locale } from "@/lib/i18n";

type Phase = "intro" | "show" | "hide" | "answer" | "result";

type MemoryFlashProps = {
  locale: Locale;
  onComplete: (score: number, durationMs: number) => void;
  onBack: () => void;
};

const ROUNDS = 3;
const SHOW_COUNT = 6;
const SHOW_DURATION = 3000;

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function pickDistractors<T>(arr: T[], exclude: T[], n: number): T[] {
  const pool = arr.filter((x) => !exclude.includes(x));
  return pickRandom(pool, n);
}

export function MemoryFlash({ locale, onComplete, onBack }: MemoryFlashProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [shownSymbols, setShownSymbols] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [roundScores, setRoundScores] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(SHOW_DURATION / 1000);
  const [finalDurationMs, setFinalDurationMs] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const sessionStartRef = useRef(0);

  const startRound = () => {
    const shown = pickRandom(MEMORY_SYMBOLS, SHOW_COUNT);
    const distractors = pickDistractors(MEMORY_SYMBOLS, shown, 4);
    const allChoices = [...shown, ...distractors].sort(() => Math.random() - 0.5);
    setShownSymbols(shown);
    setChoices(allChoices);
    setSelected([]);
    setCountdown(SHOW_DURATION / 1000);
    setPhase("show");
  };

  useEffect(() => {
    if (phase !== "show") return;
    let count = SHOW_DURATION / 1000;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setPhase("hide");
        setTimeout(() => setPhase("answer"), 400);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, round]);

  const toggleSymbol = (s: string) => {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const submitAnswer = () => {
    const hits = selected.filter((s) => shownSymbols.includes(s)).length;
    const misses = selected.filter((s) => !shownSymbols.includes(s)).length;
    const score = Math.max(0, Math.round(((hits - misses) / SHOW_COUNT) * 100));
    const next = [...roundScores, score];
    setRoundScores(next);
    if (round + 1 >= ROUNDS) {
      setFinalDurationMs(Date.now() - sessionStartRef.current);
      setPhase("result");
    } else {
      setRound((r) => r + 1);
      setTimeout(startRound, 500);
    }
  };

  const finalScore = roundScores.length > 0 ? Math.round(roundScores.reduce((a, b) => a + b, 0) / roundScores.length) : 0;
  const shareResult = useMemo<ShareableResult>(
    () => ({
      id: "memory",
      icon: "🔮",
      title: { ar: "اختبار الذاكرة", en: "Memory Flash" },
      score: finalScore,
      timeMs: finalDurationMs,
      timeKind: "time",
      badge: getBadgeForScore("memory", finalScore),
      subtitle: {
        ar: "اختبر سرعة الاستحضار ودقة التذكر تحت الضغط.",
        en: "Test recall speed and memory precision under pressure.",
      },
    }),
    [finalDurationMs, finalScore],
  );

  const getMemoryLabel = (score: number) => {
    if (score >= 80) return locale === "ar" ? "ذاكرة خارقة 🌟" : "Exceptional Memory 🌟";
    if (score >= 60) return locale === "ar" ? "ذاكرة قوية 💪" : "Strong Memory 💪";
    if (score >= 40) return locale === "ar" ? "ذاكرة جيدة 👍" : "Good Memory 👍";
    return locale === "ar" ? "ذاكرة تحتاج تدريب 🔄" : "Memory Needs Training 🔄";
  };

  if (phase === "intro") {
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="text-6xl">🔮</div>
          <h2 className="text-3xl font-bold text-white">{locale === "ar" ? "اختبار الذاكرة" : "Memory Flash"}</h2>
          <p className="max-w-sm text-base text-slate-300">
            {locale === "ar"
              ? "ستظهر ٦ رموز لمدة ٣ ثوانٍ — احفظها جيداً ثم اختر الصحيح منها"
              : "6 symbols appear for 3 seconds — memorize them, then pick the ones you saw"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                sessionStartRef.current = Date.now();
                setFinalDurationMs(0);
                startRound();
              }}
              className="rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.4)] transition hover:opacity-90 active:scale-95"
            >
              {locale === "ar" ? "ابدأ 🔮" : "Start 🔮"}
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

  if (phase === "show") {
    return (
      <GameContainer>
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <p className="text-xs tracking-widest text-violet-300">
            {locale === "ar" ? `الجولة ${round + 1} من ${ROUNDS}` : `Round ${round + 1} of ${ROUNDS}`}
          </p>
          <div className="flex items-center gap-2 text-4xl font-bold text-violet-300">
            <span>{countdown}</span>
          </div>
          <p className="text-sm text-slate-400">{locale === "ar" ? "احفظ هذه الرموز!" : "Memorize these symbols!"}</p>
          <div className="grid grid-cols-3 gap-4">
            {shownSymbols.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/20 text-4xl shadow-[0_0_20px_rgba(139,92,246,0.2)]"
              >
                {s}
              </motion.div>
            ))}
          </div>
        </div>
      </GameContainer>
    );
  }

  if (phase === "hide") {
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="text-6xl">👁‍🗨</div>
          <p className="mt-4 text-lg text-slate-300">{locale === "ar" ? "الآن تذكّر..." : "Now remember..."}</p>
        </motion.div>
      </GameContainer>
    );
  }

  if (phase === "answer") {
    return (
      <GameContainer>
        <div className="flex w-full max-w-md flex-col gap-5">
          <p className="text-center text-sm text-slate-300">
            {locale === "ar" ? `اختر الـ٦ رموز التي رأيتها (${selected.length}/6)` : `Choose the 6 symbols you saw (${selected.length}/6)`}
          </p>
          <div className="grid grid-cols-5 gap-3">
            {choices.map((s, i) => {
              const isSel = selected.includes(s);
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => toggleSymbol(s)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  className={[
                    "flex h-14 w-14 items-center justify-center rounded-xl border text-3xl transition-all duration-150",
                    isSel
                      ? "border-violet-400/60 bg-violet-500/30 shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                      : "border-slate-600/50 bg-slate-800/60 hover:border-violet-400/30",
                  ].join(" ")}
                >
                  {s}
                </motion.button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={submitAnswer}
            disabled={selected.length === 0}
            className="rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            {locale === "ar" ? "تأكيد" : "Confirm"}
          </button>
        </div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      >
        <div className="text-5xl">🔮</div>
        <p className="text-xs tracking-widest text-violet-300/80">{locale === "ar" ? "نتيجة الذاكرة" : "Memory Result"}</p>
        <h2 className="text-3xl font-bold text-white">{getMemoryLabel(finalScore)}</h2>
        <div className="w-full rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
          <p className="text-sm text-slate-400">{locale === "ar" ? "درجة الذاكرة" : "Memory Score"}</p>
          <p className="mt-1 text-4xl font-bold text-violet-300">{finalScore}%</p>
        </div>
        <div className="inline-flex rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-1 text-sm font-semibold text-violet-100">
          {shareResult.badge[locale]}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="rounded-full border border-cyan-300/35 bg-cyan-500/15 px-8 py-3 text-sm font-bold text-cyan-50 transition hover:bg-cyan-500/25 active:scale-95"
          >
            {locale === "ar" ? "شارك" : "Share"}
          </button>
          <button
            type="button"
            onClick={() => onComplete(finalScore, finalDurationMs)}
            className="rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition hover:opacity-90 active:scale-95"
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
