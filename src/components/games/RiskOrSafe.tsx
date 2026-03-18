"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RISK_ROUNDS } from "@/data/gameData";
import type { Locale } from "@/lib/i18n";

type Phase = "intro" | "playing" | "result";

type RiskOrSafeProps = {
  locale: Locale;
  onComplete: (score: number) => void;
  onBack: () => void;
};

export function RiskOrSafe({ locale, onComplete, onBack }: RiskOrSafeProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [riskyCount, setRiskyCount] = useState(0);
  const [selected, setSelected] = useState<"safe" | "risky" | null>(null);

  const currentRound = RISK_ROUNDS[roundIndex];

  const handleChoice = (choice: "safe" | "risky") => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === "risky") setRiskyCount((c) => c + 1);
    setTimeout(() => {
      if (roundIndex + 1 >= RISK_ROUNDS.length) {
        setPhase("result");
      } else {
        setRoundIndex((i) => i + 1);
        setSelected(null);
      }
    }, 500);
  };

  const riskScore = Math.round((riskyCount / RISK_ROUNDS.length) * 100);

  const getRiskLabel = () => {
    if (riskScore >= 75)
      return {
        label: locale === "ar" ? "مغامر جريء 🔥" : "Bold Risk-Taker 🔥",
        desc:
          locale === "ar"
            ? "تعشق التحديات وتقفز نحو الفرص بلا تردد"
            : "You love challenges and leap at opportunities without hesitation",
      };
    if (riskScore >= 50)
      return {
        label: locale === "ar" ? "متوازن وجريء ⚖️" : "Balanced & Daring ⚖️",
        desc:
          locale === "ar"
            ? "تقيّم المخاطرة بعقلانية وتتخذ قرارات مدروسة"
            : "You weigh risks rationally and make thoughtful decisions",
      };
    if (riskScore >= 25)
      return {
        label: locale === "ar" ? "حذر ومدروس 🛡️" : "Cautious & Calculated 🛡️",
        desc:
          locale === "ar"
            ? "تفضّل الأمان ولكنك لا تخشى المخاطرة عند الضرورة"
            : "You prefer safety but aren't afraid to take risks when needed",
      };
    return {
      label: locale === "ar" ? "آمن ومستقر 🏰" : "Safe & Stable 🏰",
      desc:
        locale === "ar"
          ? "تقدّر الاستقرار وتبتعد عن المجهول"
          : "You value stability and prefer the known path",
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
          <div className="text-6xl">🎲</div>
          <h2 className="text-3xl font-bold text-white">{locale === "ar" ? "مخاطرة أم أمان" : "Risk or Safe"}</h2>
          <p className="max-w-sm text-base text-slate-300">
            {locale === "ar"
              ? "٨ جولات — في كل جولة اختر بسرعة: الخيار الآمن أم المغامرة؟"
              : "8 rounds — in each round choose quickly: the safe option or take the risk?"}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPhase("playing")}
              className="rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(244,63,94,0.4)] transition hover:opacity-90 active:scale-95"
            >
              {locale === "ar" ? "ابدأ 🎲" : "Start 🎲"}
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
    const { label, desc } = getRiskLabel();
    return (
      <GameContainer>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-md flex-col items-center gap-6 text-center"
        >
          <div className="text-5xl">🎲</div>
          <p className="text-xs tracking-widest text-rose-300/80">{locale === "ar" ? "شخصيتك في المخاطرة" : "Your Risk Personality"}</p>
          <h2 className="text-2xl font-bold text-white">{label}</h2>
          <p className="text-base leading-relaxed text-slate-300">{desc}</p>
          <div className="w-full rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
            <p className="text-sm text-slate-400">{locale === "ar" ? "درجة المغامرة" : "Risk Score"}</p>
            <p className="mt-1 text-4xl font-bold text-rose-300">{riskScore}%</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onComplete(riskScore)}
              className="rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-8 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] transition hover:opacity-90 active:scale-95"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="flex w-full max-w-md flex-col gap-6"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {roundIndex + 1} / {RISK_ROUNDS.length}
            </span>
            <div className="h-1 flex-1 mx-4 overflow-hidden rounded-full bg-slate-700">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-red-400"
                animate={{ width: `${((roundIndex + 1) / RISK_ROUNDS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <p className="text-center text-sm font-medium text-slate-300">
            {locale === "ar" ? "اختر بسرعة:" : "Choose quickly:"}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* Safe */}
            <motion.button
              type="button"
              onClick={() => handleChoice("safe")}
              disabled={selected !== null}
              animate={{
                opacity: selected === "risky" ? 0.35 : 1,
                scale: selected === "safe" ? 1.04 : 1,
              }}
              whileHover={selected === null ? { scale: 1.03, y: -2 } : {}}
              whileTap={selected === null ? { scale: 0.97 } : {}}
              className={[
                "flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all duration-200",
                selected === "safe"
                  ? "border-emerald-400/60 bg-emerald-500/25 shadow-[0_0_24px_rgba(52,211,153,0.25)]"
                  : "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-400/50",
                selected !== null ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
            >
              <span className="text-3xl">🛡️</span>
              <span className="text-xs font-semibold text-emerald-300">{locale === "ar" ? "آمن" : "SAFE"}</span>
              <span className="text-sm text-white">{currentRound.safe[locale]}</span>
            </motion.button>

            {/* Risky */}
            <motion.button
              type="button"
              onClick={() => handleChoice("risky")}
              disabled={selected !== null}
              animate={{
                opacity: selected === "safe" ? 0.35 : 1,
                scale: selected === "risky" ? 1.04 : 1,
              }}
              whileHover={selected === null ? { scale: 1.03, y: -2 } : {}}
              whileTap={selected === null ? { scale: 0.97 } : {}}
              className={[
                "flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition-all duration-200",
                selected === "risky"
                  ? "border-rose-400/60 bg-rose-500/25 shadow-[0_0_24px_rgba(244,63,94,0.25)]"
                  : "border-rose-500/30 bg-rose-500/10 hover:border-rose-400/50",
                selected !== null ? "cursor-default" : "cursor-pointer",
              ].join(" ")}
            >
              <span className="text-3xl">🔥</span>
              <span className="text-xs font-semibold text-rose-300">{locale === "ar" ? "خطير" : "RISKY"}</span>
              <span className="text-sm text-white">{currentRound.risky[locale]}</span>
            </motion.button>
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
