import Link from "next/link";
import { CardCarousel } from "@/components/layout/CardCarousel";

export interface SparkSignal {
  id: string;
  /** "Podcast", "Event", "Publication". */
  kind: string;
  name: string;
  /** Why it fits her, in a line. */
  why: string;
  /** What they want: "A 40-minute recorded conversation". */
  format?: string;
  /** Its closing date, already in words ("Due Fri, Nov 13, 2026"), or how often it reads pitches. */
  when?: string;
  /** True when `when` is a closing date, so it stands out. */
  dated?: boolean;
  /** How to reach it: an address, a named editor, or its own form. */
  contact?: string;
  /** The button: "Start a pitch", "Start a proposal". */
  startLabel: string;
  /** Pitch Builder, with this outlet chosen. */
  href: string;
}

export interface SparkSignalsProps {
  items: readonly SparkSignal[];
  heading: string;
  lede: string;
  whyLabel: string;
  notForMeLabel: string;
  /** Said once she passes on one. */
  passedNote?: string;
  /** When she has passed on them all. */
  noneNote: string;
  /** That ExecEngine picked them, and to check before she reaches out. */
  honest: string;
  onPass: (id: string) => void;
  headingId?: string;
  className?: string;
}

/**
 * Spark Signals (UX review, 18 Nov): after today's reads, a navy section of
 * opportunities to be seen, picked for where she is going: a show to pitch, an
 * event to speak at, a publication to write for. One card at a time in a
 * carousel, the next peeking in, with its kind, why it fits her, what they
 * want, its date or reading cycle, how to reach it, a way to start the pitch
 * in Pitch Builder, and Not for me. Said plainly as picked by ExecEngine, to
 * check before she acts.
 */
export function SparkSignals({
  items,
  heading,
  lede,
  whyLabel,
  notForMeLabel,
  passedNote,
  noneNote,
  honest,
  onPass,
  headingId = "spark-signals",
  className,
}: SparkSignalsProps) {
  return (
    <section className={["spark-signals", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="spark-signals__head">
        <h2 className="spark-signals__heading" id={headingId}>
          {heading}
        </h2>
        <p className="spark-signals__lede">{lede}</p>
      </div>
      {items.length ? (
        <CardCarousel
          label={heading}
          className="spark-signals__carousel"
          items={items.map((item) => ({
            id: item.id,
            node: (
              <article className="spark-signal" aria-labelledby={`${headingId}-${item.id}`}>
                <p className="spark-signal__kind">{item.kind}</p>
                <h3 className="spark-signal__name" id={`${headingId}-${item.id}`}>
                  {item.name}
                </h3>
                <p className="spark-signal__why">
                  <b>{whyLabel}</b> {item.why}
                </p>
                {item.format || item.when ? (
                  <ul className="spark-signal__facts">
                    {item.format ? <li>{item.format}</li> : null}
                    {item.when ? <li className={item.dated ? "is-due" : undefined}>{item.when}</li> : null}
                  </ul>
                ) : null}
                {item.contact ? <p className="spark-signal__contact">{item.contact}</p> : null}
                <div className="spark-signal__actions">
                  <Link href={item.href} className="btn btn--primary btn--md">
                    {item.startLabel}
                  </Link>
                  <button type="button" className="link spark-signal__pass" onClick={() => onPass(item.id)}>
                    {notForMeLabel}
                    <span className="u-visually-hidden">: {item.name}</span>
                  </button>
                </div>
              </article>
            ),
          }))}
        />
      ) : (
        <p className="spark-signals__none">{noneNote}</p>
      )}
      <output className="spark-signals__said">{passedNote}</output>
      <p className="spark-signals__honest">{honest}</p>
    </section>
  );
}

export default SparkSignals;
