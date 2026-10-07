"use client";

import { useState, type FormEvent } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { ANSWER_COPY } from "@/mock/plan";

const C = ANSWER_COPY.question;

export interface QuestionSheetProps {
  open: boolean;
  onClose: () => void;
  /** What it asks, and the answers on offer. */
  prompt: string;
  options: readonly string[];
  /** The answer: a chosen option or her own words. */
  onSave: (answer: string) => void;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  /** Catalogue only: opens with an option chosen. */
  demoPick?: string;
}

/**
 * One question from her plan, answered in a sheet: a few answers to pick from
 * and a line for her own words. Optional all the way down: she can leave it,
 * and nothing is counted against her. A saved answer is a completed action in
 * Momentum and goes into what she has told her plan.
 */
export function QuestionSheet({ open, onClose, prompt, options, onSave, inline, demoPick }: QuestionSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} label={prompt} inline={inline}>
      <QuestionForm onClose={onClose} onSave={onSave} prompt={prompt} options={options} demoPick={demoPick} />
    </Sheet>
  );
}

function QuestionForm({ onClose, onSave, prompt, options, demoPick }: Omit<QuestionSheetProps, "open" | "inline">) {
  const [pick, setPick] = useState<string[]>(demoPick ? [demoPick] : []);
  const [other, setOther] = useState("");
  const answer = other.trim() || pick[0] || "";

  function submit(event: FormEvent) {
    event.preventDefault();
    if (answer) onSave(answer);
  }

  return (
    <form className="answer-form" onSubmit={submit} noValidate>
      <h2 className="answer-form__title">{prompt}</h2>
      <ChipGroup
        label={C.pickLabel}
        note={C.pickNote}
        options={options}
        value={other.trim() ? [] : pick}
        onChange={(next) => {
          setPick(next);
          if (next.length) setOther("");
        }}
        equalWidth
      />
      <Input
        label={C.otherLabel}
        hint={C.otherHint}
        value={other}
        onChange={(event) => {
          setOther(event.target.value);
          if (event.target.value) setPick([]);
        }}
      />
      <div className="answer-form__actions">
        <Button type="submit" variant="primary" disabled={!answer}>
          {C.save}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {C.notNow}
        </Button>
      </div>
    </form>
  );
}

export default QuestionSheet;
