"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { getFlow } from "@/lib/manifest";

export type Viewport = "web" | "tablet" | "mobile";

export const VIEWPORTS: readonly Viewport[] = ["web", "tablet", "mobile"];

export const VIEWPORT_LABELS: Record<Viewport, string> = {
  web: "Web",
  tablet: "Tablet",
  mobile: "Mobile",
};

const STORAGE_KEY = "exechq.viewport";
const DEFAULT_VIEWPORT: Viewport = "web";

function isViewport(value: unknown): value is Viewport {
  return typeof value === "string" && (VIEWPORTS as readonly string[]).includes(value);
}

/* -----------------------------------------------------------------------------
   The selection is held in a tiny external store rather than component state, so
   it can be read synchronously on the client through useSyncExternalStore. React
   renders the server snapshot first and swaps in the stored value after
   hydration, which is what keeps the persisted choice from causing a mismatch.
   -------------------------------------------------------------------------- */

const listeners = new Set<() => void>();
let cached: Viewport | null = null;

function readStoredViewport(): Viewport {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isViewport(stored)) return stored;
  } catch {
    // Private browsing or storage disabled: the default is fine.
  }
  return DEFAULT_VIEWPORT;
}

function getSnapshot(): Viewport {
  if (cached === null) cached = readStoredViewport();
  return cached;
}

function getServerSnapshot(): Viewport {
  return DEFAULT_VIEWPORT;
}

function handleStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  cached = isViewport(event.newValue) ? event.newValue : DEFAULT_VIEWPORT;
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

function writeViewport(next: Viewport) {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

interface ViewportContextValue {
  /** What the user last chose. Kept even while a web-only flow overrides it. */
  selected: Viewport;
  /** What is actually rendered. Always "web" on a web-only flow. */
  viewport: Viewport;
  setViewport: (next: Viewport) => void;
  /** True on flows the manifest marks `webOnly`. */
  locked: boolean;
  /** Why the toggle is locked, for the accessible explanation. */
  lockReason: string | null;
}

const ViewportContext = createContext<ViewportContextValue | null>(null);

/**
 * Holds the viewport selection for the whole prototype.
 *
 * Lives in the root layout so the choice survives navigation, and mirrors to
 * localStorage so it survives a reload.
 *
 * Web-only flows (`webOnly` in the manifest) are locked to web here rather than
 * in the toggle, so every consumer sees the same effective viewport.
 */
export function ViewportProvider({ children }: { children: ReactNode }) {
  const selected = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();

  const flowSlug = pathname.split("/").filter(Boolean)[0];
  const flow = flowSlug ? getFlow(flowSlug) : undefined;
  const locked = Boolean(flow?.webOnly);

  const value = useMemo<ViewportContextValue>(
    () => ({
      selected,
      viewport: locked ? "web" : selected,
      setViewport: writeViewport,
      locked,
      lockReason: locked && flow ? `The ${flow.title} is web only.` : null,
    }),
    [selected, locked, flow]
  );

  return <ViewportContext.Provider value={value}>{children}</ViewportContext.Provider>;
}

export function useViewport(): ViewportContextValue {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error("useViewport must be used inside a ViewportProvider");
  }
  return context;
}
