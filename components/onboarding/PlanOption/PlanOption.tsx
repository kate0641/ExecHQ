"use client";

import { useId } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import type { PlanTemplate } from "@/mock/onboarding";

export interface PlanOptionProps {
  plan: PlanTemplate;
  /** Open: why it's hers, and the button to use it. One is open at a time. */
  open: boolean;
  /** Pressing the card opens it, or closes it when it's open. */
  onToggle: () => void;
  /** Use this plan: chooses it and moves on. */
  onUse: () => void;
  /** "Pick this if", over the plan's signs. */
  signsLabel: string;
  useLabel: string;
  /** ExecEngine's pick, after I can't decide: marked, with its reason. */
  recommended?: boolean;
  recommendedLabel?: string;
  /** Why ExecEngine picked it, from what she said. */
  reason?: string;
  className?: string;
}

/**
 * One plan on the plans page (Kate, 2026-11-13): its name and when it's for,
 * and pressed, it opens in place to say why it's hers (signs she can see
 * herself in, then what she comes away with) with Use this plan, which
 * chooses it and moves on. Pressing it again closes it. The card is a
 * disclosure button, so it says whether it's open.
 */
export function PlanOption({
  plan,
  open,
  onToggle,
  onUse,
  signsLabel,
  useLabel,
  recommended = false,
  recommendedLabel = "Recommended",
  reason,
  className,
}: PlanOptionProps) {
  const bodyId = useId();
  return (
    <div className={["plan-option", open ? "is-open" : null, recommended ? "plan-option--recommended" : null, className].filter(Boolean).join(" ")}>
      <button type="button" className="plan-option__head" aria-expanded={open} aria-controls={bodyId} onClick={onToggle}>
        {recommended ? (
          <span className="plan-option__flag">
            <Badge tone="sprint">{recommendedLabel}</Badge>
          </span>
        ) : null}
        <span className="plan-option__name">{plan.name}</span>
        <span className="plan-option__best-for">{plan.bestFor}</span>
      </button>
      {/* Drawn only when open: the body is the card's, so a closed one carries nothing extra. */}
      {open ? (
        <div className="plan-option__body" id={bodyId}>
          {reason ? <p className="plan-option__reason">{reason}</p> : null}
          {plan.pickIf?.length ? (
            <>
              <p className="plan-option__label">{signsLabel}</p>
              <ul className="plan-option__signs">
                {plan.pickIf.map((sign) => (
                  <li key={sign}>{sign}</li>
                ))}
              </ul>
            </>
          ) : null}
          {plan.comeAway ? <p className="plan-option__outcome">{plan.comeAway}</p> : null}
          <Button fullWidth onClick={onUse}>
            {useLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default PlanOption;
