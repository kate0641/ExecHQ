"use client";

import { useState } from "react";
import { AccountCard } from "@/components/homepage/AccountCard";
import { BriefingCard } from "@/components/homepage/BriefingCard";
import { BriefingEntry } from "@/components/homepage/BriefingEntry";
import { FollowUpCard } from "@/components/homepage/FollowUpCard";
import { LoopRow } from "@/components/homepage/LoopRow";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { ReadyCard } from "@/components/homepage/ReadyCard";
import { RecentWork } from "@/components/homepage/RecentWork";
import { SignalActivity } from "@/components/homepage/SignalActivity";
import { TrendLine } from "@/components/homepage/TrendLine";
import { addDays, aheadPhrase, dueFollowUps, shortDate, whenPhrase, type LoopRecord } from "@/lib/loop";
import { loopActions, nextStepAfter, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { signalActivity, signalOfStep, windowLabel, windowStart } from "@/lib/signals";
import { closeBriefing, useBriefingClosed } from "@/lib/briefing-dismissal";
import { ACCOUNTS_COPY as AC, LINKEDIN_STUB as LI, WEBSITE_STUB as WEB } from "@/mock/accounts-stub";
import { BRIEFING_STUB as B, HOME_COPY, STAY_COPY as S } from "@/mock/homepage";
import { ARTIFACT_KINDS, FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { ACTIONS, HORIZONS, SIGNAL_COPY as C, actionById } from "@/mock/plan-stub";

/**
 * Homepage Concept 2 — Signals (Ledger).
 *
 * Top to bottom (decided 2026-09-29): today's Briefing, in a light card that
 * closes until tomorrow; your next step, always, naming the signal it adds
 * to; "Stay on track", everything waiting on her word — one follow-up or
 * ready draft open, the rest as rows, and drafts only waiting as quiet
 * lines; then the signals, the one the next step feeds first in the dark
 * panel. Logging an outcome can change the next step above, and says so.
 *
 * Below the signals, in their own section and never in the next step, what
 * her LinkedIn and website say (Account cards, 2026-09-29): numbers with
 * source and date, what they suggest, and one thing to try; or, not
 * connected, what connecting would show. Connections are Profile's, so
 * connecting there shows here; the dock's toggle sets both at once.
 *
 * PROVISIONAL signal area: the Signal Picture is designed in Sprint 3. Every
 * fact is read from the live Loop (`lib/signals.ts`), and all signal data and
 * wording is in `mock/plan-stub.ts`. Answering the follow-up here adds its
 * entry at once and moves the page to just-answered.
 */

const TOOLBOX = conceptHref("toolbox-flow", "concept-1");
const PROFILE = conceptHref("profile", "concept-1");
const BRIEFING = conceptHref("daily-briefing", "concept-1");
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function longDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Moves focus to a heading once the card it names has replaced the last. */
function focusSoon(id: string) {
  setTimeout(() => document.getElementById(id)?.focus(), 0);
}

export function HomepageConcept2() {
  const loop = useLoop();
  const [showing, setShowing] = useState<string | null>(null);
  const briefingClosed = useBriefingClosed(loop.today);

  const due = dueFollowUps(loop.records, loop.today);
  const signals = signalActivity(loop.records, loop.today);
  const span = windowLabel(loop.today);
  const plan = loop.account.plan;
  // A plan chosen inside the window explains the quiet, so it says so.
  const quiet =
    plan.startedOn >= windowStart(loop.today) ? C.quietStarted(whenPhrase(plan.startedOn, loop.today)) : C.quiet;
  const forAction = (recordId: string) => {
    const action = ACTIONS.find((a) => a.artifactId === recordId);
    const horizon = HORIZONS.find((h) => h.id === action?.horizon);
    return action && horizon ? { lead: HOME_COPY.forAction(horizon.label), title: action.title } : undefined;
  };

  /* What's waiting on her word: due follow-ups, drafts ready but not marked
     used, and drafts used and waiting for their check-back. */
  const readyRecords = loop.records.filter((r) => r.state === "ready");
  const waitingRecords = loop.records.filter(
    (r) => (r.state === "used" || r.state === "waiting") && !due.includes(r)
  );
  const answered = loop.homeState === "just-answered" && loop.justAnswered
    ? loop.records.find((r) => r.id === loop.justAnswered)
    : undefined;

  /* Your next step: always shown. After a logged outcome it's the step that
     outcome brings; otherwise the first recommendation whose work hasn't
     reached the Loop yet, so it never repeats a row in "Stay on track". */
  const outcome = answered?.outcome;
  const updated = Boolean(answered && outcome && outcome.type !== "no-response-yet");
  const step = updated
    ? nextStepAfter(answered!)
    : loop.recommendations.find((rec) => {
        const artifactId = actionById(rec.id)?.artifactId;
        const record = artifactId ? loop.records.find((r) => r.id === artifactId) : undefined;
        return !record || record.state === "drafted" || record.state === "in-progress";
      });
  const action = step ? actionById(step.id) : undefined;
  const focalSignal = step ? signalOfStep(step.id) : undefined;

  /* Which item in "Stay on track" is open: the one she picked, else the
     first follow-up due, else the first ready draft. The rest are rows. */
  const openId =
    showing && [...due, ...readyRecords].some((r) => r.id === showing)
      ? showing
      : answered
        ? undefined
        : (due[0] ?? readyRecords[0])?.id;
  const openRecord = loop.records.find((r) => r.id === openId);
  const readback = answered
    ? !outcome || outcome.type === "no-response-yet"
      ? HOME_COPY.askAgain(
          answered.name,
          aheadPhrase(answered.checkBackOn ?? addDays(loop.today, FOLLOW_UP_POLICY.rescheduleDays[0]), loop.today)
        )
      : outcome.detail
        ? HOME_COPY.loggedDetail(outcome.detail)
        : HOME_COPY.loggedPlain(OUTCOME_READBACK[outcome.type])
    : undefined;
  // Opening another row keeps the just-logged state, so the next step it
  // brought stays in place while she answers the rest.
  const openItem = (id: string) => {
    setShowing(id);
    const record = loop.records.find((r) => r.id === id);
    focusSoon(record?.state === "ready" ? "ready-title" : "follow-up-question");
  };
  const usedLine = (r: LoopRecord) =>
    `${capitalise(ARTIFACT_KINDS[r.kind].usedVerb)}${r.usedOn ? ` ${whenPhrase(r.usedOn, loop.today)}` : ""}. ${S.dueLine}`;
  const nothingInLoop = !answered && !due.length && !readyRecords.length && !waitingRecords.length;
  const anyUsed = loop.records.some((r) => r.usedOn);

  /* Her accounts, as Profile (or the dock) left them. */
  const linkedIn = loop.account.connections.find((c) => c.id === "linkedin");
  const website = loop.account.connections.find((c) => c.id === "website");
  const anyConnected = Boolean(linkedIn?.connected || website?.connected);

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
              focusSoon(step ? "next-step-title" : "stay-heading");
            }}
          />
        )}

        {/* 2. Your next step: always here, whatever else is going on. */}
        {step ? (
          <NextStepCard
            eyebrow={S.nextHeading}
            lead={updated ? <p className="home-card__readback">{S.updated}</p> : undefined}
            context={
              focal ? (
                <p className="home-card__adds">
                  {S.addsTo} <b>{focal.signal.name}</b>
                </p>
              ) : undefined
            }
            title={step.title}
            why={action ? { this: action.whyThis, now: action.whyNow, you: action.whyYou } : { now: step.why }}
            href={TOOLBOX}
            stubbed={updated}
            headingId="next-step-title"
          />
        ) : null}

        {/* 3. Stay on track: what's waiting on her word. */}
        <section className="c2-section" aria-labelledby="stay-heading">
          <div className="signals-home__intro">
            <h2 className="signals-home__heading" id="stay-heading" tabIndex={-1}>
              {S.heading}
            </h2>
          </div>
          {readback ? <p className="home-card__readback">{readback}</p> : null}
          {openRecord?.state === "ready" ? (
            <ReadyCard
              record={openRecord}
              about={forAction(openRecord.id)}
              openHref={TOOLBOX}
              checkBack={HOME_COPY.checkBack(ARTIFACT_KINDS[openRecord.kind].checkBackDays)}
              onUsed={() => {
                loopActions.markUsed(openRecord.id);
                setShowing(null);
                focusSoon("stay-heading");
              }}
            />
          ) : openRecord ? (
            <FollowUpCard
              record={openRecord}
              today={loop.today}
              about={forAction(openRecord.id)}
              onSubmit={(answer) => {
                loopActions.answer(openRecord.id, { type: answer.type, detail: answer.detail || undefined });
                setShowing(null);
                focusSoon("next-step-title");
              }}
            />
          ) : null}
          {due.length + readyRecords.length + waitingRecords.length > (openRecord ? 1 : 0) ? (
            <ul className="loop-rows">
              {due
                .filter((r) => r.id !== openId)
                .map((r) => (
                  <li key={r.id}>
                    <LoopRow record={r} line={usedLine(r)} onOpen={() => openItem(r.id)} />
                  </li>
                ))}
              {readyRecords
                .filter((r) => r.id !== openId)
                .map((r) => (
                  <li key={r.id}>
                    <LoopRow record={r} line={S.readyLine} onOpen={() => openItem(r.id)} />
                  </li>
                ))}
              {waitingRecords.map((r) => (
                <li key={r.id}>
                  <LoopRow
                    record={r}
                    line={r.checkBackOn ? S.askOn(aheadPhrase(r.checkBackOn, loop.today)) : S.usedNoAsk}
                  />
                </li>
              ))}
            </ul>
          ) : null}
          {nothingInLoop ? <p className="c2-section__note">{anyUsed ? S.allLogged : S.empty}</p> : null}
        </section>

        <section className="signals-home__others" aria-labelledby="other-signals">
          <div className="signals-home__intro">
            <h2 className="signals-home__heading" id="other-signals" tabIndex={-1}>
              {C.allHeading}
            </h2>
            <p className="signals-home__window">{span}</p>
            {focal ? null : <p className="signals-home__window">{C.key}</p>}
          </div>
          {focal ? (
            <SignalActivity
              name={focal.signal.name}
              entries={focal.entries}
              quiet={quiet}
              eyebrow={C.focalEyebrow}
              tone="focal"
              today={loop.today}
              headingId="focal-signal"
              keyLine={C.key}
            />
          ) : null}
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

        {/* Her accounts: their own section, never part of the next step. */}
        <section className="accounts-home" aria-labelledby="accounts-heading">
          <div className="signals-home__intro">
            <h2 className="signals-home__heading" id="accounts-heading">
              {AC.heading}
            </h2>
            <p className="signals-home__window">{anyConnected ? AC.sub : AC.subNotConnected}</p>
          </div>
          {linkedIn?.connected && linkedIn.connectedOn ? (
            <AccountCard
              name={LI.name}
              mark={LI.mark}
              asOf={AC.asOfLinkedIn(shortDate(linkedIn.connectedOn))}
              stats={LI.stats}
              chart={
                <TrendLine
                  values={LI.followers}
                  labels={LI.followers.map(
                    (_, i) => `Week of ${shortDate(addDays(linkedIn.connectedOn!, -(LI.followers.length - 1 - i) * 7))}`
                  )}
                  caption={LI.chartCaption}
                  summary={LI.chartSummary}
                />
              }
              says={LI.says}
              saysLabel={AC.says}
              tryThis={{ ...LI.tryThis, href: TOOLBOX }}
              tryLabel={AC.tryThis}
              headingId="account-linkedin"
            />
          ) : (
            <AccountCard name={LI.name} mark={LI.mark} invite={{ ...LI.invite, href: PROFILE }} headingId="account-linkedin" />
          )}
          {website?.connected && website.connectedOn ? (
            <AccountCard
              name={WEB.name}
              mark={WEB.mark}
              asOf={AC.asOfWebsite(shortDate(website.connectedOn))}
              stats={WEB.stats}
              says={WEB.says}
              saysLabel={AC.says}
              tryThis={{ ...WEB.tryThis, href: TOOLBOX }}
              tryLabel={AC.tryThis}
              headingId="account-website"
            />
          ) : (
            <AccountCard name={WEB.name} mark={WEB.mark} invite={{ ...WEB.invite, href: PROFILE }} headingId="account-website" />
          )}
          <p className="accounts-home__private">{AC.private}</p>
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
