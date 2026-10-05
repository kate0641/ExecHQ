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
import type { Baseline, Current } from "@/lib/presence";
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

/** Adds one, dated `on`. Returns its id. */
export function addPresence(item: Omit<PresenceItem, "id">): string {
  const next = Math.max(0, ...get().map((i) => Number(i.id.replace("added-", "")) || 0)) + 1;
  const id = `added-${next}`;
  write([...get(), { ...item, id }]);
  return id;
}

/** Changes what she added. Only her own entries can change: the prototype's
 *  earlier record is scenario data, not hers to edit. */
export function updatePresence(id: string, patch: Partial<Omit<PresenceItem, "id">>): void {
  write(get().map((item) => (item.id === id ? { ...item, ...patch } : item)));
}

/** Deletes one she added. */
export function removePresence(id: string): void {
  write(get().filter((item) => item.id !== id));
}

/** Takes everything she added away, and the starting point she saved. The
 *  dock's reset calls this. */
export function resetPresence(): void {
  write(NONE);
  writeBaseline(null);
  writeCurrent(null);
}

/* Where she said she is starting from: one record, kept the same way. */

const BASELINE_KEY = "exechq-presence-baseline";
let cachedBaseline: Baseline | null | undefined;
const baselineListeners = new Set<() => void>();

function readBaseline(): Baseline | null {
  try {
    const raw = window.localStorage.getItem(BASELINE_KEY);
    return raw ? (JSON.parse(raw) as Baseline) : null;
  } catch {
    return null;
  }
}

function getBaseline(): Baseline | null {
  if (cachedBaseline === undefined) cachedBaseline = readBaseline();
  return cachedBaseline;
}

function writeBaseline(next: Baseline | null): void {
  cachedBaseline = next;
  try {
    if (next === null) window.localStorage.removeItem(BASELINE_KEY);
    else window.localStorage.setItem(BASELINE_KEY, JSON.stringify(next));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of baselineListeners) listener();
}

function subscribeBaseline(listener: () => void): () => void {
  baselineListeners.add(listener);
  return () => baselineListeners.delete(listener);
}

/** Saves where she is starting from. */
export function saveBaseline(baseline: Baseline): void {
  writeBaseline(baseline);
}

/** Where she said she is starting from, or null if she has not said. */
export function useBaseline(): Baseline | null {
  return useSyncExternalStore(subscribeBaseline, getBaseline, () => null);
}

/** What she has added, oldest first. */
export function useAddedPresence(): readonly PresenceItem[] {
  return useSyncExternalStore(subscribe, get, () => NONE);
}

/* Where she says she is now: one record, kept the same way, saved over the
   last one each time she updates it. */

const CURRENT_KEY = "exechq-presence-current";
let cachedCurrent: Current | null | undefined;
const currentListeners = new Set<() => void>();

function readCurrent(): Current | null {
  try {
    const raw = window.localStorage.getItem(CURRENT_KEY);
    return raw ? (JSON.parse(raw) as Current) : null;
  } catch {
    return null;
  }
}

function getCurrent(): Current | null {
  if (cachedCurrent === undefined) cachedCurrent = readCurrent();
  return cachedCurrent;
}

function writeCurrent(next: Current | null): void {
  cachedCurrent = next;
  try {
    if (next === null) window.localStorage.removeItem(CURRENT_KEY);
    else window.localStorage.setItem(CURRENT_KEY, JSON.stringify(next));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of currentListeners) listener();
}

function subscribeCurrent(listener: () => void): () => void {
  currentListeners.add(listener);
  return () => currentListeners.delete(listener);
}

/** Saves where she is now, as of `on`. Her starting point does not change. */
export function saveCurrent(current: Current): void {
  writeCurrent(current);
}

/** Where she last said she is now, or null if she has not updated it. */
export function useCurrent(): Current | null {
  return useSyncExternalStore(subscribeCurrent, getCurrent, () => null);
}
