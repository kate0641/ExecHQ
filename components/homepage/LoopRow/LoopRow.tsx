import { LoopStatus } from "@/components/loop/LoopStatus";
import { Icon } from "@/components/primitives/Icon";
import type { LoopRecord } from "@/lib/loop";

export interface LoopRowProps {
  record: LoopRecord;
  /** What it's waiting on, in a line: "What came of it?", "I'll ask on Tuesday". */
  line: string;
  /** Given when the row needs the user: tapping opens it. Omitted, the row is
   *  a quiet line that only says where things stand. */
  onOpen?: () => void;
  /** Catalogue only: shows the button in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * One draft in "Stay on track" (Homepage Concept 2) that isn't the one open:
 * its title, where it stands, and what it's waiting on. A row that needs the
 * user is a button that opens it in place; one that's only waiting is quiet,
 * so she can see nothing has been forgotten.
 */
export function LoopRow({ record, line, onOpen, demo, className }: LoopRowProps) {
  const body = (
    <>
      <span className="loop-row__text">
        <b>{record.title}</b>
        <span>{line}</span>
      </span>
      <LoopStatus record={record} detail={false} />
      {onOpen ? <Icon name="chevron" size={16} className="loop-row__go" /> : null}
    </>
  );
  return onOpen ? (
    <button
      type="button"
      className={["loop-row", "loop-row--open", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}
      onClick={onOpen}
    >
      {body}
    </button>
  ) : (
    <div className={["loop-row", className].filter(Boolean).join(" ")}>{body}</div>
  );
}

export default LoopRow;
