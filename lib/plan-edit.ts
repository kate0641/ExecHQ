/**
 * What saving the edit flow does to her plan. Her direction is hers to change, and the
 * flow ends on a plan she chose: the same one, or another. Another plan is the same move
 * as Change plan on the roadmap (`switchPlan`): the plan she leaves stays in her history and
 * the new one starts today, with what she made kept.
 */

import type { RoadmapChoices } from "@/lib/roadmap-choices";
import { switchPlan } from "@/lib/roadmap-choices";
import { currentStageIndex } from "@/lib/rings";
import type { LoopView } from "@/lib/loop-store";
import { ACTIONS } from "@/mock/plan-stub";
import { roadmapFor } from "@/mock/plan";
import { SNAPSHOTS } from "@/mock/snapshots";

export function roadmapAfterEdit(
  loop: Pick<LoopView, "id" | "records" | "tasks" | "today" | "account">,
  choices: RoadmapChoices | undefined,
  planId: string,
  /** She changed the words of her direction, not only her plan. */
  directionChanged: boolean
): RoadmapChoices | null {
  const kept: RoadmapChoices = choices ?? {
    planId: loop.account.plan.id,
    startedOn: loop.account.plan.startedOn,
    snoozedAt: null,
    history: [],
  };
  const switched = kept.planId !== planId;
  if (!switched && !directionChanged) return null;
  const edits = [...(kept.directionEdits ?? []), { on: loop.today, switched }];
  if (!switched) return { ...kept, directionEdits: edits };
  const stages = roadmapFor(kept.planId);
  const start = SNAPSHOTS[loop.id];
  const evidence = currentStageIndex(loop.records, stages.length, ACTIONS, loop.tasks);
  const began = currentStageIndex(start.records, stages.length, ACTIONS, start.tasks);
  const at = Math.min(kept.confirmed ?? began ?? evidence, stages.length - 1);
  return { ...switchPlan(kept, planId, loop.today, at), directionEdits: edits };
}
