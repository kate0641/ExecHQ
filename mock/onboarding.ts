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
   to the user. Each question can echo its answer into the plan's reasoning,
   so the answers visibly count. */

export interface HeardOption extends RefinementOption {
  /** How the interpretation says this answer back: a full sentence in the
   *  second person that says what the answer means, not only what it was. */
  heard: string;
}

export interface TailoredQuestion extends RefinementQuestionSpec {
  options: HeardOption[];
  /** Leave the question out when the direction already answers it. */
  skipIf?: RegExp[];
  /** One sentence for the plan's "Why this one", with {answer} standing in
   *  for the chosen option's label. */
  echo: string;
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
      echo: "It builds the evidence around the step up you picked: \u201c{answer}\u201d.",
    },
    {
      id: "scope-when",
      question: "When do you want to get there?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Within a year", "1\u20132 years", "3+ years", "No fixed timeline").map(withHeard("You want it within a year, so this is a near-term move, not a long campaign.", "You\u2019re giving it one to two years, which is enough time to build the case properly.", "You\u2019re playing a longer game of three years or more, so there\u2019s room to build step by step.", "You haven\u2019t set a timeline, so the pace can fit around your job.")),
      skipIf: SAYS_WHEN,
      echo: "It is paced to your timeline: \u201c{answer}\u201d.",
    },
    {
      id: "scope-block",
      question: "What\u2019s in the way?",
      hint: REFINEMENT_C1.instruction,
      options: opts("No clear path up", "Nobody sees my work", "I can\u2019t make my case", "Wrong company for it").map(withHeard("Right now there\u2019s no clear path up, so part of the job is finding one, or making one.", "Right now nobody sees your work. The results are there; the people deciding just aren\u2019t looking at them.", "Right now you can\u2019t quite make your case. You know you\u2019re ready; it\u2019s putting it into words that\u2019s hard.", "You suspect you\u2019re in the wrong company for it, so the next step may not be where you are now.")),
      echo: "Its first stage tackles what is in the way: \u201c{answer}\u201d.",
    },
  ],
  influence: [
    {
      id: "influence-where",
      question: "Where do you want more say?",
      hint: REFINEMENT_C1.instruction,
      options: opts("My team\u2019s direction", "Company strategy", "Budget and headcount", "Across other teams").map(withHeard("You want more say in your team\u2019s direction: setting it, not just delivering it.", "You want more say in company strategy: a voice in where the business goes, not only in how your part gets there.", "You want more say over budget and headcount, which is where influence becomes real.", "You want more say across other teams, beyond the part of the business you run.")),
      echo: "It starts where you want more say: \u201c{answer}\u201d.",
    },
    {
      id: "influence-who",
      question: "Who do you most need on side?",
      hint: REFINEMENT_C1.instruction,
      options: opts("My boss", "My boss\u2019s peers", "The exec team", "My own team").map(withHeard("Your boss is who you most need on side, so that relationship comes first.", "Your boss\u2019s peers are who you most need on side: the people whose view of you travels upward.", "The exec team is who you most need on side: the people who decide what you get to lead.", "Your own team is who you most need on side, because influence starts with the people who already follow you.")),
      echo: "The first moves are aimed at who you need on side: \u201c{answer}\u201d.",
    },
    {
      id: "influence-block",
      question: "What\u2019s holding you back?",
      hint: REFINEMENT_C1.instruction,
      options: opts("I\u2019m not in the room", "I\u2019m in the room but not heard", "Too junior on paper", "Politics").map(withHeard("You\u2019re not in the room yet. The decisions that matter to you are made without you.", "You\u2019re in the room but not heard. You\u2019re there, but your view doesn\u2019t carry.", "You\u2019re too junior on paper. Your title undersells what you actually do.", "Politics is getting in the way. Being right isn\u2019t enough; you need people behind you.")),
      echo: "Its first stage deals with what holds you back: \u201c{answer}\u201d.",
    },
  ],
  visibility: [
    {
      id: "presence-who",
      question: "Who needs to see you differently?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Leaders in my company", "My industry", "Recruiters and boards", "All of them").map(withHeard("Leaders in your company need to see you differently: as someone they\u2019d promote, not just rely on.", "Your industry needs to see you differently: known beyond your own company.", "Recruiters and boards need to see you differently: as someone on their shortlist.", "Everyone who matters needs to see you differently, inside your company and out.")),
      echo: "It starts with the audience you named: \u201c{answer}\u201d.",
    },
    {
      id: "presence-now",
      question: "How do they see you now?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Strong operator", "Specialist", "Hard worker, low profile", "Not sure").map(withHeard("Today they see a strong operator: someone who delivers, not yet someone who leads.", "Today they see a specialist: expert in one thing, not yet seen as broad enough to lead.", "Today they see a hard worker with a low profile. The work is good; it just isn\u2019t seen.", "You\u2019re not sure how they see you today, so finding out is part of the work.")),
      echo: "It starts from how you are read today: \u201c{answer}\u201d.",
    },
    {
      id: "presence-where",
      question: "Where do you show up today?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Meetings only", "LinkedIn now and then", "Industry events", "Nowhere yet").map(withHeard("Today you only show up in meetings, so your reputation depends on who\u2019s in the room.", "You show up on LinkedIn now and then, which is a start, but not yet a point of view.", "You show up at industry events, so there\u2019s already a stage to build on.", "You don\u2019t show up anywhere yet, so there\u2019s a clean slate to build on.")),
      echo: "It builds out from where you show up now: \u201c{answer}\u201d.",
    },
  ],
  preparation: [
    {
      id: "moment-what",
      question: "What\u2019s coming up?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Promotion conversation", "Performance review", "Board or exec presentation", "Negotiation or offer").map(withHeard("You have a promotion conversation coming up, and you want to walk in with a case, not a hope.", "You have a performance review coming up, and you want it to set up what\u2019s next, not just look back.", "You have a board or exec presentation coming up, the kind of moment people remember.", "You have a negotiation or offer coming up, where what you say in the moment matters.")),
      skipIf: SAYS_WHAT_MOMENT,
      echo: "Everything works back from what is coming up: \u201c{answer}\u201d.",
    },
    {
      id: "moment-when",
      question: "When is it?",
      hint: REFINEMENT_C1.instruction,
      options: opts("This week", "This month", "Next few months", "Not scheduled yet").map(withHeard("It\u2019s this week, so there\u2019s only time for the essentials.", "It\u2019s this month, which is enough time to prepare properly if you start now.", "It\u2019s in the next few months, so there\u2019s time to prepare well rather than cram.", "It isn\u2019t scheduled yet, so you can be ready before the date is set.")),
      skipIf: SAYS_WHEN,
      echo: "It is paced to when that is: \u201c{answer}\u201d.",
    },
    {
      id: "moment-ready",
      question: "How ready do you feel?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Ready, want a check", "Know what, not how", "Not sure where to start", "Dreading it").map(withHeard("You feel ready and want a second opinion before it counts.", "You know what you want to say, but not how to say it.", "You\u2019re not sure where to start, which is normal for a moment like this.", "You\u2019re dreading it, so part of the work is making it feel manageable.")),
      echo: "Its first stage meets you where you are: \u201c{answer}\u201d.",
    },
  ],
  exploration: [
    {
      id: "explore-why",
      question: "What\u2019s making you want a change?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Hit a ceiling", "Lost interest", "Industry is shrinking", "Life has changed").map(withHeard("You\u2019ve hit a ceiling where you are, and staying put isn\u2019t going to move it.", "You\u2019ve lost interest in the work, so this is about what you want to do, not just where.", "Your industry is shrinking, so moving is about staying ahead, not just a change of scene.", "Your life has changed, and your career needs to fit its new shape.")),
      echo: "It starts from what is pushing you: \u201c{answer}\u201d.",
    },
    {
      id: "explore-keep",
      question: "What would you keep?",
      hint: REFINEMENT_C1.instruction,
      options: opts("My function", "My industry", "My seniority", "Nothing in particular").map(withHeard("You\u2019d keep your function: it\u2019s the setting that\u2019s wrong, not the work.", "You\u2019d keep your industry: you know it well, you just need a different place in it.", "You\u2019d keep your seniority, so any move has to be at your level or above.", "Nothing in particular has to stay, so every direction is open.")),
      echo: "The options it tests hold on to what you would keep: \u201c{answer}\u201d.",
    },
    {
      id: "explore-when",
      question: "How soon?",
      hint: REFINEMENT_C1.instruction,
      options: opts("Actively looking", "Within a year", "Just exploring", "Not sure").map(withHeard("You\u2019re actively looking, so this needs to move quickly.", "You want to move within a year, which gives time to test a few directions first.", "You\u2019re exploring rather than actively looking, so there\u2019s time to get this right before you commit.", "You\u2019re not sure how soon, and that\u2019s fine: working out the direction comes first.")),
      skipIf: SAYS_WHEN,
      echo: "It is paced to how soon you want this: \u201c{answer}\u201d.",
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
    .map((question) => question.options.find((o) => o.value === answers[question.id])?.heard)
    .filter((sentence): sentence is string => Boolean(sentence));
  return [directionReadback(direction), ...sentences].join(" ");
}

/** The sentence the plan adds to its reasoning from the first answered
 *  question, or null when nothing was answered. */
export function refinementEcho(
  direction: string,
  answers: Record<string, string>
): string | null {
  for (const question of refinementFor(direction)) {
    const value = answers[question.id];
    const option = question.options.find((o) => o.value === value);
    if (option) return question.echo.replace("{answer}", option.label);
  }
  return null;
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
}

export interface PlanTemplate {
  id: string;
  name: string;
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
    name: "Increase leadership scope",
    bestFor: "A strong performer seeking promotion or a broader remit.",
    emphasis: "Leadership narrative, executive-ready evidence, key conversations.",
    stages: [
      {
        window: "Weeks 1\u20133",
        title: "Name what you lead",
        outcomes: [
          "A leadership narrative you can say out loud",
          "An executive bio in three lengths",
        ],
      },
      {
        window: "Weeks 4\u201310",
        title: "Build the evidence",
        outcomes: [
          "Three results written as scope, not activity",
          "One brief for the conversation you know is coming",
        ],
      },
      {
        window: "Week 11 onward",
        title: "Put it in front of people",
        outcomes: [
          "Two conversations with people who influence the decision",
          "A record of what each one moved",
        ],
      },
    ],
  },
  {
    id: "executive-presence",
    name: "Build executive presence",
    bestFor: "You need greater visibility and a clearer point of view.",
    emphasis: "Positioning, thought leadership, speaking and podcast pitching.",
    stages: [
      {
        window: "Weeks 1\u20132",
        title: "Settle what you stand for",
        outcomes: [
          "A point of view you are willing to defend",
          "A positioning statement that is yours, not your employer's",
        ],
      },
      {
        window: "Weeks 3\u20138",
        title: "Say it somewhere",
        outcomes: [
          "Three pieces published under your own name",
          "A short list of rooms worth being in",
        ],
      },
      {
        window: "Week 9 onward",
        title: "Be asked rather than apply",
        outcomes: [
          "Two pitches sent to events or shows",
          "One inbound approach you did not chase",
        ],
      },
    ],
  },
  {
    id: "inflection-point",
    name: "Prepare for a career inflection point",
    bestFor: "A promotion, role change, review, board presentation or negotiation is ahead.",
    emphasis: "Situation Brief, narrative, stakeholder strategy.",
    stages: [
      {
        window: "This week",
        title: "Get the situation on paper",
        outcomes: [
          "A situation brief: what is being decided, by whom, against what",
          "The two objections you have not answered yet",
        ],
      },
      {
        window: "Before the date",
        title: "Prepare the case",
        outcomes: [
          "A ninety-second account of yourself",
          "Evidence for each claim in it",
        ],
      },
      {
        window: "After",
        title: "Bank what happened",
        outcomes: [
          "What was said, while you still remember it",
          "The next move, decided rather than drifted into",
        ],
      },
    ],
  },
  {
    id: "current-org",
    name: "Strengthen influence in the current organisation",
    bestFor: "You intend to grow where you are.",
    emphasis: "Strategic communication, executive presence, internal opportunity framing.",
    stages: [
      {
        window: "Weeks 1\u20133",
        title: "Make the work legible",
        outcomes: [
          "Your remit described in the terms your leadership uses",
          "One result reframed as organisational impact",
        ],
      },
      {
        window: "Weeks 4\u20139",
        title: "Widen who hears it",
        outcomes: [
          "Three people outside your function who know what you do",
          "A standing reason to be in one room you are not in",
        ],
      },
      {
        window: "Quarter onward",
        title: "Be counted on for something",
        outcomes: [
          "One problem that comes to you by default",
          "A scope change you asked for rather than waited for",
        ],
      },
    ],
  },
  {
    id: "explore",
    name: "Explore and clarify a next direction",
    bestFor: "You feel a ceiling but cannot name a role.",
    emphasis: "Direction refinement, transferable narrative, low-risk exploratory actions.",
    stages: [
      {
        window: "Weeks 1\u20132",
        title: "Find out what travels",
        outcomes: [
          "What you are good at, separated from where you did it",
          "The parts of the job you would not miss",
        ],
      },
      {
        window: "Weeks 3\u20138",
        title: "Test it cheaply",
        outcomes: [
          "Four conversations with people doing something adjacent",
          "Two directions ruled out on evidence rather than nerve",
        ],
      },
      {
        window: "Week 9 onward",
        title: "Name it",
        outcomes: [
          "A direction specific enough to plan against",
          "A narrative that makes the move look deliberate",
        ],
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
export const CONNECT_FIELDS = {
  heading: "Anything else you want us to know?",
  hint: "Optional. It sharpens later drafts and changes nothing about the one you already have.",
  linkedinLabel: "LinkedIn",
  websiteLabel: "Personal website",
  fields: [
    { id: "followers", label: "Followers", group: "linkedin" },
    { id: "posts", label: "Posts, last 90 days", group: "linkedin" },
    { id: "reactions", label: "Median reactions", group: "linkedin" },
    { id: "website", label: "Address", group: "website" },
  ],
  saveLabel: "Save and go to my homepage",
  skipLabel: "Go to my homepage",
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
  directionId: "bigger-org",
  refinement: { horizon: "year", audience: "internal", constraint: "visibility" },
} as const;
