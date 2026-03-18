"use client";

import { motion } from "framer-motion";
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
  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.99 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-4xl items-center justify-center px-5 py-24 sm:px-8"
    >
      <div className="w-full rounded-3xl border border-white/15 bg-slate-900/50 p-6 shadow-[0_0_80px_rgba(99,102,241,0.15)] backdrop-blur-2xl sm:p-10">
        <ProgressBar current={index + 1} total={total} locale={locale} />
        <h2 className="mt-8 text-2xl font-semibold leading-tight text-white sm:text-3xl">
          {t(question.prompt, locale)}
        </h2>
        <div className="mt-8 grid gap-3">
          {question.options.map((option, optionIndex) => (
            <motion.button
              key={option.text.en + option.text.ar}
              type="button"
              onClick={() => onAnswer(optionIndex)}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.985 }}
              className="w-full rounded-2xl border border-slate-500/35 bg-slate-800/60 px-5 py-4 text-start text-sm leading-relaxed text-slate-100 transition hover:border-cyan-300/55 hover:bg-slate-700/60 sm:text-base"
            >
              {t(option.text, locale)}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}