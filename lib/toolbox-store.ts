/**
 * What the Toolbox keeps about the drafts she makes, beside their Loop
 * records: every version, her edits and answers, where the draft came from,
 * and the library's details (plan area, the step it serves, a first line).
 * The Loop record itself lives in the Loop (`loopActions.create`), so status
 * is told in one place.
 *
 * Also which Toolbox concept the reviewer last opened, and which tool flow
 * concept, so the Toolbox's tools, the Briefing's "Write a post about this"
 * and the next step after an outcome land in the flow she is reviewing
 * (Concept 2 until one is opened).
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

/** The Toolbox pages there are. Concept 3 was scratched on 13 October and
 *  Concept 1 on 14 October (its next step and finding a tool went into
 *  Concept 2); every tool flow concept goes back to Concept 2. */
export type ToolboxPage = "concept-2";
const TOOLBOX_PAGES: readonly string[] = ["concept-2"] satisfies ToolboxPage[];

/** The Toolbox page a tool flow concept goes back to. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const toolboxPageFor = (concept: string): ToolboxPage => "concept-2";

/** The tool flow concepts there are. */
export type ToolFlowPage = "concept-1" | "concept-2" | "concept-3";
const TOOL_FLOW_PAGES: readonly string[] = ["concept-1", "concept-2", "concept-3"] satisfies ToolFlowPage[];

export interface ToolboxState {
  drafts: Readonly<Record<string, DraftState>>;
  /** The Toolbox concept last opened. */
  concept?: ToolboxPage;
  /** The tool flow concept last opened (from the hub, say). */
  flow?: ToolFlowPage;
}

/** The tool flow concept a tool opens in: the one last opened, or Concept 2. */
export const flowFor = (state: ToolboxState): ToolFlowPage => state.flow ?? "concept-2";

const INITIAL: ToolboxState = { drafts: {} };

let cached: ToolboxState | undefined;
const listeners = new Set<() => void>();

function read(): ToolboxState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    const parsed = JSON.parse(raw) as Partial<ToolboxState>;
    return {
      drafts: parsed.drafts && typeof parsed.drafts === "object" ? parsed.drafts : {},
      concept: TOOLBOX_PAGES.includes(parsed.concept ?? "") ? parsed.concept : undefined,
      flow: TOOL_FLOW_PAGES.includes(parsed.flow ?? "") ? parsed.flow : undefined,
    };
  } catch {
    return INITIAL;
  }
}

/** The store as it stands, outside React (the advisor reads it fresh). */
export function toolboxNow(): ToolboxState {
  return get();
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
  /** Its first line in the library, when the part it shows changes. */
  setPreview: (id: string, preview: string) => updateDraft(id, (d) => ({ meta: { ...d.meta, preview } })),
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
  openConcept: (concept: ToolboxPage) => {
    const state = get();
    if (state.concept !== concept) write({ ...state, concept });
  },
  /** The reviewer opened this tool flow concept. */
  openFlow: (flow: ToolFlowPage) => {
    const state = get();
    if (state.flow !== flow) write({ ...state, flow });
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
