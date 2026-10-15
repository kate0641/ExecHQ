"use client";

import type { ReactNode } from "react";
import { useSky } from "@/components/hub/SnapshotPicker/use-sky";
import { StepActions } from "@/components/onboarding/StepActions";
import type { ButtonVariant } from "@/components/primitives/Button";
import { Wordmark } from "@/components/primitives/Wordmark";
import { keepAfterComma } from "@/components/primitives/keep-after-comma";

export type SkyGlow = "bottom-right" | "top-right" | "bottom-left" | "top-left";

export interface GuidePageProps {
  /** Where the user is, in words: the part of onboarding, e.g. "About you". */
  part?: string;
  /** Their place within it, e.g. "2 of 4". */
  position?: string;
  /** Which part is current, 0-based, and how many there are: the segments. */
  partIndex?: number;
  partCount?: number;
  /** What ExecHQ knows so far, carried on every page. */
  file?: ReactNode;
  kicker?: string;
  /** The ExecHQ logo above the title, in place of a kicker: the cover, where
   *  the brand is the first thing on the screen. */
  wordmark?: boolean;
  title: string;
  lede?: string;
  headingId?: string;
  children?: ReactNode;
  /** Why this page exists, said plainly. */
  why?: string;
  whyLabel?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  /** `secondary` where the page's real action is in its body and the foot only
   *  offers a way past it. */
  primaryVariant?: ButtonVariant;
  /** Something else at the foot, in place of the primary and secondary
   *  actions: a set of equal choices, say. */
  foot?: ReactNode;
  /** A peer to the primary action, e.g. "Skip for now". */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** The opening page: no progress, the title set large. */
  cover?: boolean;
  /** An AnswerDrawer, pinned under the page. The page scrolls above it. The
   *  heading, the lede and why the page is asking stay on the page, so the
   *  question and its reason are read together; the drawer holds only the
   *  answer. */
  drawer?: ReactNode;
  /** Something read after the page's own work is done, under its actions: the
   *  Plan's roadmap under the move, say. It scrolls with the page. */
  after?: ReactNode;
  /** Drawn over the top of the page: an email's notification arriving. */
  overlay?: ReactNode;
  /** With a drawer: the question sits in its own panel of the sky Home shows at this hour (dawn, day, dusk,
   *  night), its glow in the panel's bottom-right corner (designer, 2026-10-14). Onboarding and the Plan. */
  sky?: boolean;
  /** Which corner of the sky panel holds the glow; bottom right unless said. Onboarding moves it from question
   *  to question so the yellow heart isn't in the same place every time (designer, 2026-10-15). */
  glow?: SkyGlow;
  /** A step with no drawer, flooded navy, so the flow alternates quiet screens with ExecHQ moments: headlines
   *  and section labels yellow, white cards on it (designer, 2026-10-15). */
  navy?: boolean;
  className?: string;
}

/**
 * One page of Concept 3, the guided onboarding. It reads like an advisor's
 * briefing rather than a form, by decision on 2026-09-24: progress is said in
 * words, what ExecHQ has learned travels with the user, and every page says
 * why it is there in a margin note, in the same place each time.
 *
 * With a drawer, the question and its reason stay on the page together and
 * the drawer holds only the answer, by decision on 2026-09-30 (option B of
 * three tried: both in the drawer, both on the page, or the reason tucked
 * into the drawer).
 */
export function GuidePage({
  part,
  position,
  partIndex,
  partCount,
  file,
  kicker,
  wordmark = false,
  title,
  lede,
  headingId,
  children,
  why,
  whyLabel = "Why this matters",
  primaryLabel,
  onPrimary,
  primaryDisabled,
  primaryVariant,
  foot,
  secondaryLabel,
  onSecondary,
  cover = false,
  drawer,
  after,
  overlay,
  sky: skyPanel = false,
  glow,
  navy = false,
  className,
}: GuidePageProps) {
  const sky = useSky();
  const inSky = skyPanel && Boolean(drawer) && !cover;
  const page = (
    <>
      {part && !cover ? (
        <div className="guide__top">
          <p className="guide__where">
            <span className="guide__part">{part}</span>
            {position ? <span className="guide__position"> · {position}</span> : null}
          </p>
          {partCount ? (
            <ol className="guide__parts" aria-hidden="true">
              {Array.from({ length: partCount }, (_, index) => (
                <li
                  key={index}
                  className={
                    index < (partIndex ?? 0) ? "is-done" : index === partIndex ? "is-now" : undefined
                  }
                />
              ))}
            </ol>
          ) : null}
          {file}
        </div>
      ) : null}

      <header className={inSky ? "guide__head guide__head--sky" : "guide__head"} data-sky={inSky ? sky : undefined} data-glow={inSky ? glow : undefined}>
        {wordmark ? <Wordmark size="xl" tone={cover ? "light" : "dark"} className="guide__wordmark" /> : null}
        {kicker ? <p className="guide__kicker">{kicker}</p> : null}
        <h1 className="guide__title" id={headingId} tabIndex={-1}>
          {title}
        </h1>
        {lede ? <p className="guide__lede">{keepAfterComma(lede)}</p> : null}
      </header>

      {children ? <div className="guide__body">{children}</div> : null}

      {why ? (
        <aside className="guide__why" aria-label={whyLabel}>
          <p className="guide__why-label">{whyLabel}</p>
          <p className="guide__why-text">{keepAfterComma(why)}</p>
        </aside>
      ) : null}

      {foot ? (
        <div className="guide__actions">{foot}</div>
      ) : primaryLabel ? (
        <StepActions
          className="guide__actions"
          primaryLabel={primaryLabel}
          onPrimary={onPrimary}
          primaryDisabled={primaryDisabled}
          primaryVariant={primaryVariant}
          skipLabel={secondaryLabel}
          onSkip={onSecondary}
        />
      ) : null}

      {after ? <div className="guide__after">{after}</div> : null}
    </>
  );

  const classes = ["guide", cover ? "guide--cover" : null, drawer ? "guide--drawer" : null, inSky ? "guide--sky" : null, navy ? "guide--navy" : null, className]
    .filter(Boolean)
    .join(" ");
  const over = overlay ? <div className="guide__overlay">{overlay}</div> : null;
  if (!drawer)
    return (
      <div className={classes}>
        {over}
        {page}
      </div>
    );
  return (
    <div className={classes}>
      {over}
      <div className="guide__page">{page}</div>
      {drawer}
    </div>
  );
}

export default GuidePage;
