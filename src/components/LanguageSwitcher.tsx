"use client";

import type { Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  locale: Locale;
  onToggle: (locale: Locale) => void;
};

export function LanguageSwitcher({ locale, onToggle }: LanguageSwitcherProps) {
  return (
    <div className="inline-flex rounded-full border border-white/20 bg-white/5 p-1 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => onToggle("ar")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          locale === "ar"
            ? "bg-cyan-300/20 text-white shadow-[0_0_22px_rgba(34,211,238,0.45)]"
            : "text-slate-300 hover:text-white"
        }`}
      >
        العربية
      </button>
      <button
        type="button"
        onClick={() => onToggle("en")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
          locale === "en"
            ? "bg-violet-300/20 text-white shadow-[0_0_22px_rgba(167,139,250,0.45)]"
            : "text-slate-300 hover:text-white"
        }`}
      >
        English
      </button>
    </div>
  );
}
