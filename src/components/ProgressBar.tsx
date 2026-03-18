"use client";

import { motion } from "framer-motion";

type ProgressBarProps = {
  current: number;
  total: number;
};

export function ProgressBar({ current, total }: ProgressBarProps) {
  const value = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-300/80">
        <span>Progress</span>
        <span>{current} / {total}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300"
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}