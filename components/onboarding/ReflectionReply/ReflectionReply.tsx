export interface ReflectionReplyProps {
  /** Who is speaking, e.g. "ExecHQ". */
  from: string;
  text: string;
  /** A fact to go with it. Until sourced, shown as a marked placeholder. */
  fact?: { label: string; text: string; placeholder?: boolean };
  className?: string;
}

/**
 * ExecHQ's answer to a reflection question, set as a pull quote: one of the
 * editorial moments Libre Baskerville is kept for. A fact can follow. Facts
 * must be real and sourced before this ships, so until then they are drawn as
 * placeholders that cannot be mistaken for copy, and none of them ranks the
 * user against anyone: the pilot rules out rank and percentile.
 */
export function ReflectionReply({ from, text, fact, className }: ReflectionReplyProps) {
  return (
    <div className={["reflection-reply", className].filter(Boolean).join(" ")}>
      <figure className="reflection-reply__quote">
        <blockquote>
          <p>{text}</p>
        </blockquote>
        <figcaption>{from}</figcaption>
      </figure>
      {fact ? (
        <div className={["reflection-reply__fact", fact.placeholder ? "is-placeholder" : null].filter(Boolean).join(" ")}>
          <p className="reflection-reply__fact-label">{fact.label}</p>
          <p className="reflection-reply__fact-text">{fact.text}</p>
        </div>
      ) : null}
    </div>
  );
}

export default ReflectionReply;
