"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BaselineForm } from "@/components/homepage/BaselineForm";
import { LinkedInMore } from "@/components/homepage/LinkedInMore";
import { useLinkedInExport, setLinkedInExport } from "@/lib/linkedin-store";
import { LINKEDIN_EXPORT, SEEDED_EXPORT } from "@/mock/linkedin-export";
import { LINKEDIN_READ_MS, looksLikeLinkedInExport } from "@/mock/onboarding";
import { PresenceCard } from "@/components/homepage/PresenceCard";
import { SignalPicture } from "@/components/homepage/SignalPicture";
import { PlanAgenda, type AgendaItem } from "@/components/plan/PlanAgenda";
import { PlanGuided } from "@/components/plan/PlanGuided";
import { PlanDetailLink } from "@/components/plan/PlanDetailLink";
import { StageCheckIn, type CheckInItem } from "@/components/plan/StageCheckIn";
import { CheckInRecap } from "@/components/plan/CheckInRecap";
import { PlanDirection } from "@/components/plan/PlanDirection";
import { PlanSignalPicture, type SignalPictureVariant } from "@/components/plan/PlanSignalPicture";
import { EntryDrawer } from "@/components/plan/EntryDrawer";
import { LinkedInPicture } from "@/components/plan/LinkedInPicture";
import { ReportDrawer, type ReportValues } from "@/components/plan/ReportDrawer";
import { SignalEntrySheet, type EntryValues } from "@/components/plan/SignalEntrySheet";
import { accept, complete, decline, edit as editStep, initialPlanState, liveSteps, stepDay, type PlanState } from "@/lib/action-steps";
import { askConcierge } from "@/flows/navigation/concept-1/ConciergeConcept";
import { shortDate, type OutcomeType } from "@/lib/loop";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { momentumEvents } from "@/lib/momentum";
import { planSparks } from "@/lib/plan-sparks";
import { roadmapWindows, stageAt } from "@/lib/roadmap-dates";
import { whenWords } from "@/lib/time-words";
import { saveCalendar, saveSteps, useCalendar, useRoadmapChoices, useSavedSteps } from "@/lib/plan-store";
import { checkInKey, saveCheckIn, useCheckIns } from "@/lib/stage-checkins";
import { applyCheckIn } from "@/lib/check-in-effects";
import { addedSummary, hasBaseline, signalRows, withAdded } from "@/lib/presence";
import { addPresence, removePresence, saveBaseline, saveCurrent, updatePresence, useAddedPresence, useBaseline, useCurrent } from "@/lib/presence-store";
import { currentStageIndex, isDone as isActionDone } from "@/lib/rings";
import { addedItems, newlyRecorded, type CameOfRow, nextOutsideStep, offerFor, recordedItems, type PictureItem } from "@/lib/signal-picture";
import { ACTIVITY_OF_CHANNEL, ACTIVITY_TYPES } from "@/mock/plan";
import { signalOfRecord } from "@/lib/signals";
import { markNoticed, useSignalNotices } from "@/lib/signal-notices";
import {
  ADD_COPY as ADD,
  PRESENCE_STUB as PR,
  COUNT_COPY as AC,
  BASELINE_COPY as BC,
} from "@/mock/accounts-stub";
import { PLAN_TEMPLATES, recommendPlan } from "@/mock/onboarding";
import type { ActionStep, StepQuestion } from "@/mock/plan";
import { ACTION_QUEUE, GAP_STEP, stepById, EDIT_FLOW_HREF, STAGE_CHECKIN_COPY, STEP_QUESTIONS, type DeclineReason, type GuidedAnswer, ENTRY_TYPES, ROADMAP_COPY as RM, SIGNAL_PICTURE_COPY as SPIC, entryTypeOfKind, roadmapFor } from "@/mock/plan";
import { ACTIONS } from "@/mock/plan-stub";
import { SNAPSHOTS } from "@/mock/snapshots";
import type { MomentumVariant } from "@/components/plan/MomentumLabeled";
import { PlanMomentum } from "./PlanMomentum";

/**
 * Everything the Plan and Signals pages are made of, built once, so the concepts
 * differ only in what they put first and how they lay it out.
 *
 * It holds the page's state: her entry flow, her roadmap choices and her next
 * steps (kept per scenario in `lib/plan-store`).
 */
export function usePlanPage() {
  const loop = useLoop();
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
  const notices = useSignalNotices();
  const onSignals = usePathname().startsWith("/signals");
  // Adding opens the drawer, and may start from a piece she has just published; editing opens the sheet.
  const [adding, setAdding] = useState<{ initial?: Partial<EntryValues>; fromRecord?: string } | null>(null);
  const [editingItem, setEditingItem] = useState<PictureItem | null>(null);
  // The row whose "Nothing reported yet" she tapped: the report drawer is for it.
  const [reporting, setReporting] = useState<CameOfRow | null>(null);
  const [offerDismissed, setOfferDismissed] = useState(false);
  // The stage check-in on screen when it is not simply due: one she is reading back after saving, or one she
  // opened from its stage in the roadmap. It belongs to the scenario it was opened in.
  const [checkInShowing, setCheckInShowing] = useState<{ scenario: string; key: string; startAt: "start" | "summary"; fromRoadmap?: boolean } | null>(null);

  const choices = useRoadmapChoices(loop.id);
  const checkIns = useCheckIns(loop.id);
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
  const offer = offerDismissed ? undefined : offerFor(loop.records, items, loop.today);
  const editing = editingItem ? items.find((i) => i.id === editingItem.id) : undefined;

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

  // Her live steps, as she has left them.
  const stepState = savedSteps?.state ?? (switchedTo ? { ...initialPlanState(loop.today), shown: [], decisions: {} } : initialPlanState(loop.today));
  const live = liveSteps(stepState).filter((s) => !isActionDone(s, loop.records, loop.tasks));
  // One plan, one set of stage windows, for the timeline, the agenda and the check-in.
  const calendarItems = useCalendar(loop.id);
  // A stage she said she has not finished yet, at her check-in, stays open until the step aimed at what's
  // missing is done. Read from her answer, so changing it changes this back.
  const reopenStage = Object.entries(checkIns)
    .filter(([key, c]) => key.startsWith(`${planId}:`) && c.status === "done" && c.milestone === "not-yet")
    .map(([key]) => Number(key.split(":").pop()))
    .filter((stage) => {
      const gap = stepById(GAP_STEP[stage] ?? "");
      return gap ? !isActionDone(gap, loop.records, loop.tasks) : false;
    })
    .sort((a, b) => b - a)[0];
  const openChoices =
    reopenStage === undefined
      ? choices
      : {
          ...(choices ?? { planId, startedOn: loop.account.plan.startedOn, snoozedAt: null, history: [] }),
          confirmed: reopenStage,
          finishedOn: Object.fromEntries(Object.entries(choices?.finishedOn ?? {}).filter(([i]) => Number(i) !== reopenStage)),
          recommended: null,
        };
  const windows = roadmapWindows({
    planId: loop.account.plan.id,
    startedOn: loop.account.plan.startedOn,
    choices: openChoices,
    evidenceStage: currentStageIndex(loop.records, roadmapFor(loop.account.plan.id).length, ACTIONS, loop.tasks),
    startStage: currentStageIndex(start.records, roadmapFor(loop.account.plan.id).length, ACTIONS, start.tasks),
    today: loop.today,
  });

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
  // The roadmap as an agenda (Concept 3, under the move). A step is its title and a way to start; every question about
  // it opens the chat. What she adds goes on her calendar, in the stage the day falls in.
  const stageOfDay = (date: string) => {
    const at = stageAt(windows, date);
    return at >= 0 ? at : date < windows[0].start ? 0 : windows.length - 1;
  };
  // A step still to do belongs to where she is, never to a stage she has finished. Her work can put her past a
  // stage while its suggested window still runs to today, so a step dated today would otherwise land in it.
  const firstOpenStage = Math.max(0, windows.findIndex((w) => w.status !== "done"));
  const stageOfStep = (date: string) => Math.max(stageOfDay(date), windows.every((w) => w.status === "done") ? windows.length - 1 : firstOpenStage);
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
        stage: stageOfStep(day.date),
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
  // The agenda, as Concept 3 shows it under its move.
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
  // What the plan detail reads: Concept 1's header and Concept 3's See your plan open the same sheet.
  const planDetail = {
    planId,
    rationale: switchedTo ? RM.switchedOn(shortDate(choices?.startedOn ?? loop.today)) : (recommendPlan(start.account.direction).rationale ?? ""),
    stage: Math.max(0, windows.findIndex((w) => w.status === "current")),
    direction: loop.account.direction,
    edited: loop.account.direction !== start.account.direction,
    editHref: EDIT_FLOW_HREF,
  };
  // The stage check-in. ExecHQ decides a stage is finished, from her work; the most recent finished stage
  // she has not checked in on (or put off) opens the check-in in place of the moves. Older ones stay history.
  const lastDone = [...windows].reverse().find((w) => w.status === "done");
  // Never one behind a stage she has already checked in on, such as one she said is not finished yet.
  const checkedLater = lastDone ? windows.some((w) => w.index > lastDone.index && checkIns[checkInKey(planId, w.index)]) : false;
  const dueKey = lastDone && !checkedLater && !checkIns[checkInKey(planId, lastDone.index)] ? checkInKey(planId, lastDone.index) : null;
  // The one opened by hand belongs to this scenario only: switching scenarios leaves it behind.
  const showing = checkInShowing?.scenario === loop.id ? checkInShowing : null;
  const checkInStage = windows.find((w) => checkInKey(planId, w.index) === (showing?.key ?? dueKey));
  const savedCheckIn = checkInStage ? checkIns[checkInKey(planId, checkInStage.index)] : undefined;
  /** What she did in a stage: her steps from it, done or passed on, and what she added while it ran. */
  function didInStage(stage: number): CheckInItem[] {
    const w = windows[stage];
    const steps = ACTION_QUEUE.filter((step) => step.stage === stage).flatMap((step): CheckInItem[] => {
      if (stepState.decisions[step.id]?.decision === "declined") {
        return [{ id: step.id, from: "step", title: step.title, what: "", passed: true, asksTone: false }];
      }
      if (!isActionDone(step, loop.records, loop.tasks)) return [];
      const record = step.artifactId ? loop.records.find((r) => r.id === step.artifactId) : undefined;
      if (record) {
        const said = record.outcome && (record.outcome.type !== "no-response-yet" || record.outcome.detail);
        return [{
          id: step.id,
          from: "execHQ",
          title: record.title,
          what: record.usedOn ? STAGE_CHECKIN_COPY.used(shortDate(record.usedOn)) : step.title,
          feedback: said ? { tone: record.outcome?.type, words: record.outcome?.detail } : undefined,
          asksTone: true,
        }];
      }
      const task = loop.tasks?.[step.id];
      return [{
        id: step.id,
        from: "step",
        title: step.title,
        what: task?.doneOn ? STAGE_CHECKIN_COPY.done(shortDate(task.doneOn)) : "",
        feedback: task?.outcome ? { tone: task.outcome.type, words: task.outcome.detail } : undefined,
        asksTone: true,
      }];
    });
    // What she added herself while the stage ran. Only what she added can take her words; the rest is listed as it is.
    const added = pictureItems
      .filter((i) => i.source === "added" && w && i.on >= w.start && i.on <= w.end)
      .map((i): CheckInItem => ({
        id: i.id,
        from: "you",
        title: i.text,
        what: STAGE_CHECKIN_COPY.added(shortDate(i.on)),
        feedback: i.impact ? { words: i.impact } : i.editable ? undefined : {},
        asksTone: false,
      }));
    return [...steps, ...added];
  }
  /** What came of a thing, from the check-in: kept on the thing itself, as "What came of it?" does. */
  function reportFromCheckIn(item: CheckInItem, answer: { tone?: OutcomeType; words?: string }) {
    if (item.from === "you") {
      if (answer.words) updatePresence(item.id, { impact: answer.words });
      return;
    }
    const step = ACTION_QUEUE.find((s) => s.id === item.id);
    if (step?.artifactId) loopActions.report(step.artifactId, { type: answer.tone ?? "neutral", detail: answer.words });
    else if (answer.tone) {
      loopActions.answerTask(item.id, answer.tone);
      if (answer.words) loopActions.noteTask(item.id, answer.words);
    }
  }
  // Her check-in on each finished stage, in the roadmap: read back when done, a way in when put off.
  const checkInNote = (index: number) => {
    const key = checkInKey(planId, index);
    const saved = checkIns[key];
    if (!saved || (windows[index]?.status !== "done" && index !== reopenStage)) return null;
    return (
      <CheckInRecap
        status={saved.status}
        milestone={saved.milestone}
        feeling={saved.feeling}
        words={saved.words}
        onOpen={() => setCheckInShowing({ scenario: loop.id, key, startAt: saved.status === "done" ? "summary" : "start", fromRoadmap: true })}
      />
    );
  };
  // Her direction sits above the road it leads to, and opens like an accordion. The way into her
  // whole plan, the same detail Concept 1's Edit opens, sits beside the roadmap's heading. Under the move
  // in the check-in, and beside every page of the stage check-in on the web.
  const roadmap = (
    <div className="plan-road">
      <PlanDirection direction={loop.account.direction} />
      <PlanAgenda
        key={`agenda-${stepsKey}`}
        openFirstStep={false}
        stageNote={checkInNote}
        action={<PlanDetailLink key={`plan-detail-${loop.id}-${planId}`} {...planDetail} />}
        {...agendaProps}
      />
    </div>
  );
  const stageCheckIn = checkInStage ? (
    <StageCheckIn
      key={`checkin-${loop.id}-${planId}-${checkInStage.index}`}
      stageIndex={checkInStage.index}
      stageCount={windows.length}
      stageTitle={checkInStage.title}
      milestone={roadmapFor(planId)[checkInStage.index]?.milestone ?? ""}
      nextStageTitle={windows[checkInStage.index + 1]?.title}
      items={didInStage(checkInStage.index)}
      onReport={reportFromCheckIn}
      onSave={(answers) => {
        const key = checkInKey(planId, checkInStage.index);
        setCheckInShowing({ scenario: loop.id, key, startAt: "summary" });
        // What she said changes her plan: a step at the gap, a different way at what didn't go as hoped, and
        // an important step she passed on, once more. Steps are written for Step up only.
        let again = savedCheckIn?.again ?? [];
        if (!switchedTo) {
          const notHoped = didInStage(checkInStage.index)
            .filter((i) => i.from !== "you" && i.feedback?.tone === "negative")
            .map((i) => i.id);
          const effect = applyCheckIn(stepState, {
            stage: checkInStage.index,
            milestone: answers.milestone,
            notHoped,
            isDone: (id) => {
              const step = stepById(id);
              return step ? isActionDone(step, loop.records, loop.tasks) : false;
            },
          });
          const heard = Object.fromEntries(Object.entries(effect.heard).map(([id, line]) => [id, { heard: line }]));
          saveSteps(stepsKey, { state: effect.state, notes: { ...savedSteps?.notes, ...heard }, empties: savedSteps?.empties ?? {} });
          again = [...again, ...Object.keys(effect.heard).filter((id) => effect.heard[id] === STAGE_CHECKIN_COPY.heardAgain)];
        }
        saveCheckIn(loop.id, key, { status: "done", on: loop.today, ...answers, words: answers.words?.trim() || undefined, again });
      }}
      onLater={() => {
        // Putting off one she has already done keeps her answers.
        if (savedCheckIn?.status !== "done") saveCheckIn(loop.id, checkInKey(planId, checkInStage.index), { status: "later", on: loop.today });
        setCheckInShowing(null);
      }}
      onContinue={() => setCheckInShowing(null)}
      saved={savedCheckIn?.status === "done" ? savedCheckIn : undefined}
      offeredAgain={Boolean(savedCheckIn?.again?.length)}
      startAt={showing?.startAt}
      focusOnOpen={showing?.fromRoadmap}
      aside={roadmap}
    />
  ) : null;

  const hereIndex = windows.findIndex((w) => w.status === "current");
  const unsureAt = (index: number) => {
    const c = checkIns[checkInKey(planId, index)];
    return c?.status === "done" && (c.feeling === "stuck" || c.feeling === "less-sure");
  };
  const oneAtATime = hereIndex >= 0 && (unsureAt(hereIndex) || unsureAt(hereIndex - 1));

  const guided = stageCheckIn ?? (
    <PlanGuided
      key={`guided-${loop.id}-${planId}`}
      planName={PLAN_TEMPLATES.find((p) => p.id === planId)?.name ?? ""}
      stageIndex={Math.max(0, windows.findIndex((w) => w.status === "current"))}
      stages={guidedStages}
      // Stuck or less sure at her last check-in: one step at a time while the stage after it runs.
      moves={oneAtATime ? live.slice(0, 1) : live}
      heardOf={(step) => savedSteps?.notes?.[step.id]?.heard}
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
      roadmap={roadmap}
    />
  );

  const momentumOf = (variant: MomentumVariant) => (
    <PlanMomentum
      key={`momentum-${loop.id}-${variant}`}
      variant={variant}
      records={loop.records}
      tasks={loop.tasks}
      signals={pictureItems.filter((i) => i.source === "added").map((i) => ({ id: i.id, text: i.text, on: i.on }))}
      today={loop.today}
      startedOn={loop.account.plan.startedOn}
    />
  );

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
  // What her LinkedIn export says, once one is read. Under where she started on a phone and a tablet; on
  // the web, Signals Concept 2 sets it beside, under what came of it, so the two columns stay even.
  const linkedInView = liExport.status === "ready" ? <LinkedInPicture data={LINKEDIN_EXPORT} /> : null;
  const startedOf = (withLinkedInView: boolean) => (
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
        {withLinkedInView ? linkedInView : null}
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
  const started = startedOf(true);


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

  return { guided, momentumOf, pictureOf, started, startedOf, linkedInView, sheet: (
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
      </>
    ) };
}
