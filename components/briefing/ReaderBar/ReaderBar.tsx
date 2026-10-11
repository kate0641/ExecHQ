"use client";

import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";
import type { Relevance } from "@/lib/briefing-store";
import { BRIEFING_COPY } from "@/mock/briefing";

const C = BRIEFING_COPY.bar;

export interface ReaderBarProps {
  /** For accessible names: "Save: How planning season…". */
  title: string;
  onBack: () => void;
  relevance?: Relevance;
  onRelevance: (relevance: Relevance | undefined) => void;
  saved: boolean;
  onSave: (saved: boolean) => void;
  respondHref: string;
  onRespond?: () => void;
  /** On a phone it runs along the foot of the screen, where the Ask or go
   *  pill usually sits; on tablet and web it floats. */
  docked?: boolean;
  /** Catalogue only: shows Save in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * Briefing Concept 2's reader bar, after a news app: Back, Relevant, Not for
 * me, Save and Write a post, one press each. Relevant and Not for me are one
 * choice: pressing the chosen one again takes it back. What each press did is
 * said in the page's live region, not here.
 */
export function ReaderBar({ title, onBack, relevance, onRelevance, saved, onSave, respondHref, onRespond, docked = true, demo, className }: ReaderBarProps) {
  return (
    <nav className={["reader-bar", docked ? "reader-bar--docked" : null, className].filter(Boolean).join(" ")} aria-label={C.label}>
      <button type="button" className="reader-bar__item" onClick={onBack}>
        <Icon name="chevron-left" size={18} />
        {C.back}
      </button>
      <button type="button" className="reader-bar__item" aria-pressed={relevance === "yes"} onClick={() => onRelevance(relevance === "yes" ? undefined : "yes")}>
        <Icon name="thumb-up" size={18} />
        {C.relevant}
        <span className="u-visually-hidden">: {title}</span>
      </button>
      <button type="button" className="reader-bar__item" aria-pressed={relevance === "no"} onClick={() => onRelevance(relevance === "no" ? undefined : "no")}>
        <Icon name="thumb-down" size={18} />
        {C.notForMe}
        <span className="u-visually-hidden">: {title}</span>
      </button>
      <button type="button" className={["reader-bar__item", demo ? `is-${demo}` : null].filter(Boolean).join(" ")} aria-pressed={saved} onClick={() => onSave(!saved)}>
        <Icon name="bookmark" size={18} />
        {saved ? C.saved : C.save}
        <span className="u-visually-hidden">: {title}</span>
      </button>
      <Link href={respondHref} className="reader-bar__item" onClick={onRespond}>
        <Icon name="pencil" size={18} />
        <span aria-hidden="true">{C.post}</span>
        <span className="u-visually-hidden">{C.postFull}</span>
      </Link>
    </nav>
  );
}

export default ReaderBar;
