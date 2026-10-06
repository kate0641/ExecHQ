/**
 * Which layout of the Concept 2 roadmap a reviewer is looking at. Prototype scaffolding, not
 * product: Headings and Stack are shown one at a time so reviewers choose between them, and the
 * one not chosen is deleted. A tiny external store read through useSyncExternalStore and
 * mirrored to localStorage, like the Momentum choice.
 */

import { useSyncExternalStore } from "react";

export type AgendaLayout = "headings" | "stack";

const STORAGE_KEY = "exechq.agenda-layout";
const DEFAULT: AgendaLayout = "headings";

const listeners = new Set<() => void>();
let cached: AgendaLayout | undefined;

function read(): AgendaLayout {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "stack" ? "stack" : "headings";
  } catch {
    return DEFAULT;
  }
}

function get(): AgendaLayout {
  if (cached === undefined) cached = read();
  return cached;
}

export function setAgendaLayout(next: AgendaLayout): void {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

export function useAgendaLayout(): AgendaLayout {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get,
    () => DEFAULT
  );
}
