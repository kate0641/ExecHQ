"use client";

import type { ReactNode } from "react";
import { Wordmark } from "@/components/primitives/Wordmark";
import { StepActions } from "@/components/onboarding/StepActions";
import { StepHeader } from "@/components/onboarding/StepHeader";

export interface WelcomeSplitProps {
  /** The one editorial line under the wordmark. Set in the serif. */
  quote: string;
  title: string;
  description?: string;
  /** Focus target for a step change, passed to the heading. */
  headingId?: string;
  /** The form: the email field and anything that goes with it. */
  children?: ReactNode;
  primaryLabel: string;
  onPrimary?: () => void;
}

/**
 * The first screen of onboarding: a dark panel carrying the wordmark and one
 * serif line, and a white sheet carrying the welcome and the ask.
 *
 * The dark panel is the only place the brand gets room before anything is
 * asked, and it is where navy will land when the palette arrives. The serif
 * line is Libre Baskerville's editorial moment — one sentence, never a
 * paragraph.
 *
 * On mobile the panel sits above the sheet, and the sheet's top corners round
 * over it. On tablet and web the two sit side by side, panel on the left.
 * The action stays at the foot of the sheet, in reach, with nothing below it.
 */
export function WelcomeSplit({
  quote,
  title,
  description,
  headingId,
  children,
  primaryLabel,
  onPrimary,
}: WelcomeSplitProps) {
  return (
    <div className="welcome">
      <div className="welcome__hero">
        <Wordmark size="xl" />
        <p className="welcome__quote">{quote}</p>
      </div>

      <div className="welcome__sheet">
        <div className="welcome__body">
          <StepHeader title={title} description={description} id={headingId} />
          {children ? <div className="welcome__form">{children}</div> : null}
        </div>
        <StepActions primaryLabel={primaryLabel} onPrimary={onPrimary} />
      </div>
    </div>
  );
}

export default WelcomeSplit;
