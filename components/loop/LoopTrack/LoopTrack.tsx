import { loopJourney, shortDate, type LoopRecord } from "@/lib/loop";

export interface LoopTrackProps {
  record: LoopRecord;
  /** Shown while the artifact waits to hear, under the last step. */
  waitingLabel?: string;
  className?: string;
}

/**
 * An artifact's way through the Loop, drawn like a parcel tracker: Drafted,
 * then used (in the kind's own word — Used, Sent, Published), then what came
 * of it. A done step carries a tick; the step it is waiting on is ringed.
 *
 * The steps are a list, so each reads out in order with its state; the line
 * between them is decoration.
 */
export function LoopTrack({ record, waitingLabel = "Waiting to hear", className }: LoopTrackProps) {
  const steps = loopJourney(record);
  return (
    <ol
      className={[
        "loop-track",
        // The two connecting lines, drawn by the list itself: solid once the
        // step they lead to is done.
        steps[1].done ? "is-used" : null,
        steps[2].done ? "is-heard" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Where it is in the Loop"
    >
      {steps.map((step, i) => {
        const when = step.on ? shortDate(step.on) : step.current && i === 2 ? waitingLabel : step.current ? "Not yet" : "";
        return (
          <li
            key={step.key}
            className={["loop-track__step", step.done ? "is-done" : null, step.current ? "is-current" : null]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="loop-track__node" aria-hidden="true">
              {step.done ? (
                <svg viewBox="0 0 12 12" width="12" height="12">
                  <path d="M2.5 6.2l2.3 2.3L9.5 3.8" />
                </svg>
              ) : null}
            </span>
            <span className="loop-track__label">{step.label}</span>
            {when ? <span className="loop-track__when">{when}</span> : null}
            <span className="u-visually-hidden">
              {step.done ? ", done" : step.current ? ", the step it’s on" : ", not yet"}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default LoopTrack;
