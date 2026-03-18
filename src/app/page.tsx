"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { PersonalityResultCard } from "@/components/PersonalityResultCard";
import { QuestionCard } from "@/components/QuestionCard";
import { ResultStats } from "@/components/ResultStats";
import { QUESTIONS } from "@/data/questions";
import { getPersonalityResult } from "@/lib/personality";

type Stage = "home" | "test" | "result";

export default function Home() {
  const [stage, setStage] = useState<Stage>("home");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const result = useMemo(() => getPersonalityResult(answers), [answers]);

  const handleStart = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
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
    setStage("home");
  };

  return (
    <main className="mirrormind-bg relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <AnimatePresence mode="wait" initial={false}>
        {stage === "home" && <HeroSection key="hero" onStart={handleStart} />}

        {stage === "test" && currentQuestion && (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            index={currentQuestionIndex}
            total={QUESTIONS.length}
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
            className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-14"
          >
            <div className="grid w-full gap-6 lg:grid-cols-[1.25fr_1fr]">
              <PersonalityResultCard
                profile={result.profile}
                scores={result.scores}
                onRetake={handleRetake}
              />
              <ResultStats scores={result.scores} labels={result.labels} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
