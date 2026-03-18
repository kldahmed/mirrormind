"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RISK_ROUNDS } from "@/data/gameData";
import type { Locale } from "@/lib/i18n";
import { saveScore } from "@/lib/gameScores";
import { GameShell, ResultCard } from "./DecisionSpeedGame";

type Props = { locale: Locale; onDone: () => void; onBack: () => void };
const ROUND_SECONDS = 4;

export function RiskSafeGame({ locale, onDone, onBack }: Props) {
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [roundIdx, setRoundIdx] = useState(0);
  const [timer, setTimer] = useState(ROUND_SECONDS);
  const [riskyCount, setRiskyCount] = useState(0);
  const [chosen, setChosen] = useState<"safe" | "risky" | "timeout" | null>(null);
  const [totalRounds, setTotalRounds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(
    (pick: "safe" | "risky" | "timeout") => {
      const newRisky = riskyCount + (pick === "risky" ? 1 : 0);
      const newTotal = totalRounds + 1;
      setRiskyCount(newRisky);
      setTotalRounds(newTotal);

      if (roundIdx + 1 >= RISK_ROUNDS.length) {
        const score = Math.round((newRisky / RISK_ROUNDS.length) * 100);
        saveScore("riskScore", score);
        setTimeout(() => setPhase("result"), 350);
      } else {
        setTimeout(() => {
          setChosen(null);
          setRoundIdx((i) => i + 1);
          setTimer(ROUND_SECONDS);
        }, 300);
      }
    },
    [riskyCount, totalRounds, roundIdx],
  );

  const handlePick = (pick: "safe" | "risky") => {
    if (chosen !== null) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setChosen(pick);
    advance(pick);
  };

  useEffect(() => {
    if (phase !== "playing") return;
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setChosen("timeout");
          advance("timeout");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, roundIdx, advance]);

  const round = RISK_ROUNDS[roundIdx];
  const finalScore = Math.round((riskyCount / RISK_ROUNDS.length) * 100);

  const riskLabel =
    finalScore >= 75
      ? (locale === "ar" ? "المغامر الجريء 🚀" : "The Bold Risk-Taker 🚀")
      : finalScore >= 50
        ? (locale === "ar" ? "متوازن بين الجرأة والحذر" : "Balanced Risk Tolerance")
        : finalScore >= 25
          ? (locale === "ar" ? "يفضّل الأمان" : "Prefers Safety")
          : (locale === "ar" ? "المحافظ الحذر 🛡" : "The Cautious Guardian 🛡");

  if (phase === "intro") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="🎲" title={{ ar: "مخاطرة أم أمان", en: "Risk or Safe" }}>
        <p className="text-center text-base text-slate-300 sm:text-lg">
          {locale === "ar"
            ? "8 جولات. في كل جولة: خيار آمن أو خيار مغامرة. لديك 4 ثوانٍ للاختيار!"
            : "8 rounds. Each round: safe option or risky option. 4 seconds to choose!"}
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setPhase("playing")}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(244,63,94,0.3)]"
        >
          {locale === "ar" ? "ابدأ الآن 🎲" : "Start Now 🎲"}
        </motion.button>
      </GameShell>
    );
  }

  if (phase === "result") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="🎲" title={{ ar: "مخاطرة أم أمان", en: "Risk or Safe" }}>
        <ResultCard
          locale={locale}
          emoji="🎲"
          title={riskLabel}
          subtitle={
            locale === "ar"
              ? `اخترت الخيار الجريء في ${riskyCount} من ${RISK_ROUNDS.length} جولات`
              : `You chose the risky option in ${riskyCount} of ${RISK_ROUNDS.length} rounds`
          }
          stats={[
            { label: locale === "ar" ? "نسبة الجرأة" : "Risk Score", value: `${finalScore}%` },
            { label: locale === "ar" ? "الخيارات الجريئة" : "Risky Picks", value: `${riskyCount}/${RISK_ROUNDS.length}` },
            { label: locale === "ar" ? "الخيارات الآمنة" : "Safe Picks", value: `${RISK_ROUNDS.length - riskyCount}/${RISK_ROUNDS.length}` },
          ]}
          onDone={onDone}
        />
      </GameShell>
    );
  }

  return (
    <GameShell onBack={onBack} locale={locale} icon="🎲" title={{ ar: "مخاطرة أم أمان", en: "Risk or Safe" }}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-400">{roundIdx + 1} / {RISK_ROUNDS.length}</span>
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <span
            className={[
              "text-lg",
              timer <= 1 ? "text-red-400" : timer <= 2 ? "text-amber-400" : "text-emerald-400",
            ].join(" ")}
          >
            ⏱ {timer}s
          </span>
        </div>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-red-400"
          animate={{ width: `${((roundIdx + 1) / RISK_ROUNDS.length) * 100}%` }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={roundIdx}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.28 }}
          className="grid grid-cols-2 gap-4 mt-4"
        >
          <motion.button
            type="button"
            disabled={chosen !== null}
            whileHover={chosen === null ? { scale: 1.04, y: -3 } : {}}
            whileTap={chosen === null ? { scale: 0.96 } : {}}
            onClick={() => handlePick("safe")}
            className={[
              "flex flex-col items-center rounded-2xl border-2 p-6 transition-colors",
              chosen === "safe"
                ? "border-emerald-400/70 bg-emerald-500/25 text-white"
                : chosen !== null
                  ? "border-slate-600/20 bg-slate-800/20 text-slate-600"
                  : "border-emerald-400/35 bg-emerald-900/20 text-white hover:border-emerald-400/60 hover:bg-emerald-500/15",
            ].join(" ")}
          >
            <span className="text-3xl mb-2">🛡</span>
            <span className="text-xs font-semibold tracking-wide text-emerald-300 mb-2">
              {locale === "ar" ? "آمن" : "SAFE"}
            </span>
            <span className="text-sm font-bold text-center">{round.safe[locale]}</span>
          </motion.button>

          <motion.button
            type="button"
            disabled={chosen !== null}
            whileHover={chosen === null ? { scale: 1.04, y: -3 } : {}}
            whileTap={chosen === null ? { scale: 0.96 } : {}}
            onClick={() => handlePick("risky")}
            className={[
              "flex flex-col items-center rounded-2xl border-2 p-6 transition-colors",
              chosen === "risky"
                ? "border-rose-400/70 bg-rose-500/25 text-white"
                : chosen !== null
                  ? "border-slate-600/20 bg-slate-800/20 text-slate-600"
                  : "border-rose-400/35 bg-rose-900/20 text-white hover:border-rose-400/60 hover:bg-rose-500/15",
            ].join(" ")}
          >
            <span className="text-3xl mb-2">🚀</span>
            <span className="text-xs font-semibold tracking-wide text-rose-300 mb-2">
              {locale === "ar" ? "مغامرة" : "RISKY"}
            </span>
            <span className="text-sm font-bold text-center">{round.risky[locale]}</span>
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* timer bar */}
      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-slate-700/30">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-400"
          key={`timer-${roundIdx}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: ROUND_SECONDS, ease: "linear" }}
        />
      </div>
    </GameShell>
  );
}
