"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { INTUITION_SCENARIOS } from "@/data/gameData";
import type { Locale } from "@/lib/i18n";

type Phase = "intro" | "playing" | "result";

type IntuitionTestProps = {
  locale: Locale;
  onComplete: (score: number) => void;
  onBack: () => void;
};

export function IntuitionTest({ locale, onComplete, onBack }: IntuitionTestProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  const currentQ = INTUITION_SCENARIOS[questionIndex];

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const score = currentQ.options[optionIndex].score;
    setTotalScore((t) => t + score);
    setShowInsight(true);
    setTimeout(() => {
      setShowInsight(false);
      setTimeout(() => {
        if (questionIndex + 1 >= INTUITION_SCENARIOS.length) {
          setPhase("result");
        } else {
          setQuestionIndex((i) => i + 1);
          setSelected(null);
        }
      }, 200);
    }, 1600);
  };

  const maxPossible = INTUITION_SCENARIOS.length * 3;
  const intuitionScore = Math.round((totalScore / maxPossible) * 100);

  const getIntuitionLabel = () => {
    if (intuitionScore >= 80)
      return {
        label: locale === "ar" ? "حدس حاد جداً 🔮" : "Sharp Intuition 🔮",
        desc:
          locale === "ar"
            ? "تقرأ المواقف والناس بدقة غير عادية — حدسك نادر"
            : "You read situations and people with unusual accuracy — your intuition is rare",
      };
    if (intuitionScore >= 60)
      return {
        label: locale === "ar" ? "حدس قوي 👁" : "Strong Intuition 👁",
        desc:
          locale === "ar"
            ? "تلتقط إشارات خفية يغفل عنها الآخرون في أغلب الأحيان"
            : "You pick up subtle signals others usually miss",
      };
    if (intuitionScore >= 40)
      return {
        label: locale === "ar" ? "حدس متوسط 🌀" : "Average Intuition 🌀",
        desc:
          locale === "ar"
            ? "حدسك جيد في بعض المواقف ويتطور مع التجربة"
            : "Your intuition is decent and improves with experience",
      };
    return {
      label: locale === "ar" ? "حدس يحتاج تطوير 🔍" : "Developing Intuition 🔍",
      desc:
        locale === "ar"
          ? "أنت تعتمد على المنطق أكثر من الحدس — وهذه قوة بحد ذاتها"
          : "You rely on logic more than intuition — which is a strength in itself",
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
          <div className="text-6xl">👁</div>
          <h2 className="text-3xl font-bold text-white">{locale === "ar" ? "اختبار الحدس" : "Intuition Test"}</h2>
          <p className="max-w-sm text-base text-slate-300">
            {locale === "ar"
              ? "٨ مواقف غامضة — ثق بحدسك الأول واختر التفسير الأقرب للحقيقة"
              : "8 ambiguous scenarios — trust your first instinct and pick the most likely interpretation"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPhase("playing")}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(6,182,212,0.4)] transition hover:opacity-90 active:scale-95"
            >
              {locale === "ar" ? "ابدأ 👁" : "Start 👁"}
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
    const { label, desc } = getIntuitionLabel();
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-md flex-col items-center gap-6 text-center"
        >
          <div className="text-5xl">👁</div>
          <p className="text-xs tracking-widest text-cyan-300/80">{locale === "ar" ? "مستوى حدسك" : "Your Intuition Level"}</p>
          <h2 className="text-2xl font-bold text-white">{label}</h2>
          <p className="text-base leading-relaxed text-slate-300">{desc}</p>
          <div className="w-full rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4">
            <p className="text-sm text-slate-400">{locale === "ar" ? "درجة الحدس" : "Intuition Score"}</p>
            <p className="mt-1 text-4xl font-bold text-cyan-300">{intuitionScore}%</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onComplete(intuitionScore)}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] transition hover:opacity-90 active:scale-95"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="flex w-full max-w-md flex-col gap-5"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {questionIndex + 1} / {INTUITION_SCENARIOS.length}
            </span>
            <div className="h-1 flex-1 mx-4 overflow-hidden rounded-full bg-slate-700">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
                animate={{ width: `${((questionIndex + 1) / INTUITION_SCENARIOS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          {/* Scenario */}
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-6 text-center">
            <p className="text-xl font-bold leading-snug text-white sm:text-2xl">{currentQ.scenario[locale]}</p>
          </div>

          {/* Options */}
          <div className="grid gap-3">
            {currentQ.options.map((option, i) => {
              const isSel = selected === i;
              const isDimmed = selected !== null && !isSel;
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  animate={{ opacity: isDimmed ? 0.35 : 1, scale: isSel ? 1.02 : 1 }}
                  whileHover={selected === null ? { scale: 1.015 } : {}}
                  whileTap={selected === null ? { scale: 0.98 } : {}}
                  className={[
                    "w-full rounded-xl border px-5 py-4 text-sm font-semibold transition-colors duration-150",
                    isSel
                      ? "border-cyan-400/60 bg-cyan-500/25 text-white"
                      : "border-slate-600/50 bg-slate-800/60 text-slate-100 hover:border-cyan-300/40 hover:bg-slate-700/70",
                    selected !== null ? "cursor-default" : "cursor-pointer",
                  ].join(" ")}
                >
                  {option.text[locale]}
                </motion.button>
              );
            })}
          </div>

          {/* Insight flash */}
          <AnimatePresence>
            {showInsight && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-3 text-center text-sm text-cyan-200"
              >
                💡 {currentQ.insight[locale]}
              </motion.div>
            )}
          </AnimatePresence>
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
