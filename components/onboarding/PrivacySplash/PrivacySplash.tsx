"use client";

import { Button } from "@/components/primitives/Button";
import { Icon, type IconName } from "@/components/primitives/Icon";

export interface PrivacySplashProps {
  /** The heading in two tones: the lead at full strength, the rest muted. It
   *  reads as one sentence to assistive technology. */
  titleLead: string;
  titleRest: string;
  /** Short lines, one idea each. Stacked, not a paragraph. */
  lines: readonly string[];
  /** Sets the lines apart. For lines that are whole sentences, which run
   *  together at the couplet spacing the privacy promise uses. */
  spaced?: boolean;
  /** The large glyph under the lines. Defaults to the lock; the Direction
   *  bridge, which borrows this layout, uses the flag. */
  icon?: IconName;
  /** A quieter closing statement under the illustration. */
  footnote?: string;
  /** Focus target for a step change, passed to the heading. */
  headingId?: string;
  primaryLabel: string;
  onPrimary?: () => void;
}

/**
 * The privacy promise as a moment of its own: a two-tone heading, a couple of
 * short lines, and a lock, centred on a plain screen.
 *
 * Part of the opening rather than the work, so it carries no progress marks.
 * Nothing to fill in and nothing to agree to — there is no consent to
 * withhold, only a statement of fact — so the one control acknowledges it and
 * moves on.
 *
 * The same layout carries the bridge into Direction in Concept 1, so the
 * opening reads as a run of short moments before the questions begin.
 *
 * The icon is where the gold accent will sit when the palette lands.
 */
export function PrivacySplash({
  titleLead,
  titleRest,
  lines,
  spaced = false,
  icon = "lock",
  footnote,
  headingId,
  primaryLabel,
  onPrimary,
}: PrivacySplashProps) {
  return (
    <div className="privacy-splash">
      <div className="privacy-splash__body">
        <h1 className="privacy-splash__title" id={headingId} tabIndex={-1}>
          <span className="privacy-splash__title-lead">{titleLead}</span>{" "}
          <span className="privacy-splash__title-rest">{titleRest}</span>
        </h1>

        <ul
          className={
            spaced
              ? "privacy-splash__lines privacy-splash__lines--spaced"
              : "privacy-splash__lines"
          }
        >
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>

        <div className="privacy-splash__art" aria-hidden="true">
          <Icon name={icon} size={72} className="privacy-splash__icon" />
        </div>

        {footnote ? <p className="privacy-splash__footnote">{footnote}</p> : null}
      </div>

      <div className="privacy-splash__actions">
        <Button variant="primary" onClick={onPrimary}>
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
}

export default PrivacySplash;
