"use client";

import { motion } from "framer-motion";
import type { DimensionScores } from "@/lib/personality";

type ResultStatsProps = {
  scores: DimensionScores;
  labels: Record<keyof DimensionScores, string>;
};

export function ResultStats({ scores, labels }: ResultStatsProps) {
  const entries = Object.entries(scores) as [keyof DimensionScores, number][];

  return (
    <section className="rounded-3xl border border-white/15 bg-slate-900/45 p-6 backdrop-blur-xl sm:p-8">
      <h3 className="text-lg font-semibold text-white sm:text-xl">Cognitive Signature</h3>
      <div className="mt-5 space-y-5">
        {entries.map(([dimension, value]) => (
          <div key={dimension}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{labels[dimension]}</span>
              <span className="text-slate-300">{value}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-700/45">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}