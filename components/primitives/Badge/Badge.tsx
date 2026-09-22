import type { ReactNode } from "react";
import { STATUS_LABELS, type Status } from "@/lib/manifest";

export type BadgeTone = "neutral" | "sprint" | Status;

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  /** Prefix read by screen readers only, e.g. "Status:". */
  srPrefix?: string;
  className?: string;
}

/** Small status or metadata label. Colour is never the only cue — the word is
 *  always present — so status stays legible when the palette changes. */
export function Badge({ tone = "neutral", children, srPrefix, className }: BadgeProps) {
  const classes = ["badge", `badge--${tone}`, className].filter(Boolean).join(" ");
  return (
    <span className={classes}>
      {srPrefix ? <span className="u-visually-hidden">{srPrefix} </span> : null}
      {children}
    </span>
  );
}

/** Convenience wrapper for the draft / in-review / approved badge. */
export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge tone={status} srPrefix="Status:">
      {STATUS_LABELS[status]}
    </Badge>
  );
}

export default Badge;
