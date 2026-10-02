"use client";

import { useState } from "react";
import { AddPresenceSheet } from "@/components/homepage/AddPresenceSheet";
import { SignalPicture } from "@/components/homepage/SignalPicture";
import { ActionSheet } from "@/components/homepage/ActionSheet";
import { BriefingEditorial } from "@/components/homepage/BriefingEditorial";
import { MapLegend, MapRings } from "@/components/homepage/MapRings";
import { InProgress } from "./InProgress";
import { MapPanel } from "@/components/homepage/MapPanel";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { mapFor, nextNewAction } from "@/lib/map";
import { hasBaseline, presenceCounts, withAdded } from "@/lib/presence";
import { addPresence, useAddedPresence } from "@/lib/presence-store";
import { dismissSpark, useDismissedSparks } from "@/lib/spark-dismissal";
import { sparksFor } from "@/lib/sparks";
import { PRESENCE_KINDS, PRESENCE_STUB as PR, SPARK_COPY as SP } from "@/mock/accounts-stub";
import { BRIEFING_STUB as B, HOME_COPY as C, MAP_COPY as M, SIGNAL_PICTURE_COPY as SPC } from "@/mock/homepage";
import { shortDate } from "@/lib/loop";
import type { Horizon, LandscapeAction } from "@/mock/plan-stub";

/**
 * Homepage Concept 4 — Combined.
 *
 * Built from the three concepts on 2026-10-02, from Kate's notes. Top to
 * bottom: the map, three rings with what is in each one under it; what she
 * has in progress; today's Briefing, as the editorial card; and Your Signal
 * Picture, with a way into the detail on the Plan page.
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

/** "Mon 5 Oct": the Briefing's day, as the card's small print. */
function shortDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)}`;
}

export function HomepageConcept4() {
  const loop = useLoop();
  const [selected, setSelected] = useState<Horizon | null>(null);
  const [sheetAction, setSheetAction] = useState<LandscapeAction | null>(null);
  const [announce, setAnnounce] = useState("");
  const [adding, setAdding] = useState(false);
  const addedPresence = useAddedPresence();
  const dismissed = useDismissedSparks();

  const rings = mapFor({ records: loop.records, tasks: loop.tasks, choices: loop.choices, asked: loop.asked });
  const open = rings.find((r) => r.horizon === selected);

  /* Your Signal Picture. On the first return nobody has entered a baseline
     yet, so it is empty until she adds what she already has. */
  const items = withAdded(addedPresence);
  const seeded = loop.homeState !== "first-return";
  const picture = hasBaseline(addedPresence, seeded);
  const rows = presenceCounts(loop.today, items, seeded).map((p) => ({
    id: p.kind,
    label: PRESENCE_KINDS[p.kind].label,
    then: p.then,
    now: p.now,
  }));
  const note = sparksFor(loop.today, loop.account, dismissed, items).find((n) => n.id.startsWith("presence:"));

  return (
    <div className="map-home">
      <h1 className="u-visually-hidden">Home</h1>
      <div className="map-home__lead">
        <p className="map-home__greeting">
          <b>{C.greeting(loop.account.name ?? "")}</b>
          <span>{longDate(loop.today)}</span>
        </p>
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
        <BriefingEditorial
          href={BRIEFING}
          heading={B.heading}
          meta={B.meta(shortDay(loop.today), B.reads)}
          lead={B.lead}
          tag={B.tag}
        />
        <SignalPicture
          name={SPC.heading}
          asOf={SPC.asOf(shortDate(loop.account.plan.startedOn))}
          rows={rows}
          thenLabel="Start"
          nowLabel="Now"
          spark={
            note
              ? {
                  items: [{ id: note.id, source: note.source, text: note.text }],
                  label: SP.label,
                  dismissLabel: SP.dismiss,
                  dismissName: SP.dismissNote,
                  onDismiss: (id) => {
                    dismissSpark(id);
                    setAnnounce("");
                  },
                }
              : undefined
          }
          next={{ label: SPC.nextLabel, title: PR.tryThis.title, why: PR.tryThis.why }}
          planHref={PLAN}
          planLabel={SPC.planLabel}
          empty={picture ? undefined : { ...SPC.empty, onAdd: () => setAdding(true) }}
          headingId="signal-picture-heading"
        />
      </div>
      <AddPresenceSheet
        open={adding}
        baseline
        onClose={() => setAdding(false)}
        onAdd={(entry) => {
          addPresence({ ...entry, on: loop.today, baseline: true });
          setAdding(false);
          setAnnounce(SPC.added);
        }}
      />
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
