"use client";

import { useState } from "react";
import { BriefingEditorial } from "@/components/homepage/BriefingEditorial";
import { EntryLink } from "@/components/homepage/EntryLink";
import { FollowUpCard } from "@/components/homepage/FollowUpCard";
import { LoopRow } from "@/components/homepage/LoopRow";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { ReadyCard } from "@/components/homepage/ReadyCard";
import { StageActions } from "@/components/homepage/StageActions";
import { StageTrack } from "@/components/homepage/StageTrack";
import { addDays, aheadPhrase, dueFollowUps, shortDate, whenPhrase, type LoopRecord } from "@/lib/loop";
import { loopActions, nextStepAfter, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { currentStageIndex } from "@/lib/rings";
import { ACCOUNTS_ROWS as AR } from "@/mock/accounts-stub";
import { BRIEFING_STUB as B, CONCEPT3_COPY as C3, HOME_COPY as C, STAY_COPY as S } from "@/mock/homepage";
import { ARTIFACT_KINDS, FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { ACTIONS, HORIZONS, ROADMAP, actionById } from "@/mock/plan-stub";

/**
 * Homepage Concept 3 — Plan (Chapters).
 *
 * Plan forward. The roadmap as a table of contents, with the current stage
 * opened up — you are here, and what it asks now — then, always, your next
 * step and the stage it belongs to; then "Stay on track", whatever is
 * waiting on her word (as in Concept 2, decided 2026-09-29); then the
 * stage's other actions, each a way in with what's next. Then,
 * beside them on web, today's Briefing as a page of reading (Editorial,
 * 2026-09-29: the lead headline in the serif, why it matters as a tag), and
 * what her LinkedIn and website say — one row each, a finding
 * and the one thing to try (2026-09-29; no "Your work" list).
 *
 * Kept apart from the Plan tab: only the current stage and what to do next.
 * No full roadmap detail, milestones or history; "See full plan" goes there.
 *
 * Every action belongs to a stage, and the current stage is the first with
 * an accepted action not yet confirmed (decided 2026-09-29), so "Also in"
 * lists only that stage's actions. Declined and deferred actions never
 * appear.
 */

const TOOLBOX = conceptHref("toolbox-flow", "concept-1");
const PLAN = conceptHref("plan", "concept-1");
const BRIEFING = conceptHref("daily-briefing", "concept-1");
const PROFILE = conceptHref("profile", "concept-1");
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MAX_ACTIONS = 5;

function longDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "Tue 20 Oct", for the Briefing's top line. */
function shortDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)}`;
}

/** Moves focus to a heading once the card it names has replaced the last. */
function focusSoon(id: string) {
  setTimeout(() => document.getElementById(id)?.focus(), 0);
}

export function HomepageConcept3() {
  const loop = useLoop();
  const [showing, setShowing] = useState<string | null>(null);

  const plan = loop.account.plan;
  const current = currentStageIndex(loop.records, ROADMAP.length);
  const stage = ROADMAP[current];
  const due = dueFollowUps(loop.records, loop.today);
  const live = ACTIONS.filter((a) => a.status === "accepted").slice(0, MAX_ACTIONS);

  /** "For your short-term action" and the action, for a card's top line. */
  const about = (record: LoopRecord, lead: (h: string) => string) => {
    const action = live.find((a) => a.artifactId === record.id);
    const horizon = HORIZONS.find((h) => h.id === action?.horizon);
    return action && horizon ? { lead: lead(horizon.label), title: action.title } : undefined;
  };

  /* What's waiting on her word, as in Concept 2's "Stay on track". */
  const readyRecords = loop.records.filter((r) => r.state === "ready");
  const waitingRecords = loop.records.filter(
    (r) => (r.state === "used" || r.state === "waiting") && !due.includes(r)
  );
  const answered =
    loop.homeState === "just-answered" && loop.justAnswered
      ? loop.records.find((r) => r.id === loop.justAnswered)
      : undefined;

  /* Your next step: always its own card, under the roadmap. After a logged
     outcome it's the step that outcome brings; otherwise the first
     recommendation whose work hasn't reached the Loop yet. */
  const outcome = answered?.outcome;
  const updated = Boolean(answered && outcome && outcome.type !== "no-response-yet");
  const step = updated
    ? nextStepAfter(answered!)
    : loop.recommendations.find((rec) => {
        const artifactId = actionById(rec.id)?.artifactId;
        const record = artifactId ? loop.records.find((r) => r.id === artifactId) : undefined;
        return !record || record.state === "drafted" || record.state === "in-progress";
      });
  const stepAction = step ? actionById(step.id) : undefined;
  const stepStage = stepAction ? ROADMAP[stepAction.stage] : undefined;

  const openId =
    showing && [...due, ...readyRecords].some((r) => r.id === showing)
      ? showing
      : answered
        ? undefined
        : (due[0] ?? readyRecords[0])?.id;
  const openRecord = loop.records.find((r) => r.id === openId);
  const readback = answered
    ? !outcome || outcome.type === "no-response-yet"
      ? C.askAgain(
          answered.name,
          aheadPhrase(answered.checkBackOn ?? addDays(loop.today, FOLLOW_UP_POLICY.rescheduleDays[0]), loop.today)
        )
      : outcome.detail
        ? C.loggedDetail(outcome.detail)
        : C.loggedPlain(OUTCOME_READBACK[outcome.type])
    : undefined;
  const openItem = (id: string) => {
    setShowing(id);
    const record = loop.records.find((r) => r.id === id);
    focusSoon(record?.state === "ready" ? "ready-title" : "follow-up-question");
  };
  const usedLine = (r: LoopRecord) =>
    `${capitalise(ARTIFACT_KINDS[r.kind].usedVerb)}${r.usedOn ? ` ${whenPhrase(r.usedOn, loop.today)}` : ""}. ${S.dueLine}`;
  const anyInLoop = Boolean(answered || due.length || readyRecords.length || waitingRecords.length);

  const linkedIn = loop.account.connections.find((c) => c.id === "linkedin");
  const website = loop.account.connections.find((c) => c.id === "website");

  /* The stage's other actions: not the next step, and not anything open in
     "Stay on track". */
  const rest = live
    .filter((a) => a.id !== step?.id && a.stage === current && a.artifactId !== openId)
    .map((action) => ({ action, record: loop.records.find((r) => r.id === action.artifactId) }));

  return (
    <div className="home">
      <h1 className="u-visually-hidden">Home</h1>
      <div className="home__lead">
        <div className="home__greeting">
          <span>
            <b>{C.greeting(loop.account.name ?? "")}</b>
            <span>{longDate(loop.today)}</span>
          </span>
        </div>
        <StageTrack
          stages={ROADMAP}
          current={current}
          planName={plan.name}
          planHref={PLAN}
        />
        {step ? (
          <NextStepCard
            eyebrow={S.nextHeading}
            lead={updated ? <p className="home-card__readback">{S.updated}</p> : undefined}
            context={stepStage ? <p className="home-card__adds">{C3.inStage(stepStage.title)}</p> : undefined}
            title={step.title}
            why={stepAction ? { this: stepAction.whyThis, now: stepAction.whyNow, you: stepAction.whyYou } : { now: step.why }}
            href={TOOLBOX}
            stubbed={updated}
            headingId="next-step-title"
          />
        ) : null}
        {anyInLoop ? (
          <section className="c2-section" aria-labelledby="stay-heading">
            <h2 className="stage-actions__heading" id="stay-heading" tabIndex={-1}>
              {S.heading}
            </h2>
            {readback ? <p className="home-card__readback">{readback}</p> : null}
            {openRecord?.state === "ready" ? (
              <ReadyCard
                record={openRecord}
                about={about(openRecord, C.forAction)}
                openHref={TOOLBOX}
                checkBack={C.checkBack(ARTIFACT_KINDS[openRecord.kind].checkBackDays)}
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
                about={about(openRecord, C.confirms)}
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
          </section>
        ) : null}
        <StageActions heading={C3.alsoIn(stage.title)} items={rest} href={TOOLBOX} />
      </div>
      <div className="home__side">
        <BriefingEditorial
          href={BRIEFING}
          heading={B.heading}
          meta={B.meta(shortDay(loop.today), B.reads)}
          lead={B.lead}
          tag={B.tag}
        />
        {/* Her accounts, one row each: a finding and the one thing to try.
            Simpler than Concept 2's cards on purpose. */}
        <section className="c3-accounts" aria-labelledby="c3-accounts-heading">
          <h2 className="c3-accounts__heading" id="c3-accounts-heading">
            {AR.heading}
          </h2>
          {linkedIn?.connected && linkedIn.connectedOn ? (
            <EntryLink
              href={TOOLBOX}
              icon="linkedin"
              eyebrow={AR.linkedIn.eyebrow(shortDate(linkedIn.connectedOn))}
              title={AR.linkedIn.finding}
              detail={AR.linkedIn.tryThis}
            />
          ) : (
            <EntryLink
              href={PROFILE}
              icon="linkedin"
              eyebrow={AR.linkedIn.offEyebrow}
              title={AR.linkedIn.offTitle}
              detail={AR.linkedIn.offDetail}
            />
          )}
          {website?.connected && website.connectedOn ? (
            <EntryLink
              href={TOOLBOX}
              icon="globe"
              eyebrow={AR.website.eyebrow(shortDate(website.connectedOn))}
              title={AR.website.finding}
              detail={AR.website.tryThis}
            />
          ) : (
            <EntryLink
              href={PROFILE}
              icon="globe"
              eyebrow={AR.website.offEyebrow}
              title={AR.website.offTitle}
              detail={AR.website.offDetail}
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default HomepageConcept3;
