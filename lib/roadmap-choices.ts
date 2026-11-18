/**
 * What happens to her roadmap choices when she moves: finishing a stage,
 * starting the one recommended next, switching plans. Pure, so the roadmap on
 * every Plan concept does the same thing.
 *
 * Nothing advances on its own. Finishing a stage recommends the next one, and
 * she starts it or says "Not yet". Switching plans keeps everything she made.
 */

import type { LoopDate } from "@/lib/loop";

/** A plan she left, and where she was in it. */
export interface PlanChange {
  planId: string;
  startedOn: LoopDate;
  endedOn: LoopDate;
  /** The stage she was in when she left, from 0. */
  atStage: number;
}

/** What she has decided about the roadmap. */
export interface RoadmapChoices {
  planId: string;
  startedOn: LoopDate;
  /** The stage she confirmed, from 0. Unset: the stage she started in. */
  confirmed?: number;
  /** She said "Not yet" while her work pointed at this stage. */
  snoozedAt: number | null;
  history: PlanChange[];
  /** The day she finished each stage she has finished, so the windows after it move. */
  finishedOn?: Record<number, LoopDate>;
  /** The stage recommended next, waiting for her to start it. */
  recommended?: number | null;
  /** She said "Not yet" to the recommendation. The stage stays marked as next. */
  nextDismissed?: boolean;
  /** Each time she changed her direction from the Plan, and whether her plan moved with it. */
  directionEdits?: { on: LoopDate; switched: boolean }[];
}

/** She finished the stage she is in. The next one is recommended, not started. */
export function finishStage(
  choices: RoadmapChoices,
  current: number,
  stageCount: number,
  today: LoopDate
): RoadmapChoices {
  return {
    ...choices,
    confirmed: current,
    finishedOn: { ...choices.finishedOn, [current]: today },
    recommended: current + 1 < stageCount ? current + 1 : null,
    nextDismissed: false,
    snoozedAt: null,
  };
}

/** She started the stage recommended next. */
export function startNext(choices: RoadmapChoices): RoadmapChoices {
  if (choices.recommended == null) return choices;
  return { ...choices, confirmed: choices.recommended, recommended: null, nextDismissed: false, snoozedAt: null };
}

/** She said "Not yet". The stage stays marked as next, and nothing nags. */
export function dismissNext(choices: RoadmapChoices): RoadmapChoices {
  return { ...choices, nextDismissed: true };
}

/** She moved to another plan. The old one stays in her history, and the new one starts fresh. */
export function switchPlan(choices: RoadmapChoices, planId: string, today: LoopDate, atStage: number): RoadmapChoices {
  return {
    ...choices,
    history: [...choices.history, { planId: choices.planId, startedOn: choices.startedOn, endedOn: today, atStage }],
    planId,
    startedOn: today,
    confirmed: 0,
    snoozedAt: null,
    finishedOn: {},
    recommended: null,
    nextDismissed: false,
  };
}
