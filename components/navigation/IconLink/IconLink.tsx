import Link from "next/link";
import { Icon, type IconName } from "@/components/primitives/Icon";

export interface IconLinkProps {
  href: string;
  /** The accessible name, and the tooltip. Always required. */
  label: string;
  icon: IconName;
  /** This link is the page on screen. */
  current?: boolean;
  /** On its own page, tapping it closes the page rather than reloading it:
   *  `closeLabel` names the button then, and `onClose` takes the reader back. */
  closeLabel?: string;
  onClose?: () => void;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * A destination reached by an icon alone, such as Profile in the top right of
 * the Tab bar concept. The label is its accessible name and its tooltip, so
 * the icon is never the only thing identifying it. On its own page it becomes
 * a button that closes the page.
 */
export function IconLink({ href, label, icon, current = false, closeLabel, onClose, demo, className }: IconLinkProps) {
  const classes = ["icon-link", current ? "is-current" : null, demo ? `is-${demo}` : null, className]
    .filter(Boolean)
    .join(" ");
  if (current && onClose) {
    const name = closeLabel ?? `Close ${label}`;
    return (
      <button type="button" title={name} className={classes} onClick={onClose}>
        <Icon name={icon} size={20} />
        <span className="u-visually-hidden">{name}</span>
      </button>
    );
  }
  return (
    <Link
      href={href}
      title={label}
      className={classes}
      aria-current={current ? "page" : undefined}
    >
      <Icon name={icon} size={20} />
      <span className="u-visually-hidden">{label}</span>
    </Link>
  );
}

export default IconLink;
