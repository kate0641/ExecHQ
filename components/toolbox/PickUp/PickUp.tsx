"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { TOOLBOX_PAGE } from "@/mock/toolbox";

const C = TOOLBOX_PAGE.pickUp;

export interface PickUpItem {
  id: string;
  href: string;
  title: string;
  icon: IconName;
  /** Its status and when it last changed: "Draft · 19 Oct". */
  detail: string;
}

export interface PickUpProps {
  /** The draft she touched last. */
  latest: PickUpItem;
  /** The others she touched in the last 30 days, newest first. */
  more?: readonly PickUpItem[];
  /** Opens with the others showing (catalogue). */
  startOpen?: boolean;
  /** Catalogue only: shows the first row focused. */
  demo?: "focus";
  className?: string;
}

/**
 * "Pick up where you left off" on the Toolbox (Concept 1), option D, chosen
 * 13 Oct: a section heading, then rows straight on the page, divided by
 * hairlines, with no card. Each row is a tool icon, the title, its status and
 * date, and a chevron. The last line, "+ 2 more from the last 30 days",
 * centred, opens the others in place above it (Kate, 13 Oct).
 */
export function PickUp({ latest, more = [], startOpen = false, demo, className }: PickUpProps) {
  const [open, setOpen] = useState(startOpen);
  const headingId = useId();
  const listId = useId();
  const shown = open ? [latest, ...more] : [latest];

  return (
    <section className={["pick-up", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="library__heading" id={headingId}>
        {C.heading}
      </h2>
      <ul className="pick-up__list" id={listId}>
        {shown.map((item, i) => (
          <li key={item.id}>
            <Link href={item.href} className={["pick-up__row", i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}>
              <Icon name={item.icon} size={18} className="pick-up__icon" />
              <span className="pick-up__text">
                <span className="pick-up__title">{item.title}</span>
                <span className="pick-up__detail">{item.detail}</span>
              </span>
              <Icon name="chevron" size={16} className="pick-up__go" />
            </Link>
          </li>
        ))}
        {more.length > 0 ? (
          <li>
            <button type="button" className="pick-up__row pick-up__more" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)}>
              <Icon name={open ? "minus" : "plus"} size={16} />
              {open ? C.fewer : C.more(more.length)}
            </button>
          </li>
        ) : null}
      </ul>
    </section>
  );
}

export default PickUp;
