"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { uiCopy } from "@/lib/i18n";

type ProgressBarProps = {
  current: number;
  total: number;
  locale: Locale;
};

export function ProgressBar({ current, total, locale }: ProgressBarProps) {
  const value = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs tracking-[0.12em] text-slate-300/80">
        <span>{uiCopy.progress[locale]}</span>
        <span>
          {uiCopy.questionIndicator[locale]} {current} / {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          className="progress-bar-animated h-full rounded-full"
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}