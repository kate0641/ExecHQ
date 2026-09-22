import Link from "next/link";
import { HUB_PAGES, type HubPageKey } from "@/lib/hub-pages";

export interface HubNavProps {
  /** The page currently being viewed, marked with aria-current. */
  current?: HubPageKey;
  /** `inline` for the page header, `stacked` for the slide-out panel. */
  variant?: "inline" | "stacked";
  label?: string;
}

/** Moves between the hub and its reference tools. Generated from HUB_PAGES. */
export function HubNav({
  current,
  variant = "inline",
  label = "Prototype",
}: HubNavProps) {
  return (
    <nav className={`hub-nav hub-nav--${variant}`} aria-label={label}>
      <ul className="hub-nav__list">
        {HUB_PAGES.map((page) => (
          <li key={page.key}>
            <Link
              href={page.href}
              className="hub-nav__link"
              aria-current={page.key === current ? "page" : undefined}
            >
              {page.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default HubNav;
