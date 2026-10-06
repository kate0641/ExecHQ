"use client";

import { Fragment, useId, useState, type ReactNode } from "react";
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
 * The roadmap as a timeline down a rail. Every stage is a point on it: a finished stage is quiet,
 * the stage she is on is a filled card with what finishing looks like and what she can do, and the
 * ones after it are a name and a time in words. Sparks sit on the same rail, after the stage they
 * happened in, each saying what happened and how her plan moved with it. A plan she has left stays
 * above as the draft she started with, with a spark where it changed.
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

  const next = windows.find((w) => w.status === "recommended");
  const recommended = next !== undefined && !kept.nextDismissed;
  const stageSparks = (w: StageWindow) => sparks.byStage[w.index] ?? [];

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

      <ol className="rtl__rail">
        {windows.map((w) => {
          const isNow = w.status === "current";
          const isNext = w.status === "recommended" && recommended;
          return (
            <Fragment key={`${uid}-${w.index}`}>
              <li className={["rtl__point", `is-${w.status}`, isNow || isNext ? "has-card" : null].filter(Boolean).join(" ")} aria-current={isNow ? "step" : undefined}>
                {isNow || isNext ? (
                  <div className={isNow ? "rtl__now" : "rtl__now rtl__now--next"}>
                    <div className="rtl__now-head">
                      <p className="rtl__eyebrow">
                        {A.stageOf(w.index + 1, windows.length)} · {isNow ? A.states.current : A.states.recommended}
                      </p>
                      <h3 className="rtl__name">{w.title}</h3>
                      <p className="rtl__small">
                        {isNow ? `${A.suggested(whenWords(w.end, today))} · ${A.about(w.weeks)}` : A.recommendedBody(whenWords(w.end, today), w.weeks)}
                      </p>
                    </div>
                    <p className="rtl__finishing">
                      <b>{A.finishing}</b> {stages[w.index].milestone}
                    </p>
                    {isNow ? (
                      <>
                        <details className="rtl__fold">
                          <summary>{T.haveLabel}</summary>
                          <ul className="roadmap__outcomes">
                            {stages[w.index].outcomes.map((o) => (
                              <li key={o}>{o}</li>
                            ))}
                          </ul>
                        </details>
                        <StageEntries w={w} items={entries(w)} today={today} onAdd={onAdd} />
                      </>
                    ) : null}
                    {actionsFor(w)}
                  </div>
                ) : (
                  <div className="rtl__row-head">
                    <span className="rtl__line-name">
                      <span className="rtl__name">{w.title}</span>
                      {w.status === "recommended" ? <span className="rtl__pill">{A.states.recommended}</span> : null}
                    </span>
                    <span className="rtl__when">{w.status === "done" ? A.states.done : whenWords(w.end, today)}</span>
                  </div>
                )}
              </li>
              <SparkPoints sparks={stageSparks(w)} />
            </Fragment>
          );
        })}
      </ol>

      {finished ? (
        <div className="rtl__end">
          <p className="rtl__name">{A.allDone}</p>
          <p className="rtl__small">{template?.after ?? A.allDoneBody}</p>
        </div>
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
          <SparkNote key={s.id} spark={s} as="li" />
        ))}
      </ul>
      {rest.length ? (
        <details className="rtl__more">
          <summary>{T.moreSparks(rest.length)}</summary>
          <ul className="rtl__spark-list">
            {rest.map((s) => (
              <SparkNote key={s.id} spark={s} as="li" />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

function SparkNote({ spark, as: Tag = "div" }: { spark: PlanSpark; as?: "div" | "li" }) {
  return (
    <Tag className="rtl__spark">
      <span className="rtl__spark-mark" aria-hidden="true">
        <Icon name="spark" size={16} />
      </span>
      <div className="rtl__spark-text">
        <span className="rtl__spark-label">{spark.label}</span>
        <p>{spark.text}</p>
      </div>
    </Tag>
  );
}

type Entry = CalendarItem & { kind?: "yours" | "step"; suggested?: boolean };

/** Sparks as points on the rail, after the stage they happened in. A few show; the rest fold into "n more". */
function SparkPoints({ sparks }: { sparks: PlanSpark[] }) {
  if (!sparks.length) return null;
  const shown = sparks.slice(0, SHOWN);
  const rest = sparks.slice(SHOWN);
  return (
    <>
      {shown.map((spark) => (
        <li className="rtl__point rtl__point--spark" key={spark.id}>
          <SparkNote spark={spark} />
        </li>
      ))}
      {rest.length ? (
        <li className="rtl__point rtl__point--spark">
          <details className="rtl__more">
            <summary>{T.moreSparks(rest.length)}</summary>
            <ul className="rtl__spark-list">
              {rest.map((spark) => (
                <SparkNote key={spark.id} spark={spark} as="li" />
              ))}
            </ul>
          </details>
        </li>
      ) : null}
    </>
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
