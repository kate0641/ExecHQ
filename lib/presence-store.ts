/**
 * What she has added herself on the homepage: a podcast, a press mention, a
 * talk or a piece. Added through the add sheet, dated the day of the snapshot
 * she was looking at, and counted with the rest from then on.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the Briefing's, and undone by the dock's reset with it.
 * The server renders none of it, as does a browser without storage.
 */

import { useSyncExternalStore } from "react";
import type { PresenceItem } from "@/mock/accounts-stub";

const STORAGE_KEY = "exechq-presence-added";
const NONE: readonly PresenceItem[] = [];

let cached: readonly PresenceItem[] | undefined;
const listeners = new Set<() => void>();

function read(): readonly PresenceItem[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as PresenceItem[]) : NONE;
  } catch {
    return NONE;
  }
}

function get(): readonly PresenceItem[] {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: readonly PresenceItem[]): void {
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

/** Adds one, dated `on`. */
export function addPresence(item: Omit<PresenceItem, "id">): void {
  write([...get(), { ...item, id: `added-${get().length + 1}` }]);
}

/** Takes everything she added away. The dock's reset calls this. */
export function resetPresence(): void {
  write(NONE);
}

/** What she has added, oldest first. */
export function useAddedPresence(): readonly PresenceItem[] {
  return useSyncExternalStore(subscribe, get, () => NONE);
}
