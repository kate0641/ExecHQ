"use client";

import { useId, useState } from "react";
import { PlanSwitchSheet } from "@/components/plan/PlanSwitchSheet";
import type { PlanChange, RoadmapChoices } from "@/components/plan/PlanRoadmap";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { shortDate, type LoopDate } from "@/lib/loop";
import { dismissNext, finishStage, startNext, switchPlan } from "@/lib/roadmap-choices";
import { periodLabel, roadmapWindows, totalWeeks, type StageWindow } from "@/lib/roadmap-dates";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import { AGENDA_COPY as A, CALENDAR_COPY as CAL, ROADMAP_COPY as C, roadmapFor, type CalendarItem, type CalendarStep } from "@/mock/plan";

export interface RoadmapAgendaProps {
  planId: string;
  startedOn: LoopDate;
  today: LoopDate;
  /** Why this plan, tied to what she said in onboarding. */
  rationale: string;
  /** The stage her work says she is in, from 0. The Agenda suggests finishing it. */
  evidenceStage: number;
  /** The stage she was in when the scenario began. */
  startStage?: number;
  /** Her choices, kept by the page. Without them the Agenda keeps its own. */
  choices?: RoadmapChoices;
  onChoices?: (next: RoadmapChoices) => void;
  /** What she put on her own calendar, shown in the stage it falls in. */
  items?: CalendarItem[];
  /** Her plan steps, shown in the stage each day falls in. */
  steps?: CalendarStep[];
  /** The day in view, shared with the Calendar: its stage opens here and its items are marked. */
  selected?: LoopDate;
  /** She picked a day by opening one of her items. */
  onSelectDay?: (date: LoopDate) => void;
  /** She wants to add something to a stage, on a day inside it. */
  onAdd?: (date: LoopDate) => void;
  /** Told when she switches plan, so the page can choose new next steps. */
  onChangePlan?: (planId: string) => void;
  /** Catalogue only. */
  demoOpen?: "switch" | "confirm";
  demoHistory?: PlanChange[];
  headingId?: string;
  className?: string;
}

const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dateParts = (date: LoopDate) => {
  const d = new Date(`${date}T00:00:00Z`);
  return { day: d.getUTCDate(), dow: DOW[d.getUTCDay()], month: shortDate(date).split(" ")[1] };
};

/**
 * The roadmap as an Agenda: the stages stacked as cards, each with its
 * suggested period, what finishing looks like, and what she has on her
 * calendar inside it. The stage she is in is open and the rest are one tap away.
 *
 * Periods are a suggested pace that moves as she does, never a deadline. She
 * can say she has finished a stage whenever she likes, and when her work says
 * she has, it offers to mark it. Finishing recommends the next stage; she
 * starts it or says "Not yet". Nothing advances on its own.
 */
export function RoadmapAgenda({
  planId: initialPlanId,
  startedOn: initialStartedOn,
  today,
  rationale,
  evidenceStage,
  startStage,
  choices,
  onChoices,
  items = [],
  steps = [],
  selected,
  onSelectDay,
  onAdd,
  onChangePlan,
  demoOpen,
  demoHistory,
  headingId = "roadmap-agenda",
  className,
}: RoadmapAgendaProps) {
  const uid = useId();
  const [local, setLocal] = useState<RoadmapChoices>({
    planId: initialPlanId,
    startedOn: initialStartedOn,
    snoozedAt: null,
    history: demoHistory ?? [],
  });
  const kept = choices ?? local;
  const update = (next: RoadmapChoices) => (onChoices ? onChoices(next) : setLocal(next));
  const [switching, setSwitching] = useState(demoOpen !== undefined);

  const { planId, startedOn, history, snoozedAt } = kept;
  const template = PLAN_TEMPLATES.find((p) => p.id === planId);
  const stages = roadmapFor(planId);
  const switched = history.length > 0;
  const evidence = switched ? 0 : Math.min(evidenceStage, stages.length - 1);
  const current = Math.min(kept.confirmed ?? startStage ?? evidenceStage, stages.length - 1);
  const windows = roadmapWindows({ planId, startedOn, choices: kept, evidenceStage, startStage, today });
  const here = windows.find((w) => w.status === "current");
  const next = kept.recommended != null ? windows[kept.recommended] : undefined;
  // Her work says she has done what the stage asks, and she has not said so.
  const suggest = here && evidence > here.index && snoozedAt !== evidence;
  const finished = Object.keys(kept.finishedOn ?? {}).length > 0 && !here && !next && kept.recommended == null;

  function switchTo(id: string) {
    update(switchPlan(kept, id, today, current));
    setSwitching(false);
    onChangePlan?.(id);
  }

  return (
    <section className={["rma", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="roadmap__head">
        <h2 className="roadmap__heading" id={headingId}>
          {C.heading}
        </h2>
        <p className="roadmap__plan">
          <b>{template?.name}</b>
          {template?.formalName ? <span> · {template.formalName}</span> : null}
        </p>
      </div>
      <div className="rma__summary">
        <p className="rma__line">
          {A.summary(windows.length, totalWeeks(windows), shortDate(windows[0].start), shortDate(windows[windows.length - 1].end))}
        </p>
        <p className="rma__pace">{A.pace}</p>
        <p className="roadmap__why">
          <span>{C.whyThis}</span> {switched ? C.switchedOn(shortDate(startedOn)) : rationale}
        </p>
      </div>

      {here ? (
        <div className="rma__here">
          <div className="rma__here-top">
            <span className="rma__pill">{A.states.current}</span>
            <span className="rma__small">
              {A.stageOf(here.index + 1, windows.length)} · {periodLabel(here)}
            </span>
          </div>
          <p className="rma__here-name">{here.title}</p>
          {here.pastPace ? <p className="rma__small">{A.pastPace}</p> : null}
          {suggest ? (
            <aside className="roadmap__advance rma__suggest" aria-label={A.suggestTitle}>
              <p className="roadmap__advance-title">{A.suggestTitle}</p>
              <p className="roadmap__advance-body">{A.suggestBody}</p>
              <div className="roadmap__advance-actions">
                <Button variant="primary" size="sm" onClick={() => update(finishStage(kept, here.index, windows.length, today))}>
                  {A.markFinished}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => update({ ...kept, snoozedAt: evidence })}>
                  {A.notYet}
                </Button>
              </div>
            </aside>
          ) : (
            <Button variant="primary" size="sm" onClick={() => update(finishStage(kept, here.index, windows.length, today))}>
              {A.finish}
            </Button>
          )}
          <p className="rma__small">
            {here.index < windows.length - 1 ? A.thenNext(here.index + 2, windows[here.index + 1].title) : A.thenAfter}
          </p>
        </div>
      ) : null}

      {next && !kept.nextDismissed ? (
        <aside className="rma__next" aria-label={A.states.recommended}>
          <span className="rma__pill">{A.states.recommended}</span>
          <p className="rma__here-name">{A.recommendedTitle(next.index + 1, next.title)}</p>
          <p className="rma__small">
            {A.recommendedBody(periodLabel(next), next.weeks)} {stages[next.index].milestone}
          </p>
          <div className="roadmap__advance-actions">
            <Button variant="primary" size="sm" onClick={() => update(startNext(kept))}>
              {A.start}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => update(dismissNext(kept))}>
              {A.notYet}
            </Button>
          </div>
        </aside>
      ) : null}

      {finished ? (
        <div className="rma__next">
          <p className="rma__here-name">{A.allDone}</p>
          <p className="rma__small">{template?.after ?? A.allDoneBody}</p>
        </div>
      ) : null}

      <div className="rma__stages">
        {windows.map((w) => (
          <StageCard
            key={`${uid}-${w.index}`}
            w={w}
            total={windows.length}
            milestone={stages[w.index].milestone}
            outcomes={stages[w.index].outcomes}
            items={[
              ...items.map((i) => ({ ...i, kind: "yours" as const })),
              ...steps.map((i) => ({ id: i.id, title: i.title, date: i.date, kind: "step" as const, suggested: i.suggested })),
            ]
              .filter((i) => i.date >= w.start && i.date <= w.end)
              .sort((a, b) => (a.date < b.date ? -1 : 1))}
            today={today}
            selected={selected}
            onSelectDay={onSelectDay}
            onAdd={onAdd}
          />
        ))}
      </div>

      {items.some((i) => !windows.some((w) => i.date >= w.start && i.date <= w.end)) ? (
        <section className="rma__outside">
          <h3 className="rma__outside-title">{A.outside}</h3>
          <ul className="rma__agenda">
            {items
              .filter((i) => !windows.some((w) => i.date >= w.start && i.date <= w.end))
              .sort((a, b) => (a.date < b.date ? -1 : 1))
              .map((i) => (
                <Row key={i.id} item={i} selected={selected} onSelectDay={onSelectDay} />
              ))}
          </ul>
        </section>
      ) : null}

      {history.length ? (
        <div className="roadmap__history">
          <h3 className="roadmap__history-title">{C.earlier}</h3>
          <ul>
            {history.map((h) => {
              const old = PLAN_TEMPLATES.find((p) => p.id === h.planId);
              const at = roadmapFor(h.planId)[h.atStage];
              return (
                <li key={`${h.planId}-${h.endedOn}`}>
                  {C.earlierLine(old?.name ?? h.planId, shortDate(h.startedOn), shortDate(h.endedOn), at?.title ?? "")}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="roadmap__foot">
        <Button variant="ghost" size="sm" onClick={() => setSwitching(true)}>
          {C.changePlan}
        </Button>
      </div>

      <PlanSwitchSheet
        open={switching}
        onClose={() => setSwitching(false)}
        currentPlanId={planId}
        onSwitch={switchTo}
        inline={demoOpen !== undefined}
        demoPicked={demoOpen === "confirm" ? "executive-presence" : undefined}
      />
    </section>
  );
}

type AgendaEntry = CalendarItem & { kind?: "yours" | "step"; suggested?: boolean };

function Row({ item, selected, onSelectDay }: { item: AgendaEntry; selected?: LoopDate; onSelectDay?: (date: LoopDate) => void }) {
  const p = dateParts(item.date);
  return (
    <li className={["rma__row", item.date === selected ? "is-selected" : null].filter(Boolean).join(" ")}>
      <div className="rma__date">
        <b>{p.day}</b>
        <span>
          {p.dow} {p.month}
        </span>
      </div>
      <div className="rma__what">
        <span className="rma__tag">{item.kind === "step" ? `${A.step}${item.suggested ? ` · ${CAL.suggested}` : ""}` : A.yours}</span>
        {onSelectDay ? (
          <button type="button" className="rma__item rma__item--button" aria-pressed={item.date === selected} onClick={() => onSelectDay(item.date)}>
            {item.title}
          </button>
        ) : (
          <span className="rma__item">{item.title}</span>
        )}
        {item.note ? <span className="rma__small">{item.note}</span> : null}
      </div>
    </li>
  );
}

function StageCard({
  w,
  total,
  milestone,
  outcomes,
  items,
  today,
  selected,
  onSelectDay,
  onAdd,
}: {
  w: StageWindow;
  total: number;
  milestone: string;
  outcomes: string[];
  items: AgendaEntry[];
  today: LoopDate;
  selected?: LoopDate;
  onSelectDay?: (date: LoopDate) => void;
  onAdd?: (date: LoopDate) => void;
}) {
  const holdsSelected = selected !== undefined && selected >= w.start && selected <= w.end;
  const label = w.status === "later" ? null : A.states[w.status];
  return (
    <details className={["rma__card", w.status === "current" ? "is-current" : null].filter(Boolean).join(" ")} open={w.status === "current" || holdsSelected}>
      <summary className="rma__summary-row">
        <span className="rma__card-top">
          <Badge tone="neutral">{A.stageOf(w.index + 1, total)}</Badge>
          {label ? <span className={w.status === "done" ? "rma__pill rma__pill--quiet" : "rma__pill"}>{label}</span> : null}
        </span>
        <span className="rma__card-name">{w.title}</span>
        <span className="rma__small">
          {periodLabel(w)}
          {w.status === "done" ? "" : ` · ${A.about(w.weeks)}`}
        </span>
      </summary>
      <div className="rma__card-body">
        <p className="rma__finishing">
          <b>{A.finishing}</b> {milestone}
        </p>
        <p className="rma__finishing">
          <b>{A.outcomes}</b>
        </p>
        <ul className="roadmap__outcomes">
          {outcomes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
        {items.length ? (
          <ul className="rma__agenda">
            {items.map((i) => (
              <Row key={i.id} item={i} selected={selected} onSelectDay={onSelectDay} />
            ))}
          </ul>
        ) : (
          <p className="rma__small">{A.nothingYet}</p>
        )}
        {onAdd ? (
          <div>
            <Button variant="secondary" size="sm" onClick={() => onAdd(today >= w.start && today <= w.end ? today : w.start)}>
              {CAL.addStage}
            </Button>
          </div>
        ) : null}
      </div>
    </details>
  );
}

export default RoadmapAgenda;
