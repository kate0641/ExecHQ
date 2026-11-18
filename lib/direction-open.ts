/**
 * Whether her direction is open above the road on Plan Concept 3. It starts
 * closed; opening it is remembered on her device until she closes it again.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the Briefing's, and undone by the dock's reset. The
 * server always renders it closed, as does a browser without storage.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "exechq-direction-open";

let cached: boolean | undefined;
const listeners = new Set<() => void>();

function read(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function get(): boolean {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: boolean): void {
  cached = next;
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, "1");
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

/** Opens her direction, or closes it again. */
export function setDirectionOpen(open: boolean): void {
  write(open);
}

/** Closes it. The dock's reset calls this. */
export function closeDirection(): void {
  write(false);
}

/** True when she has opened her direction. */
export function useDirectionOpen(): boolean {
  return useSyncExternalStore(subscribe, get, () => false);
}
