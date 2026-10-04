"use client";

import { useState } from "react";
import { ActionSteps } from "@/components/plan/ActionSteps";
import { PlanRoadmap } from "@/components/plan/PlanRoadmap";
import { PlanMomentum } from "../PlanMomentum";
import { PlanSignalPicture } from "@/components/plan/PlanSignalPicture";
import { SignalEntrySheet, type EntryValues } from "@/components/plan/SignalEntrySheet";
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
import { addPresence, removePresence, saveBaseline, updatePresence, useAddedPresence, useBaseline } from "@/lib/presence-store";
import { addedItems, historyDays, offerFor, recordedItems, type PictureItem } from "@/lib/signal-picture";
import { dismissSpark, useDismissedSparks } from "@/lib/spark-dismissal";
import { signalOfRecord } from "@/lib/signals";
import { sparksFor } from "@/lib/sparks";
import { SNAPSHOTS } from "@/mock/snapshots";
import { ENTRY_TYPES, ROADMAP_COPY as RM, SIGNAL_PICTURE_COPY as SPIC, entryTypeOfKind, roadmapFor } from "@/mock/plan";
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
  // The entry flow: adding something new (from the button, or from an offer), or editing one.
  const [entry, setEntry] = useState<
    { mode: "add"; initial?: Partial<EntryValues>; fromRecord?: string } | { mode: "edit"; item: PictureItem } | null
  >(null);
  const [offerDismissed, setOfferDismissed] = useState(false);
  // What she decided about the roadmap: kept per scenario, so it survives leaving the page.
  const choices = useRoadmapChoices(loop.id);
  // Next steps are written for Step up only; another plan starts with none.
  const switchedTo = choices?.history.length ? choices.planId : null;
  const start = SNAPSHOTS[loop.id];

  const items = withAdded(addedPresence);
  const seeded = loop.homeState !== "first-return";
  const picture = hasBaseline(baseline, seeded);
  const rows = signalRows(loop.today, items, baseline, seeded, (item) => [item.note ?? item.title, item.where, shortDate(item.on)].filter(Boolean).join(" · "));
  const notes = sparksFor(loop.today, loop.account, dismissed, items).filter((n) => n.id.startsWith("presence:"));
  const added = items.filter((item) => item.on <= loop.today).length;
  const pictureItems = [...recordedItems(loop.records, loop.tasks), ...addedItems(items, loop.today)];
  const offer = offerDismissed ? undefined : offerFor(loop.records, items, loop.today);
  const editing = entry?.mode === "edit" ? items.find((i) => i.id === entry.item.id) : undefined;

  function saveEntry(values: EntryValues) {
    const type = ENTRY_TYPES.find((t) => t.id === values.type) ?? ENTRY_TYPES[4];
    const isLink = values.text ? /^https?:\/\//i.test(values.text) : false;
    const fields = {
      kind: type.kind,
      title: type.label,
      where: "",
      happenedOn: values.on,
      link: isLink ? values.text : undefined,
      note: values.text && !isLink ? values.text : undefined,
    };
    if (entry?.mode === "edit") updatePresence(entry.item.id, fields);
    else {
      addPresence({
        ...fields,
        on: loop.today,
        area: entry?.fromRecord ? signalOfRecord(entry.fromRecord) : undefined,
        fromRecord: entry?.fromRecord,
      });
    }
    setEntry(null);
  }

  return (
    <div className="plan-stub">
      {stub ? <DestinationStub heading={stub.heading} body={stub.body} sprint={3} /> : null}
      <ActionSteps
        key={`steps-${loop.id}-${switchedTo}`}
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
      <PlanMomentum
        key={`momentum-${loop.id}`}
        records={loop.records}
        tasks={loop.tasks}
        today={loop.today}
        startedOn={loop.account.plan.startedOn}
      />
      <PlanRoadmap
        key={`roadmap-${loop.id}`}
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
      <PlanSignalPicture
        key={`picture-${loop.id}`}
        items={pictureItems}
        today={loop.today}
        history={historyDays(loop.account.plan.startedOn, loop.today)}
        onAdd={() => setEntry({ mode: "add" })}
        onEdit={(item) => setEntry({ mode: "edit", item })}
        onDelete={(item) => removePresence(item.id)}
        offer={offer}
        onAcceptOffer={() =>
          offer && setEntry({ mode: "add", initial: { type: "published", on: offer.usedOn }, fromRecord: offer.recordId })
        }
        onDismissOffer={() => setOfferDismissed(true)}
      />
      <section className="plan-stub__signals" aria-labelledby="plan-signals-heading">
        <h2 className="u-visually-hidden" id="plan-signals-heading">
          {SPIC.startedHeading}
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
            name={SPIC.startedHeading}
            mark={PR.mark}
            asOf={PR.asOf(shortDate(loop.account.plan.startedOn))}
            thenLabel={AC.then}
            nowLabel={AC.now}
            rows={rows}
            summary={PR.summary(added)}
            onAdd={() => setEntry({ mode: "add" })}
            addLabel={ADD.open}
            tryThis={{ ...PR.tryThis, href: conceptHref("toolbox-flow", "concept-1") }}
            tryLabel={AC.tryThis}
            headingId="plan-signals-card"
          />
        ) : (
          <SignalPicture
            name={SPIC.startedHeading}
            planHref={conceptHref("plan", "concept-1")}
            planLabel={SPC.planLabel}
            empty={<BaselineForm onSave={saveBaseline} />}
            headingId="plan-signals-card"
          />
        )}
      </section>
      <SignalEntrySheet
        key={entry ? (entry.mode === "edit" ? entry.item.id : `add-${entry.fromRecord ?? ""}`) : "closed"}
        open={entry !== null}
        onClose={() => setEntry(null)}
        onSave={saveEntry}
        today={loop.today}
        editing={entry?.mode === "edit"}
        initial={
          entry?.mode === "edit" && editing
            ? { type: entryTypeOfKind(editing.kind).id, on: editing.happenedOn ?? editing.on, text: editing.link ?? editing.note }
            : entry?.mode === "add"
              ? entry.initial
              : undefined
        }
      />
    </div>
  );
}

export default PlanConcept1;
