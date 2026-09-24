"use client";

export interface QuickReply {
  label: string;
  /** Quieter styling, for a way past the question rather than an answer. */
  quiet?: boolean;
  /** For a pick-several question: a toggle, shown pressed while chosen. */
  pressed?: boolean;
}

export interface QuickRepliesProps {
  /** Names the set for assistive technology, e.g. the question. */
  label: string;
  replies: readonly QuickReply[];
  onChoose: (label: string) => void;
  className?: string;
}

/**
 * Tap-to-answer chips above the composer, in one row that scrolls sideways,
 * by decision on 2026-09-24. Choosing one sends it as the user's message.
 * They sit before the composer in the reading order, so a keyboard user
 * reaches them with Shift+Tab from the field they are typing in; a focused
 * chip scrolls itself into view.
 */
export function QuickReplies({ label, replies, onChoose, className }: QuickRepliesProps) {
  if (!replies.length) return null;
  return (
    <ul className={["quick-replies", className].filter(Boolean).join(" ")} aria-label={label}>
      {replies.map((reply) => (
        <li key={reply.label}>
          <button
            type="button"
            className={["quick-replies__chip", reply.quiet ? "is-quiet" : null].filter(Boolean).join(" ")}
            aria-pressed={reply.pressed}
            onClick={() => onChoose(reply.label)}
          >
            {reply.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default QuickReplies;
