import type { ReactNode } from "react";
import { Icon } from "@/components/primitives/Icon";
import { TOOL_ICONS } from "@/components/playbook/ToolPicker/ToolPicker";
import type { ArtifactKind } from "@/mock/loop";

export interface LibraryFolderProps {
  tool: ArtifactKind;
  /** "Pitches". */
  name: string;
  /** A folder: what is inside, "3 · 2 drafts · 1 waiting to hear". The
   *  open folder's heading: what the tool makes. */
  summary: string;
  /** When it last changed: "22 Oct". Left out when the folder is empty. */
  date?: string;
  /** Read before the date by screen readers. */
  dateLabel?: string;
  /**
   * - `button`: one of the folders; pressing it opens the folder.
   * - `header`: the open folder's heading, above its list.
   */
  as?: "button" | "header";
  onOpen?: () => void;
  /** `header` only: under the words, the way to make another (Start). */
  action?: ReactNode;
  /** The folder whose list is showing beside it (web). */
  current?: boolean;
  headingLevel?: 1 | 2 | 3;
  headingId?: string;
  /** Catalogue only: shows the folder in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * One of the library's folders: a folder per tool, filed by ExecHQ, never
 * made or moved by her. In the grid, a light blue card that deepens toward
 * its arrow, the tool's icon small in a navy circle beside its name
 * (designer, 2026-10-27). It says how many it holds, what state they are
 * in, and when it last changed.
 */
export function LibraryFolder({
  tool,
  name,
  summary,
  date,
  dateLabel = "Last change",
  as = "button",
  onOpen,
  action,
  current = false,
  headingLevel = 3,
  headingId,
  demo,
  className,
}: LibraryFolderProps) {
  const classes = [
    "library-folder",
    `library-folder--${tool}`,
    `library-folder--${as}`,
    current ? "is-current" : null,
    demo ? `is-${demo}` : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const disc = (
    <span className="library-folder__disc" aria-hidden="true">
      <Icon name={TOOL_ICONS[tool]} size={20} />
    </span>
  );
  // In the grid the icon is small, in a navy circle beside the name, so the
  // folders sit under the tools above them (designer, 2026-10-27).
  const body = (
    <>
      <span className="library-folder__title">
        <span className="library-folder__mark" aria-hidden="true">
          <Icon name={TOOL_ICONS[tool]} size={12} />
        </span>
        <span className="library-folder__name">{name}</span>
      </span>
        <span className="library-folder__summary">{summary}</span>
        <span className="library-folder__foot">
          <span className="library-folder__date">
            {date ? (
              <>
                <span className="u-visually-hidden">{dateLabel} </span>
                {date}
              </>
            ) : null}
          </span>
          <Icon name="chevron" size={16} className="library-folder__go" />
        </span>
      </>
    );

  // The open folder's card (option A, 14 Oct): the disc, the heading and
  // what the tool makes, and Start under them. Only the name is the heading.
  if (as === "header") {
    const Heading = `h${headingLevel}` as const;
    return (
      <div className={classes}>
        {disc}
        <div className="library-folder__text">
          <Heading className="library-folder__name" id={headingId} tabIndex={-1}>
            {name}
          </Heading>
          <p className="library-folder__summary">{summary}</p>
          {action ? <div className="library-folder__action">{action}</div> : null}
        </div>
      </div>
    );
  }
  return (
    <button type="button" className={classes} onClick={onOpen} aria-current={current || undefined}>
      {body}
    </button>
  );
}

export default LibraryFolder;
