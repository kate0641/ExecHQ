"use client";

import { useState } from "react";
import { Behind, Figures, MomentumWindows } from "@/components/plan/momentum-parts";
import { inMomentumWindow, ofFigure, type MomentumEvent } from "@/lib/momentum";
import type { LoopDate } from "@/lib/loop";
import { MOMENTUM_COPY as C, type MomentumFigure, type WindowDays } from "@/mock/plan";

export interface MomentumCountsProps {
  events: MomentumEvent[];
  today: LoopDate;
  /** Days of record she has. */
  history: number;
  initialWindow?: WindowDays;
  /** Catalogue only: opens the first figure to show what is behind it. */
  demoOpen?: boolean;
  headingId?: string;
  className?: string;
}

const FIGURES: MomentumFigure[] = ["completed", "artifact", "outcome"];

/**
 * Momentum, Concept B: counts only, called Plan progress. The same three
 * figures in every window. Thirty days sets this month's counts beside last
 * month's, in plain words. Ninety days is counts and nothing more: no label,
 * ever. It tests whether counts alone give her enough sense of direction.
 *
 * Each figure keeps what is behind it one tap away. A declined or deferred
 * step is in none of them.
 */
export function MomentumCounts({
  events,
  today,
  history,
  initialWindow = 7,
  demoOpen,
  headingId = "momentum-b",
  className,
}: MomentumCountsProps) {
  const [days, setDays] = useState<WindowDays>(initialWindow);
  const range = inMomentumWindow(events, today, days);
  const before = inMomentumWindow(events, today, 30, 30);

  return (
    <section className={["momentum", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="momentum__head">
        <h2 className="momentum__heading" id={headingId}>
          {C.headingB}
        </h2>
        <p className="momentum__intro">{C.intro}</p>
      </div>
      <MomentumWindows value={days} onChange={setDays} />

      {days === 30 ? (
        <>
          {history < 30 ? <p className="momentum__thin">{C.thin(history, 30)}</p> : null}
          {history < 60 && history >= 30 ? <p className="momentum__thin">{C.noEarlier(history)}</p> : null}
          <ul className="momentum__figures">
            {FIGURES.map((figure) => {
              const own = ofFigure(range, figure);
              return (
                <li className="momentum__figure" key={figure}>
                  <p className="momentum__count">
                    {history >= 60
                      ? C.compared(own.length, ofFigure(before, figure).length, C.comparedNouns[figure])
                      : C.figures[figure](own.length)}
                  </p>
                  <Behind events={own} />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          {days === 90 && history < 90 ? (
            <p className="momentum__thin">
              {C.thin(history, 90)} {C.soFar}
            </p>
          ) : null}
          <Figures events={range} openFirst={demoOpen} />
        </>
      )}
    </section>
  );
}

export default MomentumCounts;
