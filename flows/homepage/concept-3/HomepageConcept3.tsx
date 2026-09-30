"use client";

import { useState } from "react";
import { BaselineList } from "@/components/homepage/BaselineList";
import { BriefingEditorial } from "@/components/homepage/BriefingEditorial";
import { EntryLink } from "@/components/homepage/EntryLink";
import { LoopRow } from "@/components/homepage/LoopRow";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { AddPresenceSheet } from "@/components/homepage/AddPresenceSheet";
import { Spark } from "@/components/homepage/Spark";
import { StageActions } from "@/components/homepage/StageActions";
import { StageTrack } from "@/components/homepage/StageTrack";
import { CheckIn } from "@/components/loop/CheckIn";
import { Button } from "@/components/primitives/Button";
import { addDays, aheadPhrase, dueFollowUps, shortDate, whenPhrase, type LoopRecord } from "@/lib/loop";
import { loopActions, nextStepAfter, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { presenceCounts, withAdded } from "@/lib/presence";
import { addPresence, useAddedPresence } from "@/lib/presence-store";
import { dismissSpark, useDismissedSparks } from "@/lib/spark-dismissal";
import { sparksFor } from "@/lib/sparks";
import { currentStageIndex } from "@/lib/rings";
import { ACCOUNTS_COPY as AC, ACCOUNTS_ROWS as AR, LINKEDIN_STUB as LI, PRESENCE_KINDS, ADD_COPY as ADD, SPARK_COPY as SP, WEBSITE_STUB as WEB } from "@/mock/accounts-stub";
import { BRIEFING_STUB as B, CHECKIN_COPY as CK, CONCEPT3_COPY as C3, HOME_COPY as C, STAY_COPY as S } from "@/mock/homepage";
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
 * and the one thing to try (2026-09-29; no "Your work" list). Under them,
 * where she started beside where she is now for every signal, including the
 * four she adds herself: podcast appearances, press mentions, speaking
 * engagements and thought pieces (2026-09-30).
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
  const addedPresence = useAddedPresence();
  const presenceItems = withAdded(addedPresence);
  const [adding, setAdding] = useState(false);

  const plan = loop.account.plan;
  const current = currentStageIndex(loop.records, ROADMAP.length, ACTIONS, loop.tasks);
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
        if (loop.tasks?.[rec.id]) return false;
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
  /* An action with no draft she's said is done, waiting on (or just given)
     what came of it. */
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

  /* The one check-in showing: a row she opened, else what she just answered,
     else the first thing due. Same key before and after she answers, so the
     conversation keeps going in place. */
  const checkRecord = showing && openRecord ? openRecord : (answered ?? openRecord);
  const rowCount =
    due.filter((r) => r.id !== checkRecord?.id).length +
    readyRecords.filter((r) => r.id !== checkRecord?.id).length +
    waitingRecords.filter((r) => r.id !== checkRecord?.id).length;
  const openItem = (id: string) => {
    setShowing(id);
    focusSoon("check-in-question");
  };
  const usedLine = (r: LoopRecord) =>
    `${capitalise(ARTIFACT_KINDS[r.kind].usedVerb)}${r.usedOn ? ` ${whenPhrase(r.usedOn, loop.today)}` : ""}. ${S.dueLine}`;
  const anyInLoop = Boolean(answered || due.length || readyRecords.length || waitingRecords.length || pendingTask);

  const linkedIn = loop.account.connections.find((c) => c.id === "linkedin");
  const website = loop.account.connections.find((c) => c.id === "website");
  const sparks = sparksFor(loop.today, loop.account, useDismissedSparks(), presenceItems);

  /* Where she started beside where she is now, for every signal she has
     brought in: the two accounts when connected, then the four she adds. */
  const baselineRows = [
    ...(linkedIn?.connected
      ? [{ id: "linkedin", label: AR.baselineLinkedIn, then: LI.baseline.then, now: LI.baseline.now }]
      : []),
    ...(website?.connected
      ? [{ id: "website", label: AR.baselineWebsite, then: WEB.baseline.then, now: WEB.baseline.now, latest: AR.baselineWebsiteNote }]
      : []),
    ...presenceCounts(loop.today, presenceItems).map((p) => ({
      id: p.kind,
      label: PRESENCE_KINDS[p.kind].label,
      then: p.then,
      now: p.now,
      latest: p.latest ? `${p.latest.title} · ${p.latest.where} · ${shortDate(p.latest.on)}` : undefined,
      latestHref: p.latest?.link,
    })),
  ];

  /* The stage's other actions: not the next step, and not anything open in
     "Stay on track". */
  const rest = live
    .filter((a) => a.id !== step?.id && a.stage === current && a.artifactId !== openId && !loop.tasks?.[a.id])
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
            secondary={
              stepAction && !stepAction.artifactId && !updated
                ? {
                    label: CK.markDone,
                    onClick: () => {
                      loopActions.completeTask(step.id);
                      focusSoon("stay-heading");
                    },
                  }
                : undefined
            }
          />
        ) : (
          <p className="c2-section__note">{C.allDone}</p>
        )}
        {anyInLoop ? (
          <section className="c2-section" aria-labelledby="stay-heading">
            <h2 className="stage-actions__heading" id="stay-heading" tabIndex={-1}>
              {S.heading}
            </h2>
            {pendingTask && taskCheck ? (
              <CheckIn
                key={`task-${pendingTask.id}`}
                task={taskCheck}
                today={loop.today}
                about={pendingTask.title}
                layout="chat"
                answered={Boolean(taskCheck.outcome)}
                readback={taskReadback}
                onAnswer={(type) => loopActions.answerTask(pendingTask.id, type)}
                onNote={(detail) => loopActions.noteTask(pendingTask.id, detail)}
                headingId="check-in-task"
              />
            ) : null}
            {checkRecord ? (
              <CheckIn
                key={checkRecord.id}
                record={checkRecord}
                today={loop.today}
                about={about(checkRecord, C.confirms)?.title}
                layout="chat"
                answered={checkRecord === answered}
                readback={checkRecord === answered ? readback : undefined}
                onUsed={() => {
                  loopActions.markUsed(checkRecord.id);
                  setShowing(null);
                  focusSoon("stay-heading");
                }}
                onAnswer={(type) => {
                  loopActions.answer(checkRecord.id, { type });
                  setShowing(null);
                }}
                onNote={(detail) => loopActions.noteOutcome(checkRecord.id, detail)}
              />
            ) : null}
            {rowCount ? (
              <ul className="loop-rows">
                {due
                  .filter((r) => r.id !== checkRecord?.id)
                  .map((r) => (
                    <li key={r.id}>
                      <LoopRow record={r} line={usedLine(r)} onOpen={() => openItem(r.id)} />
                    </li>
                  ))}
                {readyRecords
                  .filter((r) => r.id !== checkRecord?.id)
                  .map((r) => (
                    <li key={r.id}>
                      <LoopRow record={r} line={S.readyLine} onOpen={() => openItem(r.id)} />
                    </li>
                  ))}
                {waitingRecords.filter((r) => r.id !== checkRecord?.id).map((r) => (
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
          <h2 className="c3-accounts__heading" id="c3-accounts-heading" tabIndex={-1}>
            {AR.heading}
          </h2>
          <Spark
            items={sparks}
            label={SP.label}
            dismissLabel={SP.dismiss}
            dismissName={SP.dismissNote}
            onDismiss={(id) => {
              dismissSpark(id);
              focusSoon("c3-accounts-heading");
            }}
          />
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
          <div className="c3-accounts__baseline">
            <div className="c3-accounts__baseline-top">
              <h3 className="c3-accounts__baseline-heading">{AR.baselineHeading}</h3>
              <span className="account-card__asof">{AR.baselineAsOf(shortDate(loop.account.plan.startedOn))}</span>
            </div>
            <BaselineList rows={baselineRows} thenLabel={AC.then} nowLabel={AC.now} />
            <Button variant="secondary" className="account-card__cta" onClick={() => setAdding(true)}>
              {ADD.open}
            </Button>
          </div>
        </section>
      </div>
      <AddPresenceSheet
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={(entry) => {
          addPresence({ ...entry, on: loop.today });
          setAdding(false);
        }}
      />
    </div>
  );
}

export default HomepageConcept3;
