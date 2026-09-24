import { StoryText } from "@/components/onboarding/StoryText";
import type { StorySegment } from "@/mock/onboarding";

export interface DraftSectionProps {
  /** Small label above, e.g. "Draft". */
  eyebrow: string;
  /** The part of the story, e.g. "What I do". */
  title: string;
  segments: readonly StorySegment[];
  /** Set once the user has approved it. */
  approvedLabel?: string;
  className?: string;
}

/**
 * One part of the story, drafted for the user to review before the next is
 * written, by decision on 2026-09-24. Anything they have not told us stays a
 * dashed gap. Once approved it says so, and stays in the conversation as a
 * record of what was agreed.
 */
export function DraftSection({ eyebrow, title, segments, approvedLabel, className }: DraftSectionProps) {
  return (
    <div
      className={["draft-section", approvedLabel ? "is-approved" : null, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="draft-section__head">
        <p className="draft-section__eyebrow">{eyebrow}</p>
        {approvedLabel ? <p className="draft-section__approved">{approvedLabel}</p> : null}
      </div>
      <p className="draft-section__title">{title}</p>
      <StoryText segments={segments} className="draft-section__text" />
    </div>
  );
}

export default DraftSection;
