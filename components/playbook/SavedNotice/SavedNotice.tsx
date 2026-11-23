"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/primitives/Icon";

export interface SavedNoticeProps {
  /** "Draft saved to your library". */
  title: string;
  /** "You can find it any time." */
  body: string;
  /** "Open your library". */
  linkLabel: string;
  href: string;
  /** The ×'s name: "Close". */
  closeLabel: string;
  /** Called when it goes: on its own, by the ×, Escape, a tap outside it, or the link. */
  onClose: () => void;
  /** How long it stays, in ms, while nothing holds it. */
  duration?: number;
  /** For the catalogue: drawn in place, staying until closed. */
  demo?: boolean;
  className?: string;
}

/**
 * Says a new draft is safe (the 18 November UX review): a card over the
 * draft with a check that draws itself, "Draft saved to your library", and a
 * link to the library. It goes on its own after about five seconds, sooner
 * with the × or Escape or a tap outside it; while the pointer or focus is on
 * it, it waits (WCAG 2.2.1). It never takes focus, so she can carry on
 * reading her draft; it is announced politely.
 */
export function SavedNotice({ title, body, linkLabel, href, closeLabel, onClose, duration = 5000, demo = false, className }: SavedNoticeProps) {
  const titleId = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLElement>(null);
  const [screen, setScreen] = useState<HTMLElement | null>(null);
  const [held, setHeld] = useState(false);
  const [leaving, setLeaving] = useState(false);
  // Filled a moment after it appears, so the announcement fires.
  const [said, setSaid] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setSaid(true), 100);
    return () => window.clearTimeout(t);
  }, []);
  const close = useRef(onClose);
  useEffect(() => {
    close.current = onClose;
  }, [onClose]);

  // Drawn over the device screen it is shown on, like the tour; the whole page otherwise.
  useEffect(() => {
    if (demo) return;
    setScreen(anchor.current?.closest<HTMLElement>(".device__screen") ?? document.body);
  }, [demo]);

  // Counts down only while nothing holds it; fades for the last moment.
  useEffect(() => {
    if (demo || held) return;
    const fade = window.setTimeout(() => setLeaving(true), Math.max(0, duration - 200));
    const done = window.setTimeout(() => close.current(), duration);
    return () => {
      window.clearTimeout(fade);
      window.clearTimeout(done);
      setLeaving(false);
    };
  }, [demo, held, duration]);

  useEffect(() => {
    if (demo) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close.current();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [demo]);

  const notice = (
    <div
      className={["saved-notice", demo ? "saved-notice--demo" : null, leaving ? "is-leaving" : null, className].filter(Boolean).join(" ")}
      onPointerDown={(event) => {
        if (!demo && !card.current?.contains(event.target as Node)) close.current();
      }}
    >
      {/* Announced politely, without taking focus from the draft. */}
      <output className="u-visually-hidden">{said ? `${title}. ${body}` : ""}</output>
      <section
        ref={card}
        className="saved-notice__card"
        aria-labelledby={titleId}
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setHeld(false);
        }}
      >
        <svg className="saved-notice__check" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <circle className="saved-notice__ring" cx="24" cy="24" r="22" />
          <path className="saved-notice__tick" d="M14 25l7 7 13-15" />
        </svg>
        <p className="saved-notice__title" id={titleId}>
          {title}
        </p>
        <p className="saved-notice__body">{body}</p>
        <Link href={href} className="text-link saved-notice__link" onClick={() => close.current()}>
          {linkLabel}
        </Link>
        <button type="button" className="saved-notice__close" aria-label={closeLabel} onClick={() => close.current()}>
          <Icon name="close" size={18} />
        </button>
      </section>
    </div>
  );

  if (demo) return notice;
  return (
    <>
      <span ref={anchor} hidden />
      {screen ? createPortal(notice, screen) : null}
    </>
  );
}

export default SavedNotice;
