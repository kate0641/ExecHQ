import type { ReactNode } from "react";

/**
 * The frame the three Plan concepts share: a heading, and up to three groups
 * of sections. On a phone and a tablet the groups run in the order written, one
 * column. On web, `lead` runs across the top and `main` and `side` sit beside
 * each other, so a concept chooses what gets the wide column.
 */
export function PlanPage({
  concept,
  lead,
  main,
  wide,
  side,
  children,
}: {
  concept: "c1" | "c2" | "c3";
  lead?: ReactNode;
  main?: ReactNode;
  /** Runs the full width on web, after `main`: where a concept needs room, such as a calendar beside an agenda. */
  wide?: ReactNode;
  side?: ReactNode;
  /** Outside the groups: sheets and the like. */
  children?: ReactNode;
}) {
  return (
    <div className={`plan-page plan-page--${concept}`}>
      <h1 className="plan-page__title">Your plan</h1>
      {lead ? <div className="plan-page__lead">{lead}</div> : null}
      {main ? <div className="plan-page__main">{main}</div> : null}
      {wide ? <div className="plan-page__wide">{wide}</div> : null}
      {side ? <div className="plan-page__side">{side}</div> : null}
      {children}
    </div>
  );
}
