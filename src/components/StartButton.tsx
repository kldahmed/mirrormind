"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { uiCopy } from "@/lib/i18n";

type StartButtonProps = {
  locale: Locale;
  onClick: () => void;
};

export function StartButton({ locale, onClick }: StartButtonProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-cyan-200/45 bg-gradient-to-r from-indigo-500/90 via-violet-500/90 to-cyan-500/90 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_40px_rgba(56,189,248,0.32)] transition hover:shadow-[0_0_62px_rgba(99,102,241,0.5)]"
    >
      {uiCopy.startPrimary[locale]}
      <span aria-hidden>{locale === "ar" ? "←" : "→"}</span>
    </motion.button>
  );
}
