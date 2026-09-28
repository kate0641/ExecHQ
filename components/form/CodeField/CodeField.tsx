"use client";

import { useId } from "react";

export interface CodeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** How many digits. */
  length?: number;
  error?: string;
  /** Moves focus into the field when it appears. */
  autoFocus?: boolean;
  /** Catalogue only: `is-focus` draws the focused cell. */
  className?: string;
}

/**
 * A one-time code, drawn as a row of cells but typed into one real input, so
 * pasting, the phone's code suggestion (`one-time-code`) and screen readers
 * all work as they would on a plain field. Only digits are kept.
 */
export function CodeField({ label, value, onChange, length = 6, error, autoFocus, className }: CodeFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const half = Math.floor(length / 2);
  const cursor = Math.min(value.length, length - 1);
  return (
    <div className={["code-field", error ? "code-field--error" : null, className].filter(Boolean).join(" ")}>
      <label htmlFor={id} id={`${id}-label`} className="code-field__label">
        {label}
      </label>
      <div className="code-field__control">
        <input
          id={id}
          className="code-field__input"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={length}
          aria-labelledby={`${id}-label`}
          value={value}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- it opens as the next step, where the code is the only thing to do
          autoFocus={autoFocus}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, length))}
        />
        <div className="code-field__cells" aria-hidden="true">
          {Array.from({ length }, (_, i) => (
            <span
              key={i}
              className={[
                "code-field__cell",
                i === half ? "code-field__cell--gap" : null,
                i === cursor ? "code-field__cell--current" : null,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {value.charAt(i)}
            </span>
          ))}
        </div>
      </div>
      {error ? (
        <p id={errorId} className="field__error">
          <span className="u-visually-hidden">Error: </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default CodeField;
