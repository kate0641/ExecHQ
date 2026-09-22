"use client";

import { useEffect, useRef, useState } from "react";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import {
  VIEWPORTS,
  VIEWPORT_LABELS,
  useViewport,
  type Viewport,
} from "@/lib/viewport-context";

/**
 * Switches the canvas between Web, Tablet and Mobile.
 *
 * The toggle only sets state — all responsive CSS is written against the
 * `data-viewport` attribute the shell puts on the wrapper, never `@media`.
 *
 * On a web-only flow the Mobile and Tablet options are visibly disabled and
 * each carries the reason via aria-describedby, and the reason is also shown
 * on screen next to the toggle.
 */
export function ViewportToggle() {
  const { selected, viewport, setViewport, locked, lockReason } = useViewport();
  const [announcement, setAnnouncement] = useState("");
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (!hasInteracted.current) return;
    setAnnouncement(`Viewport: ${VIEWPORT_LABELS[viewport]}`);
  }, [viewport]);

  const options = VIEWPORTS.map((option) => ({
    value: option,
    label: VIEWPORT_LABELS[option],
    disabled: locked && option !== "web",
    description:
      locked && option !== "web" && lockReason
        ? `Unavailable. ${lockReason}`
        : undefined,
  }));

  return (
    <div className="viewport-toggle">
      <ToggleGroup
        label="Viewport"
        labelHidden
        size="sm"
        options={options}
        value={locked ? "web" : selected}
        onChange={(next) => {
          hasInteracted.current = true;
          setViewport(next as Viewport);
        }}
      />
      {locked && lockReason ? (
        <p className="viewport-toggle__note">{lockReason}</p>
      ) : null}
      <output className="u-visually-hidden">{announcement}</output>
    </div>
  );
}

export default ViewportToggle;
