"use client";

import { useId, useState, type ReactNode } from "react";
import type { RoadmapChoices } from "@/components/plan/PlanRoadmap";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { dayLabel } from "@/lib/calendar";
import type { LoopDate } from "@/lib/loop";
import { NO_SPARKS, type PlanSpark, type TimelineSparks } from "@/lib/plan-sparks";
import { dismissNext, finishStage, startNext } from "@/lib/roadmap-choices";
import { roadmapWindows, totalWeeks, type StageWindow } from "@/lib/roadmap-dates";
import { whenWords } from "@/lib/time-words";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import {
  AGENDA_COPY as A,
  CALENDAR_COPY as CAL,
  ROADMAP_COPY as C,
  TIMELINE_COPY as T,
  roadmapFor,
  type CalendarItem,
  type CalendarStep,
} from "@/mock/plan";

export interface RoadmapTimelineProps {
  planId: string;
  startedOn: LoopDate;
  today: LoopDate;
  /** The stage her work says she is in, from 0. The timeline suggests finishing it. */
  evidenceStage: number;
  /** The stage she was in when the scenario began. */
  startStage?: number;
  /** Her choices, kept by the page. Without them the timeline keeps its own. */
  choices?: RoadmapChoices;
  onChoices?: (next: RoadmapChoices) => void;
  /** What she put on her own calendar, shown in the stage it falls in. */
  items?: CalendarItem[];
  /** Her plan steps, shown in the stage each day falls in. */
  steps?: CalendarStep[];
  /** What happened and how her plan moved, read off what she did. */
  sparks?: TimelineSparks;
  /** She wants to add something to a stage, on a day inside it. */
  onAdd?: (date: LoopDate) => void;
  headingId?: string;
  className?: string;
}

/** The most sparks a stage shows before the rest fold away. */
const SHOWN = 3;

/**
 * The roadmap as Now, Next and Later. The stage she is on is one full card: what it is, when to
 * aim for, what finishing looks like, what she will have, and the sparks that say what happened
 * and how her plan moved. The stage after it is one line, later stages are plain lines, and
 * stages she has finished fold into a count. A plan she has left stays above as the draft she
 * started with, with a spark where it changed.
 *
 * Times are words (this month, next quarter), never days, and a stage's pace is a suggestion that
 * moves as she does, never a deadline. She can say she has finished a stage whenever she likes,
 * and when her work says she has, it offers to mark it. Finishing recommends the next stage; she
 * starts it or says "Not yet". Nothing advances on its own.
 */
export function RoadmapTimeline({
  planId: initialPlanId,
  startedOn: initialStartedOn,
  today,
  evidenceStage,
  startStage,
  choices,
  onChoices,
  items = [],
  steps = [],
  sparks = NO_SPARKS,
  onAdd,
  headingId = "roadmap-timeline",
  className,
}: RoadmapTimelineProps) {
  const uid = useId();
  const [local, setLocal] = useState<RoadmapChoices>({
    planId: initialPlanId,
    startedOn: initialStartedOn,
    snoozedAt: null,
    history: [],
  });
  const kept = choices ?? local;
  const update = (next: RoadmapChoices) => (onChoices ? onChoices(next) : setLocal(next));

  const { planId, startedOn, history, snoozedAt } = kept;
  const template = PLAN_TEMPLATES.find((p) => p.id === planId);
  const stages = roadmapFor(planId);
  const switched = history.length > 0;
  const evidence = switched ? 0 : Math.min(evidenceStage, stages.length - 1);
  const windows = roadmapWindows({ planId, startedOn, choices: kept, evidenceStage, startStage, today });
  const here = windows.find((w) => w.status === "current");
  // Her work says she has done what the stage asks, and she has not said so.
  const suggest = here && evidence > here.index && snoozedAt !== evidence;
  const finished = Object.keys(kept.finishedOn ?? {}).length > 0 && !here && kept.recommended == null;

  const entries = (w: StageWindow) =>
    [
      ...items.map((i) => ({ ...i, kind: "yours" as const })),
      ...steps.map((i) => ({ id: i.id, title: i.title, date: i.date, kind: "step" as const, suggested: i.suggested })),
    ]
      .filter((i) => i.date >= w.start && i.date <= w.end)
      .sort((a, b) => (a.date < b.date ? -1 : 1));

  /** What she can do on the stage she is on, or on the one recommended next. */
  function actionsFor(w: StageWindow): ReactNode {
    if (w.status === "current")
      return (
        <>
          {w.pastPace ? <p className="rtl__small">{A.pastPace}</p> : null}
          {suggest ? (
            <aside className="roadmap__advance rtl__suggest" aria-label={A.suggestTitle}>
              <p className="roadmap__advance-title">{A.suggestTitle}</p>
              <p className="roadmap__advance-body">{A.suggestBody}</p>
              <div className="roadmap__advance-actions">
                <Button variant="primary" size="sm" onClick={() => update(finishStage(kept, w.index, windows.length, today))}>
                  {A.markFinished}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => update({ ...kept, snoozedAt: evidence })}>
                  {A.notYet}
                </Button>
              </div>
            </aside>
          ) : (
            <div>
              <Button variant="primary" size="sm" onClick={() => update(finishStage(kept, w.index, windows.length, today))}>
                {A.finish}
              </Button>
            </div>
          )}
        </>
      );
    return (
      <div className="roadmap__advance-actions">
        <Button variant="primary" size="sm" onClick={() => update(startNext(kept))}>
          {A.start}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => update(dismissNext(kept))}>
          {A.notYet}
        </Button>
      </div>
    );
  }

  const done = windows.filter((w) => w.status === "done");
  const next = windows.find((w) => w.status === "recommended") ?? (here ? windows[here.index + 1] : undefined);
  const later = windows.filter((w) => w.status === "later" && w !== next);
  const recommended = next?.status === "recommended" && !kept.nextDismissed;
  const stageSparks = (w: StageWindow) => sparks.byStage[w.index] ?? [];
  // The stage she has just finished says so beside the one recommended next, where it matters, and not only in the fold.
  const justDone = next?.status === "recommended" ? done[done.length - 1] : undefined;

  return (
    <section className={["rtl", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="rtl__head">
        <h2 className="roadmap__heading" id={headingId}>
          {C.heading}
        </h2>
        <p className="rtl__line">{A.summary(windows.length, totalWeeks(windows))}</p>
        <p className="rtl__small">{A.pace}</p>
      </div>

      {history.map((h, i) => (
        <EarlierPlan key={`${uid}-earlier-${i}`} planId={h.planId} atStage={h.atStage} sparks={sparks.afterEarlier[i] ?? []} />
      ))}

      {here ? (
        <section className="rtl__group" aria-label={T.now}>
          <p className="rtl__eyebrow">
            {T.now} · {A.stageOf(here.index + 1, windows.length)}
          </p>
          <div className="rtl__now">
            <div className="rtl__now-head">
              <h3 className="rtl__name">{here.title}</h3>
              <p className="rtl__small">
                {A.suggested(whenWords(here.end, today))} · {A.about(here.weeks)}
              </p>
            </div>
            <p className="rtl__finishing">
              <b>{A.finishing}</b> {stages[here.index].milestone}
            </p>
            <details className="rtl__fold">
              <summary>{T.haveLabel}</summary>
              <ul className="roadmap__outcomes">
                {stages[here.index].outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </details>
            <StageEntries w={here} items={entries(here)} today={today} onAdd={onAdd} />
            {actionsFor(here)}
            <Sparks sparks={stageSparks(here)} />
          </div>
        </section>
      ) : null}

      {next ? (
        <section className="rtl__group" aria-label={T.next}>
          <p className="rtl__eyebrow">
            {T.next} · {A.stageOf(next.index + 1, windows.length)}
          </p>
          {recommended ? (
            <div className="rtl__now">
              <div className="rtl__now-head">
                <h3 className="rtl__name">{next.title}</h3>
                <p className="rtl__small">{A.recommendedBody(whenWords(next.end, today), next.weeks)}</p>
              </div>
              <p className="rtl__finishing">
                <b>{A.finishing}</b> {stages[next.index].milestone}
              </p>
              {actionsFor(next)}
            </div>
          ) : (
            <StageLine w={next} today={today} recommended={next.status === "recommended"} />
          )}
          <Sparks sparks={[...(justDone ? stageSparks(justDone) : []), ...stageSparks(next)]} />
        </section>
      ) : null}

      {later.length ? (
        <section className="rtl__group" aria-label={T.later}>
          <p className="rtl__eyebrow">{T.later}</p>
          <ul className="rtl__lines">
            {later.map((w) => (
              <li key={`${uid}-${w.index}`}>
                <StageLine w={w} today={today} />
                <Sparks sparks={stageSparks(w)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {finished ? (
        <div className="rtl__end">
          <p className="rtl__name">{A.allDone}</p>
          <p className="rtl__small">{template?.after ?? A.allDoneBody}</p>
        </div>
      ) : null}

      {done.length ? (
        <details className="rtl__fold rtl__done">
          <summary>{T.doneCount(done.length)}</summary>
          <ul className="rtl__lines">
            {done.map((w) => (
              <li key={`${uid}-${w.index}`}>
                <StageLine w={w} today={today} />
                <Sparks sparks={w === justDone ? [] : stageSparks(w)} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

/** A plan she has left, kept as the draft she started with: its stages in brief, then the spark where it changed. */
function EarlierPlan({ planId, atStage, sparks }: { planId: string; atStage: number; sparks: PlanSpark[] }) {
  const template = PLAN_TEMPLATES.find((p) => p.id === planId);
  const stages = roadmapFor(planId);
  return (
    <div className="rtl__earlier">
      <h3 className="rtl__earlier-title">{T.earlierTitle(template?.name ?? planId)}</h3>
      <ol className="rtl__earlier-stages">
        {stages.map((s, i) => (
          <li key={s.title} className={i < atStage ? "is-done" : i === atStage ? "is-here" : undefined}>
            <span>{s.title}</span>
            <span className="rtl__small">{i < atStage ? A.states.done : i === atStage ? T.earlierNow : T.earlierSetAside}</span>
          </li>
        ))}
      </ol>
      <Sparks sparks={sparks} />
    </div>
  );
}

function Sparks({ sparks }: { sparks: PlanSpark[] }) {
  if (!sparks.length) return null;
  const shown = sparks.slice(0, SHOWN);
  const rest = sparks.slice(SHOWN);
  return (
    <section className="rtl__sparks" aria-label={T.sparksLabel}>
      <ul className="rtl__spark-list">
        {shown.map((s) => (
          <SparkNote key={s.id} spark={s} />
        ))}
      </ul>
      {rest.length ? (
        <details className="rtl__more">
          <summary>{T.moreSparks(rest.length)}</summary>
          <ul className="rtl__spark-list">
            {rest.map((s) => (
              <SparkNote key={s.id} spark={s} />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

function SparkNote({ spark }: { spark: PlanSpark }) {
  return (
    <li className="rtl__spark">
      <span className="rtl__spark-mark" aria-hidden="true">
        <Icon name="spark" size={16} />
      </span>
      <div className="rtl__spark-text">
        <span className="rtl__spark-label">{spark.label}</span>
        <p>{spark.text}</p>
      </div>
    </li>
  );
}

type Entry = CalendarItem & { kind?: "yours" | "step"; suggested?: boolean };

/** A stage in one line: its name, and when to aim for it in words. */
function StageLine({ w, today, recommended }: { w: StageWindow; today: LoopDate; recommended?: boolean }) {
  return (
    <div className="rtl__line-row">
      <span className="rtl__line-name">
        <span className="rtl__name">{w.title}</span>
        {recommended ? <span className="rtl__pill">{A.states.recommended}</span> : null}
      </span>
      <span className="rtl__when">{w.status === "done" ? A.states.done : whenWords(w.end, today)}</span>
    </div>
  );
}

/** What is on her calendar inside the stage she is on, folded away, with the way to add to it. */
function StageEntries({ w, items, today, onAdd }: { w: StageWindow; items: Entry[]; today: LoopDate; onAdd?: (date: LoopDate) => void }) {
  if (!items.length && !onAdd) return null;
  return (
    <details className="rtl__fold">
      <summary>{items.length ? T.calendarCount(items.length) : T.calendarEmpty}</summary>
      {items.length ? (
        <ul className="rtl__agenda">
          {items.map((item) => (
            <li className="rtl__row" key={item.id}>
              <span className="rtl__tag">
                {item.kind === "step" ? `${A.step}${item.suggested ? ` · ${CAL.suggested}` : ""}` : A.yours} ·{" "}
                {/* A step from her plan says when in words. What she put there herself keeps the day she chose. */}
                {item.kind === "step" ? whenWords(item.date, today) : dayLabel(item.date)}
              </span>
              <span className="rtl__item">{item.title}</span>
              {item.note ? <span className="rtl__small">{item.note}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rtl__small">{A.nothingYet}</p>
      )}
      {onAdd ? (
        <div>
          <Button variant="secondary" size="sm" onClick={() => onAdd(today >= w.start && today <= w.end ? today : w.start)}>
            {CAL.addStage}
          </Button>
        </div>
      ) : null}
    </details>
  );
}

export default RoadmapTimeline;
