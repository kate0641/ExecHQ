import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";

export interface BriefingEditorialProps {
  href: string;
  /** "Today's Briefing". */
  heading?: string;
  /** "Tue 20 Oct · 3 reads". */
  meta: string;
  /** The lead read's headline, set in the serif. */
  lead: string;
  /** Why it matters to the user, short enough for a tag: "For your Q1
   *  planning review". Left out when no read touches the plan. */
  tag?: string;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * Today's Briefing as a page of reading (Homepage Concept 3, Editorial): the
 * lead headline in the serif, the product's one editorial face, under a thin
 * top rule, with the date and number of reads above and why it matters as a
 * tag. It reads as something to read, not something to do, so it stays
 * visibly apart from plan recommendations. The whole card is the link.
 */
export function BriefingEditorial({
  href,
  heading = "Today’s Briefing",
  meta,
  lead,
  tag,
  demo,
  className,
}: BriefingEditorialProps) {
  return (
    <Link
      href={href}
      className={["briefing-editorial", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}
    >
      <span className="briefing-editorial__top">
        <span className="briefing-editorial__heading">{heading}</span>
        <span className="briefing-editorial__meta">{meta}</span>
      </span>
      <span className="briefing-editorial__lead">{lead}</span>
      <span className="briefing-editorial__foot">
        {tag ? <span className="briefing-editorial__tag">{tag}</span> : <span />}
        <Icon name="chevron" size={16} className="briefing-editorial__go" />
      </span>
    </Link>
  );
}

export default BriefingEditorial;
