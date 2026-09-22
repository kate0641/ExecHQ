"use client";

import { useId, type InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "size"> {
  /** Always required — every control in this prototype is labelled. */
  label: string;
  /** Supporting text, wired to the input with aria-describedby. */
  hint?: string;
  /** Error text. Sets aria-invalid and is announced politely. */
  error?: string;
  /** Hides the label visually but keeps it for screen readers. */
  labelHidden?: boolean;
  /** Renders a multi-line field instead. */
  multiline?: boolean;
  rows?: number;
}

/**
 * Text input. The label is a required prop rather than an optional one, so an
 * unlabelled field cannot be built by accident.
 */
export function Input({
  label,
  hint,
  error,
  labelHidden = false,
  multiline = false,
  rows = 4,
  className,
  disabled,
  required,
  ...rest
}: InputProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const fieldClasses = ["field__control", error ? "field__control--error" : null, className]
    .filter(Boolean)
    .join(" ");

  const shared = {
    id,
    className: fieldClasses,
    disabled,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
  };

  return (
    <div className={`field${disabled ? " field--disabled" : ""}`}>
      <label
        htmlFor={id}
        className={labelHidden ? "u-visually-hidden" : "field__label"}
      >
        {label}
        {required ? (
          <span className="field__required">
            <span aria-hidden="true">*</span>
            <span className="u-visually-hidden"> (required)</span>
          </span>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      ) : null}

      {multiline ? (
        <textarea
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...shared}
          rows={rows}
        />
      ) : (
        <input {...rest} {...shared} />
      )}

      {error ? (
        <p id={errorId} className="field__error">
          <span className="u-visually-hidden">Error: </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
