"use client";

import { useSyncExternalStore } from "react";
import { currentSky, subscribeSky, type Sky } from "./sky-store";

/** The sky showing now, kept current as the dock's switcher changes it. The server draws day. */
export function useSky(): Sky {
  return useSyncExternalStore(subscribeSky, currentSky, () => "day" as Sky);
}
