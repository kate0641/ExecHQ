import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { BRIEFING_COPY as C, publisherName, type BriefingRead } from "@/mock/briefing";

export interface BriefingReaderProps {
  read: BriefingRead;
  /** The read's actions (`ReadActions`). */
  actions?: ReactNode;
  /** The whole article, read in ExecHQ (Concept 2, `BriefingArticle`).
   *  Replaces the way out to the publisher's site with a credit. */
  article?: ReactNode;
  /** Above the headline: the article's picture (Concept 2, `BriefingPicture`). */
  picture?: ReactNode;
  onClose?: () => void;
  headingId?: string;
  className?: string;
}

/**
 * A read, opened: what ExecHQ says about it, what the publisher says it is
 * about, and the way out to the publisher's site, with the read's actions
 * under it. Opening it counts as reading it. In the product the article is
 * read on the publisher's site; ExecHQ never shows the whole of it, except in
 * Concept 2, which reads it here with ExecHQ's notes (`article`).
 */
export function BriefingReader({ read, actions, article, picture, onClose, headingId, className }: BriefingReaderProps) {
  const publisher = publisherName(read.publisherId);
  return (
    <div className={["brief-reader", className].filter(Boolean).join(" ")}>
      {picture}
      <div className="brief-reader__head">
        <span className="brief-reader__publisher">{publisher}</span>
        {onClose ? (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="brief-reader__close">
            <Icon name="close" size={16} />
          </Button>
        ) : null}
      </div>
      <h2 className="brief-reader__title" id={headingId} tabIndex={-1}>
        {read.title}
      </h2>
      <p className="brief-read__reason">
        <span className="brief-read__reason-label">{C.read.reasonLabel}</span>
        {read.reason}
      </p>
      <p className="brief-reader__standfirst">{read.standfirst}</p>
      {article ? (
        <>
          {article}
          <p className="brief-reader__credit">{C.passage.credit(publisher)}</p>
        </>
      ) : (
        <>
          {/* A stand-in: the product leaves for the publisher's site here. */}
          <button type="button" className="brief-reader__out" aria-describedby={`${read.id}-out-note`}>
            {C.read.openAt(publisher)}
            <Icon name="link" size={16} />
          </button>
          <span className="brief-reader__out-note" id={`${read.id}-out-note`}>
            {C.read.openAtNote}
          </span>
        </>
      )}
      {actions}
    </div>
  );
}

export default BriefingReader;
