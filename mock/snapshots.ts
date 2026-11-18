/**
 * The scenarios every signed-in page reads, picked from the dock, and the
 * types they share.
 *
 * By decision on 2026-09-28 the scenarios are the five homepage states in
 * `mock/homepage.ts` (first return, follow-up due, ready not used, nothing
 * pending, just answered). They replace the Day one / Week three / Month
 * three snapshots, and with them the earlier rule that no snapshot is ever
 * without something due: "nothing pending" now needs one.
 *
 * The store (`lib/loop-store.ts`) still calls each one a snapshot.
 */

import { HOME_STATES, HOME_STATE_IDS, type HomeStateId } from "@/mock/homepage";
import type { Account } from "@/mock/account";
import type { LoopRecord, OutcomeType } from "@/lib/loop";

export type SnapshotId = HomeStateId;

/** An action step recommendation, stubbed: ranking and replacement are
 *  Sprint 3. The first in a list is the one next step. */
export interface Recommendation {
  id: string;
  title: string;
  /** Why now, tied to what Maya said or did. */
  why: string;
}

/**
 * A Plan action with no draft, done on the user's word (decided 2026-09-29).
 * Doing it fills its ring segment and counts toward its stage, labelled as
 * her word; then the Loop asks what came of it, as it does for a draft.
 */
export interface TaskCheck {
  doneOn: string;
  outcome?: { type: OutcomeType; on: string; detail?: string };
  /** "I'm not doing it": it leaves the rings, like a declined action. */
  dropped?: boolean;
}

/**
 * What she decided about an action on the map (Homepage Concept 4): started
 * it, skipped it (with why, if she said), or finished it and asked for a new
 * one, which clears it from the ring. Nothing here changes a status in the
 * Plan stub; the map reads the two together (`lib/map.ts`).
 */
export interface ActionChoice {
  decision: "started" | "skipped" | "retired";
  on: string;
  reason?: string;
  note?: string;
}

export interface SnapshotState {
  account: Account;
  records: LoopRecord[];
  recommendations: Recommendation[];
  /** Actions with no draft, by action id, once she's said something. */
  tasks?: Record<string, TaskCheck>;
  /** Her decisions on the map's actions, by action id. */
  choices?: Record<string, ActionChoice>;
  /** The ids of the new actions she has asked for, in the order asked. */
  asked?: string[];
  /** The record whose outcome was just recorded, for the hand-off. Cleared
   *  by the next move. */
  justAnswered?: string;
}

export interface Snapshot extends SnapshotState {
  id: SnapshotId;
  label: string;
  /** One line for the dock's picker: where Maya is. */
  summary: string;
  /** The scenario's fixed date. Every Loop move made in it happens today. */
  today: string;
}

/* -----------------------------------------------------------------------------
   NEXT STEPS AFTER AN OUTCOME
   -------------------------------------------------------------------------- */

const REC = {
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
  pitch: REC.reviewSponsor,
};

export const FALLBACK_NEXT_STEP: Recommendation = {
  id: "plan-next",
  title: "Pick your next step from your plan",
  why: "What you just logged is on your plan now.",
};

export const SNAPSHOT_IDS: readonly SnapshotId[] = HOME_STATE_IDS;

/** Each scenario as it starts, before a reviewer changes anything. */
export const SNAPSHOTS: Record<SnapshotId, Snapshot> = HOME_STATES;

/** First return is reviewed first: nearly empty rings must read as a start. */
export const DEFAULT_SNAPSHOT: SnapshotId = "first-return";
