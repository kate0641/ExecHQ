"use client";

import { useState } from "react";
import { BriefingCard } from "@/components/homepage/BriefingCard";
import { BriefingEntry } from "@/components/homepage/BriefingEntry";
import { FollowUpCard } from "@/components/homepage/FollowUpCard";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { ReadyCard } from "@/components/homepage/ReadyCard";
import { RecentWork } from "@/components/homepage/RecentWork";
import { SignalActivity } from "@/components/homepage/SignalActivity";
import { addDays, aheadPhrase, dueFollowUps, whenPhrase } from "@/lib/loop";
import { loopActions, nextStepAfter, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { signalActivity, signalOfRecord, signalOfStep, windowLabel, windowStart } from "@/lib/signals";
import { closeBriefing, useBriefingClosed } from "@/lib/briefing-dismissal";
import { BRIEFING_STUB as B, HOME_COPY } from "@/mock/homepage";
import { ARTIFACT_KINDS, FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { ACTIONS, HORIZONS, SIGNAL_COPY as C, actionById } from "@/mock/plan-stub";

/**
 * Homepage Concept 2 — Signals (Ledger).
 *
 * Today's Briefing opens the page, in a light card that closes until
 * tomorrow (decided 2026-09-29, replacing the greeting); then, signal
 * forward, the one signal the next action touches, in a dark
 * panel with its last seven days as a dated list of facts, and the action is
 * joined directly beneath it. If a follow-up is due, the follow-up takes that
 * place instead and names its signal. Then the other tracked signals, then
 * the Briefing, then the user's work.
 *
 * PROVISIONAL signal area: the Signal Picture is designed in Sprint 3. Every
 * fact is read from the live Loop (`lib/signals.ts`), and all signal data and
 * wording is in `mock/plan-stub.ts`. Answering the follow-up here adds its
 * entry at once and moves the page to just-answered.
 */

const TOOLBOX = conceptHref("toolbox-flow", "concept-1");
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

export function HomepageConcept2() {
  const loop = useLoop();
  const [showing, setShowing] = useState<string | null>(null);
  const briefingClosed = useBriefingClosed(loop.today);

  const due = dueFollowUps(loop.records, loop.today);
  const ready = loop.records.find((r) => r.state === "ready");
  const signals = signalActivity(loop.records, loop.today);
  const span = windowLabel(loop.today);
  const plan = loop.account.plan;
  // A plan chosen inside the window explains the quiet, so it says so.
  const quiet =
    plan.startedOn >= windowStart(loop.today) ? C.quietStarted(whenPhrase(plan.startedOn, loop.today)) : C.quiet;
  const nameOf = (signalId?: string) => signals.find((s) => s.signal.id === signalId)?.signal.name;
  const forAction = (recordId: string) => {
    const action = ACTIONS.find((a) => a.artifactId === recordId);
    const horizon = HORIZONS.find((h) => h.id === action?.horizon);
    return action && horizon ? { lead: HOME_COPY.forAction(horizon.label), title: action.title } : undefined;
  };

  /* The focal item: which signal leads, and the card joined beneath it. */
  let focalSignal: string | undefined;
  let eyebrow: string = C.focalEyebrow;
  let card: React.ReactNode = null;
  let after: React.ReactNode = null;

  if (loop.homeState === "just-answered" && loop.justAnswered) {
    const record = loop.records.find((r) => r.id === loop.justAnswered)!;
    const outcome = record.outcome;
    const waiting = due.filter((r) => r.id !== record.id);
    let lead: string;
    if (!outcome || outcome.type === "no-response-yet") {
      const nextAsk = record.checkBackOn ?? addDays(loop.today, FOLLOW_UP_POLICY.rescheduleDays[0]);
      lead = HOME_COPY.askAgain(record.name, aheadPhrase(nextAsk, loop.today));
    } else {
      lead = outcome.detail ? HOME_COPY.loggedDetail(outcome.detail) : HOME_COPY.loggedPlain(OUTCOME_READBACK[outcome.type]);
    }
    const step = outcome && outcome.type !== "no-response-yet" ? nextStepAfter(record) : loop.nextStep;
    focalSignal = (step && signalOfStep(step.id)) ?? signalOfRecord(record.id);
    if (!(step && signalOfStep(step.id))) eyebrow = C.answeredEyebrow;
    card = (
      <NextStepCard
        lead={<p className="home-card__readback">{lead}</p>}
        eyebrow="Next"
        title={step?.title ?? "Pick your next step from your plan"}
        why={{ now: step?.why }}
        href={TOOLBOX}
        stubbed
        headingId="handoff-title"
      />
    );
    if (waiting.length) {
      after = (
        <button
          type="button"
          className="link link--standalone home__another"
          onClick={() => {
            setShowing(waiting[0].id);
            loopActions.moveOn();
            focusSoon("follow-up-question");
          }}
        >
          {HOME_COPY.another(waiting[0].name)}
        </button>
      );
    }
  } else if (due.length) {
    // The follow-up takes the focal place and names its signal; no signal leads.
    const record = due.find((r) => r.id === showing) ?? due[0];
    const other = due.find((r) => r.id !== record.id);
    const signalName = nameOf(signalOfRecord(record.id));
    card = (
      <FollowUpCard
        record={record}
        today={loop.today}
        about={signalName ? { lead: C.followUpAbout, title: signalName } : undefined}
        onSubmit={(answer) => {
          loopActions.answer(record.id, { type: answer.type, detail: answer.detail || undefined });
          setShowing(null);
          focusSoon("handoff-title");
        }}
        another={
          other
            ? {
                label: HOME_COPY.another(other.name),
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
    focalSignal = signalOfRecord(ready.id);
    card = (
      <ReadyCard
        record={ready}
        about={forAction(ready.id)}
        openHref={TOOLBOX}
        checkBack={HOME_COPY.checkBack(ARTIFACT_KINDS[ready.kind].checkBackDays)}
        onUsed={() => {
          loopActions.markUsed(ready.id);
          focusSoon("next-step-title");
        }}
      />
    );
  } else if (loop.nextStep) {
    const step = loop.nextStep;
    const action = actionById(step.id);
    focalSignal = signalOfStep(step.id);
    card = (
      <NextStepCard
        title={step.title}
        why={action ? { this: action.whyThis, now: action.whyNow, you: action.whyYou } : { now: step.why }}
        href={TOOLBOX}
      />
    );
  }

  const focal = signals.find((s) => s.signal.id === focalSignal);
  const others = signals.filter((s) => s !== focal);

  return (
    <div className="home">
      <h1 className="u-visually-hidden">Home</h1>
      <div className="home__lead">
        {briefingClosed ? null : (
          <BriefingCard
            meta={B.meta(longDate(loop.today), B.reads)}
            lead={B.lead}
            why={B.why}
            others={B.others}
            href={BRIEFING}
            heading={B.heading}
            openLabel={B.open}
            closeLabel={B.close}
            onClose={() => {
              closeBriefing(loop.today);
              focusSoon(focal ? "focal-signal" : "other-signals");
            }}
          />
        )}

        {focal ? (
          <div className="signals-home__focus">
            <SignalActivity
              name={focal.signal.name}
              entries={focal.entries}
              quiet={quiet}
              eyebrow={eyebrow}
              window={span}
              tone="focal"
              today={loop.today}
              headingLevel={2}
              headingId="focal-signal"
              keyLine={C.key}
            />
            {card}
          </div>
        ) : (
          card
        )}
        {after}

        <section className="signals-home__others" aria-labelledby="other-signals">
          <div className="signals-home__intro">
            <h2 className="signals-home__heading" id="other-signals" tabIndex={-1}>
              {focal ? C.othersHeading : C.allHeading}
            </h2>
            <p className="signals-home__window">{span}</p>
            {focal ? null : <p className="signals-home__window">{C.key}</p>}
          </div>
          {others.map(({ signal, entries }) => (
            <SignalActivity
              key={signal.id}
              name={signal.name}
              entries={entries}
              quiet={quiet}
              today={loop.today}
              headingId={`signal-${signal.id}`}
            />
          ))}
        </section>
      </div>
      <div className="home__side">
        {/* Once the card is closed, the one-line link keeps today's reads in reach. */}
        {briefingClosed ? <BriefingEntry href={BRIEFING} /> : null}
        <RecentWork records={loop.records} hrefFor={() => TOOLBOX} />
      </div>
    </div>
  );
}

export default HomepageConcept2;
