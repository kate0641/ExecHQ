import type { ReactNode } from "react";

export type TurnSpeaker = "advisor" | "you";

export interface ThreadTurnProps {
  speaker: TurnSpeaker;
  /** The question or statement this turn makes. Becomes the turn's heading. */
  heading?: string;
  headingLevel?: 2 | 3;
  /** Id on the heading, so an input below can be labelled by the question that
   *  asked for it. */
  headingId?: string;
  /** One supporting sentence under the heading. */
  description?: string;
  children?: ReactNode;
  /** A turn that has been answered and is now part of the record. */
  past?: boolean;
  className?: string;
}

/**
 * One turn in the conversational intake.
 *
 * Deliberately not a chat bubble. No avatars, no tails, no alternating sides,
 * no timestamps — the product strategy is explicit that a chat window is what a
 * short prompt to any LLM already gives you, and the visual language of
 * messaging would promise exactly that. What this is instead is a transcript:
 * the advisor's turns are set as plain editorial text at full measure, and the
 * user's turns are indented against a rule, the way a quoted answer is set in a
 * document.
 *
 * `past` marks a turn that has been answered. It stays fully legible rather
 * than being faded out — the thread is the record, and a record you cannot read
 * is not one.
 */
export function ThreadTurn({
  speaker,
  heading,
  headingLevel = 2,
  headingId,
  description,
  children,
  past = false,
  className,
}: ThreadTurnProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div
      className={["turn", `turn--${speaker}`, past ? "is-past" : null, className]
        .filter(Boolean)
        .join(" ")}
    >
      {speaker === "you" ? <p className="turn__attribution">You</p> : null}

      {heading ? (
        <Heading className="turn__heading" id={headingId}>
          {heading}
        </Heading>
      ) : null}

      {description ? <p className="turn__description">{description}</p> : null}

      {children ? <div className="turn__body">{children}</div> : null}
    </div>
  );
}

export default ThreadTurn;
