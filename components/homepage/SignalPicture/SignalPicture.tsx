import Link from "next/link";
import type { ReactNode } from "react";
import { BaselineList, type BaselineRow } from "@/components/homepage/BaselineList";
import { Spark, type SparkProps } from "@/components/homepage/Spark";
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
  /** The one thing to try next, with the way to start it in the Toolbox. */
  next?: { label: string; title: string; why: string; href: string; actionLabel: string };
  /** The way to the full Signal Picture page, as a text link under the rows. */
  detailHref?: string;
  detailLabel?: string;
  /** Nothing entered yet: what stands in place of the rows, the form that asks
   *  where she is starting from. */
  empty?: ReactNode;
  headingId: string;
  className?: string;
}

/**
 * A short overview of what she has put out there: where she started beside
 * where she is now, one note of what has moved, and one thing to try next.
 * It is her own record, entered by hand, so nothing in it is a score or a
 * target.
 *
 * With nothing entered it asks where she is starting from.
 */
export function SignalPicture({
  name,
  asOf,
  rows = [],
  thenLabel,
  nowLabel,
  spark,
  next,
  detailHref,
  detailLabel,
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
        empty
      ) : (
        <>
          {spark ? <Spark {...spark} /> : null}
          <BaselineList rows={rows} thenLabel={thenLabel} nowLabel={nowLabel} />
          {detailHref ? (
            <Link href={detailHref} className="link link--standalone signal-picture__links">
              {detailLabel}
            </Link>
          ) : null}
          {next ? (
            <div className="account-card__try">
              <span className="account-card__try-label">{next.label}</span>
              <b>{next.title}</b>
              <p>{next.why}</p>
              <Link href={next.href} className="btn btn--secondary btn--md account-card__cta">
                {next.actionLabel}
                <Icon name="chevron" size={16} />
              </Link>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

export default SignalPicture;
