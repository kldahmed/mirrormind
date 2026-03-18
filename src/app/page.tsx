"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlowBackground } from "@/components/GlowBackground";
import { HeroSection } from "@/components/HeroSection";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MindGamesHub } from "@/components/MindGamesHub";
import { MindProfile } from "@/components/MindProfile";
import { Navigation } from "@/components/Navigation";
import { PersonalitySummary } from "@/components/PersonalitySummary";
import { QuestionCard } from "@/components/QuestionCard";
import { ResultCard } from "@/components/ResultCard";
import { TraitMeter } from "@/components/TraitMeter";
import { PlayerNameModal } from "@/components/PlayerNameModal";
import { DecisionSpeed } from "@/components/games/DecisionSpeed";
import { FocusChallenge } from "@/components/games/FocusChallenge";
import { IntuitionTest } from "@/components/games/IntuitionTest";
import { MemoryFlash } from "@/components/games/MemoryFlash";
import { RiskOrSafe } from "@/components/games/RiskOrSafe";
import { QUESTIONS } from "@/data/questions";
import {
  buildChallengeEntry,
  getStoredPlayerName,
  isValidPlayerName,
  saveLocalAttempt,
  setStoredPlayerName,
  submitFeaturedAttempt,
  type GameId,
  type TimeKind,
} from "@/lib/challenge";
import { DEFAULT_LOCALE, localeDirection, t, type Locale, uiCopy } from "@/lib/i18n";
import { saveScore } from "@/lib/gameScores";
import { getPersonalityResult } from "@/lib/scoreEngine";

type NavSection = "test" | "games" | "profile";
type TestStage = "home" | "test" | "result";
type ActiveGame = GameId | null;

export default function Home() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [section, setSection] = useState<NavSection>("test");
  const [testStage, setTestStage] = useState<TestStage>("home");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isResultReady, setIsResultReady] = useState(false);
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [pendingGame, setPendingGame] = useState<GameId | null>(null);
  const [isPlayerNameModalOpen, setIsPlayerNameModalOpen] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const result = useMemo(() => getPersonalityResult(answers), [answers]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection(locale);
  }, [locale]);

  // Save personality result to localStorage when ready
  useEffect(() => {
    if (isResultReady) {
      saveScore("personalityType", result.typeId);
      saveScore("personalityName", result.profile.name);
    }
  }, [isResultReady, result]);

  const handleStart = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsResultReady(false);
    setTestStage("test");
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = optionIndex;
      return next;
    });

    const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
    if (isLastQuestion) {
      setTimeout(() => {
        setTestStage("result");
        setIsResultReady(true);
      }, 220);
      return;
    }
    setTimeout(() => setCurrentQuestionIndex((p) => p + 1), 180);
  };

  const handleRetake = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setIsResultReady(false);
    setTestStage("test");
  };

  const handleNavigate = (s: NavSection) => {
    setSection(s);
    setActiveGame(null);
  };

  const persistGameAttempt = (gameId: GameId, score: number, timeMs: number | null, timeKind: TimeKind) => {
    const entry = buildChallengeEntry({ gameId, score, timeMs, timeKind, playerName: getStoredPlayerName() });
    if (gameId === "decision") {
      void submitFeaturedAttempt(entry);
      return;
    }
    saveLocalAttempt(entry);
  };

  const handleStartGame = (gameId: GameId) => {
    if (!isValidPlayerName(getStoredPlayerName())) {
      setPendingGame(gameId);
      setIsPlayerNameModalOpen(true);
      return;
    }

    setActiveGame(gameId);
  };

  const handlePlayerNameClose = () => {
    setPendingGame(null);
    setIsPlayerNameModalOpen(false);
  };

  const handlePlayerNameConfirm = (playerName: string) => {
    setStoredPlayerName(playerName);
    setIsPlayerNameModalOpen(false);
    setActiveGame(pendingGame);
    setPendingGame(null);
  };

  const handleGameDone = () => {
    setActiveGame(null);
    setSection("profile");
  };

  const handleDecisionDone = (
    style: import("@/lib/gameScores").DecisionStyle,
    score: number,
    reactionMs: number,
  ) => {
    saveScore("decisionStyle", style);
    saveScore("decisionScore", score);
    persistGameAttempt("decision", score, reactionMs, "reaction");
    handleGameDone();
  };

  const handleMemoryDone = (score: number, durationMs: number) => {
    saveScore("memoryScore", score);
    persistGameAttempt("memory", score, durationMs, "time");
    handleGameDone();
  };

  const handleRiskDone = (score: number, durationMs: number) => {
    saveScore("riskScore", score);
    persistGameAttempt("risk", score, durationMs, "time");
    handleGameDone();
  };

  const handleIntuitionDone = (score: number, durationMs: number) => {
    saveScore("intuitionScore", score);
    persistGameAttempt("intuition", score, durationMs, "time");
    handleGameDone();
  };

  const handleFocusDone = (score: number, durationMs: number) => {
    saveScore("focusScore", score);
    persistGameAttempt("focus", score, durationMs, "time");
    handleGameDone();
  };

  const handleGameBack = () => {
    setActiveGame(null);
  };

  // During a game, show a minimal layout
  const inGame = activeGame !== null;

  return (
    <main className="mirrormind-bg relative min-h-[100dvh] overflow-hidden" dir={localeDirection(locale)}>
      <GlowBackground />

      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-3 pt-5 sm:px-8">
        <div className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl">
          MirrorMind
        </div>
        <LanguageSwitcher locale={locale} onToggle={setLocale} />
      </header>

      {!inGame && (
        <div className="relative z-20 pb-2">
          <Navigation locale={locale} active={section} onNavigate={handleNavigate} />
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {/* ── Active game ────────────────────────────────────────── */}
        {inGame && activeGame === "decision" && (
          <DecisionSpeed key="game-decision" locale={locale} onComplete={handleDecisionDone} onBack={handleGameBack} />
        )}
        {inGame && activeGame === "memory" && (
          <MemoryFlash key="game-memory" locale={locale} onComplete={handleMemoryDone} onBack={handleGameBack} />
        )}
        {inGame && activeGame === "risk" && (
          <RiskOrSafe key="game-risk" locale={locale} onComplete={handleRiskDone} onBack={handleGameBack} />
        )}
        {inGame && activeGame === "intuition" && (
          <IntuitionTest key="game-intuition" locale={locale} onComplete={handleIntuitionDone} onBack={handleGameBack} />
        )}
        {inGame && activeGame === "focus" && (
          <FocusChallenge key="game-focus" locale={locale} onComplete={handleFocusDone} onBack={handleGameBack} />
        )}

        {/* ── Mind Games Hub ─────────────────────────────────────── */}
        {!inGame && section === "games" && (
          <MindGamesHub key="games-hub" locale={locale} onStartGame={handleStartGame} />
        )}

        {/* ── Profile ───────────────────────────────────────────── */}
        {!inGame && section === "profile" && (
          <MindProfile
            key="profile"
            locale={locale}
            onGoToGames={() => handleNavigate("games")}
            onGoToTest={() => handleNavigate("test")}
          />
        )}

        {/* ── Personality Test ──────────────────────────────────── */}
        {!inGame && section === "test" && testStage === "home" && (
          <HeroSection key={`hero-${locale}`} locale={locale} onStart={handleStart} />
        )}

        {!inGame && section === "test" && testStage === "test" && currentQuestion && (
          <QuestionCard
            key={`q-${currentQuestion.id}`}
            question={currentQuestion}
            index={currentQuestionIndex}
            total={QUESTIONS.length}
            locale={locale}
            onAnswer={handleAnswer}
          />
        )}

        {!inGame && section === "test" && testStage === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 mx-auto flex min-h-[calc(100dvh-120px)] w-full max-w-6xl items-start px-5 py-10 sm:px-8"
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
                    {(Object.keys(result.scores) as (keyof typeof result.scores)[]).map((dimension, idx) => (
                      <TraitMeter
                        key={dimension}
                        label={t(result.labels[dimension], locale)}
                        value={result.scores[dimension]}
                        delay={idx * 0.08}
                      />
                    ))}
                  </div>
                )}
                {isResultReady && (
                  <button
                    type="button"
                    onClick={() => handleNavigate("games")}
                    className="mt-6 w-full rounded-2xl border border-violet-300/30 bg-violet-500/15 py-3 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/25"
                  >
                    🎮 {locale === "ar" ? "جرّب الألعاب الذهنية" : "Try Mind Games"}
                  </button>
                )}
              </section>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <PlayerNameModal
        key={`player-name-${isPlayerNameModalOpen ? pendingGame ?? "none" : "closed"}`}
        locale={locale}
        open={isPlayerNameModalOpen}
        onClose={handlePlayerNameClose}
        onConfirm={handlePlayerNameConfirm}
      />

      {!inGame && section === "test" && testStage === "home" && (
        <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-10 text-center text-sm text-slate-400 sm:px-8">
          {uiCopy.footer[locale]}
        </footer>
      )}
    </main>
  );
}

