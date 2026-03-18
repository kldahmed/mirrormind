"use client";

import { motion } from "framer-motion";
import { ProgressBar } from "@/components/ProgressBar";
import type { Question } from "@/data/questions";

type QuestionCardProps = {
  question: Question;
  index: number;
  total: number;
  onAnswer: (optionIndex: number) => void;
};

export function QuestionCard({ question, index, total, onAnswer }: QuestionCardProps) {
  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.99 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-14"
    >
      <div className="w-full rounded-3xl border border-white/15 bg-slate-900/45 p-7 shadow-[0_0_80px_rgba(99,102,241,0.14)] backdrop-blur-2xl sm:p-10">
        <ProgressBar current={index + 1} total={total} />
        <h2 className="mt-8 text-2xl font-semibold leading-tight text-white sm:text-3xl">
          {question.prompt}
        </h2>
        <div className="mt-8 grid gap-3">
          {question.options.map((option, optionIndex) => (
            <motion.button
              key={option.text}
              type="button"
              onClick={() => onAnswer(optionIndex)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className="w-full rounded-2xl border border-slate-500/35 bg-slate-800/60 px-5 py-4 text-left text-sm leading-relaxed text-slate-100 transition hover:border-cyan-300/55 hover:bg-slate-700/60 sm:text-base"
            >
              {option.text}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}