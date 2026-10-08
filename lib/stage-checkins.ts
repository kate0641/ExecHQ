/**
 * Her check-ins on stages she has finished (Plan Concept 3). ExecHQ decides a
 * stage is finished, from her work; then it asks how the stage went before it
 * builds on it: whether she got what finishing looks like, and how she feels
 * about her plan now. What came of each thing she did is not kept here: it goes
 * on the thing itself, as "What came of it?" does everywhere else.
 *
 * "Later" is kept too, so the check-in stops opening the Plan until she comes
 * back to it. Nothing here scores anything: her answers are kept as she gave them.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the Plan's own, and undone by the dock's reset.
 */

import { useSyncExternalStore } from "react";
import type { LoopDate } from "@/lib/loop";

const STORAGE_KEY = "exechq-stage-checkins";

export type MilestoneAnswer = "yes" | "partly" | "not-yet";
export type StageFeeling = "more-sure" | "same" | "less-sure" | "stuck";

export interface StageCheckIn {
  /** She answered it, or put it off. */
  status: "done" | "later";
  on: LoopDate;
  milestone?: MilestoneAnswer;
  feeling?: StageFeeling;
  /** Anything ExecHQ should know, in her words. */
  words?: string;
}

/** By scenario, then by `<planId>:<stage index>`. */
type All = Record<string, Record<string, StageCheckIn>>;
const EMPTY: All = {};

let cached: All | undefined;
const listeners = new Set<() => void>();

function read(): All {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as All) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function get(): All {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: All): void {
  cached = next;
  try {
    if (Object.keys(next).length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const checkInKey = (planId: string, stage: number) => `${planId}:${stage}`;

/** Saves her check-in on a stage, or that she put it off. */
export function saveCheckIn(scenario: string, key: string, checkIn: StageCheckIn): void {
  const all = get();
  write({ ...all, [scenario]: { ...all[scenario], [key]: checkIn } });
}

/** Every check-in gone. The dock's reset calls this. */
export function resetCheckIns(): void {
  write(EMPTY);
}

/** Her check-ins in this scenario, by `<planId>:<stage index>`. */
export function useCheckIns(scenario: string): Record<string, StageCheckIn> {
  return useSyncExternalStore(subscribe, get, () => EMPTY)[scenario] ?? NONE;
}
const NONE: Record<string, StageCheckIn> = {};
