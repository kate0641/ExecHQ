/**
 * How much history a reviewer is looking at, and the wording for the
 * test. Prototype scaffolding, not product: it shows what a three-week pilot
 * cannot (the 30-day and 90-day views, and the softer wording for the label).
 *
 * A tiny external store read through useSyncExternalStore and mirrored to
 * localStorage, like the viewport and the navigation choice.
 */

import { useSyncExternalStore } from "react";
import type { LabelWording } from "@/mock/plan";

export interface MomentumChoice {
  wording: LabelWording;
  /** How much history to show the Plan with: what she really has, or as if
   *  she had five weeks (the 30-day view) or ninety-five days (the label). */
  history: "actual" | "thirty" | "ninety";
}

const STORAGE_KEY = "exechq.momentum-choice";
const DEFAULT: MomentumChoice = { wording: "candid", history: "actual" };

const listeners = new Set<() => void>();
let cached: MomentumChoice | undefined;

function read(): MomentumChoice {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as
      | (Partial<MomentumChoice> & { longHistory?: boolean })
      | null;
    return {
      wording: parsed?.wording === "soft" ? "soft" : "candid",
      history:
        parsed?.history === "thirty" || parsed?.history === "ninety"
          ? parsed.history
          : parsed?.longHistory === true
            ? "ninety"
            : "actual",
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
