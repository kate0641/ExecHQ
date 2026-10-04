// Sprint 3's Plan data. The roadmaps for the five templates, and the ranked
// queue the action steps are drawn from. Nothing outside /mock may hard-code
// Plan or action-step data.
//
// `mock/plan-stub.ts` stays as Sprint 2 left it: the homepage reads it and the
// homepage concept is not chosen yet. This file builds on it, so the words of
// an action are written once.

import { PLAN_TEMPLATES, type PlanTemplate } from "@/mock/onboarding";
import { ACTIONS, NEW_ACTIONS, type Horizon, type LandscapeAction } from "@/mock/plan-stub";

/* -----------------------------------------------------------------------------
   ROADMAPS
   Each template's stages come from onboarding (`PLAN_TEMPLATES`), where the
   user already saw three of them, so the two screens cannot disagree. The
   brief proposes three to four stages; `ADDED_STAGES` supplies the fourth,
   marked `added` so a reviewer can see what onboarding does not yet show.
   No dates and no windows of time: a plan has no end date (2026-09-29), so
   stages are an order, never a schedule. Stages describe work, not
   achievement: nothing unlocks and nothing is levelled.
   -------------------------------------------------------------------------- */

export interface RoadmapStep {
  title: string;
  /** What finishing the stage looks like: a concrete, checkable sign. */
  milestone: string;
  /** What the user will have by the end of it. */
  outcomes: string[];
  /** Not shown in onboarding's version of this plan. */
  added?: boolean;
  /** The suggested pace, in weeks. A suggestion that moves as she does, never
   *  a deadline (decided 2026-10-04, replacing 2026-09-29's "no end date"). */
  weeks: number;
}

/** Every stage is four weeks until the plans say otherwise. "Get ready for a
 *  big moment" really runs to the date of the moment, which is open. */
export const STAGE_WEEKS = 4;

const ADDED_STAGES: Record<string, { at: number; stage: RoadmapStep }> = {
  "leadership-scope": {
    at: 3,
    stage: {
      title: "Make the case",
      milestone: "You’ve asked for the broader role, with your record behind you.",
      outcomes: ["A documented case for broader scope", "The ask, made to the person who decides"],
      added: true,
      weeks: STAGE_WEEKS,
    },
  },
  "executive-presence": {
    at: 3,
    stage: {
      title: "Keep it going",
      milestone: "You have a rhythm you can keep up, and you know which rooms keep inviting you.",
      outcomes: ["A rhythm for publishing and speaking that fits your week", "A short list of what is working"],
      added: true,
      weeks: STAGE_WEEKS,
    },
  },
  "inflection-point": {
    at: 2,
    stage: {
      title: "Rehearse the conversations",
      milestone: "You’ve said the hard parts out loud to someone who will push back.",
      outcomes: ["The two or three conversations that matter, practised", "Answers to the questions you least want"],
      added: true,
      weeks: STAGE_WEEKS,
    },
  },
  "current-org": {
    at: 3,
    stage: {
      title: "Frame the opportunities",
      milestone: "You’ve put two openings in front of leadership, in terms they care about.",
      outcomes: ["Two internal opportunities, written as the business sees them"],
      added: true,
      weeks: STAGE_WEEKS,
    },
  },
  explore: {
    at: 2,
    stage: {
      title: "Build the story that travels",
      milestone: "You can say in a minute why your next direction follows from what you’ve done.",
      outcomes: ["A short story of where you’re headed that holds up with strangers"],
      added: true,
      weeks: STAGE_WEEKS,
    },
  },
};

/** The roadmap for a template: onboarding's stages, plus the one the brief adds. */
export function roadmapFor(planId: string): RoadmapStep[] {
  const template: PlanTemplate | undefined = PLAN_TEMPLATES.find((p) => p.id === planId);
  const base: RoadmapStep[] = (template?.stages ?? []).map((s) => ({
    title: s.title,
    milestone: s.done ?? "",
    outcomes: s.outcomes,
    weeks: STAGE_WEEKS,
  }));
  const extra = ADDED_STAGES[planId];
  if (extra) base.splice(extra.at, 0, extra.stage);
  return base;
}

/* -----------------------------------------------------------------------------
   ACTION STEPS
   -------------------------------------------------------------------------- */

/** The brief's four recommendation types. */
export type StepKind = "artifact" | "context" | "opportunity" | "reading";

/** The presence channels a step can run through. Only the channels a user can
 *  report on, plus none: a conversation with a manager has no channel. */
export type Channel = "linkedin" | "content" | "speaking" | "podcast" | "press";

export const CHANNELS: Record<Channel, { label: string; phrase: string }> = {
  linkedin: { label: "LinkedIn", phrase: "LinkedIn" },
  content: { label: "Published writing", phrase: "published writing" },
  speaking: { label: "Speaking", phrase: "speaking" },
  podcast: { label: "Podcasts", phrase: "podcasts" },
  press: { label: "Press", phrase: "press" },
};

/** 1 is a few minutes to half an hour, 3 is several sittings. */
export type Effort = 1 | 2 | 3;

export interface ActionStep extends LandscapeAction {
  kind: StepKind;
  channel?: Channel;
  effort: Effort;
  /** The estimate in words. */
  effortText: string;
  /** What counts as done. An artifact step is done when its artifact reaches
   *  used, sent or published in the Loop; any other when she marks it done. */
  done: string;
  /** The Plan area it moves: the signal's id in `mock/plan-stub.ts`. */
  area: string;
  /** What its Start button says, when "Start" would be wrong. */
  startLabel?: string;
  /** The Toolbox tool it opens, where there is one. */
  toolboxTool?: string;
  /** Needs a later sprint to be real. */
  stubbed?: boolean;
}

type Meta = Pick<ActionStep, "kind" | "effort" | "effortText" | "done"> & Partial<Pick<ActionStep, "channel" | "toolboxTool" | "startLabel">>;

/** What the Sprint 2 stub does not say about its actions. */
const META: Record<string, Meta> = {
  "use-story": { kind: "opportunity", effort: 1, effortText: "A conversation, plus five minutes to say how it went", done: "You’ve used your story in the 1:1, and said so.", startLabel: "Open your story" },
  "brief-manager": { kind: "artifact", effort: 2, effortText: "About an hour", done: "Your brief is marked used or sent.", toolboxTool: "Situation Brief" },
  "add-wins": { kind: "context", effort: 1, effortText: "About five minutes", done: "Three accomplishments are on your Signal Background." },
  "q1-review": { kind: "artifact", effort: 2, effortText: "An hour or two", done: "Your pitch is marked sent.", toolboxTool: "Pitch Builder" },
  "cross-functional": { kind: "context", effort: 2, effortText: "An hour of looking around", done: "You’ve named one initiative." },
  "scope-case": { kind: "artifact", effort: 3, effortText: "Several sittings", done: "Your case is marked used or sent.", toolboxTool: "Positioning Builder" },
  "ask-manager-scope": { kind: "opportunity", effort: 1, effortText: "A short conversation", done: "You’ve asked, and said what they answered." },
  "share-result-up": { kind: "opportunity", effort: 1, effortText: "About 20 minutes", done: "A result has reached someone two levels up." },
  "sponsor-conversation": { kind: "opportunity", effort: 2, effortText: "An hour to prepare", done: "You’ve had the conversation, or marked it done." },
  "map-decision-makers": { kind: "context", effort: 2, effortText: "About an hour", done: "You’ve named who decides." },
  "name-successor": { kind: "context", effort: 2, effortText: "A short think, then a conversation", done: "You’ve named someone." },
};

/** Steps the Sprint 2 stub does not have. They exist so that a decline has
 *  somewhere to go, and so a channel can be avoided. */
const NEW_STEPS: ActionStep[] = [
  {
    id: "bio",
    title: "Write your bio",
    horizon: "short",
    status: "suggested",
    whyThis: "It’s what goes ahead of you: to a recruiter, an event, a new boss.",
    whyNow: "Your story is written, so the bio is the same words, shorter.",
    whyYou: "You want to be seen as a leader, not only an operator.",
    whyLine: "Your story is written, and your bio is what goes ahead of you to a recruiter, an event or a new boss.",
    signalId: "seen-as-leader",
    area: "seen-as-leader",
    stage: 0,
    kind: "artifact",
    effort: 1,
    effortText: "About 20 minutes",
    done: "Your bio is marked used or published.",
    toolboxTool: "Positioning Builder",
  },
  {
    id: "stakeholder-map",
    title: "Build a stakeholder message map for the workstream",
    horizon: "short",
    status: "suggested",
    whyThis: "Leading across teams starts with knowing what each one needs to hear.",
    whyNow: "You’ve been asked to lead the workstream.",
    whyYou: "You said the assignment requires cross-functional influence.",
    whyLine: "You’ve been asked to lead the workstream, and a message map shows what each team needs to hear from you.",
    signalId: "broader-remit",
    area: "broader-remit",
    stage: 1,
    kind: "artifact",
    effort: 2,
    effortText: "About an hour",
    done: "Your message map is marked used or sent.",
  },
  {
    id: "linkedin-post",
    title: "Post what you lead on LinkedIn",
    horizon: "short",
    status: "suggested",
    whyThis: "The people who decide on scope look you up before they talk to you.",
    whyNow: "Your leadership story is already written.",
    whyYou: "You want to be seen as a leader, not only an operator.",
    whyLine: "Your story is already written, and a short post is the first thing people see when they look you up.",
    signalId: "seen-as-leader",
    area: "seen-as-leader",
    stage: 1,
    kind: "artifact",
    channel: "linkedin",
    effort: 1,
    effortText: "About 20 minutes",
    done: "Your post is marked published.",
    toolboxTool: "Thought Leadership Builder",
  },
  {
    id: "pitch-podcast",
    title: "Pitch yourself to a podcast the people above you follow",
    horizon: "medium",
    status: "suggested",
    whyThis: "A conversation on a show your deciders listen to reaches them without a meeting.",
    whyNow: "Your story and your pitch are both written.",
    whyYou: "You want to be known beyond your own team.",
    whyLine: "Your story and pitch are written, and a show the people above you follow reaches them without a meeting.",
    signalId: "seen-as-leader",
    area: "seen-as-leader",
    stage: 2,
    kind: "artifact",
    channel: "podcast",
    effort: 2,
    effortText: "An hour or two",
    done: "Your pitch is marked sent.",
    toolboxTool: "Pitch Builder",
  },
  {
    id: "speaking-proposal",
    title: "Draft a talk proposal for the leadership forum",
    horizon: "medium",
    status: "suggested",
    whyThis: "A talk puts your point of view in front of senior people at once.",
    whyNow: "The forum’s call for proposals is open.",
    whyYou: "You said the results are there, and a talk is where they get heard.",
    whyLine: "The forum’s call for proposals is open, and a talk puts your results in front of senior people at once.",
    signalId: "seen-as-leader",
    area: "seen-as-leader",
    stage: 2,
    kind: "artifact",
    channel: "speaking",
    effort: 3,
    effortText: "Several sittings",
    done: "Your proposal is marked sent.",
    toolboxTool: "Pitch Builder",
  },
  {
    id: "read-briefing",
    title: "Read today’s Briefing",
    horizon: "short",
    status: "suggested",
    whyThis: "It names what is moving in your field this week.",
    whyNow: "It is the quietest part of the day to read it.",
    whyYou: "You said you want to speak to what leaders are worried about.",
    whyLine: "Today’s Briefing names what is moving in your field, and you said you want to speak to what leaders are worried about.",
    signalId: "seen-as-leader",
    area: "seen-as-leader",
    stage: 1,
    kind: "reading",
    effort: 1,
    effortText: "Five minutes",
    done: "You’ve read it.",
    stubbed: true,
  },
];

const withMeta = (a: LandscapeAction): ActionStep => ({
  ...a,
  ...META[a.id],
  area: a.signalId ?? "seen-as-leader",
});

/**
 * The ranked queue, best first. Ranking is mock: the real model-driven ranking
 * is out of scope (`ranked queue comes from /mock in the prototype`). The
 * order within a horizon is the order they are offered in.
 */
export const ACTION_QUEUE: ActionStep[] = [
  ...ACTIONS.filter((a) => a.status === "accepted").map(withMeta),
  withMeta(ACTIONS.find((a) => a.id === "add-wins")!),
  withMeta(NEW_ACTIONS.find((a) => a.id === "ask-manager-scope")!),
  NEW_STEPS.find((a) => a.id === "bio")!,
  NEW_STEPS.find((a) => a.id === "stakeholder-map")!,
  NEW_STEPS.find((a) => a.id === "linkedin-post")!,
  withMeta(NEW_ACTIONS.find((a) => a.id === "share-result-up")!),
  NEW_STEPS.find((a) => a.id === "read-briefing")!,
  withMeta(ACTIONS.find((a) => a.id === "cross-functional")!),
  withMeta(NEW_ACTIONS.find((a) => a.id === "sponsor-conversation")!),
  withMeta(NEW_ACTIONS.find((a) => a.id === "map-decision-makers")!),
  NEW_STEPS.find((a) => a.id === "pitch-podcast")!,
  NEW_STEPS.find((a) => a.id === "speaking-proposal")!,
  withMeta(NEW_ACTIONS.find((a) => a.id === "name-successor")!),
];

/** The Loop's next-step ids (`NEXT_STEP_AFTER` in `mock/snapshots.ts`) where a
 *  step here has another id. */
export const HANDOFF_STEP: Record<string, string> = { "review-sponsor": "sponsor-conversation" };

/**
 * What an outcome she reports points to, read from her words. A stand-in for
 * the model: the first rule that matches wins. The brief's test case is Maya
 * reporting that her manager asked her to lead a cross-functional workstream,
 * which must offer the stakeholder message map. With no match, the Loop's own
 * next step for that artifact applies (`NEXT_STEP_AFTER`).
 */
export const HANDOFF_RULES: { says: RegExp; stepId: string }[] = [
  { says: /\b(workstream|cross-functional|lead the)\b/i, stepId: "stakeholder-map" },
  { says: /\b(sponsor|review)\b/i, stepId: "sponsor-conversation" },
];

export const stepById = (id: string): ActionStep | undefined => ACTION_QUEUE.find((s) => s.id === id);

/** How many may be live at once. Five in all, by the brief. */
export const LIVE_LIMITS: Record<Horizon, number> = { short: 3, medium: 1, long: 1 };
export const MAX_LIVE = 5;

/* -----------------------------------------------------------------------------
   DECLINING
   -------------------------------------------------------------------------- */

export type DeclineReason =
  | "not-relevant"
  | "wrong-timing"
  | "too-much-effort"
  | "uncomfortable-channel"
  | "already-done"
  | "other";

/** The reason picker: optional, one tap, no "are you sure?". */
export const DECLINE_REASONS: { id: DeclineReason; label: string }[] = [
  { id: "not-relevant", label: "Not relevant" },
  { id: "wrong-timing", label: "Wrong timing" },
  { id: "too-much-effort", label: "Too much effort" },
  { id: "uncomfortable-channel", label: "Uncomfortable channel" },
  { id: "already-done", label: "Already done" },
  { id: "other", label: "Other" },
];

export const PLAN_COPY = {
  /** What a decline does, said back with the replacement: the answer was heard. */
  heard: {
    "not-relevant": "Something different from the last one.",
    "wrong-timing": (on: string) => `The last one comes back ${on}.`,
    "too-much-effort": "A lighter one this time.",
    "uncomfortable-channel": (phrase: string) => `Nothing on ${phrase}, from here on.`,
    "already-done": "Add it to your record, so it counts.",
    other: "Something different from the last one.",
  },
  /** The slot stays empty; each line says why and what she can do. Never a verdict. */
  empty: {
    "nothing-suitable": "Nothing else fits this horizon right now. Your plan will offer the next one as you go.",
    "kept-workload": "You’ve kept your current workload. Nothing new until you say.",
    "limit-reached": "That’s enough changes for one visit. Your plan will offer another next time.",
  },
} as const;

/* -----------------------------------------------------------------------------
   COPY FOR THE ACTION STEPS
   Plain words, no guilt. Declining never asks "Are you sure?"; the reason is
   optional and one tap. Nothing here scores, ranks or praises.
   -------------------------------------------------------------------------- */

export const KIND_LABELS: Record<StepKind, string> = {
  artifact: "Write something",
  context: "Add to what ExecHQ knows",
  opportunity: "Prepare for a moment",
  reading: "Read",
};

export const SCOPE_OPTIONS = { "as-is": "As planned", lighter: "A lighter version" } as const;

export const STEP_COPY = {
  heading: "Your next steps",
  /** Said plainly, a count of real places, never progress toward a number. */
  inUse: (n: number, max: number) => `${n} of ${max} places in use`,
  horizonInUse: (n: number, max: number) => `${n} of ${max}`,
  horizonLabels: { short: "Short-term", medium: "Medium-term", long: "Long-term milestone" } as Record<Horizon, string>,
  roomFree: "A place is free. Your plan offers the next step when one fits.",
  accept: "Accept",
  start: (tool?: string) => (tool ? `Start in ${tool}` : "Start"),
  stubbedStart: "Opens in a later sprint",
  stubbedNote: "Stubbed · Sprint 4",
  markDone: "I’ve done this",
  change: "Change this step",
  later: "Do it later",
  decline: "Not for me",
  edit: "Change timing or scope",
  moves: "Moves",
  effort: "Effort",
  doneWhen: "Done when",
  offered: "Offered",
  accepted: "Accepted",
  edited: (moved?: string, lighter?: boolean) =>
    [moved, lighter ? "Lighter version" : undefined].filter(Boolean).join(" · "),
  /** Where the step sits on her calendar: a suggestion until she accepts it. */
  whenSuggested: (day: string) => `Suggested for ${day}`,
  whenOn: (day: string) => `On ${day}`,
  movedTo: (day: string) => `Moved to ${day}`,
  declinePrompt: "Say why, if you like. One tap.",
  declineNoReason: "Not for me, no reason",
  deferPrompt: "Bring it back on",
  deferConfirm: "Do it later",
  timing: "When",
  dateHint: "A day that suits you. It shows on your calendar.",
  scope: "How much",
  save: "Save",
  cancel: "Cancel",
  recordIt: "Add it to your record",
  keepWorkload: "Keep what I have",
  keepWorkloadHint: "Nothing new is offered until you turn this off.",
  announce: {
    declined: (title: string) => `Declined: ${title}.`,
    deferred: (title: string) => `Deferred: ${title}.`,
    completed: (title: string) => `Done: ${title}.`,
    replacedBy: (title: string) => `Now offered: ${title}.`,
    nothingNew: "Nothing new offered.",
  },
} as const;

/* -----------------------------------------------------------------------------
   COPY FOR THE ROADMAP
   Stages describe work, not achievement: no "unlocked", no "level", no "complete
   3 more to advance". A stage advances only when she says so.
   -------------------------------------------------------------------------- */

export const ROADMAP_COPY = {
  heading: "Your roadmap",
  whyThis: "Why this plan",
  stageOf: (n: number, total: number) => `Stage ${n} of ${total}`,
  here: "You are here",
  done: "Done",
  finishing: "Finishing looks like",
  outcomes: "By the end you’ll have",
  seeAll: (n: number) => `See all ${n} stages`,
  seeLess: "Show less",
  /** Not in onboarding's version of the plan, so a reviewer can find it. */
  addedNote: "Not shown in onboarding yet",
  advance: {
    title: "You’ve done what this stage asks.",
    body: (next: string) => `The next stage is “${next}”. Move on when you’re ready.`,
    move: (next: string) => `Move to ${next}`,
    notYet: "Not yet",
  },
  after: "After the last stage",
  changePlan: "Change plan",
  switchTitle: "Change your plan",
  switchIntro: "Pick the plan that fits where you are now.",
  current: "Your current plan",
  carriesOver: [
    "Everything you’ve made, every Loop record and everything on your Signal Picture stays.",
    "Your next steps are chosen again for the new plan.",
    "Your current plan stays in your history.",
  ],
  switchTo: (name: string) => `Switch to ${name}`,
  back: "Back",
  close: "Close",
  earlier: "Earlier plans",
  earlierLine: (name: string, from: string, to: string, stage: string) =>
    `${name} · ${from} to ${to} · left at ${stage}`,
  switchedOn: (date: string) => `You chose this plan on ${date}.`,
  customPlan: "Want something that fits none of these? Building your own plan is designed in Sprint 1.",
  /** Only Step up has next steps written in the prototype. */
  stepsStub: "Stubbed · next steps for this plan are written in Sprint 4. Maya’s steps are for Step up.",
} as const;

/* -----------------------------------------------------------------------------
   THE SIGNAL PICTURE
   A private, factual record. Not scored and not compared. Two sources, always
   labelled in words (not by colour alone): what ExecHQ recorded, and what she
   added. Nothing in it becomes a number, a percentage or a grade.
   -------------------------------------------------------------------------- */

export type EntryTypeId = "published" | "spoke" | "podcast" | "press" | "other";

/** The activity types she can report, and how each is kept. Three fields only:
 *  the type, the date, and an optional link or note. */
export const ENTRY_TYPES: { id: EntryTypeId; label: string; kind: "writing" | "speaking" | "podcast" | "press" | "other" }[] = [
  { id: "published", label: "Published", kind: "writing" },
  { id: "spoke", label: "Spoke", kind: "speaking" },
  { id: "podcast", label: "Podcast appearance", kind: "podcast" },
  { id: "press", label: "Press mention", kind: "press" },
  { id: "other", label: "Something else", kind: "other" },
];

export const entryTypeOfKind = (kind: string) => ENTRY_TYPES.find((t) => t.kind === kind) ?? ENTRY_TYPES[4];

/** Where an outside activity belongs on her plan when she did not say. A
 *  stand-in rule: for Step up every outside channel is about being seen as a
 *  leader. When she adds from an artifact, that artifact's area wins. */
export const DEFAULT_AREA = "seen-as-leader";
export const OTHER_AREA = "elsewhere";
export const OTHER_AREA_NAME = "Elsewhere on your plan";

export const WINDOWS = [7, 30, 90] as const;
export type WindowDays = (typeof WINDOWS)[number];

/** Direction needs a full window behind it: the last half against the half before. */
export type Direction = "building" | "steady" | "quieter";

export const SIGNAL_PICTURE_COPY = {
  heading: "Your Signal Picture",
  /** The homepage’s starting-point counts, kept under the new picture until the homepage is chosen. */
  startedHeading: "Where you started",
  intro: "A private record of what moved. Not scored, and not compared with anyone.",
  recorded: "Recorded in ExecHQ",
  added: "You added",
  key: "Recorded in ExecHQ happened here. You added is what you told us.",
  windowLabel: "Time window",
  windows: { 7: "7 days", 30: "30 days", 90: "90 days" } as Record<WindowDays, string>,
  /** Honest about how little there is, never an empty chart. */
  thin: (days: number, window: number) =>
    `You have ${days} day${days === 1 ? "" : "s"} of history. The ${window}-day view fills in as you go.`,
  thinNow: "What you have so far:",
  empty: "Nothing recorded yet. Your first draft will show up here, and so will anything you add yourself.",
  quiet: (window: number) => `Nothing recorded in the last ${window} days.`,
  add: "Add something you did",
  /** Counts of real items, kept apart by source. */
  counts: (recorded: number, added: number) =>
    [recorded ? `${recorded} recorded in ExecHQ` : "", added ? `${added} you added` : ""].filter(Boolean).join(" · "),
  direction: {
    building: "building",
    steady: "unchanged",
    quieter: "quieter lately",
  } as Record<Direction, string>,
  directionLine: (area: string, word: string) => `${area}: ${word}`,
  behind: "See what’s behind this",
  hideBehind: "Hide",
  from: (date: string) => date,
  edit: "Edit",
  delete: "Delete",
  deleteAsk: "Delete this entry?",
  deleteYes: "Delete",
  deleteNo: "Keep it",
  offer: (title: string) => `You marked “${title}” published. Add it to your record?`,
  offerYes: "Add it",
  offerNo: "Not now",
  editedNote: "Edited by you",
  openLink: "Open link",
  opensNewTab: "(opens in a new tab)",
  did: (title: string) => `Did: ${title}`,
  /** Which plan area an item moves, in the seven-day list where it is not grouped. */
  areaOf: (name: string) => `Moves: ${name}`,
} as const;

export const ENTRY_COPY = {
  title: "Add something you did",
  editTitle: "Edit what you added",
  typeLabel: "What did you do?",
  dateLabel: "When was it?",
  noteLabel: "A link or a note",
  noteHint: "Optional. Just enough for you to recognise it.",
  notePlaceholder: "https://",
  save: "Add",
  saveEdit: "Save",
  cancel: "Cancel",
  privacy: "Only you see this. Nothing is searched for or shared.",
  errorType: "Choose what it was.",
  errorDate: "Say when it happened.",
  errorFuture: "That date hasn’t happened yet.",
} as const;

/* -----------------------------------------------------------------------------
   MOMENTUM: two concepts, for reviewers to choose between
   The PRD contradicts itself. The Loop section says "completed action" and
   "Plan progress"; the Plan section specifies an indicator labelled building,
   steady or needs attention. Concept A reads the Plan section, Concept B the
   Loop section. What separates them is the 90-day label, which a three-week
   pilot cannot produce, so usage cannot decide this: it has to be
   concept-tested in sessions.
   -------------------------------------------------------------------------- */

export type MomentumFigure = "completed" | "artifact" | "outcome";
export type MomentumLabel = "building" | "steady" | "attention";
export type LabelWording = "candid" | "soft";

/**
 * PLACEHOLDER. D&T have not given the thresholds that define building, steady
 * and needs attention (an open question in the brief), so this reads the
 * three counted figures in the last 45 days against the 45 before, and calls
 * a gap of more than `band` either way. Replace with D&T's definition.
 */
export const MOMENTUM_LABEL_RULE = { band: 1 } as const;

export const MOMENTUM_COPY = {
  headingA: "Momentum",
  headingB: "Plan progress",
  intro: "What you’ve done on your plan. Nothing is scored, and nothing is compared with anyone.",
  windowLabel: "Time window",
  figures: {
    completed: (n: number) => `${n} completed action${n === 1 ? "" : "s"}`,
    artifact: (n: number) => `${n} artifact${n === 1 ? "" : "s"} created or used`,
    outcome: (n: number) => `${n} outcome${n === 1 ? "" : "s"} updated`,
  } as Record<MomentumFigure, (n: number) => string>,
  behind: "What’s behind this",
  hideBehind: "Hide",
  nothingBehind: "Nothing in this window.",
  /** Concept A, 30 days. Only steps she took on count: a declined or deferred
   *  step is never in it. */
  followThrough: (done: number, taken: number) =>
    `You completed ${done} of the ${taken} step${taken === 1 ? "" : "s"} you took on.`,
  followThroughNone: "You haven’t taken on any steps yet.",
  /** Concept B, 30 days: the same counts against the 30 days before, in plain words. */
  compared: (now: number, before: number, noun: string) =>
    `${now} ${noun} in the last 30 days, and ${before} in the 30 days before.`,
  comparedNouns: { completed: "completed actions", artifact: "artifacts created or used", outcome: "outcomes updated" } as Record<MomentumFigure, string>,
  noEarlier: (days: number) => `You have ${days} days of history, so there is nothing earlier to compare yet.`,
  /** Thin history, said plainly. */
  thin: (days: number, window: number) =>
    `You have ${days} day${days === 1 ? "" : "s"} of history. The ${window}-day view fills in as you go.`,
  thinLabel: (days: number) =>
    `You have ${days} day${days === 1 ? "" : "s"} of history. The 90-day label fills in as you go, and until it does there is no label to give.`,
  soFar: "So far:",
  /** The 90-day labels, and the softer wording to test them against. */
  labels: {
    candid: { building: "Building", steady: "Steady", attention: "Needs attention" },
    soft: { building: "Building", steady: "Steady", attention: "Quieter lately" },
  } as Record<LabelWording, Record<MomentumLabel, string>>,
  /** What each label says it is based on, so it never reads as a grade. */
  labelBasis: (label: string) =>
    `${label}, from what you completed, made and logged in the last 90 days. It is not a grade, and it does not say your work caused any result.`,
  nextMove: "Your next move",
  placeholderRule: "Placeholder rule · D&T to define",
  scaffold: {
    heading: "Reviewing Momentum",
    concept: "Concept",
    a: "A · Labeled trend",
    b: "B · Counts only",
    wording: "Label wording",
    candid: "Needs attention",
    soft: "Quieter lately",
    history: "Show 95 days of history",
    note: "Prototype scaffolding. The label difference is the 90-day view, and a three-week pilot cannot show it.",
  },
} as const;

/* -----------------------------------------------------------------------------
   WHAT CHANGED / WHAT NEXT
   Two to four plain sentences on what moved, then one next best move. Every
   sentence traces to recorded items, shown one tap away. No causal claims: it
   says what happened and what she logged, never that one thing led to another.
   -------------------------------------------------------------------------- */

export const NARRATIVE_COPY = {
  heading: "What changed",
  basis: "What this is based on",
  hideBasis: "Hide",
  thin: (days: number) =>
    `You have ${days} day${days === 1 ? "" : "s"} of history, so there is not much to read yet. This fills in as you go.`,
  nothing: "Nothing is recorded yet. Your first draft will show up here.",
  window: (history: number, days: number) => (history >= days ? `Over the past ${days} days` : `In your ${history} day${history === 1 ? "" : "s"} so far`),
  did: (lead: string, parts: string[]) =>
    `${lead}, you ${parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}` : parts[0]}.`,
  completed: (n: number) => `completed ${n} action${n === 1 ? "" : "s"}`,
  artifacts: (n: number) => `created or used ${n} artifact${n === 1 ? "" : "s"}`,
  outcomes: (n: number) => `updated ${n} outcome${n === 1 ? "" : "s"}`,
  added: (n: number, kinds: string) => `You added ${n} thing${n === 1 ? "" : "s"} yourself: ${kinds}.`,
  logged: (quote: string) => `You logged: “${quote}”`,
  next: "Your next best move",
  openStep: "Open this step",
  none: "No next move yet. Your plan offers one when it fits.",
} as const;

/* -----------------------------------------------------------------------------
   THE DIRECTION, AND HER OWN CALENDAR (Concept 1 tweak, 2026-10-04)
   Her direction is hers to change at any time, and changing it never changes
   her plan on its own. Her calendar holds what she adds herself, by hand: V1
   has no connections, so nothing syncs from Google or Outlook.
   -------------------------------------------------------------------------- */

export const DIRECTION_COPY = {
  heading: "Your direction",
  fromOnboarding: "In your words, from when you started. You can change it any time.",
  edited: "Edited by you.",
  editLabel: "Edit",
  fieldLabel: "Where are you headed?",
  fieldHint: "In your own words. Change it whenever it changes.",
  save: "Save",
  cancel: "Cancel",
  saved: "Saved. Your plan stays as it is.",
  mayChange: "If this points somewhere new, you can change your plan from the roadmap.",
  errorEmpty: "Say a little about where you’re headed.",
} as const;

/** Something she put on her own calendar. Plan steps are separate: they come
 *  from the plan and carry their own dates. */
export interface CalendarItem {
  id: string;
  title: string;
  /** The day, as YYYY-MM-DD. */
  date: string;
  note?: string;
}

/** A plan step as the calendar and the agenda show it: read-only there, since she changes a step
 *  from its card. `suggested` until she accepts it or moves it. */
export interface CalendarStep {
  id: string;
  title: string;
  date: string;
  suggested: boolean;
}

/** What her calendar holds before she changes it: two things she told us about. */
export const CALENDAR_SEED: CalendarItem[] = [
  { id: "seed-1", title: "Growth Summit panel", date: "2026-10-29", note: "Panel: planning for growth" },
  { id: "seed-2", title: "Leadership forum talk proposal due", date: "2026-11-13" },
];

/* -----------------------------------------------------------------------------
   THE ROADMAP AS AN AGENDA (Concept 1)
   Stages stacked as cards, each with its period, what finishing looks like and
   what she has on her calendar inside it. Periods are a suggested pace: they
   move as she does and are never a deadline.
   -------------------------------------------------------------------------- */

export const AGENDA_COPY = {
  summary: (stages: number, weeks: number, from: string, to: string) =>
    `${stages} stages · about ${weeks} weeks · ${from} to ${to}`,
  pace: "A suggested pace, not a deadline. The windows move as you do. When you finish a stage, we recommend the next one.",
  stageOf: (n: number, total: number) => `Stage ${n} of ${total}`,
  about: (weeks: number) => `about ${weeks} week${weeks === 1 ? "" : "s"}`,
  states: { current: "You are here", done: "Done", recommended: "Recommended next" },
  finishing: "Finishing looks like",
  outcomes: "By the end you’ll have",
  nothingYet: "Nothing on your calendar in this stage yet.",
  finish: "I’ve finished this stage",
  thenNext: (n: number, name: string) => `Then we’ll recommend Stage ${n}, ${name}.`,
  thenAfter: "Then we’ll plan the next stretch with you, from what worked and what didn’t.",
  suggestTitle: "You’ve done what this stage asks.",
  suggestBody: "Mark it finished and we’ll recommend the next stage. Or keep going.",
  markFinished: "Mark stage finished",
  notYet: "Not yet",
  pastPace: "You’re past the suggested pace for this stage. That’s fine. Finish it when you’re ready.",
  recommendedTitle: (n: number, name: string) => `Stage ${n}: ${name}`,
  recommendedBody: (period: string, weeks: number) => `Suggested ${period} · about ${weeks} weeks.`,
  start: "Start this stage",
  allDone: "That’s every stage.",
  allDoneBody: "ExecHQ plans the next stretch with you, from what worked and what didn’t.",
  outside: "Outside the stage windows",
  yours: "Yours",
  step: "Step from your plan",
} as const;

/* -----------------------------------------------------------------------------
   THE CALENDAR
   -------------------------------------------------------------------------- */

export const CALENDAR_COPY = {
  heading: "Your calendar",
  legend: "Stages",
  legendItem: (n: number, name: string) => `${n} · ${name}`,
  prev: "Previous month",
  next: "Next month",
  gridHint: "Use the arrow keys to move between days.",
  today: "today",
  stageStart: (n: number) => `Stage ${n} starts`,
  inStage: (n: number) => `stage ${n}`,
  items: (n: number) => `${n} item${n === 1 ? "" : "s"}`,
  more: (n: number) => `+${n} more`,
  outside: "Outside the roadmap’s windows",
  nothingDay: "Nothing on this day.",
  add: "Add to my calendar",
  addTo: (day: string) => `Add to ${day}`,
  yours: "Yours",
  step: "Step from your plan",
  suggested: "Suggested",
  pinned: "On your plan",
  openStep: "Open this step",
  edit: "Edit",
  delete: "Delete",
  deleteAsk: "Delete this?",
  deleteYes: "Delete",
  deleteNo: "Keep it",
  agenda: "Agenda",
  calendar: "Calendar",
  view: "View",
  addStage: "Add to this stage",
  manualOnly: "Only you add to this. Nothing syncs from another calendar.",
} as const;

export const ITEM_COPY = {
  title: "Add to your calendar",
  editTitle: "Edit your item",
  whatLabel: "What is it?",
  whatPlaceholder: "Lunch with the CMO",
  whenLabel: "When?",
  noteLabel: "A note",
  noteHint: "Optional.",
  save: "Add",
  saveEdit: "Save",
  cancel: "Cancel",
  inStage: (n: number, name: string) => `That falls in Stage ${n}, ${name}.`,
  outsideStage: "That is outside the roadmap’s windows. It will still be on your calendar.",
  errorWhat: "Say what it is.",
  errorWhen: "Pick a date.",
} as const;

/* -----------------------------------------------------------------------------
   WHEN A STEP FALLS ON HER CALENDAR (Concept 1 tweak)
   A step has a window in the product (1 to 7 days, 8 to 30, a quarter), not a
   date. It gets a suggested day from its window, or from the event it is tied
   to, and shows on her calendar marked "Suggested". Accepting it pins that day;
   she can move it to any day she likes. Nothing here is a deadline.
   -------------------------------------------------------------------------- */

export type StepTiming =
  | { kind: "weekday"; /** 0 Sunday to 6 Saturday. The next one, today if it is today. */ dow: number }
  | { kind: "monthEnd" }
  | { kind: "fixed"; date: string };

/** The steps tied to something she told us about: her 1:1 on Tuesday, the check-in on Thursday,
 *  nominations closing at the end of the month, the planning cycle in January. The rest follow
 *  their horizon. */
export const STEP_TIMING: Record<string, StepTiming> = {
  "use-story": { kind: "weekday", dow: 2 },
  "brief-manager": { kind: "weekday", dow: 4 },
  "q1-review": { kind: "monthEnd" },
  "scope-case": { kind: "fixed", date: "2027-01-11" },
};

/** Days from today a step is suggested for when nothing ties it to a day, by horizon. */
export const HORIZON_OFFSET_DAYS: Record<Horizon, number> = { short: 3, medium: 14, long: 60 };
