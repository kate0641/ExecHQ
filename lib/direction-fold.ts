/**
 * Whether her direction is folded away at the head of the road on Plan
 * Concept 3. Folding it is remembered on her device until she opens it again.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the Briefing's, and undone by the dock's reset. The
 * server always renders it open, as does a browser without storage.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "exechq-direction-folded";

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

/** Folds her direction away, or opens it again. */
export function setDirectionFolded(folded: boolean): void {
  write(folded);
}

/** Opens it again. The dock's reset calls this. */
export function unfoldDirection(): void {
  write(false);
}

/** True when she has folded her direction away. */
export function useDirectionFolded(): boolean {
  return useSyncExternalStore(subscribe, get, () => false);
}
