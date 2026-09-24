"use client";

import { useId } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface AdvisorNoteProps {
  /** Who the note is from, and their role under the name. */
  from: string;
  role: string;
  /** The read-back itself. */
  body: string;
  /** A quieter line above the body, e.g. that an assumption was made. */
  aside?: string;
  /** The closing line: what happens next. */
  closing?: string;
  editing?: boolean;
  onEdit?: () => void;
  onChange?: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  editLabel?: string;
  className?: string;
}

/**
 * A note from your advisor: the read-back of what the user said, on a card,
 * signed by ExecHQ. The warmth is the point — it frames the product as
 * someone who listened — so the card is plain and the words do the work.
 *
 * "Change it" swaps the body for a field in place; nothing else on the card
 * moves, so the user edits the thing they were reading.
 */
export function AdvisorNote({
  from,
  role,
  body,
  aside,
  closing,
  editing = false,
  onEdit,
  onChange,
  onSave,
  onCancel,
  editLabel = "Change it",
  className,
}: AdvisorNoteProps) {
  const fromId = useId();

  return (
    <article
      className={["advisor-note", className].filter(Boolean).join(" ")}
      aria-labelledby={fromId}
    >
      <header className="advisor-note__from">
        <span className="advisor-note__avatar" aria-hidden="true">
          EH
        </span>
        <p className="advisor-note__who" id={fromId}>
          {from}
          <span className="advisor-note__role">{role}</span>
        </p>
      </header>

      {aside ? <p className="advisor-note__aside">{aside}</p> : null}

      {editing ? (
        <div className="advisor-note__edit">
          <Input
            label="What we heard"
            labelHidden
            multiline
            rows={6}
            value={body}
            onChange={(event) => onChange?.(event.target.value)}
          />
          <div className="advisor-note__edit-actions">
            <Button variant="primary" size="sm" onClick={onSave}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="advisor-note__body">{body}</p>
      )}

      {closing ? <p className="advisor-note__closing">{closing}</p> : null}

      {!editing && onEdit ? (
        <div className="advisor-note__change">
          <button type="button" className="advisor-note__change-button" onClick={onEdit}>
            <Icon name="pencil" size={14} />
            {editLabel}
          </button>
        </div>
      ) : null}
    </article>
  );
}

export default AdvisorNote;
