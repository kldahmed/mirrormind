"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { DimensionScores, PersonalityProfile } from "@/lib/personality";

type PersonalityResultCardProps = {
  profile: PersonalityProfile;
  scores: DimensionScores;
  onRetake: () => void;
};

const scoreLine = (scores: DimensionScores) =>
  `Logic ${scores.logic}% • Creativity ${scores.creativity}% • Empathy ${scores.empathy}% • Risk ${scores.risk}%`;

export function PersonalityResultCard({
  profile,
  scores,
  onRetake,
}: PersonalityResultCardProps) {
  const [shareState, setShareState] = useState<"idle" | "done">("idle");

  const handleShare = async () => {
    const body = `${profile.shareHeadline}\n${scoreLine(scores)}\nDiscover your profile on MirrorMind.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "MirrorMind Result",
          text: body,
        });
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
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200/80">Your Personality Type</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {profile.name}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
          {profile.description}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-100">Strengths</h3>
          <ul className="mt-3 space-y-2 text-sm text-emerald-50/95 sm:text-base">
            {profile.strengths.map((strength) => (
              <li key={strength}>• {strength}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-100">Blind Spots</h3>
          <ul className="mt-3 space-y-2 text-sm text-rose-50/95 sm:text-base">
            {profile.blindSpots.map((blindSpot) => (
              <li key={blindSpot}>• {blindSpot}</li>
            ))}
          </ul>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-violet-300/30 bg-gradient-to-br from-slate-950 to-indigo-950/75 p-5"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-violet-200/90">Share Your Result</p>
        <p className="mt-2 text-xl font-semibold text-white">{profile.name}</p>
        <p className="mt-1 text-sm text-slate-300">{scoreLine(scores)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="rounded-full border border-cyan-200/40 bg-cyan-500/20 px-5 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-400/30"
          >
            {shareState === "done" ? "Shared" : "Share your result"}
          </button>
          <button
            type="button"
            onClick={onRetake}
            className="rounded-full border border-slate-300/40 bg-slate-700/35 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-600/45"
          >
            Retake Test
          </button>
        </div>
      </motion.div>
    </section>
  );
}