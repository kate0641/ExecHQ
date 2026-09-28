"use client";

import { useId, type InputHTMLAttributes } from "react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> {
  label: string;
  /** Catalogue only: `is-hover`, `is-focus`, `is-active` on the box. */
  boxClassName?: string;
}

/**
 * A single yes/no choice with its label beside it, e.g. "Keep me signed in
 * on this device". A native checkbox, drawn larger, so it is announced and
 * operated like any other.
 */
export function Checkbox({ label, boxClassName, className, disabled, ...rest }: CheckboxProps) {
  const id = useId();
  return (
    <div className={["checkbox", disabled ? "checkbox--disabled" : null, className].filter(Boolean).join(" ")}>
      <input {...rest} type="checkbox" id={id} disabled={disabled} className={["checkbox__box", boxClassName].filter(Boolean).join(" ")} />
      <label htmlFor={id} className="checkbox__label">
        {label}
      </label>
    </div>
  );
}

export default Checkbox;
