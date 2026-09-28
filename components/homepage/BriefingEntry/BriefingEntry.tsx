import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";

export interface BriefingEntryProps {
  href: string;
  /** How many reads today. */
  reads?: number;
  label?: string;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * One line into the Briefing: "Today's Briefing · 3 reads". It shows no
 * article content on the homepage; the Briefing is its own destination.
 */
export function BriefingEntry({ href, reads = 3, label = "Today’s Briefing", demo, className }: BriefingEntryProps) {
  return (
    <Link href={href} className={["briefing-entry", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}>
      <span className="briefing-entry__icon" aria-hidden="true">
        <Icon name="calendar" size={20} />
      </span>
      <span className="briefing-entry__text">
        <b>{label}</b>
        <span> · {reads === 1 ? "1 read" : `${reads} reads`}</span>
      </span>
      <Icon name="chevron" size={16} className="briefing-entry__go" />
    </Link>
  );
}

export default BriefingEntry;
