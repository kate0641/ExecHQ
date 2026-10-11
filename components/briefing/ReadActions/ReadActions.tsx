"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/primitives/Icon";
import type { Relevance } from "@/lib/briefing-store";
import { BRIEFING_COPY as C } from "@/mock/briefing";

export interface ReadActionsProps {
  /** For accessible names: "Save How planning season…". */
  title: string;
  saved: boolean;
  onSave: (saved: boolean) => void;
  /** Shows Mark as read / Mark as not read. Left out where opening or Next
   *  already marks it. */
  isRead?: boolean;
  onMarkRead?: (read: boolean) => void;
  relevance?: Relevance;
  onRelevance: (relevance: Relevance | undefined) => void;
  /** Thought Leadership Builder, with this read as the source. Left out
   *  where she responds another way (Concept 3, from the passage). */
  respondHref?: string;
  onRespond?: () => void;
  /** One row of pills: Read, Save, Write a post. No relevance question and
   *  no hint, for a card that has to stay short (the front page's lead). */
  compact?: boolean;
  /** Compact only: a Read pill first, opening the read. */
  onOpen?: () => void;
  /** Catalogue only: shows a state a static page can't reach, on Save. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * What she can do with a read: save it, mark it read or not, say whether it
 * was worth her time, and write a post about it. Relevance is acknowledged in
 * the moment, in a few words, and can be taken back. Nothing here completes
 * anything: there is no done state on a read.
 */
export function ReadActions({
  title,
  saved,
  onSave,
  isRead,
  onMarkRead,
  relevance,
  onRelevance,
  respondHref,
  onRespond,
  compact = false,
  onOpen,
  demo,
  className,
}: ReadActionsProps) {
  const R = C.relevance;
  // Answering swaps the question for the acknowledgement, and Undo swaps it
  // back, so focus follows to whichever is now there rather than being lost.
  const box = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    box.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [relevance]);
  const answer = (next: Relevance | undefined) => {
    moved.current = true;
    onRelevance(next);
  };
  return (
    <div className={["read-actions", compact ? "read-actions--compact" : null, className].filter(Boolean).join(" ")}>
      <div className="read-actions__row">
        {compact && onOpen ? (
          <button type="button" className="read-actions__toggle read-actions__toggle--primary" onClick={onOpen}>
            {C.read.open}
            <span className="u-visually-hidden">: {title}</span>
          </button>
        ) : null}
        <button
          type="button"
          className={["read-actions__toggle", saved ? "is-on" : null, demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
          aria-pressed={saved}
          onClick={() => onSave(!saved)}
        >
          <Icon name="bookmark" size={16} />
          {saved ? C.read.saved : C.read.save}
          <span className="u-visually-hidden">: {title}</span>
        </button>
        {onMarkRead ? (
          <button type="button" className="read-actions__toggle" onClick={() => onMarkRead(!isRead)}>
            <Icon name={isRead ? "undo" : "check"} size={16} />
            {isRead ? C.read.markUnread : C.read.markRead}
            <span className="u-visually-hidden">: {title}</span>
          </button>
        ) : null}
        {compact && respondHref ? (
          <Link href={respondHref} className="read-actions__toggle" onClick={onRespond}>
            <Icon name="pencil" size={16} />
            {C.respond.action}
          </Link>
        ) : null}
      </div>

      {compact ? null : (
        <div className="read-actions__relevance" ref={box}>
          {relevance ? (
            <p className="read-actions__ack">
              <Icon name="check" size={14} />
              <output>{relevance === "yes" ? R.ackYes : R.ackNo}</output>
              <button type="button" className="read-actions__undo" onClick={() => answer(undefined)}>
                {R.undo}
                <span className="u-visually-hidden">: {title}</span>
              </button>
            </p>
          ) : (
            <fieldset className="read-actions__question">
              <legend className="read-actions__question-text">
                {R.question}
                <span className="u-visually-hidden"> {title}</span>
              </legend>
              <span className="read-actions__answers">
                <button type="button" className="read-actions__answer" onClick={() => answer("yes")}>
                  {R.yes}
                </button>
                <button type="button" className="read-actions__answer" onClick={() => answer("no")}>
                  {R.no}
                </button>
              </span>
            </fieldset>
          )}
        </div>
      )}

      {compact || !respondHref ? null : (
        <Link href={respondHref} className="read-actions__respond" onClick={onRespond}>
          <Icon name="pencil" size={16} />
          <span className="read-actions__respond-text">
            <span className="read-actions__respond-label">{C.respond.action}</span>
            <span className="read-actions__respond-hint">{C.respond.hint}</span>
          </span>
          <Icon name="chevron" size={16} className="read-actions__respond-go" />
        </Link>
      )}
    </div>
  );
}

export default ReadActions;
