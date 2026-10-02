"use client";

import { useState } from "react";
import { ActionSheet } from "@/components/homepage/ActionSheet";
import { BriefingCallout } from "@/components/homepage/BriefingCallout";
import { MapLegend, MapRings } from "@/components/homepage/MapRings";
import { InProgress } from "./InProgress";
import { MapPanel } from "@/components/homepage/MapPanel";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { mapFor, nextNewAction } from "@/lib/map";
import { HOME_COPY as C, MAP_COPY as M } from "@/mock/homepage";
import type { Horizon, LandscapeAction } from "@/mock/plan-stub";

/**
 * Homepage Concept 4 — Combined.
 *
 * Built from the three concepts on 2026-10-02, from Kate's notes. Top to
 * bottom: a line to today's Briefing; the map, three rings with what is in
 * each one under it; what she has in progress (Stage 3); and Your Signal
 * Picture, with a way into the detail on the Plan page (Stage 4).
 *
 * The map shows what she is on and what is still on it. An action she has
 * not started only opens to read about it, where she starts it or says it is
 * not for her; it never goes straight to a tool.
 */

const PLAN = conceptHref("plan", "concept-1");
const TOOLBOX = conceptHref("toolbox-flow", "concept-1");
const BRIEFING = conceptHref("daily-briefing", "concept-1");
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function longDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** "October 2nd": the Briefing's day, the way it is said aloud. */
function ordinalDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  const n = d.getUTCDate();
  const teen = n % 100 >= 11 && n % 100 <= 13;
  const suffix = teen ? "th" : (({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th");
  return `${MONTHS[d.getUTCMonth()]} ${n}${suffix}`;
}

export function HomepageConcept4() {
  const loop = useLoop();
  const [selected, setSelected] = useState<Horizon | null>(null);
  const [sheetAction, setSheetAction] = useState<LandscapeAction | null>(null);
  const [announce, setAnnounce] = useState("");

  const rings = mapFor({ records: loop.records, tasks: loop.tasks, choices: loop.choices, asked: loop.asked });
  const open = rings.find((r) => r.horizon === selected);

  return (
    <div className="map-home">
      <h1 className="u-visually-hidden">Home</h1>
      <div className="map-home__lead">
        <p className="map-home__greeting">
          <b>{C.greeting(loop.account.name ?? "")}</b>
          <span>{longDate(loop.today)}</span>
        </p>
        <BriefingCallout href={BRIEFING} label={M.briefing(ordinalDate(loop.today))} />
        <section className="map-home__section" aria-labelledby="map-heading">
          <h2 className="map-home__heading" id="map-heading">
            {M.heading}
          </h2>
          <MapRings
            rings={rings}
            selected={selected}
            panelId="map-panel"
            onSelect={(h) => {
              setSelected((current) => (current === h ? null : h));
              setAnnounce("");
            }}
          />
          <MapLegend />
          {open ? (
            <MapPanel
              ring={open}
              id="map-panel"
              headingId="map-panel-heading"
              planHref={PLAN}
              onOpenAction={setSheetAction}
              onAsk={
                nextNewAction(open.horizon, loop.asked)
                  ? () => {
                      const add = nextNewAction(open.horizon, loop.asked);
                      loopActions.askForNew(
                        open.segments.map((s) => s.action.id),
                        add?.id
                      );
                      if (add) setAnnounce(M.added(add.title));
                    }
                  : undefined
              }
              noneLeft={!nextNewAction(open.horizon, loop.asked)}
            />
          ) : (
            <p className="map-home__hint">{M.hintPick}</p>
          )}
          <output className="u-visually-hidden">{announce}</output>
        </section>
      </div>
      <div className="map-home__side">
        <InProgress loop={loop} rings={rings} />
      </div>
      <ActionSheet
        open={sheetAction !== null}
        action={sheetAction}
        onClose={() => setSheetAction(null)}
        startHref={TOOLBOX}
        onStart={(a) => {
          loopActions.startAction(a.id);
          setSheetAction(null);
        }}
        onSkip={(a, why) => {
          loopActions.skipAction(a.id, why);
          setSheetAction(null);
          setAnnounce(M.skipped(a.title));
        }}
      />
    </div>
  );
}

export default HomepageConcept4;
