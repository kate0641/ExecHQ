"use client";

import Link from "next/link";
import { useState } from "react";
import { Behind, Figures, MomentumWindows } from "@/components/plan/momentum-parts";
import { Icon } from "@/components/primitives/Icon";
import { inMomentumWindow, momentumLabel, type MomentumEvent } from "@/lib/momentum";
import type { LoopDate } from "@/lib/loop";
import { MOMENTUM_COPY as C, type LabelWording, type WindowDays } from "@/mock/plan";

export interface MomentumLabeledProps {
  events: MomentumEvent[];
  today: LoopDate;
  /** Days of record she has. The 90-day label needs all ninety. */
  history: number;
  /** Her follow-through against the plan, for the 30-day view. */
  follow: { done: number; taken: number; items: MomentumEvent[] };
  /** The label is always paired with the next move, so she sees what to do. */
  nextMove?: { title: string; href: string };
  /** "Needs attention" is the riskiest phrase in the sprint, tested against a
   *  softer one. */
  wording?: LabelWording;
  initialWindow?: WindowDays;
  /** Catalogue only: opens the first figure to show what is behind it. */
  demoOpen?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * Momentum, Concept A: a labeled trend. Seven days is counts; thirty is how
 * far she followed through on the steps she took on; ninety is a label,
 * building, steady or needs attention, with the activity behind it one tap
 * away and the next move beside it.
 *
 * The label is a word with its basis stated, never a grade. It needs the whole
 * ninety days; with less, it says so and gives none. Its thresholds are a
 * placeholder until D&T define them, and the card says so. Declined and
 * deferred steps are never in it, and it never says her activity caused a
 * result.
 */
export function MomentumLabeled({
  events,
  today,
  history,
  follow,
  nextMove,
  wording = "candid",
  initialWindow = 7,
  demoOpen,
  headingId = "momentum-a",
  className,
}: MomentumLabeledProps) {
  const [days, setDays] = useState<WindowDays>(initialWindow);
  const range = inMomentumWindow(events, today, days);
  const label = days === 90 && history >= 90 ? C.labels[wording][momentumLabel(events, today)] : null;

  return (
    <section className={["momentum", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="momentum__head">
        <h2 className="momentum__heading" id={headingId}>
          {C.headingA}
        </h2>
        <p className="momentum__intro">{C.intro}</p>
      </div>
      <MomentumWindows value={days} onChange={setDays} />

      {days === 7 ? (
        <Figures events={range} openFirst={demoOpen} />
      ) : days === 30 ? (
        <>
          {history < 30 ? <p className="momentum__thin">{C.thin(history, 30)}</p> : null}
          <p className="momentum__sentence">
            {follow.taken ? C.followThrough(follow.done, follow.taken) : C.followThroughNone}
          </p>
          <Behind events={follow.items} />
        </>
      ) : label ? (
        <>
          <p className="momentum__label">
            <span className="u-visually-hidden">90-day label: </span>
            {label}
          </p>
          <p className="momentum__basis">{C.labelBasis(label)}</p>
          {nextMove ? (
            <p className="momentum__next">
              <span>{C.nextMove}</span>{" "}
              <Link href={nextMove.href} className="link">
                {nextMove.title}
                <Icon name="chevron" size={14} />
              </Link>
            </p>
          ) : null}
          <Behind events={range} />
          <p className="momentum__rule">{C.placeholderRule}</p>
        </>
      ) : (
        <>
          <p className="momentum__thin">{C.thinLabel(history)}</p>
          {nextMove ? (
            <p className="momentum__next">
              <span>{C.nextMove}</span>{" "}
              <Link href={nextMove.href} className="link">
                {nextMove.title}
                <Icon name="chevron" size={14} />
              </Link>
            </p>
          ) : null}
        </>
      )}
    </section>
  );
}

export default MomentumLabeled;
