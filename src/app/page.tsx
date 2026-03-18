"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlowBackground } from "@/components/GlowBackground";
import { HeroSection } from "@/components/HeroSection";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PersonalitySummary } from "@/components/PersonalitySummary";
import { QuestionCard } from "@/components/QuestionCard";
import { ResultCard } from "@/components/ResultCard";
import { TraitMeter } from "@/components/TraitMeter";
import { QUESTIONS } from "@/data/questions";
import { DEFAULT_LOCALE, localeDirection, t, type Locale, uiCopy } from "@/lib/i18n";
import { getPersonalityResult } from "@/lib/scoreEngine";

type Stage = "home" | "test" | "result";

export default function Home() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [stage, setStage] = useState<Stage>("home");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isResultReady, setIsResultReady] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const result = useMemo(() => getPersonalityResult(answers), [answers]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection(locale);
  }, [locale]);

  const handleStart = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsResultReady(false);
    setStage("test");
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prevAnswers) => {
      const nextAnswers = [...prevAnswers];
      nextAnswers[currentQuestionIndex] = optionIndex;
      return nextAnswers;
    });

    const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

    if (isLastQuestion) {
      setTimeout(() => {
        setStage("result");
        setIsResultReady(true);
      }, 220);
      return;
    }

    setTimeout(() => {
      setCurrentQuestionIndex((prev) => prev + 1);
    }, 180);
  };

  const handleRetake = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsResultReady(false);
    setStage("test");
  };

  return (
    <main className="mirrormind-bg relative min-h-[100dvh] overflow-hidden" dir={localeDirection(locale)}>
      <GlowBackground />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-3 pt-5 sm:px-8">
        <div className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
          MirrorMind
        </div>
        <LanguageSwitcher locale={locale} onToggle={setLocale} />
      </header>

      <AnimatePresence mode="wait" initial={false}>
        {stage === "home" && <HeroSection key={`hero-${locale}`} locale={locale} onStart={handleStart} />}

        {stage === "test" && currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentQuestionIndex}
            total={QUESTIONS.length}
            locale={locale}
            onAnswer={handleAnswer}
          />
        )}

        {stage === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl items-center px-5 py-24 sm:px-8"
          >
            <div className="grid w-full gap-6 lg:grid-cols-[1.25fr_1fr]">
              <div className="space-y-6">
                <ResultCard
                  profile={result.profile}
                  scores={result.scores}
                  locale={locale}
                  onRetake={handleRetake}
                />
                <PersonalitySummary profile={result.profile} locale={locale} />
              </div>

              <section className="rounded-3xl border border-white/15 bg-slate-900/45 p-6 backdrop-blur-xl sm:p-8">
                <h3 className="text-lg font-semibold text-white sm:text-xl">{uiCopy.dimensionsTitle[locale]}</h3>
                {!isResultReady ? (
                  <p className="mt-4 text-sm text-slate-300">{uiCopy.loading[locale]}</p>
                ) : (
                  <div className="mt-5 space-y-5">
                    {(Object.keys(result.scores) as (keyof typeof result.scores)[]).map((dimension, index) => (
                      <TraitMeter
                        key={dimension}
                        label={t(result.labels[dimension], locale)}
                        value={result.scores[dimension]}
                        delay={index * 0.08}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {stage === "home" && (
        <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-10 text-center text-sm text-slate-400 sm:px-8">
          {uiCopy.footer[locale]}
        </footer>
      )}
    </main>
  );
}
