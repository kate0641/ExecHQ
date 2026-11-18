"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/primitives/Icon";
import { setColorMode, useColorMode } from "@/lib/color-mode";

/**
 * Turns the brand colours on and off. Off (greyscale) is the default, so a
 * reviewer sees structure and hierarchy before colour.
 *
 * A single button with `aria-pressed`: pressed means colour is showing. On the
 * hub and the showroom, which always show colour, it is disabled with the
 * reason, like the viewport options on a web-only page.
 */
export function ColorSwitch() {
  const { selected, mode, locked } = useColorMode();
  const [announcement, setAnnouncement] = useState("");
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (!hasInteracted.current) return;
    setAnnouncement(mode === "on" ? "Colour on." : "Colour off. Greyscale.");
  }, [mode]);

  const label = locked
    ? "Colour is always on in the hub and the showroom"
    : mode === "on"
      ? "Colour on. Switch to greyscale"
      : "Greyscale. Switch colour on";

  return (
    <>
      <button
        type="button"
        className="devtools__color"
        aria-pressed={mode === "on"}
        disabled={locked}
        title={label}
        onClick={() => {
          hasInteracted.current = true;
          setColorMode(selected === "on" ? "off" : "on");
        }}
      >
        <Icon name="contrast" size={17} />
        <span className="u-visually-hidden">{label}</span>
      </button>
      <output className="u-visually-hidden">{announcement}</output>
    </>
  );
}

export default ColorSwitch;
