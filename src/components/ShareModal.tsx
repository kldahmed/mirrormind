"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import {
  buildShareText,
  formatScoreValue,
  formatShareDateTime,
  formatTimeMetric,
  getFallbackDisplayName,
  getStoredPlayerName,
  sanitizeDisplayName,
  setStoredPlayerName,
  type ShareableResult,
} from "@/lib/challenge";

type ShareModalProps = {
  locale: Locale;
  open: boolean;
  result: ShareableResult | null;
  onClose: () => void;
};

export function ShareModal({ locale, open, result, onClose }: ShareModalProps) {
  return (
    <AnimatePresence>
      {open && result && <ShareModalSheet key={`${result.id}-${result.score}`} locale={locale} result={result} onClose={onClose} />}
    </AnimatePresence>
  );
}

function ShareModalSheet({ locale, result, onClose }: { locale: Locale; result: ShareableResult; onClose: () => void }) {
  const [name, setName] = useState(() => getStoredPlayerName());
  const [status, setStatus] = useState<"idle" | "success" | "copied" | "error">("idle");
  const [sharedAt] = useState(() => new Date());
  const canUseWebShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const resolvedName = useMemo(() => {
    const sanitized = sanitizeDisplayName(name);
    return sanitized || getFallbackDisplayName(locale);
  }, [locale, name]);

  const handleShare = async () => {
    const sanitized = sanitizeDisplayName(name);
    setStoredPlayerName(sanitized);

    const shareText = buildShareText({
      locale,
      playerName: sanitized || getFallbackDisplayName(locale),
      result,
      sharedAt,
      siteUrl: typeof window !== "undefined" ? window.location.href : undefined,
    });

    try {
      if (canUseWebShare) {
        await navigator.share({
          title: "MirrorMind",
          text: shareText,
        });
        setStatus("success");
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setStatus("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("idle");
        return;
      }

      try {
        await navigator.clipboard.writeText(shareText);
        setStatus("copied");
      } catch {
        setStatus("error");
      }
    }
  };

  return (
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
            className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 shadow-[0_30px_80px_rgba(15,23,42,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-[0.2em] text-cyan-200/70">
                    {locale === "ar" ? "بطاقة مشاركة" : "SHARE CARD"}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {locale === "ar" ? "شارك نتيجتك بشكل شخصي" : "Share your result personally"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {locale === "ar"
                      ? "أدخل اسم العرض قبل المشاركة. الاسم اختياري لكن يجعل التحدي أكثر شخصية."
                      : "Add a display name before sharing. It is optional, but it makes the challenge feel personal."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  {locale === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  {locale === "ar" ? "اسم العرض" : "Display name"}
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(sanitizeDisplayName(event.target.value))}
                  maxLength={20}
                  placeholder={getFallbackDisplayName(locale)}
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-base text-white outline-none transition focus:border-cyan-300/40 focus:bg-white/8"
                />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>{locale === "ar" ? "اختياري، بحد أقصى 20 حرفاً" : "Optional, up to 20 characters"}</span>
                  <span>{sanitizeDisplayName(name).length}/20</span>
                </div>
              </label>

              <div className="mt-5 overflow-hidden rounded-[24px] border border-cyan-300/20 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),linear-gradient(145deg,rgba(15,23,42,0.98),rgba(17,24,39,0.94))] p-5 sm:p-6">
                <div className="pointer-events-none absolute" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.22em] text-cyan-200/70">MirrorMind</p>
                    <h4 className="mt-3 text-2xl font-bold text-white">{resolvedName}</h4>
                    <p className="mt-1 text-sm text-slate-300">{result.title[locale]}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
                    {result.icon}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <InfoTile
                    label={locale === "ar" ? "النتيجة" : "Score"}
                    value={formatScoreValue(locale, result.score)}
                  />
                  <InfoTile
                    label={locale === "ar" ? "الوقت" : "Time"}
                    value={formatTimeMetric(locale, result.timeMs)}
                  />
                  <InfoTile label={locale === "ar" ? "اللقب" : "Badge"} value={result.badge[locale]} />
                  <InfoTile
                    label={locale === "ar" ? "تاريخ المشاركة" : "Shared"}
                    value={formatShareDateTime(sharedAt)}
                  />
                </div>

                {result.subtitle && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    {result.subtitle[locale]}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleShare}
                  className="h-12 flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.22)] transition hover:opacity-95 active:scale-[0.99]"
                >
                  {canUseWebShare
                    ? locale === "ar"
                      ? "شارك الآن"
                      : "Share Now"
                    : locale === "ar"
                      ? "انسخ النص"
                      : "Copy Text"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="h-12 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  {locale === "ar" ? "لاحقاً" : "Maybe Later"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {status !== "idle" && (
                  <motion.div
                    key={status}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    {status === "success" && (locale === "ar" ? "تم فتح نافذة المشاركة" : "Share sheet opened")}
                    {status === "copied" && (locale === "ar" ? "تم نسخ النص إلى الحافظة" : "Text copied to clipboard")}
                    {status === "error" && (locale === "ar" ? "تعذر إتمام المشاركة" : "Could not complete sharing")}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}