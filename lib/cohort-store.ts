"use client";

/**
 * Which cohort the enterprise pages show: none yet, below the minimum, the
 * pilot, or the December demo (`mock/enterprise.ts`). Picked from the dock,
 * kept in localStorage, and shared by every enterprise concept so a reviewer
 * compares them on the same cohort.
 */

import { useSyncExternalStore } from "react";
import { COHORT_IDS, DEFAULT_COHORT, type CohortId } from "@/mock/enterprise";

const STORAGE_KEY = "exechq.cohort";
/** Bumped whenever the stored shape changes, so an old save is dropped. */
const STORAGE_VERSION = 1;

const listeners = new Set<() => void>();
let cached: CohortId | undefined;

function isCohortId(value: unknown): value is CohortId {
  return typeof value === "string" && (COHORT_IDS as readonly string[]).includes(value);
}

function parse(raw: string | null): CohortId {
  if (!raw) return DEFAULT_COHORT;
  try {
    const parsed = JSON.parse(raw) as { version?: number; cohort?: unknown };
    return parsed.version === STORAGE_VERSION && isCohortId(parsed.cohort) ? parsed.cohort : DEFAULT_COHORT;
  } catch {
    return DEFAULT_COHORT;
  }
}

function getSnapshot(): CohortId {
  if (cached === undefined) {
    try {
      cached = parse(window.localStorage.getItem(STORAGE_KEY));
    } catch {
      cached = DEFAULT_COHORT;
    }
  }
  return cached;
}

function getServerSnapshot(): CohortId {
  return DEFAULT_COHORT;
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

export function selectCohort(cohort: CohortId): void {
  cached = cohort;
  try {
    if (cohort === DEFAULT_COHORT) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, cohort }));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

/** The cohort the enterprise pages show now. */
export function useCohortId(): CohortId {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
