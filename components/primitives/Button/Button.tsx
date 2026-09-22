import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and marks the button busy. Stays focusable but does not
   *  activate, so focus is never lost mid-interaction. */
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
  onClick,
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
      disabled={disabled}
      // A loading button keeps focus rather than being removed from the tab
      // order mid-interaction, so it is marked disabled to assistive technology
      // and simply does not activate.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      <span className="btn__label">{children}</span>
      {loading ? <span className="u-visually-hidden">Loading</span> : null}
    </button>
  );
}

export default Button;
