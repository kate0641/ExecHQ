"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BaselineForm } from "@/components/homepage/BaselineForm";
import { LinkedInMore } from "@/components/homepage/LinkedInMore";
import { useLinkedInExport, setLinkedInExport } from "@/lib/linkedin-store";
import { LINKEDIN_EXPORT, SEEDED_EXPORT } from "@/mock/linkedin-export";
import { LINKEDIN_READ_MS, looksLikeLinkedInExport } from "@/mock/onboarding";
import { PresenceCard } from "@/components/homepage/PresenceCard";
import { SignalPicture } from "@/components/homepage/SignalPicture";
import { Spark } from "@/components/homepage/Spark";
import { DirectionCard } from "@/components/plan/DirectionCard";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { ActionSteps } from "@/components/plan/ActionSteps";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { PlanAgenda, type AgendaItem } from "@/components/plan/PlanAgenda";
import { PlanGuided } from "@/components/plan/PlanGuided";
import { PlanHeader } from "@/components/plan/PlanHeader";
import { PlanNarrative } from "@/components/plan/PlanNarrative";
import { PlanRoadmap } from "@/components/plan/PlanRoadmap";
import { RoadmapTimeline } from "@/components/plan/RoadmapTimeline";
import { CalendarItemSheet, type ItemValues } from "@/components/plan/CalendarItemSheet";
import { PlanCalendar } from "@/components/plan/PlanCalendar";
import { PlanSignalPicture, type SignalPictureVariant } from "@/components/plan/PlanSignalPicture";
import { EntryDrawer } from "@/components/plan/EntryDrawer";
import { LinkedInPicture } from "@/components/plan/LinkedInPicture";
import { ReportDrawer, type ReportValues } from "@/components/plan/ReportDrawer";
import { SignalEntrySheet, type EntryValues } from "@/components/plan/SignalEntrySheet";
import { accept, complete, decline, edit as editStep, initialPlanState, liveSteps, stepDay, type PlanState } from "@/lib/action-steps";
import { askConcierge } from "@/flows/navigation/concept-1/ConciergeConcept";
import { setAgendaLayout, useAgendaLayout } from "@/lib/agenda-choice";
import { shortDate } from "@/lib/loop";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { momentumEvents } from "@/lib/momentum";
import { buildNarrative } from "@/lib/narrative";
import { planSparks } from "@/lib/plan-sparks";
import { roadmapWindows, stageAt } from "@/lib/roadmap-dates";
import { whenWords } from "@/lib/time-words";
import { saveCalendar, saveRoadmap, saveSteps, useCalendar, useRoadmapChoices, useSavedSteps } from "@/lib/plan-store";
import { addedSummary, hasBaseline, signalRows, withAdded } from "@/lib/presence";
import { addPresence, removePresence, saveBaseline, saveCurrent, updatePresence, useAddedPresence, useBaseline, useCurrent } from "@/lib/presence-store";
import { currentStageIndex, isDone as isActionDone } from "@/lib/rings";
import { addedItems, historyDays, newlyRecorded, type CameOfRow, nextOutsideStep, offerFor, recordedItems, type PictureItem } from "@/lib/signal-picture";
import { ACTIVITY_OF_CHANNEL, ACTIVITY_TYPES } from "@/mock/plan";
import { signalOfRecord } from "@/lib/signals";
import { hideSignal, markNoticed, useSignalNotices } from "@/lib/signal-notices";
import { dismissSpark, useDismissedSparks } from "@/lib/spark-dismissal";
import { sparksFor } from "@/lib/sparks";
import {
  ADD_COPY as ADD,
  PRESENCE_STUB as PR,
  SPARK_COPY as SP,
  COUNT_COPY as AC,
  BASELINE_COPY as BC,
} from "@/mock/accounts-stub";
import { PLAN_TEMPLATES, recommendPlan } from "@/mock/onboarding";
import type { ActionStep, StepQuestion } from "@/mock/plan";
import { CALENDAR_COPY as CAL, EDIT_FLOW_HREF, PLAN_AGENDA_COPY as AG, CARD_QUESTIONS, STEP_QUESTIONS, type DeclineReason, type GuidedAnswer, DIRECTION_PLAN_COPY as DP, ENTRY_TYPES, ROADMAP_COPY as RM, SIGNAL_PICTURE_COPY as SPIC, entryTypeOfKind, roadmapFor } from "@/mock/plan";
import { ACTIONS } from "@/mock/plan-stub";
import { SNAPSHOTS } from "@/mock/snapshots";
import type { CalendarItem } from "@/mock/plan";
import type { MomentumVariant } from "@/components/plan/MomentumLabeled";
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
  const agendaLayout = useAgendaLayout();
  const addedPresence = useAddedPresence();
  const baseline = useBaseline();
  const current = useCurrent();
  // The LinkedIn export she may add under her starting numbers. In the prototype only its name is kept, and "reading" is a timer.
  // It stays across pages. After the first visit she has been here a while, so an export is already in.
  const storedExport = useLinkedInExport();
  const liExport = storedExport.status === "none" && loop.homeState !== "first-return" ? SEEDED_EXPORT : storedExport;
  useEffect(() => {
    if (storedExport.status !== "reading") return;
    const read = setTimeout(() => setLinkedInExport((l) => ({ ...l, status: "ready" })), LINKEDIN_READ_MS);
    return () => clearTimeout(read);
  }, [storedExport.status, storedExport.fileName]);
  const dismissed = useDismissedSparks();
  const notices = useSignalNotices();
  const onSignals = usePathname().startsWith("/signals");
  // Adding opens the drawer, and may start from a piece she has just published; editing opens the sheet.
  const [adding, setAdding] = useState<{ initial?: Partial<EntryValues>; fromRecord?: string } | null>(null);
  const [editingItem, setEditingItem] = useState<PictureItem | null>(null);
  // The row whose "Nothing reported yet" she tapped: the report drawer is for it.
  const [reporting, setReporting] = useState<CameOfRow | null>(null);
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
  const recorded = recordedItems(loop.records, loop.tasks).filter((i) => !notices.hidden.includes(i.id));
  const pictureItems = [...recorded, ...addedItems(items, loop.today)];
  /* What ExecHQ recorded in the last week, so she can tell it from what she added. */
  const freshRecorded = newlyRecorded(recorded, loop.today, notices.hidden);
  const freshKey = freshRecorded.map((i) => i.id).join("|");
  // Being on the Signal Picture is seeing them: the dot on the navigation clears.
  useEffect(() => {
    if (onSignals && freshKey) markNoticed(freshKey.split("|"));
  }, [onSignals, freshKey]);
  const history = historyDays(loop.account.plan.startedOn, loop.today);
  const offer = offerDismissed ? undefined : offerFor(loop.records, items, loop.today);
  const editing = editingItem ? items.find((i) => i.id === editingItem.id) : undefined;

  /** Takes her to a step on the page and puts the keyboard on it. */
  function openStep(stepId: string) {
    const node = document.getElementById(`step-${stepId}`);
    node?.scrollIntoView({ block: "center" });
    node?.querySelector<HTMLElement>("h3, h4")?.focus();
  }

  /** What an entry becomes when it is saved: the same for one and for several. */
  function fieldsOf(values: { type: string; on: string; text?: string; impact?: string }) {
    const type = ENTRY_TYPES.find((t) => t.id === values.type) ?? ENTRY_TYPES[4];
    const isLink = values.text ? /^https?:\/\//i.test(values.text) : false;
    return {
      kind: type.kind,
      title: type.label,
      where: "",
      happenedOn: values.on,
      link: isLink ? values.text : undefined,
      note: values.text && !isLink ? values.text : undefined,
      impact: values.impact,
    };
  }

  /** Everything she filled in the drawer. A piece she had just published belongs to the first thing that is not a number. */
  function saveRows(rows: EntryValues[]) {
    let fromRecord = adding?.fromRecord;
    for (const row of rows) {
      // Her followers are a number as of a day, not an event: only the Now column moves.
      if (row.type === "followers") {
        saveCurrent({ ...current, followers: row.followers, on: row.on });
        continue;
      }
      addPresence({
        ...fieldsOf(row),
        on: loop.today,
        area: fromRecord ? signalOfRecord(fromRecord) : undefined,
        fromRecord,
      });
      fromRecord = undefined;
    }
    setAdding(null);
  }

  /** What came of something, in her words. A thing she added keeps it on the thing; a thing the Loop made takes it as its outcome. */
  function saveReport(values: ReportValues) {
    if (reporting?.item) updatePresence(reporting.item.id, { impact: values.text });
    else if (reporting?.recordId && values.tone) loopActions.report(reporting.recordId, { type: values.tone, detail: values.text || undefined });
    else if (reporting?.recordId) loopActions.report(reporting.recordId, { type: "neutral", detail: values.text || undefined });
    setReporting(null);
  }

  /** Editing one thing she added. */
  function saveEdit(values: EntryValues) {
    if (editingItem) updatePresence(editingItem.id, fieldsOf(values));
    setEditingItem(null);
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
      onAsk={(step, q, mine) => askConcierge(CARD_QUESTIONS.find((x) => x.id === q)?.label ?? "", { kind: "step-question", stepId: step.id, q, mine })}
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

  // Concept 1: the roadmap as a timeline of the draft she started with, with sparks for what has changed.
  // She can add something to a stage from its card.
  const timelineSparks = planSparks({
    windows,
    choices,
    planId: loop.account.plan.id,
    startedOn: loop.account.plan.startedOn,
    today: loop.today,
    steps: stepState,
    events: momentumEvents(loop.records, loop.tasks),
    added: pictureItems.filter((i) => i.source === "added").map((i) => ({ id: i.id, text: i.text, on: i.on })),
  });
  const timeline = (
    <RoadmapTimeline
      key={`timeline-${loop.id}`}
      planId={planId}
      startedOn={choices?.startedOn ?? loop.account.plan.startedOn}
      today={loop.today}
      evidenceStage={currentStageIndex(loop.records, roadmapFor(loop.account.plan.id).length, ACTIONS, loop.tasks)}
      startStage={currentStageIndex(start.records, roadmapFor(loop.account.plan.id).length, ACTIONS, start.tasks)}
      choices={choices}
      onChoices={(next) => saveRoadmap(loop.id, next)}
      items={calendarItems}
      steps={stepEntries}
      sparks={timelineSparks}
      onAdd={(date) => setCalEntry({ mode: "add", date })}
    />
  );

  // Concept 2: the roadmap as an agenda. A step is its title and a way to start; every question about
  // it opens the chat. What she adds goes on her calendar, in the stage the day falls in.
  const stageOfDay = (date: string) => {
    const at = stageAt(windows, date);
    return at >= 0 ? at : date < windows[0].start ? 0 : windows.length - 1;
  };
  const agendaStages = windows.map((w) => ({
    index: w.index,
    title: w.title,
    when: whenWords(w.end, loop.today),
    finishing: roadmapFor(planId)[w.index]?.milestone ?? "",
    status: w.status,
  }));
  const agendaItems: AgendaItem[] = [
    ...live.map((step) => {
      const day = stepDay(stepState, step);
      return {
        id: step.id,
        stage: stageOfDay(day.date),
        title: step.title,
        date: day.date,
        kind: "step" as const,
        step,
        accepted: stepState.decisions[step.id]?.decision === "accepted",
      };
    }),
    ...calendarItems.map((item) => ({ id: item.id, stage: stageOfDay(item.date), title: item.title, date: item.date, kind: "yours" as const })),
  ];
  /** Something she added herself goes on her calendar; the agenda opens the stage it fell in. */
  function addToPlan({ title, date }: { title: string; date: string }) {
    // A new id from the ones she has, so it is the same on every render.
    const next = Math.max(0, ...calendarItems.map((i) => Number(i.id.split("-").pop()) || 0)) + 1;
    saveCalendar(loop.id, [...calendarItems, { id: `agenda-${next}`, title, date }]);
    return stageOfDay(date);
  }
  const keepSteps = (next: PlanState) => saveSteps(stepsKey, { state: next, notes: savedSteps?.notes ?? {}, empties: savedSteps?.empties ?? {} });
  // The agenda as Concept 2 reads it; Concept 3 shows the same agenda, in Stack, under its move.
  const agendaProps = {
    stages: agendaStages,
    items: agendaItems,
    today: loop.today,
    startHref: conceptHref("toolbox-flow", "concept-1"),
    onAsk: (step: ActionStep, q: StepQuestion) => askConcierge(STEP_QUESTIONS.find((x) => x.id === q)?.label ?? "", { kind: "step-question", stepId: step.id, q }),
    onAccept: (step: ActionStep) => keepSteps(accept(stepState, step.id)),
    onComplete: (step: ActionStep) => {
      loopActions.completeTask(step.id);
      keepSteps(complete(stepState, step.id).state);
    },
    onAdd: addToPlan,
  };
  const agenda = (
    <div className="plan-agenda-wrap" key={`agenda-${loop.id}-${planId}`}>
      <div className="momentum-scaffold">
        <p className="momentum-scaffold__title">{AG.scaffold.heading}</p>
        <ToggleGroup
          label={AG.scaffold.heading}
          labelHidden
          shape="pill"
          size="sm"
          options={[
            { value: "headings", label: AG.scaffold.headings },
            { value: "stack", label: AG.scaffold.stack },
          ]}
          value={agendaLayout}
          onChange={(v) => setAgendaLayout(v === "stack" ? "stack" : "headings")}
        />
      </div>
      <PlanAgenda key={`${agendaLayout}-${stepsKey}`} variant={agendaLayout} {...agendaProps} />
    </div>
  );

  // Concept 3: the guided check-in. The moves are her live steps as they stand when she arrives, one page
  // each, with the roadmap under the move. Answering changes her plan for real, by the same rules as the step cards.
  const guidedStages = windows.map((w) => ({ title: w.title, status: w.status }));
  const guidedSparks = timelineSparks.byStage
    .flat()
    .sort((a, b) => (a.on < b.on ? -1 : a.on > b.on ? 1 : 0))
    .slice(-6);
  function answerStep(
    step: ActionStep,
    answer: Exclude<GuidedAnswer, "talk">,
    o?: { reason?: DeclineReason; date?: string }
  ): string | void {
    if (answer === "plan") {
      // Accepting pins the day the step is suggested for, which the words say. Or the day she chose instead.
      const accepted = accept(stepState, step.id);
      keepSteps(o?.date ? editStep(accepted, step.id, { date: o.date }) : accepted);
    } else {
      // Not for me, and why if she said: the reason shapes what is offered in its place.
      const move = decline(stepState, step.id, o?.reason);
      keepSteps(move.state);
      const r = move.replacement;
      return r && "step" in r ? [r.heard, `Now offered: ${r.step.title}.`].filter(Boolean).join(" ") : r ? r.message : undefined;
    }
  }
  /** She has a draft for this step that is not yet used or sent. */
  const workingOn = (step: ActionStep) => {
    const record = step.artifactId ? loop.records.find((r) => r.id === step.artifactId) : undefined;
    return Boolean(record && ["drafted", "in-progress", "ready"].includes(record.state));
  };
  const guided = (
    <PlanGuided
      key={`guided-${loop.id}-${planId}`}
      planName={PLAN_TEMPLATES.find((p) => p.id === planId)?.name ?? ""}
      stageIndex={Math.max(0, windows.findIndex((w) => w.status === "current"))}
      stages={guidedStages}
      moves={live}
      whenOf={(step) => whenWords(stepDay(stepState, step).date, loop.today)}
      today={loop.today}
      startHref={conceptHref("toolbox-flow", "concept-1")}
      sparks={guidedSparks}
      onAnswer={answerStep}
      onTalk={(step) => askConcierge("Talk it through", { kind: "step-question", stepId: step.id, q: "stuck" })}
      workingOn={workingOn}
      onStart={(step) => keepSteps(accept(stepState, step.id))}
      onAdd={addToPlan}
      // The move is already said above it, with its way to start, so the stage opens on its list.
      roadmap={<PlanAgenda key={`stack-${stepsKey}`} variant="stack" openFirstStep={false} {...agendaProps} />}
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

  // Concept 1: what her plan is, in a line, with Edit opening the detail and the edit flow.
  const planHeader = (
    <PlanHeader
      key={`plan-header-${loop.id}-${planId}`}
      planId={planId}
      rationale={switchedTo ? RM.switchedOn(shortDate(choices?.startedOn ?? loop.today)) : (recommendPlan(start.account.direction).rationale ?? "")}
      stage={Math.max(0, windows.findIndex((w) => w.status === "current"))}
      direction={loop.account.direction}
      edited={loop.account.direction !== start.account.direction}
      editHref={EDIT_FLOW_HREF}
    />
  );

  const note = switchedTo ? <p className="plan-stub__note">{RM.stepsStub}</p> : null;

  const narrativeNode = <PlanNarrative key={`narrative-${loop.id}`} narrative={narrative} onOpenStep={openStep} />;

  const momentumOf = (variant: MomentumVariant) => (
    <PlanMomentum
      key={`momentum-${loop.id}-${variant}`}
      variant={variant}
      records={loop.records}
      tasks={loop.tasks}
      today={loop.today}
      startedOn={loop.account.plan.startedOn}
    />
  );
  const momentum = momentumOf("list");

  const toolboxHref = conceptHref("toolbox-flow", "concept-1");
  /* Until she has said where she started, the page asks that and nothing else:
     the picture would only repeat the page's title over an empty record. */
  /* Her next step as the path draws it: only one that would add a circle, so
     work inside the organisation is not shown here. It carries the plan's own
     reason, the kind of activity it adds one to, and whether she has started it. */
  const pathStep = (() => {
    const step = nextOutsideStep(loop.records, loop.tasks);
    if (!step || !step.channel) return undefined;
    const record = step.artifactId ? loop.records.find((r) => r.id === step.artifactId) : undefined;
    const lane = ACTIVITY_TYPES.find((a) => a.id === ACTIVITY_OF_CHANNEL[step.channel!])?.label ?? "";
    return {
      title: step.title,
      why: step.whyNow || step.whyThis,
      adds: lane,
      href: toolboxHref,
      started: loop.choices?.[step.id]?.decision === "started" || Boolean(record) || Boolean(loop.tasks?.[step.id]),
      onStart: () => loopActions.startAction(step.id),
    };
  })();
  const pictureOf = (variant: SignalPictureVariant) =>
    !hasBaseline(baseline, seeded) ? null : (
    <PlanSignalPicture
      key={`picture-${loop.id}-${variant}`}
      variant={variant}
      startedOn={loop.account.plan.startedOn}
      nextStep={pathStep}
      items={pictureItems}
      today={loop.today}
      onEdit={(item) => setEditingItem(item)}
      onReport={(row) => setReporting(row)}
      onDelete={(item) => removePresence(item.id)}
      offer={offer}
      onAcceptOffer={() =>
        offer && setAdding({ initial: { type: "published", on: offer.usedOn }, fromRecord: offer.recordId })
      }
      onDismissOffer={() => setOfferDismissed(true)}
    />
  );

  // The homepage's starting-point counts, kept until the homepage concept is chosen.
  const rows = signalRows(loop.today, items, baseline, seeded, (item) =>
    [item.note ?? item.title, item.where, shortDate(item.on)].filter(Boolean).join(" · "),
    current
  );
  const recordedNotes = freshRecorded
    .map((i) => ({ id: `recorded:${i.id}`, source: SP.recordedSource, text: SP.recorded(i.text), on: i.on, actionLabel: SP.hide }))
    .filter((n) => !dismissed.includes(n.id));
  const sparks = [...recordedNotes, ...sparksFor(loop.today, dismissed, items).filter((n) => n.id.startsWith("presence:"))].slice(0, 3);
  /* The notes on what has moved, kept apart from the card so a page can put
     them right under its heading. */
  const sparkNode = (
    <Spark
      items={sparks}
      label={SP.label}
      dismissLabel={SP.dismiss}
      dismissName={SP.dismissNote}
      onDismiss={(id) => dismissSpark(id)}
      onAction={(id) => hideSignal(id.replace(/^recorded:/, ""))}
    />
  );
  /* The upload stays: on the first visit it sits under the starting-point form, and after that under
     where she started, so "any time later" is true. Once a file is read, what it says is drawn below. */
  const linkedIn = (
    <LinkedInMore
      status={liExport.status}
      fileName={liExport.fileName}
      onChoose={(fileName) => setLinkedInExport({ fileName, status: looksLikeLinkedInExport(fileName) ? "reading" : "wrong-file" })}
      onSendSteps={() => setLinkedInExport((l) => ({ ...l, status: "sent" }))}
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
          summary={addedSummary(items, loop.today)}
          onAdd={() => setAdding({})}
          addLabel={ADD.open}
          tryThis={{ ...PR.tryThis, href: conceptHref("toolbox-flow", "concept-1") }}
          tryLabel={AC.tryThis}
          headingId="plan-signals-card"
        />
        {linkedIn}
        {liExport.status === "ready" ? <LinkedInPicture data={LINKEDIN_EXPORT} /> : null}
        </>
      ) : (
        <SignalPicture
          name={SPIC.startedHeading}
          empty={
            <BaselineForm
              onSave={saveBaseline}
              onSkip={() => saveBaseline({ counts: { podcast: 0, press: 0, speaking: 0, writing: 0 } })}
              intro={BC.introZero}
              skipLabel={BC.zeroSkip}
              after={linkedIn}
            />
          }
          headingId="plan-signals-card"
        />
      )}
    </section>
  );


  const sheet = (
    <SignalEntrySheet
      key={editingItem ? `signal-${editingItem.id}` : "signal-closed"}
      open={editingItem !== null}
      onClose={() => setEditingItem(null)}
      onSave={saveEdit}
      today={loop.today}
      editing
      initial={
        editing
          ? { type: entryTypeOfKind(editing.kind).id, on: editing.happenedOn ?? editing.on, text: editing.link ?? editing.note, impact: editing.impact }
          : undefined
      }
    />
  );

  return { direction, directionCompass, planHeader, steps, stepsCarousel, roadmap, timeline, agenda, guided, calendar, note, narrative: narrativeNode, momentum, momentumOf, pictureOf, started, sparkNode, sheet: (
      <>
        {sheet}
        <ReportDrawer
          key={reporting ? `report-${reporting.id}` : "report-closed"}
          open={reporting !== null}
          onClose={() => setReporting(null)}
          onSave={saveReport}
          did={reporting?.did ?? ""}
          on={reporting?.on ?? loop.today}
          asksTone={Boolean(reporting?.recordId && !loop.records.find((r) => r.id === reporting.recordId)?.outcome)}
        />
        <EntryDrawer
          key={adding ? `entry-${adding.fromRecord ?? "new"}` : "entry-closed"}
          open={adding !== null}
          onClose={() => setAdding(null)}
          onSave={saveRows}
          today={loop.today}
          existing={pictureItems}
          initial={adding?.initial}
        />
        {calendarSheet}
      </>
    ) };
}
