"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DECISION_SCENARIOS, type DecisionScenario } from "@/data/gameData";
import type { DecisionStyle } from "@/lib/gameScores";
import type { Locale } from "@/lib/i18n";

type Phase = "intro" | "playing" | "result";

type DecisionSpeedProps = {
  locale: Locale;
  onComplete: (style: DecisionStyle, score: number) => void;
  onBack: () => void;
};

const TIMER_SECS = 3;

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
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentQ: DecisionScenario | undefined = DECISION_SCENARIOS[questionIndex];

  const advance = useCallback(
    (choiceIndex: number | null) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const rt = Date.now() - startTimeRef.current;
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
          startTimeRef.current = Date.now();
        }
      }, 350);
    },
    [questionIndex, currentQ],
  );

  useEffect(() => {
    if (phase !== "playing") return;
    startTimeRef.current = Date.now();
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
              ? "ستظهر لك ٨ مواقف — لديك ٣ ثوانٍ فقط لاختيار ردّك الفوري"
              : "8 situations — only 3 seconds each to choose your instinctive response"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPhase("playing")}
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(245,158,11,0.4)] transition hover:opacity-90 active:scale-95"
            >
              {locale === "ar" ? "ابدأ ⚡" : "Start ⚡"}
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
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-md flex-col items-center gap-6 text-center"
        >
          <div className="text-5xl">🧠</div>
          <p className="text-xs tracking-widest text-amber-300/80">{locale === "ar" ? "أسلوب قراراتك" : "Your Decision Style"}</p>
          <h2 className="text-3xl font-bold text-white">{styleLabels[finalStyle][locale]}</h2>
          <p className="text-base leading-relaxed text-slate-300">{styleDescs[finalStyle][locale]}</p>
          <div className="w-full rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4">
            <p className="text-sm text-slate-400">{locale === "ar" ? "سرعة الاستجابة" : "Response Speed"}</p>
            <p className="mt-1 text-2xl font-bold text-amber-300">{speedScore}%</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onComplete(finalStyle, speedScore)}
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
          className="flex w-full max-w-md flex-col gap-5"
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
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / TIMER_SECS) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>

          {/* Scenario */}
          <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-6 text-center">
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
