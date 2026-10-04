"use client";

import { useState, type FormEvent } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import type { LoopDate } from "@/lib/loop";
import { ENTRY_COPY as C, ENTRY_TYPES, type EntryTypeId } from "@/mock/plan";

export interface EntryValues {
  type: EntryTypeId;
  /** The day it happened. */
  on: LoopDate;
  /** A link or a note, in her words. Optional. */
  text?: string;
}

export interface SignalEntrySheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: EntryValues) => void;
  /** Today, which is also the latest date she can give. */
  today: LoopDate;
  /** Fills the form when she is editing, or when it was offered after a
   *  piece was published. */
  initial?: Partial<EntryValues>;
  editing?: boolean;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  /** Catalogue only: shows the errors a static page cannot reach. */
  demoErrors?: boolean;
}

/**
 * The entry flow for something she did outside ExecHQ: three fields, the type,
 * the date, and an optional link or note. Nothing is searched for and nothing
 * leaves the browser. It opens fresh each time, and is offered at the moment it
 * is relevant, never kept as a standing form.
 */
export function SignalEntrySheet({ open, onClose, onSave, today, initial, editing, inline, demoErrors }: SignalEntrySheetProps) {
  return (
    <Sheet open={open} onClose={onClose} label={editing ? C.editTitle : C.title} inline={inline}>
      <EntryForm onClose={onClose} onSave={onSave} today={today} initial={initial} editing={editing} demoErrors={demoErrors} />
    </Sheet>
  );
}

function EntryForm({ onClose, onSave, today, initial, editing, demoErrors }: Omit<SignalEntrySheetProps, "open" | "inline">) {
  const [type, setType] = useState<EntryTypeId | null>(initial?.type ?? null);
  const [on, setOn] = useState<string>(initial?.on ?? (demoErrors ? "" : today));
  const [text, setText] = useState(initial?.text ?? "");
  const [tried, setTried] = useState(Boolean(demoErrors));

  const errors = {
    type: type ? undefined : C.errorType,
    on: !on ? C.errorDate : on > today ? C.errorFuture : undefined,
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    setTried(true);
    if (!type || errors.on) return;
    onSave({ type, on, text: text.trim() || undefined });
  }

  return (
    <form className="entry-form" onSubmit={submit} noValidate>
      <h2 className="entry-form__title">{editing ? C.editTitle : C.title}</h2>
      <div>
        <ChipGroup
          label={C.typeLabel}
          options={ENTRY_TYPES.map((t) => t.label)}
          value={type ? [ENTRY_TYPES.find((t) => t.id === type)!.label] : []}
          onChange={([label]) => setType(ENTRY_TYPES.find((t) => t.label === label)?.id ?? null)}
        />
        {tried && errors.type ? (
          <p className="entry-form__error" role="alert">
            <Icon name="flag" size={14} /> {errors.type}
          </p>
        ) : null}
      </div>
      <Input
        label={C.dateLabel}
        type="date"
        max={today}
        value={on}
        onChange={(event) => setOn(event.target.value)}
        error={tried ? errors.on : undefined}
      />
      <Input
        label={C.noteLabel}
        hint={C.noteHint}
        placeholder={C.notePlaceholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <p className="entry-form__privacy">{C.privacy}</p>
      <div className="entry-form__actions">
        <Button type="submit" variant="primary">
          {editing ? C.saveEdit : C.save}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {C.cancel}
        </Button>
      </div>
    </form>
  );
}

export default SignalEntrySheet;
