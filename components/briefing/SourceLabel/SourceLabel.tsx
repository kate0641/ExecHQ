import { Icon } from "@/components/primitives/Icon";
import { BRIEFING_COPY, publisherName, type BriefingRead } from "@/mock/briefing";

const C = BRIEFING_COPY.respond;

export interface SourceLabelProps {
  read: BriefingRead;
  /** The passage she started from, when she started from one (Concept C). */
  passage?: string;
  /** `full` shows the reason line too: where the draft starts. `compact` is
   *  the label alone, for a library row. */
  size?: "full" | "compact";
  className?: string;
}

/**
 * Where a draft came from, when it came from the Briefing: the provenance
 * label, plain and the same everywhere, then the read it started from. It
 * stays with the artifact for its whole life, in the builder and the library.
 */
export function SourceLabel({ read, passage, size = "full", className }: SourceLabelProps) {
  const publisher = publisherName(read.publisherId);
  return (
    <div className={["source-label", `source-label--${size}`, className].filter(Boolean).join(" ")}>
      <span className="source-label__label">
        <Icon name="briefing" size={14} />
        {C.provenance}
      </span>
      <span className="source-label__source">{C.sourceLine(read.title, publisher)}</span>
      {passage ? <blockquote className="source-label__passage">{passage}</blockquote> : null}
      {size === "full" ? <span className="source-label__reason">{read.reason}</span> : null}
    </div>
  );
}

export default SourceLabel;
