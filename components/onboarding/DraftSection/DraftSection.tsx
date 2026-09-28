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
  /** Where it could be used, as a short list under the text. */
  usesLabel?: string;
  uses?: readonly string[];
  className?: string;
}

/**
 * One part of the story, drafted for the user to review before the next is
 * written, by decision on 2026-09-24. Anything they have not told us stays a
 * dashed gap. Once approved it says so, and stays in the conversation as a
 * record of what was agreed.
 *
 * Since 2026-09-28 it also carries the whole first draft in Concept 2's
 * thread, with a few ideas for where to use it.
 */
export function DraftSection({
  eyebrow,
  title,
  segments,
  approvedLabel,
  usesLabel,
  uses,
  className,
}: DraftSectionProps) {
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
      {uses?.length ? (
        <section className="story-draft__uses draft-section__uses" aria-label={usesLabel}>
          {usesLabel ? <p className="builder-next__label">{usesLabel}</p> : null}
          <ul>
            {uses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export default DraftSection;
