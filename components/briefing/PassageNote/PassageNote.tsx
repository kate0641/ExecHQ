import { BRIEFING_COPY, type BriefingRead } from "@/mock/briefing";

const C = BRIEFING_COPY.passage;

export interface PassageNoteProps {
  read: BriefingRead;
  /**
   * - `inline`: phone and tablet. Margins don't exist on a phone, so the note
   *   sits right under the passage as a callout.
   * - `margin`: web. The note moves into the margin beside the passage.
   */
  placement: "inline" | "margin";
  /** Tapping the passage: opens the sheet with "Respond to this". */
  onOpen: () => void;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * Concept C's one highlighted passage from a read, and ExecHQ's note on it.
 * Free text selection is awkward on a phone, so the passage is chosen for her
 * and highlighted, and the whole passage is one button. The note says why
 * this sentence; the reason line above already says why the read.
 */
export function PassageNote({ read, placement, onOpen, demo, className }: PassageNoteProps) {
  return (
    <div className={["passage-note", `passage-note--${placement}`, className].filter(Boolean).join(" ")}>
      <figure className="passage-note__figure">
        <figcaption className="u-visually-hidden">{C.label}</figcaption>
        <blockquote className="passage-note__quote">
          <button
            type="button"
            className={["passage-note__passage", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
            onClick={onOpen}
            aria-describedby={`${read.id}-passage-hint`}
          >
            <mark className="passage-note__mark">{read.passage}</mark>
          </button>
        </blockquote>
      </figure>
      <aside className="passage-note__note" aria-label={C.noteLabel}>
        <span className="passage-note__note-label">{C.noteLabel}</span>
        <p className="passage-note__note-text">{read.note}</p>
      </aside>
      <span className="u-visually-hidden" id={`${read.id}-passage-hint`}>
        {C.tapHint}
      </span>
    </div>
  );
}

export default PassageNote;
