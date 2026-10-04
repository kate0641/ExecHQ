"use client";

import { useId, useState, type ReactNode } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { shortDate, type LoopDate } from "@/lib/loop";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import { ROADMAP_COPY as C, roadmapFor } from "@/mock/plan";

export interface PlanChange {
  planId: string;
  startedOn: LoopDate;
  endedOn: LoopDate;
  /** The stage she was in when she left, from 0. */
  atStage: number;
}

/** What she has decided about the roadmap. */
export interface RoadmapChoices {
  planId: string;
  startedOn: LoopDate;
  /** The stage she confirmed, from 0. Unset: the stage she started in. */
  confirmed?: number;
  /** She said "Not yet" while her work pointed at this stage. */
  snoozedAt: number | null;
  history: PlanChange[];
}

export interface PlanRoadmapProps {
  planId: string;
  startedOn: LoopDate;
  today: LoopDate;
  /** Why this plan, tied to what she said in onboarding. */
  rationale: string;
  /** The stage her work says she is in, from 0. The roadmap suggests moving
   *  there; it never moves on its own. */
  evidenceStage: number;
  /** The stage she was in when the scenario began, which she has not had to
   *  confirm. Defaults to `evidenceStage`. */
  startStage?: number;
  /** Her choices, kept by the page. Without them the roadmap keeps its own. */
  choices?: RoadmapChoices;
  onChoices?: (next: RoadmapChoices) => void;
  /** Only the current stage, and a way to see them all: for a page where the
   *  roadmap is one step away. */
  compact?: boolean;
  /** Told when she switches, so the page can choose new next steps. */
  onChangePlan?: (planId: string) => void;
  /** What sits inside the stage she is in: that stage's next steps. */
  children?: ReactNode;
  /** Catalogue only. */
  demoOpen?: "all" | "switch" | "confirm";
  demoConfirmed?: number;
  demoHistory?: PlanChange[];
  demoState?: "hover" | "focus" | "active";
  headingId?: string;
  className?: string;
}

/**
 * The roadmap: three to four stages toward her direction, the stage she is in,
 * and what finishing it looks like. The long-term layer every action step sits
 * inside.
 *
 * Stages are never locked or levelled; any can be opened and read. The system
 * suggests moving on once the work says she has done what the stage asks, and
 * she confirms. It never advances silently, and "Not yet" is as easy as "Move
 * on". The plan's reason from onboarding stays in view. Changing plan is here
 * but quiet, and keeps everything she made.
 */
export function PlanRoadmap({
  planId: initialPlanId,
  startedOn: initialStartedOn,
  today,
  rationale,
  evidenceStage,
  startStage,
  choices,
  onChoices,
  compact = false,
  children,
  onChangePlan,
  demoOpen,
  demoConfirmed,
  demoHistory,
  demoState,
  headingId = "plan-roadmap",
  className,
}: PlanRoadmapProps) {
  const uid = useId();
  const [local, setLocal] = useState<RoadmapChoices>({
    planId: initialPlanId,
    startedOn: initialStartedOn,
    confirmed: demoConfirmed,
    snoozedAt: null,
    history: demoHistory ?? [],
  });
  const kept = choices ?? local;
  const update = (patch: Partial<RoadmapChoices>) => {
    const next = { ...kept, ...patch };
    if (onChoices) onChoices(next);
    else setLocal(next);
  };
  const { planId, startedOn, history, snoozedAt } = kept;
  const confirmed = kept.confirmed ?? startStage ?? evidenceStage;
  const [showAll, setShowAll] = useState(!compact || demoOpen === "all");
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [switching, setSwitching] = useState(demoOpen === "switch" || demoOpen === "confirm");
  const [picked, setPicked] = useState<string | null>(demoOpen === "confirm" ? "executive-presence" : null);

  const template = PLAN_TEMPLATES.find((p) => p.id === planId);
  const stages = roadmapFor(planId);
  const switched = history.length > 0;
  // A new plan starts at its first stage: the work so far belongs to the old one.
  const evidence = switched ? 0 : Math.min(evidenceStage, stages.length - 1);
  const current = Math.min(confirmed, stages.length - 1);
  const suggest = evidence > current && snoozedAt !== evidence ? current + 1 : null;
  const stateClass = demoState ? `is-${demoState}` : undefined;

  const toggle = (i: number) =>
    setOpen((o) => {
      const next = new Set(o);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  function switchTo(id: string) {
    update({
      history: [...history, { planId, startedOn, endedOn: today, atStage: current }],
      planId: id,
      startedOn: today,
      confirmed: 0,
      snoozedAt: null,
    });
    setOpen(new Set());
    setSwitching(false);
    setPicked(null);
    onChangePlan?.(id);
  }

  const visible = showAll ? stages.map((s, i) => [s, i] as const) : [[stages[current], current] as const];

  return (
    <section className={["roadmap", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="roadmap__head">
        <h2 className="roadmap__heading" id={headingId}>
          {C.heading}
        </h2>
        <p className="roadmap__plan">
          <b>{template?.name}</b>
          {template?.formalName ? <span> · {template.formalName}</span> : null}
        </p>
      </div>
      <p className="roadmap__why">
        <span>{C.whyThis}</span> {switched ? C.switchedOn(shortDate(startedOn)) : rationale}
      </p>

      <ol className="roadmap__stages">
        {visible.map(([stage, i]) => {
          const isCurrent = i === current;
          const isDone = i < current;
          const expanded = isCurrent || open.has(i);
          const bodyId = `${uid}-stage-${i}`;
          return (
            <li
              key={stage.title}
              className={["roadmap__stage", isCurrent ? "is-current" : null, isDone ? "is-done" : null]
                .filter(Boolean)
                .join(" ")}
              aria-current={isCurrent ? "step" : undefined}
            >
              {(() => {
                const inner = (
                  <>
                    <span className="roadmap__n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="roadmap__name">
                      <span className="u-visually-hidden">{C.stageOf(i + 1, stages.length)}: </span>
                      {stage.title}
                    </span>
                    {isCurrent ? (
                      <span className="roadmap__chip">{C.here}</span>
                    ) : isDone ? (
                      <span className="roadmap__done">
                        <Icon name="check" size={12} />
                        {C.done}
                      </span>
                    ) : (
                      <Icon name={expanded ? "chevron-up" : "chevron-down"} size={16} />
                    )}
                  </>
                );
                // The stage she is in stays open, so its header is not a control.
                return isCurrent ? (
                  <div
                    className={["roadmap__toggle", "roadmap__toggle--static", stateClass].filter(Boolean).join(" ")}
                    id={`${uid}-head-${i}`}
                    tabIndex={-1}
                  >
                    {inner}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="roadmap__toggle"
                    aria-expanded={expanded}
                    aria-controls={bodyId}
                    onClick={() => toggle(i)}
                  >
                    {inner}
                  </button>
                );
              })()}
              <div className="roadmap__body" id={bodyId} hidden={!expanded}>
                <p className="roadmap__label">{C.finishing}</p>
                <p className="roadmap__milestone">{stage.milestone}</p>
                <p className="roadmap__label">{C.outcomes}</p>
                <ul className="roadmap__outcomes">
                  {stage.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
                {stage.added ? <Badge tone="sprint">{C.addedNote}</Badge> : null}
              </div>

              {isCurrent && suggest !== null ? (
                <aside className="roadmap__advance" aria-label={C.advance.title}>
                  <p className="roadmap__advance-title">{C.advance.title}</p>
                  <p className="roadmap__advance-body">{C.advance.body(stages[suggest].title)}</p>
                  <div className="roadmap__advance-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        update({ confirmed: suggest });
                        requestAnimationFrame(() => document.getElementById(`${uid}-head-${suggest}`)?.focus());
                      }}
                    >
                      {C.advance.move(stages[suggest].title)}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => update({ snoozedAt: evidence })}>
                      {C.advance.notYet}
                    </Button>
                  </div>
                </aside>
              ) : null}
              {isCurrent && children ? <div className="roadmap__stage-content">{children}</div> : null}
            </li>
          );
        })}
      </ol>

      {compact ? (
        <Button variant="ghost" size="sm" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
          {showAll ? C.seeLess : C.seeAll(stages.length)}
          <Icon name={showAll ? "chevron-up" : "chevron-down"} size={16} />
        </Button>
      ) : null}

      {showAll && template?.after && current === stages.length - 1 ? (
        <p className="roadmap__after">
          <span>{C.after}</span> {template.after}
        </p>
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

      <Sheet open={switching} onClose={() => { setSwitching(false); setPicked(null); }} label={C.switchTitle} inline={demoOpen !== undefined}>
        <div className="roadmap__switch">
          <h2 className="roadmap__switch-title">{C.switchTitle}</h2>
          {picked === null ? (
            <>
              <p className="roadmap__switch-intro">{C.switchIntro}</p>
              <ul className="roadmap__plans">
                {PLAN_TEMPLATES.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="roadmap__plan-option"
                      disabled={p.id === planId}
                      onClick={() => setPicked(p.id)}
                    >
                      <span className="roadmap__plan-name">{p.name}</span>
                      <span className="roadmap__plan-for">{p.bestFor}</span>
                      {p.id === planId ? <span className="roadmap__plan-current">{C.current}</span> : null}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="roadmap__switch-intro">{C.customPlan}</p>
            </>
          ) : (
            <>
              <p className="roadmap__switch-intro">
                <b>{PLAN_TEMPLATES.find((p) => p.id === picked)?.name}</b>
              </p>
              <ul className="roadmap__carry">
                {C.carriesOver.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="roadmap__advance-actions">
                <Button variant="primary" onClick={() => switchTo(picked)}>
                  {C.switchTo(PLAN_TEMPLATES.find((p) => p.id === picked)?.name ?? "")}
                </Button>
                <Button variant="ghost" onClick={() => setPicked(null)}>
                  {C.back}
                </Button>
              </div>
            </>
          )}
          {picked === null ? (
            <Button variant="ghost" onClick={() => setSwitching(false)}>
              {C.close}
            </Button>
          ) : null}
        </div>
      </Sheet>
    </section>
  );
}

export default PlanRoadmap;
