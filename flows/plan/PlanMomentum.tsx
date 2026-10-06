"use client";

import { ToggleGroup } from "@/components/form/ToggleGroup";
import { MomentumLabeled } from "@/components/plan/MomentumLabeled";
import { followThrough, momentumEvents } from "@/lib/momentum";
import { setMomentumChoice, useMomentumChoice } from "@/lib/momentum-choice";
import { historyDays } from "@/lib/signal-picture";
import { isDone } from "@/lib/rings";
import type { LoopRecord } from "@/lib/loop";
import { conceptHref } from "@/lib/manifest";
import { ACTION_QUEUE, MOMENTUM_COPY as C } from "@/mock/plan";
import type { TaskCheck } from "@/mock/snapshots";

export interface PlanMomentumProps {
  records: LoopRecord[];
  tasks?: Record<string, TaskCheck>;
  today: string;
  startedOn: string;
}

/**
 * Momentum on the Plan: the labeled trend, built up as her history grows. The
 * control above only lets a reviewer see the later stages; it is prototype
 * scaffolding, not product, and says so. Concept B (counts only) stays in the
 * catalogue and is no longer shown here.
 */
export function PlanMomentum({ records, tasks, today, startedOn }: PlanMomentumProps) {
  const choice = useMomentumChoice();
  const events = momentumEvents(records, tasks);
  const history = choice.history === "ninety" ? 95 : choice.history === "thirty" ? 35 : historyDays(startedOn, today);
  const next = ACTION_QUEUE.find((s) => s.status === "accepted" && !isDone(s, records, tasks));
  const nextMove = next ? { title: next.title, href: conceptHref("toolbox-flow", "concept-1") } : undefined;

  return (
    <div className="plan-momentum">
      <div className="momentum-scaffold">
        <p className="momentum-scaffold__title">{C.scaffold.heading}</p>
        <ToggleGroup
          label={C.scaffold.history}
          shape="pill"
          size="sm"
          options={[
            { value: "actual", label: C.scaffold.historyActual },
            { value: "thirty", label: C.scaffold.historyThirty },
            { value: "ninety", label: C.scaffold.historyNinety },
          ]}
          value={choice.history}
          onChange={(v) => setMomentumChoice({ history: v === "ninety" ? "ninety" : v === "thirty" ? "thirty" : "actual" })}
        />
        {history >= 90 ? (
          <ToggleGroup
            label={C.scaffold.wording}
            shape="pill"
            size="sm"
            options={[
              { value: "candid", label: C.scaffold.candid },
              { value: "soft", label: C.scaffold.soft },
            ]}
            value={choice.wording}
            onChange={(v) => setMomentumChoice({ wording: v === "soft" ? "soft" : "candid" })}
          />
        ) : null}
        <p>{C.scaffold.note}</p>
      </div>
      <MomentumLabeled
        events={events}
        today={today}
        history={history}
        follow={followThrough(records, tasks, events, today, 30)}
        nextMove={nextMove}
        wording={choice.wording}
      />
    </div>
  );
}

export default PlanMomentum;
