"use client";

import { useEffect, useRef, useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import type { LoopDate } from "@/lib/loop";
import { CHANGE_COPY as C, DECLINE_REASONS, type DeclineReason } from "@/mock/plan";

export type ChangeScreen = "choose" | "edit" | "replace";

export interface StepChangePanelProps {
  /** The step, so she knows which one she is editing. */
  title: string;
  today: LoopDate;
  /** The day the step is on her calendar, where the date field starts. */
  date?: LoopDate;
  /** How long we think it takes, and what we say counts as done: where those fields start. */
  effortText: string;
  done: string;
  /** She saved changes to the step. Every field is optional. */
  onEdit: (change: { date?: LoopDate; effort?: string; done?: string; note?: string }) => void;
  /** She wants a different step. A reason and her own words are optional. */
  onReplace: (reason?: DeclineReason, note?: string) => void;
  /** She changed her mind and keeps the step as it is. */
  onClose: () => void;
  /** Catalogue only: opens on this screen. */
  demoScreen?: ChangeScreen;
  /** Catalogue only: a reason already chosen and her own words already written. */
  demoFilled?: boolean;
  className?: string;
}

/**
 * What takes over a step's card when she taps "Edit": first what she wants to do,
 * edit this step or ask for a different one, then a few plain questions for that
 * choice and a free-type box for her own words.
 *
 * She can edit when it happens, how long it will take her, and what counts as done.
 * The outcome, the plan area and the reasons are ExecHQ's reading of her situation,
 * so they are not editable here: if they are wrong, "ask for a different step" is how
 * she says so. Every question is optional, nothing asks "are you sure?", and nothing
 * counts against her. It is a secondary path: the card's main button is the one that
 * takes her into the Toolbox.
 */
export function StepChangePanel({
  title,
  today,
  date,
  effortText,
  done,
  onEdit,
  onReplace,
  onClose,
  demoScreen,
  demoFilled,
  className,
}: StepChangePanelProps) {
  const [screen, setScreen] = useState<ChangeScreen>(demoScreen ?? "choose");
  const [dayOn, setDayOn] = useState<string>(date ?? "");
  const [howLong, setHowLong] = useState<string[]>(C.howLongOptions.includes(effortText as never) ? [effortText] : []);
  const [doneText, setDoneText] = useState(done);
  const [reason, setReason] = useState<string[]>(demoFilled ? ["Too much effort"] : []);
  const [note, setNote] = useState(demoFilled ? "I can do this in the Toolbox, but I do not have an hour before Thursday." : "");
  const root = useRef<HTMLDivElement>(null);

  // Each screen puts the keyboard at its start.
  useEffect(() => {
    if (!demoScreen) root.current?.querySelector<HTMLElement>("h3")?.focus();
  }, [screen, demoScreen]);

  const reasonId = DECLINE_REASONS.find((r) => r.label === reason[0])?.id;
  const text = note.trim() || undefined;

  return (
    <div className={["step-change", className].filter(Boolean).join(" ")} ref={root}>
      <div className="step-change__head">
        <h3 className="step-change__title" tabIndex={-1}>
          {C.title}
        </h3>
        <p className="step-change__step">{title}</p>
      </div>

      {screen === "choose" ? (
        <>
          <p className="step-change__question">{C.question}</p>
          <ul className="step-change__options">
            {(["edit", "replace"] as const).map((id) => (
              <li key={id}>
                <button type="button" className="step-change__option" onClick={() => setScreen(id)}>
                  <span className="step-change__option-label">{C.options[id].label}</span>
                  <span className="step-change__option-hint">{C.options[id].hint}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="step-card__textlink" onClick={onClose}>
            {C.keep}
          </button>
        </>
      ) : null}

      {screen === "edit" ? (
        <>
          <Input
            label={C.editWhen}
            hint={C.editWhenHint}
            type="date"
            min={today}
            value={dayOn}
            onChange={(event) => setDayOn(event.target.value)}
          />
          <ChipGroup label={C.editHowLong} note={C.editHowLongHint} options={C.howLongOptions} value={howLong} onChange={setHowLong} />
          <Input
            label={C.editDone}
            hint={C.editDoneHint}
            multiline
            rows={2}
            value={doneText}
            onChange={(event) => setDoneText(event.target.value)}
          />
          <Input
            label={C.editNote}
            hint={C.editNoteHint}
            multiline
            rows={2}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <div className="step-change__actions">
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                onEdit({
                  date: dayOn && dayOn >= today ? dayOn : undefined,
                  effort: howLong[0] && howLong[0] !== effortText ? howLong[0] : undefined,
                  done: doneText.trim() && doneText.trim() !== done ? doneText.trim() : undefined,
                  note: text,
                })
              }
            >
              {C.editSubmit}
            </Button>
            <button type="button" className="step-card__textlink" onClick={() => setScreen("choose")}>
              {C.back}
            </button>
          </div>
        </>
      ) : null}

      {screen === "replace" ? (
        <>
          <ChipGroup
            label={C.replaceReason}
            note={C.replaceReasonHint}
            options={DECLINE_REASONS.map((r) => r.label)}
            value={reason}
            onChange={setReason}
          />
          <Input
            label={C.replaceNote}
            hint={C.replaceNoteHint}
            multiline
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <div className="step-change__actions">
            <Button variant="primary" size="sm" onClick={() => onReplace(reasonId, text)}>
              {C.replaceSubmit}
            </Button>
            <button type="button" className="step-card__textlink" onClick={() => setScreen("choose")}>
              {C.back}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default StepChangePanel;
