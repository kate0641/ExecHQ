import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and marks the button busy. Still focusable, not clickable. */
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

/**
 * The prototype's button. Written from scratch — no UI kit.
 *
 * `className` is merged rather than replaced so the component catalogue can pass
 * `is-hover` / `is-active` to display states that props cannot express. Those
 * classes sit on the same rules as the real `:hover` / `:active` selectors in
 * styles/app.css, so the two cannot diverge.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : null,
    loading ? "btn--loading" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      type={type}
      className={classes}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      <span className="btn__label">{children}</span>
      {loading ? <span className="u-visually-hidden">Loading</span> : null}
    </button>
  );
}

export default Button;
