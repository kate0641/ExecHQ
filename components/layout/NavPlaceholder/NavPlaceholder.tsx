export interface NavPlaceholderProps {
  /** What the bar stands in for. Shown verbatim. */
  label?: string;
  className?: string;
}

/**
 * A stand-in for navigation that has not been designed yet.
 *
 * The signed-in navigation is a Sprint 2 concern (the `navigation` flow). Where
 * onboarding reaches the point of being "in the app", this bar holds the space
 * and says so, rather than inventing a design that Sprint 2 then has to undo.
 *
 * It is deliberately NOT a `nav` landmark: it contains no destinations, and an
 * empty navigation landmark is worse for a screen reader than no landmark. It
 * reads as what it is — a placeholder — to everybody.
 */
export function NavPlaceholder({ label = "nav", className }: NavPlaceholderProps) {
  return (
    <div className={["nav-placeholder", className].filter(Boolean).join(" ")}>
      <span className="nav-placeholder__label">{label}</span>
    </div>
  );
}

export default NavPlaceholder;
