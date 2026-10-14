"use client";

import { useState } from "react";
import { BriefingArticle } from "@/components/briefing/BriefingArticle";
import { BriefingEnd } from "@/components/briefing/BriefingEnd";
import { BriefingFront } from "@/components/briefing/BriefingFront";
import { BriefingPicture } from "@/components/briefing/BriefingPicture";
import { BriefingReader } from "@/components/briefing/BriefingReader";
import { ReadActions } from "@/components/briefing/ReadActions";
import { ReadCounter } from "@/components/briefing/ReadCounter";
import { Button } from "@/components/primitives/Button";
import { briefingActions } from "@/lib/briefing-store";
import { useViewport } from "@/lib/viewport-context";
import { BRIEFING_COPY as C, publisherName } from "@/mock/briefing";
import { focusSoon, TITLE_ID, useBriefingPage } from "../useBriefingPage";

const READ_HEADING = "briefing-read-heading";

/**
 * Daily Briefing, Concept 2 — the news app (option A, chosen 11 October). One
 * of the two safe concepts.
 *
 * A front page as a news app opens on: the first read as the lead story with
 * a big picture, the other two as rows with a small one, each with why it is
 * here, then "That's today's three". Each story opens a reader screen: "1
 * of 3", the picture, the whole article read here in ExecHQ (she never leaves
 * for the publisher) with ExecHQ's notes on highlighted passages all the way
 * through. Back to the front page sits at the top beside "1 of 3". Where
 * she finishes the article: Save, "Was this worth your time?", the "Write a
 * post about this" card, then Next. No bar at the foot and no Ask or go pill
 * while she reads (Kate, 14 Oct). On web the lead takes the left of the
 * front page.
 *
 * It keeps the Briefing's limits: only ever three, no topic tabs, no counts,
 * no times. The pictures are stand-ins until image rights are settled.
 * Publishers are changed in Profile.
 */
export function BriefingConcept2() {
  const p = useBriefingPage();
  const { viewport } = useViewport();
  const web = viewport === "web";
  const [at, setAt] = useState<number | null>(null);
  if (p.firstVisit) return p.firstVisit;

  const total = p.reads.length;
  /** Opens a read (reading it), or goes back to the front page. */
  const go = (next: number | null) => {
    const from = at;
    if (next !== null) {
      briefingActions.markRead(p.reads[next].id);
      p.completeStep();
    }
    setAt(next);
    setTimeout(() => document.getElementById(TITLE_ID)?.scrollIntoView({ block: "start" }), 0);
    if (next !== null) focusSoon(READ_HEADING);
    else setTimeout(() => document.querySelectorAll<HTMLElement>(".briefing-front2__open")[from ?? 0]?.focus(), 0);
  };

  if (at === null) {
    return (
      <div className="briefing-page briefing-page--news">
        {p.header}
        <BriefingFront reads={p.reads} onOpen={go} />
        <BriefingEnd allRead={p.allRead} headingId="briefing-end">
          <div className="brief-end__links">
            {p.publishersInProfile}
          </div>
        </BriefingEnd>
        {p.sheet}
      </div>
    );
  }

  const read = p.reads[at];
  const s = p.stateOf(read.id);
  return (
    <div className="briefing-page briefing-page--news briefing-page--reading">
      {p.header}
      <ReadCounter at={at + 1} of={total} onBack={() => go(null)} backLabel={C.oneAtATime.front} />
      <BriefingReader
        read={read}
        headingId={READ_HEADING}
        article={<BriefingArticle read={read} placement={web ? "margin" : "inline"} />}
        picture={<BriefingPicture place={((at % 3) + 1) as 1 | 2 | 3} publisher={publisherName(read.publisherId)} size="reader" />}
        actions={
          <ReadActions
            title={read.title}
            saved={Boolean(s.saved)}
            onSave={(v) => p.setSaved(read.id, v)}
            relevance={s.relevance}
            onRelevance={(r) => p.setRelevance(read.id, r)}
            respondHref={p.respond(read.id)}
            onRespond={p.completeStep}
          />
        }
      />
      <Button fullWidth onClick={() => go(at + 1 < total ? at + 1 : null)}>
        {at + 1 < total ? C.oneAtATime.nextRead(publisherName(p.reads[at + 1].publisherId)) : C.oneAtATime.finish}
      </Button>
      {p.sheet}
    </div>
  );
}

export default BriefingConcept2;
