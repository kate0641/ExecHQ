"use client";

import { useState, type ReactNode } from "react";
import { AccountCard } from "@/components/homepage/AccountCard";
import { BaselineForm } from "@/components/homepage/BaselineForm";
import { TrendLine } from "@/components/homepage/TrendLine";
import { UpdateNowSheet } from "@/components/homepage/UpdateNowSheet";
import { PresenceCard } from "@/components/homepage/PresenceCard";
import { SignalPicture } from "@/components/homepage/SignalPicture";
import { Spark } from "@/components/homepage/Spark";
import { DirectionCard } from "@/components/plan/DirectionCard";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { ActionSteps } from "@/components/plan/ActionSteps";
import { PlanNarrative } from "@/components/plan/PlanNarrative";
import { PlanRoadmap } from "@/components/plan/PlanRoadmap";
import { RoadmapAgenda } from "@/components/plan/RoadmapAgenda";
import { CalendarItemSheet, type ItemValues } from "@/components/plan/CalendarItemSheet";
import { PlanCalendar } from "@/components/plan/PlanCalendar";
import { PlanSignalPicture } from "@/components/plan/PlanSignalPicture";
import { SignalEntrySheet, type EntryValues } from "@/components/plan/SignalEntrySheet";
import { initialPlanState, liveSteps, stepDay, type PlanState } from "@/lib/action-steps";
import { addDays, shortDate } from "@/lib/loop";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { momentumEvents } from "@/lib/momentum";
import { buildNarrative } from "@/lib/narrative";
import { roadmapWindows } from "@/lib/roadmap-dates";
import { saveCalendar, saveRoadmap, saveSteps, useCalendar, useRoadmapChoices, useSavedSteps } from "@/lib/plan-store";
import { hasBaseline, presenceCounts, signalRows, withAdded, type Baseline } from "@/lib/presence";
import { addPresence, removePresence, saveBaseline, saveCurrent, updatePresence, useAddedPresence, useBaseline, useCurrent } from "@/lib/presence-store";
import { currentStageIndex, isDone as isActionDone } from "@/lib/rings";
import { addedItems, historyDays, offerFor, recordedItems, type PictureItem } from "@/lib/signal-picture";
import { signalOfRecord } from "@/lib/signals";
import { dismissSpark, useDismissedSparks } from "@/lib/spark-dismissal";
import { sparksFor } from "@/lib/sparks";
import {
  ADD_COPY as ADD,
  LINKEDIN_STUB as LI,
  NOW_COPY as NC,
  PRESENCE_STUB as PR,
  SPARK_COPY as SP,
  ACCOUNTS_COPY as AC,
  WEBSITE_STUB as WEB,
} from "@/mock/accounts-stub";
import { PLAN_TEMPLATES, recommendPlan } from "@/mock/onboarding";
import { CALENDAR_COPY as CAL, DIRECTION_PLAN_COPY as DP, ENTRY_TYPES, ROADMAP_COPY as RM, SIGNAL_PICTURE_COPY as SPIC, entryTypeOfKind, roadmapFor } from "@/mock/plan";
import { ACTIONS } from "@/mock/plan-stub";
import { SNAPSHOTS } from "@/mock/snapshots";
import type { CalendarItem } from "@/mock/plan";
import { PlanMomentum } from "./PlanMomentum";

/**
 * Everything the Plan page is made of, built once, so the three concepts differ
 * only in what they put first and how they lay it out. Each concept is the
 * same parts in another order: that is what a reviewer is choosing between.
 *
 * It holds the page's state: her entry flow, her roadmap choices and her next
 * steps (kept per scenario in `lib/plan-store`), and the narrative that reads
 * them.
 */
export function usePlanPage() {
  const loop = useLoop();
  const addedPresence = useAddedPresence();
  const baseline = useBaseline();
  const current = useCurrent();
  const [updating, setUpdating] = useState(false);
  const dismissed = useDismissedSparks();
  const [entry, setEntry] = useState<
    { mode: "add"; initial?: Partial<EntryValues>; fromRecord?: string } | { mode: "edit"; item: PictureItem } | null
  >(null);
  const [offerDismissed, setOfferDismissed] = useState(false);
  // The steps on her Plan as the list shows them, hand-offs included, for the Calendar and the narrative.
  const [liveState, setLiveState] = useState<{ key: string; state: PlanState } | null>(null);
  // The day in view, shared by the Agenda and the Calendar; today until she picks one.
  const [picked, setPicked] = useState<{ scenario: string; day: string } | null>(null);
  const [calEntry, setCalEntry] = useState<{ mode: "add"; date: string } | { mode: "edit"; item: CalendarItem } | null>(null);

  const choices = useRoadmapChoices(loop.id);
  // Next steps are written for Step up only; another plan starts with none.
  const switchedTo = choices?.history.length ? choices.planId : null;
  const stepsKey = `${loop.id}:${switchedTo ?? "base"}`;
  const savedSteps = useSavedSteps(stepsKey);
  const start = SNAPSHOTS[loop.id];
  const planId = choices?.planId ?? loop.account.plan.id;

  const items = withAdded(addedPresence);
  const seeded = loop.homeState !== "first-return";
  const pictureItems = [...recordedItems(loop.records, loop.tasks), ...addedItems(items, loop.today)];
  const history = historyDays(loop.account.plan.startedOn, loop.today);
  const offer = offerDismissed ? undefined : offerFor(loop.records, items, loop.today);
  const editing = entry?.mode === "edit" ? items.find((i) => i.id === entry.item.id) : undefined;

  /** Takes her to a step on the page and puts the keyboard on it. */
  function openStep(stepId: string) {
    const node = document.getElementById(`step-${stepId}`);
    node?.scrollIntoView({ block: "center" });
    node?.querySelector<HTMLElement>("h3, h4")?.focus();
  }

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

  // The narrative reads her live steps, as she has left them.
  const stepState = (liveState?.key === stepsKey ? liveState.state : undefined) ?? savedSteps?.state ?? (switchedTo ? { ...initialPlanState(loop.today), shown: [], decisions: {} } : initialPlanState(loop.today));
  const live = liveSteps(stepState).filter((s) => !isActionDone(s, loop.records, loop.tasks));
  const narrative = buildNarrative({
    events: momentumEvents(loop.records, loop.tasks),
    items: pictureItems,
    history,
    today: loop.today,
    steps: live,
    accepted: (step) => stepState.decisions[step.id]?.decision === "accepted",
  });

  const stepsFor = (layout: "list" | "carousel") => (
    <ActionSteps
      key={`steps-${layout}-${stepsKey}`}
      layout={layout}
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
      persist={{ saved: savedSteps, onChange: (next) => saveSteps(stepsKey, next) }}
      onState={(state) => setLiveState((prev) => (prev?.key === stepsKey && prev.state === state ? prev : { key: stepsKey, state }))}
    />
  );

  const steps = stepsFor("list");
  const stepsCarousel = stepsFor("carousel");

  const roadmap = (opts: { compact?: boolean; children?: ReactNode } = {}) => (
    <PlanRoadmap
      key={`roadmap-${loop.id}`}
      planId={planId}
      startedOn={choices?.startedOn ?? loop.account.plan.startedOn}
      today={loop.today}
      rationale={recommendPlan(start.account.direction).rationale ?? ""}
      evidenceStage={currentStageIndex(loop.records, roadmapFor(loop.account.plan.id).length, ACTIONS, loop.tasks)}
      startStage={currentStageIndex(start.records, roadmapFor(loop.account.plan.id).length, ACTIONS, start.tasks)}
      choices={choices}
      onChoices={(next) => saveRoadmap(loop.id, next)}
      compact={opts.compact}
    >
      {opts.children}
    </PlanRoadmap>
  );

  // The roadmap as an Agenda and a Calendar (Concept 1): one plan, one set of windows, one day in view.
  const calendarItems = useCalendar(loop.id);
  const day = picked?.scenario === loop.id ? picked.day : loop.today;
  const windows = roadmapWindows({
    planId: loop.account.plan.id,
    startedOn: loop.account.plan.startedOn,
    choices,
    evidenceStage: currentStageIndex(loop.records, roadmapFor(loop.account.plan.id).length, ACTIONS, loop.tasks),
    startStage: currentStageIndex(start.records, roadmapFor(loop.account.plan.id).length, ACTIONS, start.tasks),
    today: loop.today,
  });
  const selectDay = (date: string) => setPicked({ scenario: loop.id, day: date });
  // Her live steps on her calendar: suggested for a day until she accepts one or moves it.
  const stepEntries = live.map((step) => ({ id: step.id, title: step.title, ...stepDay(stepState, step) }));

  // Concept 1: the roadmap as an Agenda. She can add something to a stage from its card.
  const agenda = (
    <RoadmapAgenda
      key={`agenda-${loop.id}`}
      planId={planId}
      startedOn={choices?.startedOn ?? loop.account.plan.startedOn}
      today={loop.today}
      rationale={recommendPlan(start.account.direction).rationale ?? ""}
      evidenceStage={currentStageIndex(loop.records, roadmapFor(loop.account.plan.id).length, ACTIONS, loop.tasks)}
      startStage={currentStageIndex(start.records, roadmapFor(loop.account.plan.id).length, ACTIONS, start.tasks)}
      choices={choices}
      onChoices={(next) => saveRoadmap(loop.id, next)}
      items={calendarItems}
      steps={stepEntries}
      onAdd={(date) => setCalEntry({ mode: "add", date })}
    />
  );

  // Concept 2: the Calendar, with Add right under its heading.
  const calendar = (
    <PlanCalendar
      key={`calendar-${loop.id}`}
      windows={windows}
      items={calendarItems}
      steps={stepEntries}
      onOpenStep={openStep}
      today={loop.today}
      selected={day}
      onSelect={selectDay}
      onAdd={(date) => setCalEntry({ mode: "add", date })}
      onEdit={(item) => setCalEntry({ mode: "edit", item })}
      onDelete={(item) =>
        saveCalendar(
          loop.id,
          calendarItems.filter((i) => i.id !== item.id)
        )
      }
      controls={
        <div>
          <Button variant="secondary" size="sm" onClick={() => setCalEntry({ mode: "add", date: day })}>
            <Icon name="plus" size={14} />
            {CAL.add}
          </Button>
        </div>
      }
    />
  );

  function saveItem(values: ItemValues) {
    if (calEntry?.mode === "edit") {
      const id = calEntry.item.id;
      saveCalendar(
        loop.id,
        calendarItems.map((i) => (i.id === id ? { ...i, ...values } : i))
      );
    } else {
      saveCalendar(loop.id, [...calendarItems, { id: `item-${Date.now()}`, ...values }]);
    }
    selectDay(values.date);
    setCalEntry(null);
  }

  const calendarSheet = (
    <CalendarItemSheet
      key={calEntry ? (calEntry.mode === "edit" ? `cal-${calEntry.item.id}` : `cal-add-${calEntry.date}`) : "cal-closed"}
      open={calEntry !== null}
      onClose={() => setCalEntry(null)}
      onSave={saveItem}
      windows={windows}
      editing={calEntry?.mode === "edit"}
      initial={calEntry?.mode === "edit" ? calEntry.item : calEntry?.mode === "add" ? { date: calEntry.date } : undefined}
    />
  );

  // Her direction is hers to change at any time. It never changes her plan, and the plan's
  // reason stays the one she was given, so the hand-written "toward" line is cleared.
  // Concept 1 sets it as a statement; Concept 2 as a compass that also names her plan and stage.
  const directionFor = (variant: "statement" | "compass") => {
    const here = windows.find((w) => w.status === "current") ?? windows[windows.length - 1];
    return (
      <DirectionCard
        key={`direction-${variant}-${loop.id}`}
        variant={variant}
        direction={loop.account.direction}
        edited={loop.account.direction !== start.account.direction}
        plan={{
          name: PLAN_TEMPLATES.find((p) => p.id === planId)?.name ?? "",
          stage: here ? DP.stage(here.index + 1, windows.length, here.title) : "",
        }}
        onSave={(text) => loopActions.updateAccount({ direction: text, towardShort: undefined })}
      />
    );
  };
  const direction = directionFor("statement");
  const directionCompass = directionFor("compass");

  const note = switchedTo ? <p className="plan-stub__note">{RM.stepsStub}</p> : null;

  const narrativeNode = <PlanNarrative key={`narrative-${loop.id}`} narrative={narrative} onOpenStep={openStep} />;

  const momentum = (
    <PlanMomentum
      key={`momentum-${loop.id}`}
      records={loop.records}
      tasks={loop.tasks}
      today={loop.today}
      startedOn={loop.account.plan.startedOn}
    />
  );

  const picture = (
    <PlanSignalPicture
      key={`picture-${loop.id}`}
      items={pictureItems}
      today={loop.today}
      history={history}
      onAdd={() => setEntry({ mode: "add" })}
      onEdit={(item) => setEntry({ mode: "edit", item })}
      onDelete={(item) => removePresence(item.id)}
      offer={offer}
      onAcceptOffer={() =>
        offer && setEntry({ mode: "add", initial: { type: "published", on: offer.usedOn }, fromRecord: offer.recordId })
      }
      onDismissOffer={() => setOfferDismissed(true)}
    />
  );

  // The homepage's starting-point counts, kept until the homepage concept is chosen.
  const rows = signalRows(loop.today, items, baseline, seeded, (item) =>
    [item.note ?? item.title, item.where, shortDate(item.on)].filter(Boolean).join(" · "),
    current
  );
  /* What the update form opens on: where she last said she is, else the
     counts the rows already show. */
  const nowStart: Baseline = {
    counts: Object.fromEntries(
      presenceCounts(loop.today, items, baseline, seeded, current).map((p) => [p.kind, p.now])
    ) as Baseline["counts"],
    ...((current?.followers ?? baseline?.followers) !== undefined
      ? { followers: (current?.followers ?? baseline?.followers) as number }
      : {}),
  };
  const sparks = sparksFor(loop.today, loop.account, dismissed, items).filter((n) => n.id.startsWith("presence:"));
  const addedCount = items.filter((item) => item.on <= loop.today).length;
  /* The notes on what has moved, kept apart from the card so a page can put
     them right under its heading. */
  const sparkNode = (
    <Spark
      items={sparks}
      label={SP.label}
      dismissLabel={SP.dismiss}
      dismissName={SP.dismissNote}
      onDismiss={(id) => dismissSpark(id)}
    />
  );
  const started = (
    <section className="plan-stub__signals" aria-labelledby="plan-signals-heading">
      <h2 className="u-visually-hidden" id="plan-signals-heading">
        {SPIC.startedHeading}
      </h2>
      {hasBaseline(baseline, seeded) ? (
        <>
        <PresenceCard
          name={SPIC.startedHeading}
          mark={PR.mark}
          asOf={PR.asOf(shortDate(loop.account.plan.startedOn))}
          thenLabel={AC.then}
          nowLabel={AC.now}
          rows={rows}
          summary={PR.summary(addedCount)}
          onAdd={() => setEntry({ mode: "add" })}
          addLabel={ADD.open}
          tryThis={{ ...PR.tryThis, href: conceptHref("toolbox-flow", "concept-1") }}
          tryLabel={AC.tryThis}
          headingId="plan-signals-card"
        />
        <button type="button" className="link link--standalone signal-picture__links" onClick={() => setUpdating(true)}>
          {NC.open}
        </button>
        </>
      ) : (
        <SignalPicture
          name={SPIC.startedHeading}
          empty={<BaselineForm onSave={saveBaseline} />}
          headingId="plan-signals-card"
        />
      )}
    </section>
  );

  /* Her LinkedIn and her website, as Homepage Concept 2 drew them: numbers
     with their source and date, where she started beside where she is, what
     they suggest and one thing to try; or, not connected, what connecting
     would show. Moved here from that concept on 2026-10-06. PROVISIONAL: the
     numbers come from connected accounts, which V1 does not have. */
  const linkedIn = loop.account.connections.find((c) => c.id === "linkedin");
  const website = loop.account.connections.find((c) => c.id === "website");
  const anyConnected = Boolean(linkedIn?.connected || website?.connected);
  const toolbox = conceptHref("toolbox-flow", "concept-1");
  const profile = conceptHref("profile", "concept-1");
  const accounts = (
    <section className="accounts-home" aria-labelledby="accounts-heading">
      <div className="signals-home__intro">
        <h2 className="signals-home__heading" id="accounts-heading" tabIndex={-1}>
          {AC.heading}
        </h2>
        <p className="signals-home__window">{anyConnected ? AC.sub : AC.subNotConnected}</p>
      </div>
      {linkedIn?.connected && linkedIn.connectedOn ? (
        <AccountCard
          name={LI.name}
          mark={LI.mark}
          asOf={AC.asOfLinkedIn(shortDate(linkedIn.connectedOn))}
          stats={LI.stats}
          baseline={LI.baseline}
          thenLabel={AC.then}
          nowLabel={AC.now}
          chart={
            <TrendLine
              values={LI.followers}
              labels={LI.followers.map(
                (_, i) => `Week of ${shortDate(addDays(linkedIn.connectedOn!, -(LI.followers.length - 1 - i) * 7))}`
              )}
              caption={LI.chartCaption}
              summary={LI.chartSummary}
            />
          }
          says={LI.says}
          saysLabel={AC.says}
          tryThis={{ ...LI.tryThis, href: toolbox }}
          tryLabel={AC.tryThis}
          headingId="account-linkedin"
        />
      ) : (
        <AccountCard name={LI.name} mark={LI.mark} invite={{ ...LI.invite, href: profile }} headingId="account-linkedin" />
      )}
      {website?.connected && website.connectedOn ? (
        <AccountCard
          name={WEB.name}
          mark={WEB.mark}
          asOf={AC.asOfWebsite(shortDate(website.connectedOn))}
          stats={WEB.stats}
          baseline={WEB.baseline}
          thenLabel={AC.then}
          nowLabel={AC.now}
          says={WEB.says}
          saysLabel={AC.says}
          tryThis={{ ...WEB.tryThis, href: toolbox }}
          tryLabel={AC.tryThis}
          headingId="account-website"
        />
      ) : (
        <AccountCard name={WEB.name} mark={WEB.mark} invite={{ ...WEB.invite, href: profile }} headingId="account-website" />
      )}
    </section>
  );

  const sheet = (
    <SignalEntrySheet
      key={entry ? (entry.mode === "edit" ? `signal-${entry.item.id}` : `signal-add-${entry.fromRecord ?? ""}`) : "signal-closed"}
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
  );

  const updateNow = (
    <UpdateNowSheet
      key={updating ? "update-now-open" : "update-now-closed"}
      open={updating}
      initial={nowStart}
      onClose={() => setUpdating(false)}
      onSave={(now) => {
        saveCurrent({ ...now, on: loop.today });
        setUpdating(false);
      }}
    />
  );

  return { direction, directionCompass, steps, stepsCarousel, roadmap, agenda, calendar, note, narrative: narrativeNode, momentum, picture, started, accounts, sparkNode, sheet: (
      <>
        {sheet}
        {updateNow}
        {calendarSheet}
      </>
    ) };
}
