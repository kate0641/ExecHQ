/**
 * Momentum: her week in motion, as counts: what she did on her plan, in
 * ExecHQ, and on her Signal Picture.
 *
 * Four figures, each a count of real events with the events behind it:
 * completed actions, artifacts created or used, outcomes updated, and signals
 * she added to her Signal Picture herself. A step she declined or deferred is
 * in none of them and is never counted against her.
 *
 * There is no score, rank, percentile or streak, and nothing here says her
 * activity caused a result.
 */

import { isDone } from "@/lib/rings";
import { addDays, type LoopDate, type LoopRecord } from "@/lib/loop";
import { ARTIFACT_KINDS, OUTCOME_OPTIONS } from "@/mock/loop";
import { ACTION_QUEUE, type MomentumFigure } from "@/mock/plan";
import type { TaskCheck } from "@/mock/snapshots";

export interface MomentumEvent {
  id: string;
  figure: MomentumFigure;
  text: string;
  on: LoopDate;
}

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Something she added to her Signal Picture herself: a talk, a post, a mention. */
export interface AddedSignal {
  id: string;
  text: string;
  on: LoopDate;
}

/** Every counted event, oldest first: the Loop's, and the signals she added. */
export function momentumEvents(records: LoopRecord[], tasks?: Record<string, TaskCheck>, signals: AddedSignal[] = []): MomentumEvent[] {
  const out: MomentumEvent[] = [];
  for (const record of records) {
    record.history.forEach((event, i) => {
      const id = `${record.id}:${i}`;
      if (event.type === "drafted") out.push({ id, figure: "artifact", text: `Drafted ${record.name}`, on: event.on });
      if (event.type === "used") {
        out.push({ id, figure: "artifact", text: cap(`${ARTIFACT_KINDS[record.kind].usedVerb} ${record.name}`), on: event.on });
      }
      if (event.type === "outcome" && event.outcome !== "no-longer-relevant") {
        const label = OUTCOME_OPTIONS.find((o) => o.type === event.outcome)?.label ?? "";
        out.push({ id, figure: "outcome", text: `${cap(record.name)}: ${label.toLowerCase()}`, on: event.on });
      }
    });
  }
  // A completed action: its artifact reached used, sent or published, or she
  // said she did a step that has no draft.
  for (const step of ACTION_QUEUE) {
    if (!isDone(step, records, tasks)) continue;
    const record = step.artifactId ? records.find((r) => r.id === step.artifactId) : undefined;
    const on = record?.usedOn ?? record?.outcome?.on ?? tasks?.[step.id]?.doneOn;
    if (on) out.push({ id: `done:${step.id}`, figure: "completed", text: step.title, on });
  }
  for (const signal of signals) out.push({ id: `signal:${signal.id}`, figure: "signal", text: signal.text, on: signal.on });
  return out.sort((a, b) => (a.on < b.on ? -1 : a.on > b.on ? 1 : 0));
}

/** Events in the calendar week that holds today: Sunday through Saturday, so the week is always the same seven days. */
export function inCalendarWeek(events: MomentumEvent[], today: LoopDate): MomentumEvent[] {
  const sinceSunday = new Date(`${today}T00:00:00`).getDay();
  const from = addDays(today, -sinceSunday);
  return events.filter((e) => e.on >= from && e.on <= today);
}
