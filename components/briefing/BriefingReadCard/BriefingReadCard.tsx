import type { ReactNode } from "react";
import { Icon } from "@/components/primitives/Icon";
import { BRIEFING_COPY as C, publisherName, type BriefingRead } from "@/mock/briefing";

export type BriefingReadLayout = "lead" | "row" | "stack";

export interface BriefingReadCardProps {
  read: BriefingRead;
  /**
   * - `lead`: the front page's large card, headline in the serif, actions under it.
   * - `row`: a compact row under the lead; the whole row opens the read.
   * - `stack`: one of three stacked reads (Concept C), with a passage under it.
   */
  layout: BriefingReadLayout;
  /** She has opened it, or marked it read. */
  isRead?: boolean;
  /** Opens the read. On `row` the whole row is the target; on `lead` and
   *  `stack` the headline is. */
  onOpen?: () => void;
  headingLevel?: 2 | 3;
  /** Under the reason line: the actions, or Concept C's passage. */
  children?: ReactNode;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * One of the day's three reads: the publisher, the headline in the serif,
 * and why it is here, in ExecHQ's words, set apart from the publisher's.
 * It has its own pattern, never a plan step's: no horizon, no effort, no
 * reading time, and no done state. A read is read or not, and that is all.
 */
export function BriefingReadCard({
  read,
  layout,
  isRead = false,
  onOpen,
  headingLevel = 2,
  children,
  demo,
  className,
}: BriefingReadCardProps) {
  const Heading = `h${headingLevel}` as const;
  const publisher = publisherName(read.publisherId);
  const classes = ["brief-read", `brief-read--${layout}`, isRead ? "is-read" : null, demo ? `is-${demo}` : null, className]
    .filter(Boolean)
    .join(" ");

  const readMark = isRead ? (
    <span className="brief-read__read">
      <Icon name="check" size={14} />
      {C.read.readState}
    </span>
  ) : null;

  const reason = (
    <p className="brief-read__reason">
      <span className="brief-read__reason-label">{C.read.reasonLabel}</span>
      {read.reason}
    </p>
  );

  if (layout === "row") {
    // The headline holds the button, and the button's area is stretched over
    // the whole row, so the row is one target without a heading inside a
    // button.
    return (
      <div className={classes}>
        <span className="brief-read__top">
          <span className="brief-read__publisher">{publisher}</span>
          {readMark}
        </span>
        <Heading className="brief-read__title">
          <button type="button" className="brief-read__open brief-read__open--stretched" onClick={onOpen}>
            {read.title}
          </button>
        </Heading>
        {/* Compact: the rule alone marks it as ExecHQ's words. The label is
            still there for a screen reader. */}
        <p className="brief-read__reason">
          <span className="u-visually-hidden">{C.read.reasonLabel}: </span>
          {read.reason}
        </p>
      </div>
    );
  }

  return (
    <article className={classes} aria-label={read.title}>
      <span className="brief-read__top">
        <span className="brief-read__publisher">{publisher}</span>
        {readMark}
      </span>
      <Heading className="brief-read__title">
        {onOpen ? (
          <button type="button" className="brief-read__open" onClick={onOpen}>
            {read.title}
          </button>
        ) : (
          read.title
        )}
      </Heading>
      {reason}
      {children}
    </article>
  );
}

export default BriefingReadCard;
