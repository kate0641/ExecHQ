"use client";

import type { ReactNode } from "react";
import { useStatusBarTone } from "@/lib/device-tone";

/**
 * The Signal Picture's frame: a heading, then up to three groups of sections. On a phone and a tablet the groups run in the
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
  concept: "c2";
  lead?: ReactNode;
  main?: ReactNode;
  side?: ReactNode;
  /** Outside the groups: sheets and the like. */
  children?: ReactNode;
}) {
  // A navy page (designer, 2026-10-15): the status bar runs the navy to the top.
  useStatusBarTone("inverse");
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
