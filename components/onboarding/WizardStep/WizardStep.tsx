"use client";

import type { ReactNode } from "react";
import { NavPlaceholder } from "@/components/layout/NavPlaceholder";
import { Icon } from "@/components/primitives/Icon";
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
  /** The skip path, in the top right. Its accessible name is this label; only a
   *  short word shows. */
  skipLabel?: string;
  onSkip?: () => void;
  /** Back, in the top left, as an icon button carrying this as its name. */
  backLabel?: string;
  onBack?: () => void;
  /** Extra controls under the primary action, e.g. a second route onward. */
  footer?: ReactNode;
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
 * Back and skip sit in a bar at the very top — back left, skip right — with
 * progress under it, then the question, then the one primary action. Reading
 * order is: how do I leave, where am I, what is being asked, what do I do.
 *
 * Worth knowing: putting skip in the corner makes it quieter than the primary
 * action. The Sprint 1 brief asks for a skip path at equal weight, and this is
 * deliberately not that — it is a direction taken on 2026-09-22, not an
 * oversight. The skip still appears on every step that has one, is a real
 * button in the tab order, and is reachable before the primary action.
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
  footer,
  showNav = false,
  className,
}: WizardStepProps) {
  const hasBar = Boolean(onBack || skipLabel);

  return (
    <div className={["wizard", className].filter(Boolean).join(" ")}>
      {showNav ? <NavPlaceholder /> : null}

      {hasBar ? (
        <div className="wizard__bar">
          {onBack ? (
            <button
              type="button"
              className="wizard__back"
              onClick={onBack}
              aria-label={backLabel ?? "Back"}
            >
              <Icon name="chevron" size={18} className="wizard__back-icon" />
            </button>
          ) : (
            <span />
          )}

          {skipLabel ? (
            <button type="button" className="wizard__skip" onClick={onSkip}>
              {skipLabel}
            </button>
          ) : (
            <span />
          )}
        </div>
      ) : null}

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
        />
      ) : null}

      {footer ? <div className="wizard__footer">{footer}</div> : null}
    </div>
  );
}

export default WizardStep;
