export type LocalizedText = { ar: string; en: string };
export type DecisionType = "analytical" | "social" | "impulsive";

// ── Game 1: Decision Speed ────────────────────────────────────────────────────
export type DecisionScenario = {
  id: number;
  situation: LocalizedText;
  choices: { text: LocalizedText; type: DecisionType }[];
};

export const DECISION_SCENARIOS: DecisionScenario[] = [
  {
    id: 1,
    situation: { ar: "شخص يطلب مساعدتك فجأة", en: "Someone suddenly needs your help" },
    choices: [
      { text: { ar: "ساعده فوراً", en: "Help immediately" }, type: "social" },
      { text: { ar: "تجاهله", en: "Ignore it" }, type: "impulsive" },
      { text: { ar: "اسأله أكثر", en: "Ask for details" }, type: "analytical" },
    ],
  },
  {
    id: 2,
    situation: { ar: "وجدت محفظة في الشارع", en: "You found a wallet on the street" },
    choices: [
      { text: { ar: "أعدّها لصاحبها", en: "Return it" }, type: "social" },
      { text: { ar: "خذها", en: "Keep it" }, type: "impulsive" },
      { text: { ar: "سلّمها للشرطة", en: "Hand it to police" }, type: "analytical" },
    ],
  },
  {
    id: 3,
    situation: { ar: "صديق يطلب رأيك في فكرة سيئة", en: "Friend wants your opinion on a bad idea" },
    choices: [
      { text: { ar: "قل الحقيقة", en: "Tell the truth" }, type: "analytical" },
      { text: { ar: "اثنِ عليه", en: "Praise it" }, type: "impulsive" },
      { text: { ar: "اقترح بديلاً", en: "Suggest alternative" }, type: "social" },
    ],
  },
  {
    id: 4,
    situation: { ar: "اجتماع مهم وأنت متأخر", en: "Important meeting and you're late" },
    choices: [
      { text: { ar: "أسرع بسرعة", en: "Rush there" }, type: "impulsive" },
      { text: { ar: "أرسل اعتذاراً", en: "Send an apology" }, type: "social" },
      { text: { ar: "نظّم وقتك", en: "Reorganize time" }, type: "analytical" },
    ],
  },
  {
    id: 5,
    situation: { ar: "عرض عمل جديد ومغري", en: "Tempting new job offer arrives" },
    choices: [
      { text: { ar: "اقبله فوراً", en: "Accept immediately" }, type: "impulsive" },
      { text: { ar: "استشر أحبابك", en: "Consult loved ones" }, type: "social" },
      { text: { ar: "قارن وادرس", en: "Analyze it first" }, type: "analytical" },
    ],
  },
  {
    id: 6,
    situation: { ar: "خصام مع زميل في العمل", en: "Conflict with a coworker" },
    choices: [
      { text: { ar: "تجنّبه", en: "Avoid them" }, type: "impulsive" },
      { text: { ar: "تحدّث معه مباشرة", en: "Talk directly" }, type: "social" },
      { text: { ar: "حلّل المشكلة", en: "Analyze the issue" }, type: "analytical" },
    ],
  },
  {
    id: 7,
    situation: { ar: "خطأ في تقرير مهم", en: "Mistake found in important report" },
    choices: [
      { text: { ar: "أخفيه", en: "Hide it" }, type: "impulsive" },
      { text: { ar: "اعترف فوراً", en: "Admit immediately" }, type: "social" },
      { text: { ar: "أصلحه أولاً", en: "Fix it first" }, type: "analytical" },
    ],
  },
  {
    id: 8,
    situation: { ar: "صديق يطلب قرضاً مالياً", en: "Friend asks to borrow money" },
    choices: [
      { text: { ar: "أعطه بدون تردد", en: "Give without hesitation" }, type: "impulsive" },
      { text: { ar: "ارفض بلطف", en: "Politely decline" }, type: "social" },
      { text: { ar: "قيّم وضعه أولاً", en: "Assess situation first" }, type: "analytical" },
    ],
  },
];

// ── Game 2: Memory Flash ──────────────────────────────────────────────────────
export const MEMORY_SYMBOLS: string[] = [
  "⭐", "🔥", "💎", "🌊", "⚡", "🎯", "🌙", "🦋", "🎭", "🔮", "🌺", "🏆",
];

// ── Game 3: Risk or Safe ──────────────────────────────────────────────────────
export type RiskRound = {
  id: number;
  safe: LocalizedText;
  risky: LocalizedText;
};

export const RISK_ROUNDS: RiskRound[] = [
  {
    id: 1,
    safe: { ar: "ربح مضمون 50$", en: "Guaranteed $50" },
    risky: { ar: "50% احتمال ربح 200$", en: "50% chance to win $200" },
  },
  {
    id: 2,
    safe: { ar: "وظيفة مستقرة براتب ثابت", en: "Stable job, fixed salary" },
    risky: { ar: "مشروع خاص بدخل غير مضمون", en: "Own business, uncertain income" },
  },
  {
    id: 3,
    safe: { ar: "إجازة محلية مريحة", en: "Comfortable local vacation" },
    risky: { ar: "رحلة مغامرة لمكان مجهول", en: "Adventure trip to unknown place" },
  },
  {
    id: 4,
    safe: { ar: "استثمار بعائد 5% مضمون", en: "5% guaranteed investment return" },
    risky: { ar: "استثمار بعائد 25% أو خسارة", en: "25% return or total loss" },
  },
  {
    id: 5,
    safe: { ar: "قبول عرض العمل الحالي", en: "Accept current job offer" },
    risky: { ar: "انتظار عرض أفضل محتمل", en: "Wait for a better offer" },
  },
  {
    id: 6,
    safe: { ar: "رأي مدروس ومتحفظ", en: "Safe, measured opinion" },
    risky: { ar: "رأي جريء قد يصدم الآخرين", en: "Bold opinion that may shock others" },
  },
  {
    id: 7,
    safe: { ar: "طريق معروف للمنزل", en: "Familiar route home" },
    risky: { ar: "طريق جديد غير مجرّب", en: "New untried route" },
  },
  {
    id: 8,
    safe: { ar: "جائزة صغيرة مضمونة", en: "Small guaranteed prize" },
    risky: { ar: "مضاعفة الرهان على جائزة كبيرة", en: "Double the stake for big prize" },
  },
];

// ── Game 4: Intuition Test ────────────────────────────────────────────────────
export type IntuitionScenario = {
  id: number;
  scenario: LocalizedText;
  options: { text: LocalizedText; score: number }[];
  insight: LocalizedText;
};

export const INTUITION_SCENARIOS: IntuitionScenario[] = [
  {
    id: 1,
    scenario: { ar: "شخص ينظر خلفه فجأة", en: "Someone suddenly looks behind them" },
    options: [
      { text: { ar: "خائف", en: "Scared" }, score: 1 },
      { text: { ar: "سمع صوتاً", en: "Heard a sound" }, score: 3 },
      { text: { ar: "مشتت", en: "Distracted" }, score: 2 },
    ],
    insight: { ar: "الاستجابة للمحيط هي الأكثر احتمالاً", en: "Environmental response is most likely" },
  },
  {
    id: 2,
    scenario: { ar: "شخص يبتسم لكن عيناه حزينتان", en: "Person smiling but eyes look sad" },
    options: [
      { text: { ar: "يتظاهر بالسعادة", en: "Masking feelings" }, score: 3 },
      { text: { ar: "سعيد فعلاً", en: "Actually happy" }, score: 1 },
      { text: { ar: "متعب فقط", en: "Just tired" }, score: 2 },
    ],
    insight: { ar: "التناقض بين الوجه والعيون يكشف المشاعر المخفية", en: "Face-eye contrast reveals hidden feelings" },
  },
  {
    id: 3,
    scenario: { ar: "صديق يرد على رسائلك ببطء فجأة", en: "Friend suddenly replies slowly" },
    options: [
      { text: { ar: "مشغول جداً", en: "Very busy" }, score: 2 },
      { text: { ar: "يمر بشيء صعب", en: "Going through difficulty" }, score: 3 },
      { text: { ar: "ملّ من التواصل", en: "Bored of chatting" }, score: 1 },
    ],
    insight: { ar: "التغيرات المفاجئة غالباً تعني ضائقة خفية", en: "Sudden changes often signal hidden difficulty" },
  },
  {
    id: 4,
    scenario: { ar: "زميل يمدح عملك أمام الجميع", en: "Colleague praises your work publicly" },
    options: [
      { text: { ar: "يريد مقابلاً", en: "Wants something in return" }, score: 2 },
      { text: { ar: "صادق في مدحه", en: "Genuinely sincere" }, score: 3 },
      { text: { ar: "يريد الظهور", en: "Seeking attention" }, score: 1 },
    ],
    insight: { ar: "المدح العلني أكثر صدقاً من المدح الخاص", en: "Public praise tends to be more genuine" },
  },
  {
    id: 5,
    scenario: { ar: "شخص يتحدث بسرعة شديدة", en: "Person speaking very fast" },
    options: [
      { text: { ar: "متحمس لما يقوله", en: "Excited about something" }, score: 3 },
      { text: { ar: "يكذب", en: "Lying" }, score: 1 },
      { text: { ar: "متوتر", en: "Nervous" }, score: 2 },
    ],
    insight: { ar: "الحماس هو أشيع سبب للكلام السريع", en: "Excitement is the most common reason for fast speech" },
  },
  {
    id: 6,
    scenario: { ar: "شخص يتجنب النظر في عيونك", en: "Person avoiding eye contact" },
    options: [
      { text: { ar: "يكذب", en: "Lying" }, score: 1 },
      { text: { ar: "خجول أو قلق", en: "Shy or anxious" }, score: 3 },
      { text: { ar: "لا يحبك", en: "Doesn't like you" }, score: 2 },
    ],
    insight: { ar: "تجنب النظر أكثره خجل وليس كذباً", en: "Avoiding eye contact is usually shyness, not deception" },
  },
  {
    id: 7,
    scenario: { ar: "شخص يعطيك هدية مفاجئة", en: "Person gives you an unexpected gift" },
    options: [
      { text: { ar: "يريد شيئاً منك", en: "Wants something from you" }, score: 1 },
      { text: { ar: "يقدّرك فعلاً", en: "Genuinely appreciates you" }, score: 3 },
      { text: { ar: "ذكرى مناسبة", en: "A special occasion" }, score: 2 },
    ],
    insight: { ar: "الهدايا المفاجئة غالباً تعبير صادق عن التقدير", en: "Surprise gifts are usually genuine appreciation" },
  },
  {
    id: 8,
    scenario: { ar: "شخص يسألك كثيراً عن رأيك", en: "Person keeps asking for your opinion" },
    options: [
      { text: { ar: "يثق بك كثيراً", en: "Trusts you deeply" }, score: 3 },
      { text: { ar: "لا يثق بنفسه", en: "Doesn't trust himself" }, score: 2 },
      { text: { ar: "يريد أن يتلاعب بك", en: "Trying to manipulate you" }, score: 1 },
    ],
    insight: { ar: "طلب الرأي المتكرر دليل ثقة وليس تلاعباً", en: "Repeated advice-seeking is a sign of trust, not manipulation" },
  },
];
