/**
 * What she has decided about her roadmap: which stage she confirmed, whether
 * she said "Not yet" to moving on, and any plan she switched to, with the
 * plans she left. Kept per scenario, so each of the dock's scenarios keeps its
 * own choices.
 *
 * The stage her work points to comes from the Loop; this is only what she
 * said about it. Nothing here advances a stage: a stage moves when she
 * confirms.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like presence and the Briefing, and undone by the dock's
 * reset with them. The server renders none of it.
 */

import { useSyncExternalStore } from "react";
import type { RoadmapChoices } from "@/components/plan/PlanRoadmap";

export type { RoadmapChoices };

type All = Record<string, RoadmapChoices>;

const STORAGE_KEY = "exechq-plan-roadmap";
const NONE: All = {};

let cached: All | undefined;
const listeners = new Set<() => void>();

function read(): All {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as All) : NONE;
  } catch {
    return NONE;
  }
}

function get(): All {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: All): void {
  cached = next;
  try {
    if (Object.keys(next).length === 0) window.localStorage.removeItem(STORAGE_KEY);
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
  write({ ...get(), [scenario]: choices });
}

/** Undoes every roadmap choice. The dock's reset calls this. */
export function resetRoadmap(): void {
  write(NONE);
}

/** Her choices in this scenario, or undefined if she has made none. */
export function useRoadmapChoices(scenario: string): RoadmapChoices | undefined {
  const all = useSyncExternalStore(subscribe, get, () => NONE);
  return all[scenario];
}

/** Whether she has made any roadmap choice, so the dock's reset knows. */
export function useRoadmapChanged(): boolean {
  return Object.keys(useSyncExternalStore(subscribe, get, () => NONE)).length > 0;
}
