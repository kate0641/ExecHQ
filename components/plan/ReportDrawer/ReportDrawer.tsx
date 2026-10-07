"use client";

import { useState, type FormEvent } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Drawer } from "@/components/layout/Drawer";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { shortDate, type LoopDate, type OutcomeType } from "@/lib/loop";
import { OUTCOME_OPTIONS } from "@/mock/loop";
import { REPORT_COPY as C } from "@/mock/plan";

/** How it went, in the three answers that say what happened. "Nothing yet" and
 *  "no longer relevant" are not reports of what came of it. */
const TONES = OUTCOME_OPTIONS.filter((o) => o.type === "positive" || o.type === "neutral" || o.type === "negative");

export interface ReportValues {
  text: string;
  /** Only asked for something the Loop made, which has no outcome yet. */
  tone?: OutcomeType;
}

export interface ReportDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: ReportValues) => void;
  /** What she did, and the day, to say what she is reporting on. */
  did: string;
  on: LoopDate;
  /** Something the Loop made and she used, with no outcome logged: it also asks how it went. */
  asksTone?: boolean;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  /** Catalogue only: shows the errors a static page cannot reach. */
  demoErrors?: boolean;
}

/**
 * Where she says what came of something she did, opened from the "Nothing
 * reported yet" box on its row. Her words are kept as she wrote them and never
 * changed or scored. A thing she added herself takes her words; a thing the
 * Loop made also asks how it went, as the check-in does, so it is the same
 * answer by either route. A drawer, so the page stays beside it.
 */
export function ReportDrawer({ open, onClose, onSave, did, on, asksTone, inline, demoErrors }: ReportDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose} label={C.title} inline={inline}>
      <ReportForm onClose={onClose} onSave={onSave} did={did} on={on} asksTone={asksTone} demoErrors={demoErrors} />
    </Drawer>
  );
}

function ReportForm({ onClose, onSave, did, on, asksTone, demoErrors }: Omit<ReportDrawerProps, "open" | "inline">) {
  const [text, setText] = useState("");
  const [tone, setTone] = useState<OutcomeType | null>(null);
  const [tried, setTried] = useState(Boolean(demoErrors));
  const errors = {
    tone: asksTone && !tone ? C.errorTone : undefined,
    text: !text.trim() ? C.errorText : undefined,
  };

  function submit(event: FormEvent) {
    event.preventDefault();
    setTried(true);
    if (errors.tone || errors.text) return;
    onSave({ text: text.trim(), ...(asksTone && tone ? { tone } : {}) });
  }

  return (
    <form className="report-drawer" onSubmit={submit} noValidate>
      <h2 className="report-drawer__title">{C.title}</h2>
      <p className="report-drawer__did">
        <span className="report-drawer__date">{shortDate(on)}</span> {did}
      </p>
      {asksTone ? (
        <div>
          <ChipGroup
            label={C.toneLabel}
            options={TONES.map((t) => t.label)}
            value={tone ? [TONES.find((t) => t.type === tone)!.label] : []}
            onChange={([label]) => setTone(TONES.find((t) => t.label === label)?.type ?? null)}
          />
          {tried && errors.tone ? (
            <p className="entry-form__error" role="alert">
              <Icon name="flag" size={14} /> {errors.tone}
            </p>
          ) : null}
        </div>
      ) : null}
      <Input
        label={C.textLabel}
        hint={C.textHint}
        multiline
        rows={3}
        value={text}
        onChange={(event) => setText(event.target.value)}
        error={tried ? errors.text : undefined}
      />
      <p className="entry-form__privacy">{C.privacy}</p>
      <div className="entry-form__actions">
        <Button type="submit" variant="primary">
          {C.save}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {C.cancel}
        </Button>
      </div>
    </form>
  );
}

export default ReportDrawer;
