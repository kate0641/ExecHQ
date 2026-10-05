"use client";

import { LoopRow } from "@/components/homepage/LoopRow";
import { CardCarousel, type CarouselItem } from "@/components/layout/CardCarousel";
import { CheckIn } from "@/components/loop/CheckIn";
import { addDays, aheadPhrase, dueFollowUps, type LoopRecord } from "@/lib/loop";
import { loopActions, type LoopView } from "@/lib/loop-store";
import { CHECKIN_COPY as CK, HOME_COPY, STAY_COPY as S } from "@/mock/homepage";
import { FOLLOW_UP_POLICY, OUTCOME_READBACK } from "@/mock/loop";
import { ACTIONS, HORIZONS } from "@/mock/plan-stub";

/**
 * Stay on track, under the map (Homepage Concept 4): everything waiting on
 * her word. Her next step is not here; it is the card under the rings. Left
 * out on the first return, when nothing is waiting.
 */

/** Moves focus to a heading once the card it names has replaced the last. */
function focusSoon(id: string) {
  setTimeout(() => document.getElementById(id)?.focus(), 0);
}

export function InProgress({ loop }: { loop: LoopView }) {
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
  return stay;
}
