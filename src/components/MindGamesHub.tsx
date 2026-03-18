"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

type Game = {
  id: string;
  name: { ar: string; en: string };
  desc: { ar: string; en: string };
  icon: string;
  color: string;
  glow: string;
  border: string;
  duration: { ar: string; en: string };
};

const GAMES: Game[] = [
  {
    id: "decision",
    name: { ar: "سرعة القرار", en: "Decision Speed" },
    desc: { ar: "8 مواقف • 3 ثوانٍ لكل قرار", en: "8 situations • 3 seconds each" },
    icon: "⚡",
    color: "from-amber-600/30 to-orange-600/20",
    glow: "rgba(245,158,11,0.2)",
    border: "border-amber-400/30",
    duration: { ar: "دقيقتان", en: "2 min" },
  },
  {
    id: "memory",
    name: { ar: "اختبار الذاكرة", en: "Memory Flash" },
    desc: { ar: "احفظ 6 رموز في 3 ثوانٍ", en: "Remember 6 symbols in 3 seconds" },
    icon: "🔮",
    color: "from-violet-600/30 to-purple-600/20",
    glow: "rgba(139,92,246,0.2)",
    border: "border-violet-400/30",
    duration: { ar: "دقيقة واحدة", en: "1 min" },
  },
  {
    id: "risk",
    name: { ar: "مخاطرة أم أمان", en: "Risk or Safe" },
    desc: { ar: "8 جولات • آمن أم مغامرة؟", en: "8 rounds • safe or daring?" },
    icon: "🎲",
    color: "from-rose-600/30 to-red-600/20",
    glow: "rgba(244,63,94,0.2)",
    border: "border-rose-400/30",
    duration: { ar: "دقيقتان", en: "2 min" },
  },
  {
    id: "intuition",
    name: { ar: "اختبار الحدس", en: "Intuition Test" },
    desc: { ar: "اقرأ المواقف الغامضة", en: "Read ambiguous situations" },
    icon: "👁",
    color: "from-cyan-600/30 to-teal-600/20",
    glow: "rgba(6,182,212,0.2)",
    border: "border-cyan-400/30",
    duration: { ar: "دقيقتان", en: "2 min" },
  },
  {
    id: "focus",
    name: { ar: "تحدي التركيز", en: "Focus Challenge" },
    desc: { ar: "اضغط الأعداد الزوجية فقط", en: "Tap only even numbers" },
    icon: "🎯",
    color: "from-emerald-600/30 to-green-600/20",
    glow: "rgba(16,185,129,0.2)",
    border: "border-emerald-400/30",
    duration: { ar: "دقيقة واحدة", en: "1 min" },
  },
];

type MindGamesHubProps = {
  locale: Locale;
  onStartGame: (gameId: string) => void;
};

export function MindGamesHub({ locale, onStartGame }: MindGamesHubProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8"
    >
      <div className="mb-8 text-center">
        <div className="inline-flex rounded-full border border-violet-300/30 bg-violet-500/10 px-4 py-1 text-xs font-medium tracking-widest text-violet-200">
          {locale === "ar" ? "الألعاب الذهنية" : "Mind Games"}
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {locale === "ar" ? "اختبر قدراتك الذهنية" : "Test Your Mental Abilities"}
        </h2>
        <p className="mt-3 text-base text-slate-300 sm:text-lg">
          {locale === "ar"
            ? "خمس ألعاب سريعة تكشف كيف يعمل عقلك"
            : "Five quick games that reveal how your mind works"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game, i) => (
          <motion.button
            key={game.id}
            type="button"
            onClick={() => onStartGame(game.id)}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
            whileHover={{ scale: 1.025, y: -3 }}
            whileTap={{ scale: 0.975 }}
            className={[
              "group relative overflow-hidden rounded-2xl border p-6 text-start transition-shadow duration-300",
              game.border,
              `bg-gradient-to-br ${game.color}`,
            ].join(" ")}
            style={{ boxShadow: `0 0 0 rgba(0,0,0,0)` }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 40px ${game.glow}`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 rgba(0,0,0,0)`;
            }}
          >
            <div className="mb-4 text-4xl">{game.icon}</div>
            <h3 className="text-lg font-bold text-white">{game.name[locale]}</h3>
            <p className="mt-1 text-sm text-slate-300">{game.desc[locale]}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-xs text-slate-300">
                ⏱ {game.duration[locale]}
              </span>
              <span className="text-sm font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {locale === "ar" ? "ابدأ ←" : "Start →"}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
