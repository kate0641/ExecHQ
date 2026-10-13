"use client";

import { useState } from "react";
import { BriefingDeck } from "@/components/briefing/BriefingDeck";
import { BriefingEnd } from "@/components/briefing/BriefingEnd";
import { sourceHref } from "@/mock/briefing";
import { useBriefingPage } from "../useBriefingPage";

/**
 * Daily Briefing, Concept 1 — Front page. One of the two safe concepts.
 *
 * Today's three reads as a stack of cards (option B, chosen 11 October): the
 * first open in full, with its publisher, headline, why it is here and its
 * actions, and the other two as their top strips. Pressing a strip opens that
 * read in its place. Tapping the open card opens the article itself, at its
 * publisher, in a new tab (its headline is underlined to say so); ExecHQ never
 * shows the article. Each card says "1 of 3", so the stack reads as a
 * finished set. The same on every screen size.
 *
 * The only concept with its publishers on the page: a quiet line under the
 * three, with Change. The close, "That's today's three.", is there from the
 * start, because all three are in view at once.
 */
export function BriefingConcept1() {
  const p = useBriefingPage();
  const [open, setOpen] = useState(0);
  if (p.firstVisit) return p.firstVisit;

  return (
    <div className="briefing-page briefing-page--front">
      {p.header}
      <BriefingDeck
        reads={p.reads}
        open={open}
        onOpen={(i) => {
          setOpen(i);
          // The strip she pressed becomes the open card: focus follows to its headline.
          setTimeout(() => document.getElementById(`deck-link-${p.reads[i].id}`)?.focus(), 0);
        }}
        isRead={(id) => Boolean(p.stateOf(id).read)}
        hrefFor={(read) => sourceHref(read.id)}
        onRead={(read) => p.markOpened(read.id)}
        actions={(read) => p.actionsFor(read, { compact: true })}
      />
      <BriefingEnd allRead={p.allRead} headingId="briefing-end">
        <div className="brief-end__links">
          {p.savedLink}
          {p.publishersLine}
        </div>
      </BriefingEnd>
      {p.sheet}
    </div>
  );
}

export default BriefingConcept1;
