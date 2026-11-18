/**
 * What a stage check-in changes on her plan (Plan Concept 3). Pure: it takes her steps as they stand and
 * what she said, and returns her steps as they should be, with a line for each step it brought in that
 * says why it is there. Her answers are kept as she gave them in `lib/stage-checkins.ts`; this only acts on them.
 *
 * The rules, as Kate set them on 2026-10-08:
 *
 * - Partly got what finishing looks like: the step aimed at the gap is offered first.
 * - Not yet: the same step first, and the stage stays open until it is done (the page reads that from her
 *   answer, so changing it later changes it back).
 * - Something did not go the way she hoped: a different way at the same thing is offered. Never the same step.
 * - A step she passed on that ExecHQ rates important is offered once more. Passed on twice, never again.
 * - Stuck or less sure: nothing here; the page shows one step at a time while the next stage runs.
 *
 * It never goes past the live limits: a step it brings in takes the place of one she has not taken on yet,
 * and when every place is taken by something she has, it is not brought in.
 */

import { passedOut, type PlanState } from "@/lib/action-steps";
import type { MilestoneAnswer } from "@/lib/stage-checkins";
import { GAP_STEP, IMPORTANT_STEPS, LIVE_LIMITS, OTHER_WAY_STEP, STAGE_CHECKIN_COPY as C, stepById } from "@/mock/plan";

export interface CheckInInput {
  /** The stage she checked in on, from 0. */
  stage: number;
  milestone?: MilestoneAnswer;
  /** Steps from the stage she said did not go the way she hoped. */
  notHoped: string[];
  /** Whether a step is done, so it no longer takes a place on her plan. */
  isDone: (id: string) => boolean;
}

export interface CheckInEffect {
  state: PlanState;
  /** Why each step it brought in is there, by step id. */
  heard: Record<string, string>;
}

/** Whether it could be offered at all: known, not on her plan, not done, not passed on twice. */
function offerable(state: PlanState, id: string, isDone: (id: string) => boolean): boolean {
  const step = stepById(id);
  if (!step || state.shown.includes(id) || isDone(id) || passedOut(state, id)) return false;
  return state.decisions[id]?.decision !== "completed";
}

/** Brings a step onto her plan, first or last, making room in its horizon if it can. */
function bringIn(state: PlanState, id: string, first: boolean, isDone: (id: string) => boolean, keep: string[]): PlanState | null {
  const step = stepById(id)!;
  const inHorizon = state.shown.filter((s) => stepById(s)?.horizon === step.horizon && !isDone(s));
  let shown = state.shown;
  if (inHorizon.length >= LIVE_LIMITS[step.horizon]) {
    // Room comes from the last one she has not taken on, never from one she has, or one this check-in brought in.
    const free = [...inHorizon].reverse().find((s) => state.decisions[s]?.decision !== "accepted" && !keep.includes(s));
    if (!free) return null;
    shown = shown.filter((s) => s !== free);
  }
  // Offered again: what she decided before is set aside, and how often she passed on it is kept.
  const decisions = { ...state.decisions };
  delete decisions[id];
  return { ...state, shown: first ? [id, ...shown] : [...shown, id], decisions };
}

export function applyCheckIn(state: PlanState, input: CheckInInput): CheckInEffect {
  const { stage, milestone, notHoped, isDone } = input;
  let next = state;
  const heard: Record<string, string> = {};
  const brought: string[] = [];
  const add = (id: string | undefined, first: boolean, line: string) => {
    if (!id || brought.includes(id) || !offerable(next, id, isDone)) return;
    const placed = bringIn(next, id, first, isDone, brought);
    if (!placed) return;
    next = placed;
    brought.push(id);
    heard[id] = line;
  };

  // What finishing looks like, not reached: the step aimed at it, first.
  if (milestone === "partly" || milestone === "not-yet") {
    add(GAP_STEP[stage], true, milestone === "partly" ? C.heardGapPartly : C.heardGapNotYet);
  }
  // Didn't go the way she hoped: a different way at it.
  for (const id of notHoped) {
    const from = stepById(id);
    if (from) add(OTHER_WAY_STEP[id], false, C.heardOtherWay(from.title));
  }
  // Passed on once, and important: offered once more. Anything she passed on up to this stage counts.
  for (const id of IMPORTANT_STEPS) {
    const step = stepById(id);
    const passed = state.decisions[id]?.decision === "declined" || (state.passes?.[id] ?? 0) > 0;
    if (step && step.stage <= stage && passed && (state.passes?.[id] ?? 0) < 2 && !state.decisions[id]?.resurfaced) {
      add(id, false, C.heardAgain);
      // A pass from before passes were counted still counts as one, so the next pass is the second.
      if (brought.includes(id)) next = { ...next, passes: { ...next.passes, [id]: Math.max(1, next.passes?.[id] ?? 0) } };
    }
  }
  return { state: next, heard };
}
