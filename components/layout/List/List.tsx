import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/primitives/Icon";

export interface ListTrailing {
  /** A status or count, such as `LoopStatus`. */
  badge?: ReactNode;
  /** A quiet word or two: a date, a count. */
  meta?: string;
  /** Buttons or links. */
  actions?: ReactNode;
}

export interface ListItemData {
  id: string;
  /** The item's name: the first line. */
  primary: string;
  /** The second line, where there is one. */
  secondary?: ReactNode;
  /** An icon before the text. */
  icon?: IconName;
  trailing?: ListTrailing;
  /** The whole row opens this, from the primary line's link. */
  href?: string;
}

export interface ListProps {
  items: readonly ListItemData[];
  /** Names the list for assistive technology. */
  label: string;
  /** Lines between rows, across the whole row, or none. */
  dividers?: "none" | "full";
  /** Drawn on a raised surface with a border, or bare inside a card. */
  framed?: boolean;
  /** Catalogue only: shows the first row in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

function Trailing({ trailing }: { trailing?: ListTrailing }) {
  if (!trailing || (!trailing.badge && !trailing.meta && !trailing.actions)) return null;
  return (
    <span className="list__trailing">
      {trailing.meta ? <span className="list__meta">{trailing.meta}</span> : null}
      {trailing.badge ? <span className="list__badge">{trailing.badge}</span> : null}
      {trailing.actions ? <span className="list__actions">{trailing.actions}</span> : null}
    </span>
  );
}

/**
 * Rows of items, the name and a second line under it where there is one, with
 * a leading icon and trailing badges, metadata or actions, and dividers
 * between. A row with `href` opens from its primary line, and the whole row is
 * the target; its actions sit above that target.
 *
 * Spacing, dividers and type come from the LISTS tokens.
 */
export function List({ items, label, dividers = "full", framed = true, demo, className }: ListProps) {
  const classes = ["list", "list--two", `list--dividers-${dividers}`, framed ? "list--framed" : null, className].filter(Boolean).join(" ");
  return (
    <ul className={classes} aria-label={label}>
      {items.map((item, index) => {
        const two = Boolean(item.secondary);
        const rowClasses = [
          "list__item",
          two ? "list__item--two" : "list__item--single",
          item.href ? "list__item--link" : null,
          index === 0 && demo ? `is-${demo}` : null,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <li key={item.id} className={rowClasses}>
            {item.icon ? (
              <span className="list__leading list__leading--icon" aria-hidden="true">
                <Icon name={item.icon} size={20} />
              </span>
            ) : null}
            <span className="list__text">
              {item.href ? (
                <Link href={item.href} className="list__primary list__link">
                  {item.primary}
                </Link>
              ) : (
                <span className="list__primary">{item.primary}</span>
              )}
              {two ? <span className="list__secondary">{item.secondary}</span> : null}
            </span>
            <Trailing trailing={item.trailing} />
          </li>
        );
      })}
    </ul>
  );
}

export default List;
