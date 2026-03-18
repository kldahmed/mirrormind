"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MAX_PLAYER_NAME_LENGTH,
  MIN_PLAYER_NAME_LENGTH,
  getStoredPlayerName,
  isValidPlayerName,
  sanitizeDisplayName,
} from "@/lib/challenge";
import type { Locale } from "@/lib/i18n";

type PlayerNameModalProps = {
  locale: Locale;
  open: boolean;
  onClose: () => void;
  onConfirm: (playerName: string) => void;
};

export function PlayerNameModal({ locale, open, onClose, onConfirm }: PlayerNameModalProps) {
  const [name, setName] = useState(() => getStoredPlayerName());
  const [showError, setShowError] = useState(false);

  const sanitizedName = useMemo(() => sanitizeDisplayName(name), [name]);
  const isNameValid = isValidPlayerName(sanitizedName);

  const handleSubmit = () => {
    if (!isNameValid) {
      setShowError(true);
      return;
    }

    onConfirm(sanitizedName);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 shadow-[0_30px_80px_rgba(15,23,42,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
            <div className="p-5 sm:p-6">
              <p className="text-xs tracking-[0.2em] text-cyan-200/70">
                {locale === "ar" ? "اسم اللاعب" : "PLAYER NAME"}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                {locale === "ar" ? "اكتب اسمك للعب" : "Type your name to play"}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {locale === "ar"
                  ? `الاسم مطلوب قبل بدء أي لعبة. الحد الأدنى ${MIN_PLAYER_NAME_LENGTH} أحرف.`
                  : `Your name is required before any game starts. Minimum ${MIN_PLAYER_NAME_LENGTH} characters.`}
              </p>

              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  {locale === "ar" ? "اسمك" : "Your name"}
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onBlur={() => setShowError(true)}
                  required
                  minLength={MIN_PLAYER_NAME_LENGTH}
                  maxLength={MAX_PLAYER_NAME_LENGTH}
                  placeholder={locale === "ar" ? "مثال: أحمد" : "Example: Alex"}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-cyan-300/40 focus:bg-white/8"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>
                    {locale === "ar"
                      ? `${MIN_PLAYER_NAME_LENGTH}-${MAX_PLAYER_NAME_LENGTH} حرفاً`
                      : `${MIN_PLAYER_NAME_LENGTH}-${MAX_PLAYER_NAME_LENGTH} characters`}
                  </span>
                  <span>{sanitizedName.length}/{MAX_PLAYER_NAME_LENGTH}</span>
                </div>
                {showError && !isNameValid && (
                  <p className="mt-2 text-sm text-rose-300">
                    {locale === "ar"
                      ? `اكتب اسماً صالحاً بين ${MIN_PLAYER_NAME_LENGTH} و${MAX_PLAYER_NAME_LENGTH} حرفاً.`
                      : `Enter a valid name between ${MIN_PLAYER_NAME_LENGTH} and ${MAX_PLAYER_NAME_LENGTH} characters.`}
                  </p>
                )}
              </label>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.22)] transition hover:opacity-95 active:scale-[0.99]"
                >
                  {locale === "ar" ? "ابدأ اللعب" : "Start Playing"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-12 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}