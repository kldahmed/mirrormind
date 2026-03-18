"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShareModal } from "@/components/ShareModal";
import type { PersonalityProfile } from "@/data/personalityTypes";
import { getBadgeForScore, type ShareableResult } from "@/lib/challenge";
import type { DimensionScores } from "@/lib/scoreEngine";
import type { Locale } from "@/lib/i18n";
import { t, uiCopy } from "@/lib/i18n";

type ResultCardProps = {
  profile: PersonalityProfile;
  locale: Locale;
  scores: DimensionScores;
  onRetake: () => void;
};

export function ResultCard({ profile, locale, scores, onRetake }: ResultCardProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const traitEntries = Object.entries(scores) as [keyof DimensionScores, number][];
  const profileScore = Math.round(traitEntries.reduce((sum, [, value]) => sum + value, 0) / traitEntries.length);
  const shareResult = useMemo<ShareableResult>(
    () => ({
      id: "profile",
      icon: "🧠",
      title: {
        ar: "ملف الشخصية",
        en: "Personality Profile",
      },
      score: profileScore,
      timeMs: null,
      timeKind: null,
      badge: getBadgeForScore("profile", profileScore),
      subtitle: profile.shareHeadline,
    }),
    [profile.shareHeadline, profileScore],
  );

  const traitLabels: Record<string, { ar: string; en: string }> = {
    logic: { ar: "المنطق", en: "Logic" },
    creativity: { ar: "الإبداع", en: "Creativity" },
    empathy: { ar: "التعاطف", en: "Empathy" },
    risk: { ar: "الجرأة", en: "Risk" },
  };

  return (
    <section className="space-y-5">
      {/* Main profile card */}
      <div className="rounded-3xl border border-white/15 bg-slate-900/45 p-6 backdrop-blur-xl sm:p-8">
        <p className="text-xs tracking-[0.14em] text-cyan-200/80">{uiCopy.resultTitle[locale]}</p>
        <div className="mt-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-100">
          {shareResult.badge[locale]}
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t(profile.name, locale)}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
          {t(profile.summary, locale)}
        </p>
      </div>

      {/* Viral share card */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-300/30 bg-gradient-to-br from-slate-950 via-indigo-950/60 to-slate-900 p-5 sm:p-6">
        {/* Background glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative">
          <p className="text-xs tracking-[0.16em] text-violet-300/80">{uiCopy.summaryCard[locale]}</p>
          <p className="mt-2 text-xl font-bold text-white">{t(profile.name, locale)}</p>
          <p className="mt-1 text-sm text-slate-300">{t(profile.shareHeadline, locale)}</p>
          <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-cyan-100">
            {shareResult.badge[locale]}
          </div>

          {/* Trait mini-bars */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {traitEntries.map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{traitLabels[key]?.[locale] ?? key}</span>
                  <span className="font-semibold text-slate-200">{value}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs text-slate-500">MirrorMind · mirrormind.app</p>

          {/* Action buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="group relative rounded-full border border-cyan-300/40 bg-cyan-500/20 px-5 py-2.5 text-sm font-semibold text-cyan-50 transition-all duration-200 hover:border-cyan-300/60 hover:bg-cyan-400/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] active:scale-95"
            >
              <span className="block">{uiCopy.shareResult[locale]}</span>
            </button>

            <button
              type="button"
              onClick={onRetake}
              className="rounded-full border border-slate-300/30 bg-slate-700/30 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-slate-300/50 hover:bg-slate-600/45 hover:text-white active:scale-95"
            >
              {uiCopy.retry[locale]}
            </button>
          </div>
        </div>
      </div>

      <ShareModal locale={locale} open={isShareOpen} result={shareResult} onClose={() => setIsShareOpen(false)} />
    </section>
  );
}
