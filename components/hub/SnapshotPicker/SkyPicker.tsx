"use client";

import { useSyncExternalStore } from "react";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { SKIES, pickSky, pickedSky, subscribeSky, type Sky } from "./sky-store";

const LABELS: Record<Sky, string> = {
  dawn: "Dawn sky",
  day: "Day sky",
  dusk: "Dusk sky",
  night: "Night sky",
};

/* A sun rising, the sun, a sun setting and a moon, drawn in the icon
   library's line: 1.5 stroke, round ends. */
const GLYPHS: Record<Sky, React.ReactNode> = {
  dawn: (
    <>
      <path d="M2.5 14h15M6 14a4 4 0 0 1 8 0M10 4.5v3M7.5 6 10 4.5 12.5 6" />
    </>
  ),
  day: (
    <>
      <circle cx="10" cy="10" r="3.25" />
      <path d="M10 2.5v1.5M10 16v1.5M2.5 10H4M16 10h1.5M4.7 4.7l1.06 1.06M14.24 14.24l1.06 1.06M4.7 15.3l1.06-1.06M14.24 5.76l1.06-1.06" />
    </>
  ),
  dusk: (
    <>
      <path d="M2.5 14h15M6 14a4 4 0 0 1 8 0M10 7.5v-3M7.5 6 10 7.5 12.5 6" />
    </>
  ),
  night: <path d="M15.5 12.2A6 6 0 0 1 7.8 4.5a6 6 0 1 0 7.7 7.7Z" />,
};

/** The sky her clock gives, as Home works it out. */
function clockSky(): Sky {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) return "dawn";
  if (hour >= 9 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

/**
 * The reviewer's sky switcher, under the homepage states: shows Home's header
 * at dawn, day, dusk or night whatever the hour, so one change can be checked
 * in all four. Before a pick, the sky Home is showing is highlighted.
 */
export function SkyPicker() {
  const sky = useSyncExternalStore(
    subscribeSky,
    () => {
      const asked = SKIES.find((s) => s === new URLSearchParams(window.location.search).get("sky"));
      return pickedSky() ?? asked ?? clockSky();
    },
    () => "day" as Sky,
  );

  return (
    <>
      <span className="devtools__rule" aria-hidden="true" />
      <ToggleGroup
        label="Home's sky"
        labelHidden
        size="sm"
        orientation="vertical"
        iconOnly
        options={SKIES.map((value) => ({
          value,
          label: LABELS[value],
          icon: (
            <svg
              viewBox="0 0 20 20"
              width={18}
              height={18}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {GLYPHS[value]}
            </svg>
          ),
        }))}
        value={sky}
        onChange={(next) => pickSky(next as Sky)}
      />
    </>
  );
}
