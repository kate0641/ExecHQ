"use client";

import { useState, type FormEvent } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { ANSWER_COPY } from "@/mock/plan";

const C = ANSWER_COPY.reflection;

export interface ReflectionValues {
  /** What moved, as she chose from what she did. */
  things: string[];
  /** The one she says came to something, and what came of it. */
  linkText?: string;
  came?: string;
  block?: string;
}

export interface ReflectionSheetProps {
  open: boolean;
  onClose: () => void;
  /** What she did this week, in words, to choose from. */
  things: readonly string[];
  onSave: (values: ReflectionValues) => void;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  /** Catalogue only: opens with things chosen and words written. */
  demo?: { picks?: string[]; link?: string; came?: string; block?: string };
}

/**
 * This week's reflection, written in a sheet: what moved (chosen from what she
 * did, so she does not have to recall it), what came of anything (joins her
 * record next to the thing it followed), and what is in the way (kept for her
 * advisor, never shown back unasked). Every part is optional. It comes round
 * at most once a week and never shows as missed.
 */
export function ReflectionSheet({ open, onClose, things, onSave, inline, demo }: ReflectionSheetProps) {
  return (
    <Sheet open={open} onClose={onClose} label={C.title} inline={inline}>
      <ReflectionForm onClose={onClose} onSave={onSave} things={things} demo={demo} />
    </Sheet>
  );
}

function ReflectionForm({ onClose, onSave, things, demo }: Omit<ReflectionSheetProps, "open" | "inline">) {
  const [picks, setPicks] = useState<string[]>(demo?.picks ?? []);
  const [link, setLink] = useState<string[]>(demo?.link ? [demo.link] : []);
  const [came, setCame] = useState(demo?.came ?? "");
  const [block, setBlock] = useState(demo?.block ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave({
      things: picks,
      linkText: link[0] && came.trim() ? link[0] : undefined,
      came: came.trim() || undefined,
      block: block.trim() || undefined,
    });
  }

  return (
    <form className="answer-form" onSubmit={submit} noValidate>
      <h2 className="answer-form__title">{C.title}</h2>
      <p className="answer-form__intro">{C.intro}</p>
      {things.length ? (
        <ChipGroup
          label={C.movedLabel}
          note={C.movedNote}
          options={things}
          value={picks}
          max={things.length}
          onChange={(next) => {
            setPicks(next);
            setLink((l) => l.filter((x) => next.includes(x)));
          }}
          equalWidth
        />
      ) : (
        <p className="answer-form__intro">{C.nothingThisWeek}</p>
      )}
      {picks.length ? <ChipGroup label={C.cameLabel} options={picks} value={link} onChange={setLink} equalWidth /> : null}
      <Input label={C.cameField} hint={C.cameHint} multiline rows={3} value={came} onChange={(event) => setCame(event.target.value)} />
      <Input label={C.blockField} hint={C.blockHint} value={block} onChange={(event) => setBlock(event.target.value)} />
      <div className="answer-form__actions">
        <Button type="submit" variant="primary">
          {C.save}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {C.notNow}
        </Button>
      </div>
    </form>
  );
}

export default ReflectionSheet;
