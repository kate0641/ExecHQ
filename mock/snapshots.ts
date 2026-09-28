/**
 * Three points in Maya's first months, picked from the dock so reviewers can
 * judge every Sprint 2 page at each of them.
 *
 * By decision on 2026-09-28 there is no snapshot where nothing is going on:
 * each one opens with something worth doing. A reviewer can still reach
 * "nothing pending" by answering what's due, because the Loop remembers
 * changes, so every homepage concept has to handle that state too.
 *
 * Every record is built by running the Loop's own moves (`lib/loop.ts`) from
 * creation, so each one is a state the Loop can actually reach, with a
 * history that matches. Dates follow Maya's journey in the PRD, starting on
 * Monday 5 October 2026.
 *
 * Artifacts other than her story are titles and statuses only: the Toolbox
 * that makes them is Sprint 4, so none of them opens.
 */

import { MAYA, withConnection, type Account } from "@/mock/account";
import {
  abandonRecord,
  answerFollowUp,
  closeRecord,
  createRecord,
  markReady,
  markUsed,
  startEditing,
  type LoopRecord,
} from "@/lib/loop";

export type SnapshotId = "day-one" | "week-three" | "month-three";

/** An Active Landscape recommendation, stubbed: ranking and replacement are
 *  Sprint 3. The first in a list is the one next step. */
export interface Recommendation {
  id: string;
  title: string;
  /** Why now, tied to what Maya said or did. */
  why: string;
}

export interface SnapshotState {
  account: Account;
  records: LoopRecord[];
  recommendations: Recommendation[];
}

export interface Snapshot extends SnapshotState {
  id: SnapshotId;
  label: string;
  /** One line for the dock's picker: where Maya is. */
  summary: string;
  /** The snapshot's fixed date. Every Loop move made in it happens today. */
  today: string;
}

/* -----------------------------------------------------------------------------
   RECOMMENDATIONS
   -------------------------------------------------------------------------- */

const REC = {
  sharpen: {
    id: "sharpen-story",
    title: "Use your story in your next 1:1",
    why: "Every conversation about a bigger role starts with “what do you lead?”",
  },
  checkInBrief: {
    id: "check-in-brief",
    title: "Prepare a brief for your manager check-in",
    why: "You have a check-in coming up, and it’s the first place your story counts.",
  },
  accomplishments: {
    id: "accomplishments",
    title: "Add three recent accomplishments",
    why: "Five minutes, and every draft after this one gets sharper.",
  },
  bio: {
    id: "bio",
    title: "Write your bio",
    why: "It’s what goes ahead of you: to a recruiter, an event, a new boss.",
  },
  stakeholderMap: {
    id: "stakeholder-map",
    title: "Build a stakeholder message map for the workstream",
    why: "You said the assignment needs cross-functional influence.",
  },
  pointOfView: {
    id: "point-of-view",
    title: "Prepare one point of view for the stakeholders you now work with",
    why: "You’re speaking to more senior people across more teams than in October.",
  },
  forumRehearsal: {
    id: "forum-rehearsal",
    title: "Rehearse your leadership forum point of view",
    why: "The forum is in January, and it’s ready to use.",
  },
  reviewSponsor: {
    id: "review-sponsor",
    title: "Plan your first conversation with the review’s sponsor",
    why: "The sponsor decides who runs the review, so the first conversation matters.",
  },
} satisfies Record<string, Recommendation>;

/**
 * The next step offered once an outcome is logged, by record. Stubbed: in the
 * product the Plan chooses it from the outcome (Sprint 3). Here it is fixed
 * per artifact, so the hand-off can be designed and seen working.
 */
export const NEXT_STEP_AFTER: Record<string, Recommendation> = {
  story: REC.bio,
  "check-in-brief": REC.stakeholderMap,
  "stakeholder-map": REC.pointOfView,
  pitch: REC.reviewSponsor,
};

export const FALLBACK_NEXT_STEP: Recommendation = {
  id: "plan-next",
  title: "Pick your next step from your plan",
  why: "What you just logged is on your plan now.",
};

/* -----------------------------------------------------------------------------
   RECORDS
   -------------------------------------------------------------------------- */

/** Her story, from onboarding's Positioning Builder: the Sprint 1 artifact. */
function story(): LoopRecord {
  return createRecord({
    id: "story",
    kind: "positioning",
    title: "Your story",
    name: "your leadership story",
    on: "2026-10-05",
    recommendation: "Write the story of what you lead",
  });
}

function checkInBrief(): LoopRecord {
  return createRecord({
    id: "check-in-brief",
    kind: "situation-brief",
    title: "Brief for your manager check-in",
    name: "your check-in brief",
    on: "2026-10-16",
    recommendation: REC.checkInBrief.title,
  });
}

/** Story used in her 1:1 on Tuesday 13 October. Check-back on the 20th. */
function storyUsed(): LoopRecord {
  let r = startEditing(story(), "2026-10-06");
  r = markReady(r, "2026-10-07", { intendedUse: "To open my next 1:1 with my manager" });
  return markUsed(r, "2026-10-13", { channel: "1:1 with my manager" });
}

/* -----------------------------------------------------------------------------
   THE SNAPSHOTS
   -------------------------------------------------------------------------- */

function dayOne(): Snapshot {
  return {
    id: "day-one",
    label: "Day one",
    summary: "Just out of onboarding, with a first draft of her story.",
    today: "2026-10-05",
    account: MAYA,
    records: [story()],
    recommendations: [REC.sharpen, REC.checkInBrief, REC.accomplishments],
  };
}

function weekThree(): Snapshot {
  return {
    id: "week-three",
    label: "Week three",
    summary: "She used her story a week ago. Today the Loop asks what came of it.",
    today: "2026-10-20",
    account: withConnection(MAYA, "website", "2026-10-09", "mayachen.com"),
    records: [storyUsed(), startEditing(checkInBrief(), "2026-10-19")],
    recommendations: [REC.checkInBrief, REC.bio, REC.accomplishments],
  };
}

function monthThree(): Snapshot {
  const storyDone = closeRecord(
    answerFollowUp(storyUsed(), "2026-10-20", {
      type: "neutral",
      detail: "Good conversation. She wants to see it in writing before the planning cycle.",
    }),
    "2026-10-20"
  );

  let brief = startEditing(checkInBrief(), "2026-10-19");
  brief = markUsed(brief, "2026-10-22", { channel: "Check-in with my manager" });
  brief = closeRecord(
    answerFollowUp(brief, "2026-10-24", {
      type: "positive",
      detail: "My manager asked me to lead the cross-functional planning workstream.",
      notes: "I need to show executive-level stakeholder management.",
    }),
    "2026-10-24"
  );

  const bio = markReady(
    createRecord({
      id: "bio",
      kind: "positioning",
      title: "Your bio",
      name: "your bio",
      on: "2026-10-21",
      recommendation: REC.bio.title,
    }),
    "2026-10-23",
    { intendedUse: "My LinkedIn About section" }
  );

  // Used at the workstream kickoff; she has said "Nothing yet" twice, and the
  // Loop asks again today.
  let map = createRecord({
    id: "stakeholder-map",
    kind: "situation-brief",
    title: "Stakeholder message map",
    name: "your stakeholder message map",
    on: "2026-10-26",
    recommendation: REC.stakeholderMap.title,
  });
  map = markUsed(map, "2026-12-02", { channel: "Planning workstream kickoff" });
  map = answerFollowUp(map, "2026-12-04", { type: "no-response-yet" });
  map = answerFollowUp(map, "2026-12-08", { type: "no-response-yet" });

  // Sent last Wednesday; due yesterday. Longer waiting, so it is asked first.
  let pitch = createRecord({
    id: "pitch",
    kind: "pitch",
    title: "Pitch to lead the Q1 planning review",
    name: "your pitch to lead the Q1 planning review",
    on: "2026-12-03",
    recommendation: "Put yourself forward for the Q1 planning review",
  });
  pitch = markUsed(startEditing(pitch, "2026-12-07"), "2026-12-09", {
    channel: "Email to the review’s sponsor",
  });

  // From a Briefing item in week two: saved as a draft, then left. Never
  // chased: the brief rules out penalising an unused artifact.
  const post = startEditing(
    createRecord({
      id: "post",
      kind: "thought-leadership",
      title: "Post on planning across functions",
      name: "your post on planning across functions",
      on: "2026-10-14",
    }),
    "2026-11-02"
  );

  const forum = markReady(
    createRecord({
      id: "forum",
      kind: "positioning",
      title: "Point of view for the leadership forum",
      name: "your leadership forum point of view",
      on: "2026-12-10",
      recommendation: "Prepare a point of view for the internal leadership forum",
    }),
    "2026-12-11",
    { intendedUse: "The leadership forum in January" }
  );

  // Set aside when the planning cycle made it the wrong moment.
  const initiative = abandonRecord(
    createRecord({
      id: "initiative",
      kind: "pitch",
      title: "Case for a cross-functional initiative",
      name: "your case for a cross-functional initiative",
      on: "2026-10-07",
    }),
    "2026-10-08"
  );

  return {
    id: "month-three",
    label: "Month three",
    summary: "Eight artifacts at different stages. Two follow-ups due, asked one at a time.",
    today: "2026-12-15",
    account: withConnection(
      withConnection(MAYA, "website", "2026-10-09", "mayachen.com"),
      "linkedin",
      "2026-11-16",
      "LinkedIn analytics export, November 2026"
    ),
    records: [pitch, map, forum, bio, post, brief, storyDone, initiative],
    recommendations: [REC.forumRehearsal, REC.pointOfView, REC.accomplishments],
  };
}

export const SNAPSHOT_IDS: readonly SnapshotId[] = ["day-one", "week-three", "month-three"];

/** Each snapshot as it starts, before a reviewer changes anything. */
export const SNAPSHOTS: Record<SnapshotId, Snapshot> = {
  "day-one": dayOne(),
  "week-three": weekThree(),
  "month-three": monthThree(),
};

export const DEFAULT_SNAPSHOT: SnapshotId = "day-one";
