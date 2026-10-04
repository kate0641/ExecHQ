"use client";

import { useState } from "react";
import { ActionSteps } from "@/components/plan/ActionSteps";
import { PlanRoadmap } from "@/components/plan/PlanRoadmap";
import { AddPresenceSheet } from "@/components/homepage/AddPresenceSheet";
import { BaselineForm } from "@/components/homepage/BaselineForm";
import { SignalPicture } from "@/components/homepage/SignalPicture";
import { PresenceCard } from "@/components/homepage/PresenceCard";
import { Spark } from "@/components/homepage/Spark";
import { DestinationStub } from "@/components/layout/DestinationStub";
import { shortDate } from "@/lib/loop";
import { saveRoadmap, useRoadmapChoices } from "@/lib/plan-store";
import { initialPlanState } from "@/lib/action-steps";
import { currentStageIndex, isDone as isActionDone } from "@/lib/rings";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref, getFlow } from "@/lib/manifest";
import { hasBaseline, signalRows, withAdded } from "@/lib/presence";
import { addPresence, saveBaseline, useAddedPresence, useBaseline } from "@/lib/presence-store";
import { dismissSpark, useDismissedSparks } from "@/lib/spark-dismissal";
import { sparksFor } from "@/lib/sparks";
import { SNAPSHOTS } from "@/mock/snapshots";
import { ROADMAP_COPY as RM, roadmapFor } from "@/mock/plan";
import { ACTIONS } from "@/mock/plan-stub";
import { recommendPlan } from "@/mock/onboarding";
import { ADD_COPY as ADD, PRESENCE_STUB as PR, SPARK_COPY as SP, ACCOUNTS_COPY as AC } from "@/mock/accounts-stub";
import { SIGNAL_PICTURE_COPY as SPC } from "@/mock/homepage";

/**
 * The Plan, for now (Sprint 3 designs it): its placeholder heading, and under
 * it the detail behind Your Signal Picture on the homepage. Kate decided on
 * 2026-10-02 that the detail lives here as a component, and that it can become
 * its own page later if the Plan design calls for one.
 *
 * It is the same card the earlier homepage concepts used for Your presence:
 * every signal she enters, where she started beside now, what she added last,
 * a way to add more, and the one thing to try. Nothing on it is found for
 * her.
 */
export function PlanConcept1() {
  const loop = useLoop();
  const stub = getFlow("plan")?.stub;
  const addedPresence = useAddedPresence();
  const baseline = useBaseline();
  const dismissed = useDismissedSparks();
  const [adding, setAdding] = useState(false);
  // What she decided about the roadmap: kept per scenario, so it survives leaving the page.
  const choices = useRoadmapChoices(loop.id);
  // Next steps are written for Step up only; another plan starts with none.
  const switchedTo = choices?.history.length ? choices.planId : null;
  const start = SNAPSHOTS[loop.id];

  const items = withAdded(addedPresence);
  const seeded = loop.homeState !== "first-return";
  const picture = hasBaseline(baseline, seeded);
  const rows = signalRows(loop.today, items, baseline, seeded, (item) => `${item.title} · ${item.where} · ${shortDate(item.on)}`);
  const notes = sparksFor(loop.today, loop.account, dismissed, items).filter((n) => n.id.startsWith("presence:"));
  const added = items.filter((item) => item.on <= loop.today).length;

  return (
    <div className="plan-stub">
      {stub ? <DestinationStub heading={stub.heading} body={stub.body} sprint={3} /> : null}
      <ActionSteps
        key={`${loop.id}-${switchedTo}`}
        today={loop.today}
        initial={switchedTo ? { ...initialPlanState(loop.today), shown: [], decisions: {} } : undefined}
        startHref={conceptHref("toolbox-flow", "concept-1")}
        isDone={(step) => isActionDone(step, loop.records, loop.tasks)}
        answered={
          loop.justAnswered
            ? { recordId: loop.justAnswered, reported: loop.records.find((r) => r.id === loop.justAnswered)?.outcome?.detail }
            : undefined
        }
        onComplete={(step) => loopActions.completeTask(step.id)}
      />
      <PlanRoadmap
        key={`${loop.id}`}
        planId={loop.account.plan.id}
        startedOn={loop.account.plan.startedOn}
        today={loop.today}
        rationale={recommendPlan(loop.account.direction).rationale ?? ""}
        evidenceStage={currentStageIndex(loop.records, roadmapFor(loop.account.plan.id).length, ACTIONS, loop.tasks)}
        startStage={currentStageIndex(start.records, roadmapFor(loop.account.plan.id).length, ACTIONS, start.tasks)}
        choices={choices}
        onChoices={(next) => saveRoadmap(loop.id, next)}
        compact
      />
      {switchedTo ? <p className="plan-stub__note">{RM.stepsStub}</p> : null}
      <section className="plan-stub__signals" aria-labelledby="plan-signals-heading">
        <h2 className="u-visually-hidden" id="plan-signals-heading">
          Your signals
        </h2>
        <Spark
          items={notes}
          label={SP.label}
          dismissLabel={SP.dismiss}
          dismissName={SP.dismissNote}
          onDismiss={(id) => dismissSpark(id)}
        />
        {picture ? (
          <PresenceCard
            name={SPC.heading}
            mark={PR.mark}
            asOf={PR.asOf(shortDate(loop.account.plan.startedOn))}
            thenLabel={AC.then}
            nowLabel={AC.now}
            rows={rows}
            summary={PR.summary(added)}
            onAdd={() => setAdding(true)}
            addLabel={ADD.open}
            tryThis={{ ...PR.tryThis, href: conceptHref("toolbox-flow", "concept-1") }}
            tryLabel={AC.tryThis}
            headingId="plan-signals-card"
          />
        ) : (
          <SignalPicture
            name={SPC.heading}
            planHref={conceptHref("plan", "concept-1")}
            planLabel={SPC.planLabel}
            empty={<BaselineForm onSave={saveBaseline} />}
            headingId="plan-signals-card"
          />
        )}
      </section>
      <AddPresenceSheet
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={(entry) => {
          addPresence({ ...entry, on: loop.today });
          setAdding(false);
        }}
      />
    </div>
  );
}

export default PlanConcept1;
