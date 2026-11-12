import Link from "next/link";
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
  onClick?: () => void;
}

export interface IconRowProps {
  items: readonly IconRowItem[];
  /** The list's accessible name, when the section around it gives none. */
  label?: string;
  /** Catalogue only: shows the first item focused. */
  demo?: "focus";
  className?: string;
}

/**
 * One row of icons, each over its name, that fits the width however many
 * there are. The advisor's navigation: plain icons and
 * their names, no tile and no strip. Only the current page is marked, its
 * icon in a filled circle and its name a step heavier. Nothing changes on
 * hover, which carries no meaning on a phone.
 */

export function IconRow({ items, label, demo, className }: IconRowProps) {
  return (
    <ul className={["icon-row", className].filter(Boolean).join(" ")} aria-label={label}>
      {items.map((item, i) => (
        <li key={item.id}>
          <Link
            href={item.href}
            className={["icon-row__item", item.current ? "is-current" : null, i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
            aria-current={item.current ? "page" : undefined}
            onClick={item.onClick}
          >
            <span className="icon-row__chip">
              <Icon name={item.icon} size={20} />
              {item.dot ? <span className="icon-row__dot" aria-hidden="true" /> : null}
            </span>
            <span className="u-bold-hold" data-label={item.label}>
              {item.label}
            </span>
            {item.note ? <span className="u-visually-hidden">{item.note}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default IconRow;
