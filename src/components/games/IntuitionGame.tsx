"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { INTUITION_SCENARIOS } from "@/data/gameData";
import type { Locale } from "@/lib/i18n";
import { saveScore } from "@/lib/gameScores";
import { GameShell, ResultCard } from "./DecisionSpeedGame";

type Props = { locale: Locale; onDone: () => void; onBack: () => void };

export function IntuitionGame({ locale, onDone, onBack }: Props) {
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [showInsight, setShowInsight] = useState(false);

  const scenario = INTUITION_SCENARIOS[index];
  const maxScorePerQuestion = 3;
  const maxTotal = INTUITION_SCENARIOS.length * maxScorePerQuestion;

  const handlePick = (optIdx: number) => {
    if (chosen !== null) return;
    setChosen(optIdx);
    setTotalScore((s) => s + scenario.options[optIdx].score);
    setShowInsight(true);
  };

  const handleNext = () => {
    if (index + 1 >= INTUITION_SCENARIOS.length) {
      const finalScore = Math.round((totalScore / maxTotal) * 100);
      saveScore("intuitionScore", finalScore);
      setPhase("result");
    } else {
      setChosen(null);
      setShowInsight(false);
      setIndex((i) => i + 1);
    }
  };

  const finalScore = Math.round((totalScore / maxTotal) * 100);

  const intuitionLabel =
    finalScore >= 80
      ? (locale === "ar" ? "حدس استثنائي 👁" : "Exceptional Intuition 👁")
      : finalScore >= 60
        ? (locale === "ar" ? "حدس قوي" : "Strong Intuition")
        : finalScore >= 40
          ? (locale === "ar" ? "حدس متوسط" : "Average Intuition")
          : (locale === "ar" ? "حدس يحتاج تطوير" : "Developing Intuition");

  if (phase === "intro") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="👁" title={{ ar: "اختبار الحدس", en: "Intuition Test" }}>
        <p className="text-center text-base text-slate-300 sm:text-lg">
          {locale === "ar"
            ? "8 مواقف غامضة. اقرأ كل موقف وتوقع الأكثر احتمالاً. لا وقت محدد — فكّر!"
            : "8 ambiguous situations. Read each one and guess the most likely outcome. No timer — think it through!"}
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setPhase("playing")}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-600 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(6,182,212,0.3)]"
        >
          {locale === "ar" ? "ابدأ الآن 👁" : "Start Now 👁"}
        </motion.button>
      </GameShell>
    );
  }

  if (phase === "result") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="👁" title={{ ar: "اختبار الحدس", en: "Intuition Test" }}>
        <ResultCard
          locale={locale}
          emoji="👁"
          title={intuitionLabel}
          subtitle={
            locale === "ar"
              ? "الحدس قدرتك على قراءة المواقف الغامضة بدقة عالية"
              : "Intuition is your ability to read ambiguous situations accurately"
          }
          stats={[
            { label: locale === "ar" ? "نتيجة الحدس" : "Intuition Score", value: `${finalScore}%` },
            { label: locale === "ar" ? "الأسئلة" : "Questions", value: `${INTUITION_SCENARIOS.length}` },
          ]}
          onDone={onDone}
        />
      </GameShell>
    );
  }

  return (
    <GameShell onBack={onBack} locale={locale} icon="👁" title={{ ar: "اختبار الحدس", en: "Intuition Test" }}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-400">{index + 1} / {INTUITION_SCENARIOS.length}</span>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400"
          animate={{ width: `${((index + 1) / INTUITION_SCENARIOS.length) * 100}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-2xl font-bold text-white sm:text-3xl">{scenario.scenario[locale]}</h3>

          <div className="mt-6 grid gap-3">
            {scenario.options.map((opt, i) => {
              const isChosen = chosen === i;
              const isCorrect = opt.score === 3;
              const showResult = chosen !== null;

              return (
                <motion.button
                  key={i}
                  type="button"
                  disabled={chosen !== null}
                  whileHover={chosen === null ? { scale: 1.02, y: -2 } : {}}
                  whileTap={chosen === null ? { scale: 0.97 } : {}}
                  onClick={() => handlePick(i)}
                  className={[
                    "w-full rounded-2xl border px-6 py-4 text-start text-base font-semibold transition-all duration-200",
                    showResult && isChosen && isCorrect
                      ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-100"
                      : showResult && isChosen && !isCorrect
                        ? "border-rose-400/60 bg-rose-500/20 text-rose-100"
                        : showResult && isCorrect
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                          : showResult
                            ? "border-slate-600/30 bg-slate-800/20 text-slate-500"
                            : "border-slate-500/30 bg-slate-800/50 text-white hover:border-cyan-400/50 hover:bg-cyan-500/10",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2">
                    {showResult && isChosen && isCorrect && <span>✅</span>}
                    {showResult && isChosen && !isCorrect && <span>❌</span>}
                    {showResult && !isChosen && isCorrect && <span>💡</span>}
                    {opt.text[locale]}
                  </span>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showInsight && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-cyan-400/25 bg-cyan-900/20 px-4 py-3"
              >
                <p className="text-xs text-cyan-300">
                  💡 {scenario.insight[locale]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {chosen !== null && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="mt-5 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-600 py-3.5 font-bold text-white"
            >
              {index + 1 >= INTUITION_SCENARIOS.length
                ? (locale === "ar" ? "عرض النتيجة" : "Show Result")
                : (locale === "ar" ? "التالي ←" : "Next →")}
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </GameShell>
  );
}
