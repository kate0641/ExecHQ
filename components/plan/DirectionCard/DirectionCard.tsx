"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { DIRECTION_COPY as C } from "@/mock/plan";

export interface DirectionCardProps {
  /** Her direction, in her own words. */
  direction: string;
  /** She changed it, so the card says it is hers now. */
  edited?: boolean;
  /** Saves what she wrote. Her plan does not change with it. */
  onSave: (direction: string) => void;
  /** Catalogue only. */
  demoEditing?: boolean;
  demoSaved?: boolean;
  demoError?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * Where she says she is headed, in her own words, at the top of the Plan. She can
 * change it at any time. Changing it never changes her plan on its own: saving
 * says so, and points to Change plan if what she wrote now points somewhere new.
 */
export function DirectionCard({
  direction,
  edited,
  onSave,
  demoEditing,
  demoSaved,
  demoError,
  headingId = "plan-direction",
  className,
}: DirectionCardProps) {
  const [editing, setEditing] = useState(Boolean(demoEditing));
  const [draft, setDraft] = useState(direction);
  const [saved, setSaved] = useState(Boolean(demoSaved));
  const [tried, setTried] = useState(Boolean(demoError));
  const empty = !draft.trim();
  const form = useRef<HTMLFormElement>(null);

  // Opening the editor puts the keyboard in it.
  useEffect(() => {
    if (editing && !demoEditing) form.current?.querySelector("textarea")?.focus({ preventScroll: true });
  }, [editing, demoEditing]);

  function save() {
    setTried(true);
    if (empty) return;
    const changed = draft.trim() !== direction;
    onSave(draft.trim());
    setSaved(changed);
    setEditing(false);
    setTried(false);
  }

  return (
    <section className={["direction", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="direction__top">
        <h2 className="direction__heading" id={headingId}>
          {C.heading}
        </h2>
        {editing ? null : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDraft(direction);
              setSaved(false);
              setEditing(true);
            }}
          >
            <Icon name="pencil" size={14} />
            {C.editLabel}
          </Button>
        )}
      </div>

      {editing ? (
        <form
          ref={form}
          className="direction__form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <Input
            label={C.fieldLabel}
            multiline
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            hint={C.fieldHint}
            error={tried && empty ? C.errorEmpty : undefined}
          />
          <div className="direction__actions">
            <Button type="submit" variant="primary" size="sm">
              {C.save}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditing(false);
                setTried(false);
              }}
            >
              {C.cancel}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <p className="direction__text">{direction}</p>
          {saved ? (
            <output className="direction__note">
              <b>{C.saved}</b> {C.mayChange}
            </output>
          ) : (
            <p className="direction__note">{edited ? C.edited : C.fromOnboarding}</p>
          )}
        </>
      )}
    </section>
  );
}

export default DirectionCard;
