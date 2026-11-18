"use client";

/**
 * The colour switch: greyscale or the brand palette.
 *
 * The prototype opens in greyscale so a reviewer judges structure and hierarchy
 * before colour. The dock's switch turns the brand colours on; the choice is
 * remembered like the viewport (`exechq.color` in localStorage), and "off" is
 * the default.
 *
 * The mode is applied as `data-color` on <html>, because the semantic tokens
 * resolve there (see the greyscale block in styles/tokens.css). An inline script
 * in the root layout sets it before first paint so there is no flash; this
 * module keeps it in step afterwards.
 *
 * The hub and the showroom are the design team's own pages, and the design
 * system page draws the brand palette itself, so they always show colour and
 * the switch is locked there. A lock never overwrites the choice.
 */

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

export type ColorMode = "on" | "off";

const STORAGE_KEY = "exechq.color";
const DEFAULT_MODE: ColorMode = "off";

/** The prototype's own pages. Keep in step with the inline script in
 *  `app/layout.tsx`, which makes the same decision before first paint. */
export function isOwnPage(pathname: string): boolean {
  return pathname === "/" || pathname === "/showroom" || pathname.startsWith("/showroom/");
}

const listeners = new Set<() => void>();
let cached: ColorMode | null = null;

function readStoredMode(): ColorMode {
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === "on") return "on";
  } catch {
    // Storage disabled: the default is fine.
  }
  return DEFAULT_MODE;
}

function getSnapshot(): ColorMode {
  if (cached === null) cached = readStoredMode();
  return cached;
}

function getServerSnapshot(): ColorMode {
  return DEFAULT_MODE;
}

function handleStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  cached = event.newValue === "on" ? "on" : DEFAULT_MODE;
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

export function setColorMode(next: ColorMode): void {
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

export interface ColorModeValue {
  /** What the reviewer last chose. Kept while a lock overrides it. */
  selected: ColorMode;
  /** What is actually showing. Always "on" on the prototype's own pages. */
  mode: ColorMode;
  /** True on the hub and the showroom, which always show colour. */
  locked: boolean;
}

/**
 * Reads the colour mode and keeps `data-color` on <html> in step with it.
 * Call it once, from the shell; the dock's switch reads it through the same hook.
 */
export function useColorMode(): ColorModeValue {
  const selected = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const pathname = usePathname();
  const locked = isOwnPage(pathname);
  const mode: ColorMode = locked ? "on" : selected;

  useEffect(() => {
    document.documentElement.dataset.color = mode;
  }, [mode]);

  return useMemo(() => ({ selected, mode, locked }), [selected, mode, locked]);
}
