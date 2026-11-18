import { Icon } from "../Icon";

export interface MonogramProps {
  /** The person's optional name. Without one, a neutral head and shoulders. */
  name?: string;
  size?: "md" | "lg";
  className?: string;
}

/**
 * The account's mark: the first letter of the name the person gave, or a
 * neutral figure when they gave none. There is no photo, by decision on
 * 2026-09-28: the account holds an email and an optional name, nothing more.
 *
 * Decorative. The name or email is always written beside it.
 */
export function Monogram({ name, size = "md", className }: MonogramProps) {
  const initial = name?.trim().charAt(0).toUpperCase();
  const classes = ["monogram", `monogram--${size}`, className].filter(Boolean).join(" ");
  return (
    <span className={classes} aria-hidden="true">
      {initial || <Icon name="person" size={size === "lg" ? 32 : 22} />}
    </span>
  );
}

export default Monogram;
