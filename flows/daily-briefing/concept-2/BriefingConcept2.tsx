"use client";

import { useState } from "react";
import { BriefingEnd } from "@/components/briefing/BriefingEnd";
import { BriefingReadCard } from "@/components/briefing/BriefingReadCard";
import { BriefingReader } from "@/components/briefing/BriefingReader";
import { ReadCounter } from "@/components/briefing/ReadCounter";
import { Button } from "@/components/primitives/Button";
import { briefingActions } from "@/lib/briefing-store";
import { BRIEFING_COPY as C } from "@/mock/briefing";
import { focusSoon, TITLE_ID, useBriefingPage } from "../useBriefingPage";

const READ_HEADING = "briefing-read-heading";
const END_HEADING = "briefing-end";

/**
 * Daily Briefing, Concept 2 — One at a time. One of the two safe concepts,
 * native to the phone.
 *
 * One read fills the screen with "1 of 3" at the top and Next in the bottom
 * thumb zone: a tap, not a swipe. Next counts the read as seen. A quiet Back
 * and "See all three" sit beside the count, so Next is never the only way
 * through. After the third, the last screen says "That's today's three." On
 * web the read is a centred card with the count and Next in the same places.
 *
 * Publishers are changed in Profile.
 */
export function BriefingConcept2() {
  const p = useBriefingPage();
  const [at, setAt] = useState(0);
  if (p.firstVisit) return p.firstVisit;

  const total = p.reads.length;
  const go = (next: number) => {
    setAt(next);
    // Each read starts from the top of the screen, as a new page would.
    setTimeout(() => document.getElementById(TITLE_ID)?.scrollIntoView({ block: "start" }), 0);
    focusSoon(next >= total ? END_HEADING : READ_HEADING);
  };

  if (at >= total) {
    return (
      <div className="briefing-page briefing-page--one">
        {p.header}
        <div className="briefing-one">
          <ReadCounter at={total} of={total} onBack={() => go(total - 1)} className="briefing-one__counter" />
          <BriefingEnd layout="screen" headingId={END_HEADING}>
            <ul className="brief-end__reads">
              {p.reads.map((read, i) => (
                <li key={read.id}>
                  <BriefingReadCard read={read} layout="row" headingLevel={3} isRead={p.stateOf(read.id).read} onOpen={() => go(i)} />
                </li>
              ))}
            </ul>
            <div className="brief-end__links">
              {p.savedLink}
              {p.publishersInProfile}
            </div>
          </BriefingEnd>
        </div>
        {p.sheet}
      </div>
    );
  }

  const read = p.reads[at];
  return (
    <div className="briefing-page briefing-page--one">
      {p.header}
      <div className="briefing-one">
        <ReadCounter
          at={at + 1}
          of={total}
          onBack={at > 0 ? () => go(at - 1) : undefined}
          onToEnd={() => go(total)}
          className="briefing-one__counter"
        />
        <BriefingReader read={read} headingId={READ_HEADING} actions={p.actionsFor(read)} className="briefing-one__read" />
        <div className="briefing-one__next">
          <Button
            fullWidth
            onClick={() => {
              briefingActions.markRead(read.id);
              p.completeStep();
              go(at + 1);
            }}
          >
            {C.oneAtATime.next}
          </Button>
        </div>
      </div>
      {p.sheet}
    </div>
  );
}

export default BriefingConcept2;
