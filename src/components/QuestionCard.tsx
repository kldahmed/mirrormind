"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "@/components/ProgressBar";
import type { Question } from "@/data/questions";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type QuestionCardProps = {
  question: Question;
  index: number;
  total: number;
  locale: Locale;
  onAnswer: (optionIndex: number) => void;
};

export function QuestionCard({ question, index, total, locale, onAnswer }: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    setTimeout(() => onAnswer(optionIndex), 200);
  };

  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-2xl items-center justify-center px-5 py-20 sm:px-8"
    >
      <div className="w-full rounded-3xl border border-white/15 bg-slate-900/55 p-7 shadow-[0_0_100px_rgba(99,102,241,0.18)] backdrop-blur-2xl sm:p-12">
        <ProgressBar current={index + 1} total={total} locale={locale} />

        <AnimatePresence mode="wait">
          <motion.h2
            key={question.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="mt-10 text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl lg:text-4xl"
          >
            {t(question.prompt, locale)}
          </motion.h2>
        </AnimatePresence>

        <div className="mt-8 grid gap-3">
          {question.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const isDimmed = selected !== null && !isSelected;

            return (
              <motion.button
                key={option.text.en + option.text.ar}
                type="button"
                onClick={() => handleSelect(optionIndex)}
                disabled={selected !== null}
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: isDimmed ? 0.38 : 1,
                  y: 0,
                  scale: isSelected ? 1.015 : 1,
                }}
                transition={{ duration: 0.25, delay: optionIndex * 0.06 }}
                whileHover={selected === null ? { scale: 1.015, y: -2 } : {}}
                whileTap={selected === null ? { scale: 0.985 } : {}}
                className={[
                  "w-full rounded-2xl border px-6 py-5 text-start text-sm leading-relaxed transition-colors duration-200 sm:text-base card-hover-glow",
                  isSelected
                    ? "border-cyan-400/60 bg-cyan-500/20 text-white shadow-[0_0_24px_rgba(34,211,238,0.18)]"
                    : "border-slate-500/35 bg-slate-800/55 text-slate-100 hover:border-cyan-300/50 hover:bg-slate-700/65 hover:text-white",
                  selected !== null ? "cursor-default" : "cursor-pointer",
                ].join(" ")}
              >
                <span className="block font-medium">{t(option.text, locale)}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}