import { statusDetail, statusLabel, type LoopRecord } from "@/lib/loop";

export interface LoopStatusProps {
  record: LoopRecord;
  /** Show the second line some states carry ("Still editing", "Set aside").
   *  On by default; turn it off only where the label alone is enough. */
  detail?: boolean;
  /** Read before the label by screen readers only. */
  srPrefix?: string;
  className?: string;
}

/** Which glyph a record shows: its state, with set-aside split out of done so
 *  it never looks as if it was used. */
type Glyph = "draft" | "ready" | "used" | "waiting" | "outcome" | "done" | "set-aside";

function glyphFor(record: LoopRecord): Glyph {
  switch (record.state) {
    case "drafted":
    case "in-progress":
      return "draft";
    case "closed":
      return statusDetail(record) ? "set-aside" : "done";
    default:
      return record.state;
  }
}

/**
 * The shape for each state, on a 12×12 grid in currentColor. It fills in as
 * the artifact moves through the Loop: dashed while a draft, a full ring once
 * ready, half full once used, a clock while waiting, solid once the outcome is
 * in, a ring with a tick when done. A second cue beside the word, never
 * instead of it, so status never depends on colour (WCAG 2.2 SC 1.4.1).
 */
const GLYPHS: Record<Glyph, React.ReactNode> = {
  draft: <circle cx="6" cy="6" r="4.5" strokeDasharray="2.2 1.9" />,
  ready: <circle cx="6" cy="6" r="4.5" />,
  used: (
    <>
      <circle cx="6" cy="6" r="4.5" />
      <path d="M6 1.5a4.5 4.5 0 0 1 0 9Z" fill="currentColor" stroke="none" />
    </>
  ),
  waiting: (
    <>
      <circle cx="6" cy="6" r="4.5" />
      <path d="M6 3.5V6l1.7 1.2" />
    </>
  ),
  outcome: <circle cx="6" cy="6" r="4.5" fill="currentColor" />,
  done: (
    <>
      <circle cx="6" cy="6" r="4.5" />
      <path d="m4 6.1 1.4 1.4L8.1 4.7" />
    </>
  ),
  "set-aside": (
    <>
      <circle cx="6" cy="6" r="4.5" />
      <path d="M4 6h4" />
    </>
  ),
};

/**
 * An artifact's place in the Loop: the one status treatment used identically
 * everywhere an artifact appears (Home, Toolbox, the archive later).
 *
 * It reads its label from the record through `lib/loop.ts`, so it cannot say
 * anything the Loop would not: "Draft", "Ready to use", "Sent", "Published",
 * "Waiting to hear", "Outcome logged", "Done". It is a label, not a control.
 * Whatever answers a follow-up sits beside it.
 */
export function LoopStatus({ record, detail = true, srPrefix = "Status:", className }: LoopStatusProps) {
  const glyph = glyphFor(record);
  const second = detail ? statusDetail(record) : undefined;
  const classes = ["loop-status", `loop-status--${glyph}`, className].filter(Boolean).join(" ");

  return (
    <span className={classes}>
      {srPrefix ? <span className="u-visually-hidden">{srPrefix} </span> : null}
      <svg
        className="loop-status__glyph"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {GLYPHS[glyph]}
      </svg>
      <span className="loop-status__label">{statusLabel(record)}</span>
      {second ? (
        <span className="loop-status__detail">
          <span aria-hidden="true">·</span>
          <span className="u-visually-hidden">,</span> {second}
        </span>
      ) : null}
    </span>
  );
}

export default LoopStatus;
