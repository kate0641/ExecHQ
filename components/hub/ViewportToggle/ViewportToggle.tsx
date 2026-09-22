"use client";

import { useEffect, useRef, useState } from "react";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Icon } from "@/components/primitives/Icon";
import {
  VIEWPORTS,
  VIEWPORT_LABELS,
  useViewport,
  type Viewport,
} from "@/lib/viewport-context";

/** Shown in the tooltip and read out with the option, so a glyph is never the
 *  only thing identifying a viewport. */
const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  web: "fills the width",
  tablet: "820px",
  mobile: "390px",
};

/**
 * Switches the canvas between Web, Tablet and Mobile.
 *
 * The toggle only sets state — all responsive CSS is written against the
 * `data-viewport` attribute the shell puts on the wrapper, never `@media`.
 *
 * It renders as a vertical stack of icons in the dock. The labels are still
 * there: they are the accessible name of each option and its tooltip. On a
 * web-only route the Mobile and Tablet options are disabled and carry the
 * reason, which reaches assistive technology through aria-describedby and
 * pointer users through the tooltip.
 */
export function ViewportToggle() {
  const { selected, viewport, setViewport, locked, lockReason } = useViewport();
  const [announcement, setAnnouncement] = useState("");
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (!hasInteracted.current) return;
    setAnnouncement(`Viewport: ${VIEWPORT_LABELS[viewport]}`);
  }, [viewport]);

  const options = VIEWPORTS.map((option) => {
    const unavailable = locked && option !== "web";
    return {
      value: option,
      label: VIEWPORT_LABELS[option],
      icon: <Icon name={option} size={17} />,
      disabled: unavailable,
      description:
        unavailable && lockReason
          ? `Unavailable. ${lockReason}`
          : VIEWPORT_WIDTHS[option],
    };
  });

  return (
    <div className="viewport-toggle">
      <ToggleGroup
        label="Viewport"
        labelHidden
        size="sm"
        orientation="vertical"
        iconOnly
        options={options}
        value={locked ? "web" : selected}
        onChange={(next) => {
          hasInteracted.current = true;
          setViewport(next as Viewport);
        }}
      />
      <output className="u-visually-hidden">{announcement}</output>
    </div>
  );
}

export default ViewportToggle;
