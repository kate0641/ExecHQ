"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BriefingReader } from "@/components/briefing/BriefingReader";
import { BriefingPicture } from "@/components/briefing/BriefingPicture";
import { PublisherPicker } from "@/components/briefing/PublisherPicker";
import { ReadActions } from "@/components/briefing/ReadActions";
import { Sheet } from "@/components/layout/Sheet";
import { Icon } from "@/components/primitives/Icon";
import { briefingActions, respondHref, useBriefing, type ReadState, type Relevance } from "@/lib/briefing-store";
import { loopActions, useLoop } from "@/lib/loop-store";
import { READ_BRIEFING_STEP } from "@/lib/playbook-links";
import { flowFor, usePlaybook } from "@/lib/playbook-store";
import { addDays } from "@/lib/loop";
import { touchedTag } from "@/lib/library";
import { BRIEFING_COPY as C, EARLIER_SAVED, publisherName, TODAYS_READS, type BriefingRead } from "@/mock/briefing";

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

type Open = { kind: "read"; id: string } | null;

/**
 * The Briefing page's working parts: the page heading, the first visit,
 * today's reads and what she has done with them, the read opened in a sheet,
 * and saved reads. Concept 2 lays the reads out. Publishers are changed in
 * Profile.
 */
export function useBriefingPage() {
  const loop = useLoop();
  const state = useBriefing();
  const [open, setOpen] = useState<Open>(null);
  const [message, setMessage] = useState("");
  // The hand-off lands in the tool flow concept the reviewer last opened.
  const flowConcept = flowFor(usePlaybook());
  const respond = (readId: string, from?: "passage" | "selection") => respondHref(readId, from, flowConcept);

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
  /** Today's reads are saved once she saves one; earlier ones stay saved
   *  until she removes them. */
  const isSaved = (id: string) => (EARLIER_SAVED.some((r) => r.id === id) ? stateOf(id).saved !== false : Boolean(stateOf(id).saved));
  // Saved: today's she saved, then the ones from earlier days until she
  // removes them, newest first, each with when she saved it.
  const savedReads: { read: BriefingRead; when: string; place: 1 | 2 | 3 }[] = [
    ...reads.filter((r) => stateOf(r.id).saved).map((read, i) => ({ read, when: touchedTag(loop.today, loop.today), place: ((i % 3) + 1) as 1 | 2 | 3 })),
    ...EARLIER_SAVED.filter((r) => stateOf(r.id).saved !== false).map((read, i) => ({
      read,
      when: touchedTag(addDays(loop.today, -read.savedDaysAgo), loop.today),
      place: (((i + 1) % 3) + 1) as 1 | 2 | 3,
    })),
  ];
  const pathname = usePathname();
  const view = useSearchParams().get("view");
  const savedHref = `${pathname}?view=saved`;
  const [removed, setRemoved] = useState<string | null>(null);
  const dateLine = C.dateLine(DATE.format(new Date(`${loop.today}T00:00:00Z`)));

  const close = () => setOpen(null);

  /** Opening a read counts as reading it, here or at its publisher. */
  function markOpened(id: string) {
    briefingActions.markRead(id);
    // Only today's reads count towards the Plan's step.
    if (reads.some((r) => r.id === id)) completeStep();
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
        saved={isSaved(read.id)}
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
    <Link href={savedHref} className="briefing-page__saved">
      <Icon name="bookmark" size={18} />
      {C.savedReads.button}
      {savedReads.length ? <span className="briefing-page__saved-count">{savedReads.length}</span> : null}
      <span className="u-visually-hidden">{C.savedReads.count(savedReads.length)}</span>
    </Link>
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

  /** Her first visit: publishers before the first set loads. */
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

  /** Publishers live in Profile. */
  const publishersInProfile = (
    <p className="briefing-page__from">
      <Link href={PROFILE_HREF} className="link link--quiet">
        {C.settings.inProfile}
      </Link>
    </p>
  );

  const openRecord = open?.kind === "read" ? [...reads, ...EARLIER_SAVED].find((r) => r.id === open.id) : undefined;
  const sheetLabel = openRecord?.title ?? "";

  const sheet = (
    <>
      <output className="u-visually-hidden">{message}</output>
      <Sheet open={open !== null} onClose={close} label={sheetLabel} className="briefing-sheet">
        {openRecord ? (
          <BriefingReader read={openRecord} onClose={close} actions={actionsFor(openRecord, { markRead: true })} />
        ) : null}
      </Sheet>
    </>
  );

  /** The Saved page (option B, 14 Oct), at `?view=saved`: back to today's
   *  Briefing, the title and how many, then each read with its picture,
   *  publisher, headline, why it was in her Briefing and when she saved it.
   *  Tapping one opens it in the reader sheet; the bookmark removes it, with
   *  Undo. Only what she saved, never suggestions. */
  const S = C.savedReads;
  const savedPage = (
    <div className="briefing-page saved-page">
      <div className="folder-page__bar">
        <Link href={pathname} className="folder-page__back">
          <Icon name="chevron-left" size={18} />
          {S.back}
        </Link>
      </div>
      <header className="saved-page__head">
        <h1 className="folder-page__title" id={TITLE_ID} tabIndex={-1}>
          {S.title}
        </h1>
        {savedReads.length ? <p className="saved-page__lead">{S.lead(savedReads.length)}</p> : null}
      </header>
      {removed ? (
        <p className="saved-page__removed">
          <output>{S.removed}</output>{" "}
          <button
            type="button"
            className="saved-page__undo"
            onClick={() => {
              briefingActions.setSaved(removed, true);
              const id = removed;
              setRemoved(null);
              setTimeout(() => document.getElementById(`saved-open-${id}`)?.focus(), 0);
            }}
          >
            {S.undo}
          </button>
        </p>
      ) : null}
      {savedReads.length ? (
        <ul className="saved-page__list">
          {savedReads.map(({ read, when, place }) => (
            <li key={read.id} className="saved-page__item">
              <BriefingPicture place={place} publisher={publisherName(read.publisherId)} size="thumb" />
              <button type="button" className="saved-page__open" id={`saved-open-${read.id}`} onClick={() => openRead(read.id)}>
                <span className="saved-page__publisher">{publisherName(read.publisherId)}</span>
                <span className="saved-page__headline">{read.title}</span>
                <span className="saved-page__why">{read.reason}</span>
                <span className="saved-page__when">
                  {S.savedWhen} <span className="saved-page__tag">{when}</span>
                </span>
              </button>
              <button
                type="button"
                className="saved-page__remove"
                aria-label={S.remove(read.title)}
                onClick={() => {
                  briefingActions.setSaved(read.id, false);
                  setRemoved(read.id);
                  setTimeout(() => document.querySelector<HTMLElement>(".saved-page__undo")?.focus(), 0);
                }}
              >
                <Icon name="bookmark" size={20} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="saved-page__empty">
          <p className="saved-page__empty-heading">{S.emptyHeading}</p>
          <p className="saved-page__empty-body">{S.empty}</p>
        </div>
      )}
    </div>
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
    publishersInProfile,
    sheet,
    /** `?view=saved`: the concept shows the Saved page in its place. */
    savedView: view === "saved" && state.publishers !== null,
    savedPage,
  };
}
