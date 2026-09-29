/**
 * The Loop's words and defaults: everything a designer may want to reword or
 * retune without touching how the Loop works. The rules themselves — which
 * state can follow which, when a follow-up is due, what counts as progress —
 * live in `lib/loop.ts`, which reads this file.
 *
 * Source: the Sprint 2 experience brief, "The Loop", which maps the PRD's seven
 * lifecycle states to what the user sees. Language follows the brief's copy
 * rules: plain verbs for what the user actually did, never system language
 * like "Pending outcome", and "Nothing yet" as a normal answer.
 */

/** The four pilot workflows, by what they produce. */
export type ArtifactKind =
  | "positioning"
  | "pitch"
  | "situation-brief"
  | "thought-leadership";

export interface ArtifactKindCopy {
  /** The Toolbox workflow that makes it. */
  workflow: string;
  /** The one "used" state, labelled by what using this kind means. */
  usedLabel: string;
  /** The same verb, past tense, for a sentence: "You sent your pitch…". */
  usedVerb: string;
  /** Default days from use to the check-back, when the user doesn't choose.
   *  Proposed values: the brief's only fixed point is the Maya journey's
   *  two-day follow-up after a manager check-in, for a Situation Brief. */
  checkBackDays: number;
}

export const ARTIFACT_KINDS: Record<ArtifactKind, ArtifactKindCopy> = {
  positioning: {
    workflow: "Positioning Builder",
    usedLabel: "Used",
    usedVerb: "used",
    checkBackDays: 7,
  },
  pitch: {
    workflow: "Pitch Builder",
    usedLabel: "Sent",
    usedVerb: "sent",
    checkBackDays: 5,
  },
  "situation-brief": {
    workflow: "Situation Brief",
    usedLabel: "Used",
    usedVerb: "used",
    checkBackDays: 2,
  },
  "thought-leadership": {
    workflow: "Thought Leadership Builder",
    usedLabel: "Published",
    usedVerb: "published",
    checkBackDays: 7,
  },
};

/** What the user sees for each PRD state, from the brief's table. The "used"
 *  state has no entry here: its label comes from the artifact's kind. */
export const STATE_LABELS = {
  drafted: "Draft",
  "in-progress": "Draft",
  ready: "Ready to use",
  waiting: "Waiting to hear",
  outcome: "Outcome logged",
  closed: "Done",
} as const;

/** A second line some states carry, where the label alone would hide a
 *  difference the user cares about. */
export const STATE_DETAILS = {
  "in-progress": "Still editing",
  /** Closed because the user set it aside, not because it was used. */
  abandoned: "Set aside",
} as const;

/** The five answers to a follow-up, in the order they are offered. Each is
 *  one tap. "Nothing yet" is listed as an answer like any other: it
 *  reschedules the check-back rather than counting as a failure. */
export const OUTCOME_OPTIONS = [
  { type: "positive", label: "It went well" },
  { type: "neutral", label: "It was mixed" },
  { type: "negative", label: "Not the way I hoped" },
  { type: "no-response-yet", label: "Nothing yet" },
  { type: "no-longer-relevant", label: "It’s no longer relevant" },
] as const;

/** What a recorded outcome says back when the user left no detail. It records
 *  what the user reported and never claims the artifact caused it. */
export const OUTCOME_READBACK = {
  positive: "You said it went well.",
  neutral: "You said it was mixed.",
  negative: "You said it didn’t go the way you hoped.",
  "no-response-yet": "Nothing yet.",
  "no-longer-relevant": "You said it’s no longer relevant.",
} as const;

/**
 * How often the Loop may ask, so a follow-up reads as help rather than
 * nagging (the brief's first risk).
 *
 * - Each "Nothing yet" pushes the next check-back further out, by these gaps
 *   in days: the first by three days, the second by a week, the third by two.
 * - After `maxNothingYet` of them the Loop stops asking. The record stays
 *   waiting, quietly, and the user can still report an outcome whenever they
 *   like. It is never marked as a failure.
 * - At most one follow-up is put in front of the user at a time.
 */
export const FOLLOW_UP_POLICY = {
  rescheduleDays: [3, 7, 14],
  maxNothingYet: 3,
} as const;

/** The follow-up email, when the user has it on. Subject and preview stay
 *  neutral, because a lock screen reading "How did your promotion pitch go?"
 *  is a privacy leak even in a personal inbox. Specifics sit behind sign-in. */
export const FOLLOW_UP_EMAIL = {
  subject: "A quick question from ExecHQ",
  preview: "Sign in to see it. It takes one tap to answer.",
} as const;

/** The progress sentence's parts. The PRD's own example is the model: "You
 *  completed two planned actions this month and have one artifact awaiting an
 *  outcome." Never a score, a streak or momentum language. */
export const PROGRESS_COPY = {
  completed: (count: string, plural: boolean) =>
    `You completed ${count} planned action${plural ? "s" : ""} this month`,
  awaiting: (count: string, plural: boolean) =>
    `${count} artifact${plural ? "s" : ""} awaiting an outcome`,
  /** Nothing completed or awaiting yet: say what exists, no more. */
  soFar: (count: string, plural: boolean) =>
    `You have ${count} artifact${plural ? "s" : ""} so far.`,
  firstToday: "You made your first artifact today.",
} as const;
