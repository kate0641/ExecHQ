import { LoopStatus } from "@/components/loop/LoopStatus";
import { LoopTrack } from "@/components/loop/LoopTrack";
import { OutcomeCapture, type OutcomeAnswer } from "@/components/homepage/OutcomeCapture";
import { followUpQuestion, type LoopRecord } from "@/lib/loop";

export interface FollowUpCardProps {
  /** The used artifact being asked about. */
  record: LoopRecord;
  /** The snapshot's today, for "last Tuesday". */
  today: string;
  /** What this confirms, named plainly: e.g. "Confirms your short-term action"
   *  and the action. Never phrased as pressure. */
  about?: { lead: string; title: string };
  onSubmit: (answer: OutcomeAnswer) => void;
  /** A second follow-up waiting, reached through a quiet link. */
  another?: { label: string; onShow: () => void };
  /** Shows the artifact's way through the Loop above the question. */
  showTrack?: boolean;
  /** Catalogue only: passed through to OutcomeCapture. */
  captureDemo?: { showError?: boolean };
  headingId?: string;
  className?: string;
}

/**
 * Asks what happened with one used artifact, naming it and when it was used,
 * and takes the answer right here with OutcomeCapture.
 *
 * One follow-up at a time: if another is waiting, a quiet link says so and
 * shows it instead, rather than stacking them up.
 */
export function FollowUpCard({
  record,
  today,
  about,
  onSubmit,
  another,
  showTrack = true,
  captureDemo,
  headingId = "follow-up-question",
  className,
}: FollowUpCardProps) {
  return (
    <section className={["home-card", "home-card--raised", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="home-card__top">
        {about ? (
          <p className="home-card__about">
            <span>{about.lead}</span>
            <b>{about.title}</b>
          </p>
        ) : (
          <span />
        )}
        <LoopStatus record={record} detail={false} />
      </div>
      {showTrack ? <LoopTrack record={record} /> : null}
      <h2 className="home-card__question" id={headingId} tabIndex={-1}>
        {followUpQuestion(record, today)}
      </h2>
      <OutcomeCapture onSubmit={onSubmit} showError={captureDemo?.showError} />
      {another ? (
        <button type="button" className="link link--standalone home-card__another" onClick={another.onShow}>
          {another.label}
        </button>
      ) : null}
    </section>
  );
}

export default FollowUpCard;
