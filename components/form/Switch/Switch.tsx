import type { ButtonHTMLAttributes } from "react";

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "role" | "type"> {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** The accessible name, when no visible label names it through
   *  `aria-labelledby`. */
  label?: string;
}

/**
 * An on/off setting that takes effect at once, with no save step: turning
 * Loop follow-ups off is one tap, as the Sprint 2 brief requires.
 *
 * A button with `role="switch"`, so it is announced as on or off. Position
 * and fill both change, so the state never rests on colour alone.
 */
export function Switch({ checked, onChange, label, className, onClick, ...rest }: SwitchProps) {
  return (
    <button
      {...rest}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={["switch", className].filter(Boolean).join(" ")}
      onClick={(event) => {
        onClick?.(event);
        onChange?.(!checked);
      }}
    >
      <span className="switch__thumb" aria-hidden="true" />
    </button>
  );
}

export default Switch;
