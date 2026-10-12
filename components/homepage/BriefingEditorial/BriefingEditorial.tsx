import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";

export interface BriefingEditorialRead {
  title: string;
  /** The publication it comes from: "The Calder Quarterly". */
  publisher: string;
}

export interface BriefingEditorialProps {
  href: string;
  /** "Today's Briefing". */
  heading?: string;
  /** "Tue 20 Oct · 3 reads". */
  meta: string;
  /** The lead read's headline, set in the serif, two lines at most. */
  lead: string;
  /** The lead read's publication. */
  publisher?: string;
  /** Why it matters to the user, short enough for a tag: "For your Q1
   *  planning review". Left out when no read touches the plan. */
  tag?: string;
  /** The other reads, one line each, under the lead. */
  others?: BriefingEditorialRead[];
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * Today's Briefing as a page of reading: the lead headline in the serif, the
 * product's one editorial face, under a thin top rule, with its publication
 * and why it matters under it; the other reads follow as small bullets, so
 * she knows what today holds. Long headlines end in an ellipsis (the lead
 * after two lines, the others after one), so the card keeps its height; the
 * full words stay in the link's name. It reads as something to read, not
 * something to do, so it stays visibly apart from plan recommendations. The
 * whole card is one link. On web the lead takes the left and the others the
 * right.
 */
export function BriefingEditorial({
  href,
  heading = "Today’s Briefing",
  meta,
  lead,
  publisher,
  tag,
  others = [],
  demo,
  className,
}: BriefingEditorialProps) {
  const source = [publisher, tag].filter(Boolean);
  return (
    <Link
      href={href}
      className={["briefing-editorial", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}
    >
      <span className="briefing-editorial__top">
        <span className="briefing-editorial__heading">{heading}</span>
        <span className="briefing-editorial__meta">
          {meta}
          <Icon name="chevron" size={16} className="briefing-editorial__go" />
        </span>
      </span>
      <span className="briefing-editorial__body">
        <span className="briefing-editorial__first">
          <span className="briefing-editorial__lead">{lead}</span>
          {source.length > 0 ? (
            <span className="briefing-editorial__source">
              {publisher ? <b>{publisher}</b> : null}
              {publisher && tag ? " · " : null}
              {tag}
            </span>
          ) : null}
        </span>
        {others.length > 0 ? (
          <span className="briefing-editorial__others">
            {others.map((read) => (
              <span key={read.title} className="briefing-editorial__other">
                <span className="briefing-editorial__title">{read.title}</span>
                <span className="briefing-editorial__source">
                  <b>{read.publisher}</b>
                </span>
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export default BriefingEditorial;
