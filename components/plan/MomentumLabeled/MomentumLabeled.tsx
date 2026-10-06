"use client";

import Link from "next/link";
import { Behind, Figures } from "@/components/plan/momentum-parts";
import { Icon } from "@/components/primitives/Icon";
import { inMomentumWindow, momentumLabel, weeklyConsistency, type MomentumEvent } from "@/lib/momentum";
import { shortDate, type LoopDate } from "@/lib/loop";
import { MOMENTUM_COPY as C, type LabelWording } from "@/mock/plan";

export interface MomentumLabeledProps {
  events: MomentumEvent[];
  today: LoopDate;
  /** Days of record she has. It decides what she sees: the last 7 days from
   *  the start, the last 30 days added at 30, the 90-day label at 90. */
  history: number;
  /** Her follow-through against the plan, for the 30-day view. */
  follow: { done: number; taken: number; items: MomentumEvent[] };
  /** The label is always paired with the next move, so she sees what to do. */
  nextMove?: { title: string; href: string };
  /** "Needs attention" is the riskiest phrase in the sprint, tested against a
   *  softer one. */
  wording?: LabelWording;
  /** Catalogue only: opens the first figure to show what is behind it. */
  demoOpen?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * Momentum: a transparent trend of her execution, built up as her history
 * grows. She never picks a window. In her first week there are no counts, so
 * no zeros: it lists what she has done so far, says her first 7-day view comes
 * once she has been here a week, and gives her next move. From 7 days she sees
 * the last 7 days: actions completed, artifacts created or used, outcomes
 * updated. At 30 days
 * the last 30 days leads, with how steadily she completed actions week by
 * week and how far she got on the steps she took on, and the 7 days stay
 * beneath it. At 90 days a label leads, building, steady or needs attention,
 * with its basis stated and the next move beside it, and the earlier views
 * stay beneath. Every section has the activity behind it one tap away.
 *
 * Nothing is a score, rank or grade, nothing is compared with anyone, and the
 * label never says her activity caused a result. Its thresholds are a
 * placeholder until D&T define them. Declined and deferred steps are never in
 * any of it.
 */
export function MomentumLabeled({
  events,
  today,
  history,
  follow,
  nextMove,
  wording = "candid",
  demoOpen,
  headingId = "momentum-a",
  className,
}: MomentumLabeledProps) {
  const has30 = history >= 30;
  const has90 = history >= 90;
  const label = has90 ? C.labels[wording][momentumLabel(events, today)] : null;
  const week = weeklyConsistency(events, today);
  const sinceStart = inMomentumWindow(events, today, Math.max(history, 1));
  const weeks = week.weeks.map((w) => ({
    id: `week-${w.to}`,
    on: w.from,
    text: C.weekTo(shortDate(w.to), w.done),
  }));

  const next = nextMove ? (
    <p className="momentum__next">
      <span>{C.nextMove}</span>{" "}
      <Link href={nextMove.href} className="link">
        {nextMove.title}
        <Icon name="chevron" size={14} />
      </Link>
    </p>
  ) : null;

  return (
    <section className={["momentum", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="momentum__head">
        <h2 className="momentum__heading" id={headingId}>
          {C.headingA}
        </h2>
        <p className="momentum__intro">{C.intro}</p>
      </div>

      {label ? (
        <section className="momentum__stage" aria-labelledby={`${headingId}-90`}>
          <h3 className="momentum__stage-title" id={`${headingId}-90`}>
            {C.sectionHeading[90]}
          </h3>
          <p className="momentum__label">
            <span className="u-visually-hidden">90-day label: </span>
            {label}
          </p>
          <p className="momentum__basis">{C.labelBasis}</p>
          {next}
          <Behind events={inMomentumWindow(events, today, 90)} />
          <p className="momentum__rule">{C.placeholderRule}</p>
        </section>
      ) : null}

      {has30 ? (
        <section className="momentum__stage" aria-labelledby={`${headingId}-30`}>
          <h3 className="momentum__stage-title" id={`${headingId}-30`}>
            {C.sectionHeading[30]}
          </h3>
          <p className="momentum__sentence">
            {week.active ? C.consistency(week.active, week.weeks.length) : C.consistencyNone(week.weeks.length)}
          </p>
          <Behind events={weeks} />
          <p className="momentum__sentence">{follow.taken ? C.followThrough(follow.done, follow.taken) : C.followThroughNone}</p>
          <Behind events={follow.items} />
        </section>
      ) : null}

      {history < 7 ? (
        <section className="momentum__stage" aria-labelledby={`${headingId}-so-far`}>
          <h3 className="momentum__stage-title" id={`${headingId}-so-far`}>
            {C.soFarHeading}
          </h3>
          {sinceStart.length ? (
            <ul className="momentum__events momentum__events--shown">
              {[...sinceStart].reverse().map((e) => (
                <li key={e.id}>
                  <span className="momentum__event-date">{shortDate(e.on)}</span> {e.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="momentum__thin">{C.soFarNone}</p>
          )}
          <p className="momentum__basis">{C.firstWeek}</p>
          {next}
        </section>
      ) : (
        <section className="momentum__stage" aria-labelledby={`${headingId}-7`}>
          <h3 className="momentum__stage-title" id={`${headingId}-7`}>
            {C.sectionHeading[7]}
          </h3>
          <Figures events={inMomentumWindow(events, today, 7)} openFirst={demoOpen} />
          {has30 ? null : next}
        </section>
      )}
    </section>
  );
}

export default MomentumLabeled;
