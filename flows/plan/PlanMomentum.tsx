"use client";

import { MomentumLabeled, type MomentumVariant } from "@/components/plan/MomentumLabeled";
import { followThrough, momentumEvents } from "@/lib/momentum";
import { historyDays } from "@/lib/signal-picture";
import { isDone } from "@/lib/rings";
import type { LoopRecord } from "@/lib/loop";
import { conceptHref } from "@/lib/manifest";
import { ACTION_QUEUE } from "@/mock/plan";
import type { TaskCheck } from "@/mock/snapshots";

export interface PlanMomentumProps {
  records: LoopRecord[];
  tasks?: Record<string, TaskCheck>;
  today: string;
  startedOn: string;
  /** How it is drawn: each Signals concept shows its own. */
  variant?: MomentumVariant;
}

/**
 * Momentum on the Plan: the labeled trend, built up as her history grows. The
 * reviewer's state switcher sets how much history she has; there is no control
 * here. Concept B (counts only) stays in the catalogue and is not shown.
 */
export function PlanMomentum({ records, tasks, today, startedOn, variant }: PlanMomentumProps) {
  const events = momentumEvents(records, tasks);
  const history = historyDays(startedOn, today);
  const next = ACTION_QUEUE.find((s) => s.status === "accepted" && !isDone(s, records, tasks));
  const nextMove = next ? { title: next.title, why: next.whyNow || next.whyThis, href: conceptHref("toolbox-flow", "concept-1") } : undefined;

  return (
    <div className="plan-momentum">
      <MomentumLabeled
        events={events}
        today={today}
        history={history}
        follow={followThrough(records, tasks, events, today, 30)}
        nextMove={nextMove}
        variant={variant}
      />
    </div>
  );
}

export default PlanMomentum;
