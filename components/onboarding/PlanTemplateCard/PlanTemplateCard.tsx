"use client";

import { Badge } from "@/components/primitives/Badge";
import type { PlanTemplate } from "@/mock/onboarding";

export interface PlanTemplateCardProps {
  plan: PlanTemplate;
  /** Marks the system's recommendation. Only ever one card in a set. */
  recommended?: boolean;
  /** Comparison mode: every card shows its "best for" line, so the set can be
   *  read across rather than one card at a time, and the recommendation adds
   *  its rationale on top rather than in place of it. For a concept that asks
   *  the user to choose between all five rather than accept one. */
  comparison?: boolean;
  selected?: boolean;
  /** Radio group name. Shared by every card in one selection. */
  name: string;
  onSelect?: (planId: string) => void;
  className?: string;
}

/**
 * One plan template, as a choice.
 *
 * Built on a native radio rather than a clickable div, so arrow-key navigation
 * within the set, the group semantics and the announcement of "2 of 5" all come
 * from the platform. The card is the label.
 *
 * The rationale only renders when there is one, and there is only one on the
 * recommendation — it is the "why this" tied to what the user actually said.
 * The other four carry their "best for" line instead, so switching is an
 * informed choice rather than a guess.
 */
export function PlanTemplateCard({
  plan,
  recommended = false,
  comparison = false,
  selected = false,
  name,
  onSelect,
  className,
}: PlanTemplateCardProps) {
  const inputId = `${name}-${plan.id}`;
  const labelId = `${inputId}-label`;

  return (
    <div
      className={[
        "plan-card",
        recommended ? "plan-card--recommended" : null,
        comparison ? "plan-card--comparison" : null,
        selected ? "is-selected" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        className="plan-card__input u-visually-hidden"
        type="radio"
        id={inputId}
        name={name}
        value={plan.id}
        checked={selected}
        // Named by the card it sits behind, the same way ToggleGroup does it:
        // the label is the whole card, so htmlFor alone leaves the control
        // without a name that tooling can see.
        aria-labelledby={labelId}
        onChange={() => onSelect?.(plan.id)}
      />
      <label className="plan-card__label" id={labelId} htmlFor={inputId}>
        {recommended ? (
          <span className="plan-card__flag">
            <Badge tone="sprint">Recommended</Badge>
          </span>
        ) : null}
        <span className="plan-card__name">{plan.name}</span>
        {plan.rationale ? (
          <span className="plan-card__rationale">{plan.rationale}</span>
        ) : null}
        {comparison || !plan.rationale ? (
          <span className="plan-card__best-for">{plan.bestFor}</span>
        ) : null}
        <span className="plan-card__emphasis">{plan.emphasis}</span>
      </label>
    </div>
  );
}

export default PlanTemplateCard;
