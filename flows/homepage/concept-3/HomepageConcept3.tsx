"use client";

import { useState } from "react";
import { BriefingEntry } from "@/components/homepage/BriefingEntry";
import { FollowUpCard } from "@/components/homepage/FollowUpCard";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { ReadyCard } from "@/components/homepage/ReadyCard";
import { RecentWork } from "@/components/homepage/RecentWork";
import { StageActions } from "@/components/homepage/StageActions";
import { StageTrack } from "@/components/homepage/StageTrack";
import { addDays, aheadPhrase, dueFollowUps, type LoopRecord } from "@/lib/loop";
import { loopActions, nextStepAfter, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { currentStageIndex } from "@/lib/rings";
import { HOME_COPY as C } from "@/mock/homepage";
import { ARTIFACT_KINDS, FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { ACTIONS, HORIZONS, ROADMAP, actionById } from "@/mock/plan-stub";

/**
 * Homepage Concept 3 — Plan (Chapters).
 *
 * Plan forward. The roadmap as a table of contents, with the current stage
 * opened up — you are here, and what it asks now — then the focal item: a
 * follow-up due (naming the action it belongs to), then something ready but
 * not used, then the next step. Then the stage's other live actions, the
 * Briefing, and the user's work.
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
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MAX_ACTIONS = 5;

function longDate(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
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
  const ready = loop.records.find((r) => r.state === "ready");
  const live = ACTIONS.filter((a) => a.status === "accepted").slice(0, MAX_ACTIONS);

  /** "For your short-term action" and the action, for the card's top line. */
  const about = (record: LoopRecord, lead: (h: string) => string) => {
    const action = live.find((a) => a.artifactId === record.id);
    const horizon = HORIZONS.find((h) => h.id === action?.horizon);
    return action && horizon ? { lead: lead(horizon.label), title: action.title } : undefined;
  };

  /* The focal item, and the action it stands for, which the list then leaves out. */
  let focalAction: string | undefined;
  let card: React.ReactNode = null;
  let after: React.ReactNode = null;

  if (loop.homeState === "just-answered" && loop.justAnswered) {
    const record = loop.records.find((r) => r.id === loop.justAnswered)!;
    const outcome = record.outcome;
    const waiting = due.filter((r) => r.id !== record.id);
    let lead: string;
    if (!outcome || outcome.type === "no-response-yet") {
      const nextAsk = record.checkBackOn ?? addDays(loop.today, FOLLOW_UP_POLICY.rescheduleDays[0]);
      lead = C.askAgain(record.name, aheadPhrase(nextAsk, loop.today));
    } else {
      lead = outcome.detail ? C.loggedDetail(outcome.detail) : C.loggedPlain(OUTCOME_READBACK[outcome.type]);
    }
    const step = outcome && outcome.type !== "no-response-yet" ? nextStepAfter(record) : loop.nextStep;
    focalAction = step?.id;
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
          {C.another(waiting[0].name)}
        </button>
      );
    }
  } else if (due.length) {
    const record = due.find((r) => r.id === showing) ?? due[0];
    const other = due.find((r) => r.id !== record.id);
    focalAction = live.find((a) => a.artifactId === record.id)?.id;
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
    focalAction = live.find((a) => a.artifactId === ready.id)?.id;
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
  } else if (loop.nextStep) {
    const step = loop.nextStep;
    const action = actionById(step.id);
    focalAction = step.id;
    card = (
      <NextStepCard
        title={step.title}
        why={action ? { this: action.whyThis, now: action.whyNow, you: action.whyYou } : { now: step.why }}
        href={TOOLBOX}
      />
    );
  }

  const rest = live
    .filter((a) => a.id !== focalAction && a.stage === current)
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
        {card}
        {after}
        <StageActions heading={`Also in ${stage.title}`} items={rest} />
      </div>
      <div className="home__side">
        <BriefingEntry href={BRIEFING} />
        <RecentWork records={loop.records} hrefFor={() => TOOLBOX} />
      </div>
    </div>
  );
}

export default HomepageConcept3;
