/**
 * Which navigation concept wraps the signed-in pages.
 *
 * The navigation flow's concepts are each reviewed on the homepage (its
 * `navCanvas` in the manifest), but a reviewer who follows a link from there
 * to Profile or Plan should keep seeing the navigation they were judging. So
 * the choice is held here, like the viewport: a tiny external store read
 * through useSyncExternalStore and mirrored to localStorage.
 *
 * Opening a navigation concept's page makes it the choice; so does picking one
 * in the dock.
 */

import { useSyncExternalStore } from "react";
import { getFlow } from "@/lib/manifest";

export const NAVIGATION_FLOW = "navigation";

const STORAGE_KEY = "exechq.nav-concept";

/** The navigation concepts, as the manifest declares them. */
export const NAV_CONCEPTS: readonly { slug: string; title: string }[] =
  getFlow(NAVIGATION_FLOW)?.concepts.map(({ slug, title }) => ({ slug, title })) ?? [];

const DEFAULT_NAV = NAV_CONCEPTS[0]?.slug ?? "concept-1";

const listeners = new Set<() => void>();
let cached: string | undefined;

function isNavConcept(value: unknown): value is string {
  return typeof value === "string" && NAV_CONCEPTS.some((c) => c.slug === value);
}

function read(): string {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isNavConcept(stored)) return stored;
  } catch {
    // Storage disabled: the default is fine.
  }
  return DEFAULT_NAV;
}

function getSnapshot(): string {
  if (cached === undefined) cached = read();
  return cached;
}

function getServerSnapshot(): string {
  return DEFAULT_NAV;
}

function handleStorage(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY) return;
  cached = isNavConcept(event.newValue) ? event.newValue : DEFAULT_NAV;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorage);
  };
}

export function setNavChoice(next: string): void {
  if (!isNavConcept(next) || next === getSnapshot()) return;
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

/** The navigation concept the reviewer last chose. */
export function useNavChoice(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
