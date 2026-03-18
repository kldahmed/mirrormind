import type { PersonalityProfile } from "@/data/personalityTypes";
import type { Locale } from "@/lib/i18n";
import { t, uiCopy } from "@/lib/i18n";

type PersonalitySummaryProps = {
  profile: PersonalityProfile;
  locale: Locale;
};

export function PersonalitySummary({ profile, locale }: PersonalitySummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-5">
        <h3 className="text-sm font-semibold tracking-[0.08em] text-emerald-100">{uiCopy.strengths[locale]}</h3>
        <ul className="mt-3 space-y-2 text-sm text-emerald-50/95 sm:text-base">
          {profile.strengths.map((strength) => (
            <li key={strength.en + strength.ar}>• {t(strength, locale)}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-5">
        <h3 className="text-sm font-semibold tracking-[0.08em] text-rose-100">{uiCopy.blindSpots[locale]}</h3>
        <ul className="mt-3 space-y-2 text-sm text-rose-50/95 sm:text-base">
          {profile.blindSpots.map((blindSpot) => (
            <li key={blindSpot.en + blindSpot.ar}>• {t(blindSpot, locale)}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
