"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { BriefingReader } from "@/components/briefing/BriefingReader";
import { BriefingReadCard } from "@/components/briefing/BriefingReadCard";
import { PublisherPicker } from "@/components/briefing/PublisherPicker";
import { ReadActions } from "@/components/briefing/ReadActions";
import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/primitives/Icon";
import { briefingActions, respondHref, useBriefing, type ReadState, type Relevance } from "@/lib/briefing-store";
import { loopActions, useLoop } from "@/lib/loop-store";
import { READ_BRIEFING_STEP } from "@/lib/toolbox-links";
import { useToolbox } from "@/lib/toolbox-store";
import { BRIEFING_COPY as C, publisherName, TODAYS_READS, type BriefingRead } from "@/mock/briefing";

export const PROFILE_HREF = "/profile/concept-1";
export const TITLE_ID = "briefing-title";

const DATE = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** The address does not change while the page is open, so nothing to watch. */
const noSubscribe = () => () => {};

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
  // The hand-off lands in the Toolbox concept the reviewer last opened.
  const toolboxConcept = useToolbox().concept ?? "concept-2";
  const respond = (readId: string, from?: "passage" | "selection") => respondHref(readId, from, toolboxConcept);

  // Opened from the Plan's "Read today's Briefing": reading one item, or
  // starting a post from one, completes the step. Opened any other way, the
  // Plan does not change.
  const fromPlan = useSyncExternalStore(
    noSubscribe,
    () => new URLSearchParams(window.location.search).get("from") === "plan",
    () => false
  );
  const completeStep = () => {
    if (!fromPlan || loop.tasks?.[READ_BRIEFING_STEP]?.doneOn) return;
    loopActions.completeTask(READ_BRIEFING_STEP);
    setMessage(C.stepDone);
  };

  const reads = TODAYS_READS;
  const stateOf = (id: string): ReadState => state.reads[id] ?? {};
  const allRead = reads.every((r) => stateOf(r.id).read);
  const saved = reads.filter((r) => stateOf(r.id).saved);
  const publishers = state.publishers ?? [];
  const dateLine = C.dateLine(DATE.format(new Date(`${loop.today}T00:00:00Z`)));

  const close = () => setOpen(null);

  /** Opening a read counts as reading it, here or at its publisher. */
  function markOpened(id: string) {
    briefingActions.markRead(id);
    completeStep();
  }

  function openRead(id: string) {
    markOpened(id);
    setOpen({ kind: "read", id });
  }

  function actionsFor(read: BriefingRead, options: { markRead?: boolean; compact?: boolean } = {}): ReactNode {
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
        onMarkRead={
          options.markRead
            ? (next) => {
                briefingActions.markRead(read.id, next);
                if (next) completeStep();
              }
            : undefined
        }
        relevance={s.relevance}
        onRelevance={(next) => briefingActions.setRelevance(read.id, next)}
        respondHref={respond(read.id)}
        onRespond={completeStep}
        compact={options.compact}
      />
    );
  }

  /** Saved, at the top right of the page every day, so a read she kept is
   *  always one tap away (Kate, 14 Oct). It opens her saved reads. */
  const savedButton = (
    <button type="button" className="briefing-page__saved" onClick={() => setOpen({ kind: "saved" })} aria-haspopup="dialog">
      <Icon name="bookmark" size={18} />
      {C.savedReads.button}
      {saved.length ? <span className="briefing-page__saved-count">{saved.length}</span> : null}
      <span className="u-visually-hidden">{C.savedReads.count(saved.length)}</span>
    </button>
  );

  const header = (
    <header className="briefing-page__header">
      <div className="briefing-page__head-text">
        <h1 className="briefing-page__title" id={TITLE_ID} tabIndex={-1}>
          {C.heading}
        </h1>
        <p className="briefing-page__date">{dateLine}</p>
      </div>
      {state.publishers === null ? null : savedButton}
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

  /** Save and relevance with what they did said in the live region, for
   *  pages with their own controls (Concept 2's reader bar). */
  const setSaved = (id: string, saved: boolean) => {
    briefingActions.setSaved(id, saved);
    setMessage(saved ? C.read.savedNotice : C.read.unsavedNotice);
  };
  const setRelevance = (id: string, relevance: Relevance | undefined) => {
    briefingActions.setRelevance(id, relevance);
    setMessage(relevance === "yes" ? C.relevance.ackYes : relevance === "no" ? C.relevance.ackNo : "");
  };

  return {
    reads,
    respond,
    completeStep,
    setSaved,
    setRelevance,
    stateOf,
    allRead,
    header,
    firstVisit,
    openRead,
    markOpened,
    actionsFor,
    publishersLine,
    publishersInProfile,
    sheet,
  };
}
