/**
 * Which sparks (the small notes on the homepage when something has moved)
 * she has dismissed. A dismissed spark stays dismissed: its id is kept, so
 * the same news never comes back, and only something new can appear.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the Briefing's, and undone by the dock's reset with it.
 * The server always renders every spark, as does a browser without storage.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "exechq-sparks-dismissed";
const NONE: readonly string[] = [];

let cached: readonly string[] | undefined;
const listeners = new Set<() => void>();

function read(): readonly string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : NONE;
  } catch {
    return NONE;
  }
}

function get(): readonly string[] {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: readonly string[]): void {
  cached = next;
  try {
    if (next.length === 0) window.localStorage.removeItem(STORAGE_KEY);
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

/** Dismisses one spark for good. */
export function dismissSpark(id: string): void {
  if (!get().includes(id)) write([...get(), id]);
}

/** Brings every spark back. The dock's reset calls this. */
export function reopenSparks(): void {
  write(NONE);
}

/** The ids she has dismissed. */
export function useDismissedSparks(): readonly string[] {
  return useSyncExternalStore(subscribe, get, () => NONE);
}
