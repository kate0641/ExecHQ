"use client";

import { useId } from "react";
import { Icon } from "@/components/primitives/Icon";

export interface StepperProps {
  /** What is being counted. Always required: every control is labelled. */
  label: string;
  /** A line under the label: what counts. */
  hint?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Catalogue only: shows a button in a state a static page can't reach. */
  demo?: { button: "less" | "more"; state: "hover" | "focus" | "active" };
  className?: string;
}

/**
 * A small count she nudges up and down: for numbers that are usually zero,
 * one, two or three, where typing would be more work than tapping. The
 * number is read out as it changes, and the minus is switched off at the
 * minimum so zero is a clear floor, not a mistake to correct.
 */
export function Stepper({ label, hint, value, onChange, min = 0, max = 99, demo, className }: StepperProps) {
  const id = useId();
  const cls = (button: "less" | "more") =>
    ["stepper__button", demo?.button === button ? `is-${demo.state}` : null].filter(Boolean).join(" ");
  return (
    <div className={["stepper", className].filter(Boolean).join(" ")}>
      <span className="stepper__text">
        <b id={`${id}-label`}>{label}</b>
        {hint ? <span id={`${id}-hint`}>{hint}</span> : null}
      </span>
      <span className="stepper__control">
        <button type="button" className={cls("less")} aria-label={`Fewer: ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
          <Icon name="minus" size={16} />
        </button>
        <output className="stepper__value" aria-live="polite">
          {value}
        </output>
        <button type="button" className={cls("more")} aria-label={`More: ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
          <Icon name="plus" size={16} />
        </button>
      </span>
    </div>
  );
}

export default Stepper;
