"use client";

import { useEffect, useId, useRef } from "react";

/** Where the lit part sits, in px from the top-left of the screen it's drawn on. */
export interface TourRect {
  top: number;
  left: number;
  width: number;
  height: number;
  /** Matches the corners of what it lights: a pill's, a card's. */
  radius?: number;
}

export interface FirstVisitTourProps {
  /** What is lit, or null while it's being found. */
  rect: TourRect | null;
  /** Card above the lit part (it sits low on the screen) or below it. */
  placement: "above" | "below";
  counter: string;
  title: string;
  body: string;
  nextLabel: string;
  skipLabel: string;
  onNext: () => void;
  onSkip: () => void;
  /** The tour's own name, for the dialog. */
  label: string;
  className?: string;
}

/** Space between the lit part and the card. */
const GAP = 14;
/** Room around what is lit, so its edge isn't clipped by the outline. */
const PAD = 6;

/**
 * One stop of a first-visit tour (Kate, 2026-11-12): the screen dims, one
 * thing is lit, and a short card beside it says what it is. A dialog: focus
 * goes to its main button at each stop, Escape skips the tour, and nothing
 * behind can be pressed until it ends. Drawn over a device screen by whoever
 * runs the tour, which also finds and measures what to light.
 */
export function FirstVisitTour({
  rect,
  placement,
  counter,
  title,
  body,
  nextLabel,
  skipLabel,
  onNext,
  onSkip,
  label,
  className,
}: FirstVisitTourProps) {
  const titleId = useId();
  const next = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (rect) next.current?.focus();
  }, [title, rect]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      onSkip();
    }
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onSkip]);

  const hole = rect
    ? {
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        borderRadius: (rect.radius ?? 12) + PAD,
      }
    : null;
  const card = hole
    ? placement === "above"
      ? { bottom: `calc(100% - ${hole.top - GAP}px)` }
      : { top: hole.top + hole.height + GAP }
    : { top: "40%" };

  return (
    // A native dialog, open from the start; its own box styles are reset in the stylesheet.
    <dialog open className={["tour", className].filter(Boolean).join(" ")} aria-modal="true" aria-label={label} aria-describedby={titleId}>
      {/* Catches every press behind the tour. */}
      <div className="tour__block" aria-hidden="true" />
      {hole ? <div className="tour__hole" style={hole} aria-hidden="true" /> : <div className="tour__dim" aria-hidden="true" />}
      <div className={`tour__card tour__card--${placement}`} style={card}>
        <p className="tour__counter">{counter}</p>
        <p className="tour__title" id={titleId}>
          {title}
        </p>
        <p className="tour__body">{body}</p>
        <div className="tour__actions">
          <button type="button" className="tour__skip" onClick={onSkip}>
            {skipLabel}
          </button>
          <button type="button" className="tour__next" ref={next} onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default FirstVisitTour;
