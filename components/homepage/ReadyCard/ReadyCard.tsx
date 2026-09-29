import Link from "next/link";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { LoopTrack } from "@/components/loop/LoopTrack";
import { Button } from "@/components/primitives/Button";
import { ARTIFACT_KINDS } from "@/mock/loop";
import type { LoopRecord } from "@/lib/loop";

export interface ReadyCardProps {
  /** The artifact that is ready but not yet marked used. */
  record: LoopRecord;
  about?: { lead: string; title: string };
  /** One tap: it was used (or sent, or published). */
  onUsed: () => void;
  /** Where the artifact opens. Stubbed until Sprint 4. */
  openHref: string;
  /** When the Loop will check back once it's used, in words: "in two days". */
  checkBack?: string;
  /** Shows the artifact's way through the Loop above the question. */
  showTrack?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * An artifact that is ready but not marked used. It never nags: it says the
 * artifact is ready, and makes marking it used a single tap.
 */
export function ReadyCard({
  record,
  about,
  onUsed,
  openHref,
  checkBack,
  showTrack = true,
  headingId = "ready-title",
  className,
}: ReadyCardProps) {
  const verb = ARTIFACT_KINDS[record.kind].usedVerb;
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
        {record.title} is ready. Tell me when you’ve {verb} it.
      </h2>
      {checkBack ? <p className="home-card__text">I’ll check back {checkBack} to ask what came of it.</p> : null}
      <div className="home-card__actions">
        <Button onClick={onUsed} fullWidth>
          I’ve {verb} it
        </Button>
        <Link href={openHref} className="btn btn--secondary btn--md btn--full">
          Open it
        </Link>
      </div>
    </section>
  );
}

export default ReadyCard;
