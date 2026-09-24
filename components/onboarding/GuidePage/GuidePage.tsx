import type { ReactNode } from "react";
import { StepActions } from "@/components/onboarding/StepActions";

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
  /** A peer to the primary action, e.g. "Skip for now". */
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** The opening page: no progress, the title set large. */
  cover?: boolean;
  /** An AnswerDrawer, pinned under the page. The page scrolls above it. */
  drawer?: ReactNode;
  /** Whether that drawer is open. While it is, the question lives in the
   *  drawer, so the heading's id (where focus lands) is the drawer's. */
  drawerOpen?: boolean;
  /** The title is the question itself: hidden while the drawer holds it,
   *  rather than said twice. Otherwise it steps back as context. */
  questionInDrawer?: boolean;
  className?: string;
}

/**
 * One page of Concept 3, the guided onboarding. It reads like an advisor's
 * briefing rather than a form, by decision on 2026-09-24: progress is said in
 * words, what ExecHQ has learned travels with the user, and every page says
 * why it is there in a margin note, in the same place each time.
 */
export function GuidePage({
  part,
  position,
  partIndex,
  partCount,
  file,
  kicker,
  title,
  lede,
  headingId,
  children,
  why,
  whyLabel = "Why this matters",
  primaryLabel,
  onPrimary,
  primaryDisabled,
  secondaryLabel,
  onSecondary,
  cover = false,
  drawer,
  drawerOpen = false,
  questionInDrawer = false,
  className,
}: GuidePageProps) {
  const drawn = Boolean(drawer) && drawerOpen;
  const titleClass = [
    "guide__title",
    drawn && questionInDrawer ? "u-visually-hidden" : null,
    drawn && !questionInDrawer ? "guide__title--context" : null,
  ]
    .filter(Boolean)
    .join(" ");
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

      <header className="guide__head">
        {kicker ? <p className="guide__kicker">{kicker}</p> : null}
        <h1 className={titleClass} id={drawn ? undefined : headingId} tabIndex={-1}>
          {title}
        </h1>
        {lede && !(drawn && questionInDrawer) ? <p className="guide__lede">{lede}</p> : null}
      </header>

      {children ? <div className="guide__body">{children}</div> : null}

      {why ? (
        <aside className="guide__why" aria-label={whyLabel}>
          <p className="guide__why-label">{whyLabel}</p>
          <p className="guide__why-text">{why}</p>
        </aside>
      ) : null}

      {primaryLabel ? (
        <StepActions
          className="guide__actions"
          primaryLabel={primaryLabel}
          onPrimary={onPrimary}
          primaryDisabled={primaryDisabled}
          skipLabel={secondaryLabel}
          onSkip={onSecondary}
        />
      ) : null}
    </>
  );

  const classes = ["guide", cover ? "guide--cover" : null, drawer ? "guide--drawer" : null, drawn ? "is-drawn" : null, className]
    .filter(Boolean)
    .join(" ");
  if (!drawer) return <div className={classes}>{page}</div>;
  return (
    <div className={classes}>
      <div className="guide__page">{page}</div>
      {drawer}
    </div>
  );
}

export default GuidePage;
