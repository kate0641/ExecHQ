import Link from "next/link";
import { CardCarousel } from "@/components/layout/CardCarousel";
import { Icon } from "@/components/primitives/Icon";

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
  /** How to reach it: an address, a named editor, or its own form. Shown in Pitch Builder, not on the card. */
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
 * Spark Signals (UX review, 18 Nov): after today's reads, on the page like
 * them, under a hairline with a serif heading (option 2 of the clean-up). Up
 * to three opportunities to be seen, picked for where she is going: a show to
 * pitch, an event to speak at, a publication to write for. One light card at a
 * time in a carousel, the next peeking in, with dots: its kind, its name, why
 * it fits her, one line of what they want and when, a navy button to start
 * the pitch in Pitch Builder, and an × in the corner for Not for me. Said
 * plainly as picked by ExecEngine, to check before she reaches out.
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
          arrows={false}
          items={items.map((item) => ({
            id: item.id,
            node: (
              <article className="spark-signal" aria-labelledby={`${headingId}-${item.id}`}>
                <p className="spark-signal__kind">{item.kind}</p>
                <h3 className="spark-signal__name" id={`${headingId}-${item.id}`}>
                  {item.name}
                </h3>
                <p className="spark-signal__why">
                  <span className="u-visually-hidden">{whyLabel} </span>
                  {item.why}
                </p>
                {item.format || item.when ? (
                  <p className="spark-signal__meta">
                    {item.format}
                    {item.format && item.when ? <span aria-hidden="true"> · </span> : null}
                    {item.when ? <span className={item.dated ? "spark-signal__due" : undefined}>{item.when}</span> : null}
                  </p>
                ) : null}
                <Link href={item.href} className="btn btn--strong btn--md spark-signal__start">
                  {item.startLabel}
                </Link>
                <button type="button" className="spark-signal__pass" aria-label={`${notForMeLabel}: ${item.name}`} onClick={() => onPass(item.id)}>
                  <Icon name="close" size={16} />
                </button>
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
