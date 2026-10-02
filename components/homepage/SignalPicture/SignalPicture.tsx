import Link from "next/link";
import { BaselineList, type BaselineRow } from "@/components/homepage/BaselineList";
import { Spark, type SparkProps } from "@/components/homepage/Spark";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface SignalPictureProps {
  name: string;
  /** "Since 5 Oct": where the starting counts are taken from. */
  asOf?: string;
  rows?: readonly BaselineRow[];
  thenLabel?: string;
  nowLabel?: string;
  /** The one note of what has moved lately. Omitted when nothing has. */
  spark?: SparkProps;
  /** The one thing to try next. A suggestion, so it does not link on. */
  next?: { label: string; title: string; why: string };
  /** The way to the detail on the Plan page. */
  planHref: string;
  planLabel: string;
  /** Nothing entered yet: what the picture will show and the one way to
   *  begin. In place of the rows. */
  empty?: { intro: string; shows: readonly string[]; label: string; onAdd: () => void };
  headingId: string;
  className?: string;
}

/**
 * A short overview of what she has put out there: where she started beside
 * where she is now, one note of what has moved, and one thing to try next.
 * It is her own record, entered by hand, so nothing in it is a score or a
 * target. The detail, and the way to add more, is on the Plan page.
 *
 * With nothing entered it says what it would show and offers one way in.
 */
export function SignalPicture({
  name,
  asOf,
  rows = [],
  thenLabel,
  nowLabel,
  spark,
  next,
  planHref,
  planLabel,
  empty,
  headingId,
  className,
}: SignalPictureProps) {
  return (
    <section className={["account-card", "signal-picture", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="account-card__top">
        <h2 className="account-card__name" id={headingId}>
          {name}
        </h2>
        {asOf && !empty ? <span className="account-card__asof">{asOf}</span> : null}
      </div>
      {empty ? (
        <>
          <p className="account-card__text">{empty.intro}</p>
          <ul className="account-card__shows">
            {empty.shows.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <Button variant="secondary" className="account-card__cta" onClick={empty.onAdd}>
            {empty.label}
          </Button>
        </>
      ) : (
        <>
          <BaselineList rows={rows} thenLabel={thenLabel} nowLabel={nowLabel} />
          {spark ? <Spark {...spark} /> : null}
          {next ? (
            <div className="account-card__try">
              <span className="account-card__try-label">{next.label}</span>
              <b>{next.title}</b>
              <p>{next.why}</p>
            </div>
          ) : null}
          <Link href={planHref} className="btn btn--secondary btn--md account-card__cta">
            {planLabel}
            <Icon name="chevron" size={16} />
          </Link>
        </>
      )}
    </section>
  );
}

export default SignalPicture;
