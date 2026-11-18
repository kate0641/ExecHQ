"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

/**
 * The prototype's step bar: a reviewer's shortcut to any screen of the concept
 * on the canvas.
 *
 * A built concept declares its screens with `useStepNav`, and the shell draws
 * the bar from whatever is declared. Anything that declares nothing — an
 * unbuilt concept, the hub, the showroom — gets no bar.
 * Declaring is one call from inside the concept, so a new flow never touches
 * the shell to get one.
 *
 * Two contexts rather than one: concepts only ever write, so they subscribe to
 * the setter alone and do not re-render when the bar's own state changes.
 */
export interface StepNavItem {
  id: string;
  label: string;
}

export interface StepNav {
  items: readonly StepNavItem[];
  /** The screen showing now. */
  currentId: string;
  onSelect: (id: string) => void;
}

const StepNavValue = createContext<StepNav | null>(null);
const StepNavSetter = createContext<Dispatch<SetStateAction<StepNav | null>> | null>(
  null
);

export function StepNavProvider({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState<StepNav | null>(null);
  return (
    <StepNavSetter.Provider value={setNav}>
      <StepNavValue.Provider value={nav}>{children}</StepNavValue.Provider>
    </StepNavSetter.Provider>
  );
}

/** What the bar should show, or null for no bar. */
export function useStepNavValue(): StepNav | null {
  return useContext(StepNavValue);
}

/**
 * Declares the calling concept's screens for the step bar, for as long as it
 * is mounted.
 *
 * `items` should be stable — a module-level constant — since a new array on
 * every render re-declares the bar every render. `onSelect` may change freely;
 * the bar always calls the latest one.
 */
export function useStepNav(
  items: readonly StepNavItem[],
  currentId: string,
  onSelect: (id: string) => void
): void {
  const setNav = useContext(StepNavSetter);
  const selectRef = useRef(onSelect);
  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!setNav) return;
    setNav({ items, currentId, onSelect: (id) => selectRef.current(id) });
  }, [setNav, items, currentId]);

  useEffect(() => {
    if (!setNav) return;
    return () => setNav(null);
  }, [setNav]);
}
