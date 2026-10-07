import { ANSWER_COPY } from "@/mock/plan";

const C = ANSWER_COPY.toldUs;

export interface ToldUsRow {
  /** What it is filed under: "Who decides". */
  label: string;
  /** Her answer, in her words. */
  answer: string;
}

export interface ToldUsProps {
  rows: readonly ToldUsRow[];
  headingId?: string;
  className?: string;
}

/**
 * What she has told her plan, in her own words, filed by what it answers. It
 * only ever shows what she chose to say, and nothing here is a score.
 */
export function ToldUs({ rows, headingId = "told-us", className }: ToldUsProps) {
  return (
    <section className={["told-us", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="told-us__heading" id={headingId}>
        {C.heading}
      </h2>
      {rows.length ? (
        <dl className="told-us__list">
          {rows.map((row) => (
            <div key={row.label} className="told-us__row">
              <dt>{row.label}</dt>
              <dd>{row.answer}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="told-us__empty">{C.empty}</p>
      )}
    </section>
  );
}

export default ToldUs;
