"use client";

import Link from "next/link";
import { DayCircles } from "@/components/plan/momentum-visuals";
import { Icon } from "@/components/primitives/Icon";
import { inCalendarWeek, type MomentumEvent } from "@/lib/momentum";
import type { LoopDate } from "@/lib/loop";
import { MOMENTUM_COPY as C, type MomentumFigure } from "@/mock/plan";

export interface MomentumLabeledProps {
  events: MomentumEvent[];
  today: LoopDate;
  /** Days of record she has: a day before her plan began is never drawn as one she missed. */
  history: number;
  /** Her next move, always beside the week, so she sees what to do. */
  nextMove?: { title: string; why?: string; href: string };
  headingId?: string;
  className?: string;
}

const FIGURES: MomentumFigure[] = ["completed", "artifact", "outcome", "signal"];

/**
 * Momentum: her week in motion. This week only, Sunday to Saturday, as seven circles: filled for a day
 * she did something, a thin outline for a past day with nothing in it, dashed for a day still to come.
 * Beside This week, when anything happened, one line counts it by kind; an empty week has no line. Then
 * her next move.
 *
 * Nothing is a score, rank or streak, nothing is compared with anyone, and declined or deferred steps
 * are never in it.
 */
export function MomentumLabeled({ events, today, history, nextMove, headingId = "momentum", className }: MomentumLabeledProps) {
  const thisWeek = inCalendarWeek(events, today);
  const counts = FIGURES.map((f) => ({ f, n: thisWeek.filter((e) => e.figure === f).length }))
    .filter(({ n }) => n > 0)
    .map(({ f, n }) => C.figures[f](n));

  return (
    <section className={["momentum", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {/* The week is its own card, a moment of joy (designer, 2026-10-15): the heading, what it counts,
          the week and its count together, with her next move after it. */}
      <div className="momentum__card">
        <div className="momentum__head">
          <h2 className="momentum__heading" id={headingId}>
            {C.heading}
          </h2>
          <p className="momentum__intro">{C.intro}</p>
        </div>
        <section className="momentum__stage" aria-labelledby={`${headingId}-week`}>
          {/* What she did sits beside This week, so nothing comes under the circles (designer, 2026-10-18). */}
          <div className="momentum__week-head">
            <h3 className="momentum__stage-title" id={`${headingId}-week`}>
              {C.week.heading}
            </h3>
            {counts.length ? (
              <p className="momentum__basis">
                {counts.map((line, i) => {
                  // Each count's number stands out in color; the words stay as written.
                  const [, n, rest] = /^(\d+)(.*)$/.exec(line) ?? [line, "", line];
                  return (
                    <span key={line}>
                      {i ? " · " : null}
                      {n ? <b className="momentum__count">{n}</b> : null}
                      {rest}
                    </span>
                  );
                })}
              </p>
            ) : null}
          </div>
          <DayCircles events={thisWeek} today={today} history={history} />
        </section>
      </div>
      {nextMove ? (
        <section className="presence-clean__try momentum__next" aria-label={C.nextMove}>
          <span className="presence-clean__try-label">{C.nextMove}</span>
          <b>{nextMove.title}</b>
          {nextMove.why ? <p>{nextMove.why}</p> : null}
          <Link href={nextMove.href} className="btn btn--primary btn--md">
            {C.nextMoveAction}
            <Icon name="chevron" size={16} />
          </Link>
        </section>
      ) : null}
    </section>
  );
}

export default MomentumLabeled;
