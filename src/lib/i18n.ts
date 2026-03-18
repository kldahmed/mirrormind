import type { LocalizedText } from "@/data/questions";

export type Locale = "ar" | "en";

export const DEFAULT_LOCALE: Locale = "ar";

export const localeDirection = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

export const t = (text: LocalizedText, locale: Locale) => text[locale];

export const uiCopy = {
  brandLine: {
    ar: "تجربة تحليل شخصية غامرة",
    en: "Immersive Personality Intelligence",
  },
  heroTitle: {
    ar: "MirrorMind",
    en: "MirrorMind",
  },
  heroSubtitle: {
    ar: "اكتشف البنية الخفية لشخصيتك خلال تجربة تفاعلية مدهشة",
    en: "Discover the hidden architecture of your mind through an immersive interactive experience",
  },
  heroDescription: {
    ar: "12 سؤالًا مصممًا بعناية ليكشف توازنك بين المنطق، الإبداع، التعاطف، والجرأة — مع نتيجة تحليلية قابلة للمشاركة.",
    en: "12 carefully crafted prompts reveal your balance of logic, creativity, empathy, and risk — with a premium share-ready personality summary.",
  },
  startPrimary: {
    ar: "ابدأ الاختبار",
    en: "Start the Test",
  },
  startSecondary: {
    ar: "اكتشف شخصيتك",
    en: "Discover Your Profile",
  },
  howItWorksTitle: {
    ar: "كيف تعمل التجربة",
    en: "How It Works",
  },
  howItWorks: [
    {
      ar: "أجب عن 12 موقفًا واقعيًا بتدفق سريع وسلس.",
      en: "Answer 12 real-life scenarios with smooth one-screen interactions.",
    },
    {
      ar: "يتم تحليل اختياراتك على 4 محاور شخصية أساسية.",
      en: "Each response contributes to 4 core personality dimensions.",
    },
    {
      ar: "استلم ملفك الشخصي مع نقاط القوة ومناطق العمى.",
      en: "Receive your profile with strengths, blind spots, and a share card.",
    },
  ],
  discoverTitle: {
    ar: "ماذا ستكتشف",
    en: "What You Will Discover",
  },
  discoverItems: [
    {
      ar: "نمط اتخاذ القرار تحت الضغط",
      en: "Your decision style under pressure",
    },
    {
      ar: "توازن العقل التحليلي والخيال الإبداعي",
      en: "How analysis and imagination balance in your mind",
    },
    {
      ar: "كيف تؤثر على من حولك في العمل والحياة",
      en: "How you influence people in work and life",
    },
  ],
  trustLine: {
    ar: "أكثر من 12 مسارًا سلوكيًا محتملًا • تجربة سريعة • بدون تسجيل",
    en: "12+ behavioral paths • Fast session • No sign-up required",
  },
  previewTitle: {
    ar: "معاينة أبعادك النفسية",
    en: "Psychological Trait Preview",
  },
  beginJourney: {
    ar: "ابدأ الرحلة",
    en: "Begin the Journey",
  },
  progress: {
    ar: "التقدم",
    en: "Progress",
  },
  questionIndicator: {
    ar: "سؤال",
    en: "Question",
  },
  resultTitle: {
    ar: "ملفك النفسي",
    en: "Your Profile",
  },
  strengths: {
    ar: "نقاط القوة",
    en: "Strengths",
  },
  blindSpots: {
    ar: "مناطق العمى",
    en: "Blind Spots",
  },
  summaryCard: {
    ar: "بطاقة مشاركة",
    en: "Share Summary",
  },
  shareResult: {
    ar: "شارك النتيجة",
    en: "Share Result",
  },
  copied: {
    ar: "تم النسخ",
    en: "Copied",
  },
  retry: {
    ar: "إعادة الاختبار",
    en: "Retake Test",
  },
  loading: {
    ar: "جاري التحليل...",
    en: "Analyzing your profile...",
  },
  dimensionsTitle: {
    ar: "خريطة السمات",
    en: "Trait Map",
  },
  footer: {
    ar: "MirrorMind — تجربة استكشاف شخصية عربية أولًا",
    en: "MirrorMind — Arabic-first personality exploration",
  },
};
