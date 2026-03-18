"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DECISION_SCENARIOS, type DecisionType } from "@/data/gameData";
import type { Locale } from "@/lib/i18n";
import { saveScore } from "@/lib/gameScores";

type Props = { locale: Locale; onDone: () => void; onBack: () => void };

const TIMER_SECONDS = 3;

const styleLabels: Record<DecisionType, { ar: string; en: string }> = {
  analytical: { ar: "المحلّل", en: "The Analyst" },
  social: { ar: "الاجتماعي", en: "The Connector" },
  impulsive: { ar: "التلقائي", en: "The Impulsive" },
};

const styleDesc: Record<DecisionType, { ar: string; en: string }> = {
  analytical: {
    ar: "تفكر قبل التصرف وتعتمد على المنطق والبيانات في اتخاذ قراراتك.",
    en: "You think before acting and rely on logic and data in your decisions.",
  },
  social: {
    ar: "تضع الآخرين في الحسبان وقراراتك تتأثر بالعلاقات والتعاطف.",
    en: "You consider others first; your decisions are shaped by relationships and empathy.",
  },
  impulsive: {
    ar: "تتصرف بسرعة وبشكل تلقائي، وتثق بحدسك الأول.",
    en: "You act fast and instinctively, trusting your first gut reaction.",
  },
};

function TimerRing({ remaining, total }: { remaining: number; total: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - remaining / total);
  const fraction = remaining / total;
  const color = fraction > 0.5 ? "#34d399" : fraction > 0.25 ? "#fbbf24" : "#f87171";

  return (
    <svg width={56} height={56} className="-rotate-90">
      <circle cx={28} cy={28} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
      <motion.circle
        cx={28}
        cy={28}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.25, ease: "linear" }}
      />
      <text
        x={28}
        y={28}
        textAnchor="middle"
        dominantBaseline="central"
        className="rotate-90"
        fill="white"
        fontSize={14}
        fontWeight={700}
        transform={`rotate(90, 28, 28)`}
      >
        {remaining}
      </text>
    </svg>
  );
}

export function DecisionSpeedGame({ locale, onDone, onBack }: Props) {
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [picks, setPicks] = useState<(DecisionType | "timeout")[]>([]);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [chosen, setChosen] = useState<number | null>(null);
  const questionStartRef = useRef<number>(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(
    (type: DecisionType | "timeout", rt: number) => {
      const nextPicks = [...picks, type];
      const nextTimes = [...reactionTimes, rt];
      setPicks(nextPicks);
      setReactionTimes(nextTimes);

      if (index + 1 >= DECISION_SCENARIOS.length) {
        // Compute dominant style
        const counts: Record<DecisionType, number> = { analytical: 0, social: 0, impulsive: 0 };
        nextPicks.forEach((p) => {
          if (p !== "timeout") counts[p]++;
        });
        const dominant = (Object.entries(counts) as [DecisionType, number][]).sort(
          (a, b) => b[1] - a[1],
        )[0][0];
        const avgRt = nextTimes.filter((t) => t < TIMER_SECONDS * 1000).reduce((a, b) => a + b, 0) / nextTimes.length;
        const speedScore = Math.round(Math.max(0, 100 - (avgRt / (TIMER_SECONDS * 1000)) * 100));
        saveScore("decisionStyle", dominant);
        saveScore("decisionScore", speedScore);
        setTimeout(() => setPhase("result"), 300);
      } else {
        setTimeout(() => {
          setChosen(null);
          setIndex((i) => i + 1);
          setTimer(TIMER_SECONDS);
          questionStartRef.current = Date.now();
        }, 250);
      }
    },
    [picks, reactionTimes, index],
  );

  const handlePick = (type: DecisionType, optIdx: number) => {
    if (chosen !== null) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setChosen(optIdx);
    const rt = Date.now() - questionStartRef.current;
    advance(type, rt);
  };

  useEffect(() => {
    if (phase !== "playing") return;
    questionStartRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setChosen(-1);
          advance("timeout", TIMER_SECONDS * 1000);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, index, advance]);

  const scenario = DECISION_SCENARIOS[index];

  // Compute result
  const counts: Record<DecisionType, number> = { analytical: 0, social: 0, impulsive: 0 };
  picks.forEach((p) => { if (p !== "timeout") counts[p]++; });
  const dominant = (Object.entries(counts) as [DecisionType, number][]).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "analytical";

  if (phase === "intro") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="⚡" title={{ ar: "سرعة القرار", en: "Decision Speed" }}>
        <p className="text-center text-base text-slate-300 sm:text-lg">
          {locale === "ar"
            ? "ستظهر 8 مواقف. لديك 3 ثوانٍ لكل قرار. اختر بسرعة!"
            : "8 situations. 3 seconds per decision. Choose fast!"}
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setPhase("playing")}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-lg font-bold text-white shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          {locale === "ar" ? "ابدأ الآن ⚡" : "Start Now ⚡"}
        </motion.button>
      </GameShell>
    );
  }

  if (phase === "result") {
    return (
      <GameShell onBack={onBack} locale={locale} icon="⚡" title={{ ar: "سرعة القرار", en: "Decision Speed" }}>
        <ResultCard
          locale={locale}
          emoji="⚡"
          title={styleLabels[dominant][locale]}
          subtitle={styleDesc[dominant][locale]}
          stats={[
            { label: locale === "ar" ? "أسلوبك" : "Your Style", value: styleLabels[dominant][locale] },
            { label: locale === "ar" ? "الاجتماعي" : "Social", value: `${counts.social}/${DECISION_SCENARIOS.length}` },
            { label: locale === "ar" ? "التحليلي" : "Analytical", value: `${counts.analytical}/${DECISION_SCENARIOS.length}` },
            { label: locale === "ar" ? "التلقائي" : "Impulsive", value: `${counts.impulsive}/${DECISION_SCENARIOS.length}` },
          ]}
          onDone={onDone}
        />
      </GameShell>
    );
  }

  return (
    <GameShell onBack={onBack} locale={locale} icon="⚡" title={{ ar: "سرعة القرار", en: "Decision Speed" }}>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-slate-400">
          {index + 1} / {DECISION_SCENARIOS.length}
        </span>
        <TimerRing remaining={timer} total={TIMER_SECONDS} />
      </div>

      <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
          animate={{ width: `${((index + 1) / DECISION_SCENARIOS.length) * 100}%` }}
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
          <h3 className="mt-6 text-2xl font-bold text-white sm:text-3xl">{scenario.situation[locale]}</h3>
          <div className="mt-6 grid gap-3">
            {scenario.choices.map((c, i) => (
              <motion.button
                key={i}
                type="button"
                disabled={chosen !== null}
                whileHover={chosen === null ? { scale: 1.02, y: -2 } : {}}
                whileTap={chosen === null ? { scale: 0.97 } : {}}
                onClick={() => handlePick(c.type, i)}
                className={[
                  "w-full rounded-2xl border px-6 py-4 text-start text-base font-semibold transition-colors duration-150",
                  chosen === i
                    ? "border-amber-400/60 bg-amber-500/20 text-white"
                    : chosen !== null
                      ? "border-slate-600/30 bg-slate-800/30 text-slate-500"
                      : "border-slate-500/30 bg-slate-800/50 text-white hover:border-amber-400/50 hover:bg-amber-500/10",
                ].join(" ")}
              >
                {c.text[locale]}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </GameShell>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

export function GameShell({
  children,
  onBack,
  locale,
  icon,
  title,
}: {
  children: React.ReactNode;
  onBack: () => void;
  locale: Locale;
  icon: string;
  title: { ar: string; en: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-5 pb-16 pt-6 sm:px-8"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        {locale === "ar" ? "→ عودة" : "← Back"}
      </button>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-2xl font-bold text-white">{title[locale]}</h2>
      </div>
      {children}
    </motion.div>
  );
}

export function ResultCard({
  locale,
  emoji,
  title,
  subtitle,
  stats,
  onDone,
}: {
  locale: Locale;
  emoji: string;
  title: string;
  subtitle: string;
  stats: { label: string; value: string | number }[];
  onDone: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
      <div className="rounded-2xl border border-white/15 bg-slate-900/60 p-6 backdrop-blur-xl sm:p-8">
        <div className="mb-4 text-5xl text-center">{emoji}</div>
        <h3 className="text-center text-2xl font-bold text-white">{title}</h3>
        <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">{subtitle}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
              <p className="text-xs text-slate-400">{s.label}</p>
              <p className="mt-1 text-lg font-bold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onDone}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 font-bold text-white shadow-[0_0_24px_rgba(99,102,241,0.3)]"
        >
          {locale === "ar" ? "رجوع للألعاب" : "Back to Games"}
        </motion.button>
      </div>
    </motion.div>
  );
}
