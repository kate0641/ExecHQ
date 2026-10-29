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

/** Which state class a record takes: its state, with set-aside split out of
 *  done so it never looks as if it was used. The word alone carries it; the
 *  little shape that sat beside it is gone (designer, 2026-10-28). */
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
 * An artifact's place in the Loop: the one status treatment used identically
 * everywhere an artifact appears (Home, the Plan, the Playbook and its library).
 *
 * It reads its label from the record through `lib/loop.ts`, so it cannot say
 * anything the Loop would not: "Draft", "Ready to use", "Sent", "Published",
 * "Waiting to hear", "Outcome logged", "Closed". It is a label, not a control.
 * Whatever answers a follow-up sits beside it.
 */
export function LoopStatus({ record, detail = true, srPrefix = "Status:", className }: LoopStatusProps) {
  const glyph = glyphFor(record);
  const second = detail ? statusDetail(record) : undefined;
  const classes = ["loop-status", `loop-status--${glyph}`, className].filter(Boolean).join(" ");

  return (
    <span className={classes}>
      {srPrefix ? <span className="u-visually-hidden">{srPrefix} </span> : null}
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
