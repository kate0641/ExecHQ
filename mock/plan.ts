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
   Each stage has a suggested period (`weeks`), a pace that moves as she does and
   is never a deadline: this replaces 2026-09-29's "no end date" (decided
   2026-10-04), and the plan still carries on after the last stage. Stages
   describe work, not achievement: nothing unlocks and nothing is levelled.
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
  /** What she will have when it is done, in a sentence that starts after "You'll have". */
  outcome: string;
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

/** What each step leaves her with. */
const OUTCOMES: Record<string, string> = {
  "use-story": "You’ve said what you lead, out loud, to the person who decides.",
  "brief-manager": "A one-page brief your manager can read before Thursday.",
  "add-wins": "Three recent accomplishments your drafts can draw on.",
  "q1-review": "Your name is in for the Q1 planning review.",
  "cross-functional": "One cross-functional initiative you could lead.",
  "scope-case": "A documented case for broader scope, ready for the planning cycle.",
  "ask-manager-scope": "You know what broader scope means to your manager.",
  "share-result-up": "One of your results in front of someone two levels up.",
  "sponsor-conversation": "A plan for your first conversation with the review’s sponsor.",
  "map-decision-makers": "A short list of who decides on a broader role.",
  "name-successor": "A name for who could run your team when you move up.",
  "stakeholder-map": "A message map for each team on the workstream.",
  "bio": "A short, medium and long bio, ready to send.",
  "linkedin-post": "A post saying what you lead, published.",
  "pitch-podcast": "A pitch to a podcast the people above you follow, sent.",
  "speaking-proposal": "A talk proposal for the leadership forum, sent.",
  "read-briefing": "You know what is moving in your field this week.",
};

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
    outcome: OUTCOMES["bio"],
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
    outcome: OUTCOMES["stakeholder-map"],
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
    outcome: OUTCOMES["linkedin-post"],
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
    outcome: OUTCOMES["pitch-podcast"],
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
    outcome: OUTCOMES["speaking-proposal"],
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
    outcome: OUTCOMES["read-briefing"],
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
  outcome: OUTCOMES[a.id],
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

/* -----------------------------------------------------------------------------
   WHAT A STAGE CHECK-IN CHANGES (Plan Concept 3). Mock: in the product the
   model chooses these from what she said. Step up only; another plan has none.
   -------------------------------------------------------------------------- */

/** Steps ExecHQ rates important: passed on once, they are offered once more at her next stage check-in.
 *  Passed on twice, no step is ever offered again. */
export const IMPORTANT_STEPS: readonly string[] = ["add-wins", "cross-functional", "ask-manager-scope"];

/** For each stage, by index, the step aimed at what finishing it looks like: offered first when she says she
 *  only partly got there, or not yet. */
export const GAP_STEP: Readonly<Record<number, string>> = {
  0: "bio",
  1: "add-wins",
  2: "map-decision-makers",
  3: "scope-case",
};

/** A different way at the same thing, for a step that did not go the way she hoped. Never the same step again. */
export const OTHER_WAY_STEP: Readonly<Record<string, string>> = {
  "use-story": "linkedin-post",
  "brief-manager": "share-result-up",
  "add-wins": "share-result-up",
  "q1-review": "sponsor-conversation",
  "scope-case": "map-decision-makers",
};

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
  horizonInUse: (n: number, max: number) => `${n} of ${max}`,
  horizonLabels: { short: "Short-term", medium: "Medium-term", long: "Long-term milestone" } as Record<Horizon, string>,
  previousStep: "Previous step",
  nextStep: "Next step",
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
  /** The compact card, for the swiping row. */
  whenLabel: "When",
  askLabel: "Ask ExecHQ",
  effort: "Effort",
  doneWhen: "Done when",
  offered: "Offered",
  accepted: "Accepted",
  edited: (moved?: string, lighter?: boolean) =>
    [moved, lighter ? "Lighter version" : undefined].filter(Boolean).join(" · "),
  editedByYou: "Edited by you",
  /** When a step is shown in words (`timingWords`, or `whenWords` once she has moved it), never as a day. */
  declinePrompt: "Say why, if you like. One tap.",
  declineNoReason: "Not for me, no reason",
  deferPrompt: "Bring it back",
  deferConfirm: "Do it later",
  timing: "When",
  scope: "How much",
  save: "Save",
  cancel: "Cancel",
  recordIt: "Add it to your record",
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

/** The one thing she can add that is a number, not an event: her LinkedIn followers, as of a day. */
export const FOLLOWERS_CHOICE = { id: "followers", label: "My LinkedIn followers" } as const;
export type EntryChoice = EntryTypeId | typeof FOLLOWERS_CHOICE.id;

export const entryTypeOfKind = (kind: string) => ENTRY_TYPES.find((t) => t.kind === kind) ?? ENTRY_TYPES[4];

/** Where an outside activity belongs on her plan when she did not say. A
 *  stand-in rule: for Step up every outside channel is about being seen as a
 *  leader. When she adds from an artifact, that artifact's area wins. */
export const DEFAULT_AREA = "seen-as-leader";
export const OTHER_AREA = "elsewhere";
export const OTHER_AREA_NAME = "Elsewhere on your plan";

/** What kind of activity an item is, for the Signal Picture's 30 and 90 day
 *  views: the way she would say it, not the plan area it moves. "Inside" is
 *  work that stays in the organisation, a conversation with a manager. */
export type ActivityType = "publishing" | "speaking" | "podcast" | "press" | "inside" | "other";

export const ACTIVITY_TYPES: { id: ActivityType; label: string }[] = [
  { id: "publishing", label: "Publishing" },
  { id: "speaking", label: "Speaking" },
  { id: "podcast", label: "Podcasts" },
  { id: "press", label: "Press" },
  { id: "inside", label: "Inside your organisation" },
  { id: "other", label: "Something else" },
];

/** A step's presence channel, as an activity type. LinkedIn and content are both publishing. */
export const ACTIVITY_OF_CHANNEL: Record<Channel, ActivityType> = {
  linkedin: "publishing",
  content: "publishing",
  speaking: "speaking",
  podcast: "podcast",
  press: "press",
};

/** What a kind of artifact is, when no step says: writing is publishing, and the rest stays inside. */
export const ACTIVITY_OF_ARTIFACT: Record<string, ActivityType> = {
  "thought-leadership": "publishing",
  pitch: "inside",
  positioning: "inside",
  "situation-brief": "inside",
};

export const WINDOWS = [7, 30, 90] as const;
export type WindowDays = (typeof WINDOWS)[number];

export const SIGNAL_PICTURE_COPY = {
  heading: "Your Signal Picture",
  /** The homepage’s starting-point counts, kept under the new picture until the homepage is chosen. */
  startedHeading: "Where you started",
  recorded: "Recorded in ExecHQ",
  added: "You added",
  /** The path variant: how she has grown, a circle for each month, with her next step ahead. */
  growth: {
    heading: "How you’ve grown",
    intro: "Your own record since you started. Not scored, and not compared with anyone.",
    tap: "Tap a circle to see what is in it.",
    nothing: "Nothing added yet. What you add shows here, and your picture grows.",
    next: "Next",
    nextLabel: "Your next step",
    nextCaption: "Next:",
    adds: (lane: string) => `Adds one to ${lane}.`,
    why: "Why this step",
    start: "Start in the Toolbox",
    keep: "Keep working on it",
    month: (name: string, n: number) => `${name}: ${n} ${n === 1 ? "thing" : "things"}`,
    quiet: (name: string) => `${name}: nothing added`,
  },
  add: "Add something you did",
  edit: "Edit",
  delete: "Delete",
  deleteAsk: "Delete this entry?",
  deleteYes: "Delete",
  deleteNo: "Keep it",
  offer: (title: string) => `You marked “${title}” published. Add it to your record?`,
  offerYes: "Add it",
  offerNo: "Not now",
  impactHeading: "What came of it",
  nextLabel: "Next action",
  impactAdd: "Add what came of it",
  /** The block that shows only what she says came of the things she did. */
  cameOf: {
    heading: "What came of it",
    intro: "What you told us came of the things you did, in your words. Nothing is worked out for you.",
    none: "Nothing reported yet. When you add what came of something you did, it shows here.",
    /** A thing she did with no reply: neutral, never a miss. */
    noReply: "Nothing reported yet",
    /** Said under it when she can tap it. */
    report: "Tap to report",
    cameOfIt: "What came of it: ",
    more: (n: number) => `Show ${n} more`,
    fewer: "Show fewer",
  },
  openLink: "Open link",
  opensNewTab: "(opens in a new tab)",
  did: (title: string) => `Did: ${title}`,} as const;

/** The drawer she reports what came of something in. */
export const REPORT_COPY = {
  title: "What came of it?",
  toneLabel: "How did it go?",
  textLabel: "What came of it, in your words",
  textHint: "Just enough for you to recognise it.",
  errorText: "Write a line about what came of it.",
  errorTone: "Choose how it went.",
  save: "Save",
  cancel: "Cancel",
  privacy: "Only you see this. It is kept as you wrote it.",
} as const;

/** The drawer she adds things in: one row at first, more when she wants them. */
export const ENTRY_DRAWER_COPY = {
  title: "Add what you did",
  rowName: (n: number) => `Thing ${n}`,
  addRow: "Add another thing",
  remove: "Remove this row",
  leaveOut: "Leave this one out",
  save: (n: number) => (n > 1 ? `Add ${n} things` : "Add"),
  cancel: "Cancel",
  errorNone: "Fill in a row: what it was and when.",
  rowError: "Choose what it was, and a date that is not in the future.",
} as const;

export const ENTRY_COPY = {
  title: "Add something you did",
  editTitle: "Edit what you added",
  typeLabel: "What did you do?",
  dateLabel: "When was it?",
  noteLabel: "A link or a note",
  noteHint: "Optional. Just enough for you to recognise it.",
  notePlaceholder: "https://",
  /** Shown while she adds, when the same kind of thing is already in her picture. */
  sameRecorded: (text: string, when: string) => `ExecHQ already recorded this on ${when}: “${text}”.`,
  sameAdded: (text: string, when: string) => `You already added this on ${when}: “${text}”.`,
  sameIs: "That’s the one",
  sameNot: "If it is a different one, add it as normal.",
  followersLabel: "How many followers now?",
  followersHint: "Look at your profile and type the number.",
  followersPlaceholder: "e.g. 1,310",
  followersDateLabel: "As of when?",
  errorFollowers: "Type a whole number, such as 1,310.",
  impactLabel: "What came of it?",
  impactHint: "Optional. A reply, a comment, an invitation, or nothing yet. In your words.",
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
  labelBasis:
    "From what you completed, made and logged in the last 90 days. It is not a grade, and it does not say your work caused any result.",
  nextMove: "Your next move",
  nextMoveAction: "Start",
  /** The sections she sees as her history grows: the newest leads. Nobody chooses a window. */
  sectionHeading: { 7: "Last 7 days", 30: "Last 30 days", 90: "Last 90 days" } as Record<WindowDays, string>,
  /** The 30-day view: how steadily she completed actions, week by week. */
  consistency: (active: number, weeks: number) =>
    `You completed something in ${active} of the last ${weeks} weeks.`,
  consistencyNone: (weeks: number) => `No completed action in the last ${weeks} weeks yet.`,
  weekTo: (to: string, done: number) => `to ${to}: ${done} completed`,
  placeholderRule: "Placeholder rule · D&T to define",
  /** The pictures. Words come with each one. */
  dial: {
    aria: (days: number) => `A ring with one tick for each of the last ${days} days. A longer dark tick is a day she did something.`,
    legend: (hasFuture: boolean) =>
      `One tick for each of the past 30 days. A taller tick is a day you did something. Today is the thick gold one.${hasFuture ? " Dots are days still to come." : ""}`,
    day: (n: number) => `Day ${n}`,
    ofPlan: "of your plan",
  },
  week: {
    heading: "This week",
    legend: "A dark circle is a day you did something. A dashed circle is a day still to come.",
    did: "you did something",
    none: "nothing recorded",
    notYet: "not yet",
    nothing: "Nothing yet this week.",
  },
  /** Her first week: what she has done so far, as plain lines, and what comes next. No counts, so no zeros. */
  soFarHeading: "So far",
  soFarNone: "Nothing yet. Your first draft will show up here.",
} as const;

/* -----------------------------------------------------------------------------
   HER OWN CALENDAR (Concept 1 tweak, 2026-10-04)
   Her calendar holds what she adds herself, by hand: V1
   has no connections, so nothing syncs from Google or Outlook.
   -------------------------------------------------------------------------- */

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
  summary: (stages: number, weeks: number) => `${stages} stages · about ${weeks} weeks`,
  /** When a stage is aimed at, in words: where its suggested end falls. */
  suggested: (when: string) => `Aim for: ${when.toLowerCase()}`,
  pace: "A suggested pace, not a deadline.",
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
  recommendedBody: (when: string, weeks: number) => `Aim for ${when.toLowerCase()} · about ${weeks} weeks.`,
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

/**
 * When a step is suggested, said in words, because most suggested days are not real: a date on every
 * card reads as a deadline. The steps tied to something she told us name it. The rest follow their
 * horizon. Once she accepts a step or moves it, the card shows that day instead.
 */
const TIMING_WORDS: Record<string, string> = {
  "use-story": "At your 1:1 on Tuesday",
  "brief-manager": "Before Thursday’s check-in",
  "q1-review": "By the end of the month",
  "scope-case": "Before the January planning cycle",
};

const HORIZON_TIMING_WORDS: Record<Horizon, string> = {
  short: "This week",
  medium: "In the next few weeks",
  long: "This quarter",
};

export const timingWords = (step: { id: string; horizon: Horizon }): string => TIMING_WORDS[step.id] ?? HORIZON_TIMING_WORDS[step.horizon];

/* -----------------------------------------------------------------------------
   CHANGING A STEP (the compact card)
   A quiet text link under the main button takes over the whole card with a few
   plain questions, then a free-type box for her reasons. Nothing here asks "are
   you sure?" and nothing counts against her. What she writes is kept for the
   advisor and never shown back unasked.
   -------------------------------------------------------------------------- */

export const CHANGE_COPY = {
  link: "Edit",
  title: "Edit this step",
  question: "What would you like to do?",
  options: {
    edit: { label: "Change the details", hint: "When, how long it will take you, or what counts as done." },
    replace: { label: "Ask for a different step", hint: "Tell us why, and we’ll offer another." },
  },
  keep: "Keep it as it is",
  back: "Back",
  /* Edit this step */
  editWhen: "When",
  editWhenHint: "When suits you. It shows on your calendar.",
  editHowLong: "How long will it take you?",
  editHowLongHint: "Your own estimate. Leave it if ours is right.",
  howLongOptions: ["A few minutes", "About an hour", "An hour or two", "Several sittings"],
  editDone: "What counts as done?",
  editDoneHint: "In your own words. It starts as ours.",
  editNote: "Anything you’d like us to know?",
  editNoteHint: "Optional. Only you see it.",
  editSubmit: "Save changes",
  /* Ask for a different step */
  replaceReason: "What’s the main reason?",
  replaceReasonHint: "Pick one if it fits. You can skip this.",
  replaceNote: "What would you like instead?",
  replaceNoteHint: "In your own words. It helps ExecHQ choose the next step. Only you see it.",
  replaceSubmit: "Ask for a different step",
} as const;

/* -----------------------------------------------------------------------------
   THE PLAN DETAIL (2026-10-06)
   See your plan opens the detail: the plan, where she is on it and her
   direction, with the way into the edit flow. Her direction is changed there,
   by the onboarding questions again, not typed in place.
   -------------------------------------------------------------------------- */

export const PLAN_DETAIL_COPY = {
  title: "Your plan and your direction",
  why: "Why this plan",
  here: "Where you are",
  stages: "The stages",
  youAreHere: "You are here",
  direction: "Your direction",
  edited: "Edited by you.",
  how: "Changing your direction takes you through the questions again. At the end you choose your plan, and you can keep this one. Everything you have done stays.",
  change: "Change my direction",
  close: "Close",
} as const;

/** Plan Concept 3: her direction above the road, opening like an accordion, and the way into the plan detail. */
export const PLAN_DIRECTION_COPY = {
  label: "Your direction",
  more: "See your plan",
} as const;

/**
 * The stage check-in (Plan Concept 3). ExecHQ decides a stage is finished, from her work, and asks how it
 * went before it builds on it: what came of anything she has not said yet, whether she got what finishing
 * looks like, and how she feels about her plan now. Every part can be skipped, and "Later" is always there.
 */
export const STAGE_CHECKIN_COPY = {
  part: "Stage check-in",
  introKicker: (n: number, of: number) => `Stage ${n} of ${of} · Finished`,
  introTitle: (stage: string) => `You finished ${stage}`,
  introLede: "Here’s what you did. Before ExecHQ builds on it, tell it how it went.",
  introQuestion: "Check in on this stage?",
  introNote: (unreported: number) =>
    `${unreported ? `${unreported === 1 ? "One thing" : `${unreported} things`} to hear about, then how the stage went.` : "How the stage went."} About two minutes. You can skip any of it.`,
  start: "Start the check-in",
  later: "Later",
  nothingDone: "Nothing from this stage is in ExecHQ yet.",
  // What she did, by where it came from.
  fromSteps: "Your steps",
  fromExecHQ: "In ExecHQ",
  fromYou: "Yours",
  passed: "You passed on it",
  unreported: "Not reported yet",
  used: (on: string) => `Used ${on}`,
  done: (on: string) => `Done ${on}`,
  added: (on: string) => `Added ${on}`,
  // One page per thing she has not said what came of.
  itemTitle: "What came of it?",
  itemWhyLabel: "Why ExecHQ asks",
  itemWhy: "What worked here decides what the next stage leans on.",
  toneLabel: "How did it go?",
  wordsLabel: "What came of it, in your words",
  wordsHint: "Optional.",
  next: "Next",
  skipOne: "Skip this one",
  // Whether she got what finishing looks like.
  milestoneKicker: (stage: string) => stage,
  milestoneTitle: "Did you get what finishing looks like?",
  milestoneWhyLabel: "Finishing looks like",
  milestoneQuestion: "Where did you land?",
  milestones: [
    { id: "yes", label: "Yes" },
    { id: "partly", label: "Partly" },
    { id: "not-yet", label: "Not yet" },
  ],
  skip: "Skip",
  // How she feels about her plan now.
  feelingKicker: "Before the next stage",
  feelingTitle: "How are you feeling about your plan now?",
  feelingLede: "However it went is useful. ExecHQ shapes what comes next around it.",
  feelingQuestion: "Right now I’m feeling…",
  feelings: [
    { id: "more-sure", label: "More sure of it" },
    { id: "same", label: "About the same" },
    { id: "less-sure", label: "Less sure" },
    { id: "stuck", label: "Stuck" },
  ],
  feelingWordsLabel: "Anything ExecHQ should know?",
  privacy: "Only you see this. It is kept as you wrote it.",
  seeStage: "See your stage",
  // The read-back.
  summaryKicker: (stage: string) => `Your check-in · ${stage}`,
  summaryTitle: "Your stage, in your words",
  didHeading: "What you did",
  stillOpen: (n: number) => `${n === 1 ? "One thing is" : `${n} things are`} still unreported. You can tell ExecHQ later, from the thing itself.`,
  wentHeading: "How the stage went",
  milestoneLabel: "Finishing looks like",
  feelingLabel: "How you’re feeling",
  notAnswered: "Not answered",
  onTo: (next: string | undefined) => (next ? `On to ${next}` : "Back to your plan"),
  change: "Change an answer",
  // On the finished stage in the roadmap, afterwards.
  recapLabel: "Your check-in",
  recapLanded: "Where you landed",
  recapOpen: "See your check-in",
  recapLater: "Tell ExecHQ how this stage went, and it builds on what worked.",
  recapStart: "Check in on this stage",
  // What the check-in changes, said on the step it changed and in the read-back.
  heardGapPartly: "You said you partly got what finishing looks like. This picks up what’s still missing.",
  heardGapNotYet: "You said not yet, so the stage stays open. This is aimed at what’s missing.",
  heardOtherWay: (title: string) => `“${title}” didn’t go the way you hoped. This is a different way at it.`,
  heardAgain: "You passed on this before. Worth another look?",
  replyThanks: "Thanks.",
  replyThanksUnsure: "Thanks for saying so.",
  replyYes: (next: string | undefined) => (next ? `${next} is next, and it builds on what went well here.` : "What comes next builds on what went well here."),
  replyPartly: (next: string | undefined) => (next ? `${next} is next. Its first step picks up what’s still missing here.` : "Your next step picks up what’s still missing here."),
  replyNotYet: "Then this stage stays open, with a step aimed at what’s missing.",
  replyUnsureMore: "From here it’s one step at a time, and you can talk any of it through first.",
  replyOtherWay: "Where something didn’t go the way you hoped, there’s a different way at it on your plan.",
  replyAgain: "And one thing you passed on is back for another look.",
} as const;

/** Where the edit flow starts: the onboarding questions, pre-filled, ending back on the Plan. */
export const EDIT_FLOW_HREF = "/onboarding/concept-3?edit=1";

/* -----------------------------------------------------------------------------
   THE ROADMAP TIMELINE AND ITS SPARKS (Concept 1 rework, 2026-10-06)
   The roadmap is the draft she started with, and the sparks on it say what
   happened and how her plan moved. They say what happened, never that one
   thing caused another, and they carry no days: a time is said in words.
   -------------------------------------------------------------------------- */
export const SPARK_NOTES = {
  labels: {
    stage: "Stage finished",
    pace: "Pace",
    direction: "Your direction",
    plan: "Plan changed",
    step: "Your steps",
    record: "In ExecHQ",
    signal: "Signal Picture",
  },
  finished: (stage: string, weeks: number, next?: string) => {
    const when =
      weeks === 0
        ? `You finished ${stage} about when the draft said.`
        : weeks < 0
          ? `You finished ${stage} ${-weeks} week${weeks === -1 ? "" : "s"} ahead of the draft.`
          : `You finished ${stage} ${weeks} week${weeks === 1 ? "" : "s"} after the draft.`;
    const moved = next
      ? weeks === 0
        ? ` ${next} stays where it was.`
        : ` ${next} moved ${weeks < 0 ? "up" : "back"} with you.`
      : " That was the last stage, and the plan carries on.";
    return when + moved;
  },
  pastPace: "This stage is running past the draft’s pace. The stages after it have moved back with you. There is no deadline.",
  completed: (title: string) => `You finished “${title}”. It counts toward this stage.`,
  declined: (title: string) => `You passed on “${title}”. ExecHQ offered a different step in its place.`,
  deferred: (title: string, when?: string) => `You put off “${title}”.${when ? ` It comes back ${when.toLowerCase()}.` : ""}`,
  recorded: (text: string) => `${text}.`,
  added: (text: string) => `You added to your Signal Picture: ${text}.`,
  directionKept: "You updated your direction. Your plan stayed as it was.",
  directionMoved: (from: string, to: string) =>
    `You changed your direction, and your plan moved from ${from} to ${to}. ${from} stays above as the draft you started with.`,
  planMoved: (from: string, to: string) => `You changed plan, from ${from} to ${to}. ${from} stays above as the draft you started with.`,
} as const;

export const TIMELINE_COPY = {
  /** After the last stage: the plan does not end there. */
  afterTitle: "Then ExecHQ builds the next stage",
  afterBody: "As you finish these stages, ExecHQ builds the next one for your plan with you, from what worked and what didn’t.",
  haveLabel: "What you’ll have",
  calendarCount: (n: number) => `On your calendar in this stage (${n})`,
  calendarEmpty: "Add to this stage",
  earlierTitle: (name: string) => `First draft: ${name}`,
  earlierNow: "Where you were",
  earlierSetAside: "Set aside",
  nowTitle: (name: string) => `Now: ${name}`,
  moreSparks: (n: number) => `${n} more`,
  sparksLabel: "What changed on this stage",
} as const;

/* -----------------------------------------------------------------------------
   A STEP'S QUESTIONS (Concept 2 rework, 2026-10-06)
   On Concept 2 a step is its title and a way to start. Everything else the card
   used to carry is a question she can ask, and the advisor answers it in the
   chat from the same fields. Asking never changes the step.
   -------------------------------------------------------------------------- */
export type StepQuestion = "why" | "take" | "else" | "stuck" | "big" | "begin" | CardQuestion;

/** Concept 1's step card (2026-10-07): one question per tile, in her voice, each answered on its own. */
export type CardQuestion = "this" | "now" | "me" | "moves" | "long" | "done";
export const CARD_QUESTIONS: { id: CardQuestion; label: string }[] = [
  { id: "this", label: "Why this?" },
  { id: "now", label: "Why now?" },
  { id: "me", label: "Why me?" },
  { id: "moves", label: "What does it move?" },
  { id: "long", label: "How long will it take?" },
  { id: "done", label: "When am I done?" },
];

/** Three ways in: why it is here, what it takes, and anything else. Each opens the chat. */
export const STEP_QUESTIONS: { id: StepQuestion; label: string }[] = [
  { id: "why", label: "Why this step?" },
  { id: "take", label: "What will it take?" },
  { id: "else", label: "Ask something else" },
];

const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1).replace(/\.$/, "");
const upper = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).replace(/\.$/, "");

export const STEP_ANSWERS = {
  /** Why this, why now, why her, and what it moves: one answer. */
  why: (step: { whyThis: string; whyNow: string; whyYou: string }, area?: string) => [
    step.whyThis,
    step.whyNow,
    step.whyYou,
    area ? `It moves “${area}”.` : "It is not tied to one of your signals, so it moves your plan as a whole.",
  ],
  /** How long it will take, and what counts as done: one answer. */
  take: (step: { effortText: string; done: string }) => [`Plan on ${lower(step.effortText)}.`, `It counts as done when ${lower(step.done)}.`],
  else: (title: string) => `What would you like to know about “${title}”?`,
  /** She said she wants to talk it through: what is in the way? */
  stuck: "What’s getting in the way? Pick one, or tell me in your own words.",
  big: "Try a lighter version: do only the first part, and leave the rest for later.",
  begin: (outcome: string) => `Start from where you want to end up: ${outcome.charAt(0).toLowerCase()}${outcome.slice(1)} Open it, write the first line, and stop there.`,
  /** Concept 1's card questions, one fact each. Her own estimate and her own done replace ours. */
  moves: (area?: string) =>
    area ? `“${upper(area)}.” That’s the signal this step feeds on your plan.` : "It isn’t tied to one of your signals, so it moves your plan as a whole.",
  long: (effort: string) => `Plan on ${lower(effort)}.`,
  done: (done: string) => `It counts as done when ${lower(done)}.`,
  /** The first line of an answer, shown on the step before she asks. */
  teaseWhy: (step: { whyLine?: string; whyNow: string }) => step.whyLine ?? step.whyNow,
  teaseTake: (step: { effortText: string; done: string }) => `${upper(step.effortText)}. Done when ${lower(step.done)}.`,
} as const;

/* -----------------------------------------------------------------------------
   THE AGENDA (Concept 2 rework, 2026-10-06)
   The roadmap as an agenda: a drawer for each stage, only the one she is on open, and
   in it her steps and what she added herself, each with a time in words.
   -------------------------------------------------------------------------- */
export const PLAN_AGENDA_COPY = {
  heading: "Your roadmap",
  stageOf: (n: number, total: number) => `Stage ${n} of ${total}`,
  finishing: "Finishing looks like",
  yours: "Yours",
  done: "Done",
  askLabel: "Ask ExecHQ",
  getStarted: "Get started",
  doneIt: "I’ve done this",
  addLabel: "Add to your plan",
  addTitle: "What is it?",
  addPlaceholder: "A talk, a meeting, a deadline",
  addWhen: "When",
  addSubmit: "Add to my plan",
  addCancel: "Cancel",
  added: (stage: string, when: string) => `Added to ${stage}, ${when.toLowerCase()}.`,
  nothing: "Nothing in this stage yet.",
  nothingDone: "Nothing left to do in this stage.",
} as const;

/* -----------------------------------------------------------------------------
   THE GUIDED CHECK-IN (Concept 3 rework, 2026-10-06)
   The Plan as a short run of pages, one move each, as onboarding asks one question at a time:
   the page says the move and why it matters, and the drawer holds where she is with it. Her
   answer changes her plan for real, and comes back as a short reply in the serif voice.
   -------------------------------------------------------------------------- */
export type GuidedAnswer = "plan" | "talk" | "pass";

export const GUIDED_COPY = {
  kicker: (n: number, total: number, when: string) => `Move ${n} of ${total} · ${when}`,
  question: "Where are you with this?",
  peek: "Tap to answer",
  /** The answers. Working on it is the start button, which opens the step. */
  answers: (when: string) =>
    [
      { id: "plan", label: `I’ll do it ${when.toLowerCase()}`, hint: "It goes on your plan for then" },
      { id: "talk", label: "Talk it through", hint: "Ask ExecHQ what’s in the way" },
      { id: "pass", label: "Not for me", hint: "ExecHQ offers a different step" },
    ] as { id: GuidedAnswer; label: string; hint: string }[],
  /** Moving it: the time words she can choose instead. */
  changeWhen: "Change when",
  /** The start button, which is also her answer that she is working on it. */
  working: "Keep working on it",
  /** What ExecHQ says back. It says what happened and what moved, never why. */
  reply: (answer: Exclude<GuidedAnswer, "talk">, o: { when: string }) =>
    ({
      plan: `Good. It is on your plan for ${o.when.toLowerCase()}, and ExecHQ will ask you how it went.`,
      pass: "Say why, if you like. One tap, and it shapes what ExecHQ offers next.",
    })[answer],
  /** After the reason, or none. */
  passed: "That is fine. ExecHQ will not offer this one again.",
  noReason: "Skip, no reason",
  reasonLabel: "Why not?",
  next: "Next move",
  seeRoad: "See the road",
  after: "Then ExecHQ builds the next stage, from what worked and what didn’t.",
  lastKicker: "The road ahead",
  lastTitle: "That’s this stretch of the plan.",
  lastLede: "Here is where your plan stands.",
  again: "Go through them again",
  add: "Add to your plan",
  noneTitle: "Nothing to answer right now.",
  noneLede: "Your plan offers the next move when one fits.",
} as const;
