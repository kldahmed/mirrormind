"use client";

import { useState } from "react";
import type { PersonalityProfile } from "@/data/personalityTypes";
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
  const [shareState, setShareState] = useState<"idle" | "done">("idle");

  const scoreLine = `${scores.logic}% Logic • ${scores.creativity}% Creativity • ${scores.empathy}% Empathy • ${scores.risk}% Risk`;

  const handleShare = async () => {
    const body = `${t(profile.shareHeadline, locale)}\n${scoreLine}\nMirrorMind`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "MirrorMind", text: body });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(body);
      }
      setShareState("done");
      window.setTimeout(() => setShareState("idle"), 1800);
    } catch {
      setShareState("idle");
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/15 bg-slate-900/45 p-6 backdrop-blur-xl sm:p-8">
        <p className="text-xs tracking-[0.14em] text-cyan-200/80">{uiCopy.resultTitle[locale]}</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t(profile.name, locale)}</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
          {t(profile.summary, locale)}
        </p>
      </div>

      <div className="rounded-2xl border border-violet-300/30 bg-gradient-to-br from-slate-950 to-indigo-950/70 p-5">
        <p className="text-xs tracking-[0.16em] text-violet-200/90">{uiCopy.summaryCard[locale]}</p>
        <p className="mt-2 text-xl font-semibold text-white">{t(profile.name, locale)}</p>
        <p className="mt-1 text-sm text-slate-300">{t(profile.shareHeadline, locale)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full border border-cyan-200/40 bg-cyan-500/20 px-5 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-400/30"
          >
            {shareState === "done" ? uiCopy.copied[locale] : uiCopy.shareResult[locale]}
          </button>
          <button
            type="button"
            onClick={onRetake}
            className="rounded-full border border-slate-300/40 bg-slate-700/35 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600/45"
          >
            {uiCopy.retry[locale]}
          </button>
        </div>
      </div>
    </section>
  );
}
