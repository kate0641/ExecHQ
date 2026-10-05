import type { ReactNode } from "react";

/**
 * The frame the three Signal Picture concepts share: a heading, then up to
 * three groups of sections. On a phone and a tablet the groups run in the
 * order written, one column. On web, `lead` runs across the top and `main`
 * and `side` sit beside each other, so a concept chooses what gets the wide
 * column.
 */
export function SignalsPage({
  concept,
  lead,
  main,
  side,
  children,
}: {
  concept: "c1" | "c2" | "c3";
  lead?: ReactNode;
  main?: ReactNode;
  side?: ReactNode;
  /** Outside the groups: sheets and the like. */
  children?: ReactNode;
}) {
  return (
    <div className={`signals-page signals-page--${concept}`}>
      <h1 className="signals-page__title">Your Signal Picture</h1>
      {lead ? <div className="signals-page__lead">{lead}</div> : null}
      {main ? <div className="signals-page__main">{main}</div> : null}
      {side ? <div className="signals-page__side">{side}</div> : null}
      {children}
    </div>
  );
}
