/**
 * What the Toolbox keeps about the drafts she makes, beside their Loop
 * records: every version, her edits and answers, where the draft came from,
 * and the library's details (plan area, the step it serves, a first line).
 * The Loop record itself lives in the Loop (`loopActions.create`), so status
 * is told in one place.
 *
 * Also which Toolbox concept the reviewer last opened, so the Briefing's
 * "Write a post about this" lands in it (Concept 1 until one is opened).
 *
 * An external store mirrored to localStorage, like the Briefing's, and undone
 * by the dock's reset.
 */

import { useSyncExternalStore } from "react";
import type { ArtifactMeta, DraftVersion } from "@/mock/toolbox";

const STORAGE_KEY = "exechq-toolbox";

export interface DraftState {
  meta: ArtifactMeta;
  versions: DraftVersion[];
  /** The version showing. */
  showing: number;
  /** Sections she rewrote, by version then section id. */
  edits: Record<number, Record<string, string>>;
  answers: Record<string, string>;
  /** What she typed into the inputs, by input id. */
  inputs: Record<string, string>;
  /** The passage she started from, when she started from one. */
  passage?: string;
}

export interface ToolboxState {
  drafts: Readonly<Record<string, DraftState>>;
  /** The Toolbox concept last opened: "concept-1" to "concept-3". */
  concept?: string;
}

const INITIAL: ToolboxState = { drafts: {} };

let cached: ToolboxState | undefined;
const listeners = new Set<() => void>();

function read(): ToolboxState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<ToolboxState>;
    return { drafts: parsed.drafts && typeof parsed.drafts === "object" ? parsed.drafts : {}, concept: parsed.concept };
  } catch {
    return INITIAL;
  }
}

function get(): ToolboxState {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: ToolboxState): void {
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

function updateDraft(id: string, change: (draft: DraftState) => Partial<DraftState>): void {
  const state = get();
  const draft = state.drafts[id];
  if (!draft) return;
  write({ ...state, drafts: { ...state.drafts, [id]: { ...draft, ...change(draft) } } });
}

export const toolboxActions = {
  /** A first draft exists: keep it, with what made it. */
  saveDraft: (id: string, draft: DraftState) => {
    const state = get();
    write({ ...state, drafts: { ...state.drafts, [id]: draft } });
  },
  /** A revision, or a version brought back: always a new version. A version
   *  brought back keeps the edits she had made to it. */
  addVersion: (id: string, version: Omit<DraftVersion, "n">, edits?: Record<string, string>) =>
    updateDraft(id, (d) => {
      const n = d.versions.length + 1;
      return {
        versions: [...d.versions, { ...version, n }],
        showing: n,
        meta: { ...d.meta, versions: n },
        edits: edits ? { ...d.edits, [n]: edits } : d.edits,
      };
    }),
  show: (id: string, n: number) => updateDraft(id, () => ({ showing: n })),
  editSection: (id: string, section: string, text: string) =>
    updateDraft(id, (d) => ({ edits: { ...d.edits, [d.showing]: { ...d.edits[d.showing], [section]: text } } })),
  answer: (id: string, question: string, text: string) =>
    updateDraft(id, (d) => ({ answers: { ...d.answers, [question]: text } })),
  setInput: (id: string, input: string, value: string) =>
    updateDraft(id, (d) => ({ inputs: { ...d.inputs, [input]: value } })),
  remove: (id: string) => {
    const state = get();
    const rest = { ...state.drafts };
    delete rest[id];
    write({ ...state, drafts: rest });
  },
  /** The reviewer opened this Toolbox concept. */
  openConcept: (concept: string) => {
    const state = get();
    if (state.concept !== concept) write({ ...state, concept });
  },
};

/** Back to nothing made in the Toolbox. The dock's reset calls this. */
export function resetToolbox(): void {
  write(INITIAL);
}

export function useToolbox(): ToolboxState {
  return useSyncExternalStore(subscribe, get, () => INITIAL);
}

/** True when there is something the dock's reset can undo. Opening a concept
 *  alone does not count: it changes nothing she made. */
export function useToolboxChanged(): boolean {
  return Object.keys(useToolbox().drafts).length > 0;
}

/** The library's details for every draft made here, by record id. */
export function draftMeta(state: ToolboxState): Record<string, ArtifactMeta> {
  return Object.fromEntries(Object.entries(state.drafts).map(([id, d]) => [id, d.meta]));
}
