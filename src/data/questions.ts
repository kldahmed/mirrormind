export type DimensionKey = "logic" | "creativity" | "empathy" | "risk";

export type DimensionImpact = Record<DimensionKey, number>;

export type LocalizedText = {
  ar: string;
  en: string;
};

export type QuestionOption = {
  text: LocalizedText;
  impact: DimensionImpact;
};

export type Question = {
  id: number;
  prompt: LocalizedText;
  options: QuestionOption[];
};

export const DIMENSION_LABELS: Record<DimensionKey, LocalizedText> = {
  logic: { ar: "المنطق", en: "Logic" },
  creativity: { ar: "الإبداع", en: "Creativity" },
  empathy: { ar: "التعاطف", en: "Empathy" },
  risk: { ar: "الجرأة", en: "Risk" },
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: {
      ar: "تغيّر مسار مشروع مهم بشكل مفاجئ. ما أول خطوة تقوم بها؟",
      en: "A critical project suddenly changes direction. Your first move is:",
    },
    options: [
      {
        text: {
          ar: "أرسم القيود الجديدة وأعيد تخطيط النظام قبل التنفيذ.",
          en: "Map new constraints and re-plan the system before acting.",
        },
        impact: { logic: 5, creativity: 2, empathy: 1, risk: 2 },
      },
      {
        text: {
          ar: "أقترح ثلاث بدائل جريئة وأدفع بأقوى رؤية.",
          en: "Sketch three bold alternatives and pitch the strongest vision.",
        },
        impact: { logic: 2, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: {
          ar: "أراجع حالة الفريق وأوحده قبل أي تنفيذ.",
          en: "Check team morale and align people before touching execution.",
        },
        impact: { logic: 1, creativity: 2, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "أتحرك بسرعة بتجربة حية ثم أضبط المسار من النتائج الواقعية.",
          en: "Move fast with a live experiment and adjust from real feedback.",
        },
        impact: { logic: 2, creativity: 3, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 2,
    prompt: {
      ar: "عند تعلم شيء جديد، ما الأسلوب الذي تستوعب به أسرع؟",
      en: "When learning something new, you absorb it best by:",
    },
    options: [
      {
        text: {
          ar: "تفكيكه إلى مبادئ وفهم النموذج الذي يحكمه.",
          en: "Breaking it into principles and understanding the model.",
        },
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 1 },
      },
      {
        text: {
          ar: "تحويل الأفكار إلى صور ذهنية ونماذج أولية.",
          en: "Turning ideas into metaphors, visuals, and prototypes.",
        },
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 2 },
      },
      {
        text: {
          ar: "نقاشه بعمق مع الآخرين والتقاط تغير وجهات النظر.",
          en: "Discussing it deeply with others and sensing perspective shifts.",
        },
        impact: { logic: 1, creativity: 2, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "الدخول مباشرة والتعلم عبر عدم اليقين.",
          en: "Jumping in immediately and learning through uncertainty.",
        },
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 3,
    prompt: {
      ar: "في القرارات الجماعية، يعتمد عليك الناس غالبًا من أجل:",
      en: "In group decisions, people rely on you for:",
    },
    options: [
      {
        text: {
          ar: "الوضوح والأدلة وإطار قرار منظم.",
          en: "Clarity, evidence, and a clean decision framework.",
        },
        impact: { logic: 5, creativity: 1, empathy: 2, risk: 1 },
      },
      {
        text: {
          ar: "أفكار غير متوقعة تفتح اتجاهًا جديدًا.",
          en: "Unexpected concepts that unlock a new direction.",
        },
        impact: { logic: 2, creativity: 5, empathy: 1, risk: 3 },
      },
      {
        text: {
          ar: "تناغم الآراء المتعارضة واحتواء كل صوت.",
          en: "The ability to harmonize conflict and include every voice.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "الجرأة على الحسم عندما يتردد الآخرون.",
          en: "Your courage to commit when others hesitate.",
        },
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 4,
    prompt: {
      ar: "عطلة نهاية أسبوع بلا التزامات تبدو مثالية إذا كنت:",
      en: "A weekend with no obligations sounds most appealing if you:",
    },
    options: [
      {
        text: {
          ar: "تغوص في ألعاب استراتيجية أو تحليل عميق طويل.",
          en: "Deep-dive into strategy games, systems, or long-form analysis.",
        },
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 1 },
      },
      {
        text: {
          ar: "تبني شيئًا تعبيريًا: كتابة، تصميم، أو صوت.",
          en: "Build something expressive: writing, design, or sound.",
        },
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 2 },
      },
      {
        text: {
          ar: "تستعيد قربك من الأصدقاء ولحظات إنسانية عميقة.",
          en: "Reconnect with friends and meaningful one-on-one moments.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "تخوض رحلة غير مخطط لها وتتبع حدسك بالكامل.",
          en: "Take an unplanned trip and follow pure instinct.",
        },
        impact: { logic: 1, creativity: 3, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 5,
    prompt: {
      ar: "ما الوصف الأقرب لعلاقتك مع الفشل؟",
      en: "What best describes your relationship with failure?",
    },
    options: [
      {
        text: {
          ar: "إشارة لتحسين النموذج وتقليل الخطأ مستقبلًا.",
          en: "A signal to improve the model and reduce future error.",
        },
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 2 },
      },
      {
        text: {
          ar: "نقطة إعادة تشكيل غالبًا تقود لأفكار أفضل.",
          en: "A remix point that often leads to better ideas.",
        },
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: {
          ar: "لحظة إنسانية تستحق التأمل والتعاطف.",
          en: "A human moment that deserves reflection and compassion.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "ثمن طبيعي للمحاولات الكبيرة؛ أتعافى بسرعة وأتابع.",
          en: "The cost of playing big; I recover quickly and push on.",
        },
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 6,
    prompt: {
      ar: "عندما يظهر خلاف، ما رد فعلك التلقائي؟",
      en: "When conflict appears, your instinct is to:",
    },
    options: [
      {
        text: {
          ar: "أفصل الحقائق وأحل التناقض من جذوره.",
          en: "Isolate the facts and resolve the root contradiction.",
        },
        impact: { logic: 5, creativity: 1, empathy: 2, risk: 2 },
      },
      {
        text: {
          ar: "أعيد تأطير الموقف وأبحث عن خيار ثالث.",
          en: "Reframe the situation and search for a third option.",
        },
        impact: { logic: 2, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: {
          ar: "أقرأ البعد العاطفي وأهدّئ التصعيد بعناية.",
          en: "Read emotional subtext and de-escalate with care.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "أواجهه مباشرة وبحسم قبل أن يتفاقم.",
          en: "Address it directly and decisively before it grows.",
        },
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 7,
    prompt: {
      ar: "بيئة العمل المثالية لك هي:",
      en: "Your ideal work environment is:",
    },
    options: [
      {
        text: {
          ar: "منظمة، مركزة، ومليئة بأهداف قابلة للقياس.",
          en: "Structured, focused, and rich with measurable goals.",
        },
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 1 },
      },
      {
        text: {
          ar: "مرنة، خيالية، ومفتوحة للاستكشاف الجريء.",
          en: "Flexible, imaginative, and open to wild exploration.",
        },
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: {
          ar: "داعمة، تعاونية، وتضع الإنسان في المركز.",
          en: "Supportive, collaborative, and people-centered.",
        },
        impact: { logic: 1, creativity: 2, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "سريعة الإيقاع، عالية المخاطرة، ومليئة بالرهانات الجريئة.",
          en: "Fast-paced, high-stakes, and full of bold bets.",
        },
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 8,
    prompt: {
      ar: "قرار صعب يجب اتخاذه بسرعة. ما أولويتك؟",
      en: "A difficult decision must be made quickly. You prioritize:",
    },
    options: [
      {
        text: {
          ar: "القيمة المتوقعة وتأثيرات المدى الطويل.",
          en: "Expected value and long-term consequence modeling.",
        },
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 2 },
      },
      {
        text: {
          ar: "فرصة مبتكرة قد لا يلاحظها الآخرون.",
          en: "Novel upside that others might overlook.",
        },
        impact: { logic: 2, creativity: 5, empathy: 1, risk: 3 },
      },
      {
        text: {
          ar: "الأثر الإنساني والحفاظ على الثقة أولًا.",
          en: "Human impact and preserving trust first.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "الزخم: تحرك الآن واضبط لاحقًا حسب النتائج.",
          en: "Momentum: act now, tune later with real outcomes.",
        },
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 9,
    prompt: {
      ar: "أي مديح تشعر أنه يصفك بدقة أكبر؟",
      en: "Which compliment feels most accurate to you?",
    },
    options: [
      {
        text: {
          ar: "تفكر بدقة حادة.",
          en: "You think with sharp precision.",
        },
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 1 },
      },
      {
        text: {
          ar: "ترى الإمكانات قبل أي شخص آخر.",
          en: "You see possibilities before anyone else.",
        },
        impact: { logic: 1, creativity: 5, empathy: 1, risk: 3 },
      },
      {
        text: {
          ar: "تجعل الناس يشعرون بأنهم مفهومون بصدق.",
          en: "You make people feel truly understood.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "أنت جريء عندما يحين الوقت الحاسم.",
          en: "You are fearless when it matters.",
        },
        impact: { logic: 1, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 10,
    prompt: {
      ar: "عند مواجهة الغموض، ما السلوك الأقرب لك؟",
      en: "When facing ambiguity, you are most likely to:",
    },
    options: [
      {
        text: {
          ar: "أخفض عدم اليقين عبر النماذج والبيانات والافتراضات.",
          en: "Reduce uncertainty with models, data, and assumptions.",
        },
        impact: { logic: 5, creativity: 1, empathy: 1, risk: 2 },
      },
      {
        text: {
          ar: "أستخدم الخيال لتصميم عدة مستقبلات مقنعة.",
          en: "Use imagination to design several compelling futures.",
        },
        impact: { logic: 2, creativity: 5, empathy: 1, risk: 3 },
      },
      {
        text: {
          ar: "أتحدث مع المتأثرين وأعاير القرار مع الواقع المعيش.",
          en: "Talk to people impacted and calibrate to lived reality.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "أتعامل مع عدم اليقين كفرصة وأتحرك رغم ذلك.",
          en: "Treat uncertainty as opportunity and move anyway.",
        },
        impact: { logic: 1, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 11,
    prompt: {
      ar: "ترتفع طاقتك أكثر عندما تكون:",
      en: "Your energy spikes most when you are:",
    },
    options: [
      {
        text: {
          ar: "تحل لغزًا معقدًا لم يستطع غيرك تفكيكه.",
          en: "Solving a complex puzzle no one else has cracked.",
        },
        impact: { logic: 5, creativity: 2, empathy: 1, risk: 2 },
      },
      {
        text: {
          ar: "تبتكر مفاهيم أصلية وتعيد تشكيل سرديات المستقبل.",
          en: "Inventing original concepts and shaping future narratives.",
        },
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: {
          ar: "تساعد شخصًا على التحول عبر حوار صادق.",
          en: "Helping someone transform through honest conversation.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "تقفز إلى منطقة مجهولة فيها رهانات حقيقية.",
          en: "Leaping into uncertain territory with real stakes.",
        },
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
  {
    id: 12,
    prompt: {
      ar: "في أفضل حالاتك، أسلوبك في اتخاذ القرار يبدو كأنه:",
      en: "At your best, your decision style feels like:",
    },
    options: [
      {
        text: {
          ar: "تسلسل محسوب بمنطق داخلي أنيق.",
          en: "A calculated sequence with elegant internal logic.",
        },
        impact: { logic: 5, creativity: 2, empathy: 1, risk: 2 },
      },
      {
        text: {
          ar: "شرارة تتحول إلى اتجاه اختراقي.",
          en: "A spark that turns into a breakthrough direction.",
        },
        impact: { logic: 1, creativity: 5, empathy: 2, risk: 3 },
      },
      {
        text: {
          ar: "قراءة حدسية للناس وما يحتاجونه فعلًا.",
          en: "An intuitive read of people and what they need most.",
        },
        impact: { logic: 1, creativity: 1, empathy: 5, risk: 1 },
      },
      {
        text: {
          ar: "التزام جريء يصنع زخمًا للجميع.",
          en: "A bold commitment that creates momentum for everyone.",
        },
        impact: { logic: 2, creativity: 2, empathy: 1, risk: 5 },
      },
    ],
  },
];