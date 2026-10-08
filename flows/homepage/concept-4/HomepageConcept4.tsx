"use client";

import Link from "next/link";
import { useState } from "react";
import { BaselineForm } from "@/components/homepage/BaselineForm";
import { SignalPicture } from "@/components/homepage/SignalPicture";
import { BriefingEditorial } from "@/components/homepage/BriefingEditorial";
import { MapRings } from "@/components/homepage/MapRings";
import { InProgress } from "./InProgress";
import { nextStepOf } from "./nextStep";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { Button } from "@/components/primitives/Button";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { mapFor } from "@/lib/map";
import { hasBaseline, signalRows, withAdded } from "@/lib/presence";
import { saveBaseline, useAddedPresence, useBaseline, useCurrent } from "@/lib/presence-store";
import { dismissSpark, useDismissedSparks } from "@/lib/spark-dismissal";
import { sparksFor } from "@/lib/sparks";
import { BASELINE_COPY as BC, PRESENCE_STUB as PR, SPARK_COPY as SP } from "@/mock/accounts-stub";
import { BRIEFING_STUB as B, HOME_COPY as C, MAP_COPY as M, SIGNAL_PICTURE_COPY as SPC } from "@/mock/homepage";
import { shortDate } from "@/lib/loop";
import { CHECKIN_COPY as CK } from "@/mock/homepage";
import type { Horizon } from "@/mock/plan-stub";

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

const PLAN = conceptHref("plan", "concept-3");
const SIGNALS = conceptHref("signals", "concept-2");
const TOOLBOX = conceptHref("toolbox-flow", "concept-1");
const BRIEFING = conceptHref("daily-briefing", "concept-1");
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function longDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** "Mon 5 Oct": the Briefing's day, as the card's small print. */
function shortDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)}`;
}

/**
 * A note in the tray under the rings (a step just done, a ring all done, an
 * empty ring), in the same card as the next step: the eyebrow and title on
 * navy, and the note and the way to the Plan on white.
 */
function NoteCard({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <section className="feature-card" aria-labelledby="ring-note-title">
      <div className="feature-card__head feature-card__head--inverse">
        <p className="feature-card__eyebrow">{eyebrow}</p>
        <h2 className="feature-card__title" id="ring-note-title" tabIndex={-1}>
          {title}
        </h2>
      </div>
      {note ? (
        <div className="feature-card__body">
          <p className="feature-card__note">{note}</p>
          <Link href={PLAN} className="btn btn--secondary btn--md btn--full">
            {M.seePlan}
          </Link>
        </div>
      ) : null}
    </section>
  );
}

export function HomepageConcept4() {
  const loop = useLoop();
  /* A ring she tapped, kept only for the state it was tapped in, so a new
     moment (or the dock's switcher) opens on her next step again. */
  const [picked, setPicked] = useState<{ horizon: Horizon; state: string } | null>(null);
  const [announce, setAnnounce] = useState("");
  const [skipped, setSkipped] = useState(false);
  const addedPresence = useAddedPresence();
  const baseline = useBaseline();
  const current = useCurrent();
  const dismissed = useDismissedSparks();

  const rings = mapFor({ records: loop.records, tasks: loop.tasks, choices: loop.choices, asked: loop.asked });
  const { step, stepAction, updated, done } = nextStepOf(loop, rings);
  const home: Horizon = stepAction?.horizon ?? done?.horizon ?? (rings.find((r) => r.segments.length && !r.complete) ?? rings.find((r) => r.segments.length) ?? rings[0]).horizon;
  const selected = picked && picked.state === loop.homeState ? picked.horizon : home;
  const open = rings.find((r) => r.horizon === selected)!;

  /* The card under the rings is the selected ring's next step: the one she
     is on if it is that ring's, else the first she has started in it, else
     the first still to start. Start in the Toolbox opens it either way. */
  const ringAction =
    open.segments.find((s) => s.state === "in-progress") ?? open.segments.find((s) => s.state === "not-started");
  const toStep = step && stepAction?.horizon === selected;
  const justDone = updated && done?.horizon === selected;
  const card = justDone ? (
    <NoteCard eyebrow={M.doneIn(open.label)} title={done!.title} note={M.stepDoneNote} />
  ) : toStep ? (
    <NextStepCard
      eyebrow={C.nextIn(open.label)}
      title={step.title}
      why={stepAction ? { this: stepAction.whyThis, now: stepAction.whyNow, you: stepAction.whyYou } : { now: step.why }}
      href={TOOLBOX}
      headingId="next-step-title"
      secondary={
        stepAction && !stepAction.artifactId
          ? {
              label: CK.markDone,
              onClick: () => {
                loopActions.completeTask(step.id);
                setTimeout(() => document.getElementById("check-in-task")?.focus(), 0);
              },
            }
          : undefined
      }
    />
  ) : ringAction ? (
    <NextStepCard
      eyebrow={ringAction.state === "in-progress" ? C.nextIn(open.label) : M.suggestedIn(open.label)}
      title={ringAction.action.title}
      why={{ this: ringAction.action.whyThis, now: ringAction.action.whyNow, you: ringAction.action.whyYou }}
      href={TOOLBOX}
      headingId="ring-step-title"
      onAction={() => {
        if (ringAction.state === "not-started") loopActions.startAction(ringAction.action.id);
      }}
      secondary={
        ringAction.state === "in-progress" && !ringAction.action.artifactId
          ? {
              label: CK.markDone,
              onClick: () => {
                loopActions.completeTask(ringAction.action.id);
                setTimeout(() => document.getElementById("check-in-task")?.focus(), 0);
              },
            }
          : undefined
      }
    />
  ) : open.complete ? (
    <NoteCard eyebrow={open.label} title={M.ringComplete(open.label)} note={M.ringCompleteNote} />
  ) : (
    <NoteCard eyebrow={open.label} title={M.ringEmpty} />
  );

  /* Your Signal Picture. On the first return nobody has entered a baseline
     yet, so it is empty until she adds what she already has. */
  const items = withAdded(addedPresence);
  const seeded = loop.homeState !== "first-return";
  const picture = hasBaseline(baseline, seeded);
  const rows = signalRows(loop.today, items, baseline, seeded, () => "", current).map(({ id, label, then, now }) => ({ id, label, then, now }));
  const note = sparksFor(loop.today, dismissed, items).find((n) => n.id.startsWith("presence:"));

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
            panelId="map-tray"
            onSelect={(h) => {
              setPicked(h === home ? null : { horizon: h, state: loop.homeState });
              setAnnounce(h === selected ? "" : M.showing(rings.find((r) => r.horizon === h)!.label));
            }}
          >
            {card}
          </MapRings>
          <Link href={PLAN} className="link link--standalone map-home__plan">
            {M.planLink}
          </Link>
          <output className="u-visually-hidden">{announce}</output>
        </section>
      </div>
      <div className="map-home__side">
        <div className="map-home__stay">
          <InProgress loop={loop} />
        </div>
        <div className="map-home__briefing">
          <BriefingEditorial
            href={BRIEFING}
            heading={B.heading}
            meta={B.meta(shortDay(loop.today), B.reads)}
            lead={B.lead}
            tag={B.tag}
          />
        </div>
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
                  tone: "celebrate",
                  onDismiss: (id) => {
                    dismissSpark(id);
                    setAnnounce("");
                  },
                }
              : undefined
          }
          next={{ label: SPC.nextLabel, title: PR.tryThis.title, why: PR.tryThis.why, href: TOOLBOX, actionLabel: SPC.nextAction }}
          detailHref={SIGNALS}
          detailLabel={SPC.detailLabel}
          empty={
            picture ? undefined : skipped ? (
              <>
                <p className="account-card__text">{BC.skipped}</p>
                <Button variant="secondary" className="account-card__cta" onClick={() => setSkipped(false)}>
                  {BC.addBack}
                </Button>
              </>
            ) : (
              <BaselineForm
                onSave={(b) => {
                  saveBaseline(b);
                  setAnnounce(BC.saved);
                }}
                onSkip={() => setSkipped(true)}
              />
            )
          }
          headingId="signal-picture-heading"
        />
      </div>
    </div>
  );
}

export default HomepageConcept4;
