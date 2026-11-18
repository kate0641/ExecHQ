"use client";

import type { ReactNode } from "react";
import { Button, type ButtonVariant } from "@/components/primitives/Button";

export interface StepActionsProps {
  primaryLabel: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  /** `primary` by default. `secondary` where the only action is a way past the
   *  question — the answer itself is what moves the screen on. */
  primaryVariant?: ButtonVariant;
  /** The skip path. Rendered at the same size and weight as the primary action,
   *  never as a link or a quiet ghost. Omit it where a step has no skip. */
  skipLabel?: string;
  onSkip?: () => void;
  /** A quiet tertiary action, e.g. "Back". Never the skip path. */
  backLabel?: string;
  onBack?: () => void;
  /** Pinned with the actions, above them: things that must stay reachable
   *  without scrolling, like export links. */
  lead?: ReactNode;
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
  primaryVariant = "primary",
  skipLabel,
  onSkip,
  backLabel,
  onBack,
  lead,
  className,
}: StepActionsProps) {
  return (
    <div className={["step-actions", className].filter(Boolean).join(" ")}>
      {lead ? <div className="step-actions__lead">{lead}</div> : null}
      <div className="step-actions__row">
        <Button variant={primaryVariant} onClick={onPrimary} disabled={primaryDisabled}>
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
