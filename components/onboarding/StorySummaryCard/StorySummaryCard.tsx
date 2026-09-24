import { StoryText } from "@/components/onboarding/StoryText";
import type { StorySegment } from "@/mock/onboarding";

export interface StorySummaryCardProps {
  title: string;
  parts: readonly { heading: string; segments: readonly StorySegment[] }[];
  /** What else is ready, e.g. "Also your bio in three lengths". */
  also?: string;
  /** Opens every output in full. */
  detailsLabel: string;
  onDetails: () => void;
  /** The last change, said quietly, e.g. "Made it shorter". */
  status?: string;
  className?: string;
}

/**
 * The finished story, short enough for a conversation: the narrative's three
 * parts, and a note of what else is ready. The bio, the opener, hand edits
 * and export are one tap away, the same pattern as the plan card.
 */
export function StorySummaryCard({
  title,
  parts,
  also,
  detailsLabel,
  onDetails,
  status,
  className,
}: StorySummaryCardProps) {
  return (
    <div className={["story-summary", className].filter(Boolean).join(" ")}>
      <p className="story-summary__title">{title}</p>
      <ol className="story-summary__parts">
        {parts.map((part) => (
          <li key={part.heading}>
            <p className="story-summary__heading">{part.heading}</p>
            <StoryText segments={part.segments} className="story-summary__text" />
          </li>
        ))}
      </ol>
      {also ? <p className="story-summary__also">{also}</p> : null}
      <div className="story-summary__foot">
        <button type="button" className="plan-summary__details" onClick={onDetails}>
          {detailsLabel}
        </button>
        {status ? <p className="story-summary__status">{status}</p> : null}
      </div>
    </div>
  );
}

export default StorySummaryCard;
