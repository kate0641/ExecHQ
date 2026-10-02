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

/** The goal the plan works toward, for "Stage by stage, toward …". */
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
  /** Where the first draft of the story can be used, for this plan. Three
   *  short ideas, shown under the draft. */
  uses?: string[];
  /** How the stages run, e.g. "Stage by stage". Never a length: by decision
   *  on 2026-09-29 a plan has no end date. */
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
      detail: "The version you\u2019d say out loud in a meeting. We\u2019ll write the first draft for you next.",
      why: "Every conversation about a bigger role starts with \u201cwhat do you lead?\u201d",
    },
    uses: [
      "When someone asks what\u2019s next for you",
      "To open your next 1:1 with your manager",
      "As the start of your LinkedIn About section",
    ],
    horizon: "Stage by stage",
    after: "Once these stages are done, we\u2019ll plan the next stretch together, based on what worked and what didn\u2019t.",
    stages: [
      {
        window: "First",
        title: "Say what you lead",
        outcomes: [
          "The story of what you lead, ready to say out loud",
          "A bio in short, medium and long versions",
        ],
        done: "You can describe your scope in a sentence, and your bio is ready to send.",
      },
      {
        window: "Next",
        title: "Show the proof",
        outcomes: [
          "Three wins written up to show how much you ran, not just what you did",
          "Talking points for your next career conversation",
        ],
        done: "Your manager has seen your three wins, in writing.",
      },
      {
        window: "Then",
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
      detail: "The short version of who you are and what you stand for, in your words, not your employer\u2019s. We\u2019ll write the first draft for you next.",
      why: "Everything you say in public builds on it.",
    },
    uses: [
      "When you\u2019re introduced at a meeting or event",
      "As the start of your LinkedIn About section",
      "Before you post or speak, to check it says the same thing",
    ],
    horizon: "Stage by stage",
    after: "Once these stages are done, we\u2019ll plan the next stretch together, based on what worked and what didn\u2019t.",
    stages: [
      {
        window: "First",
        title: "Decide what you stand for",
        outcomes: [
          "How you describe yourself, in your words, not your employer\u2019s",
          "A point of view you\u2019re willing to defend",
        ],
        done: "You can say what you stand for in one sentence, without mentioning where you work.",
      },
      {
        window: "Next",
        title: "Say it in public",
        outcomes: [
          "Three posts or articles under your own name",
          "A short list of events and groups worth being part of",
        ],
        done: "Three pieces are published, and you know which rooms you want to be in.",
      },
      {
        window: "Then",
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
      detail: "What you\u2019ve done, what you want, and why it should be you. We\u2019ll write the first draft for you next.",
      why: "It\u2019s the core of your case, and the thing you\u2019ll rehearse.",
    },
    uses: [
      "As the first thing you say in the room",
      "Out loud, twice, before the day",
      "In the note that sets up the meeting",
    ],
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
      detail: "What you\u2019re responsible for, in the words your leadership already uses. We\u2019ll write the first draft for you next.",
      why: "Your work gets heard when it\u2019s described in the terms decisions are made in.",
    },
    uses: [
      "In your next update to your leadership",
      "To open your next 1:1 with your manager",
      "When you meet a peer from another team",
    ],
    horizon: "Stage by stage",
    after: "Once these stages are done, we\u2019ll plan the next stretch together, based on what worked and what didn\u2019t.",
    stages: [
      {
        window: "First",
        title: "Make your work easy to see",
        outcomes: [
          "Your role described in the words your leadership uses",
          "One recent win reframed as impact on the business",
        ],
        done: "Your role and one win are written in your leadership\u2019s language, ready to use.",
      },
      {
        window: "Next",
        title: "Widen who hears about it",
        outcomes: [
          "Three people outside your team who know what you do",
          "A regular reason to be in one meeting you\u2019re not in yet",
        ],
        done: "Three people outside your team could explain what you do.",
      },
      {
        window: "Then",
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
      detail: "What you do well, separated from where you\u2019ve done it. We\u2019ll write the first draft for you next.",
      why: "It shows which strengths go with you anywhere, before you choose where.",
    },
    uses: [
      "In a first coffee with someone in a field you\u2019re curious about",
      "When someone asks what you\u2019re looking for",
      "As the start of your LinkedIn About section",
    ],
    horizon: "Stage by stage",
    after: "Once these stages are done, we\u2019ll plan the next stretch together, based on what worked and what didn\u2019t.",
    stages: [
      {
        window: "First",
        title: "Work out what travels",
        outcomes: [
          "What you\u2019re good at, separated from where you\u2019ve done it",
          "The parts of the job you wouldn\u2019t miss",
        ],
        done: "You have a short list of strengths that would matter anywhere.",
      },
      {
        window: "Next",
        title: "Test it cheaply",
        outcomes: [
          "Four conversations with people in adjacent roles",
          "Two directions ruled out on evidence, not nerves",
        ],
        done: "You\u2019ve crossed at least two options off, for real reasons.",
      },
      {
        window: "Then",
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
  /** The story, saved: a first draft, or sharpened. */
  storyDraft: "Your story, first draft",
  storySharpened: "Your story",
  /** The quick win that comes next, on the plan. */
  nextLabel: "Next on your plan",
  nextWhy: "Why now:",
  inviteTitle: "Build out your signals",
  inviteBody: "Bring in your LinkedIn numbers to see how far your posts reach. Optional, and you can do it anytime.",
  home: "Go to my homepage",
  signals: "Build out your signals",
  homeHref: "/homepage/concept-1",
} as const;

/** What reading a LinkedIn analytics export gives us, by decision on
 *  2026-09-28: the export's five sheets (Discovery, Engagement, Top posts,
 *  Followers, Demographics). Post performance and who sees it. It has no
 *  headline, About section, post text or role, so nothing here may claim to
 *  know those. */
export const MOCK_LINKEDIN_CONTEXT = {
  range: "the last year",
  posts: 38,
  impressions: 41200,
  membersReached: 12900,
  followers: 4820,
  newFollowers: 214,
  topAudience: { seniority: "Senior", jobTitle: "Marketing Director", industry: "Software" },
} as const;

/** Concept 1's signals page: optional, after onboarding has ended. The
 *  product's own word — the Signal Background — for what is connected. */
export const SIGNALS_C1 = {
  eyebrow: "Optional",
  title: "Build out your signals",
  hint: "Bring in what\u2019s already out there, and we\u2019ll use it to shape your plan and your drafts.",
  privacy: "Nothing is ever posted or shared. Disconnect anytime.",
  add: "Add",
  skip: "Skip for now",
  done: "Done",
  sources: [
    {
      id: "linkedin",
      mark: "in",
      title: "LinkedIn",
      why: "So we can see how far your posts reach, and who they reach.",
      imported: `${MOCK_LINKEDIN_CONTEXT.posts} posts and your audience, from ${MOCK_LINKEDIN_CONTEXT.range}`,
      use: "Used only to shape your plan and your drafts.",
      connectLabel: "",
      connecting: "",
      pasteLabel: "",
      linkLabel: "",
      placeholder: "",
      canImport: false,
    },
  ],
} as const;

/** One step of the LinkedIn export, in parts: plain text, what to press
 *  (bold), or the link to LinkedIn's analytics page. */
export type UploadStepPart = { text: string } | { press: string } | { link: string; href: string };

/** LinkedIn's creator analytics page, where the export lives. */
export const LINKEDIN_ANALYTICS_URL = "https://www.linkedin.com/analytics/creator/content/";

/**
 * The LinkedIn upload, shared by all three concepts, by decision on
 * 2026-09-28. The first three steps are LinkedIn's own and cannot change; the
 * fourth is ours. Past 365 days, since senior leaders often post only a few
 * times a quarter and 90 days may hold none.
 */
export const LINKEDIN_UPLOAD = {
  eyebrow: "Optional \u00b7 LinkedIn",
  title: "Bring in your LinkedIn numbers",
  lede: "A spreadsheet LinkedIn gives you, showing how far your posts reach and who sees them. It takes about a minute, on a computer.",
  stepsLabel: "How to get it",
  steps: [
    [{ text: "Open " }, { link: "your LinkedIn analytics", href: LINKEDIN_ANALYTICS_URL }, { text: "." }],
    [{ text: "At the top, choose " }, { press: "Past 365 days" }, { text: "." }],
    [{ text: "Press " }, { press: "Export" }, { text: ", then " }, { press: "Confirm" }, { text: ". A spreadsheet downloads." }],
    [{ text: "Upload it here." }],
  ] as UploadStepPart[][],
  linkNote: "Opens LinkedIn in a new tab",
  upload: "Upload the spreadsheet",
  uploadHint: "The .xlsx file from step 3",
  chooseAgain: "Choose a different file",
  tryAgain: "Try again",
  noExport: "I don\u2019t see Export",
  noExportBody:
    "Analytics show once you\u2019ve posted at least once. If you haven\u2019t posted yet, leave this for now: your plan will help you start.",
  phone: "On your phone? Email me these steps",
  status: {
    reading: "Reading it now. Carry on, and it\u2019ll be ready by the time you need it.",
    ready: `${MOCK_LINKEDIN_CONTEXT.posts} posts and your audience, from ${MOCK_LINKEDIN_CONTEXT.range}.`,
    empty: "Read it. No posts in the last year, so there\u2019s nothing to measure yet. Your plan will help you start.",
    wrongFile:
      "That doesn\u2019t look like a LinkedIn analytics export. It should be the .xlsx from step 3. Try again, or leave it for now.",
    failed: "That didn\u2019t upload. Nothing was saved. Try again, or carry on without it.",
    sent: (email: string) =>
      `Sent to ${email}. Do it on your computer when you\u2019re ready. It\u2019ll be on your plan too.`,
  },
  /** Short status for a list row. */
  short: { reading: "Reading\u2026", ready: "Ready", empty: "Read", sent: "Steps sent" },
  privacy: "Nothing is posted or shared. Delete the file anytime.",
  remove: "Remove it",
  done: "Continue",
  skip: "Not now",
} as const;

/** Whether a chosen file could be a LinkedIn analytics export: the one check
 *  the prototype makes. Nothing is read; only the name is looked at. */
export function looksLikeLinkedInExport(fileName: string): boolean {
  return /\.xlsx?$/i.test(fileName.trim());
}

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

/** Copy, Download and Email for the builder's outputs: each takes everything. */
export const STORY_EXPORTS = [
  { label: POSITIONING_C1.copy, done: POSITIONING_C1.copied },
  { label: EXPORT_ACTIONS.downloadLabel, done: EXPORT_ACTIONS.downloaded },
  { label: EXPORT_ACTIONS.emailLabel, done: EXPORT_ACTIONS.emailed },
];

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

/** How each Concept 1 prompt opens the draft. */
const PROMPT_TOWARD_LINE: Record<string, string> = {
  "C-suite in 3 years": "I’m building toward a C-suite role within the next three years.",
  "Take on more of a leadership role": "I’m building toward a bigger leadership role where I am.",
  "Be seen as an executive": "I’m working on being seen as an executive.",
  "Nail an upcoming board presentation": "I have a board presentation ahead of me, and I want it to land.",
  "Find my next move": "I’m working out my next move.",
};

/** Each refinement answer in the user's own voice, in the order of its
 *  options: the read-back's "heard" line, turned round to first person. */
const SAID: Record<string, string[]> = {
  "scope-kind": [
    "What I want next is a bigger team, and the weight that comes with leading it.",
    "What I want next is a broader remit: more of the business, not more of the same work.",
    "What I want next is a seat at the top table, in the room where the big calls get made.",
    "What I want next is the title, so I’m named for the role I’m already doing.",
  ],
  "scope-when": [
    "I want to get there within a year.",
    "I’m giving it one to two years, to build the case properly.",
    "I’m playing a longer game, and building toward it step by step.",
    "I haven’t set a timeline, so I can build toward it alongside my current role.",
  ],
  "scope-block": [
    "There’s no clear path up yet, so part of the work is finding one.",
    "The results are there. My focus now is making sure the people who decide can see them.",
    "I know I’m ready. What I’m working on is making the case clearly.",
    "The next step may not be where I am now, and I’m open to that.",
  ],
  "influence-where": [
    "I want more say in my team’s direction: setting it, not just delivering it.",
    "I want a voice in company strategy, not only in how my part delivers it.",
    "I want more say over budget and headcount, where influence becomes real.",
    "I want my influence to reach across other teams, beyond the part of the business I run.",
  ],
  "influence-who": [
    "Getting my boss on side comes first.",
    "My boss’s peers matter most: their view of me travels upward.",
    "The exec team matters most: they decide what I get to lead.",
    "It starts with my own team, the people who already follow me.",
  ],
  "influence-block": [
    "Right now the decisions that matter to me are made without me in the room.",
    "I’m in the room. What I’m working on is making my view carry.",
    "My title undersells what I actually do.",
    "Being right isn’t enough here, so I’m building support behind my ideas.",
  ],
  "presence-who": [
    "I want leaders in my company to see me as someone they’d promote, not just rely on.",
    "I want to be known across my industry, beyond my own company.",
    "I want to be on the shortlist for recruiters and boards.",
    "I want to be seen differently by everyone who matters, inside my company and out.",
  ],
  "presence-now": [
    "Today I’m seen as a strong operator. Next, I want to be seen as a leader.",
    "Today I’m seen as a specialist. Next, I want to be seen as broad enough to lead.",
    "The work is good. It just isn’t seen yet.",
    "Part of the work is finding out how I’m seen today.",
  ],
  "presence-where": [
    "Today my reputation lives in the meetings I’m in.",
    "I post on LinkedIn now and then, and I’m ready to have a point of view.",
    "I already have a stage at industry events to build on.",
    "I’m starting from a clean slate, so I get to choose how I show up.",
  ],
  "moment-what": [
    "I have a promotion conversation coming up, and I want to walk in with a case.",
    "I have a performance review coming up, and I want it to set up what’s next.",
    "I have a board or exec presentation coming up, and I want it remembered.",
    "I have a negotiation coming up, where what I say in the moment matters.",
  ],
  "moment-when": [
    "It’s this week, so I’m focused on the essentials.",
    "It’s this month, which is enough time to prepare properly.",
    "It’s a few months away, so I have time to prepare well.",
    "It isn’t scheduled yet, so I can be ready before it is.",
  ],
  "moment-ready": [
    "I feel ready, and I want it checked before it counts.",
    "I know what I want to say. I’m working on how to say it.",
    "I’m working out where to start.",
    "I’m preparing early, so it feels manageable when it comes.",
  ],
  "explore-why": [
    "I’ve hit a ceiling where I am, and staying put won’t move it.",
    "I want work I care about again, not just a new place to do it.",
    "My industry is shrinking, and I want to move ahead of it.",
    "My life has changed, and I want a career that fits its new shape.",
  ],
  "explore-keep": [
    "I’d keep my function. It’s the setting I want to change, not the work.",
    "I’d keep my industry, and find a different place in it.",
    "Whatever comes next has to be at my level or above.",
    "Every direction is open.",
  ],
  "explore-when": [
    "I’m actively looking.",
    "I want to move within a year, and test a few directions first.",
    "I’m exploring, so I can get this right before I commit.",
    "Working out the direction comes before the timing.",
  ],
};

/** The three facts sharpening asks for. Any can be left empty. */
export interface SharpenFacts {
  role: string;
  own: string;
  result: string;
}

/** True once any of the three facts is in, so the story counts as sharpened
 *  and the next quick win moves on to the bio. */
export function isSharpened(facts: SharpenFacts): boolean {
  return Boolean(facts.role.trim() || facts.own.trim() || facts.result.trim());
}

/** The draft's opening: what the user does, from whichever facts they gave. */
function doingLine({ role, own }: SharpenFacts): string | null {
  const r = role.trim();
  const o = own.trim();
  if (r && o) return `I’m ${r}, leading ${o}.`;
  if (r) return `I’m ${r}.`;
  if (o) return `I lead ${o}.`;
  return null;
}

/** The goal as the draft says it: a prompt's own line, a typed first-person
 *  answer in the user's words, or anything else as what they're building
 *  toward. */
function towardLine(direction: string): string {
  const typed = direction.trim().replace(/[.]$/, "");
  if (PROMPT_TOWARD_LINE[typed]) return PROMPT_TOWARD_LINE[typed];
  if (/^i\b|^i’|^i'/i.test(typed)) return withFullStop(sentenceCase(typed));
  return `I’m building toward ${typed}.`;
}

/**
 * The first draft of the story: what they do (once sharpened), where they're
 * going, a sentence per chosen refinement answer, and a result (once
 * sharpened). A typed refinement answer is left out rather than turned into
 * first person badly: the read-back already said it back in their words.
 */
export function firstDraftFor(
  direction: string,
  answers: Record<string, string>,
  facts: SharpenFacts
): string {
  const said = refinementFor(direction)
    .map((question) => {
      const index = question.options.findIndex((o) => o.value === answers[question.id]);
      return index >= 0 ? SAID[question.id]?.[index] : undefined;
    })
    .filter((line): line is string => Boolean(line));
  const result = facts.result.trim()
    ? `Most recently, I ${withFullStop(facts.result.trim().replace(/^i\s+/i, ""))}`
    : null;
  return [doingLine(facts), towardLine(direction), ...said, result]
    .filter(Boolean)
    .join(" ");
}

/** The first thing on the plan after onboarding: sharpen the story if they
 *  left it as it was, the bio once it is sharpened. */
export function quickWinFor(
  plan: PlanTemplate | undefined,
  sharpened: boolean
): { title: string; detail: string; why: string } {
  return sharpened
    ? {
        title: "Write your bio",
        detail: "Short, medium and long, built from your story and ready to send ahead of you.",
        why: "It’s what goes ahead of you: to a recruiter, an event, a new boss.",
      }
    : {
        title: "Sharpen your story",
        detail: "Add your role and one result, so your draft is ready to say in a meeting.",
        why: plan?.thisWeek?.why ?? "Every next step starts with saying what you lead.",
      };
}

/** Concept 1's first-draft screen. */
export const DRAFT_C1 = {
  eyebrow: "This week · Your story",
  title: "Here’s how you’d say it",
  hint: "Written only from what you’ve told us. Use it as it is, or make it sharper.",
  label: "First draft",
  sharpenedLabel: "Your story",
  usesLabel: "Where you could use it",
  sharpenLead: "Add your role and one result to make it yours. Or skip it, and it goes on your plan for this week.",
  sharpenedLead: "Want to change what you added? You can sharpen it again.",
  sharpen: "Sharpen it now",
  sharpenAgain: "Sharpen it again",
  save: "Save it and finish",
  writing: "Writing your first draft",
  copied: "Copied your story.",
} as const;

/** Copy, Download and Email for the first draft. */
export const DRAFT_EXPORTS = [
  { label: POSITIONING_C1.copy, done: DRAFT_C1.copied },
  { label: EXPORT_ACTIONS.downloadLabel, done: EXPORT_ACTIONS.downloaded },
  { label: EXPORT_ACTIONS.emailLabel, done: EXPORT_ACTIONS.emailed },
];

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
  /** Before the direction question: why it comes first, and that a loose
   *  answer is as good a start as a precise one. */
  directionLead: "Next comes the part everything else builds on, which is where you\u2019re headed.",
  directionWhy:
    "You might have a clear goal, like a title and a date. Or just a sense that it\u2019s time for more. I can work with either, and we can change it as your goals change.",
  direction: "Where do you want to go next?",
  directionHint: "Type it, say it, or start with one of these.",
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
  planLead: "Here\u2019s your starting point. It\u2019s built from what you told me, and it grows with you.",
  planUse: "Use this plan",
  planOthers: "See other plans",
  planWhich: "Here are the others. Which would you like to see?",
  planRecommended: "(my pick)",
  /** Opens the full plan in a sheet. */
  planFull: "See the full plan",
  planClose: "Done",
  draft: {
    eyebrow: "Draft",
    approved: "Approved",
    approve: "Looks good",
    change: "Change it",
    changePlaceholder: "Write it how you\u2019d say it",
    rewritten: "Here it is in your words. Does it read right?",
  },
  storyAlso: (openerKind: string | null) =>
    openerKind
      ? `Also: your bio in three lengths, and a ${openerKind.toLowerCase()} opener.`
      : "Also: your bio in three lengths.",
  storyOpen: "See all of it",
  revisedStatus: (label: string) => `Changed: ${label.toLowerCase()}`,
  builder: {
    role: { question: "What\u2019s your current role?", placeholder: "e.g. VP of Marketing" },
    own: { question: "What are you responsible for?", placeholder: "e.g. brand and demand" },
    strengths: {
      question: "What are you strongest at?",
      hint: "Pick up to three.",
      placeholder: "Or type your own",
      done: "That\u2019s all",
    },
    result: { question: "What\u2019s a result you\u2019re proud of?", placeholder: "e.g. grew pipeline 40% in a year" },
  },
  /** The story's first draft, handed over after the plan, by decision on
   *  2026-09-28. Sharpening is three questions and one review. */
  storyDraft: {
    lead: "Good. First on it is your story, so here\u2019s a first draft of how you\u2019d say it.",
    eyebrow: "First draft",
    sharpenedEyebrow: "Sharpened",
    title: "Your story",
    offer: "It\u2019s yours to use as it is. Or tell me your role and one result, and I\u2019ll sharpen it now.",
    asIs: "Use it as it is",
    sharpen: "Sharpen it now",
    sharpenLead: "Three quick ones, then. Skip any you like.",
    review: "Here it is, sharpened. Does it sound like you?",
    unchanged: "Nothing added, so it stays as it was. Does it still sound like you?",
  },
  /** The ending: the win, then signals as an optional extra. */
  doneLead: "Saved. That\u2019s everything we needed today.",
  doneInvite:
    "One more thing, if you like: build out your signals. Bring in your LinkedIn numbers, and your plan and drafts start from how you already show up. It\u2019s optional, and you can do it anytime.",
  doneSignals: "Build out my signals",
  doneHome: "Go to my homepage",
  signals: {
    notNow: "Not now",
    /** LinkedIn is an upload, by decision on 2026-09-28: the analytics
     *  spreadsheet the user exports. It holds post performance and audience,
     *  so that is all this promises. */
    linkedinWhat:
      "LinkedIn gives you a spreadsheet of how your posts have done and who\u2019s seen them. Bring it here and I\u2019ll use it to shape your plan. It takes a minute, on a computer, and nothing is posted or shared.",
    upload: "Upload the spreadsheet",
    emailSteps: "Email me the steps",
    attach: "Attach the LinkedIn spreadsheet",
    reading: "Got it. I\u2019m reading it now, so carry on. I\u2019ll tell you when it\u2019s ready.",
    ready: `Your LinkedIn spreadsheet is ready: ${MOCK_LINKEDIN_CONTEXT.posts} posts and your audience, from ${MOCK_LINKEDIN_CONTEXT.range}.`,
    uploadPlaceholder: "Attach it here",
    end: "You\u2019re all set. Nothing is ever posted or shared, and you can disconnect anytime.",
    endNone: "No problem. You can add it anytime.",
  },
  /** What the simulated mic "hears" for each kind of question. */
  voice: {
    email: { full: "maya.chen@example.com" },
    invite: { full: "EXEC-4821" },
    reply: { full: "Good to know" },
    answer: { full: "Honestly, nobody above me sees the work my team does." },
    confirm: { full: "That\u2019s right" },
    plan: { full: "Use this plan" },
    role: { full: "VP of Marketing" },
    own: { full: "Brand and demand" },
    strengths: { full: "Building teams" },
    result: { full: "Grew pipeline 40% in a year" },
    approve: { full: "Looks good" },
    asIs: { full: "Use it as it is" },
    signals: { full: "Build out my signals" },
  },
} as const;

/* -----------------------------------------------------------------------------
   CONCEPT 3: THE GUIDED ONBOARDING
   -------------------------------------------------------------------------- */

/**
 * Concept 3 explains as it goes, by decision on 2026-09-24: what ExecHQ is,
 * why each thing is asked, what a plan is and how each part helps. It asks
 * what decides the plan, recommends once, then asks what makes it the user's
 * own (2026-09-30), carries a file of what it has learned, and stops to make
 * the user reflect.
 *
 * Credibility comes only from how the product is built. The one outside claim
 * is the fun fact after each reflection: each is a real finding, with its
 * source shown, and none ranks the user: the pilot rules out rank and
 * percentile.
 */
export const GUIDE_C3 = {
  from: "ExecHQ",
  parts: ["About ExecHQ", "About you", "Your plan", "Your story"],
  /** The answer drawer's own words. */
  drawer: {
    answer: "Answer",
    next: "Next",
    continue: "Continue",
    skip: "Skip",
    peek: "Tap to answer",
    peekAnswered: "Answered",
    fold: "Fold the drawer down to read the page",
    said: "You said",
    change: "Change",
    back: "Back",
  },
  file: { label: "What ExecHQ knows so far", added: "Added" },
  welcome: {
    wordmark: "ExecHQ",
    title: "Somewhere to work on what comes next.",
    lede: "Your private career advisor that doesn\u2019t just show you the way \u2014 it works for you and with you to get you there.",
    quote: "From \u201cI\u2019d like to be\u201d to \u201cI\u2019m going to be.\u201d",
    cta: "Get started",
  },
  about: {
    kicker: "What ExecHQ is",
    title: "Crafting a plan for your career and the work to carry it out",
    lede: "A private career advisor for modern professionals ready to grow, with no agenda but your own.",
    points: [
      {
        title: "A plan for where you want to go",
        detail: "Short-, medium-, and long-term steps with clear benchmarks. Not a list of forty tasks that get you nowhere.",
      },
      {
        title: "Work done, not just advice",
        detail: "Most steps come with artifacts made for you to use: ExecHQ drafts them, you make them yours.",
      },
      {
        title: "Something that grows with you",
        detail: "Finish a step, share what happened, or change direction, and ExecHQ updates the plan.",
      },
    ],
    before: [
      {
        title: "Private by design",
        detail: [
          "For your eyes only. Not your employer, not your manager, not anyone else.",
          "Everything ExecHQ makes is yours to keep, edit, and export.",
        ],
      },
    ],
    cta: "Continue",
  },
  account: {
    kicker: "Your account",
    ask: "What\u2019s your email?",
    title: "First, somewhere to keep all this",
    lede: "Your plan and your story are saved to your account, so you can come back to them.",
    inviteShow: "I have an invite code",
    inviteHide: "I don\u2019t have a code",
    why: "Everything you tell ExecHQ builds on what came before. Your account is how it remembers, and how you come back to it.",
    cta: "Continue",
  },
  signals: {
    kicker: "Optional",
    title: "Want ExecHQ to start from how you already show up?",
    lede: "Bring in your LinkedIn numbers, and ExecHQ will see how you already show up.",
    why: "Your posts show how far you already reach, and who you reach. That shapes your plan, and it\u2019s read while you carry on.",
    done: "Continue",
    skip: "Skip for now",
  },
  /** The LinkedIn upload page, reached from Signals. */
  linkedin: {
    why: "Bringing it in now means it\u2019s read while you do the rest. By the end, ExecHQ will know how far your posts reach, and who they reach.",
    /** How the summary file on the last page says a file with no posts. */
    fileEmpty: "No posts in the last year yet",
  },
  direction: {
    kicker: "Where you\u2019re going",
    title: "Where do you want to go next?",
    lede: "Pick as many as are true.",
    promptedLabel: "Or start with one of these",
    /** More than one picked: which to start from. */
    first: "Which matters most right now?",
    firstLede: "ExecHQ will start there, and keep the rest in view.",
    /** Why the second question is asked, on its own: the first is already answered. */
    firstWhy: "Your plan needs a first step. Starting from the one that matters most gives it a clear direction, and the rest stay in view.",
    why: "Everything ExecHQ builds points here. Pick all that are true, and it will start with the one that matters most.",
    cta: "Continue",
  },
  rec: {
    kicker: "ExecHQ\u2019s recommendation",
    title: "Here\u2019s where ExecHQ would start",
    lead: "From what you\u2019ve shared, ExecHQ would start you on",
    next: "Next, a few quick questions to make it yours.",
    /** The other directions picked, said so they are not lost. */
    also: (goals: string) => `You also picked ${goals}. ExecHQ will keep that in view as your plan grows.`,
    why: "You should get a clear starting point, not a menu of options. ExecHQ will show you how it got there, and you can always change it.",
    cta: "Make it mine",
  },
  reflect: {
    kicker: "A question to sit with",
    answerLabel: "Your answer",
    time: {
      title: "How much time do you spend on your career each week?",
      lede: "Not your job. Your career: thinking about what\u2019s next, and working toward it.",
      label: "Time on your career",
      options: ["None, honestly", "Under an hour", "An hour or two", "More than that"],
      replies: [
        "That\u2019s an honest answer, and a useful one. Your plan starts with work you already do, the meetings and the writing, and makes each one count toward where you\u2019re going.",
        "Then every minute has to count. Your plan puts the highest-value step first, so the little time you give goes where it moves you most.",
        "That\u2019s enough to move, if it\u2019s aimed. Your plan gives that time a direction, so it builds from one week to the next.",
        "Then the question isn\u2019t effort, it\u2019s aim. Your plan makes sure the time you already give builds toward one thing.",
      ],
      fact: {
        label: "Fun fact",
        text: "Employees spend only about 1% of a typical working week on learning and development. That is around 24 minutes.",
        source: "Bersin by Deloitte, \u201cMeet the Modern Learner\u201d",
      },
      why: "Careers move in the time you give them. Knowing yours sets the pace of your plan, so it asks for what you can actually do.",
    },
    cta: "Continue",
  },
  /** The question that decides the plan, asked before anything is recommended
   *  (2026-09-30). Only some directions have one. */
  decide: {
    kicker: "Before ExecHQ recommends anything",
  },
  /** The questions that make the plan the user\u2019s own, asked after it. */
  questions: {
    kicker: "Making it yours",
    typedLabel: "Or in your own words",
    skip: "Skip this one",
    whyDefault: "Each answer shapes how your plan and your story are put, so they sound like you and not like anyone.",
    /** Why each question is asked, said plainly. */
    why: {
      "scope-kind": "A step up can mean more people, more of the business, or a different seat. Each needs a different case.",
      "scope-when": "The timeline sets the pace: a near-term move and a three-year climb start in different places.",
      "scope-block": "What\u2019s in the way decides what to do first, so ExecHQ asks it before it recommends a plan.",
      "influence-where": "Influence is always over something. Knowing what tells ExecHQ where your plan should push.",
      "influence-who": "Influence travels through people. Knowing whose backing matters most tells ExecHQ where to start.",
      "influence-block": "What\u2019s holding you back decides what to do first, so ExecHQ asks it before it recommends a plan.",
      "presence-who": "Being seen means being seen by someone. The audience decides the kind of presence you build.",
      "presence-now": "How you\u2019re seen today is the starting line. The plan closes the gap between that and how you want to be seen.",
      "presence-where": "Where you show up today tells ExecHQ what to build on, and what to start from scratch.",
      "moment-what": "Each kind of moment needs a different kind of preparation.",
      "moment-when": "The date sets how much there\u2019s time for, and what to leave out.",
      "moment-ready": "How ready you feel tells ExecHQ whether to check your case or help you build it.",
      "explore-why": "Why you want a change says a lot about where to look, so ExecHQ asks it before it recommends a plan.",
      "explore-keep": "What you\u2019d keep narrows the options to the ones worth testing.",
      "explore-when": "How soon decides how much testing there\u2019s time for.",
    } as Record<string, string>,
    cta: "Continue",
  },
  reflect2: {
    ceo: {
      title: "If your CEO described what you do, would they get it right?",
      lede: "Not your title. What you actually lead, and what it\u2019s worth to the business.",
      label: "Who knows your work",
      options: ["Yes, exactly", "Roughly", "Probably not", "They don\u2019t know me"],
      replies: [
        "Then your work is already visible where it counts. Your plan makes sure that story reaches the people you haven\u2019t met yet.",
        "Roughly is a risky place to be: close enough to be trusted, not clear enough to be chosen. The story we\u2019ll write together is how you fix it.",
        "Then the gap isn\u2019t your work, it\u2019s the telling. That\u2019s exactly what we\u2019ll build first.",
        "Then that\u2019s where we start. It\u2019s hard for anyone to back you if they don\u2019t know what you do.",
      ],
      fact: {
        label: "Fun fact",
        text: "In a survey of 3,213 professionals, nearly one in four said they sponsor someone at work. Of those, only 27% actually advocate for that person\u2019s promotion.",
        source: "Center for Talent Innovation, 2019",
      },
      why: "Whether the people above you can say what you do decides a lot of what happens next. It\u2019s worth knowing where you stand.",
    },
    conversation: {
      title: "When did you last talk to your manager about what\u2019s next for you?",
      lede: "A real conversation about your career, not your targets.",
      label: "Last career conversation",
      options: ["This month", "In the last six months", "Over a year ago", "Never, really"],
      replies: [
        "Good. Then the next one can be sharper: your plan will give you something specific to bring.",
        "Then one is due. Your plan will make sure you walk in with a clear ask, not just an update.",
        "That\u2019s a long time for your manager to guess at what you want. Your plan puts that conversation back on the calendar, with something to say.",
        "Then your manager is guessing. The first thing your plan will do is give you the words to start that conversation.",
      ],
      fact: {
        label: "Fun fact",
        text: "Only 20% of US employees strongly agree they have talked with their manager in the last six months about the steps they can take to reach their goals.",
        source: "Gallup",
      },
      why: "The people who decide your next role can only back what they know you want.",
    },
  },
  readback: {
    kicker: "What ExecHQ heard",
    title: "Here\u2019s what ExecHQ heard",
    recLead: "So ExecHQ would start you on",
    checked: "Checked against your answers",
    why: "So you can check ExecHQ has understood you before it builds anything on it. If it has got something wrong, now is the time.",
    confirm: "That\u2019s right",
    change: "Change it",
    editLabel: "How would you put it?",
    save: "Save",
    cancel: "Cancel",
  },
  plan: {
    kicker: "Your plan",
    intro: {
      title: "What a plan is",
      lede: "A plan is how you get from where you are to where you said you want to be. Yours has five parts. We\u2019ll go through each one, then it\u2019s yours.",
      why: "A plan you understand is a plan you\u2019ll follow. Each part has a job.",
      cta: "Build it together",
    },
    whatLabel: "What it is",
    helpsLabel: "How it helps",
    yoursLabel: "Yours",
    builtFrom: "Built from what you shared",
    parts: [
      {
        id: "start",
        title: "Your starting point",
        what: "The plan ExecHQ recommends for where you want to go, and what it\u2019s built from.",
        helps: "You start from something built for you, not a blank page.",
      },
      {
        id: "week",
        title: "This week",
        what: "The one thing to do first.",
        helps: "You always know the next move, so nothing stalls.",
      },
      {
        id: "stages",
        title: "Three stages",
        what: "What your plan builds toward, in order.",
        helps: "Each stage sets up the next, so the effort adds up.",
      },
      {
        id: "done",
        title: "Done when",
        what: "A clear finish line for each stage.",
        helps: "You can tell it\u2019s working, not just feel busy.",
      },
      {
        id: "grows",
        title: "It grows with you",
        what: "Every draft you make and every conversation you log tells ExecHQ what to do next.",
        helps: "The plan gets sharper the more you use it, and it never runs out.",
      },
    ],
    partOf: (index: number) => `Part ${index + 1} of 5`,
    next: "Next part",
    right: "This is right",
    others: "See other plans",
    use: "Use this plan",
    othersTitle: "The other plans",
    othersLede: "Each one is built for a different kind of next step. ExecHQ\u2019s recommendation is marked.",
    othersCta: "Use this one",
  },
  story: {
    kicker: "Your story",
    reflect: {
      title: "Could you say what you lead in one sentence, right now?",
      lede: "Out loud, to someone who\u2019s never met you.",
      label: "Your story, out loud",
      options: ["Yes, easily", "Roughly", "Not really"],
      replies: [
        "Good. Then ExecHQ will put it in writing, and you can sharpen it from there.",
        "That\u2019s the gap we\u2019ll close. ExecHQ will draft that sentence for you next.",
        "That\u2019s what this next part is for. ExecHQ will draft it for you, from what you\u2019ve shared.",
      ],
      fact: {
        label: "Fun fact",
        text: "People judged a stranger\u2019s competence and trustworthiness after seeing their face for a tenth of a second, and those judgments closely matched the ones made with no time limit. More time mostly made them more confident.",
        source: "Willis and Todorov, Psychological Science, 2006",
      },
      why: "Every next step, a promotion conversation, a post, an introduction, starts with this sentence.",
    },
    /** The first draft, written from what the user has said, by decision on
     *  2026-09-28. Its lede answers the reflection before it. */
    draft: {
      title: "Here\u2019s your first draft",
      ledes: {
        "Yes, easily": "Good. Here it is in writing, from what you\u2019ve shared.",
        Roughly: "You said you could say it roughly. Here\u2019s a start, from what you\u2019ve shared.",
        "Not really": "Here\u2019s one to start from, built from what you\u2019ve shared.",
      } as Record<string, string>,
      lede: "Built from what you\u2019ve shared.",
      why: "You can use this today. Everything after this makes it sharper, and your plan picks up where it leaves off.",
      sharpen: "Sharpen it together",
      sharpenAgain: "Sharpen it again",
      cta: "Save it and finish",
      writing: "Writing your first draft",
      /** How the summary file on the last page says the story. */
      fileDraft: "First draft",
      fileSharpened: "Sharpened",
    },
    /** Sharpening: the three facts, one at a time in the drawer. */
    sharpen: {
      title: "Three things only you know",
      lede: "Your role, what you\u2019re responsible for, and one result. Skip any you like.",
      why: "These are what turn where you\u2019re going into something you can say in a meeting.",
      cta: "Update my draft",
    },
    /** Each sharpen question, as the drawer asks it. */
    asks: {
      role: "What\u2019s your current role?",
      own: "What are you responsible for?",
      result: "What\u2019s a result you\u2019re proud of?",
    },
    goodLabel: "What good looks like",
    goodWhy: "Why it works",
    /** What good looks like, for the sharpen questions: what you do, then a
     *  result. */
    doing: {
      good: {
        example: "\u201cVP of Marketing, leading brand and demand.\u201d",
        why: "A clear title and a specific scope. No jargon, nothing to decode.",
      },
    },
    known: {
      good: {
        example: "\u201cGrew pipeline 40% in a year.\u201d",
        why: "A number, a timeframe, and it\u2019s clearly yours. Proof beats adjectives.",
      },
    },
    cta: "Continue",
  },
  done: {
    kicker: "You\u2019re set up",
    title: "You have a plan and your first story",
    lede: "Both are saved, and nothing here is visible to anyone else. Here\u2019s everything ExecHQ learned, and what happens next.",
    nextLabel: "What happens next",
    // The first thing on the plan is the story, which is now drafted; the
    // quick win after it comes next.
    thisWeek: "Done today",
    then: "Next",
    after: "After that",
    signals: "You can bring in your LinkedIn numbers anytime, so your plan and your drafts start from how you already show up.",
    why: "You\u2019ve done the hardest part: saying where you want to go. From here, the plan does the work with you.",
    home: "Go to my homepage",
  },
} as const;

/**
 * Answers that change Concept 3's recommendation, with the reason said. Every
 * other answer confirms it. Keyed by question, then by option value.
 */
const SWITCHES_C3: Record<string, Record<string, { planId: string; reason: string }>> = {
  "scope-block": {
    "nobody-sees-my-work": {
      planId: "executive-presence",
      reason: "The results are there. What\u2019s missing is being seen by the people deciding, and that\u2019s what this plan is for.",
    },
    "wrong-company-for-it": {
      planId: "explore",
      reason: "If the next step may not be where you are, it\u2019s worth working out the direction before making the case.",
    },
  },
  "influence-block": {
    "too-junior-on-paper": {
      planId: "leadership-scope",
      reason: "Your title undersells what you do, so the case for a bigger role comes first.",
    },
  },
  "explore-why": {
    "hit-a-ceiling": {
      planId: "leadership-scope",
      reason: "A ceiling is a scope problem. Making the case for a bigger role comes before looking elsewhere.",
    },
  },
};

/** Concept 3's recommendation, as the answers so far leave it: the one from
 *  the direction, unless an answer changed it. The last change wins. */
export function recommendC3(
  direction: string,
  answers: Record<string, string>
): { plan: PlanTemplate; reason: string; changedBy?: string } {
  const base = recommendPlan(direction);
  let result: { plan: PlanTemplate; reason: string; changedBy?: string } = {
    plan: base,
    reason: earlyReasonFor(direction, base),
  };
  for (const question of refinementFor(direction)) {
    const change = SWITCHES_C3[question.id]?.[answers[question.id] ?? ""];
    const plan = change ? PLAN_TEMPLATES.find((p) => p.id === change.planId) : undefined;
    if (change && plan) result = { plan, reason: change.reason, changedBy: question.id };
  }
  return result;
}

/** Whether an answer to this question can change the plan. Those questions
 *  are asked before the recommendation, so it is made once and stands; the
 *  rest only make the plan the user\u2019s own and are asked after it. */
export function decidesPlanC3(questionId: string): boolean {
  return questionId in SWITCHES_C3;
}

/** Why a plan fits, said early, from the direction alone. */
export function earlyReasonFor(direction: string, plan: PlanTemplate): string {
  const forWhom = plan.bestFor.charAt(0).toLowerCase() + plan.bestFor.slice(1);
  // Concept 3's directions are picked from a list, not typed, so "picked".
  return `You picked \u201c${direction.trim().replace(/[.]$/, "")}\u201d. This is the plan for when ${forWhom}`;
}

/* -----------------------------------------------------------------------------
   SIMULATED WORK
   -------------------------------------------------------------------------- */

/** How long the fake thinking takes. Long enough that the state is real UI,
 *  short enough that walking the flow is not a chore. */
export const GENERATING_MS = 1100;

/** How long the LinkedIn export takes to "read", in the background. Long
 *  enough to be seen as reading on the step after the upload. */
export const LINKEDIN_READ_MS = 8000;

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
  /** A finished story, for a jump past it: sharpened and approved, so
   *  Concept 2's thread reads as a completed sharpen. */
  positioning: {
    name: "Maya Chen",
    role: "VP of Marketing",
    own: "brand and demand",
    teamSize: "51\u2013200",
    strengths: ["Building teams", "Growing revenue"],
    result: "grew pipeline 40% in a year",
    audience: "My manager",
    showFirst: "narrative",
    source: "",
    edits: {},
    built: true,
    approved: ["sharpen", "story"],
  },
} as const;
