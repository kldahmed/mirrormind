"use client";

import { motion } from "framer-motion";
import { DIMENSION_LABELS } from "@/data/questions";
import type { Locale } from "@/lib/i18n";
import { t, uiCopy } from "@/lib/i18n";
import { StartButton } from "@/components/StartButton";
import { TraitMeter } from "@/components/TraitMeter";

type HeroSectionProps = {
  locale: Locale;
  onStart: () => void;
};

const PREVIEW_SCORES = {
  logic: 76,
  creativity: 68,
  empathy: 59,
  risk: 64,
};

export function HeroSection({ locale, onStart }: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-28 sm:px-8"
    >
      <div className="rounded-3xl border border-white/15 bg-slate-950/55 p-6 shadow-[0_0_80px_rgba(99,102,241,0.17)] backdrop-blur-2xl sm:p-10 lg:p-12">
        <div className="inline-flex rounded-full border border-violet-300/40 bg-violet-500/10 px-4 py-1 text-xs font-medium tracking-[0.16em] text-violet-100">
          {uiCopy.brandLine[locale]}
        </div>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-7xl">{uiCopy.heroTitle[locale]}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-100 sm:text-xl">{uiCopy.heroSubtitle[locale]}</p>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">{uiCopy.heroDescription[locale]}</p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <StartButton locale={locale} onClick={onStart} />
          <button
            type="button"
            onClick={onStart}
            className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-200/55 hover:text-white"
          >
            {uiCopy.startSecondary[locale]}
          </button>
        </div>

        <p className="mt-6 text-sm text-cyan-100/85">{uiCopy.trustLine[locale]}</p>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/12 bg-slate-900/45 p-5 backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold text-white">{uiCopy.howItWorksTitle[locale]}</h2>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-200 sm:text-base">
            {uiCopy.howItWorks.map((item, index) => (
              <p key={item.en}>
                <span className="me-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-cyan-200/40 text-xs text-cyan-100">
                  {index + 1}
                </span>
                {t(item, locale)}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/12 bg-slate-900/45 p-5 backdrop-blur-xl sm:p-6">
          <h2 className="text-lg font-semibold text-white">{uiCopy.discoverTitle[locale]}</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-200 sm:text-base">
            {uiCopy.discoverItems.map((item) => (
              <li key={item.en} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                {t(item, locale)}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-7 rounded-2xl border border-white/12 bg-slate-900/45 p-5 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">{uiCopy.previewTitle[locale]}</h2>
          <button
            type="button"
            onClick={onStart}
            className="rounded-full border border-cyan-200/40 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
          >
            {uiCopy.beginJourney[locale]}
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {(Object.keys(PREVIEW_SCORES) as (keyof typeof PREVIEW_SCORES)[]).map((key, index) => (
            <TraitMeter
              key={key}
              label={t(DIMENSION_LABELS[key], locale)}
              value={PREVIEW_SCORES[key]}
              delay={index * 0.1}
            />
          ))}
        </div>
      </section>
    </motion.section>
  );
}