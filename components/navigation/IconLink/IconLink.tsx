import Link from "next/link";
import { Icon, type IconName } from "@/components/primitives/Icon";

export interface IconLinkProps {
  href: string;
  /** The accessible name, and the tooltip. Always required. */
  label: string;
  icon: IconName;
  /** This link is the page on screen. */
  current?: boolean;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * A destination reached by an icon alone, such as Profile in the top right of
 * the Tab bar concept. The label is its accessible name and its tooltip, so
 * the icon is never the only thing identifying it.
 */
export function IconLink({ href, label, icon, current = false, demo, className }: IconLinkProps) {
  return (
    <Link
      href={href}
      title={label}
      className={["icon-link", current ? "is-current" : null, demo ? `is-${demo}` : null, className]
        .filter(Boolean)
        .join(" ")}
      aria-current={current ? "page" : undefined}
    >
      <Icon name={icon} size={20} />
      <span className="u-visually-hidden">{label}</span>
    </Link>
  );
}

export default IconLink;
