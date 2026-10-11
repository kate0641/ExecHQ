"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BriefingEnd } from "@/components/briefing/BriefingEnd";
import { BriefingReadCard } from "@/components/briefing/BriefingReadCard";
import { PassageNote } from "@/components/briefing/PassageNote";
import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/primitives/Icon";
import { useViewport } from "@/lib/viewport-context";
import { BRIEFING_COPY, publisherName, type BriefingRead } from "@/mock/briefing";
import { useBriefingPage } from "../useBriefingPage";

const C = BRIEFING_COPY.passage;

/** Web only: the standfirst stands in for the article's text, and selecting
 *  some of it offers a response to that selection. The pre-highlighted
 *  passage stays, so the keyboard and a phone have the same way in. */
function OwnSelection({ read, href }: { read: BriefingRead; href: string }) {
  const [selected, setSelected] = useState(false);
  const text = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    function check() {
      const selection = document.getSelection();
      const node = selection?.anchorNode ?? null;
      const inside = node !== null && Boolean(text.current?.contains(node));
      // A selection elsewhere leaves the button where it is, so moving to it
      // does not take it away.
      if (inside) setSelected((selection?.toString().trim().length ?? 0) > 0);
    }
    document.addEventListener("selectionchange", check);
    return () => document.removeEventListener("selectionchange", check);
  }, []);
  return (
    <div className="briefing-annotated__own">
      <p className="briefing-annotated__text" ref={text}>
        {read.standfirst}
      </p>
      {selected ? (
        <div className="briefing-annotated__selection">
          <Link href={href} className="btn btn--secondary btn--sm">
            <Icon name="pencil" size={16} />
            {C.selection}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Daily Briefing, Concept 3 — Annotated. The wild card.
 *
 * Each read carries one passage, chosen for her and highlighted, with
 * ExecHQ's note on it. Margins don't exist on a phone, so on mobile and
 * tablet the note sits right under the passage as a callout; on web it moves
 * into the margin. Tapping the passage opens a sheet with "Respond to this",
 * which starts Thought Leadership Builder from that passage. On web she can
 * also select her own passage, which in the product needs the whole article
 * in ExecHQ, and so a licence from the publisher.
 *
 * The three reads are stacked, so the page reads as a finished set with the
 * close at its foot. Publishers are changed in Profile.
 */
export function BriefingConcept3() {
  const p = useBriefingPage();
  const web = useViewport().viewport === "web";
  const [passageOf, setPassageOf] = useState<BriefingRead | null>(null);
  if (p.firstVisit) return p.firstVisit;

  return (
    <div className="briefing-page briefing-page--annotated">
      {p.header}
      <ol className="briefing-annotated">
        {p.reads.map((read) => (
          <li key={read.id} className="briefing-annotated__item">
            <BriefingReadCard read={read} layout="stack" isRead={p.stateOf(read.id).read} onOpen={() => p.openRead(read.id)}>
              <PassageNote read={read} placement={web ? "margin" : "inline"} onOpen={() => setPassageOf(read)} />
              {web ? <OwnSelection read={read} href={p.respond(read.id, "selection")} /> : null}
              {p.actionsFor(read, { noRespond: true })}
            </BriefingReadCard>
          </li>
        ))}
      </ol>
      <BriefingEnd headingId="briefing-end">
        <div className="brief-end__links">
          {p.savedLink}
          {p.publishersInProfile}
        </div>
      </BriefingEnd>

      <Sheet open={passageOf !== null} onClose={() => setPassageOf(null)} label={C.sheetHeading} className="briefing-sheet">
        {passageOf ? (
          <div className="passage-sheet">
            <h2 className="passage-sheet__heading">{C.sheetHeading}</h2>
            <figure className="passage-sheet__figure">
              <blockquote className="passage-sheet__quote">{passageOf.passage}</blockquote>
              <figcaption className="passage-sheet__source">
                {BRIEFING_COPY.respond.sourceLine(passageOf.title, publisherName(passageOf.publisherId))}
              </figcaption>
            </figure>
            <Link href={p.respond(passageOf.id, "passage")} className="btn btn--primary btn--md btn--full">
              {C.respond}
            </Link>
            <p className="passage-sheet__hint">{C.respondHint}</p>
          </div>
        ) : null}
      </Sheet>
      {p.sheet}
    </div>
  );
}

export default BriefingConcept3;
