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

/** Codes an enterprise user might arrive with. The sponsoring organisation is
 *  deliberately not recorded: no employer name appears anywhere in the UI, and
 *  storing one here would invite a screen that shows it. */
export const INVITE_CODES = ["EXEC-4821", "EXEC-7390", "EXEC-1155"] as const;

/** Domains treated as corporate. Real detection is a backend problem; this list
 *  is enough to design the rejection state against. */
const CORPORATE_DOMAIN_HINTS = [
  "acme.com",
  "globex.com",
  "initech.com",
  "company.com",
  "corp.com",
];

const PERSONAL_DOMAIN_HINTS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "yahoo.com",
];

export function isValidInviteCode(code: string): boolean {
  const normalised = code.trim().toUpperCase();
  return (INVITE_CODES as readonly string[]).includes(normalised);
}

export type EmailVerdict = "ok" | "empty" | "malformed" | "corporate";

/**
 * The email check. Corporate addresses are a designed, explanatory state rather
 * than a bare validation error, so the verdict is specific enough for the UI to
 * say why rather than just no.
 */
export function checkEmail(value: string): EmailVerdict {
  const email = value.trim().toLowerCase();
  if (!email) return "empty";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "malformed";

  const domain = email.split("@")[1] ?? "";
  if (PERSONAL_DOMAIN_HINTS.includes(domain)) return "ok";
  if (CORPORATE_DOMAIN_HINTS.includes(domain)) return "corporate";
  // Anything that is not a known personal provider is treated as corporate.
  // Wrong sometimes, but it is the state worth designing against.
  return "corporate";
}

/* -----------------------------------------------------------------------------
   PRIVACY
   -------------------------------------------------------------------------- */

export const PRIVACY = {
  heading: "Before we go further",
  statements: [
    "Nothing you do here is visible to your employer, your network, or another user.",
    "This account is yours. It stays yours regardless of where you work.",
    "That is why we asked for a personal address, and it is the only reason.",
  ],
  action: "Understood",
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
    need: "positioning",
  },
  {
    id: "seen-differently",
    label: "Be seen differently",
    text: "I want to be read as an executive rather than a strong operator.",
    need: "visibility",
  },
  {
    id: "weigh-more",
    label: "Carry more weight where I am",
    text: "I want more influence in the organisation I am already in.",
    need: "influence",
  },
  {
    id: "moment-ahead",
    label: "Something specific is coming up",
    text: "I have a promotion conversation, review or board presentation ahead of me.",
    need: "preparation",
  },
  {
    id: "leaving",
    label: "Get out of where I am",
    text: "I want out of the industry I am in, but I have not worked out what replaces it.",
    need: "exploration",
  },
  {
    id: "unsure",
    label: "I do not know yet",
    text: "I have hit a ceiling and I cannot name the next role.",
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
    patterns: [/do not know/i, /don't know/i, /cannot name/i, /can't name/i, /ceiling/i, /out of/i, /unsure/i, /explore/i],
  },
  {
    need: "visibility",
    patterns: [/seen/i, /visib/i, /read as/i, /profile/i, /known for/i, /nobody sees/i],
  },
  {
    need: "influence",
    patterns: [/influence/i, /weight/i, /already in/i, /where i am/i, /internal/i],
  },
  {
    need: "positioning",
    patterns: [/lead/i, /larger/i, /bigger/i, /scope/i, /remit/i, /cmo|cto|cfo|coo|chief|vp|director/i],
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

/* -----------------------------------------------------------------------------
   PLANS
   -------------------------------------------------------------------------- */

export interface PlanTemplate {
  id: string;
  name: string;
  bestFor: string;
  emphasis: string;
  /** Why this plan, tied to what the user said. Filled in by `recommendPlan`. */
  rationale?: string;
}

export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: "leadership-scope",
    name: "Increase leadership scope",
    bestFor: "A strong performer seeking promotion or a broader remit.",
    emphasis: "Leadership narrative, executive-ready evidence, key conversations.",
  },
  {
    id: "executive-presence",
    name: "Build executive presence",
    bestFor: "You need greater visibility and a clearer point of view.",
    emphasis: "Positioning, thought leadership, speaking and podcast pitching.",
  },
  {
    id: "inflection-point",
    name: "Prepare for a career inflection point",
    bestFor: "A promotion, role change, review, board presentation or negotiation is ahead.",
    emphasis: "Situation Brief, narrative, stakeholder strategy.",
  },
  {
    id: "current-org",
    name: "Strengthen influence in the current organisation",
    bestFor: "You intend to grow where you are.",
    emphasis: "Strategic communication, executive presence, internal opportunity framing.",
  },
  {
    id: "explore",
    name: "Explore and clarify a next direction",
    bestFor: "You feel a ceiling but cannot name a role.",
    emphasis: "Direction refinement, transferable narrative, low-risk exploratory actions.",
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
 */
export function artifactFor(direction: string): Artifact {
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
        heading: "What I am building toward",
        body: interpretDirection(direction),
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
