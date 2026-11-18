/**
 * Whether today's Briefing has been closed at the top of the homepage
 * (Homepage Concept 2). Closing it lasts for that day only: the stored value
 * is the date it was closed, so the next day's Briefing appears again.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the Loop, and undone by the dock's reset with it. The
 * server always renders the Briefing, as does a browser without storage.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "exechq-briefing-closed";

let cached: string | null | undefined;
const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function get(): string | null {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: string | null): void {
  cached = next;
  try {
    if (next === null) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Closes the Briefing for `today`. */
export function closeBriefing(today: string): void {
  write(today);
}

/** Brings it back, whatever day it was closed. The dock's reset calls this. */
export function reopenBriefing(): void {
  write(null);
}

/** True when the Briefing is closed on any day: something the dock's reset
 *  can undo. */
export function useBriefingEverClosed(): boolean {
  return useSyncExternalStore(subscribe, get, () => null) !== null;
}

/** True when the Briefing was closed on `today`. */
export function useBriefingClosed(today: string): boolean {
  const closedOn = useSyncExternalStore(subscribe, get, () => null);
  return closedOn === today;
}
