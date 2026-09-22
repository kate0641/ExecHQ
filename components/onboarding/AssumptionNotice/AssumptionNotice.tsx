export interface AssumptionNoticeProps {
  /** What the system assumed, tied to what the user actually said. */
  statement: string;
  /** The promise that it can be sharpened later. */
  promise: string;
  className?: string;
}

/**
 * States an assumption the system has made because the user skipped something.
 *
 * The copy pattern is fixed by the PRD and is the reason this is its own
 * component rather than a Notice with different words: state the assumption,
 * then promise refinement. Every default-assumption moment in the product uses
 * the same two beats, so they should be structurally the same thing.
 *
 * It appears as a consequence of the user's choice to skip, so it is announced
 * politely rather than silently replacing the screen.
 */
export function AssumptionNotice({
  statement,
  promise,
  className,
}: AssumptionNoticeProps) {
  return (
    // <output> rather than a div with role="status": same polite-live
    // semantics, but it is the element the platform provides for "the result of
    // what the user just did", which is exactly what an assumption is.
    <output className={["assumption", className].filter(Boolean).join(" ")}>
      <p className="assumption__statement">{statement}</p>
      <p className="assumption__promise">{promise}</p>
    </output>
  );
}

export default AssumptionNotice;
