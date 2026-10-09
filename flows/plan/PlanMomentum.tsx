"use client";

import { MomentumLabeled } from "@/components/plan/MomentumLabeled";
import { momentumEvents, type AddedSignal } from "@/lib/momentum";
import { historyDays } from "@/lib/signal-picture";
import { isDone } from "@/lib/rings";
import type { LoopRecord } from "@/lib/loop";
import { conceptHref } from "@/lib/manifest";
import { ACTION_QUEUE } from "@/mock/plan";
import type { TaskCheck } from "@/mock/snapshots";

export interface PlanMomentumProps {
  records: LoopRecord[];
  tasks?: Record<string, TaskCheck>;
  /** What she added to her Signal Picture herself, which counts too. */
  signals?: AddedSignal[];
  today: string;
  startedOn: string;
}

/**
 * Momentum on the Signal Picture, read from her Loop, her plan and what she added: this week, and her
 * next move, the next step she took on that is not done.
 */
export function PlanMomentum({ records, tasks, signals, today, startedOn }: PlanMomentumProps) {
  const events = momentumEvents(records, tasks, signals);
  const history = historyDays(startedOn, today);
  const next = ACTION_QUEUE.find((s) => s.status === "accepted" && !isDone(s, records, tasks));
  const nextMove = next ? { title: next.title, why: next.whyNow || next.whyThis, href: conceptHref("toolbox-flow", "concept-1") } : undefined;

  return (
    <div className="plan-momentum">
      <MomentumLabeled
        events={events}
        today={today}
        history={history}
        nextMove={nextMove}
      />
    </div>
  );
}

export default PlanMomentum;
