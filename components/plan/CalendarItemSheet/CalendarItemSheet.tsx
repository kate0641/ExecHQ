"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import type { LoopDate } from "@/lib/loop";
import { stageAt, type StageWindow } from "@/lib/roadmap-dates";
import { ITEM_COPY as C } from "@/mock/plan";

export interface ItemValues {
  title: string;
  date: LoopDate;
  note?: string;
}

export interface CalendarItemSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: ItemValues) => void;
  /** The roadmap's windows, so the sheet can say which stage a day falls in. */
  windows: StageWindow[];
  /** Fills the form: the day she tapped, or what she is editing. */
  initial?: Partial<ItemValues>;
  editing?: boolean;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  /** Catalogue only: shows the errors a static page cannot reach. */
  demoErrors?: boolean;
}

/**
 * How she adds something to her own calendar, or changes it: what it is, when,
 * and an optional note. It says which stage the day falls in, so she sees where
 * it sits on the roadmap, and a day outside every window is allowed. She adds
 * everything by hand; nothing syncs from another calendar.
 */
export function CalendarItemSheet({ open, onClose, onSave, windows, initial, editing, inline, demoErrors }: CalendarItemSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} label={editing ? C.editTitle : C.title} inline={inline}>
      <ItemForm onClose={onClose} onSave={onSave} windows={windows} initial={initial} editing={editing} demoErrors={demoErrors} />
    </Sheet>
  );
}

function ItemForm({ onClose, onSave, windows, initial, editing, demoErrors }: Omit<CalendarItemSheetProps, "open" | "inline">) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState<string>(demoErrors ? "" : (initial?.date ?? ""));
  const [note, setNote] = useState(initial?.note ?? "");
  const [tried, setTried] = useState(Boolean(demoErrors));

  const errors = { title: title.trim() ? undefined : C.errorWhat, date: date ? undefined : C.errorWhen };
  const stage = date ? stageAt(windows, date) : -1;

  function submit(event: FormEvent) {
    event.preventDefault();
    setTried(true);
    if (errors.title || errors.date) return;
    onSave({ title: title.trim(), date, note: note.trim() || undefined });
  }

  return (
    <form className="entry-form" onSubmit={submit} noValidate>
      <h2 className="entry-form__title">{editing ? C.editTitle : C.title}</h2>
      <Input
        label={C.whatLabel}
        placeholder={C.whatPlaceholder}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        error={tried ? errors.title : undefined}
        autoComplete="off"
      />
      <Input
        label={C.whenLabel}
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        error={tried ? errors.date : undefined}
        hint={date ? (stage >= 0 ? C.inStage(stage + 1, windows[stage].title) : C.outsideStage) : undefined}
      />
      <Input label={C.noteLabel} hint={C.noteHint} value={note} onChange={(event) => setNote(event.target.value)} autoComplete="off" />
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

export default CalendarItemSheet;
