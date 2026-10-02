/**
 * Maya's artifacts, and the five homepage states they can be in.
 *
 * Maya is the PRD's pilot persona: a senior marketing leader whose direction
 * is "I want to move from running campaigns to leading a broader marketing
 * organization", on the Increase Leadership Scope plan (`mock/plan-stub.ts`).
 *
 * By decision on 2026-09-28 these five states replace the Day one / Week
 * three / Month three snapshots. They are picked from the dock and are live:
 * every signed-in page reads them through the Loop, so answering a follow-up
 * on the homepage really does move the page to `just-answered`, and the
 * navigation concepts follow.
 *
 * Every record is built by running the Loop's own moves (`lib/loop.ts`) from
 * creation, so each is a state the Loop can reach, with a history that
 * matches. Dates follow Maya's journey, starting Monday 5 October 2026.
 */

import { MAYA, withConnection, type Account } from "@/mock/account";
import { ACTIONS, type LandscapeAction } from "@/mock/plan-stub";
import type { Recommendation, Snapshot } from "@/mock/snapshots";
import {
  answerFollowUp,
  closeRecord,
  createRecord,
  markReady,
  markUsed,
  startEditing,
  type LoopRecord,
} from "@/lib/loop";

/** The five states, in the order the dock lists them. */
export type HomeStateId =
  | "first-return"
  | "follow-up-due"
  | "drafted-not-used"
  | "nothing-pending"
  | "just-answered";

/* -----------------------------------------------------------------------------
   HER ARTIFACTS
   -------------------------------------------------------------------------- */

/** Her story: the Sprint 1 Positioning Builder draft. */
const story = () =>
  createRecord({
    id: "story",
    kind: "positioning",
    title: "Your leadership story",
    name: "your leadership story",
    on: "2026-10-05",
    recommendation: "Use your leadership story in your next 1:1",
  });

const brief = () =>
  createRecord({
    id: "check-in-brief",
    kind: "situation-brief",
    title: "Brief for your manager check-in",
    name: "your check-in brief",
    on: "2026-10-16",
    recommendation: "Brief your manager before Thursday’s check-in",
  });

const pitch = () =>
  createRecord({
    id: "pitch",
    kind: "pitch",
    title: "Pitch for the Q1 planning review",
    name: "your pitch for the Q1 planning review",
    on: "2026-10-08",
    recommendation: "Put yourself forward for the Q1 planning review",
  });

/** Used in her 1:1 on Tuesday 13 October; check back on the 20th. */
const storyUsed = () =>
  markUsed(markReady(startEditing(story(), "2026-10-06"), "2026-10-07", { intendedUse: "To open my next 1:1 with my manager" }), "2026-10-13", {
    channel: "1:1 with my manager",
  });

/** Sent on Thursday 15 October; check back on the 20th. */
const pitchSent = () =>
  markUsed(startEditing(pitch(), "2026-10-12"), "2026-10-15", { channel: "Email to the review’s sponsor" });

/* -----------------------------------------------------------------------------
   THE NEXT STEPS
   -------------------------------------------------------------------------- */

/** An accepted action as the next step the Concierge and the Drawer offer. */
const asStep = (a: LandscapeAction): Recommendation => ({ id: a.id, title: a.title, why: a.whyNow });
const accepted = (ids: string[]) =>
  ids.map((id) => ACTIONS.find((a) => a.id === id)).filter((a): a is LandscapeAction => Boolean(a)).map(asStep);

/* -----------------------------------------------------------------------------
   THE FIVE STATES
   -------------------------------------------------------------------------- */

const withSite = (account: Account) => withConnection(account, "website", "2026-10-09", "mayachen.com");

export const HOME_STATES: Record<HomeStateId, Snapshot> = {
  "first-return": {
    id: "first-return",
    label: "First return",
    summary: "One draft, the plan just chosen, nothing used yet.",
    today: "2026-10-05",
    account: MAYA,
    records: [story()],
    recommendations: accepted(["use-story", "brief-manager", "q1-review", "scope-case"]),
  },

  "follow-up-due": {
    id: "follow-up-due",
    label: "Follow-up due",
    summary: "Two waiting on outcomes: her story and her pitch.",
    today: "2026-10-20",
    account: withSite(MAYA),
    records: [storyUsed(), pitchSent(), startEditing(brief(), "2026-10-19")],
    recommendations: accepted(["brief-manager", "scope-case"]),
  },

  "drafted-not-used": {
    id: "drafted-not-used",
    label: "Ready, not used",
    summary: "Her check-in brief is ready but not marked used.",
    today: "2026-10-22",
    account: withSite(MAYA),
    records: [
      closeRecord(
        answerFollowUp(storyUsed(), "2026-10-20", {
          type: "neutral",
          detail: "Good conversation. She wants to see it in writing.",
        }),
        "2026-10-20"
      ),
      // "Nothing yet" on the 20th: asked again on the 23rd, so not due today.
      answerFollowUp(pitchSent(), "2026-10-20", { type: "no-response-yet" }),
      markReady(startEditing(brief(), "2026-10-19"), "2026-10-22", { intendedUse: "Thursday’s check-in" }),
    ],
    recommendations: accepted(["brief-manager", "scope-case"]),
  },

  "nothing-pending": {
    id: "nothing-pending",
    label: "Nothing pending",
    summary: "No follow-ups. Her last artifact and her next step.",
    today: "2026-11-03",
    account: withConnection(withSite(MAYA), "linkedin", "2026-10-27", "LinkedIn analytics export, October 2026"),
    records: [
      closeRecord(
        answerFollowUp(storyUsed(), "2026-10-20", {
          type: "neutral",
          detail: "Good conversation. She wants to see it in writing.",
        }),
        "2026-10-20"
      ),
      closeRecord(
        answerFollowUp(
          markUsed(markReady(startEditing(brief(), "2026-10-19"), "2026-10-21"), "2026-10-22", { channel: "Check-in with my manager" }),
          "2026-10-24",
          { type: "positive", detail: "My manager asked me to lead the planning workstream." }
        ),
        "2026-10-24"
      ),
      closeRecord(
        answerFollowUp(answerFollowUp(pitchSent(), "2026-10-20", { type: "no-response-yet" }), "2026-10-30", {
          type: "positive",
          detail: "I’m on the shortlist to lead the review.",
        }),
        "2026-10-30"
      ),
    ],
    recommendations: accepted(["scope-case"]),
  },

  "just-answered": {
    id: "just-answered",
    label: "Just answered",
    summary: "An outcome just recorded, and the hand-off to what’s next.",
    today: "2026-10-20",
    account: withSite(MAYA),
    records: [
      answerFollowUp(storyUsed(), "2026-10-20", {
        type: "positive",
        detail: "She asked me to lead the planning workstream.",
      }),
      pitchSent(),
      startEditing(brief(), "2026-10-19"),
    ],
    recommendations: accepted(["brief-manager", "scope-case"]),
    justAnswered: "story",
  },
};

export const HOME_STATE_IDS: readonly HomeStateId[] = [
  "first-return",
  "follow-up-due",
  "drafted-not-used",
  "nothing-pending",
  "just-answered",
];

/* -----------------------------------------------------------------------------
   WHICH STATE THE PAGE IS IN
   -------------------------------------------------------------------------- */

/**
 * The state a homepage is in, read from the Loop rather than remembered, so
 * the dock always shows the truth: answering a follow-up moves it to
 * `just-answered` on its own.
 *
 * `due` is whether a follow-up is due today, from `lib/loop.ts`.
 */
export function homeStateOf(snapshot: Pick<Snapshot, "records" | "justAnswered">, due: boolean): HomeStateId {
  if (snapshot.justAnswered) return "just-answered";
  if (due) return "follow-up-due";
  if (snapshot.records.some((r: LoopRecord) => r.state === "ready")) return "drafted-not-used";
  if (snapshot.records.every((r) => !r.usedOn)) return "first-return";
  return "nothing-pending";
}

/* -----------------------------------------------------------------------------
   HOMEPAGE WORDS
   -------------------------------------------------------------------------- */

/** What the homepage says around the shared components. Advisor voice: no
 *  "Welcome back!", no counts of what's waiting. */
export const HOME_COPY = {
  greeting: (name: string) => `Good morning, ${name}`,
  toward: (where: string) => `toward ${where}`,
  allDone: "Every action on your plan is in hand.",
  /** Over a ring's next action, whether it's the moment's or a ring picked. */
  nextIn: (horizon: string) => `Next in ${horizon.toLowerCase()}`,
  ringDone: (horizon: string) => `Every ${horizon.toLowerCase()} action is confirmed.`,
  /** The links under the rings card (Concept 1): each says what's there. */
  planEyebrow: "Your plan",
  resumeEyebrow: "Pick up where you left off",
  resumeDetail: (verb: "Drafted" | "Edited", date: string) => `${verb} ${date}`,
  /** Read out when a ring's action replaces the moment above the rings. */
  showing: (horizon: string) => `Showing your next ${horizon.toLowerCase()} action above.`,
  /** Back to what the page was asking for, when it's more than a next step:
   *  a next step looks the same as a picked ring's, so needs no way back. */
  backTo: {
    followUp: "Back to your follow-up",
    ready: "Back to what’s ready",
    answered: "Back to what you logged",
  },
  startNote: "Four actions on your plan. Each segment fills when you use the work it asks for.",
  confirms: (horizon: string) => `Confirms your ${horizon.toLowerCase()} action`,
  forAction: (horizon: string) => `For your ${horizon.toLowerCase()} action`,
  another: (name: string) => `Another is waiting: ${name}`,
  loggedDetail: (detail: string) => `Logged. You told me: “${detail}”`,
  loggedPlain: (readback: string) => `Logged. ${readback}`,
  askAgain: (name: string, when: string) => `No problem. I’ll ask about ${name} again ${when}.`,
  lastUsed: "Last used",
  checkBack: (days: number) => (days === 2 ? "in two days" : `in ${days} days`),
} as const;

/* -----------------------------------------------------------------------------
   TODAY'S BRIEFING — STUB
   The Briefing is designed in Sprint 4. Until then Concept 1 says what's in
   it with one lead read and, when it touches the plan, why it matters. The
   Briefing stays visibly apart from plan recommendations: it sits outside
   the rings card, and never in the tray.
   -------------------------------------------------------------------------- */

export const BRIEFING_STUB = {
  reads: 3,
  eyebrow: (reads: number) => `Today’s Briefing · ${reads} reads`,
  lead: "How planning season decides who gets new work",
  /** Only when a read touches an action on the plan. */
  why: "Relevant to your Q1 planning review.",
  /** The other two reads, headlines only (Concept 2's Briefing card). */
  others: [
    "What chief marketing officers look for when they widen a remit",
    "Why strong operators get passed over for scope, and what changes it",
  ],
  heading: "Today’s Briefing",
  meta: (date: string, reads: number) => `${date} · ${reads} reads`,
  /** The why, short enough for a tag (Concept 3). */
  tag: "For your Q1 planning review",
  open: "Read today’s Briefing",
  close: "Close today’s Briefing. It comes back tomorrow.",
} as const;

/* -----------------------------------------------------------------------------
   CONCEPT 2 — YOUR NEXT STEP, THEN STAY ON TRACK
   Decided 2026-09-29: under the Briefing is always the next step; under it,
   "Stay on track" holds everything waiting on her word. The heading is one
   string, so "The Loop" is a one-word swap if the client prefers it.
   -------------------------------------------------------------------------- */

export const STAY_COPY = {
  nextHeading: "Your next step",
  addsTo: "Adds to:",
  /** Over a next step brought by an outcome she just logged. */
  updated: "Updated from what you told us.",
  heading: "Stay on track",
  dueLine: "What came of it?",
  readyLine: "Ready. Have you used it yet?",
  askOn: (when: string) => `I’ll ask what came of it ${when}.`,
  usedNoAsk: "Used. No check-back set.",
  empty: "When you use something you’ve made, it shows here, so you can tell ExecHQ what came of it.",
  allLogged: "Nothing waiting on you. Everything you’ve used has its outcome logged.",
} as const;

/** Concept 3's own words around the shared pieces. */
export const CONCEPT3_COPY = {
  inStage: (stage: string) => `Part of ${stage}`,
  alsoIn: (stage: string) => `Also in ${stage}`,
} as const;

/* -----------------------------------------------------------------------------
   THE CHECK-IN — one component for everything the Loop asks (2026-09-29).
   Drawn three ways: Question first (Concept 1), Stepper (Concept 2),
   Conversation (Concept 3). The words are the same in all three.
   -------------------------------------------------------------------------- */

export const CHECKIN_COPY = {
  aboutFor: "For",
  readyQuestion: (title: string) => `${title} is ready. Have you used it?`,
  readySub: "Tell me once it’s been used, and I’ll ask what came of it.",
  used: (verb: string) => `Yes, I’ve ${verb} it`,
  notYet: "Not yet",
  notYetReadback: "No problem. I’ll check in again in a couple of days.",
  addNote: "Add a note",
  noteLabel: "Anything to add? Optional. Only you see it.",
  saveNote: "Save note",
  skipNote: "Skip",
  chatSend: "Send",
  chatDone: "That’s all",
  chatNoted: "Thanks. That’s saved with it.",
  steps: { drafted: "Drafted", used: "Used", came: "What came of it", accepted: "On your plan", done: "Done" },
  /* An action with no draft, done on her word. */
  taskQuestion: "Have you done this yet?",
  taskSub: "Say when it’s done, and what came of it.",
  taskDone: "Yes, it’s done",
  taskDrop: "I’m not doing it",
  taskDoneQuestion: (when: string) => `You finished this ${when}. What came of it?`,
  taskNothingYet: "No problem. I’ll ask again in a couple of days.",
  /** On a next step with no draft: the way to say it's done. */
  markDone: "I’ve done this",
  stepNotYet: "Not yet",
  stepWaiting: "Waiting to hear",
  stepLogged: "Logged",
} as const;
