import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";

export interface BriefingCalloutProps {
  href: string;
  /** The whole line: "Read today’s briefing — October 2nd". It never says
   *  what the briefing holds. */
  label: string;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * A single line that leads to today's Briefing. It says only that there is
 * one and when it is for, so it stays small at the top of the page and the
 * Briefing itself does the telling.
 */
export function BriefingCallout({ href, label, demo, className }: BriefingCalloutProps) {
  return (
    <Link href={href} className={["briefing-callout", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}>
      <Icon name="briefing" size={20} />
      <span className="briefing-callout__label">{label}</span>
      <Icon name="chevron" size={16} className="briefing-callout__go" />
    </Link>
  );
}

export default BriefingCallout;
