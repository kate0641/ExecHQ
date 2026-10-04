"use client";

import { Switch } from "@/components/form/Switch";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { MomentumCounts } from "@/components/plan/MomentumCounts";
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
 * Momentum on the Plan: Concept A or Concept B, one at a time, so reviewers
 * choose between them rather than refine one. The control above is prototype
 * scaffolding, not product, and says so.
 */
export function PlanMomentum({ records, tasks, today, startedOn }: PlanMomentumProps) {
  const choice = useMomentumChoice();
  const events = momentumEvents(records, tasks);
  const history = choice.longHistory ? 95 : historyDays(startedOn, today);
  const next = ACTION_QUEUE.find((s) => s.status === "accepted" && !isDone(s, records, tasks));
  const nextMove = next ? { title: next.title, href: conceptHref("toolbox-flow", "concept-1") } : undefined;

  return (
    <div className="plan-momentum">
      <div className="momentum-scaffold">
        <p className="momentum-scaffold__title">{C.scaffold.heading}</p>
        <ToggleGroup
          label={C.scaffold.concept}
          shape="pill"
          size="sm"
          options={[
            { value: "a", label: C.scaffold.a },
            { value: "b", label: C.scaffold.b },
          ]}
          value={choice.concept}
          onChange={(v) => setMomentumChoice({ concept: v === "b" ? "b" : "a" })}
        />
        {choice.concept === "a" ? (
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
        <div className="steps__hold">
          <Switch
            checked={choice.longHistory}
            onChange={(on) => setMomentumChoice({ longHistory: on })}
            aria-labelledby="momentum-history-label"
          />
          <p id="momentum-history-label">{C.scaffold.history}</p>
        </div>
        <p>{C.scaffold.note}</p>
      </div>
      {choice.concept === "a" ? (
        <MomentumLabeled
          events={events}
          today={today}
          history={history}
          follow={followThrough(records, tasks, events, today, 30)}
          nextMove={nextMove}
          wording={choice.wording}
        />
      ) : (
        <MomentumCounts events={events} today={today} history={history} />
      )}
    </div>
  );
}

export default PlanMomentum;
