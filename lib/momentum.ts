/**
 * Momentum: what she has done on her plan, as counts, read from the Loop.
 *
 * Three figures, each a count of real events with the events behind it:
 * completed actions, artifacts created or used, outcomes updated. A step she
 * declined or deferred is in none of them and is never counted against her.
 *
 * There is no composite score, rank, percentile or streak, and nothing here
 * says her activity caused a result. The 90-day label (Concept A only) is a
 * word, needs the whole window behind it, and uses placeholder thresholds
 * (`MOMENTUM_LABEL_RULE` in `mock/plan.ts`) until D&T define them.
 */

import { isDone } from "@/lib/rings";
import { addDays, type LoopDate, type LoopRecord } from "@/lib/loop";
import { ARTIFACT_KINDS, OUTCOME_OPTIONS } from "@/mock/loop";
import { ACTION_QUEUE, MOMENTUM_LABEL_RULE, type MomentumFigure, type MomentumLabel } from "@/mock/plan";
import type { TaskCheck } from "@/mock/snapshots";

export interface MomentumEvent {
  id: string;
  figure: MomentumFigure;
  text: string;
  on: LoopDate;
}

const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Every counted event the Loop holds, oldest first. */
export function momentumEvents(records: LoopRecord[], tasks?: Record<string, TaskCheck>): MomentumEvent[] {
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
  return out.sort((a, b) => (a.on < b.on ? -1 : a.on > b.on ? 1 : 0));
}

/** Events inside the window ending today, today included. `back` shifts it earlier. */
export function inMomentumWindow(events: MomentumEvent[], today: LoopDate, days: number, back = 0): MomentumEvent[] {
  const end = addDays(today, -back);
  const from = addDays(end, -(days - 1));
  return events.filter((e) => e.on >= from && e.on <= end);
}

/** Events in the calendar week that holds today: Sunday through Saturday, so the week is always the same seven days. */
export function inCalendarWeek(events: MomentumEvent[], today: LoopDate): MomentumEvent[] {
  const sinceSunday = new Date(`${today}T00:00:00`).getDay();
  const from = addDays(today, -sinceSunday);
  return events.filter((e) => e.on >= from && e.on <= today);
}

export const ofFigure = (events: MomentumEvent[], figure: MomentumFigure) => events.filter((e) => e.figure === figure);

/** Her follow-through against the plan, for the window: the steps she took on
 *  and the ones she completed. Declined and deferred steps are not in it. */
export function followThrough(
  records: LoopRecord[],
  tasks: Record<string, TaskCheck> | undefined,
  events: MomentumEvent[],
  today: LoopDate,
  days: number
): { done: number; taken: number; items: MomentumEvent[] } {
  const completed = inMomentumWindow(events, today, days).filter((e) => e.figure === "completed");
  const accepted = ACTION_QUEUE.filter((s) => s.status === "accepted");
  const doneIds = new Set(completed.map((e) => e.id.replace("done:", "")));
  const taken = new Set([...accepted.map((s) => s.id), ...doneIds]);
  return { done: doneIds.size, taken: taken.size, items: completed };
}

/**
 * The 90-day label: the three figures over the last 45 days against the 45
 * before. Only ever called with the whole window behind it.
 */
export function momentumLabel(events: MomentumEvent[], today: LoopDate): MomentumLabel {
  const later = inMomentumWindow(events, today, 45).length;
  const earlier = inMomentumWindow(events, today, 45, 45).length;
  const gap = later - earlier;
  return gap > MOMENTUM_LABEL_RULE.band ? "building" : gap < -MOMENTUM_LABEL_RULE.band ? "attention" : "steady";
}

export interface MomentumWeek {
  /** First and last day of the seven, today included in the latest. */
  from: LoopDate;
  to: LoopDate;
  done: number;
}

/**
 * How steadily she completed actions over the last four weeks: each week is
 * seven days, the latest ending today, and a week counts when it holds at
 * least one completed action. A count of weeks, never a streak, and a quiet
 * week is not framed as a miss.
 */
export function weeklyConsistency(events: MomentumEvent[], today: LoopDate, weeks = 4): { weeks: MomentumWeek[]; active: number } {
  const out: MomentumWeek[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const to = addDays(today, -7 * w);
    const from = addDays(to, -6);
    const done = events.filter((e) => e.figure === "completed" && e.on >= from && e.on <= to).length;
    out.push({ from, to, done });
  }
  return { weeks: out, active: out.filter((w) => w.done > 0).length };
}
