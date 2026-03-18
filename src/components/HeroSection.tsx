"use client";

import { motion } from "framer-motion";

type HeroSectionProps = {
  onStart: () => void;
};

export function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-14"
    >
      <div className="w-full rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl sm:p-12 lg:p-16">
        <div className="inline-flex rounded-full border border-violet-300/40 bg-violet-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-100">
          Personality Exploration Engine
        </div>
        <h1 className="mt-7 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          MirrorMind
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
          Discover the hidden architecture of your mind
        </p>
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-cyan-200/40 bg-gradient-to-r from-indigo-500/90 to-cyan-500/90 px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_40px_rgba(56,189,248,0.35)] transition hover:shadow-[0_0_56px_rgba(99,102,241,0.45)]"
        >
          Start the Test
          <span aria-hidden>→</span>
        </motion.button>
      </div>
    </motion.section>
  );
}