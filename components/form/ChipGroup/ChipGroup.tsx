"use client";

import { useId } from "react";

export interface ChipGroupProps {
  /** The question. Rendered as the group's legend. */
  label: string;
  /** A quiet note after the label, e.g. "Up to three". */
  note?: string;
  options: readonly string[];
  /** The chosen options. One at most unless `max` is above one. */
  value: readonly string[];
  onChange: (next: string[]) => void;
  /** How many may be chosen. 1 (the default) makes pressing another option
   *  replace the choice, and pressing the chosen one clear it. */
  max?: number;
  className?: string;
}

/**
 * A set of pressable chips: pick one, or up to `max`.
 *
 * Toggle buttons rather than radios or checkboxes, so one component covers
 * single and multiple choice with the same look and the same keyboard
 * behaviour, and nothing changes on an arrow key. Once `max` is reached the
 * unchosen chips are disabled, with the reason in the legend's note.
 */
export function ChipGroup({
  label,
  note,
  options,
  value,
  onChange,
  max = 1,
  className,
}: ChipGroupProps) {
  const legendId = useId();
  const full = max > 1 && value.length >= max;

  function toggle(option: string) {
    const chosen = value.includes(option);
    if (max === 1) {
      onChange(chosen ? [] : [option]);
      return;
    }
    onChange(chosen ? value.filter((item) => item !== option) : [...value, option]);
  }

  return (
    <fieldset className={["chip-group", className].filter(Boolean).join(" ")}>
      <legend className="chip-group__label" id={legendId}>
        {label}
        {note ? <span className="chip-group__note"> {note}</span> : null}
      </legend>
      <div className="chip-group__options">
        {options.map((option) => {
          const chosen = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              className="chip-group__chip"
              aria-pressed={chosen}
              disabled={full && !chosen}
              onClick={() => toggle(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default ChipGroup;
