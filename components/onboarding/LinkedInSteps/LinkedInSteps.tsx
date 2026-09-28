import type { UploadStepPart } from "@/mock/onboarding";

export interface LinkedInStepsProps {
  /** Names the list for assistive technology, e.g. "How to get it". */
  label: string;
  steps: readonly (readonly UploadStepPart[])[];
  /** Said after the link's text, for assistive technology: it opens a tab. */
  linkNote: string;
  className?: string;
}

/**
 * How to get the LinkedIn analytics export, as numbered steps. The steps are
 * a real sequence, so the numbers carry information. The first three are
 * LinkedIn's own and cannot change; what to press is set in bold so it can
 * be matched against LinkedIn's screen.
 *
 * Shared by the upload step (Concepts 1 and 3) and Concept 2's thread.
 */
export function LinkedInSteps({ label, steps, linkNote, className }: LinkedInStepsProps) {
  return (
    <ol className={["linkedin-steps", className].filter(Boolean).join(" ")} aria-label={label}>
      {steps.map((parts, index) => (
        <li key={index}>
          {/* One span, so the step's parts flow as a line beside its number. */}
          <span>
            {parts.map((part, n) =>
              "link" in part ? (
                <a key={n} href={part.href} target="_blank" rel="noopener noreferrer">
                  {part.link}
                  <span className="u-visually-hidden"> ({linkNote})</span>
                </a>
              ) : "press" in part ? (
                <b key={n}>{part.press}</b>
              ) : (
                <span key={n}>{part.text}</span>
              )
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default LinkedInSteps;
