"use client";

import { LoopRow } from "@/components/homepage/LoopRow";
import { CardCarousel, type CarouselItem } from "@/components/layout/CardCarousel";
import { NextStepCard } from "@/components/homepage/NextStepCard";
import { CheckIn } from "@/components/loop/CheckIn";
import { addDays, aheadPhrase, dueFollowUps, type LoopRecord } from "@/lib/loop";
import { loopActions, nextStepAfter, type LoopView } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import type { MapRing } from "@/lib/map";
import { CHECKIN_COPY as CK, HOME_COPY, MAP_COPY as M, STAY_COPY as S } from "@/mock/homepage";
import { FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { ACTIONS, HORIZONS, actionById } from "@/mock/plan-stub";

/**
 * What she has in progress, under the map (Homepage Concept 4). The two
 * pieces Concept 2 settled: "Stay on track", everything waiting on her
 * word, then her next step with the three reasons for it. Stay on track
 * leads, and is left out on the first return, when nothing is waiting.
 *
 * One rule is new here. The next step is only ever something she has
 * started. An action she has not started shows on the map and leads to the
 * Plan, so it never appears here as a way to jump straight to a tool.
 */

const TOOLBOX = conceptHref("toolbox-flow", "concept-1");

/** Moves focus to a heading once the card it names has replaced the last. */
function focusSoon(id: string) {
  setTimeout(() => document.getElementById(id)?.focus(), 0);
}

export function InProgress({ loop, rings }: { loop: LoopView; rings: MapRing[] }) {
  const due = dueFollowUps(loop.records, loop.today);
  const forAction = (recordId: string) => {
    const action = ACTIONS.find((a) => a.artifactId === recordId);
    const horizon = HORIZONS.find((h) => h.id === action?.horizon);
    return action && horizon ? { lead: HOME_COPY.forAction(horizon.label), title: action.title } : undefined;
  };

  const readyRecords = loop.records.filter((r) => r.state === "ready");
  const waitingRecords = loop.records.filter((r) => (r.state === "used" || r.state === "waiting") && !due.includes(r));
  const answered =
    loop.homeState === "just-answered" && loop.justAnswered ? loop.records.find((r) => r.id === loop.justAnswered) : undefined;

  /* Her next step: after a logged outcome, the step that brings; otherwise
     the first recommendation she has started whose work has not reached the
     Loop yet. Never one she has not started, or has skipped. */
  const inProgress = new Set(rings.flatMap((r) => r.segments.filter((s) => s.state === "in-progress").map((s) => s.action.id)));
  const outcome = answered?.outcome;
  const updated = Boolean(answered && outcome && outcome.type !== "no-response-yet");
  const step = updated
    ? nextStepAfter(answered!)
    : loop.recommendations.find((rec) => {
        const action = actionById(rec.id);
        if (action && !inProgress.has(action.id)) return false;
        const record = action?.artifactId ? loop.records.find((r) => r.id === action.artifactId) : undefined;
        if (loop.tasks?.[rec.id]) return false;
        return !record || record.state === "drafted" || record.state === "in-progress";
      });
  const stepAction = step ? actionById(step.id) : undefined;

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

  /* An action with no draft that she has said is done, waiting on (or just
     given) what came of it. */
  const pendingTask = ACTIONS.find((a) => {
    const t = !a.artifactId ? loop.tasks?.[a.id] : undefined;
    return t && !t.dropped && (!t.outcome || t.outcome.on === loop.today);
  });
  const taskCheck = pendingTask ? loop.tasks![pendingTask.id] : undefined;
  const taskReadback = taskCheck?.outcome
    ? taskCheck.outcome.type === "no-response-yet"
      ? CK.taskNothingYet
      : taskCheck.outcome.detail
        ? HOME_COPY.loggedDetail(taskCheck.outcome.detail)
        : HOME_COPY.loggedPlain(OUTCOME_READBACK[taskCheck.outcome.type])
    : undefined;

  const anyUsed = loop.records.some((r) => r.usedOn);

  /* Each thing waiting on her word is a card, in this order: an action with
     no draft she has done, what she has just answered, follow-ups due,
     drafts ready, then drafts only waiting, which are quiet. */
  const cards: CarouselItem[] = [];
  if (pendingTask && taskCheck) {
    cards.push({
      id: `task-${pendingTask.id}`,
      node: (
        <CheckIn
          task={taskCheck}
          today={loop.today}
          about={pendingTask.title}
          layout="question"
          answered={Boolean(taskCheck.outcome)}
          readback={taskReadback}
          onAnswer={(type) => loopActions.answerTask(pendingTask.id, type)}
          onNote={(detail) => loopActions.noteTask(pendingTask.id, detail)}
          headingId="check-in-task"
        />
      ),
    });
  }
  const recordCard = (record: LoopRecord, isAnswered: boolean) => {
    const headingId = `check-in-${record.id}`;
    cards.push({
      id: record.id,
      node: (
        <CheckIn
          record={record}
          today={loop.today}
          about={forAction(record.id)?.title}
          layout="question"
          answered={isAnswered}
          readback={isAnswered ? readback : undefined}
          headingId={headingId}
          onUsed={() => {
            loopActions.markUsed(record.id);
            focusSoon("stay-heading");
          }}
          onAnswer={(type) => {
            loopActions.answer(record.id, { type });
            focusSoon(headingId);
          }}
          onNote={(detail) => loopActions.noteOutcome(record.id, detail)}
        />
      ),
    });
  };
  if (answered) recordCard(answered, true);
  due.filter((r) => r.id !== answered?.id).forEach((r) => recordCard(r, false));
  readyRecords.filter((r) => r.id !== answered?.id).forEach((r) => recordCard(r, false));
  waitingRecords
    .filter((r) => r.id !== answered?.id)
    .forEach((r) =>
      cards.push({
        id: r.id,
        node: <LoopRow record={r} line={r.checkBackOn ? S.askOn(aheadPhrase(r.checkBackOn, loop.today)) : S.usedNoAsk} />,
      })
    );

  /* On the first return nothing is waiting on her word, so Stay on track is
     left out. Otherwise it leads, above her next step. */
  const first = loop.homeState === "first-return";
  const stay = first ? null : (
    <section className="c2-section" aria-labelledby="stay-heading">
      <div className="signals-home__intro">
        <h2 className="signals-home__heading" id="stay-heading" tabIndex={-1}>
          {S.heading}
        </h2>
      </div>
      <CardCarousel label={S.heading} items={cards} previousLabel={S.previous} nextLabel={S.next} />
      {cards.length === 0 ? <p className="c2-section__note">{anyUsed ? S.allLogged : S.empty}</p> : null}
    </section>
  );
  const next = (
    <>
      {step ? (
        <NextStepCard
          eyebrow={S.nextHeading}
          lead={updated ? <p className="home-card__readback">{S.updated}</p> : undefined}
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
                    focusSoon("check-in-task");
                  },
                }
              : undefined
          }
        />
      ) : (
        <p className="c2-section__note">{M.nothingInProgress}</p>
      )}
  </>
  );

  return (
    <>
      {stay}
      {next}
    </>
  );
}
