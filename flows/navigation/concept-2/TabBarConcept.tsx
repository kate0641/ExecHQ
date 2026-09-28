"use client";

import { useEffect, useRef, useState } from "react";
import { IconLink } from "@/components/navigation/IconLink";
import { TabBar } from "@/components/navigation/TabBar";
import { useLoop } from "@/lib/loop-store";
import { useViewport } from "@/lib/viewport-context";
import type { NavConceptProps } from "../types";

/**
 * Navigation Concept 2 — Tab bar.
 *
 * Home, Plan, Toolbox and Briefing in the bar; Profile as an icon in the top
 * right of the header, by decision on 2026-09-28. The bar sits at the bottom
 * on mobile and tablet and moves into the header on web.
 *
 * What the icons show comes from the live Loop, so answering a follow-up
 * takes the dot off Home everywhere at once.
 */

/** Scroll distance, in px, before a direction counts. */
const TUCK_THRESHOLD = 6;

function useLoopSignals() {
  const loop = useLoop();
  return {
    followUpDue: Boolean(loop.followUp),
    draftOpen: loop.records.some((r) => r.state === "drafted" || r.state === "in-progress"),
    day: Number(loop.today.slice(8, 10)),
  };
}

const barItems = (destinations: NavConceptProps["destinations"]) =>
  destinations.filter((d) => d.flowSlug !== "profile");

/** The bar itself, on mobile and tablet. On web it is in the header. */
export function TabBarNav({ destinations, currentFlow, label }: NavConceptProps) {
  const { viewport } = useViewport();
  const signals = useLoopSignals();
  const hostRef = useRef<HTMLDivElement>(null);
  // Kept with the page it belongs to, so a new page starts with the labels
  // showing without resetting state in an effect.
  const [tuck, setTuck] = useState({ flow: currentFlow, on: false });
  const tucked = tuck.flow === currentFlow && tuck.on;

  // Tuck while reading: labels fold away on the way down, back on the way up.
  useEffect(() => {
    if (viewport === "web") return;
    const scroller = hostRef.current?.closest(".device__content");
    if (!scroller) return;
    let last = scroller.scrollTop;
    function onScroll() {
      const y = scroller!.scrollTop;
      if (y > last + TUCK_THRESHOLD && y > 40) setTuck({ flow: currentFlow, on: true });
      else if (y < last - TUCK_THRESHOLD || y < 20) setTuck({ flow: currentFlow, on: false });
      last = y;
    }
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [viewport, currentFlow]);

  if (viewport === "web") return null;
  return (
    <div className="tab-bar-host" ref={hostRef}>
      <TabBar
        items={barItems(destinations)}
        current={currentFlow}
        layout={viewport === "tablet" ? "inline" : "stacked"}
        label={label}
        tucked={tucked}
        continuous
        {...signals}
      />
    </div>
  );
}

/** Top right of the header: the pills on web, then the Profile icon. */
export function TabBarHeaderEnd({ destinations, currentFlow, label }: NavConceptProps) {
  const { viewport } = useViewport();
  const signals = useLoopSignals();
  const profile = destinations.find((d) => d.flowSlug === "profile");
  return (
    <>
      {viewport === "web" ? (
        <TabBar items={barItems(destinations)} current={currentFlow} layout="header" label={label} continuous {...signals} />
      ) : null}
      {profile ? (
        <IconLink href={profile.href} label={profile.label} icon="person" current={currentFlow === "profile"} />
      ) : null}
    </>
  );
}
