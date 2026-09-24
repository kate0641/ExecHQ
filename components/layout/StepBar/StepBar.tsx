"use client";

import type { StepNavItem } from "@/lib/step-nav";

export interface StepBarProps {
  items: readonly StepNavItem[];
  /** The screen showing now. Marked, and still pressable to reload it. */
  currentId: string;
  onSelect: (id: string) => void;
  /** Names the landmark. Defaults to naming it as a prototype tool. */
  label?: string;
}

/**
 * The reviewer's list of every screen in the concept on the canvas, as a thin
 * bar across the top of the window. Pressing a step jumps straight to it.
 *
 * Prototype scaffolding, like the dock: it sits outside the device frame, so
 * it never reads as product navigation and never changes what is being
 * reviewed. It takes its own row above the canvas rather than floating over
 * it, so it covers nothing.
 *
 * Numbered so a reviewer can say "step 6" in feedback. When the steps do not
 * fit the window, the list scrolls sideways rather than wrapping, so the bar
 * stays one line high.
 */
export function StepBar({
  items,
  currentId,
  onSelect,
  label = "Prototype: jump to a screen",
}: StepBarProps) {
  if (items.length === 0) return null;

  return (
    <nav className="step-bar" aria-label={label}>
      <ol className="step-bar__list">
        {items.map((item, index) => {
          const current = item.id === currentId;
          return (
            <li key={item.id} className="step-bar__item">
              <button
                type="button"
                className="step-bar__step"
                aria-current={current ? "step" : undefined}
                onClick={() => onSelect(item.id)}
              >
                <span className="step-bar__number" aria-hidden="true">
                  {index + 1}
                </span>
                {item.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default StepBar;
