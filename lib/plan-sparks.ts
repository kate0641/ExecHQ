/**
 * The sparks on the roadmap timeline: short notes on what happened and how her plan moved
 * with it. They are read off what she did (a stage finished, a step done or put off, a
 * direction changed, something recorded or added), never written ahead, so they change as she
 * does. Each says what happened and what moved, and never that one thing caused another.
 * No days: when a note needs a time it says it in words.
 */

import type { RoadmapChoices } from "@/lib/roadmap-choices";
import type { PlanState } from "@/lib/action-steps";
import { addDays, daysBetween, type LoopDate } from "@/lib/loop";
import type { MomentumEvent } from "@/lib/momentum";
import { stageAt, type StageWindow } from "@/lib/roadmap-dates";
import { whenWords } from "@/lib/time-words";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import { SPARK_NOTES as N, roadmapFor, stepById } from "@/mock/plan";

export type PlanSparkKind = "stage" | "pace" | "direction" | "plan" | "step" | "record" | "signal";

export interface PlanSpark {
  id: string;
  kind: PlanSparkKind;
  /** Where it came from, in small capitals. */
  label: string;
  text: string;
  /** For ordering only: it is never shown. */
  on: LoopDate;
}

export interface TimelineSparks {
  /** Sparks on each stage of the plan she is on, by stage. */
  byStage: PlanSpark[][];
  /** Sparks after each earlier plan, by its place in her history. */
  afterEarlier: PlanSpark[][];
}

export const NO_SPARKS: TimelineSparks = { byStage: [], afterEarlier: [] };

const nameOf = (planId: string) => PLAN_TEMPLATES.find((p) => p.id === planId)?.name ?? planId;

export function planSparks(input: {
  windows: StageWindow[];
  choices?: RoadmapChoices;
  /** The plan she started on, for when she has made no choices. */
  planId: string;
  startedOn: LoopDate;
  today: LoopDate;
  steps: PlanState;
  events: MomentumEvent[];
  added: { id: string; text: string; on: LoopDate }[];
}): TimelineSparks {
  const { windows, choices, today, steps, events, added } = input;
  const planId = choices?.planId ?? input.planId;
  const startedOn = choices?.startedOn ?? input.startedOn;
  const history = choices?.history ?? [];
  const stages = roadmapFor(planId);
  const byStage: PlanSpark[][] = windows.map(() => []);
  const afterEarlier: PlanSpark[][] = history.map(() => []);

  /** The stage a day belongs to; a day before the plan began is the first stage, one after the last window is the last. */
  const place = (on: LoopDate) => {
    const at = stageAt(windows, on);
    return at >= 0 ? at : on < windows[0].start ? 0 : windows.length - 1;
  };
  const put = (spark: PlanSpark, stage = place(spark.on)) => byStage[stage]?.push(spark);

  // A stage she finished, against the draft's own pace.
  let draftEnd = startedOn;
  stages.forEach((stage, i) => {
    draftEnd = addDays(startedOn, stages.slice(0, i + 1).reduce((sum, s) => sum + s.weeks, 0) * 7 - 1);
    const finished = choices?.finishedOn?.[i];
    if (finished === undefined) return;
    const weeks = Math.round(daysBetween(draftEnd, finished) / 7);
    const more = i + 1 < stages.length;
    put(
      {
        id: `finished:${i}`,
        kind: "stage",
        label: N.labels.stage,
        text: N.finished(stage.title, weeks, more ? stages[i + 1].title : undefined),
        on: finished,
      },
      i
    );
  });

  const here = windows.find((w) => w.status === "current");
  if (here?.pastPace) {
    put({ id: `pace:${here.index}`, kind: "pace", label: N.labels.pace, text: N.pastPace, on: today }, here.index);
  }

  // What she did with her steps, since the plan she is on began.
  for (const [id, d] of Object.entries(steps.decisions)) {
    if (d.on < startedOn) continue;
    const title = stepById(id)?.title;
    if (!title) continue;
    const text =
      d.decision === "completed"
        ? N.completed(title)
        : d.decision === "declined"
          ? N.declined(title)
          : d.decision === "deferred"
            ? N.deferred(title, d.returnsOn ? whenWords(d.returnsOn, today) : undefined)
            : undefined;
    if (text) put({ id: `step:${id}`, kind: "step", label: N.labels.step, text, on: d.on });
  }

  for (const e of events) {
    if ((e.figure !== "artifact" && e.figure !== "outcome") || e.on < startedOn || e.on > today) continue;
    put({ id: `record:${e.id}`, kind: "record", label: N.labels.record, text: N.recorded(e.text), on: e.on });
  }
  for (const a of added) {
    if (a.on < startedOn || a.on > today) continue;
    put({ id: `signal:${a.id}`, kind: "signal", label: N.labels.signal, text: N.added(a.text), on: a.on });
  }

  // Direction and plan changes. A direction change that moved her plan is one note, after the plan it left.
  const edits = choices?.directionEdits ?? [];
  history.forEach((h, i) => {
    const edit = edits.find((e) => e.switched && e.on === h.endedOn);
    afterEarlier[i].push({
      id: `plan:${i}`,
      kind: edit ? "direction" : "plan",
      label: edit ? N.labels.direction : N.labels.plan,
      text: (edit ? N.directionMoved : N.planMoved)(nameOf(h.planId), nameOf(history[i + 1]?.planId ?? planId)),
      on: h.endedOn,
    });
  });
  edits.forEach((e, i) => {
    if (e.switched) return;
    put({ id: `direction:${i}`, kind: "direction", label: N.labels.direction, text: N.directionKept, on: e.on });
  });

  const order = (list: PlanSpark[]) => list.sort((a, b) => (a.on < b.on ? -1 : a.on > b.on ? 1 : 0));
  byStage.forEach(order);
  return { byStage, afterEarlier };
}
