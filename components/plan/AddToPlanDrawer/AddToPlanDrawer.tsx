"use client";

import { useState } from "react";
import { Input } from "@/components/form/Input";
import { Drawer } from "@/components/layout/Drawer";
import { Button } from "@/components/primitives/Button";
import type { LoopDate } from "@/lib/loop";
import { timeChoices } from "@/lib/time-words";
import { PLAN_AGENDA_COPY as A } from "@/mock/plan";

export interface AddToPlanDrawerProps {
  open: boolean;
  onClose: () => void;
  today: LoopDate;
  /** She added something of her own, to the day the words stand for. */
  onAdd: (item: { title: string; date: LoopDate; label: string }) => void;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
}

/**
 * Where she adds something of her own to her plan: what it is, and when, in words. A drawer that
 * comes up from the foot of the phone, like every other add, with the plan left in view behind it. The words stand for a day underneath, so it lands in the stage that day
 * falls in. Nothing is added until she has written what it is.
 */
export function AddToPlanDrawer({ open, onClose, today, onAdd, inline }: AddToPlanDrawerProps) {
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
    <Drawer open={open} onClose={onClose} label={A.addLabel} inline={inline}>
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
            <button key={c.bucket} type="button" className="choice-pill agenda__chip" aria-pressed={when === i} onClick={() => setWhen(i)}>
              <span className="u-bold-hold" data-label={c.label}>{c.label}</span>
            </button>
          ))}
        </fieldset>
        {/* The main action full width; leaving is the underlined link under it. */}
        <div className="agenda__actions sheet-actions">
          <Button type="submit" variant="primary" fullWidth disabled={!draft.trim()}>
            {A.addSubmit}
          </Button>
          <button type="button" className="link link--standalone sheet-actions__out" onClick={onClose}>
            {A.addCancel}
          </button>
        </div>
      </form>
    </Drawer>
  );
}

export default AddToPlanDrawer;
