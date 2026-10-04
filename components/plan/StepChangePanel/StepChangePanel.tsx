"use client";

import { useEffect, useRef, useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { addDays, type LoopDate } from "@/lib/loop";
import { CHANGE_COPY as C, DECLINE_REASONS, SCOPE_OPTIONS, type DeclineReason } from "@/mock/plan";

export type ChangeScreen = "choose" | "decline" | "later" | "change";

export interface StepChangePanelProps {
  /** The step, so she knows which one she is changing. */
  title: string;
  today: LoopDate;
  /** The day the step is on her calendar, where the date field starts. */
  date?: LoopDate;
  /** She does not want it. A reason and her own words are optional. */
  onDecline: (reason?: DeclineReason, note?: string) => void;
  onDefer: (returnsOn: LoopDate, note?: string) => void;
  onEdit: (change: { date?: LoopDate; scope?: "lighter" | "as-is"; note?: string }) => void;
  /** She changed her mind and keeps the step as it is. */
  onClose: () => void;
  /** Catalogue only: opens on this screen. */
  demoScreen?: ChangeScreen;
  /** Catalogue only: a reason already chosen and her own words already written. */
  demoFilled?: boolean;
  className?: string;
}

/**
 * What takes over a step's card when she taps "Change this step": first what she
 * wants to do (not for me, later, or change the timing or how much), then a few
 * plain questions for that choice and a free-type box for her reasons. Every
 * question is optional apart from the day for "later", and nothing asks "are you
 * sure?" or counts against her. It is a secondary path: the card's main button is
 * the one that takes her into the Toolbox.
 */
export function StepChangePanel({ title, today, date, onDecline, onDefer, onEdit, onClose, demoScreen, demoFilled, className }: StepChangePanelProps) {
  const [screen, setScreen] = useState<ChangeScreen>(demoScreen ?? "choose");
  const [reason, setReason] = useState<string[]>(demoFilled ? ["Too much effort"] : []);
  const [note, setNote] = useState(demoFilled ? "I can do this in the Toolbox, but I do not have an hour before Thursday." : "");
  const [laterOn, setLaterOn] = useState<string>(addDays(today, 7));
  const [dayOn, setDayOn] = useState<string>(date ?? "");
  const [scope, setScope] = useState<string[]>([]);
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
            {(["decline", "later", "change"] as const).map((id) => (
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

      {screen === "decline" ? (
        <>
          <ChipGroup
            label={C.declineReason}
            note={C.declineReasonHint}
            options={DECLINE_REASONS.map((r) => r.label)}
            value={reason}
            onChange={setReason}
          />
          <Input
            label={C.declineNote}
            hint={C.declineNoteHint}
            multiline
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <div className="step-change__actions">
            <Button variant="primary" size="sm" onClick={() => onDecline(reasonId, text)}>
              {C.declineSubmit}
            </Button>
            <button type="button" className="step-card__textlink" onClick={() => setScreen("choose")}>
              {C.back}
            </button>
          </div>
        </>
      ) : null}

      {screen === "later" ? (
        <>
          <Input
            label={C.laterWhen}
            hint={C.laterWhenHint}
            type="date"
            min={addDays(today, 1)}
            value={laterOn}
            onChange={(event) => setLaterOn(event.target.value)}
          />
          <Input
            label={C.laterNote}
            hint={C.laterNoteHint}
            multiline
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <div className="step-change__actions">
            <Button variant="primary" size="sm" disabled={laterOn <= today} onClick={() => onDefer(laterOn, text)}>
              {C.laterSubmit}
            </Button>
            <button type="button" className="step-card__textlink" onClick={() => setScreen("choose")}>
              {C.back}
            </button>
          </div>
        </>
      ) : null}

      {screen === "change" ? (
        <>
          <Input
            label={C.changeWhen}
            hint={C.changeWhenHint}
            type="date"
            min={today}
            value={dayOn}
            onChange={(event) => setDayOn(event.target.value)}
          />
          <ChipGroup label={C.changeScope} options={Object.values(SCOPE_OPTIONS)} value={scope} onChange={setScope} />
          <Input
            label={C.changeNote}
            hint={C.changeNoteHint}
            multiline
            rows={3}
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
                  scope: scope[0] === SCOPE_OPTIONS.lighter ? "lighter" : "as-is",
                  note: text,
                })
              }
            >
              {C.changeSubmit}
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
