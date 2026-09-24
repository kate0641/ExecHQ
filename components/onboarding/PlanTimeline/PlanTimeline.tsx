import type { PlanStage } from "@/mock/onboarding";

export interface PlanTimelineProps {
  stages: readonly PlanStage[];
  /** Which stage the user is in. The current one is open with its steps and
   *  finish line; the rest are one line each. */
  currentIndex?: number;
  /** Appended to the current stage's window, e.g. "Now". */
  nowLabel?: string;
  /** Lead-in for each finish line, e.g. "Done when:". */
  doneLabel?: string;
  /** The open end after the last stage. Drawn with a dashed mark. */
  after?: string;
  className?: string;
}

/**
 * The plan's stages as a vertical timeline.
 *
 * Only the current stage is shown in full, because it is the only one worth
 * acting on today, and the later ones will change as the plan learns. They
 * are one line each, and the line ends in a dashed mark saying the plan keeps
 * going, so it never reads as a programme with an end date.
 *
 * Stage titles are h2s: the plan's name is the page's h1.
 */
export function PlanTimeline({
  stages,
  currentIndex = 0,
  nowLabel = "Now",
  doneLabel = "Done when:",
  after,
  className,
}: PlanTimelineProps) {
  return (
    <ol className={["plan-timeline", className].filter(Boolean).join(" ")}>
      {stages.map((stage, index) => {
        const isNow = index === currentIndex;
        return (
          <li
            key={stage.title}
            className={["plan-timeline__stage", isNow ? "is-now" : null]
              .filter(Boolean)
              .join(" ")}
            aria-current={isNow ? "step" : undefined}
          >
            <p className="plan-timeline__window">
              {stage.window}
              {isNow ? ` · ${nowLabel}` : null}
            </p>
            <h2 className="plan-timeline__title">{stage.title}</h2>
            {isNow ? (
              <>
                <ul className="plan-timeline__steps">
                  {stage.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
                {stage.done ? (
                  <p className="plan-timeline__done">
                    <b>{doneLabel}</b> {stage.done}
                  </p>
                ) : null}
              </>
            ) : null}
          </li>
        );
      })}
      {after ? (
        <li className="plan-timeline__stage plan-timeline__stage--open">
          <p className="plan-timeline__after">{after}</p>
        </li>
      ) : null}
    </ol>
  );
}

export default PlanTimeline;
