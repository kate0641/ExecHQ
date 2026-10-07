/**
 * How much she can take on right now, and whether to hold it there. Her own
 * setting, not a scenario: it is remembered between visits and across the
 * homepage states, and only the dock's reset puts it back.
 *
 * Light is three live steps, steady four, full five. Five is the most there is
 * ever, whatever she says. "Hold my workload" means nothing new is offered
 * until she lifts it. Neither is ever counted against her.
 *
 * An external store read through useSyncExternalStore and mirrored to
 * localStorage, like the others. The server renders the default.
 */

import { useSyncExternalStore } from "react";
import type { CapacityLevel } from "@/mock/plan";

export interface Capacity {
  level: CapacityLevel;
  hold: boolean;
}

const STORAGE_KEY = "exechq-capacity";
const DEFAULT: Capacity = { level: "steady", hold: false };

let cached: Capacity | undefined;
const listeners = new Set<() => void>();

function read(): Capacity {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Capacity> | null;
    return {
      level: parsed?.level === "light" || parsed?.level === "full" ? parsed.level : "steady",
      hold: parsed?.hold === true,
    };
  } catch {
    return DEFAULT;
  }
}

function get(): Capacity {
  if (cached === undefined) cached = read();
  return cached;
}

export function setCapacity(patch: Partial<Capacity>): void {
  cached = { ...get(), ...patch };
  try {
    if (cached.level === DEFAULT.level && cached.hold === DEFAULT.hold) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

/** Back to steady and not holding. The dock's reset calls this. */
export function resetCapacity(): void {
  setCapacity({ ...DEFAULT });
}

export function useCapacity(): Capacity {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get,
    () => DEFAULT
  );
}
