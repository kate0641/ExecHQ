import { BRIEFING_COPY, type ArticlePart, type BriefingRead } from "@/mock/briefing";

const C = BRIEFING_COPY.passage;

export interface BriefingArticleProps {
  read: BriefingRead;
  /**
   * - `inline`: phone and tablet. Each note sits under its paragraph.
   * - `margin`: web. The notes move into the margin beside their paragraph.
   */
  placement: "inline" | "margin";
  /** Catalogue only: a stand-in body, to show a state the mock doesn't reach. */
  body?: ArticlePart[][];
  className?: string;
}

const isNote = (part: ArticlePart): part is { text: string; note: string } => typeof part !== "string";

/** The number each note's passage carries, counted through the article. */
function numberNotes(body: ArticlePart[][]): number[][] {
  const before = body.map((_, i) => body.slice(0, i).flat().filter(isNote).length);
  return body.map((paragraph, i) => {
    const notes = paragraph.filter(isNote);
    return paragraph.map((part) => (isNote(part) ? before[i] + notes.indexOf(part) + 1 : 0));
  });
}

/**
 * Briefing Concept 2's article, read in ExecHQ rather than at the publisher:
 * the whole text, with ExecHQ's notes all the way through. Each noted passage
 * is highlighted and numbered, and its note says why that part matters to
 * her. Notes are for reading, not controls; responding is the reader bar's
 * Write a post.
 */
export function BriefingArticle({ read, placement, body = read.body, className }: BriefingArticleProps) {
  const numbers = numberNotes(body);
  return (
    <div className={["brief-article", `brief-article--${placement}`, className].filter(Boolean).join(" ")}>
      {body.map((paragraph, i) => {
        const notes: { n: number; note: string }[] = [];
        const text = paragraph.map((part, j) => {
          if (!isNote(part)) return part;
          const n = numbers[i][j];
          notes.push({ n, note: part.note });
          return (
            <mark key={j} className="brief-article__mark">
              {part.text}
              <sup className="brief-article__ref" aria-hidden="true">
                {n}
              </sup>
              <span className="u-visually-hidden"> ({C.noteRef(n)})</span>
            </mark>
          );
        });
        return (
          <div key={i} className="brief-article__block">
            <p className="brief-article__para">{text}</p>
            {notes.length ? (
              <div className="brief-article__notes">
                {notes.map((note) => (
                  <aside key={note.n} className="brief-article__note" aria-label={`${C.noteLabel} ${note.n}`}>
                    <span className="brief-article__note-label" aria-hidden="true">
                      <span className="brief-article__note-num">{note.n}</span>
                      {C.noteLabel}
                    </span>
                    <p className="brief-article__note-text">{note.note}</p>
                  </aside>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default BriefingArticle;
