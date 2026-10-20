"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
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
 * while she reads (Kate, 14 Oct).
 *
 * On web it is one screen, a reading pane (option B, 19 Oct): today's three
 * down the left, each with why it is here and Read once opened, and the open
 * read beside them with its notes in the margin. It opens on the lead, which
 * counts as reading it; there is no front page to go back to. Tablet keeps
 * the phone's layout.
 *
 * It keeps the Briefing's limits: only ever three, no topic tabs, no counts,
 * no times. The pictures are stand-ins until image rights are settled.
 * Publishers are changed in Profile.
 */
function BriefingConcept2Page() {
  const p = useBriefingPage();
  const { viewport } = useViewport();
  const web = viewport === "web";
  const [at, setAt] = useState<number | null>(null);
  /** On web a read is always open: the lead until she picks another. */
  const paneAt = web ? (at ?? 0) : null;
  const { reads, markOpened } = p;
  const showingPane = web && !p.firstVisit && !p.savedView;
  // Showing a read in the pane counts as opening it, the lead included.
  useEffect(() => {
    if (showingPane && paneAt !== null) markOpened(reads[paneAt].id);
    // markOpened is rebuilt every render; the read on show is what matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showingPane, paneAt, reads]);
  if (p.firstVisit) return p.firstVisit;
  // Saved, from the top right: its own page in this one's place.
  if (p.savedView)
    return (
      <>
        {p.savedPage}
        {p.sheet}
      </>
    );

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

  const reader = (i: number, next: ReactNode) => {
    const read = p.reads[i];
    const s = p.stateOf(read.id);
    return (
      <>
        <BriefingReader
          read={read}
          headingId={READ_HEADING}
          article={<BriefingArticle read={read} placement={web ? "margin" : "inline"} />}
          picture={<BriefingPicture place={((i % 3) + 1) as 1 | 2 | 3} publisher={publisherName(read.publisherId)} size="reader" />}
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
        {next}
      </>
    );
  };

  if (paneAt !== null) {
    /** Picks a read in the list, or the next one: it opens beside the list. */
    const show = (i: number) => {
      setAt(i);
      setTimeout(() => document.getElementById(TITLE_ID)?.scrollIntoView({ block: "start" }), 0);
      focusSoon(READ_HEADING);
    };
    return (
      <div className="briefing-page briefing-page--news briefing-page--pane briefing-page--reading">
        <nav className="briefing-pane__side" aria-label={C.oneAtATime.front}>
          {p.header}
          <BriefingFront reads={p.reads} layout="list" current={paneAt} isRead={(id) => Boolean(p.stateOf(id).read)} onOpen={show} />
          <BriefingEnd allRead={p.allRead} headingId="briefing-end">
            <div className="brief-end__links">{p.publishersInProfile}</div>
          </BriefingEnd>
        </nav>
        <div className="briefing-pane__read">
          <ReadCounter at={paneAt + 1} of={total} />
          {reader(
            paneAt,
            paneAt + 1 < total ? (
              <Button fullWidth onClick={() => show(paneAt + 1)}>
                {C.oneAtATime.nextRead(publisherName(p.reads[paneAt + 1].publisherId))}
              </Button>
            ) : null
          )}
        </div>
        {p.sheet}
      </div>
    );
  }

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

  return (
    <div className="briefing-page briefing-page--news briefing-page--reading">
      {p.header}
      <ReadCounter at={at + 1} of={total} onBack={() => go(null)} backLabel={C.oneAtATime.front} />
      {reader(
        at,
        <Button fullWidth onClick={() => go(at + 1 < total ? at + 1 : null)}>
          {at + 1 < total ? C.oneAtATime.nextRead(publisherName(p.reads[at + 1].publisherId)) : C.oneAtATime.finish}
        </Button>
      )}
      {p.sheet}
    </div>
  );
}

// Saved is read from the address (`?view=saved`), which needs a Suspense
// boundary or a full page load stays blank.
export function BriefingConcept2() {
  return (
    <Suspense fallback={null}>
      <BriefingConcept2Page />
    </Suspense>
  );
}

export default BriefingConcept2;
