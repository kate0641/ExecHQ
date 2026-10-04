/**
 * The roadmap's windows: when each stage is suggested to run.
 *
 * A suggested pace, never a deadline. Stage one starts the day the plan began,
 * and each later stage starts the day after the one before it ends, so finishing
 * a stage early pulls every later window earlier and finishing late pushes them
 * later. Nothing here locks, expires or counts against her.
 */

import { addDays, daysBetween, shortDate, type LoopDate } from "@/lib/loop";
import type { RoadmapStep } from "@/mock/plan";

export type StageStatus = "done" | "current" | "recommended" | "later";

export interface StageWindow {
  index: number;
  title: string;
  start: LoopDate;
  end: LoopDate;
  /** Weeks the window spans, as suggested or as it turned out. */
  weeks: number;
  status: StageStatus;
  /** The stage she is in has run past the suggested pace. Said plainly, never as a failing. */
  pastPace: boolean;
}

export function stageWindows(input: {
  stages: Pick<RoadmapStep, "title" | "weeks">[];
  startedOn: LoopDate;
  /** The stage she is in, from 0. */
  current: number;
  /** The day she finished each stage she has finished. */
  finishedOn?: Record<number, LoopDate>;
  /** A stage recommended next, waiting for her to start it. */
  recommended?: number | null;
  today: LoopDate;
}): StageWindow[] {
  const { stages, startedOn, current, finishedOn = {}, recommended = null, today } = input;
  const out: StageWindow[] = [];
  stages.forEach((stage, index) => {
    const start = index === 0 ? startedOn : addDays(out[index - 1].end, 1);
    const planned = addDays(start, stage.weeks * 7 - 1);
    const finished = finishedOn[index];
    // A stage she finished ends the day she said so, and never before it began.
    const end = finished ? (finished < start ? start : finished) : planned;
    const status: StageStatus =
      index < current ? "done" : index === current ? "current" : index === recommended ? "recommended" : "later";
    out.push({
      index,
      title: stage.title,
      start,
      end,
      weeks: Math.max(1, Math.round((daysBetween(start, end) + 1) / 7)),
      status,
      pastPace: status === "current" && today > planned,
    });
  });
  return out;
}

/** The stage a day falls in, or -1 when it is outside every window. */
export function stageAt(windows: StageWindow[], date: LoopDate): number {
  return windows.find((w) => date >= w.start && date <= w.end)?.index ?? -1;
}

/** "5 Oct – 1 Nov". */
export function periodLabel(w: Pick<StageWindow, "start" | "end">): string {
  return `${shortDate(w.start)} – ${shortDate(w.end)}`;
}

/** Whole weeks from the first window's start to the last window's end. */
export function totalWeeks(windows: StageWindow[]): number {
  if (!windows.length) return 0;
  return Math.max(1, Math.round((daysBetween(windows[0].start, windows[windows.length - 1].end) + 1) / 7));
}
