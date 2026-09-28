"use client";

import { useState } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { StoryText } from "@/components/onboarding/StoryText";

export interface StoryDraftProps {
  /** Small label above the draft, e.g. "First draft". */
  label: string;
  /** The draft as written from what the user has told us. */
  text: string;
  /** The user's own version, when they have edited it. Wins over `text`. */
  edited?: string;
  onSaveEdit: (text: string) => void;
  /** Told when editing starts and stops, so a page can hold its own action. */
  onEditingChange?: (editing: boolean) => void;
  /** A line under the draft saying where part of it came from, e.g. a
   *  connected LinkedIn. */
  note?: string;
  /** Where it could be used, as a short list under the draft. */
  usesLabel: string;
  uses: readonly string[];
  /** Opens in a state, for the catalogue: the editor, or the editor after
   *  saving an empty version. */
  preview?: "editing" | "error";
  className?: string;
}

const EMPTY_ERROR = "Your version is empty. Write something, or cancel to keep the draft.";

/**
 * The story's first draft: one paragraph, editable in place, with a few ideas
 * for where to use it.
 *
 * It replaces the Positioning Builder's four outputs in onboarding, by
 * decision on 2026-09-28. The draft is written before anything is asked, so it
 * has no gaps to fill: it says only what the user has told us, and sharpening
 * adds sentences rather than filling blanks. The four outputs stay in
 * StoryOutputs, for the full builder.
 */
export function StoryDraft({
  label,
  text,
  edited,
  onSaveEdit,
  onEditingChange,
  note,
  usesLabel,
  uses,
  preview,
  className,
}: StoryDraftProps) {
  const shown = edited ?? text;
  const [editing, setEditingState] = useState(Boolean(preview));
  const [draft, setDraft] = useState(preview === "error" ? "" : shown);
  const [error, setError] = useState<string | undefined>(
    preview === "error" ? EMPTY_ERROR : undefined
  );

  function setEditing(next: boolean) {
    setEditingState(next);
    setError(undefined);
    onEditingChange?.(next);
  }

  return (
    <div className={["story-draft", className].filter(Boolean).join(" ")}>
      <div className="story-draft__card">
        <p className="story-draft__label">{label}</p>
        {editing ? (
          <div className="builder-output__edit">
            <Input
              label="Your version"
              labelHidden
              multiline
              rows={6}
              value={draft}
              error={error}
              onChange={(event) => {
                setDraft(event.target.value);
                if (event.target.value.trim()) setError(undefined);
              }}
            />
            <div className="builder-output__edit-actions">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  if (!draft.trim()) {
                    setError(EMPTY_ERROR);
                    return;
                  }
                  onSaveEdit(draft.trim());
                  setEditing(false);
                }}
              >
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <StoryText segments={[{ text: shown }]} />
            {note ? <p className="story-draft__note">{note}</p> : null}
            <div className="builder-output__tools">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDraft(shown);
                  setEditing(true);
                }}
              >
                Edit
              </Button>
            </div>
          </>
        )}
      </div>

      {uses.length ? (
        <section className="story-draft__uses" aria-label={usesLabel}>
          <p className="builder-next__label">{usesLabel}</p>
          <ul>
            {uses.map((use) => (
              <li key={use}>{use}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export default StoryDraft;
