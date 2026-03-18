import type { DimensionKey, LocalizedText } from "@/data/questions";

export type PersonalityTypeId =
  | "strategist"
  | "visionary"
  | "explorer"
  | "architect";

export type PersonalityProfile = {
  id: PersonalityTypeId;
  name: LocalizedText;
  summary: LocalizedText;
  strengths: LocalizedText[];
  blindSpots: LocalizedText[];
  shareHeadline: LocalizedText;
  archetypeWeights: Record<DimensionKey, number>;
};

export const PERSONALITY_TYPES: Record<PersonalityTypeId, PersonalityProfile> = {
  strategist: {
    id: "strategist",
    name: { ar: "الاستراتيجي", en: "The Strategist" },
    summary: {
      ar: "تقرأ الأنماط بسرعة، وتحوّل الفوضى إلى مسار واضح. قوتك في بناء قرارات دقيقة تحت الضغط مع رؤية طويلة المدى.",
      en: "You read patterns quickly and turn complexity into clear direction. Your strength is making precise, high-leverage decisions under pressure.",
    },
    strengths: [
      { ar: "تفكير منهجي في المواقف المعقدة", en: "Systems thinking in complex situations" },
      { ar: "قدرة عالية على ترتيب الأولويات", en: "Strong prioritization under constraints" },
      { ar: "حسم مدروس دون اندفاع", en: "Calculated decisiveness without impulsiveness" },
    ],
    blindSpots: [
      { ar: "تميل أحيانًا للمبالغة في التحليل", en: "Can overanalyze before moving" },
      { ar: "قد تقلل من الإشارات العاطفية في القرار السريع", en: "May underweight emotional context in fast calls" },
      { ar: "تؤجل التجريب حتى يكتمل النموذج", en: "Sometimes delays experimentation for certainty" },
    ],
    shareHeadline: {
      ar: "أنا الاستراتيجي — وضوح، دقة، ونظرة بعيدة.",
      en: "I am The Strategist — precision, structure, and long-range clarity.",
    },
    archetypeWeights: { logic: 0.46, creativity: 0.14, empathy: 0.11, risk: 0.29 },
  },
  visionary: {
    id: "visionary",
    name: { ar: "الرؤيوي", en: "The Visionary" },
    summary: {
      ar: "ترى الإمكانات قبل أن تصبح واضحة للجميع. تجمع بين الخيال والحدس الإنساني لتصنع اتجاهًا ملهمًا للمستقبل.",
      en: "You spot future possibilities before they become obvious. You blend imagination and human intuition to inspire forward motion.",
    },
    strengths: [
      { ar: "ابتكار أفكار أصلية ومؤثرة", en: "Original and high-impact ideation" },
      { ar: "صياغة رؤى تلهم الآخرين", en: "Inspiring narrative framing" },
      { ar: "تحويل القيود إلى فرص", en: "Turning constraints into opportunities" },
    ],
    blindSpots: [
      { ar: "قد تسبق سرعة التنفيذ الواقعية", en: "Can outpace practical execution" },
      { ar: "تميل أحيانًا للجِدة على حساب التركيز", en: "May chase novelty over focus" },
      { ar: "تقلل من أثر القيود الزمنية", en: "Can underestimate delivery limits" },
    ],
    shareHeadline: {
      ar: "أنا الرؤيوي — خيال جريء وحدس يصنع المستقبل.",
      en: "I am The Visionary — bold imagination with future-shaping intuition.",
    },
    archetypeWeights: { logic: 0.11, creativity: 0.46, empathy: 0.29, risk: 0.14 },
  },
  explorer: {
    id: "explorer",
    name: { ar: "المستكشف", en: "The Explorer" },
    summary: {
      ar: "طاقتك تظهر في الحركة والتجربة. أنت بارع في تحويل المجهول إلى فرصة عبر الشجاعة والتعلّم السريع من الواقع.",
      en: "Your energy peaks in movement and experimentation. You turn uncertainty into opportunity through bold action and rapid learning.",
    },
    strengths: [
      { ar: "تكيف سريع مع التغيّر", en: "Fast adaptation in changing environments" },
      { ar: "مبادرة عالية وتنفيذ مباشر", en: "High initiative and execution speed" },
      { ar: "راحة مع الغموض والتجريب", en: "Comfort with uncertainty and experimentation" },
    ],
    blindSpots: [
      { ar: "تتحرك أحيانًا أسرع من توافق الفريق", en: "Can move faster than alignment allows" },
      { ar: "قد تتجاوز مرحلة التأمل بعد النجاح المبكر", en: "May skip reflection after early wins" },
      { ar: "الزخم قد يسبق العمق", en: "Momentum can outrun depth" },
    ],
    shareHeadline: {
      ar: "أنا المستكشف — جرأة، حركة، وتعلم من الواقع.",
      en: "I am The Explorer — bold momentum and real-world learning.",
    },
    archetypeWeights: { logic: 0.14, creativity: 0.29, empathy: 0.11, risk: 0.46 },
  },
  architect: {
    id: "architect",
    name: { ar: "المهندس", en: "The Architect" },
    summary: {
      ar: "تمزج المنطق بالإبداع لبناء أنظمة أنيقة وقابلة للاستمرار. تتألق عندما تصمم حلولًا متوازنة بين الجمال والصرامة.",
      en: "You blend logic and creativity into elegant structures that last. You thrive when designing solutions that balance beauty and rigor.",
    },
    strengths: [
      { ar: "ربط الخيال بعمق تقني", en: "Combining imagination with technical depth" },
      { ar: "تصميم حلول متماسكة قابلة للتوسع", en: "Designing coherent, scalable systems" },
      { ar: "توازن متقن بين الجودة والسرعة", en: "Balanced quality and delivery discipline" },
    ],
    blindSpots: [
      { ar: "تميل أحيانًا للصقل الزائد قبل الإطلاق", en: "Can over-polish before sharing" },
      { ar: "تفضّل النقاء التصميمي على سرعة التنفيذ", en: "May favor design purity over speed" },
      { ar: "قد تنعزل عند الحاجة للتشاور", en: "Can isolate when collaboration is needed" },
    ],
    shareHeadline: {
      ar: "أنا المهندس — أناقة التفكير وصلابة البناء.",
      en: "I am The Architect — elegant systems and intentional design.",
    },
    archetypeWeights: { logic: 0.42, creativity: 0.34, empathy: 0.16, risk: 0.08 },
  },
};
