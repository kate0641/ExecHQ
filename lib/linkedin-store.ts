/**
 * The LinkedIn analytics export she has brought: the file's name and where it
 * is (reading, ready, the wrong kind of file, or the steps emailed to her).
 * Kept so it stays across pages: she uploads once and the view of her export
 * is there wherever the Signal Picture is drawn.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the sparks', and undone by the dock's reset with them.
 * The server renders none of it, as does a browser without storage. Only the
 * name is kept: in the prototype the file is never read.
 */

import { useSyncExternalStore } from "react";
import type { LinkedInStatus } from "@/flows/onboarding/shared";

const STORAGE_KEY = "exechq-linkedin-export";

export interface LinkedInExportState {
  fileName: string | null;
  status: LinkedInStatus;
}

const NONE: LinkedInExportState = { fileName: null, status: "none" };

let cached: LinkedInExportState | undefined;
const listeners = new Set<() => void>();

function read(): LinkedInExportState {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<LinkedInExportState> | null;
    if (!parsed || typeof parsed.status !== "string") return NONE;
    return { fileName: typeof parsed.fileName === "string" ? parsed.fileName : null, status: parsed.status };
  } catch {
    return NONE;
  }
}

function get(): LinkedInExportState {
  if (cached === undefined) cached = read();
  return cached;
}

function write(next: LinkedInExportState): void {
  cached = next;
  try {
    if (next.status === "none") window.localStorage.removeItem(STORAGE_KEY);
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

/** Changes it: the new state, or a function of the old one. */
export function setLinkedInExport(next: LinkedInExportState | ((current: LinkedInExportState) => LinkedInExportState)): void {
  write(typeof next === "function" ? next(get()) : next);
}

/** Clears it. The dock's reset calls this. */
export function resetLinkedInExport(): void {
  write(NONE);
}

export function useLinkedInExport(): LinkedInExportState {
  return useSyncExternalStore(subscribe, get, () => NONE);
}
