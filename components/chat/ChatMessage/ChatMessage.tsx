import type { ReactNode } from "react";
import { AdvisorMark } from "@/components/chat/AdvisorMark";

export interface ChatMessageProps {
  /** ExecHQ's words sit on the page; the user's sit right, in a bubble. */
  from: "advisor" | "you";
  children?: ReactNode;
  /** Starts a run of ExecHQ's messages: shows the mark and the name above.
   *  The rest of the run follows without them. */
  lead?: boolean;
  /** A wider message for a read-back, a plan or a story. */
  card?: boolean;
  /** Shows ExecHQ is writing: three dots in place of the words. */
  typing?: boolean;
  /** Lets the user change what they said. The conversation carries on from
   *  there. Only on the user's own messages. */
  onEdit?: () => void;
  editLabel?: string;
  /** The name shown beside the mark. */
  advisorName?: string;
  className?: string;
}

/**
 * One message in the conversation.
 *
 * ExecHQ's messages are uncontained, by decision on 2026-09-24: its words sit
 * directly on the page at full width, like an advisor writing to you, and the
 * mark and name appear once at the start of each run. The user's messages
 * stay as dark bubbles on the right, so who said what is never in doubt.
 *
 * The typing state is hidden from assistive technology: the thread is a live
 * log, so the message itself is announced when it arrives.
 */
export function ChatMessage({
  from,
  children,
  lead = false,
  card = false,
  typing = false,
  onEdit,
  editLabel = "Change this answer",
  advisorName = "ExecHQ",
  className,
}: ChatMessageProps) {
  const classes = [
    "chat-message",
    `chat-message--${from}`,
    lead ? "chat-message--lead" : null,
    card ? "chat-message--card" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const head =
    from === "advisor" && lead ? (
      <p className="chat-message__from" aria-hidden="true">
        <AdvisorMark size={20} />
        {advisorName}
      </p>
    ) : null;

  if (typing) {
    return (
      <div className={classes} aria-hidden="true">
        {head}
        <span className="chat-message__typing">
          <span />
          <span />
          <span />
        </span>
      </div>
    );
  }

  return (
    <div className={classes}>
      {head}
      <div className="chat-message__body">
        <span className="u-visually-hidden">{from === "advisor" ? `${advisorName}: ` : "You: "}</span>
        {children}
      </div>
      {onEdit ? (
        <button type="button" className="chat-message__edit" onClick={onEdit}>
          {editLabel}
        </button>
      ) : null}
    </div>
  );
}

export default ChatMessage;
