import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";
import type { RoadmapStage } from "@/mock/plan-stub";

export interface StageTrackProps {
  /** The roadmap's stages, in order. */
  stages: RoadmapStage[];
  /** Which one the user is in, from 0. */
  current: number;
  /** "Step up". */
  planName: string;
  /** The Plan destination. Stubbed until Sprint 3. */
  planHref: string;
  planLabel?: string;
  headingId?: string;
  className?: string;
}

const two = (n: number) => String(n).padStart(2, "0");

/**
 * Where the user is on their roadmap, as a table of contents. The current
 * stage opens up — large type, "You are here", and what it asks now — and
 * every other stage stays one line: its name, and "Done" once passed. Future
 * stages show their names only.
 *
 * An ordered list with `aria-current="step"` on the current stage. Position
 * is carried by the words ("You are here", "Done") and the order, never by
 * colour.
 */
export function StageTrack({
  stages,
  current,
  planName,
  planHref,
  planLabel = "See full plan",
  headingId = "stage-track",
  className,
}: StageTrackProps) {
  return (
    <section className={["stage-track", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="stage-track__top">
        <h2 className="stage-track__heading" id={headingId}>
          Your plan · {planName}
        </h2>
        <Link href={planHref} className="link link--standalone stage-track__plan">
          {planLabel}
        </Link>
      </div>
      <ol className="stage-track__list">
        {stages.map((stage, i) => {
          const hidden = <span className="u-visually-hidden">Stage {i + 1}: </span>;
          if (i === current) {
            return (
              <li key={stage.title} className="stage-track__stage is-current" aria-current="step">
                <span className="stage-track__here">
                  <span className="stage-track__chip">You are here</span>
                </span>
                <span className="stage-track__row">
                  <span className="stage-track__big-n" aria-hidden="true">
                    {two(i + 1)}
                  </span>
                  <span className="stage-track__big-name">
                    {hidden}
                    {stage.title}
                  </span>
                </span>
                <p className="stage-track__asks">{stage.asks}</p>
              </li>
            );
          }
          const done = i < current;
          return (
            <li key={stage.title} className={["stage-track__stage", done ? "is-done" : null].filter(Boolean).join(" ")}>
              <span className="stage-track__n" aria-hidden="true">
                {two(i + 1)}
              </span>
              <span className="stage-track__name">
                {hidden}
                {stage.title}
              </span>
              {done ? (
                <span className="stage-track__done">
                  <span className="stage-track__tick" aria-hidden="true">
                    <Icon name="check" size={10} />
                  </span>
                  Done
                </span>
              ) : (
                <span />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default StageTrack;
