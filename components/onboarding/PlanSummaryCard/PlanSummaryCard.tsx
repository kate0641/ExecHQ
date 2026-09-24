import type { ReactNode } from "react";

export interface PlanSummaryStage {
  window: string;
  title: string;
}

export interface PlanSummaryCardProps {
  /** Small label above the name, e.g. "Your starting point". */
  eyebrow: string;
  name: string;
  /** The plan's formal name, under the plain one. */
  formalName?: string;
  thisWeekLabel: string;
  thisWeek?: string;
  /** The line over the stages, e.g. "The next 12 weeks, toward …". */
  toward?: ReactNode;
  stages: readonly PlanSummaryStage[];
  /** Marks the first stage as the current one. */
  nowLabel: string;
  /** Opens the full plan. Omitted: no link. */
  detailsLabel?: string;
  onDetails?: () => void;
  className?: string;
}

/**
 * A plan, short enough to sit in a conversation: its name, this week's one
 * thing, and the stages as a line each. Everything else — what it was built
 * from, the outcomes and finish lines — is one tap away, by decision on
 * 2026-09-24 (option A), so the card fits on screen with the replies below it
 * and looking at other plans never piles up full pages in the thread.
 */
export function PlanSummaryCard({
  eyebrow,
  name,
  formalName,
  thisWeekLabel,
  thisWeek,
  toward,
  stages,
  nowLabel,
  detailsLabel,
  onDetails,
  className,
}: PlanSummaryCardProps) {
  return (
    <div className={["plan-summary", className].filter(Boolean).join(" ")}>
      <div className="plan-summary__head">
        <p className="plan-summary__eyebrow">{eyebrow}</p>
        <p className="plan-summary__name">{name}</p>
        {formalName ? <p className="plan-summary__formal">{formalName}</p> : null}
      </div>

      {thisWeek ? (
        <div className="plan-summary__week">
          <p className="plan-summary__week-label">{thisWeekLabel}</p>
          <p className="plan-summary__week-title">{thisWeek}</p>
        </div>
      ) : null}

      {stages.length ? (
        <div className="plan-summary__ahead">
          {toward ? <p className="plan-summary__toward">{toward}</p> : null}
          <ol className="plan-summary__stages">
            {stages.map((stage, index) => (
              <li key={stage.title} className={index === 0 ? "is-now" : undefined}>
                <span className="plan-summary__dot" aria-hidden="true" />
                <span>
                  <span className="plan-summary__window">
                    {stage.window}
                    {index === 0 ? ` · ${nowLabel}` : null}
                  </span>
                  <span className="plan-summary__title">{stage.title}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {detailsLabel && onDetails ? (
        <button type="button" className="plan-summary__details" onClick={onDetails}>
          {detailsLabel}
        </button>
      ) : null}
    </div>
  );
}

export default PlanSummaryCard;
