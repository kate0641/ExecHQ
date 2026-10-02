"use client";

import { useEffect, useRef, useState } from "react";
import { ActionSheet } from "@/components/homepage/ActionSheet";
import { MapRoundup } from "@/components/homepage/MapRoundup";
import { AddPresenceSheet } from "@/components/homepage/AddPresenceSheet";
import { PresenceCard } from "@/components/homepage/PresenceCard";
import { Spark } from "@/components/homepage/Spark";
import { DestinationStub } from "@/components/layout/DestinationStub";
import { shortDate } from "@/lib/loop";
import { loopActions, useLoop } from "@/lib/loop-store";
import { mapFor } from "@/lib/map";
import { conceptHref, getFlow } from "@/lib/manifest";
import { hasBaseline, presenceCounts, withAdded } from "@/lib/presence";
import { addPresence, useAddedPresence } from "@/lib/presence-store";
import { dismissSpark, useDismissedSparks } from "@/lib/spark-dismissal";
import { sparksFor } from "@/lib/sparks";
import { ADD_COPY as ADD, PRESENCE_KINDS, PRESENCE_STUB as PR, SPARK_COPY as SP, ACCOUNTS_COPY as AC } from "@/mock/accounts-stub";
import { MAP_COPY as M, SIGNAL_PICTURE_COPY as SPC } from "@/mock/homepage";
import type { LandscapeAction } from "@/mock/plan-stub";

/**
 * The Plan, for now (Sprint 3 designs it): its placeholder heading, and under
 * it the detail behind Your Signal Picture on the homepage. Kate decided on
 * 2026-10-02 that the detail lives here as a component, and that it can become
 * its own page later if the Plan design calls for one.
 *
 * Above it, the map of actions from the homepage: the one place an action
 * she has not started is read, then started or skipped (decided 2026-10-02).
 *
 * It is the same card the earlier homepage concepts used for Your presence:
 * every signal she enters, where she started beside now, what she added last,
 * a way to add more, and the one thing to try. Nothing on it is found for
 * her.
 */
export function PlanConcept1() {
  const loop = useLoop();
  const stub = getFlow("plan")?.stub;
  const addedPresence = useAddedPresence();
  const dismissed = useDismissedSparks();
  const [adding, setAdding] = useState(false);
  const [sheetAction, setSheetAction] = useState<LandscapeAction | null>(null);
  const [announce, setAnnounce] = useState("");
  const arrived = useRef(false);

  const rings = mapFor({ records: loop.records, tasks: loop.tasks, choices: loop.choices, asked: loop.asked });
  const toolbox = conceptHref("toolbox-flow", "concept-1");

  /* Arriving from a row on the homepage (#action-<id>): bring that action
     into view, and open an action she has not started, so the read-then-
     decide step is one tap from where she was. Once only. */
  useEffect(() => {
    if (arrived.current) return;
    const id = window.location.hash.replace(/^#action-/, "");
    if (!id || id === window.location.hash) return;
    const segment = rings.flatMap((r) => r.segments).find((s) => s.action.id === id);
    if (!segment) return;
    arrived.current = true;
    document.getElementById(`action-${id}`)?.scrollIntoView({ block: "center" });
    if (segment.state === "not-started") setTimeout(() => setSheetAction(segment.action), 0);
  }, [rings]);

  const items = withAdded(addedPresence);
  const seeded = loop.homeState !== "first-return";
  const picture = hasBaseline(addedPresence, seeded);
  const counts = presenceCounts(loop.today, items, seeded);
  const notes = sparksFor(loop.today, loop.account, dismissed, items).filter((n) => n.id.startsWith("presence:"));
  const added = counts.reduce((sum, p) => sum + (p.now - p.then), 0);

  return (
    <div className="plan-stub">
      {stub ? <DestinationStub heading={stub.heading} body={stub.body} sprint={3} /> : null}
      <section className="plan-stub__map" aria-labelledby="plan-map-heading">
        <h2 className="plan-stub__heading" id="plan-map-heading">
          {M.heading}
        </h2>
        <MapRoundup
          rings={rings}
          hrefFor={(a) => (rings.flatMap((r) => r.segments).find((s) => s.action.id === a.id)?.state === "in-progress" ? toolbox : undefined)}
          onOpen={setSheetAction}
          lineFor={(s) => (s.state === "not-started" ? M.rowRead : s.state === "in-progress" ? M.rowContinue : undefined)}
          idPrefix="plan-map"
        />
        <output className="u-visually-hidden">{announce}</output>
      </section>
      <section className="plan-stub__signals" aria-labelledby="plan-signals-heading">
        <h2 className="u-visually-hidden" id="plan-signals-heading">
          Your signals
        </h2>
        <Spark
          items={notes}
          label={SP.label}
          dismissLabel={SP.dismiss}
          dismissName={SP.dismissNote}
          onDismiss={(id) => dismissSpark(id)}
        />
        <PresenceCard
          name={SPC.heading}
          mark={PR.mark}
          asOf={PR.asOf(shortDate(loop.account.plan.startedOn))}
          thenLabel={AC.then}
          nowLabel={AC.now}
          rows={counts.map((p) => ({
            id: p.kind,
            label: PRESENCE_KINDS[p.kind].label,
            then: p.then,
            now: p.now,
            latest: p.latest ? `${p.latest.title} · ${p.latest.where} · ${shortDate(p.latest.on)}` : undefined,
            latestHref: p.latest?.link,
          }))}
          summary={PR.summary(added)}
          onAdd={() => setAdding(true)}
          addLabel={picture ? ADD.open : SPC.empty.label}
          tryThis={picture ? { ...PR.tryThis, href: conceptHref("toolbox-flow", "concept-1") } : undefined}
          tryLabel={AC.tryThis}
          headingId="plan-signals-card"
        />
      </section>
      <ActionSheet
        open={sheetAction !== null}
        action={sheetAction}
        onClose={() => setSheetAction(null)}
        startHref={toolbox}
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
      <AddPresenceSheet
        open={adding}
        baseline={!picture}
        onClose={() => setAdding(false)}
        onAdd={(entry) => {
          addPresence({ ...entry, on: loop.today, baseline: !picture });
          setAdding(false);
        }}
      />
    </div>
  );
}

export default PlanConcept1;
