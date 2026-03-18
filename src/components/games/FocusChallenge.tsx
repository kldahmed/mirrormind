"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

type Phase = "intro" | "playing" | "result";

type FocusChallengeProps = {
  locale: Locale;
  onComplete: (score: number) => void;
  onBack: () => void;
};

type RuleSet = {
  rule: { ar: string; en: string };
  target: (n: number) => boolean;
};

const RULE_SETS: RuleSet[] = [
  { rule: { ar: "اضغط الأرقام الزوجية فقط", en: "Tap EVEN numbers only" }, target: (n) => n % 2 === 0 },
  { rule: { ar: "اضغط الأرقام الفردية فقط", en: "Tap ODD numbers only" }, target: (n) => n % 2 !== 0 },
  { rule: { ar: "اضغط الأرقام أكبر من 5", en: "Tap numbers GREATER than 5" }, target: (n) => n > 5 },
  { rule: { ar: "اضغط الأرقام أصغر من 5", en: "Tap numbers LESS than 5" }, target: (n) => n < 5 },
];

const TOTAL_ROUNDS = 4;
const ROUND_DURATION = 8;

function generateItems(): number[] {
  return Array.from({ length: 9 }, () => Math.floor(Math.random() * 9) + 1);
}

export function FocusChallenge({ locale, onComplete, onBack }: FocusChallengeProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [items, setItems] = useState<number[]>([]);
  const [tapped, setTapped] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [hits, setHits] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentRule = RULE_SETS[roundIndex % RULE_SETS.length];

  const endRound = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTotalHits((h) => h + hits);
    setTotalErrors((e) => e + errors);
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      setPhase("result");
    } else {
      setTimeout(() => {
        setRoundIndex((r) => r + 1);
        setItems(generateItems());
        setTapped([]);
        setHits(0);
        setErrors(0);
        setTimeLeft(ROUND_DURATION);
      }, 500);
    }
  }, [hits, errors, roundIndex]);

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          endRound();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, roundIndex, endRound]);

  const startGame = () => {
    setRoundIndex(0);
    setItems(generateItems());
    setTapped([]);
    setHits(0);
    setErrors(0);
    setTotalHits(0);
    setTotalErrors(0);
    setTimeLeft(ROUND_DURATION);
    setPhase("playing");
  };

  const handleTap = (index: number) => {
    if (tapped.includes(index)) return;
    setTapped((prev) => [...prev, index]);
    const num = items[index];
    if (currentRule.target(num)) {
      setHits((h) => h + 1);
    } else {
      setErrors((e) => e + 1);
    }
  };

  const totalTargets = TOTAL_ROUNDS * 9 * 0.5; // approximate
  const focusScore = Math.max(
    0,
    Math.round(((totalHits - totalErrors * 0.5) / Math.max(1, totalHits + totalErrors)) * 100),
  );

  const getFocusLabel = () => {
    if (focusScore >= 80)
      return {
        label: locale === "ar" ? "تركيز استثنائي 🎯" : "Exceptional Focus 🎯",
        desc: locale === "ar" ? "ذهنك حاضر وسريع ودقيق تحت الضغط" : "Your mind is sharp, fast, and precise under pressure",
      };
    if (focusScore >= 60)
      return {
        label: locale === "ar" ? "تركيز جيد جداً ⚡" : "Very Good Focus ⚡",
        desc: locale === "ar" ? "تحافظ على التركيز في معظم الأوقات" : "You maintain focus most of the time",
      };
    if (focusScore >= 40)
      return {
        label: locale === "ar" ? "تركيز متوسط 🌀" : "Average Focus 🌀",
        desc: locale === "ar" ? "تركيزك جيد لكن يتشتت أحياناً" : "Your focus is decent but occasionally wanders",
      };
    return {
      label: locale === "ar" ? "تركيز يحتاج تحسين 🔋" : "Focus Needs Improvement 🔋",
      desc: locale === "ar" ? "التدريب المنتظم يحسّن التركيز بشكل ملحوظ" : "Regular practice can significantly improve focus",
    };
  };

  if (phase === "intro") {
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="text-6xl">🎯</div>
          <h2 className="text-3xl font-bold text-white">{locale === "ar" ? "تحدي التركيز" : "Focus Challenge"}</h2>
          <p className="max-w-sm text-base text-slate-300">
            {locale === "ar"
              ? "٤ جولات — أرقام تظهر بسرعة، اضغط فقط ما يناسب القاعدة"
              : "4 rounds — numbers flash fast, tap only the ones that match the rule"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={startGame}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(16,185,129,0.4)] transition hover:opacity-90 active:scale-95"
            >
              {locale === "ar" ? "ابدأ 🎯" : "Start 🎯"}
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

  if (phase === "result") {
    const { label, desc } = getFocusLabel();
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-md flex-col items-center gap-6 text-center"
        >
          <div className="text-5xl">🎯</div>
          <p className="text-xs tracking-widest text-emerald-300/80">{locale === "ar" ? "مستوى تركيزك" : "Your Focus Level"}</p>
          <h2 className="text-2xl font-bold text-white">{label}</h2>
          <p className="text-base leading-relaxed text-slate-300">{desc}</p>
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <p className="text-xs text-slate-400">{locale === "ar" ? "إصابات" : "Hits"}</p>
              <p className="mt-1 text-2xl font-bold text-emerald-300">{totalHits}</p>
            </div>
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
              <p className="text-xs text-slate-400">{locale === "ar" ? "أخطاء" : "Errors"}</p>
              <p className="mt-1 text-2xl font-bold text-red-300">{totalErrors}</p>
            </div>
          </div>
          <div className="w-full rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
            <p className="text-sm text-slate-400">{locale === "ar" ? "درجة التركيز" : "Focus Score"}</p>
            <p className="mt-1 text-4xl font-bold text-emerald-300">{focusScore}%</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onComplete(focusScore)}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-green-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transition hover:opacity-90 active:scale-95"
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
        </motion.div>
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={roundIndex}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="flex w-full max-w-sm flex-col gap-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {locale === "ar" ? `الجولة ${roundIndex + 1}/${TOTAL_ROUNDS}` : `Round ${roundIndex + 1}/${TOTAL_ROUNDS}`}
            </span>
            <span className={timeLeft <= 3 ? "font-bold text-red-400" : "text-emerald-300"}>⏱ {timeLeft}s</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-slate-700">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-400"
              animate={{ width: `${(timeLeft / ROUND_DURATION) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>

          {/* Rule */}
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-center">
            <p className="text-sm font-bold text-emerald-200">{currentRule.rule[locale]}</p>
          </div>

          {/* Number grid */}
          <div className="grid grid-cols-3 gap-3">
            {items.map((num, i) => {
              const isTapped = tapped.includes(i);
              const isCorrect = isTapped && currentRule.target(num);
              const isWrong = isTapped && !currentRule.target(num);
              return (
                <motion.button
                  key={`${roundIndex}-${i}`}
                  type="button"
                  onClick={() => handleTap(i)}
                  disabled={isTapped}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: isTapped ? 0.5 : 1,
                    scale: isTapped ? 0.9 : 1,
                  }}
                  transition={{ duration: 0.15, delay: i * 0.03 }}
                  whileHover={!isTapped ? { scale: 1.1 } : {}}
                  whileTap={!isTapped ? { scale: 0.9 } : {}}
                  className={[
                    "flex h-16 w-full items-center justify-center rounded-2xl border text-2xl font-bold transition-all duration-150",
                    isCorrect ? "border-emerald-400/60 bg-emerald-500/30 text-emerald-200" : "",
                    isWrong ? "border-red-400/60 bg-red-500/30 text-red-200" : "",
                    !isTapped
                      ? "border-slate-600/50 bg-slate-800/70 text-white hover:border-emerald-400/40 hover:bg-slate-700/80 cursor-pointer"
                      : "cursor-default",
                  ].join(" ")}
                >
                  {num}
                </motion.button>
              );
            })}
          </div>

          {/* Live score */}
          <div className="flex justify-center gap-4 text-xs">
            <span className="text-emerald-400">
              ✓ {hits} {locale === "ar" ? "صحيح" : "correct"}
            </span>
            <span className="text-red-400">
              ✗ {errors} {locale === "ar" ? "خطأ" : "wrong"}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
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
