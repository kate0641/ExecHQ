"use client";

import { useState } from "react";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import type { LoopDate } from "@/lib/loop";
import { timeChoices } from "@/lib/time-words";
import { PLAN_AGENDA_COPY as A } from "@/mock/plan";

export interface AddToPlanSheetProps {
  open: boolean;
  onClose: () => void;
  today: LoopDate;
  /** She added something of her own, to the day the words stand for. */
  onAdd: (item: { title: string; date: LoopDate; label: string }) => void;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
}

/**
 * Where she adds something of her own to her plan: what it is, and when, in words. A sheet that
 * slides up over the phone. The words stand for a day underneath, so it lands in the stage that day
 * falls in. Nothing is added until she has written what it is.
 */
export function AddToPlanSheet({ open, onClose, today, onAdd, inline }: AddToPlanSheetProps) {
  const choices = timeChoices(today);
  const [draft, setDraft] = useState("");
  const [when, setWhen] = useState(0);

  function submit() {
    const title = draft.trim();
    if (!title) return;
    const choice = choices[Math.min(when, choices.length - 1)];
    onAdd({ title, date: choice.date, label: choice.label });
    setDraft("");
    setWhen(0);
  }

  return (
    <Sheet open={open} onClose={onClose} label={A.addLabel} inline={inline}>
      <form
        className="agenda__add"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <h3 className="agenda__add-title">{A.addLabel}</h3>
        <Input label={A.addTitle} autoComplete="off" placeholder={A.addPlaceholder} value={draft} onChange={(event) => setDraft(event.target.value)} />
        <fieldset className="agenda__whens">
          <legend className="agenda__legend">{A.addWhen}</legend>
          {choices.map((c, i) => (
            <button key={c.bucket} type="button" className="agenda__chip" aria-pressed={when === i} onClick={() => setWhen(i)}>
              {c.label}
            </button>
          ))}
        </fieldset>
        <div className="agenda__actions">
          <Button type="submit" variant="primary" disabled={!draft.trim()}>
            {A.addSubmit}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            {A.addCancel}
          </Button>
        </div>
      </form>
    </Sheet>
  );
}

export default AddToPlanSheet;
