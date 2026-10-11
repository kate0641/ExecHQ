/**
 * The Daily Briefing's state on her device: which publishers she has chosen,
 * and, for each of today's reads, whether she has read it, saved it, and said
 * whether it was worth her time.
 *
 * `publishers` is null until she chooses them, which is the Briefing's first
 * visit: the picker comes before the first set loads. Every concept reads the
 * same store, so choosing publishers in one carries to the others, and the
 * dock's reset puts the first visit back.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the Briefing's homepage dismissal. The server renders the
 * first visit, as does a browser without storage.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "exechq-briefing";

export type Relevance = "yes" | "no";

export interface ReadState {
  read?: boolean;
  saved?: boolean;
  relevance?: Relevance;
}

export interface BriefingState {
  publishers: readonly string[] | null;
  reads: Readonly<Record<string, ReadState>>;
}

const INITIAL: BriefingState = { publishers: null, reads: {} };

let cached: BriefingState | undefined;
const listeners = new Set<() => void>();

function read(): BriefingState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<BriefingState>;
    return {
      publishers: Array.isArray(parsed.publishers) ? parsed.publishers.filter((id) => typeof id === "string") : null,
      reads: parsed.reads && typeof parsed.reads === "object" ? parsed.reads : {},
    };
  } catch {
    return INITIAL;
  }
}

function get(): BriefingState {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: BriefingState): void {
  cached = next;
  try {
    if (next === INITIAL) window.localStorage.removeItem(STORAGE_KEY);
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

function updateRead(id: string, change: Partial<ReadState>): void {
  const state = get();
  write({ ...state, reads: { ...state.reads, [id]: { ...state.reads[id], ...change } } });
}

export const briefingActions = {
  /** Her publishers, on the first visit or changed later. */
  choosePublishers: (ids: readonly string[]) => write({ ...get(), publishers: [...ids] }),
  /** Opening a read counts as reading it. */
  markRead: (id: string, read = true) => updateRead(id, { read }),
  setSaved: (id: string, saved: boolean) => updateRead(id, { saved }),
  /** Undefined takes the answer back. */
  setRelevance: (id: string, relevance: Relevance | undefined) => updateRead(id, { relevance }),
};

/** Back to the first visit, nothing read. The dock's reset calls this. */
export function resetBriefing(): void {
  write(INITIAL);
}

export function useBriefing(): BriefingState {
  return useSyncExternalStore(subscribe, get, () => INITIAL);
}

/** True when anything has changed: something the dock's reset can undo. */
export function useBriefingChanged(): boolean {
  return useSyncExternalStore(subscribe, get, () => INITIAL) !== INITIAL;
}

/**
 * Where "Write a post about this" goes: Thought Leadership Builder, carrying
 * the read as its source, and the passage when she started from one (Concept
 * C). The hand-off is the one connection between the Briefing and the Toolbox.
 */
export function respondHref(readId: string, from?: "passage" | "selection"): string {
  const params = new URLSearchParams({ source: "briefing", read: readId });
  if (from) params.set("from", from);
  return `/toolbox-flow/concept-1?${params.toString()}`;
}
