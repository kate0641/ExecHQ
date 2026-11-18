import type { StorySegment } from "@/mock/onboarding";

export interface StoryTextProps {
  segments: readonly StorySegment[];
  /** Screen-reader lead-in for a gap, e.g. "To add:". */
  gapLabel?: string;
  className?: string;
}

/**
 * An output of the builder: the user's words, with anything they have not
 * told us yet drawn as a dashed gap rather than made up.
 *
 * A gap is announced as something still to add, so a screen reader does not
 * read "your team size" as though it were the user's team size.
 */
export function StoryText({ segments, gapLabel = "To add:", className }: StoryTextProps) {
  return (
    <p className={["story-text", className].filter(Boolean).join(" ")}>
      {segments.map((segment, index) =>
        "gap" in segment ? (
          <span className="story-text__gap" key={index}>
            <span className="u-visually-hidden">{gapLabel} </span>
            {segment.gap}
          </span>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </p>
  );
}

export default StoryText;
