"use client";

import { BriefingEnd } from "@/components/briefing/BriefingEnd";
import { BriefingReadCard } from "@/components/briefing/BriefingReadCard";
import { useBriefingPage } from "../useBriefingPage";

/**
 * Daily Briefing, Concept 1 — Front page. One of the two safe concepts.
 *
 * The lead read is one large card with its publisher, headline and reason
 * line, and the other two are compact rows under it, so all three fit in
 * about one scroll and read as a finished set, not the top of a feed. On web
 * the lead takes the left two-thirds and the other two stack on the right.
 *
 * The only concept with its publishers on the page: a quiet line under the
 * three, with Change. The close, "That's today's three.", is there from the
 * start, because all three are in view at once.
 */
export function BriefingConcept1() {
  const p = useBriefingPage();
  if (p.firstVisit) return p.firstVisit;
  const [lead, ...others] = p.reads;

  return (
    <div className="briefing-page briefing-page--front">
      {p.header}
      <div className="briefing-front">
        <BriefingReadCard
          read={lead}
          layout="lead"
          isRead={p.stateOf(lead.id).read}
          onOpen={() => p.openRead(lead.id)}
          className="briefing-front__lead"
        >
          {p.actionsFor(lead, { compact: true })}
        </BriefingReadCard>
        <ul className="briefing-front__others">
          {others.map((read) => (
            <li key={read.id}>
              <BriefingReadCard read={read} layout="row" isRead={p.stateOf(read.id).read} onOpen={() => p.openRead(read.id)} />
            </li>
          ))}
        </ul>
      </div>
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
