"use client";

import type { Artifact } from "@/mock/onboarding";

export interface ArtifactDraftProps {
  artifact: Artifact;
  /** Shows the saved confirmation in place of the note. */
  saved?: boolean;
  onEditSection?: (heading: string, body: string) => void;
  /** Read-only rendering, for the catalogue and for review screens. */
  readOnly?: boolean;
  /** Drops the document's own tool and title lines where the screen around it
   *  already carries them, so the same words do not appear twice. The note and
   *  the saved confirmation stay — they belong to the document, not the page. */
  showTitle?: boolean;
  className?: string;
}

/**
 * The first artifact, as a document already in progress.
 *
 * A deliberate stub of the Positioning Builder — the real tool is Sprint 4.
 * It exists so the flow can be walked to a saved artifact, and it is not a
 * design for that tool.
 *
 * The one thing it does have to get right is the feeling the brief asks for:
 * a hand-off into something real, not a tutorial screen. So the draft is
 * already written when it appears, the sections are directly editable, and the
 * unfinished section is visibly unfinished rather than hidden — a document with
 * a gap in it reads as started, where a complete one reads as delivered.
 */
export function ArtifactDraft({
  artifact,
  saved = false,
  onEditSection,
  readOnly = false,
  showTitle = true,
  className,
}: ArtifactDraftProps) {
  return (
    <article className={["artifact", className].filter(Boolean).join(" ")}>
      <header className="artifact__header">
        {showTitle ? (
          <>
            <p className="t-eyebrow">{artifact.tool}</p>
            <h2 className="artifact__title">{artifact.title}</h2>
          </>
        ) : null}
        <p className="artifact__note">{saved ? "Saved to your plan." : artifact.note}</p>
      </header>

      <div className="artifact__body">
        {artifact.sections.map((section) => (
          <section
            className={`artifact__section artifact__section--${section.state}`}
            key={section.heading}
          >
            <h3 className="artifact__section-heading">{section.heading}</h3>
            {readOnly ? (
              <p className="artifact__section-body">{section.body}</p>
            ) : (
              <textarea
                className="artifact__section-field"
                aria-label={section.heading}
                defaultValue={section.body}
                rows={section.state === "pending" ? 2 : 4}
                onChange={(event) =>
                  onEditSection?.(section.heading, event.target.value)
                }
              />
            )}
            {section.state === "pending" ? (
              <p className="artifact__section-status">Not written yet</p>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}

export default ArtifactDraft;
