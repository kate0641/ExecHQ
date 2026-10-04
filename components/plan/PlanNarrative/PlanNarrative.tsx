"use client";

import { Behind } from "@/components/plan/momentum-parts";
import { Icon } from "@/components/primitives/Icon";
import type { Narrative } from "@/lib/narrative";
import { NARRATIVE_COPY as C } from "@/mock/plan";

export interface PlanNarrativeProps {
  narrative: Narrative;
  /** Takes her to the step the next move names. */
  onOpenStep?: (stepId: string) => void;
  /** Catalogue only: opens the first sentence's basis. */
  demoOpen?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * "What changed / what next": two to four plain sentences turning the windows
 * into a reading of her situation, then one next best move that opens the
 * matching action step.
 *
 * Every sentence has the recorded items behind it one tap away. It says what
 * happened and what she logged, never that one thing caused another; when
 * history is thin, it says so plainly rather than inflating a few items.
 */
export function PlanNarrative({ narrative, onOpenStep, demoOpen, headingId = "plan-narrative", className }: PlanNarrativeProps) {
  return (
    <section className={["narrative", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="narrative__heading" id={headingId}>
        {C.heading}
      </h2>
      {narrative.lines.length ? (
        <ul className="narrative__lines">
          {narrative.lines.map((line, i) => (
            <li className="narrative__line" key={line.text}>
              <p className="narrative__text">{line.text}</p>
              <Behind events={line.behind} open={demoOpen && i === 0} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="narrative__text">{C.nothing}</p>
      )}
      <div className="narrative__next">
        <p className="narrative__next-label">{C.next}</p>
        {narrative.next ? (
          <>
            <p className="narrative__next-title">{narrative.next.title}</p>
            <button
              type="button"
              className="btn btn--primary btn--md"
              onClick={() => narrative.next && onOpenStep?.(narrative.next.stepId)}
            >
              {C.openStep}
              <Icon name="chevron" size={16} />
            </button>
          </>
        ) : (
          <p className="narrative__text">{C.none}</p>
        )}
      </div>
    </section>
  );
}

export default PlanNarrative;
