"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/primitives/Icon";
import { BRIEFING_COPY as C, publisherName, type BriefingRead } from "@/mock/briefing";

export interface BriefingDeckProps {
  reads: readonly BriefingRead[];
  /** The read open in full. */
  open: number;
  onOpen: (index: number) => void;
  /** Which reads she has read. */
  isRead?: (id: string) => boolean;
  /** Where the open read's headline goes: the article at its publisher,
   *  opened in a new tab. Without it the headline is plain text. */
  hrefFor?: (read: BriefingRead) => string;
  /** When she leaves for the article: opening it counts as reading it. */
  onRead?: (read: BriefingRead) => void;
  /** Under the open read's reason: its actions (`ReadActions`, compact). */
  actions?: (read: BriefingRead) => ReactNode;
  headingLevel?: 2 | 3;
  /** Catalogue only: shows the first strip in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * Today's three reads as a stack of cards (option B, chosen 11 October): one
 * read open in full (publisher, headline in the serif, why it is here, its
 * actions), the other two as their top strips, publisher and headline, tucked
 * against it. Pressing a strip opens that read in its place. The open card's
 * headline is underlined and goes to the article at its publisher, in a new
 * tab; it covers the whole card, so tapping anywhere but an action opens it. Each card says
 * where it sits in the set ("2 of 3"), so the stack reads as a finished set,
 * never the top of a feed.
 *
 * The cards stay in reading order wherever one is open, so a screen reader
 * and the keyboard meet them first, second, third. A tint per card, from the
 * deck tokens; the publisher is always named.
 */
export function BriefingDeck({ reads, open, onOpen, isRead, hrefFor, onRead, actions, headingLevel = 2, demo, className }: BriefingDeckProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <ol className={["briefing-deck", className].filter(Boolean).join(" ")} aria-label={C.deck.label}>
      {reads.map((read, i) => {
        const publisher = publisherName(read.publisherId);
        const count = C.oneAtATime.count(i + 1, reads.length);
        const done = isRead?.(read.id);
        const top = (
          <span className="briefing-deck__top">
            <span className="briefing-deck__publisher">{publisher}</span>
            <span className="briefing-deck__count">
              {done ? (
                <span className="briefing-deck__read">
                  <Icon name="check" size={12} />
                  {C.read.readState}
                </span>
              ) : null}
              {count}
            </span>
          </span>
        );
        const classes = [
          "briefing-deck__card",
          `briefing-deck__card--${(i % 3) + 1}`,
          i === open ? "is-open" : "is-strip",
          i === 0 && demo && i !== open ? `is-${demo}` : null,
        ]
          .filter(Boolean)
          .join(" ");

        if (i !== open) {
          return (
            <li key={read.id} className={classes}>
              <button type="button" className="briefing-deck__strip" onClick={() => onOpen(i)}>
                {top}
                <span className="briefing-deck__title briefing-deck__title--strip">
                  <span className="u-visually-hidden">{C.deck.show}: </span>
                  {read.title}
                </span>
              </button>
            </li>
          );
        }
        const href = hrefFor?.(read);
        return (
          <li key={read.id} className={classes}>
            <article className="briefing-deck__open" aria-labelledby={`deck-${read.id}`}>
              {top}
              <Heading className="briefing-deck__title" id={`deck-${read.id}`} tabIndex={href ? undefined : -1}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="briefing-deck__link"
                    id={`deck-link-${read.id}`}
                    onClick={() => onRead?.(read)}
                  >
                    {read.title}
                    <span className="u-visually-hidden"> ({C.read.opensAt(publisher)})</span>
                  </a>
                ) : (
                  read.title
                )}
              </Heading>
              <p className="brief-read__reason">
                <span className="brief-read__reason-label">{C.read.reasonLabel}</span>
                {read.reason}
              </p>
              {actions?.(read)}
            </article>
          </li>
        );
      })}
    </ol>
  );
}

export default BriefingDeck;
