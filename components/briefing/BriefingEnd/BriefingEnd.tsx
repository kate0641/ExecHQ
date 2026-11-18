import type { ReactNode } from "react";
import { BRIEFING_COPY } from "@/mock/briefing";

const C = BRIEFING_COPY.end;

export interface BriefingEndProps {
  /** She has opened all three. Concept A's foot then says so. */
  allRead?: boolean;
  /**
   * - `foot`: a short close under the three (Concepts A and C).
   * - `screen`: the last screen, after the third read (Concept B).
   */
  layout?: "foot" | "screen";
  headingLevel?: 2 | 3;
  headingId?: string;
  /** Under the close: what she read, saved reads, publishers. */
  children?: ReactNode;
  className?: string;
}

/**
 * The end of the day's set. A short, confident close: the Briefing says it is
 * done and stops. No "Load more", nothing suggesting she keep scrolling.
 */
export function BriefingEnd({ allRead = false, layout = "foot", headingLevel = 2, headingId, children, className }: BriefingEndProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      className={["brief-end", `brief-end--${layout}`, className].filter(Boolean).join(" ")}
      aria-labelledby={headingId}
    >
      <Heading className="brief-end__heading" id={headingId} tabIndex={-1}>
        {allRead ? C.allRead : C.heading}
      </Heading>
      <p className="brief-end__body">{C.body}</p>
      {children}
    </section>
  );
}

export default BriefingEnd;
