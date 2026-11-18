"use client";

import { createContext, useContext, useEffect, type Dispatch, type SetStateAction } from "react";

/**
 * The tone of the simulated phone's status bar.
 *
 * The status bar is drawn by the device frame, outside the page, so a screen
 * whose top edge is dark cannot reach it with its own styles. A screen that
 * needs the inverse status bar asks for it with `useStatusBarTone`, for as long
 * as it is mounted, and the frame goes back to the default when it unmounts.
 */
export type StatusBarTone = "default" | "inverse" | "sunken";

export const StatusBarToneSetter = createContext<Dispatch<
  SetStateAction<StatusBarTone>
> | null>(null);

export function useStatusBarTone(tone: StatusBarTone): void {
  const setTone = useContext(StatusBarToneSetter);
  useEffect(() => {
    if (!setTone) return;
    setTone(tone);
    return () => setTone("default");
  }, [setTone, tone]);
}
