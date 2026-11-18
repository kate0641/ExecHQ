"use client";

import { useId } from "react";

export interface NumberFieldProps {
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
 * A number she types, with what it counts beside it: the label and hint on the
 * left, a short standard text field on the right. Only digits (and commas) are
 * kept, and a phone shows its number pad.
 */
export function NumberField({ label, hint, value, onChange, placeholder = "0", size = "compact", disabled, demo, className }: NumberFieldProps) {
  const id = useId();
  return (
    <div className={["number-field", `number-field--${size}`, className].filter(Boolean).join(" ")}>
      <span className="number-field__text">
        <label htmlFor={id} id={`${id}-label`}>
          {label}
        </label>
        {hint ? <span id={`${id}-hint`}>{hint}</span> : null}
      </span>
      <input
        id={id}
        className={["field__control", "number-field__field", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
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
    </div>
  );
}

export default NumberField;
