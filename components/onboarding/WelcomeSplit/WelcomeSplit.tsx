"use client";

import type { ReactNode } from "react";
import { Wordmark } from "@/components/primitives/Wordmark";
import { StepActions } from "@/components/onboarding/StepActions";
import { StepHeader } from "@/components/onboarding/StepHeader";

export interface WelcomeSplitProps {
  /** The one editorial line under the wordmark. Set in the serif. */
  quote: string;
  /** Small context line above the title, e.g. "Welcome back". */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Focus target for a step change, passed to the heading. */
  headingId?: string;
  /** The form: the email field and anything that goes with it. */
  children?: ReactNode;
  /** The action at the foot of the sheet. Left out where the form carries its
   *  own actions, as the sign-in does. */
  primaryLabel?: string;
  onPrimary?: () => void;
  /** Whatever sits at the very foot of the sheet, below the form. */
  footer?: ReactNode;
  /** On the phone, a short dark band with the wordmark alone, for the steps
   *  after the first, where the form should be in reach. Tablet and web keep
   *  the whole panel. */
  compact?: boolean;
  /** Drawn over the top of the whole welcome: the sign-in email's
   *  notification. */
  overlay?: ReactNode;
  /** Tablet looks like the phone: the dark panel above the sheet, not beside
   *  it. Web still splits. */
  stackOnTablet?: boolean;
  /** The sheet's content sits in the middle of the sheet, across and down, with
   *  the foot at the bottom, instead of at the start of it. */
  centred?: boolean;
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
 * Login uses the same welcome with no single action: its form carries its own,
 * and a privacy line sits at the foot instead.
 */
export function WelcomeSplit({
  quote,
  eyebrow,
  title,
  description,
  headingId,
  children,
  primaryLabel,
  onPrimary,
  footer,
  compact = false,
  overlay,
  stackOnTablet = false,
  centred = false,
}: WelcomeSplitProps) {
  return (
    <div
      className={[
        "welcome",
        compact ? "welcome--compact" : null,
        stackOnTablet ? "welcome--stacked" : null,
        centred ? "welcome--centred" : null,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {overlay}
      <div className="welcome__hero">
        <Wordmark size="xl" tone="light" />
        <p className="welcome__quote">{quote}</p>
      </div>

      <div className="welcome__sheet">
        <div className="welcome__body">
          <StepHeader eyebrow={eyebrow} title={title} description={description} id={headingId} />
          {children ? <div className="welcome__form">{children}</div> : null}
        </div>
        {primaryLabel ? <StepActions primaryLabel={primaryLabel} onPrimary={onPrimary} /> : null}
        {footer ? <div className="welcome__foot">{footer}</div> : null}
      </div>
    </div>
  );
}

export default WelcomeSplit;
