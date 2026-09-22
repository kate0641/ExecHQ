"use client";

import { Button } from "@/components/primitives/Button";

export interface StepActionsProps {
  primaryLabel: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  /** The skip path. Rendered at the same size and weight as the primary action,
   *  never as a link or a quiet ghost. Omit it where a step has no skip. */
  skipLabel?: string;
  onSkip?: () => void;
  /** A quiet tertiary action, e.g. "Back". Never the skip path. */
  backLabel?: string;
  onBack?: () => void;
  className?: string;
}

/**
 * The actions at the foot of an onboarding step.
 *
 * The skip path is the whole reason this component exists. The brief is explicit
 * that skipping must read as a legitimate choice rather than an escape hatch for
 * people who did not finish, so the two actions are rendered as peers: same
 * size, same row, equal width. Skip is `secondary`, not `ghost` — a ghost button
 * would demote it visually, which is the exact failure to avoid.
 *
 * Skip comes second in the DOM so the primary action is reached first by
 * keyboard, but it is never smaller, quieter or further down the page.
 */
export function StepActions({
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  skipLabel,
  onSkip,
  backLabel,
  onBack,
  className,
}: StepActionsProps) {
  return (
    <div className={["step-actions", className].filter(Boolean).join(" ")}>
      <div className="step-actions__row">
        <Button variant="primary" onClick={onPrimary} disabled={primaryDisabled}>
          {primaryLabel}
        </Button>
        {skipLabel ? (
          <Button variant="secondary" onClick={onSkip}>
            {skipLabel}
          </Button>
        ) : null}
      </div>
      {backLabel ? (
        <div className="step-actions__back">
          <Button variant="ghost" size="sm" onClick={onBack}>
            {backLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default StepActions;
