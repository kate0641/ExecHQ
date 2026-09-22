"use client";

import type { ReactNode } from "react";
import { NavPlaceholder } from "@/components/layout/NavPlaceholder";
import { StepActions } from "@/components/onboarding/StepActions";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { StepProgress } from "@/components/onboarding/StepProgress";

export interface WizardStepProps {
  /** 1-based position, for the progress marks. */
  step: number;
  total: number;
  /** Counts the questions inside a step that holds several. */
  progressLabel?: string;
  optionalFrom?: number;
  eyebrow?: string;
  title: string;
  description?: string;
  /** Id given to the heading so the shell can move focus to it on a step
   *  change. */
  headingId?: string;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
  backLabel?: string;
  onBack?: () => void;
  /** Shows the Sprint 2 navigation placeholder above the step. Used from the
   *  point the user is effectively inside the app. */
  showNav?: boolean;
  className?: string;
}

/**
 * One page of the paged wizard: progress, one question, and the actions.
 *
 * This is the frame Concept 1 is: a single decision per screen with nothing
 * hidden below the fold. It exists as a component rather than as markup inside
 * the concept so that every step is laid out by the same rules — if one screen
 * wanted to be different, that difference would have to be argued for here
 * rather than quietly introduced in one place.
 *
 * Progress sits above the heading and the actions sit below the content, so the
 * reading order is: where am I, what is being asked, what can I do about it.
 */
export function WizardStep({
  step,
  total,
  progressLabel,
  optionalFrom,
  eyebrow,
  title,
  description,
  headingId,
  children,
  primaryLabel,
  onPrimary,
  primaryDisabled,
  skipLabel,
  onSkip,
  backLabel,
  onBack,
  showNav = false,
  className,
}: WizardStepProps) {
  return (
    <div className={["wizard", className].filter(Boolean).join(" ")}>
      {showNav ? <NavPlaceholder /> : null}

      <StepProgress
        current={step}
        total={total}
        optionalFrom={optionalFrom}
        label={progressLabel}
      />

      <StepHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        id={headingId}
      />

      {children ? <div className="wizard__body">{children}</div> : null}

      {primaryLabel ? (
        <StepActions
          primaryLabel={primaryLabel}
          onPrimary={onPrimary}
          primaryDisabled={primaryDisabled}
          skipLabel={skipLabel}
          onSkip={onSkip}
          backLabel={backLabel}
          onBack={onBack}
        />
      ) : null}
    </div>
  );
}

export default WizardStep;
