import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";

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
  /** Reopens the step this turn answered. With the back button gone, this is
   *  how a mistake gets corrected: by editing the record rather than reversing
   *  out of it. */
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
}

/**
 * One turn in the conversational intake.
 *
 * Two voices, both down the left margin. ExecHQ speaks as plain editorial text
 * at full measure; the user's turns sit in a filled block carrying their name.
 * That is enough to tell at a glance what came from the program and what came
 * from you, without avatars, tails, alternating sides or timestamps — the
 * product strategy is explicit that a chat window is what a short prompt to any
 * LLM already gives you, and the full messaging costume would promise exactly
 * that. Keeping every turn at full width also matters practically: the plan and
 * the draft are long, and a right-hand column cannot hold them.
 *
 * `past` marks a turn that has been answered. The attribution and the spent
 * controls step back; the words do not. The thread is the record, and a record
 * you cannot read is not one.
 */
export function ThreadTurn({
  speaker,
  heading,
  headingLevel = 2,
  headingId,
  description,
  children,
  past = false,
  onEdit,
  editLabel = "Change",
  className,
}: ThreadTurnProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <div
      className={["turn", `turn--${speaker}`, past ? "is-past" : null, className]
        .filter(Boolean)
        .join(" ")}
    >
      {speaker === "you" ? (
        <div className="turn__head">
          <p className="turn__attribution">You</p>
          {onEdit ? (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              {editLabel}
            </Button>
          ) : null}
        </div>
      ) : null}

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
