// TEMPORARY. Sprint 3 designs the Plan and replaces this file.
// Nothing outside /mock may hard-code Plan or Active Landscape data.

/**
 * The Plan, stubbed: Maya's roadmap on Increase Leadership Scope, her Active
 * Landscape actions, and the signals they track. Sprint 2 reads it — the
 * homepage rings, the next step — and designs none of it.
 *
 * An action links to an artifact by its Loop record id (`mock/homepage.ts`).
 * Its segment on a ring fills only when the Loop confirms that artifact was
 * used, sent or published, or an outcome was recorded; see `lib/rings.ts`.
 */

export type Horizon = "short" | "medium" | "long";

export type ActionStatus = "accepted" | "declined" | "deferred" | "completed";

export interface HorizonInfo {
  id: Horizon;
  label: string;
  /** How far ahead it looks, in plain words. */
  span: string;
}

/** Short-term: 1–3 actions. Medium-term: 1 action. Long-term: 1 milestone. */
export const HORIZONS: HorizonInfo[] = [
  { id: "short", label: "Short-term", span: "1–7 days" },
  { id: "medium", label: "Medium-term", span: "8–30 days" },
  { id: "long", label: "Long-term", span: "A quarter or more" },
];

export interface SignalEntry {
  /** `observed` happened in ExecHQ; `reported` the user told us. */
  source: "observed" | "reported";
  text: string;
  on: string;
  /** For a reported entry: how ExecHQ knows, shown when its label is tapped. */
  how?: string;
}

export interface TrackedSignal {
  id: string;
  name: string;
  entries: SignalEntry[];
}

export interface LandscapeAction {
  id: string;
  title: string;
  horizon: Horizon;
  status: ActionStatus;
  whyThis: string;
  whyNow: string;
  whyYou: string;
  /** The three reasons as one sentence in the advisor's voice, for where a
   *  single line fits (Homepage Concept 1). Written by hand here. */
  whyLine: string;
  /** The Loop record of the artifact that does this action. */
  artifactId?: string;
  /** The signal this action moves. */
  signalId?: string;
  /** The roadmap stage it belongs to, from 0. Decided 2026-09-29: every
   *  action sits in a stage, so the homepage can show the current stage's
   *  actions, and the current stage comes from progress, never a calendar. */
  stage: number;
}

/**
 * A stage of the roadmap. No dates and no week windows: by decision on
 * 2026-09-29 a plan has no end date, so stages are an order, not a schedule.
 * The current one is the first with an accepted action the Loop hasn't
 * confirmed (`currentStageIndex` in `lib/rings.ts`).
 */
export interface RoadmapStage {
  title: string;
  /** What the stage asks of the user, in one line. Shown only while it is
   *  the current stage (Homepage Concept 3). */
  asks: string;
}

/** Increase Leadership Scope, in four stages. */
export const ROADMAP: RoadmapStage[] = [
  { title: "Say what you lead", asks: "Put what you lead into words, and say it to the person who decides." },
  { title: "Show the proof", asks: "Back up what you lead with work the people above you can see." },
  { title: "Get in front of the deciders", asks: "Put your case in front of the people who decide on scope." },
  { title: "Make the case", asks: "Ask for the broader role, with the record to back it." },
];

export const SIGNALS: TrackedSignal[] = [
  {
    id: "seen-as-leader",
    name: "Being seen as a leader, not only an operator",
    entries: [
      { source: "observed", text: "You used your leadership story in a 1:1", on: "2026-10-13" },
      { source: "reported", text: "Your manager asked to see it in writing", on: "2026-10-20" },
    ],
  },
  {
    id: "broader-remit",
    name: "A broader remit",
    entries: [
      { source: "observed", text: "You sent your pitch for the Q1 planning review", on: "2026-10-15" },
      { source: "reported", text: "You were asked to lead the planning workstream", on: "2026-10-24" },
    ],
  },
  {
    id: "decider-access",
    name: "Time with the people who decide",
    entries: [{ source: "observed", text: "You briefed your manager before your check-in", on: "2026-10-22" }],
  },
];

export const ACTIONS: LandscapeAction[] = [
  {
    id: "use-story",
    title: "Use your leadership story in your next 1:1",
    horizon: "short",
    status: "accepted",
    whyThis: "It’s the clearest way to say what you lead, out loud, to the person who decides.",
    whyNow: "Your 1:1 with your manager is on Tuesday.",
    whyYou: "You want to move from running campaigns to leading a broader marketing organisation.",
    whyLine: "Your 1:1 is on Tuesday, and saying what you lead out loud is the first step to the broader role you want.",
    artifactId: "story",
    signalId: "seen-as-leader",
    stage: 0,
  },
  {
    id: "brief-manager",
    title: "Brief your manager before Thursday’s check-in",
    horizon: "short",
    status: "accepted",
    whyThis: "A one-page brief turns a check-in into a conversation about scope.",
    whyNow: "The check-in is on Thursday.",
    whyYou: "You’re in the Show the proof stage of your plan.",
    whyLine: "Thursday’s check-in is your chance to talk about scope, and a one-page brief shows the proof.",
    artifactId: "check-in-brief",
    signalId: "decider-access",
    stage: 1,
  },
  {
    id: "add-wins",
    title: "Add three recent accomplishments",
    horizon: "short",
    status: "deferred",
    whyThis: "Every draft after this one gets sharper.",
    whyNow: "Five minutes, whenever suits.",
    whyYou: "You said the results are there.",
    whyLine: "Five minutes on your recent results makes every draft after this one sharper.",
    stage: 1,
  },
  {
    id: "q1-review",
    title: "Put yourself forward for the Q1 planning review",
    horizon: "medium",
    status: "accepted",
    whyThis: "Leading a cross-functional review is the broader scope you want, in practice.",
    whyNow: "Nominations close at the end of the month.",
    whyYou: "Your manager already knows your planning work.",
    whyLine: "Nominations close at the end of the month, and leading the review is the broader scope you want, in practice.",
    artifactId: "pitch",
    signalId: "broader-remit",
    stage: 2,
  },
  {
    id: "cross-functional",
    title: "Identify a cross-functional initiative",
    horizon: "medium",
    status: "declined",
    whyThis: "A visible project across teams shows scope before you have it.",
    whyNow: "Planning season is when new work gets handed out.",
    whyYou: "You said you want a broader remit.",
    whyLine: "Planning season is when new work gets handed out, and a project across teams shows the remit you want before you have it.",
    stage: 1,
  },
  {
    id: "scope-case",
    title: "Build a documented case for broader scope",
    horizon: "long",
    status: "accepted",
    whyThis: "When the role comes up, the people deciding will want it on paper.",
    whyNow: "The next planning cycle starts in January.",
    whyYou: "You said the results are there; the case is what’s missing.",
    whyLine: "The next planning cycle starts in January, and when the role comes up, the people deciding will want your results on paper.",
    signalId: "broader-remit",
    stage: 3,
  },
];

export const actionById = (id: string) => ACTIONS.find((a) => a.id === id);
export const signalById = (id: string) => SIGNALS.find((s) => s.id === id);

/* -----------------------------------------------------------------------------
   SIGNAL ACTIVITY — PROVISIONAL (Homepage Concept 2)
   The Signal Picture is designed in Sprint 3. Until then Concept 2 shows a
   lightweight stand-in: the last seven days of each tracked signal, read from
   the Loop through the actions above (`lib/signals.ts`), and said in these
   words. Facts only: no counts, bars, grades or trends, and never a claim
   that the work caused anything.
   -------------------------------------------------------------------------- */

/**
 * The next steps offered after an outcome (`mock/snapshots.ts`) are not Plan
 * actions yet, so the signal each one touches is named here.
 */
export const STEP_SIGNALS: Record<string, string> = {
  bio: "seen-as-leader",
  "stakeholder-map": "broader-remit",
  "review-sponsor": "decider-access",
};

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const SIGNAL_COPY = {
  /** How far back the homepage looks. */
  windowDays: 7,
  window: (from: string, to: string) => `Last 7 days · ${from} – ${to}`,
  /* Where a fact comes from, by who can vouch for it (decided 2026-09-29,
     option B, "Mark the outside"). What ExecHQ saw happen is the baseline and
     carries no label; a key says so once. What the user reported is marked
     "Your word", and tapping it says how ExecHQ knows. */
  key: "Unmarked lines happened in ExecHQ.",
  reportedLabel: "Your word",
  /** Read with the label, so it names what the tap does. */
  reportedLabelHint: "How ExecHQ knows this",
  howUsed: (date: string) => `You said so on ${date}. ExecHQ can’t see where you used it.`,
  howNothingYet: (date: string) => `You told us on ${date} that nothing had come of it yet.`,
  howOutcome: (date: string) => `You logged this on ${date}. ExecHQ wasn’t there, so it’s in your words.`,
  /* One line per Loop event. `name` reads mid-sentence: "your leadership story". */
  drafted: (name: string) => `Drafted ${name}`,
  edited: (name: string) => `Worked on ${name}`,
  ready: (name: string) => `Finished ${name}`,
  used: (verb: string, name: string) => `${capitalise(verb)} ${name}`,
  nothingYet: (name: string) => `Nothing back yet on ${name}`,
  outcome: (name: string, label: string) => `${capitalise(name)}: ${label.toLowerCase()}`,
  /** A signal with nothing in the window gets one quiet line, never a verdict. */
  quiet: "Nothing logged in the last 7 days.",
  quietStarted: (when: string) => `Your plan started ${when}. Nothing logged here yet.`,
  focalEyebrow: "Your next step adds to",
  answeredEyebrow: "What you logged adds to",
  followUpAbout: "Adds to your signal",
  othersHeading: "Your other signals",
  allHeading: "The signals on your plan",
} as const;
