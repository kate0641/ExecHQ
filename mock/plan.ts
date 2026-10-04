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
}

const ADDED_STAGES: Record<string, { at: number; stage: RoadmapStep }> = {
  "leadership-scope": {
    at: 3,
    stage: {
      title: "Make the case",
      milestone: "You’ve asked for the broader role, with your record behind you.",
      outcomes: ["A documented case for broader scope", "The ask, made to the person who decides"],
      added: true,
    },
  },
  "executive-presence": {
    at: 3,
    stage: {
      title: "Keep it going",
      milestone: "You have a rhythm you can keep up, and you know which rooms keep inviting you.",
      outcomes: ["A rhythm for publishing and speaking that fits your week", "A short list of what is working"],
      added: true,
    },
  },
  "inflection-point": {
    at: 2,
    stage: {
      title: "Rehearse the conversations",
      milestone: "You’ve said the hard parts out loud to someone who will push back.",
      outcomes: ["The two or three conversations that matter, practised", "Answers to the questions you least want"],
      added: true,
    },
  },
  "current-org": {
    at: 3,
    stage: {
      title: "Frame the opportunities",
      milestone: "You’ve put two openings in front of leadership, in terms they care about.",
      outcomes: ["Two internal opportunities, written as the business sees them"],
      added: true,
    },
  },
  explore: {
    at: 2,
    stage: {
      title: "Build the story that travels",
      milestone: "You can say in a minute why your next direction follows from what you’ve done.",
      outcomes: ["A short story of where you’re headed that holds up with strangers"],
      added: true,
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

export const TIMING_OPTIONS = ["This week", "Next week", "This month", "Later"] as const;
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
  edited: (timing?: string, lighter?: boolean) =>
    [timing, lighter ? "Lighter version" : undefined].filter(Boolean).join(" · "),
  declinePrompt: "Say why, if you like. One tap.",
  declineNoReason: "Not for me, no reason",
  deferPrompt: "Bring it back on",
  deferConfirm: "Do it later",
  timing: "When",
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
