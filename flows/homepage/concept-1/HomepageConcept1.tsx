"use client";

import { useState } from "react";
import { EntryLink } from "@/components/homepage/EntryLink";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { RingsHero } from "@/components/homepage/RingsHero";
import { CheckIn } from "@/components/loop/CheckIn";
import { addDays, aheadPhrase, dueFollowUps, shortDate, type LoopRecord } from "@/lib/loop";
import { loopActions, nextStepAfter, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { nextToFill, ringOf, ringsFor } from "@/lib/rings";
import { BRIEFING_STUB, CHECKIN_COPY as CK, HOME_COPY as C } from "@/mock/homepage";
import { FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { ACTIONS, type Horizon } from "@/mock/plan-stub";

/**
 * Homepage Concept 1 — Rings (Row, Merged).
 *
 * Task forward. One card leads: the greeting, then a tray with the one thing
 * the moment calls for — a follow-up due, then something ready but not used,
 * then the next step — and under it the rings, the tray's notch pointing
 * down at the ring it belongs to. Under the card, the plan; then a draft to
 * pick up if there is one, and today's Briefing, each saying what's there.
 * The full list of work belongs to the Toolbox (Sprint 4). Chosen 2026-09-29 from Merged, Tethered
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

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** The heading of each kind of moment, for focus on the way back to it. */
const MOMENT_HEADING = {
  followUp: "check-in-question",
  ready: "check-in-question",
  answered: "check-in-question",
} as const;

/** Moves focus to a heading once the card it names has replaced the last. */
function focusSoon(id: string) {
  setTimeout(() => document.getElementById(id)?.focus(), 0);
}

export function HomepageConcept1() {
  const loop = useLoop();
  /* A ring the user tapped, kept only for the state it was tapped in, so a
     new moment (or the dock's switcher) always opens on the moment. */
  const [picked, setPicked] = useState<{ horizon: Horizon; state: string } | null>(null);
  const [showing, setShowing] = useState<string | null>(null);

  const rings = ringsFor(loop.records, ACTIONS, loop.tasks);
  const next = nextToFill(rings);
  const plan = loop.account.plan;
  const due = dueFollowUps(loop.records, loop.today);
  const ready = loop.records.find((r) => r.state === "ready");

  const about = (record: LoopRecord, lead: (h: string) => string) => {
    const found = ringOf(rings, record.id);
    return found ? { lead: lead(found.ring.label), title: found.segment.action.title } : undefined;
  };
  /* An action with no draft she's said is done, waiting on (or just given)
     what came of it: the moment, after any follow-up due. */
  const pendingTask = ACTIONS.find((a) => {
    const t = !a.artifactId ? loop.tasks?.[a.id] : undefined;
    return t && !t.dropped && (!t.outcome || t.outcome.on === loop.today);
  });
  const taskCheck = pendingTask ? loop.tasks![pendingTask.id] : undefined;
  const taskReadback = taskCheck?.outcome
    ? taskCheck.outcome.type === "no-response-yet"
      ? CK.taskNothingYet
      : taskCheck.outcome.detail
        ? C.loggedDetail(taskCheck.outcome.detail)
        : C.loggedPlain(OUTCOME_READBACK[taskCheck.outcome.type])
    : undefined;

  /** The Loop's one check-in, drawn Question first in this concept. */
  const checkIn = (record: LoopRecord, answered: boolean, readback?: string) => (
    <CheckIn
      key={record.id}
      record={record}
      today={loop.today}
      about={about(record, C.confirms)?.title}
      layout="question"
      answered={answered}
      readback={readback}
      onUsed={() => {
        loopActions.markUsed(record.id);
        setShowing(null);
        focusSoon("next-step-title");
      }}
      onAnswer={(type) => {
        loopActions.answer(record.id, { type });
        setShowing(null);
        focusSoon("check-in-question");
      }}
      onNote={(detail) => loopActions.noteOutcome(record.id, detail)}
    />
  );
  /** The ring the moment belongs to, and what kind of moment it is. */
  let focus: Horizon | null = null;
  let kind: keyof typeof C.backTo | "next" | "done" = "done";

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
    kind = "answered";
    focus = ringOf(rings, record.id)?.ring.horizon ?? null;
    card = (
      <>
        {checkIn(record, true, lead)}
        {outcome && outcome.type !== "no-response-yet" && outcome.type !== "no-longer-relevant" ? (
          <NextStepCard
            eyebrow="Next"
            title={step?.title ?? "Pick your next step from your plan"}
            whyLine={step?.why}
            href={TOOLBOX}
            stubbed
            headingId="handoff-title"
            className="home-card--after-check-in"
          />
        ) : null}
        {waiting.length ? (
          <button
            type="button"
            className="link link--standalone home__another"
            onClick={() => {
              setShowing(waiting[0].id);
              loopActions.moveOn();
              focusSoon("check-in-question");
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
    kind = "followUp";
    card = (
      <>
        {checkIn(record, false)}
        {other ? (
          <button
            type="button"
            className="link link--standalone home__another"
            onClick={() => {
              setShowing(other.id);
              focusSoon("check-in-question");
            }}
          >
            {C.another(other.name)}
          </button>
        ) : null}
      </>
    );
  } else if (pendingTask && taskCheck) {
    focus = pendingTask.horizon;
    kind = "done";
    card = (
      <>
        <CheckIn
          key={`task-${pendingTask.id}`}
          task={taskCheck}
          today={loop.today}
          about={pendingTask.title}
          layout="question"
          answered={Boolean(taskCheck.outcome)}
          readback={taskReadback}
          onAnswer={(type) => {
            loopActions.answerTask(pendingTask.id, type);
            focusSoon("check-in-task");
          }}
          onNote={(detail) => loopActions.noteTask(pendingTask.id, detail)}
          headingId="check-in-task"
        />
      </>
    );
  } else if (ready) {
    focus = ringOf(rings, ready.id)?.ring.horizon ?? null;
    kind = "ready";
    card = <>{checkIn(ready, false)}</>;
  } else if (next) {
    const a = next.segment.action;
    focus = next.ring.horizon;
    kind = "next";
    card = (
      <NextStepCard
        eyebrow={C.nextIn(next.ring.label)}
        title={a.title}
        whyLine={a.whyLine}
        href={TOOLBOX}
        secondary={
          a.artifactId
            ? undefined
            : {
                label: CK.markDone,
                onClick: () => {
                  loopActions.completeTask(a.id);
                  focusSoon("check-in-task");
                },
              }
        }
      />
    );
  } else {
    card = <p className="rings-hero__done">{C.allDone}</p>;
  }

  /* A ring picked that isn't the moment's shows its own next action in the
     tray. The moment's ring always leads with the moment; a follow-up, a
     ready artifact or a just-logged outcome also gets a link back. */
  const pick = picked && picked.state === loop.homeState && picked.horizon !== focus ? picked.horizon : null;
  if (pick) {
    const ring = rings.find((r) => r.horizon === pick)!;
    const step = ring.segments.find((s) => !s.filled)?.action;
    card = (
      <>
        {kind !== "next" && kind !== "done" ? (
          <button
            type="button"
            className="link link--standalone home__back"
            onClick={() => {
              setPicked(null);
              focusSoon(MOMENT_HEADING[kind]);
            }}
          >
            {C.backTo[kind]}
          </button>
        ) : null}
        {step ? (
          <NextStepCard
            eyebrow={C.nextIn(ring.label)}
            title={step.title}
            whyLine={step.whyLine}
            href={TOOLBOX}
            headingId="picked-title"
          />
        ) : (
          <p className="rings-hero__done">{C.ringDone(ring.label)}</p>
        )}
      </>
    );
  }
  const shownRing = pick ?? focus;

  const lastUsed = [...loop.records]
    .filter((r) => r.usedOn)
    .sort((a, b) => (a.usedOn! < b.usedOn! ? 1 : -1))[0];
  /* A draft she's partway through, unless the tray is already about it. */
  const trayArtifact = next && kind === "next" ? next.segment.action.artifactId : undefined;
  const resume = [...loop.records]
    .filter((r) => (r.state === "drafted" || r.state === "in-progress") && r.id !== trayArtifact)
    .sort((a, b) => (a.history.at(-1)!.on < b.history.at(-1)!.on ? 1 : -1))[0];
  const resumeLast = resume?.history.at(-1);

  return (
    <div className="home">
      <h1 className="u-visually-hidden">Home</h1>
      <div className="home__lead">
        <RingsHero
          rings={rings}
          next={next}
          greeting={C.greeting(loop.account.name ?? "")}
          date={longDate(loop.today)}
          startNote={loop.homeState === "first-return" ? C.startNote : undefined}
          focus={shownRing}
          onSelect={(h) => {
            // Tapping the moment's ring, or the ring already shown, returns
            // to the moment.
            setPicked(h === focus || h === pick ? null : { horizon: h, state: loop.homeState });
          }}
        >
          {card}
        </RingsHero>
        <p className="u-visually-hidden" aria-live="polite">
          {pick ? C.showing(rings.find((r) => r.horizon === pick)!.label) : ""}
        </p>
        <EntryLink
          href={PLAN}
          icon="flag"
          eyebrow={C.planEyebrow}
          title={plan.name}
          detail={loop.account.towardShort ? capitalise(C.toward(loop.account.towardShort)) : undefined}
        />
        {loop.homeState === "nothing-pending" && lastUsed ? (
          <p className="home__last">
            {C.lastUsed}: <b>{lastUsed.title}</b>
          </p>
        ) : null}
      </div>
      <div className="home__side">
        {resume && resumeLast ? (
          <EntryLink
            href={TOOLBOX}
            icon="draft"
            eyebrow={C.resumeEyebrow}
            title={resume.title}
            detail={C.resumeDetail(resumeLast.type === "drafted" ? "Drafted" : "Edited", shortDate(resumeLast.on))}
          />
        ) : null}
        <EntryLink
          href={BRIEFING}
          icon="briefing"
          eyebrow={BRIEFING_STUB.eyebrow(BRIEFING_STUB.reads)}
          title={BRIEFING_STUB.lead}
          detail={BRIEFING_STUB.why}
        />
      </div>
    </div>
  );
}

export default HomepageConcept1;
