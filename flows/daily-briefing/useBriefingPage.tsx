"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { BriefingReader } from "@/components/briefing/BriefingReader";
import { BriefingReadCard } from "@/components/briefing/BriefingReadCard";
import { PublisherPicker } from "@/components/briefing/PublisherPicker";
import { ReadActions } from "@/components/briefing/ReadActions";
import { Sheet } from "@/components/layout/Sheet";
import { briefingActions, respondHref, useBriefing, type ReadState } from "@/lib/briefing-store";
import { useLoop } from "@/lib/loop-store";
import { BRIEFING_COPY as C, publisherName, TODAYS_READS, type BriefingRead } from "@/mock/briefing";

export const PROFILE_HREF = "/profile/concept-1";
export const TITLE_ID = "briefing-title";

const DATE = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** Moves focus to an element once it is on screen: a heading after the page
 *  changes under her, so a screen reader starts from the new top. */
export function focusSoon(id: string): void {
  setTimeout(() => document.getElementById(id)?.focus({ preventScroll: true }), 0);
}

type Open = { kind: "read"; id: string } | { kind: "saved" } | { kind: "publishers" } | null;

/**
 * Everything the three Briefing concepts share: the page heading, the first
 * visit, today's reads and what she has done with them, the read opened in a
 * sheet, saved reads, and the publishers sheet (Concept A only puts it on the
 * page). Each concept lays the reads out its own way.
 */
export function useBriefingPage() {
  const loop = useLoop();
  const state = useBriefing();
  const [open, setOpen] = useState<Open>(null);
  const [message, setMessage] = useState("");

  const reads = TODAYS_READS;
  const stateOf = (id: string): ReadState => state.reads[id] ?? {};
  const allRead = reads.every((r) => stateOf(r.id).read);
  const saved = reads.filter((r) => stateOf(r.id).saved);
  const publishers = state.publishers ?? [];
  const dateLine = C.dateLine(DATE.format(new Date(`${loop.today}T00:00:00Z`)));

  const close = () => setOpen(null);

  /** Opening a read counts as reading it. */
  function openRead(id: string) {
    briefingActions.markRead(id);
    setOpen({ kind: "read", id });
  }

  function actionsFor(read: BriefingRead, options: { markRead?: boolean; compact?: boolean; noRespond?: boolean } = {}): ReactNode {
    const s = stateOf(read.id);
    const announceSave = (next: boolean) => setMessage(next ? C.read.savedNotice : C.read.unsavedNotice);
    return (
      <ReadActions
        title={read.title}
        saved={Boolean(s.saved)}
        onSave={(next) => {
          briefingActions.setSaved(read.id, next);
          announceSave(next);
        }}
        isRead={Boolean(s.read)}
        onMarkRead={options.markRead ? (next) => briefingActions.markRead(read.id, next) : undefined}
        relevance={s.relevance}
        onRelevance={(next) => briefingActions.setRelevance(read.id, next)}
        respondHref={options.noRespond ? undefined : respondHref(read.id)}
        compact={options.compact}
        onOpen={options.compact ? () => openRead(read.id) : undefined}
      />
    );
  }

  const header = (
    <header className="briefing-page__header">
      <h1 className="briefing-page__title" id={TITLE_ID} tabIndex={-1}>
        {C.heading}
      </h1>
      <p className="briefing-page__date">{dateLine}</p>
    </header>
  );

  /** Her first visit: publishers before the first set loads. The same in all
   *  three concepts, so the riskiest state can be compared side by side. */
  const firstVisit =
    state.publishers === null ? (
      <div className="briefing-page briefing-page--first">
        {header}
        <PublisherPicker
          mode="first"
          onDone={(ids) => {
            briefingActions.choosePublishers(ids);
            focusSoon(TITLE_ID);
          }}
        />
      </div>
    ) : null;

  const savedLink =
    saved.length > 0 ? (
      <button type="button" className="briefing-page__saved" onClick={() => setOpen({ kind: "saved" })}>
        {C.savedReads.link(saved.length)}
      </button>
    ) : null;

  /** Where her reads come from, and Change, on the page (Concept A). */
  const publishersLine = (
    <p className="briefing-page__from">
      {C.settings.fromLine(publishers.map(publisherName))}
      {" · "}
      <button type="button" className="briefing-page__change" onClick={() => setOpen({ kind: "publishers" })}>
        {C.settings.changePublishers}
      </button>
    </p>
  );

  /** Publishers live in Profile (Concepts B and C). */
  const publishersInProfile = (
    <p className="briefing-page__from">
      <Link href={PROFILE_HREF} className="link link--quiet">
        {C.settings.inProfile}
      </Link>
    </p>
  );

  const openRecord = open?.kind === "read" ? reads.find((r) => r.id === open.id) : undefined;
  const sheetLabel =
    open?.kind === "read" ? (openRecord?.title ?? "") : open?.kind === "saved" ? C.savedReads.heading : open ? C.settings.publishersHeading : "";

  const sheet = (
    <>
      <output className="u-visually-hidden">{message}</output>
      <Sheet open={open !== null} onClose={close} label={sheetLabel} className="briefing-sheet">
      {openRecord ? (
        <BriefingReader read={openRecord} onClose={close} actions={actionsFor(openRecord, { markRead: true })} />
      ) : open?.kind === "saved" ? (
        <div className="briefing-saved">
          <h2 className="briefing-saved__heading">{C.savedReads.heading}</h2>
          {saved.length ? (
            <ul className="briefing-saved__list">
              {saved.map((read) => (
                <li key={read.id}>
                  <BriefingReadCard read={read} layout="row" headingLevel={3} isRead={stateOf(read.id).read} onOpen={() => openRead(read.id)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="briefing-saved__empty">{C.savedReads.empty}</p>
          )}
        </div>
      ) : open?.kind === "publishers" ? (
        <PublisherPicker
          mode="settings"
          chosen={publishers}
          onCancel={close}
          onDone={(ids) => {
            briefingActions.choosePublishers(ids);
            setMessage(C.settings.publishersSaved);
            close();
          }}
        />
      ) : null}
      </Sheet>
    </>
  );

  return {
    reads,
    stateOf,
    allRead,
    header,
    firstVisit,
    openRead,
    actionsFor,
    savedLink,
    publishersLine,
    publishersInProfile,
    sheet,
  };
}
