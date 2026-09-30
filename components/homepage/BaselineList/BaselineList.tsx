export interface BaselineRow {
  id: string;
  /** "Podcast appearances", "LinkedIn followers". */
  label: string;
  /** The value on the day her plan began, and today. Shown as given. */
  then: number | string;
  now: number | string;
  /** What she added last, if anything: "Planning as a leadership skill · The Modern CMO · 17 Oct". */
  latest?: string;
  /** Where the latest one can be found, if she gave a link. */
  latestHref?: string;
}

export interface BaselineListProps {
  rows: readonly BaselineRow[];
  /** Column captions over the pair. */
  thenLabel?: string;
  nowLabel?: string;
  /** Read out after a link that opens in a new tab. */
  newTabNote?: string;
  className?: string;
}

/**
 * Where she started beside where she is now, one row per signal. The start
 * is always on view, and a value that has not moved shows the same number
 * twice rather than hiding. It is her own record, so it never reads as a
 * score or a target. Shared by Homepage Concepts 2 and 3.
 */
export function BaselineList({ rows, thenLabel = "Start", nowLabel = "Now", newTabNote = "(opens in a new tab)", className }: BaselineListProps) {
  return (
    <div className={["baseline-list", className].filter(Boolean).join(" ")}>
      <div className="baseline-list__heads" aria-hidden="true">
        <span />
        <span className="baseline-list__heads-pair">
          <span>{thenLabel}</span>
          <span>{nowLabel}</span>
        </span>
      </div>
      <ul className="baseline-list__rows">
        {rows.map((row) => (
          <li key={row.id} className="baseline-list__row">
            <span className="baseline-list__label">{row.label}</span>
            <span className="baseline-list__counts">
              <span className="baseline-list__then">
                <span className="u-visually-hidden">{thenLabel}: </span>
                {row.then}
              </span>
              <span className="baseline-list__arrow" aria-hidden="true">
                →
              </span>
              <b className="baseline-list__now">
                <span className="u-visually-hidden">{nowLabel}: </span>
                {row.now}
              </b>
            </span>
            {row.latest ? (
              <span className="baseline-list__latest">
                {row.latestHref ? (
                  <a href={row.latestHref} target="_blank" rel="noopener noreferrer">
                    {row.latest}
                    <span className="u-visually-hidden"> {newTabNote}</span>
                  </a>
                ) : (
                  row.latest
                )}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BaselineList;
