"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Icon } from "@/components/primitives/Icon";
import { DATA_POINTS, ENTERPRISE_COPY, WINDOWS, type DataPointId, type WindowId } from "@/mock/enterprise";

const C = ENTERPRISE_COPY.definition;

export interface FigurePopoverProps {
  id: DataPointId;
  window: WindowId;
  onClose: () => void;
  /** The info icon that opened it: focus goes back to it, and pressing it is
   *  not a press outside. */
  anchor?: RefObject<HTMLElement | null>;
  /** Catalogue only: drawn in the flow under its example, not floating. */
  inline?: boolean;
  className?: string;
}

/** The screen it must stay on: the simulated device when there is one. */
function boundaryOf(el: HTMLElement): { right: number; bottom: number; top: number } {
  const screen = el.closest(".device__screen");
  if (screen) return screen.getBoundingClientRect();
  return { top: 0, right: window.innerWidth, bottom: window.innerHeight };
}

/**
 * How a figure is measured, beside the info icon that opened it (Kate,
 * 2026-10-20): its name, one sentence of what it measures, where the number
 * comes from and the window it covers. Nothing else, so it reads at a
 * glance; the privacy rule is said once for the page, not on every figure.
 *
 * A non-modal `<dialog open>`. It floats over the page so nothing moves, opens below
 * the icon and flips above or to the other side to stay on screen. Focus
 * moves into it; Escape or the close button shuts it and puts focus back on
 * the icon; a press outside, or Tab moving out, shuts it and leaves focus
 * where it went.
 */
export function FigurePopover({ id, window, onClose, anchor, inline = false, className }: FigurePopoverProps) {
  const panel = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const [place, setPlace] = useState<{ above: boolean; end: boolean }>({ above: false, end: false });
  const point = DATA_POINTS[id];
  const covers = point.sinceLaunch || window === "launch" ? C.coversSinceLaunch : C.covers(WINDOWS[window].long);

  useLayoutEffect(() => {
    const el = panel.current;
    if (!el || inline) return;
    const box = boundaryOf(el);
    const rect = el.getBoundingClientRect();
    const edge = 8;
    setPlace({
      end: rect.right > box.right - edge,
      above: rect.bottom > box.bottom - edge && rect.top - rect.height > box.top + edge,
    });
  }, [inline]);

  useEffect(() => {
    if (!inline) panel.current?.focus();
  }, [inline]);

  // A press outside shuts it; so does Tab moving out to anything but its own
  // icon. Escape, from inside it or on the icon, shuts it and puts focus back
  // on the icon.
  useEffect(() => {
    const el = panel.current;
    if (inline || !el) return;
    const inside = (node: EventTarget | null) =>
      node instanceof Node && (el.contains(node) || Boolean(anchor?.current?.contains(node)));
    function onPointer(event: PointerEvent) {
      if (!inside(event.target)) onClose();
    }
    function onFocusOut(event: FocusEvent) {
      if (event.relatedTarget && !inside(event.relatedTarget)) onClose();
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape" || !inside(document.activeElement)) return;
      event.stopPropagation();
      onClose();
      anchor?.current?.focus();
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      el.removeEventListener("focusout", onFocusOut);
    };
  }, [inline, anchor, onClose]);

  function close() {
    onClose();
    anchor?.current?.focus();
  }

  const classes = [
    "figure-popover",
    inline ? "figure-popover--inline" : null,
    place.above ? "figure-popover--above" : null,
    place.end ? "figure-popover--end" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog ref={panel} open className={classes} aria-labelledby={headingId} tabIndex={-1}>
      <div className="figure-popover__head">
        <h3 className="figure-popover__heading" id={headingId}>
          {point.label}
        </h3>
        <button type="button" className="figure-popover__close" aria-label={C.close} onClick={close}>
          <Icon name="close" size={16} />
        </button>
      </div>
      <p className="figure-popover__measures">{point.definition}</p>
      <p className="figure-popover__meta">
        {point.source} {covers}
      </p>
    </dialog>
  );
}

export default FigurePopover;
