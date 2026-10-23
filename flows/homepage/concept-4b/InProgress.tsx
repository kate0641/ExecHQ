"use client";

import { useState } from "react";
import { LoopRow } from "@/components/homepage/LoopRow";
import { ReadinessCheckIn } from "@/components/homepage/ReadinessCheckIn";
import { CardCarousel, type CarouselItem } from "@/components/layout/CardCarousel";
import { CheckIn } from "@/components/loop/CheckIn";
import { OutcomeNext } from "@/components/loop/OutcomeNext";
import { useNextAfter } from "@/lib/use-next-after";
import { addDays, aheadPhrase, dueFollowUps, outcomeReadback, type LoopRecord } from "@/lib/loop";
import { loopActions, type LoopView } from "@/lib/loop-store";
import { CHECKIN_COPY as CK, HOME_COPY, READINESS_HISTORY, STAY_COPY as S } from "@/mock/homepage";
import { FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { ACTIONS, HORIZONS } from "@/mock/plan-stub";

/**
 * Stay on track, under the map (Homepage Concept 4b): everything waiting on
 * her word. Her next step is not here; it is the card under the rings. Left
 * out on the first return, when nothing is waiting.
 *
 * 4b adds the weekly check-in (Kate, 2026-10-23): due a week after her last
 * answer, which in every moment but the first return is today. It comes after
 * what came of her work, so it never pushes that aside. Her answer stays
 * with this page: a reload asks again, as a prototype should.
 */

/** Moves focus to a heading once the card it names has replaced the last. */
function focusSoon(id: string) {
  setTimeout(() => document.getElementById(id)?.focus(), 0);
}

export function InProgress({ loop }: { loop: LoopView }) {
  const [readiness, setReadiness] = useState<{ answer?: number; later?: boolean }>({});
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

  const outcome = answered?.outcome;
  const readback = answered
    ? !outcome || outcome.type === "no-response-yet"
      ? HOME_COPY.askAgain(
          answered.name,
          aheadPhrase(answered.checkBackOn ?? addDays(loop.today, FOLLOW_UP_POLICY.rescheduleDays[0]), loop.today)
        )
      : outcome.detail
        ? HOME_COPY.loggedDetail(outcome.detail)
        : HOME_COPY.loggedPlain(outcomeReadback(outcome.type, answered.kind))
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

  /* Once she has answered, the card gives her next step, whatever she said,
     by the rules the builder and the advisor share; she asks for nothing
     more, and a note is hers to add (13 Oct). */
  const answeredType = answered ? (answered.outcome?.type ?? "no-response-yet") : undefined;
  const nextForRecord = useNextAfter(answered && answeredType ? { record: answered, type: answeredType } : undefined);
  const nextForTask = useNextAfter(pendingTask && taskCheck?.outcome ? { taskId: pendingTask.id, type: taskCheck.outcome.type } : undefined);

  /* Each thing waiting on her word is a card, in this order: an action with
     no draft she has done, what she has just answered, follow-ups due,
     drafts ready, then drafts only waiting, which are quiet. */
  const cards: CarouselItem[] = [];
  if (pendingTask && taskCheck) {
    cards.push({
      id: `task-${pendingTask.id}`,
      node: (
        taskCheck.outcome && nextForTask ? (
          <OutcomeNext
            readback={nextForTask.readback}
            offers={nextForTask.offers}
            onNote={(detail) => loopActions.noteTask(pendingTask.id, detail)}
            noted={taskCheck.outcome.detail}
            headingId="check-in-task"
          />
        ) : (
          <CheckIn
            task={taskCheck}
            today={loop.today}
            about={pendingTask.title}
            layout="question"
            answered={Boolean(taskCheck.outcome)}
            readback={taskReadback}
            logged={Boolean(taskCheck.outcome && taskCheck.outcome.type !== "no-response-yet")}
            readbackLead={taskCheck.outcome?.detail ? HOME_COPY.loggedLead : undefined}
            onAnswer={(type) => {
              loopActions.answerTask(pendingTask.id, type);
              focusSoon("check-in-task");
            }}
            onNote={(detail) => loopActions.noteTask(pendingTask.id, detail)}
            headingId="check-in-task"
          />
        )
      ),
    });
  }
  const recordCard = (record: LoopRecord, isAnswered: boolean) => {
    const headingId = `check-in-${record.id}`;
    cards.push({
      id: record.id,
      node:
        isAnswered && nextForRecord ? (
          <OutcomeNext
            readback={nextForRecord.readback}
            offers={nextForRecord.offers}
            note={nextForRecord.note}
            onNote={answeredType === "no-longer-relevant" && record.kind !== "positioning" ? undefined : (detail) => loopActions.noteOutcome(record.id, detail)}
            noted={record.outcome?.detail}
            onNotNow={() => {
              loopActions.moveOn();
              focusSoon("stay-heading");
            }}
            headingId={headingId}
          />
        ) : (
        <CheckIn
          record={record}
          today={loop.today}
          about={forAction(record.id)?.title}
          layout="question"
          answered={isAnswered}
          readback={isAnswered ? readback : undefined}
          logged={isAnswered && Boolean(outcome && outcome.type !== "no-response-yet")}
          readbackLead={isAnswered && outcome?.detail ? HOME_COPY.loggedLead : undefined}
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
  cards.push({
    id: "readiness",
    node: (
      <ReadinessCheckIn
        history={READINESS_HISTORY}
        answer={readiness.answer}
        later={readiness.later}
        onAnswer={(answer) => {
          setReadiness({ answer });
          focusSoon("readiness-check-in");
        }}
        onNotNow={() => {
          setReadiness({ later: true });
          focusSoon("readiness-check-in");
        }}
      />
    ),
  });
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
      <CardCarousel label={S.heading} items={cards} arrows={false} />
      {cards.length === 0 ? <p className="c2-section__note">{anyUsed ? S.allLogged : S.empty}</p> : null}
    </section>
  );
  return stay;
}
