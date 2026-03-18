"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

type NavSection = "test" | "games" | "profile";

type NavigationProps = {
  locale: Locale;
  active: NavSection;
  onNavigate: (section: NavSection) => void;
};

const labels: Record<NavSection, { ar: string; en: string }> = {
  test: { ar: "الاختبار", en: "Test" },
  games: { ar: "الألعاب الذهنية", en: "Mind Games" },
  profile: { ar: "ملفك الذهني", en: "Profile" },
};

const icons: Record<NavSection, string> = {
  test: "🧠",
  games: "🎮",
  profile: "📊",
};

const sections: NavSection[] = ["test", "games", "profile"];

export function Navigation({ locale, active, onNavigate }: NavigationProps) {
  return (
    <nav className="relative z-30 mx-auto w-full max-w-6xl px-5 pb-2 sm:px-8">
      <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-slate-900/60 p-1.5 backdrop-blur-xl">
        {sections.map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => onNavigate(section)}
            className="relative flex-1 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors duration-200 sm:text-sm"
          >
            {active === section && (
              <motion.div
                layoutId="nav-pill"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/80 to-violet-600/80 shadow-[0_0_16px_rgba(99,102,241,0.35)]"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span
              className={[
                "relative flex items-center justify-center gap-1.5",
                active === section ? "text-white" : "text-slate-400 hover:text-slate-200",
              ].join(" ")}
            >
              <span className="hidden sm:inline">{icons[section]}</span>
              {labels[section][locale]}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
