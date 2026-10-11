import Link from "next/link";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { TOOL_ICONS } from "@/components/toolbox/ToolPicker/ToolPicker";
import { editedWords, type LibraryItem } from "@/lib/library";
import { LIBRARY_COPY as C } from "@/mock/toolbox";

export interface LibraryRowProps {
  item: LibraryItem;
  today: string;
  /** Opens the artifact straight into its draft. */
  href: string;
  /** Opens its actions: reuse, update status, export, close, delete. */
  onMore: () => void;
  /** Closes it, from the suggestion an outcome brings. */
  onClose?: () => void;
  /** Her onboarding statement: where building it out opens. */
  buildOutHref?: string;
  /** Leaves the plan area off where the list is already grouped by it. */
  hideArea?: boolean;
  headingLevel?: 3 | 4;
  /** Catalogue only: shows the title link in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * One artifact in the library: its title, tool, Loop status (the same
 * component the Plan and homepage use), when it last changed, the step or
 * Briefing read it came from, and how many versions it has. Counts of real
 * things only, never a score.
 *
 * Her onboarding statement carries an invitation to build it out. Once an
 * outcome is logged, the row suggests closing it; she confirms.
 */
export function LibraryRow({ item, today, href, onMore, onClose, buildOutHref, hideArea = false, headingLevel = 3, demo, className }: LibraryRowProps) {
  const Heading = `h${headingLevel}` as const;
  const { record } = item;
  return (
    <article className={["library-row", record.state === "closed" ? "is-closed" : null, className].filter(Boolean).join(" ")} aria-label={record.title}>
      <div className="library-row__top">
        <span className="library-row__tool">
          <Icon name={TOOL_ICONS[record.kind]} size={14} />
          {item.tool}
        </span>
        <LoopStatus record={record} />
      </div>
      <Heading className="library-row__title">
        <Link href={href} className={["library-row__open", demo ? `is-${demo}` : null].filter(Boolean).join(" ")}>
          {record.title}
        </Link>
      </Heading>
      {item.preview ? <p className="library-row__preview">{item.preview}</p> : null}
      <p className="library-row__meta">
        <span>{C.edited(editedWords(item, today))}</span>
        <span aria-hidden="true">·</span>
        <span>{C.versions(item.versions)}</span>
        {!hideArea && item.areaName ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{item.areaName}</span>
          </>
        ) : null}
      </p>
      {item.readId ? (
        <p className="library-row__link">
          <Icon name="briefing" size={14} />
          {C.fromRead}
        </p>
      ) : item.step ? (
        <p className="library-row__link">
          <Icon name="compass" size={14} />
          {C.forStep(item.step)}
        </p>
      ) : null}

      {item.fromOnboarding && buildOutHref && record.state !== "closed" ? (
        <div className="library-row__invite">
          <p className="library-row__invite-text">{C.statementInvite}</p>
          <Link href={buildOutHref} className="btn btn--secondary btn--sm">
            {C.statementAction}
          </Link>
        </div>
      ) : null}

      {record.state === "outcome" && onClose ? (
        <div className="library-row__suggest">
          <p className="library-row__suggest-text">{C.closeSuggest}</p>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {C.actions.close}
            <span className="u-visually-hidden"> {record.title}</span>
          </Button>
        </div>
      ) : null}

      <Button variant="ghost" size="sm" className="library-row__more" onClick={onMore} aria-label={C.actions.more(record.title)}>
        <Icon name="menu" size={16} />
      </Button>
    </article>
  );
}

export default LibraryRow;
