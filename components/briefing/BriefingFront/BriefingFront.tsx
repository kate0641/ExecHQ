import { BriefingPicture } from "@/components/briefing/BriefingPicture";
import { BRIEFING_COPY as C, publisherName, type BriefingRead } from "@/mock/briefing";

export interface BriefingFrontProps {
  reads: readonly BriefingRead[];
  onOpen: (index: number) => void;
  /** `front`: the lead story and two rows (phone and tablet). `list`: the
   *  three as equal rows down the side of web's reading pane (option B, 19
   *  Oct), the open one marked. */
  layout?: "front" | "list";
  /** `list` only: the read open beside the list. */
  current?: number;
  /** `list` only: whether she has opened a read, said under its publisher. */
  isRead?: (id: string) => boolean;
  headingLevel?: 2 | 3;
  /** Catalogue only: shows the lead in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

const place = (i: number) => ((i % 3) + 1) as 1 | 2 | 3;

/**
 * Briefing Concept 2's front page, after a news app (option A, chosen 11
 * October): the first read as the lead story with a big picture, the other
 * two as rows with a small one. Every story carries why it is here. There are
 * only ever three, all on the first screen; no topic tabs, no counts, no
 * times. Each story opens its read.
 *
 * On web the reading pane lists the three down its side instead (`list`).
 */
export function BriefingFront({ reads, onOpen, layout = "front", current, isRead, headingLevel = 2, demo, className }: BriefingFrontProps) {
  const Heading = `h${headingLevel}` as const;
  const [lead, ...rest] = reads;

  const byline = (read: BriefingRead) => (
    <span className="briefing-front2__pub">
      <span>{publisherName(read.publisherId)}</span>
      {isRead?.(read.id) ? <span className="briefing-front2__read">{C.read.readState}</span> : null}
    </span>
  );
  const why = (read: BriefingRead) => (
    <span className="briefing-front2__why">
      <span className="briefing-front2__why-label">{C.read.reasonLabel}: </span>
      {read.reason}
    </span>
  );

  if (layout === "list") {
    return (
      <ul className={["briefing-list", className].filter(Boolean).join(" ")}>
        {reads.map((read, i) => (
          <li key={read.id}>
            <article className={["briefing-list__item", i === current ? "is-current" : null, i === 0 && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}>
              <BriefingPicture place={place(i)} publisher={publisherName(read.publisherId)} size="thumb" />
              <span className="briefing-front2__text">
                {byline(read)}
                <Heading className="briefing-front2__headline">
                  <button type="button" className="briefing-front2__open" aria-current={i === current ? "true" : undefined} onClick={() => onOpen(i)}>
                    {read.title}
                  </button>
                </Heading>
                {why(read)}
              </span>
            </article>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={["briefing-front2", className].filter(Boolean).join(" ")}>
      <article className={["briefing-front2__lead", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}>
        <BriefingPicture place={1} publisher={publisherName(lead.publisherId)} size="lead" />
        {byline(lead)}
        <Heading className="briefing-front2__headline briefing-front2__headline--lead">
          <button type="button" className="briefing-front2__open" onClick={() => onOpen(0)}>
            {lead.title}
          </button>
        </Heading>
        {why(lead)}
      </article>
      <ul className="briefing-front2__rows">
        {rest.map((read, j) => (
          <li key={read.id}>
            <article className="briefing-front2__row">
              <span className="briefing-front2__text">
                {byline(read)}
                <Heading className="briefing-front2__headline">
                  <button type="button" className="briefing-front2__open" onClick={() => onOpen(j + 1)}>
                    {read.title}
                  </button>
                </Heading>
                {why(read)}
              </span>
              <BriefingPicture place={place(j + 1)} publisher={publisherName(read.publisherId)} size="thumb" />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BriefingFront;
