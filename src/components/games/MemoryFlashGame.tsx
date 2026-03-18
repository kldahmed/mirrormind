"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MEMORY_SYMBOLS } from "@/data/gameData";
import type { Locale } from "@/lib/i18n";
import { saveScore } from "@/lib/gameScores";
import { GameShell, ResultCard } from "./DecisionSpeedGame";

type Props = { locale: Locale; onDone: () => void; onBack: () => void };

const SHOW_COUNT = 6;
const SHOW_DURATION_MS = 3000;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function MemoryFlashGame({ locale, onDone, onBack }: Props) {
  const [phase, setPhase] = useState<"intro" | "show" | "recall" | "result">("intro");
  const [shownSymbols, setShownSymbols] = useState<string[]>([]);
  const [allSymbols, setAllSymbols] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);

  const startGame = () => {
    const shown = shuffle(MEMORY_SYMBOLS).slice(0, SHOW_COUNT);
    const all = shuffle(MEMORY_SYMBOLS);
    setShownSymbols(shown);
    setAllSymbols(all);
    setSelected(new Set());
    setCountdown(3);
    setPhase("show");
  };

  useEffect(() => {
    if (phase !== "show") return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setTimeout(() => setPhase("recall"), 200);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const toggleSymbol = (sym: string) => {
    if (selected.size >= SHOW_COUNT && !selected.has(sym)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sym)) next.delete(sym);
      else next.add(sym);
      return next;
    });
  };

  const submitRecall = () => {
    let correct = 0;
    selected.forEach((sym) => { if (shownSymbols.includes(sym)) correct++; });
    const s = Math.round((correct / SHOW_COUNT) * 100);
    setScore(s);
    saveScore("memoryScore", s);
    setPhase("result");
  };

  const canSubmit = selected.size === SHOW_COUNT;

  if (phase === "intro") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="🔮" title={{ ar: "اختبار الذاكرة", en: "Memory Flash" }}>
        <p className="text-center text-base text-slate-300 sm:text-lg">
          {locale === "ar"
            ? "ستظهر 6 رموز لمدة 3 ثوانٍ. احفظها ثم اختر ما رأيته!"
            : "6 symbols will appear for 3 seconds. Memorize them, then pick what you saw!"}
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={startGame}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(139,92,246,0.35)]"
        >
          {locale === "ar" ? "ابدأ الآن 🔮" : "Start Now 🔮"}
        </motion.button>
      </GameShell>
    );
  }

  if (phase === "show") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="🔮" title={{ ar: "اختبار الذاكرة", en: "Memory Flash" }}>
        <div className="text-center mb-4">
          <p className="text-slate-300 text-sm">
            {locale === "ar" ? `احفظ هذه الرموز — تختفي خلال ${countdown}s` : `Memorize these — disappearing in ${countdown}s`}
          </p>
        </div>
        <div className="rounded-2xl border border-violet-400/30 bg-violet-900/20 p-8">
          <div className="grid grid-cols-3 gap-4">
            {shownSymbols.map((sym, i) => (
              <motion.div
                key={sym}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                className="flex h-16 w-full items-center justify-center rounded-xl border border-violet-300/30 bg-violet-800/30 text-4xl"
              >
                {sym}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/40">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-400 to-purple-400"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: SHOW_DURATION_MS / 1000, ease: "linear" }}
            />
          </div>
        </div>
      </GameShell>
    );
  }

  if (phase === "recall") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="🔮" title={{ ar: "اختبار الذاكرة", en: "Memory Flash" }}>
        <p className="text-center text-base text-slate-300">
          {locale === "ar"
            ? `اختر الـ 6 رموز التي رأيتها (${selected.size}/${SHOW_COUNT})`
            : `Pick the 6 symbols you saw (${selected.size}/${SHOW_COUNT})`}
        </p>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {allSymbols.map((sym) => {
            const isSelected = selected.has(sym);
            const disabled = !isSelected && selected.size >= SHOW_COUNT;
            return (
              <motion.button
                key={sym}
                type="button"
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.08 } : {}}
                whileTap={!disabled ? { scale: 0.92 } : {}}
                onClick={() => toggleSymbol(sym)}
                className={[
                  "flex h-14 w-full items-center justify-center rounded-xl border text-2xl transition-colors",
                  isSelected
                    ? "border-violet-400/60 bg-violet-500/30 shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                    : disabled
                      ? "border-slate-700/30 bg-slate-800/20 opacity-40"
                      : "border-slate-500/30 bg-slate-800/40 hover:border-violet-400/40 hover:bg-violet-500/10",
                ].join(" ")}
              >
                {sym}
              </motion.button>
            );
          })}
        </div>
        <motion.button
          whileHover={canSubmit ? { scale: 1.03 } : {}}
          whileTap={canSubmit ? { scale: 0.97 } : {}}
          disabled={!canSubmit}
          onClick={submitRecall}
          className={[
            "mt-6 w-full rounded-2xl py-4 font-bold text-white transition-all",
            canSubmit
              ? "bg-gradient-to-r from-violet-500 to-purple-600 shadow-[0_0_24px_rgba(139,92,246,0.3)]"
              : "bg-slate-700/40 text-slate-500",
          ].join(" ")}
        >
          {locale === "ar" ? "تأكيد الاختيار" : "Confirm Selection"}
        </motion.button>
      </GameShell>
    );
  }

  const label =
    score >= 90
      ? (locale === "ar" ? "ذاكرة استثنائية 🏆" : "Exceptional Memory 🏆")
      : score >= 70
        ? (locale === "ar" ? "ذاكرة قوية ⭐" : "Strong Memory ⭐")
        : score >= 50
          ? (locale === "ar" ? "ذاكرة متوسطة" : "Average Memory")
          : (locale === "ar" ? "ذاكرة تحتاج تدريباً" : "Memory Needs Training");

  return (
    <GameShell onBack={onBack} locale={locale} icon="🔮" title={{ ar: "اختبار الذاكرة", en: "Memory Flash" }}>
      <ResultCard
        locale={locale}
        emoji="🔮"
        title={label}
        subtitle={
          locale === "ar"
            ? `أجبت بشكل صحيح على ${Math.round((score / 100) * SHOW_COUNT)} من ${SHOW_COUNT} رموز`
            : `You correctly recalled ${Math.round((score / 100) * SHOW_COUNT)} of ${SHOW_COUNT} symbols`
        }
        stats={[
          { label: locale === "ar" ? "النتيجة" : "Score", value: `${score}%` },
          { label: locale === "ar" ? "الرموز الصحيحة" : "Correct", value: `${Math.round((score / 100) * SHOW_COUNT)}/${SHOW_COUNT}` },
        ]}
        onDone={onDone}
      />
    </GameShell>
  );
}
