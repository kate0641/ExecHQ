/**
 * Which Momentum concept a reviewer is looking at, and two switches for the
 * test. Prototype scaffolding, not product: Concept A and Concept B are shown
 * one at a time on the Plan so reviewers choose between them, and the
 * switches show what a three-week pilot cannot (a 90-day history, and the
 * softer wording for the label).
 *
 * A tiny external store read through useSyncExternalStore and mirrored to
 * localStorage, like the viewport and the navigation choice.
 */

import { useSyncExternalStore } from "react";
import type { LabelWording } from "@/mock/plan";

export interface MomentumChoice {
  concept: "a" | "b";
  wording: LabelWording;
  /** Show the Plan as if she had ninety-five days of history. */
  longHistory: boolean;
}

const STORAGE_KEY = "exechq.momentum-choice";
const DEFAULT: MomentumChoice = { concept: "a", wording: "candid", longHistory: false };

const listeners = new Set<() => void>();
let cached: MomentumChoice | undefined;

function read(): MomentumChoice {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<MomentumChoice> | null;
    return {
      concept: parsed?.concept === "b" ? "b" : "a",
      wording: parsed?.wording === "soft" ? "soft" : "candid",
      longHistory: parsed?.longHistory === true,
    };
  } catch {
    return DEFAULT;
  }
}

function get(): MomentumChoice {
  if (cached === undefined) cached = read();
  return cached;
}

export function setMomentumChoice(patch: Partial<MomentumChoice>): void {
  cached = { ...get(), ...patch };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // Not being able to persist is not worth failing over.
  }
  for (const listener of listeners) listener();
}

export function useMomentumChoice(): MomentumChoice {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    get,
    () => DEFAULT
  );
}
