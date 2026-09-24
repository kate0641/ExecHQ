/**
 * Mock content for Sprint 1 onboarding.
 *
 * Every "generated" thing in the onboarding concepts comes from here, keyed off
 * what the user typed or chose. Nothing in this prototype talks to a network,
 * so the interpretation, the plan recommendation and the artifact are all
 * lookups dressed in a simulated delay — the thinking state is real UI over
 * canned data.
 *
 * Shared by all three concepts. Presentation lives in the concepts; this file
 * holds content and the lookups that pick between it.
 */

/* -----------------------------------------------------------------------------
   ENTRY
   -------------------------------------------------------------------------- */

/** The welcome at the top of the account screen. What ExecHQ is, in the
 *  words of the pilot scope; the serif line answers the brand questionnaire's
 *  core audience — someone privately wondering what comes next, with nowhere
 *  to work on it. */
export const WELCOME = {
  quote: "Somewhere to work on what comes next.",
  heading: "Welcome to ExecHQ",
  lede: "A private career advisor that takes you from “I’d like to be” to “I’m going to be”. It doesn’t just show you the way. It works for you to get you there.",
  cta: "Get started",
  inviteShow: "I have an invite code",
  inviteHide: "I do not have a code",
} as const;

/** Codes an enterprise user might arrive with. The sponsoring organisation is
 *  deliberately not recorded: no employer name appears anywhere in the UI, and
 *  storing one here would invite a screen that shows it. */
export const INVITE_CODES = ["EXEC-4821", "EXEC-7390", "EXEC-1155"] as const;

/** Any code is accepted, so reviewers can type anything to move on. The
 *  unrecognised-code notice is still a designed state: see it in the
 *  catalogue, or switch this back to checking against INVITE_CODES. */
export function isValidInviteCode(code: string): boolean {
  return code.trim().length > 0;
}

export type EmailVerdict = "ok" | "empty" | "malformed";

/**
 * The email check.
 *
 * Shape only. The personal-domain rule was removed by decision on 2026-09-22:
 * any address is accepted, because the account is the user's and they can change
 * the address whenever they like. That deliberately drops the rejected-corporate
 * -email state the Sprint 1 brief lists as required — a scope change on the
 * record, not an omission.
 */
export function checkEmail(value: string): EmailVerdict {
  // Prototype: any text moves on, so reviewers can type anything. Only an
  // empty field is stopped. The "malformed" state is kept as a designed state
  // for when a real check returns.
  return value.trim() ? "ok" : "empty";
}

/* -----------------------------------------------------------------------------
   PRIVACY
   -------------------------------------------------------------------------- */

export const PRIVACY = {
  heading: "Before we go further",
  statements: [
    "Nothing you do here is visible to your employer, your network, or another user.",
    "This account is yours. It stays yours regardless of where you work.",
  ],
  action: "Understood",
} as const;

/** Concept 1's privacy screen: the same promise as PRIVACY, as short as it
 *  can be said. */
export const PRIVACY_SPLASH = {
  titleLead: "Private",
  titleRest: "by design",
  lines: ["We respect your data.", "It’s your eyes only."],
  action: "Good to know",
} as const;

/* -----------------------------------------------------------------------------
   DIRECTION
   -------------------------------------------------------------------------- */

export interface PromptedDirection {
  id: string;
  /** What the user sees on the selectable prompt. */
  label: string;
  /** What lands in the open field when it is selected. Still editable. */
  text: string;
  /** One line saying what this direction means, for a layout that spells each
   *  one out rather than listing them as labels. */
  blurb: string;
  /** The need this reading points at. Drives the plan recommendation. */
  need: DirectionNeed;
}

/** The five readings the system can take of a direction, per the PRD. */
export type DirectionNeed =
  | "positioning"
  | "visibility"
  | "influence"
  | "preparation"
  | "exploration";

/**
 * Prompted directions, mixing title-style and direction-style answers so that
 * neither reads as the expected one. The last is the unsure path: it is a real
 * answer that reaches a real plan, not a way of declining to answer.
 */
export const PROMPTED_DIRECTIONS: PromptedDirection[] = [
  {
    id: "bigger-org",
    label: "Lead a bigger organisation",
    text: "I want to lead a larger organisation, with a broader remit than I have now.",
    blurb: "A larger remit than the one you have now.",
    need: "positioning",
  },
  {
    id: "seen-differently",
    label: "Be seen differently",
    text: "I want to be read as an executive rather than a strong operator.",
    blurb: "Read as an executive rather than a strong operator.",
    need: "visibility",
  },
  {
    id: "weigh-more",
    label: "Carry more weight where I am",
    text: "I want more influence in the organisation I am already in.",
    blurb: "More say where you already are, without moving to get it.",
    need: "influence",
  },
  {
    id: "moment-ahead",
    label: "Something specific is coming up",
    text: "I have a promotion conversation, review or board presentation ahead of me.",
    blurb: "A conversation, review or presentation with a date on it.",
    need: "preparation",
  },
  {
    id: "leaving",
    label: "Get out of where I am",
    text: "I want out of the industry I am in, but I have not worked out what replaces it.",
    blurb: "Out of the industry, before you have named what replaces it.",
    need: "exploration",
  },
  {
    id: "unsure",
    label: "I do not know yet",
    text: "I have hit a ceiling and I cannot name the next role.",
    blurb: "A ceiling you can feel but cannot put a title to.",
    need: "exploration",
  },
];

export const DIRECTION = {
  prompt: "What would you like to move toward?",
  hint: 'A role, a scope, an aspiration or a challenge. "CMO within three years" works here as well as "I want out of agency life".',
  promptedLabel: "Or start from one of these",
  placeholder: "",
  examplesLabel: "Answers that work here",
  /** Shown as static guidance, mixing both answer shapes on purpose. */
  examples: [
    "CMO within three years",
    "I want out of agency life",
    "More influence where I already am",
  ],
} as const;

/** Concept 1's direction screen. Say it or type it: the prompts are short,
 *  concrete goals rather than categories, and work for any function. */
export const DIRECTION_C1 = {
  prompt: "Where do you want to go next?",
  hint: "A role, a timeline, or just a feeling.",
  promptedLabel: "Or start with",
} as const;

/** Tapping one puts its text in the field, still editable — "Promotion in the
 *  next year" can become "Promotion to VP in the next year". */
export const DIRECTION_PROMPTS_C1: PromptedDirection[] = [
  // One per plan, so every plan is reachable from a prompt and none is
  // favoured. The field still takes any answer.
  { id: "c-suite", label: "C-suite in 3 years", text: "C-suite in 3 years", blurb: "", need: "positioning" },
  { id: "leadership", label: "Take on more of a leadership role", text: "Take on more of a leadership role", blurb: "", need: "influence" },
  { id: "executive", label: "Be seen as an executive", text: "Be seen as an executive", blurb: "", need: "visibility" },
  { id: "board", label: "Nail an upcoming board presentation", text: "Nail an upcoming board presentation", blurb: "", need: "preparation" },
  { id: "next-move", label: "Find my next move", text: "Find my next move", blurb: "", need: "exploration" },
];

/** What the simulated mic "hears". The prototype has no speech input, so the
 *  mic types one of these in word by word: the whole answer into an empty
 *  field, or the addition after a prompt or something already typed. The full
 *  answer is the pilot scope's own example. */
export const VOICE_SAMPLE = {
  full: "I want to move from running campaigns to leading a broader marketing organisation.",
  addition: "ideally leading a broader marketing organisation.",
} as const;

/** What the plan was built from, as short tags: the direction, then each
 *  refinement answer. A long typed answer is cut at a word boundary. */
export function builtFrom(direction: string, answers: Record<string, string>): string[] {
  const text = direction.trim();
  // A prompt is shown whole; only a long typed or spoken answer is cut short.
  const isPrompt = DIRECTION_PROMPTS_C1.some((prompt) => prompt.text === text);
  const directionTag =
    isPrompt || text.length <= 40
      ? text
      : `${text.slice(0, 40).replace(/\s+\S*$/, "")}\u2026`;
  const labels = refinementFor(direction)
    .map((question) => question.options.find((o) => o.value === answers[question.id])?.label)
    .filter((label): label is string => Boolean(label));
  return [directionTag, ...labels].filter(Boolean);
}

/** The goal the plan works toward, for "The next 12 weeks, toward …". */
const PROMPT_TOWARD: Record<string, string> = {
  "C-suite in 3 years": "the C-suite in 3 years",
  "Take on more of a leadership role": "a bigger leadership role where you are",
  "Be seen as an executive": "being seen as an executive",
  "Nail an upcoming board presentation": "your board presentation",
  "Find my next move": "your next move",
};

export function towardFor(direction: string): string {
  return PROMPT_TOWARD[direction.trim()] ?? "your goal";
}

/** Concept 1's plan screen. */
export const PLAN_C1 = {
  eyebrow: "Your starting point",
  builtFrom: "Built from what you told us",
  grows: "It sharpens as you go. Every draft you make and every conversation you log tells us what to do next.",
  thisWeek: "This week",
  why: "Why now:",
  now: "Now",
  doneWhen: "Done when:",
  others: "Not quite right? See other plans",
  hideOthers: "Hide other plans",
  confirm: "Use this plan",
} as const;

/** Concept 1's interpretation screen. */
export const INTERPRETATION_C1 = {
  heading: "Here\u2019s what we heard",
  hint: "Change anything that\u2019s off.",
  from: "ExecHQ",
  role: "Your advisor",
  /** When every question was skipped, said inside the note. */
  assumed: "You skipped the questions, so this is based on your goal alone. You can make it more specific later.",
  bridge: "Next, we\u2019ll build a plan around this.",
  edit: "Change it",
  confirm: "That\u2019s right",
} as const;

/* -----------------------------------------------------------------------------
   INTERPRETATION
   -------------------------------------------------------------------------- */

/** Keyword tests, most specific first. A crude stand-in for interpretation, but
 *  it does key off what the user actually typed, which is the point. */
const NEED_TESTS: { need: DirectionNeed; patterns: RegExp[] }[] = [
  {
    need: "preparation",
    patterns: [/promotion conversation/i, /review/i, /board/i, /negotiat/i, /interview/i, /coming up/i],
  },
  {
    need: "exploration",
    patterns: [/do not know/i, /don't know/i, /cannot name/i, /can't name/i, /ceiling/i, /out of/i, /unsure/i, /explore/i, /next move/i, /what'?s next/i],
  },
  {
    need: "visibility",
    patterns: [/seen/i, /visib/i, /read as/i, /profile/i, /known for/i, /nobody sees/i],
  },
  {
    need: "influence",
    patterns: [/influence/i, /weight/i, /already in/i, /where i am/i, /internal/i, /take on more/i],
  },
  {
    need: "positioning",
    patterns: [/lead/i, /larger/i, /bigger/i, /scope/i, /remit/i, /promot/i, /c-suite/i, /cmo|cto|cfo|coo|chief|vp|director/i],
  },
];

export function interpretNeed(direction: string): DirectionNeed {
  for (const test of NEED_TESTS) {
    if (test.patterns.some((pattern) => pattern.test(direction))) return test.need;
  }
  return "positioning";
}

/** The one-sentence read-back, per need. Written to be shown back and edited. */
const INTERPRETATIONS: Record<DirectionNeed, string> = {
  positioning:
    "You want to lead a larger organisation, and you want the step up to be a scope change rather than a title change.",
  visibility:
    "You want the people who make decisions about you to read you as an executive, not as a strong operator.",
  influence:
    "You want more weight in the organisation you are already in, without moving to get it.",
  preparation:
    "You have a specific conversation coming up, and you want to walk into it prepared rather than hopeful.",
  exploration:
    "You know the current path has stopped going where you want, and you have not yet named what replaces it.",
};

export function interpretDirection(direction: string): string {
  return INTERPRETATIONS[interpretNeed(direction)];
}

/** Used when refinement is skipped: state the assumption, promise refinement. */
export function assumptionFor(direction: string): { statement: string; promise: string } {
  const need = interpretNeed(direction);
  const statements: Record<DirectionNeed, string> = {
    positioning:
      "Based on your goal of leading a larger organisation, we have started with a concise leadership narrative.",
    visibility:
      "Based on wanting to be read differently, we have started with how you describe yourself.",
    influence:
      "Based on wanting more weight where you are, we have started with how your work is framed internally.",
    preparation:
      "Based on the conversation you have coming up, we have started with the narrative you will need in it.",
    exploration:
      "Based on not having named the next role yet, we have started with what carries over regardless of where you go.",
  };
  return {
    statement: statements[need],
    promise: "We can make this more specific later.",
  };
}

/* -----------------------------------------------------------------------------
   REFINEMENT
   -------------------------------------------------------------------------- */

export interface RefinementOption {
  value: string;
  label: string;
}

export interface RefinementQuestionSpec {
  id: string;
  question: string;
  hint: string;
  options: RefinementOption[];
}

/** Three slots: horizon, audience, constraint. Every one is skippable, and the
 *  last option in each is a real answer rather than a way of saying nothing. */
export const REFINEMENT_QUESTIONS: RefinementQuestionSpec[] = [
  {
    id: "horizon",
    question: "Roughly when?",
    hint: "A rough answer is enough. It changes what we put first, not whether we start.",
    options: [
      { value: "now", label: "Already underway" },
      { value: "year", label: "Within a year" },
      { value: "two-three", label: "Two to three years" },
      { value: "unsure", label: "No fixed timeline" },
    ],
  },
  {
    id: "audience",
    question: "Who most needs to see this differently?",
    hint: "The people whose reading of you would actually change things.",
    options: [
      { value: "internal", label: "Leaders in my company" },
      { value: "external", label: "People outside it" },
      { value: "both", label: "Both" },
      { value: "unsure", label: "Still working that out" },
    ],
  },
  {
    id: "constraint",
    question: "What is most in the way right now?",
    hint: "Naming the constraint changes what we recommend first.",
    options: [
      { value: "visibility", label: "Nobody sees the work" },
      { value: "scope", label: "The remit is too narrow" },
      { value: "clarity", label: "I cannot articulate it" },
      { value: "time", label: "No time to work on it" },
    ],
  },
];

/* Concept 1's refinement: three questions per plan, chosen from the plan the
   direction points at, rather than one set for everyone. A question is left
   out when the direction already answers it, so the count is never promised
   to the user. The answers are said back on the interpretation screen. */

export interface HeardOption extends RefinementOption {
  /** How the interpretation says this answer back: a full sentence in the
   *  second person that says what the answer means, not only what it was. */
  heard: string;
}

export interface TailoredQuestion extends RefinementQuestionSpec {
  options: HeardOption[];
  /** Leave the question out when the direction already answers it. */
  skipIf?: RegExp[];
}

/** Under every tailored question: why it is being asked. */
export const REFINEMENT_C1 = {
  instruction: "A few quick taps so we can build a plan that fits you. Skip any you like.",
  skip: "Skip this question",
} as const;

/** Timing already stated: "in 3 years", "next year", "this month"… */
const SAYS_WHEN = [/\b(\d+|one|two|three|four|five|six|ten)\s*(year|yr|month|week)s?\b/i, /\b(next|this) (year|month|week|quarter)\b/i, /\bwithin a year\b/i];
/** The moment already named. */
const SAYS_WHAT_MOMENT = [/board/i, /review/i, /promotion conversation/i, /negotiat/i, /interview/i, /presentation/i];

const opts = (...labels: string[]): RefinementOption[] =>
  labels.map((label) => ({ value: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label }));

/** Pairs each option, in order, with how the read-back says it. */
const withHeard =
  (...phrases: string[]) =>
  (option: RefinementOption, index: number): HeardOption => ({
    ...option,
    heard: phrases[index],
  });

export const REFINEMENT_BY_NEED: Record<DirectionNeed, TailoredQuestion[]> = {
  positioning: [
    {
      id: "scope-kind",
      question: "What kind of step up?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Bigger team", "Broader remit", "A seat at the top table", "A new title").map(withHeard("A bigger team matters most to you: more people, and the weight that comes with leading them.", "A broader remit matters most to you: owning more of the business, not just more of the same work.", "A seat at the top table matters most to you: being in the room where the big calls get made.", "The title matters most to you: being named for the role, not just doing the work.")),
    },
    {
      id: "scope-when",
      question: "When do you want to get there?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Within a year", "1\u20132 years", "3+ years", "No fixed timeline").map(withHeard("You want it within a year, so this is a near-term move, not a long campaign.", "You\u2019re giving it one to two years, which is enough time to build the case properly.", "You\u2019re playing a longer game of three years or more, so there\u2019s room to build step by step.", "You haven\u2019t set a timeline, so the pace can fit around your job.")),
      skipIf: SAYS_WHEN,
    },
    {
      id: "scope-block",
      question: "What\u2019s in the way?",
      hint: REFINEMENT_C1.instruction,
      options: opts("No clear path up", "Nobody sees my work", "I can\u2019t make my case", "Wrong company for it").map(withHeard("Right now there\u2019s no clear path up, so part of the job is finding one, or making one.", "Right now nobody sees your work. The results are there; the people deciding just aren\u2019t looking at them.", "Right now you can\u2019t quite make your case. You know you\u2019re ready; it\u2019s putting it into words that\u2019s hard.", "You suspect you\u2019re in the wrong company for it, so the next step may not be where you are now.")),
    },
  ],
  influence: [
    {
      id: "influence-where",
      question: "Where do you want more say?",
      hint: REFINEMENT_C1.instruction,
      options: opts("My team\u2019s direction", "Company strategy", "Budget and headcount", "Across other teams").map(withHeard("You want more say in your team\u2019s direction: setting it, not just delivering it.", "You want more say in company strategy: a voice in where the business goes, not only in how your part gets there.", "You want more say over budget and headcount, which is where influence becomes real.", "You want more say across other teams, beyond the part of the business you run.")),
    },
    {
      id: "influence-who",
      question: "Who do you most need on side?",
      hint: REFINEMENT_C1.instruction,
      options: opts("My boss", "My boss\u2019s peers", "The exec team", "My own team").map(withHeard("Your boss is who you most need on side, so that relationship comes first.", "Your boss\u2019s peers are who you most need on side: the people whose view of you travels upward.", "The exec team is who you most need on side: the people who decide what you get to lead.", "Your own team is who you most need on side, because influence starts with the people who already follow you.")),
    },
    {
      id: "influence-block",
      question: "What\u2019s holding you back?",
      hint: REFINEMENT_C1.instruction,
      options: opts("I\u2019m not in the room", "I\u2019m in the room but not heard", "Too junior on paper", "Politics").map(withHeard("You\u2019re not in the room yet. The decisions that matter to you are made without you.", "You\u2019re in the room but not heard. You\u2019re there, but your view doesn\u2019t carry.", "You\u2019re too junior on paper. Your title undersells what you actually do.", "Politics is getting in the way. Being right isn\u2019t enough; you need people behind you.")),
    },
  ],
  visibility: [
    {
      id: "presence-who",
      question: "Who needs to see you differently?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Leaders in my company", "My industry", "Recruiters and boards", "All of them").map(withHeard("Leaders in your company need to see you differently: as someone they\u2019d promote, not just rely on.", "Your industry needs to see you differently: known beyond your own company.", "Recruiters and boards need to see you differently: as someone on their shortlist.", "Everyone who matters needs to see you differently, inside your company and out.")),
    },
    {
      id: "presence-now",
      question: "How do they see you now?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Strong operator", "Specialist", "Hard worker, low profile", "Not sure").map(withHeard("Today they see a strong operator: someone who delivers, not yet someone who leads.", "Today they see a specialist: expert in one thing, not yet seen as broad enough to lead.", "Today they see a hard worker with a low profile. The work is good; it just isn\u2019t seen.", "You\u2019re not sure how they see you today, so finding out is part of the work.")),
    },
    {
      id: "presence-where",
      question: "Where do you show up today?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Meetings only", "LinkedIn now and then", "Industry events", "Nowhere yet").map(withHeard("Today you only show up in meetings, so your reputation depends on who\u2019s in the room.", "You show up on LinkedIn now and then, which is a start, but not yet a point of view.", "You show up at industry events, so there\u2019s already a stage to build on.", "You don\u2019t show up anywhere yet, so there\u2019s a clean slate to build on.")),
    },
  ],
  preparation: [
    {
      id: "moment-what",
      question: "What\u2019s coming up?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Promotion conversation", "Performance review", "Board or exec presentation", "Negotiation or offer").map(withHeard("You have a promotion conversation coming up, and you want to walk in with a case, not a hope.", "You have a performance review coming up, and you want it to set up what\u2019s next, not just look back.", "You have a board or exec presentation coming up, the kind of moment people remember.", "You have a negotiation or offer coming up, where what you say in the moment matters.")),
      skipIf: SAYS_WHAT_MOMENT,
    },
    {
      id: "moment-when",
      question: "When is it?",
      hint: REFINEMENT_C1.instruction,
      options: opts("This week", "This month", "Next few months", "Not scheduled yet").map(withHeard("It\u2019s this week, so there\u2019s only time for the essentials.", "It\u2019s this month, which is enough time to prepare properly if you start now.", "It\u2019s in the next few months, so there\u2019s time to prepare well rather than cram.", "It isn\u2019t scheduled yet, so you can be ready before the date is set.")),
      skipIf: SAYS_WHEN,
    },
    {
      id: "moment-ready",
      question: "How ready do you feel?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Ready, want a check", "Know what, not how", "Not sure where to start", "Dreading it").map(withHeard("You feel ready and want a second opinion before it counts.", "You know what you want to say, but not how to say it.", "You\u2019re not sure where to start, which is normal for a moment like this.", "You\u2019re dreading it, so part of the work is making it feel manageable.")),
    },
  ],
  exploration: [
    {
      id: "explore-why",
      question: "What\u2019s making you want a change?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Hit a ceiling", "Lost interest", "Industry is shrinking", "Life has changed").map(withHeard("You\u2019ve hit a ceiling where you are, and staying put isn\u2019t going to move it.", "You\u2019ve lost interest in the work, so this is about what you want to do, not just where.", "Your industry is shrinking, so moving is about staying ahead, not just a change of scene.", "Your life has changed, and your career needs to fit its new shape.")),
    },
    {
      id: "explore-keep",
      question: "What would you keep?",
      hint: REFINEMENT_C1.instruction,
      options: opts("My function", "My industry", "My seniority", "Nothing in particular").map(withHeard("You\u2019d keep your function: it\u2019s the setting that\u2019s wrong, not the work.", "You\u2019d keep your industry: you know it well, you just need a different place in it.", "You\u2019d keep your seniority, so any move has to be at your level or above.", "Nothing in particular has to stay, so every direction is open.")),
    },
    {
      id: "explore-when",
      question: "How soon?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Actively looking", "Within a year", "Just exploring", "Not sure").map(withHeard("You\u2019re actively looking, so this needs to move quickly.", "You want to move within a year, which gives time to test a few directions first.", "You\u2019re exploring rather than actively looking, so there\u2019s time to get this right before you commit.", "You\u2019re not sure how soon, and that\u2019s fine: working out the direction comes first.")),
      skipIf: SAYS_WHEN,
    },
  ],
};

/** The questions this direction gets, in order, minus any it already answers. */
export function refinementFor(direction: string): TailoredQuestion[] {
  return REFINEMENT_BY_NEED[interpretNeed(direction)].filter(
    (question) => !question.skipIf?.some((pattern) => pattern.test(direction))
  );
}

/** How each Concept 1 prompt is said back, when it is used as written. */
const PROMPT_READBACK: Record<string, string> = {
  "C-suite in 3 years": "You want to reach the C-suite within three years.",
  "Take on more of a leadership role": "You want to take on more of a leadership role where you are.",
  "Be seen as an executive": "You want to be seen as an executive.",
  "Nail an upcoming board presentation": "You want to nail an upcoming board presentation.",
  "Find my next move": "You\u2019re looking for your next move.",
};

/** First person to second, for saying a typed or spoken answer back. Crude
 *  but honest: it keeps the user's own words rather than replacing them. */
const PRONOUNS: [RegExp, string][] = [
  [/\bI am\b/g, "you are"],
  [/\bI\u2019m\b|\bI'm\b/g, "you\u2019re"],
  [/\bI\u2019ve\b|\bI've\b/g, "you\u2019ve"],
  [/\bI\u2019d\b|\bI'd\b/g, "you\u2019d"],
  [/\bI\u2019ll\b|\bI'll\b/g, "you\u2019ll"],
  [/\bI\b/g, "you"],
  [/\bmyself\b/gi, "yourself"],
  [/\bmine\b/gi, "yours"],
  [/\bmy\b/gi, "your"],
  [/\bme\b/gi, "you"],
];

function sentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function withFullStop(text: string): string {
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

/** First person to second, whatever the sentence starts with. */
function toSecondPerson(text: string): string {
  return PRONOUNS.reduce((out, [pattern, to]) => out.replace(pattern, to), text);
}

/** The opening of the read-back: the direction, in the user's own words. */
function directionReadback(direction: string): string {
  const text = direction.trim();
  if (PROMPT_READBACK[text]) return PROMPT_READBACK[text];
  if (/^i\b|^i\u2019|^i'/i.test(text)) {
    const swapped = PRONOUNS.reduce((out, [pattern, to]) => out.replace(pattern, to), text);
    return withFullStop(sentenceCase(swapped));
  }
  return `You\u2019re aiming for \u201c${text.replace(/[.]$/, "")}\u201d.`;
}

/**
 * Concept 1's interpretation: what the user said, said back. The direction in
 * their own words (a prompt restated, or typed and spoken answers turned from
 * "I" to "you"), then a sentence per refinement answer saying what it means.
 * Nothing is replaced with a stock sentence, so it can never contradict an
 * answer. What the plan does about it is the plan screen's job, not this one.
 */
export function readBack(direction: string, answers: Record<string, string>): string {
  const sentences = refinementFor(direction)
    .map((question) => {
      const value = answers[question.id];
      if (!value) return undefined;
      // A typed answer, rather than a chosen one, is said back in their words.
      const option = question.options.find((o) => o.value === value);
      return option ? option.heard : withFullStop(sentenceCase(toSecondPerson(value.trim())));
    })
    .filter((sentence): sentence is string => Boolean(sentence));
  return [directionReadback(direction), ...sentences].join(" ");
}

/* -----------------------------------------------------------------------------
   PLANS
   -------------------------------------------------------------------------- */

/** One stage of a plan's roadmap: a window of time, and what exists by the end
 *  of it. The PRD defines a plan as three to four of these. */
export interface PlanStage {
  window: string;
  title: string;
  /** What the user will have, not what they will do. */
  outcomes: string[];
  /** The finish line: a concrete, checkable sign the stage is done. */
  done?: string;
}

export interface PlanTemplate {
  id: string;
  /** What the user calls it: short, plain, in their terms. */
  name: string;
  /** The plan's formal name from the product scope, shown as a label under
   *  the plain one. */
  formalName?: string;
  /** The first thing to do. Always the draft the next screen builds, framed
   *  for this plan, so the promise is kept one tap later. No effort estimate:
   *  by decision on 2026-09-24, onboarding carries no time-to-complete. */
  thisWeek?: { title: string; output: string; detail: string; why: string };
  /** What the stages span, e.g. "The next 12 weeks". */
  horizon?: string;
  /** The open end after the last stage: the plan keeps going. */
  after?: string;
  bestFor: string;
  emphasis: string;
  /** Why this plan, tied to what the user said. Filled in by `recommendPlan`. */
  rationale?: string;
  /** The roadmap, shown so the user can judge whether it is the plan for them. */
  stages?: PlanStage[];
}

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: "leadership-scope",
    name: "Step up",
    formalName: "Increase leadership scope",
    bestFor: "You\u2019re ready for a bigger role and want the promotion or remit to match.",
    emphasis: "Your leadership story, proof of what you\u2019ve delivered, and the conversations that decide it.",
    thisWeek: {
      title: "Write the story of what you lead",
      output: "The story of what you lead",
      detail: "The version you\u2019d say out loud in a meeting. Next, the Positioning Builder: add a few details and we\u2019ll write it for you to make your own.",
      why: "Every conversation about a bigger role starts with \u201cwhat do you lead?\u201d",
    },
    horizon: "The next 12 weeks",
    after: "After week 12, we\u2019ll plan the next stretch together, based on what worked and what didn\u2019t.",
    stages: [
      {
        window: "Weeks 1\u20132",
        title: "Say what you lead",
        outcomes: [
          "The story of what you lead, ready to say out loud",
          "A bio in short, medium and long versions",
        ],
        done: "You can describe your scope in a sentence, and your bio is ready to send.",
      },
      {
        window: "Weeks 3\u20136",
        title: "Show the proof",
        outcomes: [
          "Three wins written up to show how much you ran, not just what you did",
          "Talking points for your next career conversation",
        ],
        done: "Your manager has seen your three wins, in writing.",
      },
      {
        window: "Weeks 7\u201312",
        title: "Get in front of the deciders",
        outcomes: [
          "Two conversations with people who influence the decision",
          "Notes on what each one needs to see from you",
        ],
        done: "You know who decides on the role, and what they need to see from you.",
      },
    ],
  },
  {
    id: "executive-presence",
    name: "Build your executive presence",
    formalName: "Build executive presence",
    bestFor: "You need to be seen, and to have a clear point of view.",
    emphasis: "What you stand for, where you say it, and getting invited to say more.",
    thisWeek: {
      title: "Write how you describe yourself",
      output: "How you describe yourself",
      detail: "The short version of who you are and what you stand for, in your words, not your employer\u2019s. Next, the Positioning Builder: add a few details and we\u2019ll write it for you to make your own.",
      why: "Everything you say in public builds on it.",
    },
    horizon: "The next 12 weeks",
    after: "After week 12, we\u2019ll plan the next stretch together, based on what worked and what didn\u2019t.",
    stages: [
      {
        window: "Weeks 1\u20132",
        title: "Decide what you stand for",
        outcomes: [
          "How you describe yourself, in your words, not your employer\u2019s",
          "A point of view you\u2019re willing to defend",
        ],
        done: "You can say what you stand for in one sentence, without mentioning where you work.",
      },
      {
        window: "Weeks 3\u20138",
        title: "Say it in public",
        outcomes: [
          "Three posts or articles under your own name",
          "A short list of events and groups worth being part of",
        ],
        done: "Three pieces are published, and you know which rooms you want to be in.",
      },
      {
        window: "Weeks 9\u201312",
        title: "Get invited",
        outcomes: [
          "Two pitches sent to events or podcasts",
          "A follow-up plan for each one",
        ],
        done: "Two pitches are out, to events or shows the people you want to reach actually follow.",
      },
    ],
  },
  {
    id: "inflection-point",
    name: "Get ready for a big moment",
    formalName: "Prepare for a career inflection point",
    bestFor: "A promotion, review, board presentation or negotiation is coming up.",
    emphasis: "A clear brief, a strong case, and a plan for the people in the room.",
    thisWeek: {
      title: "Write the story you\u2019ll tell in the room",
      output: "The story you\u2019ll tell in the room",
      detail: "What you\u2019ve done, what you want, and why it should be you. Next, the Positioning Builder: add a few details and we\u2019ll write it for you to make your own.",
      why: "It\u2019s the core of your case, and the thing you\u2019ll rehearse.",
    },
    horizon: "Between now and the moment",
    after: "After the moment, we\u2019ll plan what\u2019s next together, based on how it went.",
    stages: [
      {
        window: "This week",
        title: "Get the situation on paper",
        outcomes: [
          "The story you\u2019ll tell in the room, in draft",
          "A one-page brief: what\u2019s being decided, by whom, and on what basis",
        ],
        done: "You can say what\u2019s being decided, who decides, and what they\u2019ll push back on.",
      },
      {
        window: "Before the date",
        title: "Prepare your case",
        outcomes: [
          "A ninety-second version you can say without notes",
          "Proof for every claim, and answers to the two hardest objections",
        ],
        done: "You can give your case without notes, with proof behind every claim.",
      },
      {
        window: "After",
        title: "Capture what happened",
        outcomes: [
          "Notes on what was said, while it\u2019s fresh",
          "A decision on your next move",
        ],
        done: "Your next move is decided, not drifted into.",
      },
    ],
  },
  {
    id: "current-org",
    name: "Grow your influence where you are",
    formalName: "Strengthen influence in the current organisation",
    bestFor: "You want to grow where you already are.",
    emphasis: "Making your work visible, widening who knows it, and becoming the go-to.",
    thisWeek: {
      title: "Write the story of what you own",
      output: "The story of what you own",
      detail: "What you\u2019re responsible for, in the words your leadership already uses. Next, the Positioning Builder: add a few details and we\u2019ll write it for you to make your own.",
      why: "Your work gets heard when it\u2019s described in the terms decisions are made in.",
    },
    horizon: "The next 12 weeks",
    after: "After week 12, we\u2019ll plan the next stretch together, based on what worked and what didn\u2019t.",
    stages: [
      {
        window: "Weeks 1\u20133",
        title: "Make your work easy to see",
        outcomes: [
          "Your role described in the words your leadership uses",
          "One recent win reframed as impact on the business",
        ],
        done: "Your role and one win are written in your leadership\u2019s language, ready to use.",
      },
      {
        window: "Weeks 4\u20139",
        title: "Widen who hears about it",
        outcomes: [
          "Three people outside your team who know what you do",
          "A regular reason to be in one meeting you\u2019re not in yet",
        ],
        done: "Three people outside your team could explain what you do.",
      },
      {
        window: "Weeks 10\u201312",
        title: "Become the go-to",
        outcomes: [
          "One problem that comes to you by default",
          "A specific piece of bigger scope, asked for",
        ],
        done: "You\u2019ve asked for a specific piece of bigger scope, and had an answer.",
      },
    ],
  },
  {
    id: "explore",
    name: "Find your next direction",
    formalName: "Explore and clarify a next direction",
    bestFor: "You feel stuck but can\u2019t yet name the next role.",
    emphasis: "What you bring anywhere, cheap ways to test options, and a direction you can commit to.",
    thisWeek: {
      title: "Write the story of what you\u2019re good at",
      output: "The story of what you\u2019re good at",
      detail: "What you do well, separated from where you\u2019ve done it. Next, the Positioning Builder: add a few details and we\u2019ll write it for you to make your own.",
      why: "It shows which strengths go with you anywhere, before you choose where.",
    },
    horizon: "The next 12 weeks",
    after: "After week 12, we\u2019ll plan the next stretch together, based on what worked and what didn\u2019t.",
    stages: [
      {
        window: "Weeks 1\u20132",
        title: "Work out what travels",
        outcomes: [
          "What you\u2019re good at, separated from where you\u2019ve done it",
          "The parts of the job you wouldn\u2019t miss",
        ],
        done: "You have a short list of strengths that would matter anywhere.",
      },
      {
        window: "Weeks 3\u20138",
        title: "Test it cheaply",
        outcomes: [
          "Four conversations with people in adjacent roles",
          "Two directions ruled out on evidence, not nerves",
        ],
        done: "You\u2019ve crossed at least two options off, for real reasons.",
      },
      {
        window: "Weeks 9\u201312",
        title: "Choose your direction",
        outcomes: [
          "A direction specific enough to plan around",
          "A story that makes the move look deliberate",
        ],
        done: "You can name the role you\u2019re going for, and why.",
      },
    ],
  },
];

const NEED_TO_PLAN: Record<DirectionNeed, string> = {
  positioning: "leadership-scope",
  visibility: "executive-presence",
  influence: "current-org",
  preparation: "inflection-point",
  exploration: "explore",
};

/** The rationale must be tied to the user's stated direction, never a generic
 *  description of the template. These are written as "you said X, so Y". */
const RATIONALES: Record<DirectionNeed, string> = {
  positioning:
    "You said you want a larger organisation and a broader remit, so this plan starts with the narrative and the evidence that the people deciding will ask for.",
  visibility:
    "You said you want to be read differently, so this plan starts with your positioning and the places it needs to show up.",
  influence:
    "You said you want more weight where you already are, so this plan starts inside your organisation rather than outside it.",
  preparation:
    "You have a specific conversation ahead, so this plan works backward from that date instead of starting a general programme.",
  exploration:
    "You said you cannot name the next role yet, so this plan starts by clarifying the direction rather than assuming one.",
};

export function recommendPlan(direction: string): PlanTemplate {
  const need = interpretNeed(direction);
  const planId = NEED_TO_PLAN[need];
  const template =
    PLAN_TEMPLATES.find((plan) => plan.id === planId) ?? PLAN_TEMPLATES[0];
  return { ...template, rationale: RATIONALES[need] };
}

/** What the user can do with a finished artifact. Designed states only: nothing
 *  here leaves the browser, because nothing in this prototype talks out. */
export const EXPORT_ACTIONS = {
  downloadLabel: "Download",
  emailLabel: "Email it to me",
  downloaded: "Downloaded. Check wherever your device puts files.",
  emailed: "Sent. It will be in your inbox shortly.",
} as const;

/** The fields the last step asks for, entered by hand. Nothing is fetched. */
/** Concept 1's ending: the win, then two ways on. */
export const DONE_C1 = {
  eyebrow: "You\u2019re set up",
  title: "You have a plan and your first story",
  hint: "Both are saved. Nothing here is visible to anyone else.",
  planPrefix: "Your starting plan:",
  inviteTitle: "Build out your signals",
  inviteBody: "Connect LinkedIn or your website so your next drafts sound like you. Optional, and you can do it anytime.",
  home: "Go to my homepage",
  signals: "Build out your signals",
  homeHref: "/homepage/concept-1",
} as const;

/** Concept 1's signals page: optional, after onboarding has ended. The
 *  product's own word — the Signal Background — for what is connected. */
export const SIGNALS_C1 = {
  eyebrow: "Optional",
  title: "Build out your signals",
  hint: "Connect what\u2019s already public and we\u2019ll use it to shape your drafts.",
  privacy: "Nothing is ever posted or shared. Disconnect anytime.",
  connect: "Connect",
  connected: "Connected",
  close: "Close",
  disconnect: "Disconnect",
  add: "Add",
  cancel: "Cancel",
  skip: "Skip for now",
  done: "Done",
  sources: [
    {
      id: "linkedin",
      mark: "in",
      title: "LinkedIn",
      why: "So your drafts match how you already show up.",
      imported: "Headline, about section and your last 20 posts",
      use: "Used only to shape your drafts.",
      connectLabel: "Connect LinkedIn",
      connecting: "Connecting to LinkedIn\u2026",
      pasteLabel: "Or paste your profile link",
      linkLabel: "Your LinkedIn profile link",
      placeholder: "linkedin.com/in/\u2026",
      canImport: true,
    },
    {
      id: "website",
      mark: "www",
      title: "Personal website",
      why: "So we can learn your voice from your own writing.",
      imported: "The pages at your address",
      use: "Used only to learn your voice.",
      connectLabel: "",
      connecting: "",
      pasteLabel: "",
      linkLabel: "Your website address",
      placeholder: "https://",
      canImport: false,
    },
  ],
} as const;

export function planById(id: string): PlanTemplate | undefined {
  return PLAN_TEMPLATES.find((plan) => plan.id === id);
}

/* -----------------------------------------------------------------------------
   CUSTOM PLAN
   -------------------------------------------------------------------------- */

export interface CustomPlanStepSpec {
  id: string;
  question: string;
  hint: string;
  options: RefinementOption[];
}

/**
 * The custom-plan wizard. A nested sequence inside plan selection that can be
 * left at any point with whatever has been answered kept as a draft, so exiting
 * is never the same as discarding.
 */
export const CUSTOM_PLAN_STEPS: CustomPlanStepSpec[] = [
  {
    id: "outcome",
    question: "What would have to be true for this to have worked?",
    hint: "The outcome, not the activity.",
    options: [
      { value: "bigger-role", label: "I am in a bigger role" },
      { value: "same-role-more-weight", label: "Same role, much more weight" },
      { value: "different-field", label: "I have moved into something different" },
      { value: "clarity", label: "I know what I am aiming at" },
    ],
  },
  {
    id: "horizon",
    question: "Over what period?",
    hint: "This sets the shape of the roadmap, not a deadline.",
    options: [
      { value: "quarter", label: "This quarter" },
      { value: "year", label: "About a year" },
      { value: "two-three", label: "Two to three years" },
      { value: "open", label: "Open ended" },
    ],
  },
  {
    id: "capacity",
    question: "Realistically, how much time do you have for this?",
    hint: "We would rather plan for the truth than the intention.",
    options: [
      { value: "minimal", label: "Under an hour a week" },
      { value: "some", label: "A couple of hours a week" },
      { value: "real", label: "Half a day a week" },
      { value: "varies", label: "It varies a lot" },
    ],
  },
  {
    id: "focus",
    question: "Where should we put the weight first?",
    hint: "You can change this later without starting again.",
    options: [
      { value: "narrative", label: "How I describe myself" },
      { value: "visibility", label: "Being seen by the right people" },
      { value: "evidence", label: "Building the evidence" },
      { value: "conversations", label: "Specific conversations" },
    ],
  },
];

export const CUSTOM_PLAN_DRAFT_NAME = "Your own plan";

/** The custom plan as an option in a set, for a concept that presents building
 *  your own as a peer of the five templates rather than as a way out of them. */
export const CUSTOM_PLAN_OPTION: PlanTemplate = {
  id: "custom",
  name: "Build my own plan",
  bestFor: "None of these is close enough to what you are actually doing.",
  emphasis: "Four questions. You can leave at any point and keep the draft.",
};

/* -----------------------------------------------------------------------------
   FIRST ACTION AND ARTIFACT
   -------------------------------------------------------------------------- */

export interface RecommendedAction {
  title: string;
  outcome: string;
  effort: string;
  whyThis: string;
  whyNow: string;
  whyYou: string;
  tool: string;
}

export function firstAction(direction: string): RecommendedAction {
  const need = interpretNeed(direction);
  const whyYou: Record<DirectionNeed, string> = {
    positioning:
      "You can describe what you run. You have not yet had to describe what you are for.",
    visibility:
      "The work is strong. The account of it is missing, so other people are writing it.",
    influence:
      "You already have the relationships. What is missing is a consistent account of what you stand for.",
    preparation:
      "You will be asked to summarise yourself in about ninety seconds. Better to have written it.",
    exploration:
      "Before you can choose a direction you need to know what travels with you. That is this.",
  };

  return {
    title: "Write your leadership narrative",
    outcome:
      "A short, reusable account of what you do, what you are known for, and what you are building toward.",
    effort: "About twenty minutes",
    whyThis:
      "Everything else in this plan reuses it — the conversations, the profile, the pitches.",
    whyNow:
      "It is the one piece that does not depend on anything else being ready first.",
    whyYou: whyYou[need],
    tool: "Positioning Builder",
  };
}

export interface ArtifactSection {
  heading: string;
  body: string;
  /** `pending` sections are visibly unfinished, so the draft reads as started
   *  rather than delivered. */
  state: "filled" | "pending";
}

export interface Artifact {
  tool: string;
  title: string;
  note: string;
  sections: ArtifactSection[];
}

const ARTIFACT_OPENERS: Record<DirectionNeed, string> = {
  positioning:
    "I lead marketing organisations where the brand is a commercial instrument rather than a cost line — building the team, the positioning and the operating rhythm that make demand predictable.",
  visibility:
    "I build the operating systems behind functions that are usually judged on output — and I can show the difference in the numbers rather than the deck.",
  influence:
    "I work at the point where strategy turns into what people actually do on Monday, which is where most plans quietly fail.",
  preparation:
    "I take functions that are treated as a service desk and turn them into something the executive team plans around.",
  exploration:
    "I am at my best where a business knows something is not working but has not yet named it — and I have done that in more than one industry.",
};

/**
 * The canned first artifact. Deliberately a stub of the real Positioning
 * Builder: the Toolbox is Sprint 4. It produces and saves one draft so the flow
 * can be walked end to end, and it is not a design for that tool.
 *
 * `interpretation` is the user's edited direction sentence, where a concept
 * lets them rewrite it. Optional, so existing callers keep the old behaviour.
 */
export function artifactFor(direction: string, interpretation?: string): Artifact {
  const need = interpretNeed(direction);
  return {
    tool: "Positioning Builder",
    title: "Your leadership narrative",
    note: "A first draft, already started. Edit anything.",
    sections: [
      { heading: "What I do", body: ARTIFACT_OPENERS[need], state: "filled" },
      {
        heading: "What I am known for",
        body: "Taking a function that is treated as a cost and making it something the executive team plans around.",
        state: "filled",
      },
      {
        // The user's own wording when they have rewritten the interpretation,
        // so a draft never quotes a sentence they replaced. Callers that do not
        // pass one get the system's reading, exactly as before.
        heading: "What I am building toward",
        body: interpretation?.trim() || interpretDirection(direction),
        state: "filled",
      },
      {
        heading: "Evidence",
        body: "Add two or three specific results and this section writes itself.",
        state: "pending",
      },
    ],
  };
}

/* -----------------------------------------------------------------------------
   OPTIONAL CONNECTIONS
   -------------------------------------------------------------------------- */

export interface ConnectOfferSpec {
  id: "linkedin" | "website";
  title: string;
  body: string;
  connectLabel: string;
  declineLabel: string;
}

/** Offered only after the artifact exists. The body says what it improves, and
 *  never implies the draft they already have is worse without it. */
export const CONNECT_OFFERS: ConnectOfferSpec[] = [
  {
    id: "linkedin",
    title: "Add your LinkedIn metrics",
    body: "You enter them yourself, whenever you like. It sharpens later drafts. It changes nothing about the one you already have.",
    connectLabel: "Add metrics",
    declineLabel: "Not now",
  },
  {
    id: "website",
    title: "Connect a personal website",
    body: "Gives us your own writing to take the voice from. Useful later. Not needed for anything today.",
    connectLabel: "Connect",
    declineLabel: "Not now",
  },
];

/** What a successful LinkedIn connection would have pulled in. Manual entry
 *  only — nothing here is scraped, and the PRD forbids implying otherwise. */
export const MOCK_LINKEDIN_CONTEXT = {
  headline: "Marketing leader | Demand, brand and the bit in between",
  followers: 4820,
  postsLast90Days: 6,
  medianReactions: 31,
  note: "You entered these. Change them whenever they change.",
} as const;

/** The failed-connection state. A connection can fail; that is a designed
 *  screen, not an unhandled case. */
export const CONNECTION_FAILURE = {
  title: "That did not connect",
  body: "Nothing was sent and nothing was saved. You can try again, or carry on — your draft is unaffected.",
  retryLabel: "Try again",
  continueLabel: "Carry on without it",
} as const;

/* -----------------------------------------------------------------------------
   POSITIONING BUILDER (Concept 1)
   -------------------------------------------------------------------------- */

/* The first artifact for every plan, in two pages: what goes in, then what
   comes out. The outputs are the builder's four: the leadership narrative,
   the executive bio in three lengths, an optional opener for a chosen
   audience, and a recommended next use. Nothing is invented: what we know is
   written in, and what only the user knows is a gap until they fill it. */

export const POSITIONING_C1 = {
  tool: "Positioning Builder",
  buildTitle: "Let’s build your story",
  buildHint: "Fill in what you can. Anything you skip stays a gap you can fill later.",
  parts: {
    doing: "What I do",
    known: "What I’m known for",
    toward: "What I’m building toward",
    use: "How you’ll use it",
    bio: "For your bio",
  },
  role: { label: "Your current role", placeholder: "e.g. VP of Marketing" },
  own: { label: "What you’re responsible for", placeholder: "e.g. brand and demand" },
  team: { label: "How big is your team?", options: ["Just me", "2–10", "11–50", "51–200", "200+"] },
  strengths: {
    label: "What you’re strongest at",
    note: "Up to three",
    max: 3,
    options: [
      "Building teams",
      "Turning results around",
      "Setting strategy",
      "Getting things done",
      "Growing revenue",
      "Leading through change",
      "Getting people aligned",
    ],
  },
  result: { label: "A result you’re proud of", placeholder: "e.g. grew pipeline 40% in a year" },
  fromPlan: "From your plan",
  audience: {
    label: "Who will hear it first?",
    note: "Adds an opener for them",
    none: "None for now",
    options: ["My manager", "The exec team", "Recruiters", "A board", "My industry", "None for now"],
  },
  showFirst: { label: "Show me first" },
  name: { label: "Your name" },
  source: {
    label: "Anything to start from?",
    placeholder: "Paste a bio you already have, or your LinkedIn About section",
    hint: "We already use everything you’ve told us so far.",
  },
  build: "Build my story",
  building: "Writing your story",
  outputHint: "Built from what you told us. Edit anything.",
  outputs: { narrative: "Narrative", bio: "Bio" },
  lengths: { short: "Short", medium: "Medium", long: "Long" },
  revise: { label: "Change it" },
  edit: "Edit",
  nextUse: "Where to use it next",
  copy: "Copy",
  copied: "Copied: the narrative, your bio in three lengths and any opener.",
  save: "Save and continue",
} as const;

export type BioLength = "short" | "medium" | "long";

/** A piece of an output: words, or a gap only the user can fill. */
export type StorySegment = { text: string } | { gap: string };

/** The builder's inputs, as the outputs need them. */
export interface PositioningSource {
  name: string;
  role: string;
  own: string;
  teamSize: string;
  strengths: string[];
  result: string;
  audience: string;
}

/** The kind of opener each audience gets: a promotion-conversation opening
 *  for the people who decide on your next role, an introduction for the rest. */
export const OPENER_KIND: Record<string, string> = {
  "My manager": "Promotion conversation",
  "The exec team": "Promotion conversation",
  Recruiters: "Introduction",
  "A board": "Introduction",
  "My industry": "Introduction",
};

const GAPS = {
  role: "your current role",
  own: "what you’re responsible for",
  team: "your team size",
  strengths: "your strengths",
  result: "a result you’re proud of",
  name: "your name",
};

const text = (value: string): StorySegment => ({ text: value });
const slot = (value: string, gap: string): StorySegment =>
  value.trim() ? { text: value.trim() } : { gap };

function joinAnd(items: string[]): string {
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const strengthsOf = (inputs: PositioningSource) =>
  joinAnd(inputs.strengths.map((strength) => strength.toLowerCase()));

function teamOf(inputs: PositioningSource, person: "first" | "third"): string {
  if (!inputs.teamSize) return "";
  if (inputs.teamSize === "Just me") return person === "first" ? "on my own" : "on their own";
  return `with a team of ${inputs.teamSize}`;
}

/** The goal, in the user's voice and in the bio's. */
interface Goal {
  /** "a C-suite role within three years" */
  phrase: string;
  /** "a C-suite role within three years", in the third person */
  third: string;
  /** Their own sentence, when they typed one in the first person. */
  own?: string;
}

const PROMPT_GOALS: Record<string, [string, string]> = {
  "C-suite in 3 years": ["a C-suite role within three years", "a C-suite role within three years"],
  "Take on more of a leadership role": ["a bigger leadership role where I am", "a bigger leadership role where they are"],
  "Be seen as an executive": ["being seen as an executive", "being seen as an executive"],
  "Nail an upcoming board presentation": ["a board presentation that lands", "a board presentation that lands"],
  "Find my next move": ["my next move", "their next move"],
};

export function goalFor(direction: string): Goal {
  const typed = direction.trim().replace(/[.]$/, "");
  const prompt = PROMPT_GOALS[typed];
  if (prompt) return { phrase: prompt[0], third: prompt[1] };
  if (/^i\b|^i’|^i'/i.test(typed)) {
    return { phrase: "what’s next for me", third: "the next step in their career", own: `${typed}.` };
  }
  return { phrase: typed, third: typed };
}

/* Revisions: the builder's "request revisions", as chips. Each output has
   its own. Every chip brings a new one when applied: its own follow-ups
   (`reveals`), or the next general one from the set's pool. Chips hide the
   ones that contradict them (`excludes`); removing one removes what it
   brought. */

export interface RevisionOption {
  id: string;
  label: string;
  /** Offered beside this one once it is applied. */
  reveals?: string[];
  /** Hidden while any of these is applied. */
  excludes?: string[];
  /** Only has an effect once this is applied, so never offered before it. */
  needs?: string;
}

export type OutputKind = "narrative" | "bio" | "opener";

interface RevisionSet {
  options: RevisionOption[];
  /** The three offered from the start. */
  start: string[];
  /** Follow-ups in the order they are offered after a chip with nothing of
   *  its own left to reveal. Anything else still hidden follows. */
  pool: string[];
}

export const REVISIONS: Record<OutputKind, RevisionSet> = {
  narrative: {
    options: [
      { id: "shorter", label: "Shorter", reveals: ["shortest"] },
      { id: "shortest", label: "Even shorter", reveals: ["endAsk"], needs: "shorter" },
      { id: "confident", label: "More confident", reveals: ["bold"], excludes: ["warm", "personal"] },
      { id: "bold", label: "Bolder still", reveals: ["cut"], excludes: ["warm", "personal"], needs: "confident" },
      { id: "cut", label: "Cut the qualifiers" },
      { id: "warm", label: "Warmer", reveals: ["personal"], excludes: ["confident", "bold"] },
      { id: "personal", label: "More personal", reveals: ["why"], excludes: ["confident", "bold"], needs: "warm" },
      { id: "why", label: "Say why it matters" },
      { id: "lead", label: "Lead with your result", reveals: ["impact"] },
      { id: "impact", label: "Add the impact" },
      { id: "asOne", label: "Read it as one", reveals: ["spoken"] },
      { id: "spoken", label: "Make it easier to say" },
      { id: "team", label: "Mention your team" },
      { id: "endAsk", label: "End with what you want next" },
    ],
    start: ["shorter", "confident", "warm"],
    pool: ["lead", "asOne", "team", "endAsk", "why", "cut", "impact", "spoken"],
  },
  bio: {
    options: [
      { id: "first", label: "Write it in first person", reveals: ["linkedin"] },
      { id: "linkedin", label: "Shape it for LinkedIn", reveals: ["openTo"], needs: "first" },
      { id: "openTo", label: "Say what you\u2019re open to", needs: "linkedin" },
      { id: "formal", label: "More formal", reveals: ["title"], excludes: ["warm"] },
      { id: "title", label: "Lead with your title" },
      { id: "warm", label: "Warmer", reveals: ["enjoy"], excludes: ["formal"] },
      { id: "enjoy", label: "Add what you enjoy" },
      { id: "goal", label: "Add your goal", reveals: ["goalFirst"] },
      { id: "goalFirst", label: "Put the goal first", needs: "goal" },
      { id: "result", label: "Lead with your result" },
      { id: "noTeam", label: "Leave out team size" },
    ],
    start: ["first", "formal", "warm"],
    pool: ["goal", "result", "noTeam", "enjoy", "title"],
  },
  opener: {
    options: [
      { id: "shorter", label: "Shorter", reveals: ["essentials"] },
      // Dropping the opening line leaves nothing for a change of tone to change.
      { id: "essentials", label: "Just the essentials", excludes: ["soft", "direct"] },
      { id: "direct", label: "More direct", reveals: ["nameWant"], excludes: ["soft", "essentials"] },
      { id: "nameWant", label: "Name what you want" },
      { id: "soft", label: "Softer", reveals: ["thank"], excludes: ["direct", "essentials"] },
      { id: "thank", label: "Thank them first" },
      { id: "ask", label: "End with a clear ask", reveals: ["time"] },
      { id: "time", label: "Suggest a time", reveals: ["notes"], needs: "ask" },
      { id: "notes", label: "Offer to send notes first" },
      { id: "result", label: "Lead with your result" },
      { id: "whyNow", label: "Say why now" },
    ],
    start: ["shorter", "direct", "ask"],
    pool: ["soft", "result", "whyNow", "thank", "nameWant", "notes", "essentials"],
  },
};

/**
 * The chips to show, in order. Three to start; each applied chip brings a
 * new one right beside it — its own follow-up, or the next general one, or
 * anything else still hidden — until everything has been offered. Chips ruled
 * out by an applied one, unavailable here, or without the chip they need are
 * never offered. Applied chips stay, to show as used.
 */
export function visibleRevisions(
  kind: OutputKind,
  applied: readonly string[],
  unavailable: readonly string[] = []
): RevisionOption[] {
  const { options, start, pool } = REVISIONS[kind];
  const byId = new Map(options.map((option) => [option.id, option]));
  const offerable = (id: string, list: string[]) => {
    const option = byId.get(id);
    if (!option || list.includes(id) || unavailable.includes(id)) return false;
    if (option.needs && !applied.includes(option.needs)) return false;
    return !option.excludes?.some((other) => applied.includes(other));
  };

  const list = start.filter((id) => offerable(id, []));
  const order = [...pool, ...options.map((option) => option.id)];

  for (const id of applied) {
    const at = list.indexOf(id);
    if (at === -1) continue;
    const own = (byId.get(id)?.reveals ?? []).filter((r) => offerable(r, list));
    const fresh = own.length ? own.slice(0, 1) : order.filter((r) => offerable(r, list)).slice(0, 1);
    list.splice(at + 1, 0, ...fresh);
  }
  return list.map((id) => byId.get(id)!).filter(Boolean);
}

/** Applies a revision, or removes it and anything that was only on offer
 *  because of it. */
export function toggleRevision(
  kind: OutputKind,
  applied: readonly string[],
  id: string,
  unavailable: readonly string[] = []
): string[] {
  if (!applied.includes(id)) return [...applied, id];
  let next = applied.filter((item) => item !== id);
  let changed = true;
  while (changed) {
    const shown = new Set(visibleRevisions(kind, next, unavailable).map((option) => option.id));
    const kept = next.filter((item) => shown.has(item));
    changed = kept.length !== next.length;
    next = kept;
  }
  return next;
}

type Voice = "plain" | "confident" | "bold" | "warm" | "personal";

function voiceOf(applied: readonly string[]): Voice {
  if (applied.includes("bold")) return "bold";
  if (applied.includes("confident")) return "confident";
  if (applied.includes("personal")) return "personal";
  if (applied.includes("warm")) return "warm";
  return "plain";
}

function towardSentence(goal: Goal, voice: Voice, short: boolean): string {
  if (goal.own) return goal.own;
  const lines: Record<Voice, [string, string]> = {
    plain: [`I’m working toward ${goal.phrase}.`, `Next: ${goal.phrase}.`],
    confident: [`Next, I’ll take that into ${goal.phrase}.`, `Next: ${goal.phrase}. I’m ready.`],
    bold: [`Next: ${goal.phrase}. I’m ready for it.`, `Next: ${goal.phrase}. And I’m ready for it.`],
    warm: [`What I’m working toward is ${goal.phrase}.`, `Next, I hope: ${goal.phrase}.`],
    personal: [`What I want most next is ${goal.phrase}.`, `What I want next: ${goal.phrase}.`],
  };
  return lines[voice][short ? 1 : 0];
}

/** The leadership narrative, in its three parts. */
export function narrativeFor(
  inputs: PositioningSource,
  goal: Goal,
  applied: readonly string[] = []
): { heading: string; segments: StorySegment[] }[] {
  const role = slot(inputs.role, GAPS.role);
  const own = slot(inputs.own, GAPS.own);
  const team = slot(teamOf(inputs, "first"), GAPS.team);
  const strengths = slot(strengthsOf(inputs), GAPS.strengths);
  const result = slot(inputs.result, GAPS.result);
  const on = (id: string) => applied.includes(id);
  const short = on("shortest") ? 2 : on("shorter") ? 1 : 0;
  const voice = voiceOf(applied);
  const parts = POSITIONING_C1.parts;

  // Each revision changes its own piece, so any combination still reads, and
  // every chip changes something whenever it is on offer.
  let doing: StorySegment[];
  if (short === 2) doing = [role, text(", "), own, text(".")];
  else if (short === 1) doing = [role, text(", "), team, text(", responsible for "), own, text(".")];
  else if (voice === "confident" || voice === "bold")
    doing = [text("I’m "), role, text(". I run "), own, text(" "), team, text(".")];
  else if (voice === "warm" || voice === "personal")
    doing = [text("I’m "), role, text(", and I lead "), own, text(" "), team, text(".")];
  else doing = [text("I’m "), role, text(", leading "), own, text(" "), team, text(".")];
  if (on("team")) doing.push(text(" I’m proud of the team I’ve built."));
  if (on("spoken")) doing.unshift(text("Here’s the short version. "));

  const strengthsLine: Record<Voice, StorySegment[]> = short
    ? {
        plain: [text("Known for "), strengths, text(".")],
        confident: [text("Go-to for "), strengths, text(".")],
        bold: [text("The one they call for "), strengths, text(".")],
        warm: [text("People come to me for "), strengths, text(".")],
        personal: [text("I love "), strengths, text(".")],
      }
    : {
        plain: [text("I’m known for "), strengths, text(".")],
        confident: [text("When the business needs "), strengths, text(", it comes to me.")],
        bold: [text("I’m the one the business calls for "), strengths, text(".")],
        warm: [text("People come to me for "), strengths, text(".")],
        personal: [text("People come to me for "), strengths, text(", and it’s the part of the work I love most.")],
      };
  // "Cut the qualifiers" drops the softening lead-in; "Add the impact" says
  // what the result did, without inventing numbers.
  const resultLine: StorySegment[] = [
    text(on("cut") ? "I " : "Most recently, I "),
    result,
    text(
      (voice === "warm" || voice === "personal") && !short ? ", with a team I’m proud of" : ""
    ),
    text(on("impact") ? ", and the business felt it." : "."),
  ];
  const known = on("lead")
    ? [...resultLine, text(" "), ...strengthsLine[voice]]
    : [...strengthsLine[voice], text(" "), ...resultLine];

  let toward = towardSentence(goal, voice, short > 0);
  if (on("why")) toward += " It matters to me because I want to build something that lasts.";
  if (on("endAsk")) toward += " I’d like to talk about how I get there.";

  return [
    { heading: parts.doing, segments: doing },
    { heading: parts.known, segments: known },
    { heading: parts.toward, segments: [text(toward)] },
  ];
}

/** The executive bio at three lengths: third person by default, first
 *  person on request. */
export function bioFor(
  inputs: PositioningSource,
  goal: Goal,
  length: BioLength,
  applied: readonly string[] = []
): StorySegment[] {
  const on = (id: string) => applied.includes(id);
  const name = slot(inputs.name, GAPS.name);
  // Full name once, then the first name, as a bio would.
  const later = slot(inputs.name.trim().split(/\s+/)[0] ?? "", GAPS.name);
  const role = slot(inputs.role, GAPS.role);
  const own = slot(inputs.own, GAPS.own);
  const strengths = slot(strengthsOf(inputs), GAPS.strengths);
  const result = slot(inputs.result, GAPS.result);
  const first = on("first");
  const formal = on("formal");
  const warm = on("warm");
  const withGoal = length === "long" || on("goal");
  const noTeam = on("noTeam");

  const goalLine: StorySegment[] = first
    ? [text(goal.own ?? `I\u2019m working toward ${goal.phrase}.`)]
    : [later, text(` is working toward ${goal.third}.`)];
  const resultLine: StorySegment[] = first
    ? [text("I recently "), result, text(".")]
    : [text("Most recently, "), later, text(" "), result, text(".")];

  const out: StorySegment[] = [];
  const add = (...segments: StorySegment[]) => {
    if (out.length) out.push(text(" "));
    out.push(...segments);
  };

  if (first && on("linkedin")) add(text("Hi, I\u2019m "), name, text("."));
  if (withGoal && on("goalFirst")) add(...goalLine);
  if (on("result")) add(...resultLine);

  if (first) {
    const team = noTeam ? [] : [text(" "), slot(teamOf(inputs, "first"), GAPS.team)];
    if (on("title")) add(text("As "), role, text(formal ? ", I am responsible for " : ", I lead "), own, ...team, text("."));
    else if (formal) add(text("I serve as "), role, text(", responsible for "), own, ...team, text("."));
    else if (warm) add(text("I\u2019m "), role, text(", and I lead "), own, ...team, text("."));
    else add(text("I\u2019m "), role, text(", leading "), own, ...team, text("."));
    if (length !== "short") {
      if (formal) add(text("I\u2019m recognised for "), strengths, text("."));
      else if (warm) add(text("People come to me for "), strengths, text("."));
      else add(text("I\u2019m known for "), strengths, text("."));
      if (!on("result")) add(...resultLine);
    }
    if (on("enjoy")) add(text("What I enjoy most: "), strengths, text("."));
    if (withGoal && !on("goalFirst")) add(...goalLine);
    if (on("linkedin")) {
      if (on("openTo")) add(text(`Open to conversations about ${goal.phrase}.`));
      add(text("Always glad to connect with people working on the same problems."));
    }
    return out;
  }

  const team = noTeam ? [] : [text(" "), slot(teamOf(inputs, "third"), GAPS.team)];
  if (on("title")) add(name, text(", "), role, text(formal ? ", is responsible for " : ", leads "), own, ...team, text("."));
  else if (formal) add(name, text(" serves as "), role, text(", with responsibility for "), own, ...team, text("."));
  else if (warm) add(name, text(" is "), role, text(", leading "), own, ...team, text(", and puts people at the centre of the work."));
  else add(name, text(" is "), role, text(", leading "), own, ...team, text("."));
  if (length !== "short") {
    if (formal) add(later, text(" is recognised for "), strengths, text("."));
    else if (warm) add(text("Colleagues know "), later, text(" for "), strengths, text("."));
    else add(text("Known for "), strengths, text("."));
    if (!on("result")) add(...resultLine);
  }
  if (on("enjoy")) add(text("What "), later, text(" enjoys most: "), strengths, text("."));
  if (withGoal && !on("goalFirst")) add(...goalLine);
  return out;
}

/** How an opener is put together for one audience: an opening line in three
 *  voices, the body, whether it names the goal, and its possible closes. */
interface OpenerShape {
  intro: { plain: string; direct: string; soft: string };
  /** The middle. `withResult` is false when the result has moved to the
   *  front, so it is never said twice. */
  body: (s: Record<"role" | "own" | "result" | "strengths", StorySegment>, withResult: boolean) => StorySegment[];
  goal: boolean;
  close: { plain: string; direct?: string; ask: string; time: string };
}

const OPENERS: Record<string, OpenerShape> = {
  "My manager": {
    intro: {
      plain: "I’d like to talk about what’s next for me.",
      direct: "I want to talk about my next step.",
      soft: "I’ve been thinking about what’s next for me, and I’d value your view.",
    },
    body: ({ role, own, result }, withResult) => [
      text(" Today I’m "),
      role,
      text(", leading "),
      own,
      text("."),
      ...(withResult ? [text(" Most recently, I "), result, text(".")] : []),
    ],
    goal: true,
    close: {
      plain: " I’d like us to plan how I get there.",
      direct: " What would it take?",
      ask: " Could we set time this month to map out the path?",
      time: " Does thirty minutes next week work?",
    },
  },
  "The exec team": {
    intro: { plain: "Thanks for the time.", direct: "I’ll be brief.", soft: "Thank you for making the time." },
    body: ({ own, result }, withResult) => [
      text(" I lead "),
      own,
      text("."),
      ...(withResult ? [text(" Most recently, I "), result, text(".")] : []),
    ],
    goal: false,
    close: {
      plain: " I’d like to share where I think I can take it next.",
      direct: " Here’s where I can take it next.",
      ask: " Could I bring you a proposal for what’s next?",
      time: " I can have it to you by the end of the month.",
    },
  },
  Recruiters: {
    intro: { plain: "Thanks for reaching out.", direct: "Here’s where I am.", soft: "Thank you for thinking of me." },
    body: ({ role, own, strengths }) => [text(" I’m "), role, text(", leading "), own, text(". I’m known for "), strengths, text(".")],
    goal: true,
    close: {
      plain: "",
      ask: " Could we find time to talk about what you’re seeing?",
      time: " I have time on Thursday or Friday.",
    },
  },
  "A board": {
    intro: { plain: "Thank you for considering me.", direct: "Here’s what I’d bring.", soft: "I’m grateful for the chance to be considered." },
    body: ({ role, strengths, result }, withResult) => [
      text(" I’m "),
      role,
      text(". I’d bring "),
      strengths,
      text("."),
      ...(withResult ? [text(" Most recently, I "), result, text(".")] : []),
    ],
    goal: false,
    close: {
      plain: "",
      ask: " I’d welcome a conversation about where I could help most.",
      time: " I’m available in the next two weeks.",
    },
  },
  "My industry": {
    intro: { plain: "Good to meet you.", direct: "Quick intro.", soft: "It’s lovely to connect." },
    body: ({ own, strengths }) => [text(" I lead "), own, text(", and I’m known for "), strengths, text(".")],
    goal: false,
    close: {
      plain: " I’d be glad to compare notes on what’s working.",
      ask: " Would you be up for a coffee to compare notes?",
      time: " I’m around most of next week.",
    },
  },
};

/** The optional opener for the chosen audience, or null for none. */
export function openerFor(
  inputs: PositioningSource,
  goal: Goal,
  applied: readonly string[] = []
): { kind: string; segments: StorySegment[] } | null {
  const kind = OPENER_KIND[inputs.audience];
  const shape = OPENERS[inputs.audience];
  if (!kind || !shape) return null;
  const on = (id: string) => applied.includes(id);
  const voice = on("direct") ? "direct" : on("soft") ? "soft" : "plain";
  const result = slot(inputs.result, GAPS.result);
  const segments: StorySegment[] = [];
  if (on("thank")) segments.push(text("Thank you for the support so far. "));
  // "Just the essentials" drops the opening line and gets straight to it.
  if (!on("essentials")) segments.push(text(shape.intro[voice]));
  if (on("result")) segments.push(text(" Most recently, I "), result, text("."));
  if (!on("shorter")) {
    segments.push(
      ...shape.body(
        {
          role: slot(inputs.role, GAPS.role),
          own: slot(inputs.own, GAPS.own),
          result,
          strengths: slot(strengthsOf(inputs), GAPS.strengths),
        },
        !on("result")
      )
    );
  }
  // "Name what you want" says the goal outright, even to an audience whose
  // opener would otherwise leave it out.
  if (shape.goal || on("nameWant")) {
    segments.push(
      text(
        on("nameWant")
          ? goal.own
            ? ` ${goal.own}`
            : ` What I want is ${goal.phrase}.`
          : inputs.audience === "Recruiters"
            ? ` I\u2019m open to conversations about ${goal.phrase}.`
            : ` ${towardSentence(goal, "plain", false)}`
      )
    );
  }
  if (on("whyNow")) segments.push(text(" I\u2019d rather plan it together now than leave it to chance."));
  if (on("ask")) {
    segments.push(text(shape.close.ask));
    if (on("time")) segments.push(text(shape.close.time));
  } else {
    segments.push(text((voice === "direct" && shape.close.direct) || shape.close.plain));
  }
  if (on("notes")) segments.push(text(" I can send a short note beforehand."));
  return { kind, segments };
}

const AUDIENCE_NAMES: Record<string, string> = {
  "My manager": "your manager",
  "The exec team": "the exec team",
  Recruiters: "recruiters",
  "A board": "a board",
  "My industry": "people in your industry",
};

/** The recommended next use, pointing at the plan's next stage. */
export function nextUseFor(audience: string, nextStage: string | undefined): string {
  const then = nextStage ? ` Your plan’s next step, “${nextStage}”, builds on it.` : "";
  const who = AUDIENCE_NAMES[audience];
  if (!who) {
    return `Say the narrative out loud once this week, then use the short bio the next time you’re introduced.${then}`;
  }
  if (OPENER_KIND[audience] === "Promotion conversation") {
    return `Use the opener to start your next conversation with ${who} about what’s next.${then}`;
  }
  return `Use the introduction the next time you reach out to ${who}, with the short bio attached.${then}`;
}

/** An output as plain text, gaps in brackets: for editing and exporting. */
export function segmentsToText(segments: StorySegment[]): string {
  return segments.map((segment) => ("gap" in segment ? `[${segment.gap}]` : segment.text)).join("");
}

/* -----------------------------------------------------------------------------
   CHAT (Concept 2)
   -------------------------------------------------------------------------- */

/* Concept 2 is a conversation from the first moment. It says Concept 1's
   things in ExecHQ's own voice, so the logic is shared and only the telling
   differs. */

export const CHAT_C2 = {
  advisor: "ExecHQ",
  role: "Your advisor",
  welcomeTitle: "Welcome to ExecHQ",
  welcomeQuote: "Somewhere to work on what comes next.",
  welcomeLede:
    "I\u2019m a private career advisor. I take you from \u201cI\u2019d like to be\u201d to \u201cI\u2019m going to be\u201d. I don\u2019t just show you the way. I work for you to get you there.",
  welcomeAsk: "Start with your email and we\u2019ll take it from there.",
  emailPlaceholder: "Your email",
  invite: "Do you have an invite code?",
  inviteNo: "No, I don\u2019t",
  invitePlaceholder: "Your invite code",
  inviteThanks: "Got it, that\u2019s added.",
  privacyLead: "Thanks. Before we go any further, one thing you should know.",
  privacy: "Private by design.",
  privacyBody: "I respect your data. It\u2019s your eyes only.",
  privacyReply: "Good to know",
  direction: "Where do you want to go next?",
  directionHint: "A role, a timeline, or just a feeling. Type it, say it, or start with one of these.",
  directionPlaceholder: "In your own words",
  refinementLead: "A few quick questions so I can build a plan that fits you. Skip any you like.",
  skip: "Skip this one",
  skipped: "Skip",
  answerPlaceholder: "Or type your own answer",
  interpretLead: "Here\u2019s what I heard.",
  interpretClose: "Next, I\u2019ll build a plan around this.",
  confirm: "That\u2019s right",
  change: "Change it",
  changePlaceholder: "Say it how you\u2019d put it",
  changed: "Thanks. That\u2019s what I\u2019ll build on.",
  edit: "Change this answer",
  waiting: "Choose an answer above, or type",
  stageEnd: "Your plan is built in the next stage of this concept.",
  /** What the simulated mic "hears" for each kind of question. */
  voice: {
    email: { full: "maya.chen@example.com" },
    invite: { full: "EXEC-4821" },
    reply: { full: "Good to know" },
    answer: { full: "Honestly, nobody above me sees the work my team does." },
    confirm: { full: "That\u2019s right" },
  },
} as const;

/* -----------------------------------------------------------------------------
   SIMULATED WORK
   -------------------------------------------------------------------------- */

/** How long the fake thinking takes. Long enough that the state is real UI,
 *  short enough that walking the flow is not a chore. */
export const GENERATING_MS = 1100;

export const GENERATING_COPY = {
  interpreting: "Reading what you said",
  planning: "Putting a plan together",
  drafting: "Starting your draft",
} as const;

/* -----------------------------------------------------------------------------
   REVIEW SHORTCUTS
   -------------------------------------------------------------------------- */

/** Answers the prototype's step bar fills in when a reviewer jumps past a step
 *  they have not answered, so every later screen has something real to show.
 *  Review scaffolding, never product copy: nothing here appears unless a step
 *  was skipped by jumping. */
export const SAMPLE_ANSWERS = {
  email: "reviewer@example.com",
  /** A prompted direction by id, so it reads exactly as picking one would. */
  directionId: "c-suite",
  refinement: { horizon: "year", audience: "internal", constraint: "visibility" },
} as const;
