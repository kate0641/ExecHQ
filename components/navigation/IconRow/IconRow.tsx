import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/primitives/Icon";

export interface IconRowItem {
  id: string;
  href: string;
  /** The name under the icon. */
  label: string;
  icon: IconName;
  /** The page she is on: its icon sits in the filled circle. */
  current?: boolean;
  /** Something waits there: a dot at the circle's corner. Say what in `note`. */
  dot?: boolean;
  /** Read after the name, never shown: what the dot means, say. */
  note?: string;
  /** Read instead of the name, when the name shown is a short form. */
  fullName?: string;
  onClick?: () => void;
}

export interface IconRowProps {
  items: readonly IconRowItem[];
  /** The list's accessible name, when the section around it gives none. */
  label?: string;
  /** `lg`: a bigger icon in a bigger circle, for a row that leads the page
   *  (the Playbook's tools). The navigation is `md`. */
  size?: "md" | "lg";
  /** Every name on two lines, broken after its first word, so a row of
   *  two-word names lines up. */
  twoLines?: boolean;
  /** Catalogue only: shows the first item focused. */
  demo?: "focus";
  className?: string;
}

/**
 * One row of icons, each over its name, that fits the width however many
 * there are. The advisor's navigation (designer, 2026-10-11): plain icons and
 * their names, no tile and no strip. Only the current page is marked, its
 * icon in a filled circle and its name a step heavier. Nothing changes on
 * hover, which carries no meaning on a phone.
 *
 * The same row lays out the four tools on Playbook Concept 2, so the tools and
 * the places read as one family. A row of tools has no current item.
 */
/** "Pitch builder" as "Pitch", a line break, "builder". */
function splitName(name: string): ReactNode {
  const at = name.indexOf(" ");
  if (at < 0) return name;
  return (
    <>
      {name.slice(0, at)}
      <br />
      {name.slice(at + 1)}
    </>
  );
}

export function IconRow({ items, label, size = "md", twoLines = false, demo, className }: IconRowProps) {
  return (
    <ul className={["icon-row", size === "lg" ? "icon-row--lg" : null, className].filter(Boolean).join(" ")} aria-label={label}>
      {items.map((item, i) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className={["icon-row__item", item.current ? "is-current" : null, i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
            aria-current={item.current ? "page" : undefined}
            onClick={item.onClick}
          >
            <span className="icon-row__chip">
              <Icon name={item.icon} size={size === "lg" ? 26 : 20} />
              {item.dot ? <span className="icon-row__dot" aria-hidden="true" /> : null}
            </span>
            <span className="u-bold-hold" data-label={item.label} aria-hidden={item.fullName ? true : undefined}>
              {twoLines ? splitName(item.label) : item.label}
            </span>
            {item.fullName ? <span className="u-visually-hidden">{item.fullName}</span> : null}
            {item.note ? <span className="u-visually-hidden">{item.note}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default IconRow;
