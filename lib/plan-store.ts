/**
 * What she has decided on the Plan, kept per scenario so each of the dock's
 * scenarios keeps its own choices and they survive leaving the page:
 *
 *  - the roadmap: the stage she confirmed, whether she said "Not yet" to
 *    moving on, and any plan she switched to, with the plans she left;
 *  - the next steps: what she accepted, declined, deferred, changed or did,
 *    the channels she asked not to see, and what filled each place.
 *
 * What her work points to comes from the Loop; this is only what she said
 * about it. Nothing here advances a stage or counts a decline against her.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like presence and the Briefing, and undone by the dock's
 * reset with them. The server renders none of it.
 */

import { useSyncExternalStore } from "react";
import type { RoadmapChoices } from "@/components/plan/PlanRoadmap";
import type { SavedSteps } from "@/components/plan/ActionSteps";
import { CALENDAR_SEED, type CalendarItem } from "@/mock/plan";

export type { RoadmapChoices, SavedSteps };

interface Store {
  roadmap: Record<string, RoadmapChoices>;
  steps: Record<string, SavedSteps>;
  /** What she put on her own calendar, per scenario. */
  calendar: Record<string, CalendarItem[]>;
}

const STORAGE_KEY = "exechq-plan";
const EMPTY: Store = { roadmap: {}, steps: {}, calendar: {} };

let cached: Store | undefined;
const listeners = new Set<() => void>();

function read(): Store {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Store> | null;
    return parsed && typeof parsed === "object"
      ? { roadmap: parsed.roadmap ?? {}, steps: parsed.steps ?? {}, calendar: parsed.calendar ?? {} }
      : EMPTY;
  } catch {
    return EMPTY;
  }
}

function get(): Store {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: Store): void {
  cached = next;
  try {
    if (Object.keys(next.roadmap).length + Object.keys(next.steps).length + Object.keys(next.calendar).length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function saveRoadmap(scenario: string, choices: RoadmapChoices): void {
  write({ ...get(), roadmap: { ...get().roadmap, [scenario]: choices } });
}

export function saveCalendar(scenario: string, items: CalendarItem[]): void {
  write({ ...get(), calendar: { ...get().calendar, [scenario]: items } });
}

export function saveSteps(key: string, steps: SavedSteps): void {
  write({ ...get(), steps: { ...get().steps, [key]: steps } });
}

/** Undoes every choice on the Plan. The dock's reset calls this. */
export function resetRoadmap(): void {
  write(EMPTY);
}

/** Her roadmap choices in this scenario, or undefined if she has made none. */
export function useRoadmapChoices(scenario: string): RoadmapChoices | undefined {
  return useSyncExternalStore(subscribe, get, () => EMPTY).roadmap[scenario];
}

/** Her calendar in this scenario: what she kept, or the two things she started with. */
export function useCalendar(scenario: string): CalendarItem[] {
  return useSyncExternalStore(subscribe, get, () => EMPTY).calendar[scenario] ?? CALENDAR_SEED;
}

/** Her saved next steps for this scenario and plan, or undefined. */
export function useSavedSteps(key: string): SavedSteps | undefined {
  return useSyncExternalStore(subscribe, get, () => EMPTY).steps[key];
}

/** Whether she has made any choice on the Plan, so the dock's reset knows. */
export function useRoadmapChanged(): boolean {
  const all = useSyncExternalStore(subscribe, get, () => EMPTY);
  return Object.keys(all.roadmap).length + Object.keys(all.steps).length + Object.keys(all.calendar).length > 0;
}
