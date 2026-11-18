"use client";

/**
 * Which cohort the enterprise pages show: none yet, below the minimum, the
 * pilot, or the December demo (`mock/enterprise.ts`), and whether today's
 * update is late. Picked from the dock, kept in localStorage, and
 * shared by every enterprise concept so a reviewer compares them on the same
 * cohort.
 */

import { useSyncExternalStore } from "react";
import { COHORT_IDS, DEFAULT_COHORT, type CohortId } from "@/mock/enterprise";

const STORAGE_KEY = "exechq.cohort";
/** Bumped whenever the stored shape changes, so an old save is dropped. */
const STORAGE_VERSION = 2;

interface CohortChoice {
  cohort: CohortId;
  /** Today's update has not arrived: every page shows yesterday's. */
  late: boolean;
}

const DEFAULT_CHOICE: CohortChoice = { cohort: DEFAULT_COHORT, late: false };

const listeners = new Set<() => void>();
let cached: CohortChoice | undefined;

function isCohortId(value: unknown): value is CohortId {
  return typeof value === "string" && (COHORT_IDS as readonly string[]).includes(value);
}

function parse(raw: string | null): CohortChoice {
  if (!raw) return DEFAULT_CHOICE;
  try {
    const parsed = JSON.parse(raw) as { version?: number; cohort?: unknown; late?: unknown };
    if (parsed.version !== STORAGE_VERSION || !isCohortId(parsed.cohort)) return DEFAULT_CHOICE;
    return { cohort: parsed.cohort, late: parsed.late === true };
  } catch {
    return DEFAULT_CHOICE;
  }
}

function getSnapshot(): CohortChoice {
  if (cached === undefined) {
    try {
      cached = parse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      cached = DEFAULT_CHOICE;
    }
  }
  return cached;
}

function getServerSnapshot(): CohortChoice {
  return DEFAULT_CHOICE;
}

function handleStorage(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY) return;
  cached = parse(event.newValue);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
}

function save(next: CohortChoice): void {
  cached = next;
  try {
    if (next.cohort === DEFAULT_CHOICE.cohort && next.late === DEFAULT_CHOICE.late) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, ...next }));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

export function selectCohort(cohort: CohortId): void {
  save({ ...getSnapshot(), cohort });
}

export function setUpdateLate(late: boolean): void {
  save({ ...getSnapshot(), late });
}

/** The cohort the enterprise pages show now. */
export function useCohortId(): CohortId {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).cohort;
}

/** Whether today's update is late. */
export function useUpdateLate(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot).late;
}
