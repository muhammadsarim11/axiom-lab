// Single source of truth for brand, contact details and page content.
// Anything marked TODO(client) is a placeholder to be replaced with real details
// (either here or through the NEXT_PUBLIC_* variables listed in .env.example).

const env = (key, fallback = "") => process.env[key] || fallback;

export const site = {
  name: "Axiom Tutoring",
  shortName: "Axiom",
  descriptor: "Maths · Physics · Chemistry",
  tagline:
    "From Confusion to Confidence — Personalised Maths, Physics & Chemistry Tuition.",
  description:
    "Personalised Maths, Physics and Chemistry tutoring for Years 7–12 by an experienced Mechanical Engineer. Based in Perth, teaching online across Australia and internationally.",
  // TODO(client): set NEXT_PUBLIC_SITE_URL once the domain is purchased.
  url: env("NEXT_PUBLIC_SITE_URL", "https://www.example.com").replace(/\/$/, ""),
  locale: "en-AU",
  location: { city: "Perth", region: "Western Australia", country: "Australia" },
};

// Visitors whose device asks for reduced motion get a calm site (no animations) plus a one-click
// "Turn on animations" notice. Set to false to run the full animated site for everyone.
export const respectReducedMotion = true;

export const tutor = {
  name: "Syed Mannan Ali",
  role: "Mechanical Engineer & STEM Tutor",
  // Drop a portrait at /public/images/tutor.jpg and set this to "/images/tutor.jpg".
  photo: null,
  // TODO(client): add real qualifications / experience (rendered on the About page).
  credentials: [
    {
      label: "Professional background",
      title: "Mechanical Engineer",
      text: "Years of applying Maths and Physics to real engineering problems, brought into every lesson.",
    },
    {
      label: "Tutoring focus",
      title: "Years 7–12 STEM",
      text: "Personalised Maths, Physics and Chemistry support built around each student's goals.",
    },
    {
      label: "Delivery",
      title: "Perth & online worldwide",
      text: "In-person in Perth by arrangement, and live online lessons for students anywhere.",
    },
  ],
};

export const contact = {
  // TODO(client): real phone / WhatsApp / email.
  phoneDisplay: env("NEXT_PUBLIC_PHONE_DISPLAY", "+61 4XX XXX XXX"),
  whatsapp: env("NEXT_PUBLIC_WHATSAPP_NUMBER").replace(/\D/g, ""),
  email: env("NEXT_PUBLIC_CONTACT_EMAIL", "hello@example.com"),
  hours: "Weekday evenings & weekends by arrangement",
};

export const socials = [
  { id: "instagram", label: "Instagram", href: env("NEXT_PUBLIC_INSTAGRAM_URL", "https://www.instagram.com/") },
  { id: "linkedin", label: "LinkedIn", href: env("NEXT_PUBLIC_LINKEDIN_URL", "https://www.linkedin.com/") },
  { id: "facebook", label: "Facebook", href: env("NEXT_PUBLIC_FACEBOOK_URL", "https://www.facebook.com/") },
  { id: "youtube", label: "YouTube", href: env("NEXT_PUBLIC_YOUTUBE_URL", "https://www.youtube.com/") },
];

/** wa.me link with an optional pre-filled message. Falls back to the booking form until a number is set. */
export function waLink(message = "") {
  if (!contact.whatsapp) return "/#book";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${contact.whatsapp}${text}`;
}
export const hasWhatsApp = () => Boolean(contact.whatsapp);
export const telLink = () =>
  contact.whatsapp ? `tel:+${contact.whatsapp}` : null;

export const navLinks = [
  { href: "/#subjects", label: "Subjects" },
  { href: "/#exam-prep", label: "Exam prep" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#resources", label: "Resources" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about", label: "About tutor" },
];

export const states = [
  "Western Australia",
  "New South Wales",
  "Victoria",
  "Queensland",
  "South Australia",
  "Tasmania",
  "Australian Capital Territory",
  "Northern Territory",
  "Outside Australia (international)",
];

export const years = ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"];

export const formats = ["Online", "In person (Perth)"];

export const subjects = [
  {
    id: "maths",
    name: "Mathematics",
    kicker: "Think in patterns",
    blurb:
      "Build fluency, number sense and a flexible approach to problem-solving, from foundations through to senior calculus.",
    levels: [
      { band: "Years 7–8", topics: ["Fractions, ratios & percentages", "Algebra foundations", "Geometry & measurement", "Probability & data"] },
      { band: "Years 9–10", topics: ["Linear & quadratic equations", "Trigonometry", "Indices & surds", "Statistics & graphs"] },
      { band: "Years 11–12", topics: ["Functions & graphs", "Differentiation & integration", "Exponentials & logarithms", "Probability, vectors & more"] },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    kicker: "See the big picture",
    blurb:
      "Turn abstract principles into ideas you can picture, reason with and apply, with an engineer's eye for how things really work.",
    levels: [
      { band: "Years 7–8", topics: ["Forces & motion", "Energy & its transfer", "Light & sound", "Simple circuits"] },
      { band: "Years 9–10", topics: ["Newton's laws", "Energy conservation", "Waves", "Electricity & magnetism"] },
      { band: "Years 11–12", topics: ["Kinematics & dynamics", "Momentum & energy", "Gravity & circular motion", "Fields, waves & modern physics"] },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    kicker: "Understand the why",
    blurb:
      "Make the invisible understandable, from atomic structure and bonding to reactions, equilibrium and the mole.",
    levels: [
      { band: "Years 7–8", topics: ["States of matter", "Atoms & the periodic table", "Mixtures & separation", "Chemical vs physical change"] },
      { band: "Years 9–10", topics: ["Atomic structure & bonding", "Balancing equations", "Acids & bases", "Reaction rates"] },
      { band: "Years 11–12", topics: ["The mole & stoichiometry", "Bonding & structure", "Equilibrium & redox", "Organic chemistry"] },
    ],
  },
];

export const pillars = [
  {
    n: "01",
    title: "Conceptual understanding",
    text: "Every formula has a reason. We start with the idea, so the equations stop feeling like magic and start feeling obvious.",
  },
  {
    n: "02",
    title: "Problem-solving skills",
    text: "A repeatable method for unfamiliar questions: read, plan, solve, check. Students learn how to think, not just what to memorise.",
  },
  {
    n: "03",
    title: "Real-world application",
    text: "From bridges to batteries, engineering examples show why the content matters, and make it far easier to remember.",
  },
];

export const services = [
  { title: "Weekly one-to-one lessons", text: "Consistent, personalised sessions that build confidence week after week." },
  { title: "Topic & assignment support", text: "Targeted help for the unit your child is stuck on right now." },
  { title: "Exam & test preparation", text: "Structured revision, practice questions and exam technique." },
  { title: "Online or in person", text: "Live online lessons Australia-wide and worldwide, or face to face in Perth." },
];

export const examSteps = [
  { n: "01", title: "Diagnose", text: "A quick diagnostic finds exactly which topics and question types are costing marks." },
  { n: "02", title: "Plan", text: "A topic-by-topic revision timetable that fits around school, sport and life." },
  { n: "03", title: "Practise", text: "Exam-style questions with clear worked solutions, building speed and accuracy." },
  { n: "04", title: "Perform", text: "Exam technique, time management and calm strategies for the day itself." },
];

export const examFor = [
  "Class tests & assessments",
  "Semester exams",
  "Year 10 → 11 course transition",
  "Senior ATAR / state exams",
];

/** price: null renders "Enquire for rates". TODO(client): confirm packages and set prices. */
export const packages = [
  {
    id: "consult",
    name: "Free Consultation",
    price: "Free",
    note: "No obligation",
    summary: "A relaxed first conversation to understand the student and recommend a plan.",
    features: [
      "Discuss goals, year level and challenges",
      "Find gaps and the best learning style",
      "Clear recommendation, no pressure",
    ],
    cta: "Book a free consultation",
    featured: false,
  },
  {
    id: "ongoing",
    name: "Ongoing Tuition",
    price: null,
    note: "Most popular",
    summary: "Regular one-to-one lessons that build real understanding and steady progress.",
    features: [
      "Weekly or fortnightly personalised lessons",
      "Matched to the school syllabus and pace",
      "Worked examples and practice sets",
      "Online or in person (Perth)",
    ],
    cta: "Ask about weekly lessons",
    featured: true,
  },
  {
    id: "exam",
    name: "Exam Intensive",
    price: null,
    note: "Short-term, focused",
    summary: "A concentrated block of sessions aimed squarely at an upcoming test or exam.",
    features: [
      "Diagnostic of weak topics",
      "Targeted revision plan",
      "Exam-style practice with walkthroughs",
      "Exam technique & time management",
    ],
    cta: "Plan an exam block",
    featured: false,
  },
];

export const howItWorks = [
  { n: "1", title: "Free consultation", text: "Tell us about the student and their goals." },
  { n: "2", title: "Personalised plan", text: "A clear, practical recommendation." },
  { n: "3", title: "Lessons begin", text: "One-to-one, online or in Perth." },
  { n: "4", title: "Review & adjust", text: "Keep what works, change what doesn't." },
];

export const resources = [
  {
    id: "physics-routine",
    tag: "Physics",
    title: "A 5-step routine for any physics problem",
    intro: "Most lost marks come from skipping steps, not from missing knowledge. Use this every time.",
    steps: [
      ["Given", "List every known value with its unit. Draw a quick diagram."],
      ["Unknown", "Write down exactly what the question asks you to find."],
      ["Equation", "Choose the formula that links the knowns to the unknown."],
      ["Substitute", "Convert units first, then substitute carefully, keeping units in view."],
      ["Sense-check", "Is the size sensible? Is the direction right? Are the units correct?"],
    ],
    formulas: ["v = u + at", "s = ut + (1/2)at²", "v² = u² + 2as", "F = ma"],
  },
  {
    id: "maths-questions",
    tag: "Maths",
    title: "Three questions to ask before you calculate",
    intro: "A thirty-second pause at the start prevents ten minutes of wrong working.",
    steps: [
      ["What is being asked?", "Underline the command word and the quantity to find."],
      ["What do I already know?", "Write the information in your own words or as a sketch."],
      ["Which tool fits?", "Name the technique before touching the calculator."],
    ],
    formulas: ["Estimate first", "Check by substitution", "Does the answer make sense?"],
  },
  {
    id: "mole-map",
    tag: "Chemistry",
    title: "The mole map: your chemistry calculation hub",
    intro: "Nearly every Year 11–12 calculation passes through moles. Learn the map once, use it everywhere.",
    steps: [
      ["Mass → moles", "n = m ÷ M (mass in grams ÷ molar mass)."],
      ["Particles ↔ moles", "N = n × 6.022 × 10²³ (Avogadro's constant)."],
      ["Gas volume ↔ moles", "V = n × Vm. 24.8 L/mol at 25 °C and 100 kPa."],
      ["Solutions", "c = n ÷ V (mol/L), with volume in litres."],
    ],
    formulas: ["n = m / M", "N = n × Nₐ", "V = n × Vm", "c = n / V"],
  },
];

export const testimonials = [
  // TODO(client): add genuine reviews: { quote, name, detail }.
  // Example: { quote: "…", name: "Parent of Year 10 student", detail: "Perth, WA" }
];

export const faqs = [
  {
    q: "Which year levels and subjects do you teach?",
    a: "Mathematics, Physics and Chemistry for students in Years 7 to 12, from building solid foundations right through to senior exam preparation.",
  },
  {
    q: "Do you only tutor students in Perth?",
    a: "No. Lessons run live online for students anywhere in Australia and overseas, and in-person tutoring is available in Perth by arrangement.",
  },
  {
    q: "How do online lessons work?",
    a: "We meet on a video call with a shared digital whiteboard, so working is written out step by step just like a classroom. All you need is a laptop or tablet and a stable internet connection.",
  },
  {
    q: "What happens in the free consultation?",
    a: "We talk through the student's year level, subjects, current challenges and goals, then suggest a practical plan. There is no obligation to continue.",
  },
  {
    q: "How much do lessons cost?",
    a: "Fees depend on year level, subject and lesson format. Current rates are shared openly during your free consultation so there are no surprises.",
  },
  {
    q: "Can you help with a specific exam or assessment?",
    a: "Yes. You can book a short exam-preparation block or add focused revision sessions to ongoing weekly lessons.",
  },
  {
    q: "Do lessons follow the school curriculum?",
    a: "Yes. Sessions are matched to the Australian Curriculum and your state or territory's courses, and to what the student is working on at school right now.",
  },
  {
    q: "Can international students enrol, and what about time zones?",
    a: "Absolutely. Mention your location in the enquiry form and we will find lesson times that work across time zones.",
  },
  {
    q: "What makes an engineer a different kind of tutor?",
    a: "Engineers use Maths, Physics and Chemistry to solve real problems every day. That perspective turns abstract topics into things students can picture, apply and remember.",
  },
];
