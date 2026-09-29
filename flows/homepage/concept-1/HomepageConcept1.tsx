"use client";

import { useState } from "react";
import { BriefingEntry } from "@/components/homepage/BriefingEntry";
import { FollowUpCard } from "@/components/homepage/FollowUpCard";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { ReadyCard } from "@/components/homepage/ReadyCard";
import { RecentWork } from "@/components/homepage/RecentWork";
import { RingDetail } from "@/components/homepage/RingDetail";
import { RingsHero } from "@/components/homepage/RingsHero";
import { addDays, aheadPhrase, dueFollowUps, type LoopRecord } from "@/lib/loop";
import { loopActions, nextStepAfter, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { nextToFill, ringOf, ringsFor } from "@/lib/rings";
import { HOME_COPY as C } from "@/mock/homepage";
import { ARTIFACT_KINDS, FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { signalById, type Horizon } from "@/mock/plan-stub";

/**
 * Homepage Concept 1 — Rings (Row, Merged).
 *
 * Task forward. One card leads: the greeting, the plan and where it's
 * heading, then a tray with the one thing the moment calls for — a follow-up
 * due, then something ready but not used, then the next step — and under it
 * the rings, the tray's notch pointing down at the ring it belongs to. Then the
 * Briefing, then the user's work. Chosen 2026-09-29 from Merged, Tethered
 * and Selector.
 *
 * Everything reads the live Loop, so answering the follow-up here moves the
 * page (and the dock's state switcher) to just-answered, and fills nothing:
 * the segment was already confirmed when the artifact was used.
 */

const TOOLBOX = conceptHref("toolbox-flow", "concept-1");
const PLAN = conceptHref("plan", "concept-1");
const BRIEFING = conceptHref("daily-briefing", "concept-1");
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function longDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/** Moves focus to a heading once the card it names has replaced the last. */
function focusSoon(id: string) {
  setTimeout(() => document.getElementById(id)?.focus(), 0);
}

export function HomepageConcept1() {
  const loop = useLoop();
  const [open, setOpen] = useState<Horizon | null>(null);
  const [showing, setShowing] = useState<string | null>(null);

  const rings = ringsFor(loop.records);
  const next = nextToFill(rings);
  const plan = loop.account.plan;
  const due = dueFollowUps(loop.records, loop.today);
  const ready = loop.records.find((r) => r.state === "ready");
  const openRing = rings.find((r) => r.horizon === open);

  const about = (record: LoopRecord, lead: (h: string) => string) => {
    const found = ringOf(rings, record.id);
    return found ? { lead: lead(found.ring.label), title: found.segment.action.title } : undefined;
  };
  /** The ring the tray points at. */
  let focus: Horizon | null = null;

  /* The one card the moment calls for. */
  let card: React.ReactNode = null;
  if (loop.homeState === "just-answered" && loop.justAnswered) {
    const record = loop.records.find((r) => r.id === loop.justAnswered)!;
    const outcome = record.outcome;
    const waiting = due.filter((r) => r.id !== record.id);
    let lead: string;
    if (!outcome || outcome.type === "no-response-yet") {
      const gaps = FOLLOW_UP_POLICY.rescheduleDays;
      const nextAsk = record.checkBackOn ?? addDays(loop.today, gaps[0]);
      lead = C.askAgain(record.name, aheadPhrase(nextAsk, loop.today));
    } else {
      lead = outcome.detail ? C.loggedDetail(outcome.detail) : C.loggedPlain(OUTCOME_READBACK[outcome.type]);
    }
    const step = outcome && outcome.type !== "no-response-yet" ? nextStepAfter(record) : loop.nextStep;
    card = (
      <>
        <NextStepCard
          lead={<p className="home-card__readback">{lead}</p>}
          eyebrow="Next"
          title={step?.title ?? "Pick your next step from your plan"}
          why={{ now: step?.why }}
          whyStyle="folded"
          href={TOOLBOX}
          stubbed
          headingId="handoff-title"
        />
        {waiting.length ? (
          <button
            type="button"
            className="link link--standalone home__another"
            onClick={() => {
              setShowing(waiting[0].id);
              loopActions.moveOn();
              focusSoon("follow-up-question");
            }}
          >
            {C.another(waiting[0].name)}
          </button>
        ) : null}
      </>
    );
  } else if (due.length) {
    const record = due.find((r) => r.id === showing) ?? due[0];
    const other = due.find((r) => r.id !== record.id);
    focus = ringOf(rings, record.id)?.ring.horizon ?? null;
    card = (
      <FollowUpCard
        record={record}
        today={loop.today}
        about={about(record, C.confirms)}
        onSubmit={(answer) => {
          loopActions.answer(record.id, { type: answer.type, detail: answer.detail || undefined });
          setShowing(null);
          focusSoon("handoff-title");
        }}
        another={
          other
            ? {
                label: C.another(other.name),
                onShow: () => {
                  setShowing(other.id);
                  focusSoon("follow-up-question");
                },
              }
            : undefined
        }
      />
    );
  } else if (ready) {
    focus = ringOf(rings, ready.id)?.ring.horizon ?? null;
    card = (
      <ReadyCard
        record={ready}
        about={about(ready, C.forAction)}
        openHref={TOOLBOX}
        checkBack={C.checkBack(ARTIFACT_KINDS[ready.kind].checkBackDays)}
        onUsed={() => {
          loopActions.markUsed(ready.id);
          focusSoon("next-step-title");
        }}
      />
    );
  } else if (next) {
    const a = next.segment.action;
    focus = next.ring.horizon;
    card = (
      <NextStepCard
        eyebrow={C.nextToFill(next.ring.label)}
        title={a.title}
        why={{ this: a.whyThis, now: a.whyNow, you: a.whyYou }}
        whyStyle="folded"
        href={TOOLBOX}
      />
    );
  } else {
    card = <p className="rings-hero__done">{C.allDone}</p>;
  }

  const lastUsed = [...loop.records]
    .filter((r) => r.usedOn)
    .sort((a, b) => (a.usedOn! < b.usedOn! ? 1 : -1))[0];
  const labelFor = (record: LoopRecord) => ringOf(rings, record.id)?.ring.label;

  return (
    <div className="home">
      <h1 className="u-visually-hidden">Home</h1>
      <div className="home__lead">
        <RingsHero
          rings={rings}
          next={next}
          greeting={C.greeting(loop.account.name ?? "")}
          date={longDate(loop.today)}
          planLine={plan.name}
          direction={loop.account.towardShort ? C.toward(loop.account.towardShort) : undefined}
          startNote={loop.homeState === "first-return" ? C.startNote : undefined}
          focus={focus}
          open={open}
          onToggle={(h) => {
            const opening = open !== h;
            setOpen(opening ? h : null);
            if (opening) focusSoon("ring-detail-heading");
          }}
          planHref={PLAN}
        >
          {card}
        </RingsHero>
        {openRing ? (
          <RingDetail
            ring={openRing}
            today={loop.today}
            signals={[...new Set(openRing.segments.map((s) => s.action.signalId).filter(Boolean))]
              .map((id) => signalById(id!))
              .filter((s) => s !== undefined)}
          />
        ) : null}
        {loop.homeState === "nothing-pending" && lastUsed ? (
          <p className="home__last">
            {C.lastUsed}: <b>{lastUsed.title}</b>
          </p>
        ) : null}
      </div>
      <div className="home__side">
        <BriefingEntry href={BRIEFING} />
        <RecentWork records={loop.records} hrefFor={() => TOOLBOX} labelFor={labelFor} />
      </div>
    </div>
  );
}

export default HomepageConcept1;
