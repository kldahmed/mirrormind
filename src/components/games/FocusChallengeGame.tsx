"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { saveScore } from "@/lib/gameScores";
import { GameShell, ResultCard } from "./DecisionSpeedGame";

type Props = { locale: Locale; onDone: () => void; onBack: () => void };

const TOTAL_NUMBERS = 20;
const DISPLAY_MS = 900;
const RULE_LABEL = { ar: "اضغط الأعداد الزوجية فقط", en: "Tap only EVEN numbers" };

function generateSequence(): number[] {
  const nums: number[] = [];
  while (nums.length < TOTAL_NUMBERS) {
    const n = Math.floor(Math.random() * 30) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums;
}

export function FocusChallengeGame({ locale, onDone, onBack }: Props) {
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [sequence] = useState<number[]>(() => generateSequence());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hits, setHits] = useState(0); // correct even taps
  const [misses, setMisses] = useState(0); // wrong odd taps
  const [missed, setMissed] = useState(0); // even numbers not tapped
  const [tapped, setTapped] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const advance = useCallback(
    (wasTapped: boolean) => {
      const num = sequence[currentIdx];
      const isEven = num % 2 === 0;

      if (wasTapped && isEven) {
        const rt = Date.now() - startTimeRef.current;
        setHits((h) => h + 1);
        setReactionTimes((prev) => [...prev, rt]);
      } else if (wasTapped && !isEven) {
        setMisses((m) => m + 1);
      } else if (!wasTapped && isEven) {
        setMissed((m) => m + 1);
      }

      if (currentIdx + 1 >= TOTAL_NUMBERS) {
        setDone(true);
        return;
      }
      setTapped(false);
      setCurrentIdx((i) => i + 1);
      startTimeRef.current = Date.now();
    },
    [currentIdx, sequence],
  );

  useEffect(() => {
    if (done) {
      // Compute score: correct even hits - penalties for misses and missed evens
      const totalEvens = sequence.filter((n) => n % 2 === 0).length;
      const raw = hits - misses * 2 - missed;
      const score = Math.max(0, Math.round((raw / totalEvens) * 100));
      saveScore("focusScore", score);
      setTimeout(() => setPhase("result"), 400);
    }
  }, [done, hits, misses, missed, sequence]);

  useEffect(() => {
    if (phase !== "playing") return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => advance(false), DISPLAY_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, currentIdx, advance]);

  const handleTap = () => {
    if (tapped || done) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setTapped(true);
    advance(true);
  };

  const totalEvens = sequence.filter((n) => n % 2 === 0).length;
  const rawScore = hits - misses * 2 - missed;
  const finalScore = Math.max(0, Math.round((rawScore / totalEvens) * 100));
  const avgRt = reactionTimes.length > 0 ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length) : 0;

  const focusLabel =
    finalScore >= 85
      ? (locale === "ar" ? "تركيز خارق 🎯" : "Laser Focus 🎯")
      : finalScore >= 65
        ? (locale === "ar" ? "تركيز قوي ⭐" : "Strong Focus ⭐")
        : finalScore >= 40
          ? (locale === "ar" ? "تركيز متوسط" : "Average Focus")
          : (locale === "ar" ? "تركيز يحتاج تدريباً" : "Focus Needs Training");

  const currentNum = sequence[currentIdx];
  const isEvenCurrent = currentNum % 2 === 0;

  if (phase === "intro") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="🎯" title={{ ar: "تحدي التركيز", en: "Focus Challenge" }}>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-900/20 p-5 text-center">
          <p className="text-2xl font-bold text-emerald-300">{RULE_LABEL[locale]}</p>
          <p className="mt-2 text-sm text-slate-300">
            {locale === "ar"
              ? "ستظهر أعداد واحداً تلو الآخر بسرعة. اضغط على الزوجي فقط، وتجاهل الفردي!"
              : "Numbers flash quickly one by one. Tap even ones only, ignore odd ones!"}
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-8 text-center">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-900/20 px-5 py-3">
            <p className="text-xs text-slate-400">{locale === "ar" ? "اضغط" : "TAP"}</p>
            <p className="text-3xl font-bold text-emerald-300">4</p>
          </div>
          <div className="rounded-xl border border-rose-400/30 bg-rose-900/20 px-5 py-3">
            <p className="text-xs text-slate-400">{locale === "ar" ? "تجاهل" : "IGNORE"}</p>
            <p className="text-3xl font-bold text-rose-300">7</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setPhase("playing")}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          {locale === "ar" ? "ابدأ الآن 🎯" : "Start Now 🎯"}
        </motion.button>
      </GameShell>
    );
  }

  if (phase === "result") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="🎯" title={{ ar: "تحدي التركيز", en: "Focus Challenge" }}>
        <ResultCard
          locale={locale}
          emoji="🎯"
          title={focusLabel}
          subtitle={
            locale === "ar"
              ? "التركيز قدرتك على التمييز والتصرف الصحيح تحت الضغط"
              : "Focus is your ability to distinguish and react correctly under pressure"
          }
          stats={[
            { label: locale === "ar" ? "النتيجة" : "Score", value: `${finalScore}%` },
            { label: locale === "ar" ? "إصابات" : "Correct Hits", value: hits },
            { label: locale === "ar" ? "أخطاء" : "Mistakes", value: misses },
            { label: locale === "ar" ? "فائتة" : "Missed Evens", value: missed },
            ...(avgRt > 0 ? [{ label: locale === "ar" ? "سرعة رد" : "Avg Speed", value: `${avgRt}ms` }] : []),
          ]}
          onDone={onDone}
        />
      </GameShell>
    );
  }

  return (
    <GameShell onBack={onBack} locale={locale} icon="🎯" title={{ ar: "تحدي التركيز", en: "Focus Challenge" }}>
      <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
        <span>{RULE_LABEL[locale]}</span>
        <span>{currentIdx + 1}/{TOTAL_NUMBERS}</span>
      </div>

      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-400"
          animate={{ width: `${((currentIdx) / TOTAL_NUMBERS) * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Number display */}
      <div className="flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          <motion.button
            key={`${currentIdx}-${currentNum}`}
            type="button"
            onClick={handleTap}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={[
              "flex h-36 w-36 items-center justify-center rounded-full border-4 text-6xl font-black transition-all active:scale-90",
              tapped
                ? isEvenCurrent
                  ? "border-emerald-400 bg-emerald-500/30 text-emerald-200 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                  : "border-rose-400 bg-rose-500/30 text-rose-200"
                : "border-white/25 bg-slate-800/60 text-white hover:border-emerald-400/50",
            ].join(" ")}
          >
            {currentNum}
          </motion.button>
        </AnimatePresence>

        <p className="text-center text-sm text-slate-400">
          {locale === "ar"
            ? "اضغط الرقم إذا كان زوجياً"
            : "Tap if it's an even number"}
        </p>

        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-400">{hits}</p>
            <p className="text-xs text-slate-400">{locale === "ar" ? "صح" : "Correct"}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-400">{misses}</p>
            <p className="text-xs text-slate-400">{locale === "ar" ? "خطأ" : "Wrong"}</p>
          </div>
        </div>
      </div>
    </GameShell>
  );
}
