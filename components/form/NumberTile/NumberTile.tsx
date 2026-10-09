"use client";

import { useId } from "react";

export interface NumberTileProps {
  /** What is being counted. Always required: every control is labelled. */
  label: string;
  /** A line under the label: what counts. */
  hint?: string;
  /** What she has typed, kept as text so an empty tile stays empty. */
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  /** `wide` for numbers that run to thousands (LinkedIn followers). */
  size?: "compact" | "wide";
  disabled?: boolean;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus";
  className?: string;
}

/**
 * A number she types into a lime tile, with what it counts beside it: the
 * tile is the field. An underline in dark green marks it as somewhere to type,
 * since the pale fill alone is too faint against white to read as a control.
 * Only digits are kept.
 */
export function NumberTile({ label, hint, value, onChange, placeholder = "0", size = "compact", disabled, demo, className }: NumberTileProps) {
  const id = useId();
  return (
    <div className={["number-tile", `number-tile--${size}`, demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}>
      <input
        id={id}
        className="number-tile__field"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        aria-labelledby={`${id}-label`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value.replace(/[^0-9,]/g, ""))}
      />
      <span className="number-tile__text">
        <label htmlFor={id} id={`${id}-label`}>
          {label}
        </label>
        {hint ? <span id={`${id}-hint`}>{hint}</span> : null}
      </span>
    </div>
  );
}

export default NumberTile;
