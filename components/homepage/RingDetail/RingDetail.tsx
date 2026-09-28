import { ARTIFACT_KINDS } from "@/mock/loop";
import { shortDate } from "@/lib/loop";
import type { Ring } from "@/lib/rings";
import type { TrackedSignal } from "@/mock/plan-stub";

export interface RingDetailProps {
  ring: Ring;
  /** The signals its actions move, for the timeline. */
  signals: TrackedSignal[];
  /** Entries after this date haven't happened yet, so they aren't shown. */
  today?: string;
  id?: string;
  className?: string;
}

/**
 * What a ring holds, opened from RingsHero: each action and where it stands,
 * then a dated timeline of what they are tracking, every entry marked as
 * observed (it happened in ExecHQ) or reported (the user told us). Actions
 * declined or set aside are mentioned once, quietly, and never as missed.
 */
export function RingDetail({ ring, signals, today, id = "ring-detail", className }: RingDetailProps) {
  const entries = signals
    .flatMap((signal) => signal.entries.map((entry) => ({ ...entry, signal: signal.name })))
    .filter((entry) => !today || entry.on <= today)
    .sort((a, b) => (a.on < b.on ? -1 : 1));
  return (
    <section id={id} className={["ring-detail", className].filter(Boolean).join(" ")} aria-labelledby={`${id}-heading`}>
      <h2 className="ring-detail__heading" id={`${id}-heading`} tabIndex={-1}>
        {ring.label} <span>&middot; {ring.span}</span>
      </h2>
      <ul className="ring-detail__actions">
        {ring.segments.map(({ action, record, filled }) => (
          <li key={action.id}>
            <span className="ring-detail__title">{action.title}</span>
            <span className="ring-detail__state">
              {filled && record?.usedOn
                ? `Confirmed · ${ARTIFACT_KINDS[record.kind].usedVerb} ${shortDate(record.usedOn)}`
                : record
                  ? "Not used yet"
                  : "Not started yet"}
            </span>
          </li>
        ))}
      </ul>
      {entries.length ? (
        <>
          <p className="ring-detail__quiet">What it&rsquo;s tracking: {signals.map((s) => s.name).join("; ")}</p>
          <ol className="ring-detail__timeline">
            {entries.map((e) => (
              <li key={`${e.on}-${e.text}`}>
                <time dateTime={e.on}>{shortDate(e.on)}</time>
                <span className="ring-detail__dot" aria-hidden="true" />
                <span>
                  {e.text}{" "}
                  <span className={`ring-detail__source ring-detail__source--${e.source}`}>
                    {e.source === "observed" ? "Observed" : "Reported"}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </>
      ) : null}
      {ring.setAside.length ? (
        <p className="ring-detail__quiet">
          {ring.setAside.length === 1
            ? "One action you declined or set aside isn’t in this ring."
            : `${ring.setAside.length} actions you declined or set aside aren’t in this ring.`}
        </p>
      ) : null}
    </section>
  );
}

export default RingDetail;
