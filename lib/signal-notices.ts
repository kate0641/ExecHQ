/**
 * What she has seen of the signals ExecHQ added for her, and which of those
 * she has hidden because they were not right.
 *
 * `noticed` clears the small dot on the navigation once she has been to the
 * Signal Picture. It does not dismiss the note on the page: that is the
 * spark's own dismissal. `hidden` takes a recorded signal out of her picture
 * altogether, for when the system got it wrong.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the sparks', and undone by the dock's reset with them.
 * The server renders neither, as does a browser without storage.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "exechq-signal-notices";

export interface SignalNotices {
  noticed: readonly string[];
  hidden: readonly string[];
}

const NONE: SignalNotices = { noticed: [], hidden: [] };

let cached: SignalNotices | undefined;
const listeners = new Set<() => void>();

function read(): SignalNotices {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return NONE;
    const ids = (value: unknown): string[] => (Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []);
    const { noticed, hidden } = parsed as Record<string, unknown>;
    return { noticed: ids(noticed), hidden: ids(hidden) };
  } catch {
    return NONE;
  }
}

function get(): SignalNotices {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: SignalNotices): void {
  cached = next;
  try {
    if (next.noticed.length === 0 && next.hidden.length === 0) window.localStorage.removeItem(STORAGE_KEY);
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

/** She has been to the Signal Picture and seen these. */
export function markNoticed(ids: readonly string[]): void {
  const fresh = ids.filter((id) => !get().noticed.includes(id));
  if (fresh.length) write({ ...get(), noticed: [...get().noticed, ...fresh] });
}

/** Takes a recorded signal out of her picture. */
export function hideSignal(id: string): void {
  if (!get().hidden.includes(id)) write({ ...get(), hidden: [...get().hidden, id] });
}

/** Brings everything back. The dock's reset calls this. */
export function resetSignalNotices(): void {
  write(NONE);
}

export function useSignalNotices(): SignalNotices {
  return useSyncExternalStore(subscribe, get, () => NONE);
}
