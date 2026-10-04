/**
 * What happens to her roadmap choices when she moves: finishing a stage,
 * starting the one recommended next, switching plans. Pure, so the roadmap on
 * every Plan concept does the same thing.
 *
 * Nothing advances on its own. Finishing a stage recommends the next one, and
 * she starts it or says "Not yet". Switching plans keeps everything she made.
 */

import type { RoadmapChoices } from "@/components/plan/PlanRoadmap";
import type { LoopDate } from "@/lib/loop";

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
