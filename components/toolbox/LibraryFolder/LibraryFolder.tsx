import { Icon } from "@/components/primitives/Icon";
import { TOOL_ICONS } from "@/components/toolbox/ToolPicker/ToolPicker";
import type { ArtifactKind } from "@/mock/loop";

export interface LibraryFolderProps {
  tool: ArtifactKind;
  /** "Pitches". */
  name: string;
  /** What is inside: "3 · 2 drafts · 1 waiting to hear". */
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
  /** The folder whose list is showing beside it (web). */
  current?: boolean;
  headingLevel?: 2 | 3;
  headingId?: string;
  /** Catalogue only: shows the folder in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * One of the library's folders: a folder per tool, filed by ExecHQ, never
 * made or moved by her. A plain card, no folder drawing (look D, 14 Oct): the
 * tool's icon in a disc tinted for the tool, then its name, so the tint is
 * never the only cue. It says how many it holds, what state they are in, and
 * when it last changed.
 */
export function LibraryFolder({
  tool,
  name,
  summary,
  date,
  dateLabel = "Last change",
  as = "button",
  onOpen,
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
  const body =
    as === "header" ? (
      <>
        {disc}
        <span className="library-folder__text">
          <span className="library-folder__name">{name}</span>
          <span className="library-folder__summary">{summary}</span>
        </span>
      </>
    ) : (
      <>
        {disc}
        <span className="library-folder__name">{name}</span>
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

  if (as === "header") {
    const Heading = `h${headingLevel}` as const;
    return (
      <Heading className={classes} id={headingId} tabIndex={-1}>
        {body}
      </Heading>
    );
  }
  return (
    <button type="button" className={classes} onClick={onOpen} aria-current={current || undefined}>
      {body}
    </button>
  );
}

export default LibraryFolder;
