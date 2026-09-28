"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/primitives/Button";
import type { OutcomeType } from "@/lib/loop";
import { OUTCOME_OPTIONS } from "@/mock/loop";

export interface OutcomeAnswer {
  type: OutcomeType;
  /** What happened, in the user's words. Empty if they left it. */
  detail: string;
}

export interface OutcomeCaptureProps {
  onSubmit: (answer: OutcomeAnswer) => void;
  /** The group's legend. */
  legend?: string;
  detailLabel?: string;
  detailHint?: string;
  submitLabel?: string;
  /** Said beside the button, so "Nothing yet" reads as a normal answer. */
  reassurance?: string;
  /** Starts with this chosen. For the catalogue, and for going back. */
  defaultType?: OutcomeType;
  defaultDetail?: string;
  /** Catalogue only: shows the message for saving with nothing chosen. */
  showError?: boolean;
  /** Catalogue only: shows one answer in a state a static page can't reach. */
  demo?: { type: OutcomeType; state: "hover" | "focus" | "active" };
  className?: string;
}

/**
 * What happened: the five outcome types from the spec as one choice, an
 * optional note, and Save. Works inline, inside FollowUpCard.
 *
 * Save is always there to press. With nothing chosen it says so beside the
 * question rather than being greyed out, so the user is told what's missing
 * instead of left guessing why the button won't work.
 */
export function OutcomeCapture({
  onSubmit,
  legend = "What happened",
  detailLabel = "Anything to add?",
  detailHint = "Optional. Only you can see this.",
  submitLabel = "Save",
  reassurance = "“Nothing yet” is a normal answer.",
  defaultType,
  defaultDetail = "",
  showError = false,
  demo,
  className,
}: OutcomeCaptureProps) {
  const id = useId();
  const [type, setType] = useState<OutcomeType | undefined>(defaultType);
  const [detail, setDetail] = useState(defaultDetail);
  const [missing, setMissing] = useState(showError);
  const errorId = `${id}-error`;

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!type) {
      setMissing(true);
      return;
    }
    onSubmit({ type, detail: detail.trim() });
  }

  return (
    <form className={["outcome-capture", className].filter(Boolean).join(" ")} onSubmit={submit} noValidate>
      <fieldset
        className="outcome-capture__choices"
        aria-describedby={missing ? errorId : undefined}
        aria-invalid={missing || undefined}
      >
        <legend className="outcome-capture__legend">{legend}</legend>
        {missing ? (
          <p className="outcome-capture__error" id={errorId}>
            Choose what happened first.
          </p>
        ) : null}
        <div className="outcome-capture__options">
          {OUTCOME_OPTIONS.map((option) => {
            const forced = demo?.type === option.type ? `is-${demo.state}` : null;
            return (
              <label
                key={option.type}
                htmlFor={`${id}-${option.type}`}
                className={["outcome-capture__option", forced].filter(Boolean).join(" ")}
              >
                <input
                  type="radio"
                  id={`${id}-${option.type}`}
                  aria-labelledby={`${id}-${option.type}-label`}
                  name={`${id}-type`}
                  value={option.type}
                  checked={type === option.type}
                  onChange={() => {
                    setType(option.type);
                    setMissing(false);
                  }}
                />
                <span id={`${id}-${option.type}-label`}>{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="outcome-capture__detail">
        <label htmlFor={`${id}-detail`} id={`${id}-detail-label`}>
          {detailLabel}
        </label>
        <span className="outcome-capture__hint" id={`${id}-detail-hint`}>
          {detailHint}
        </span>
        <textarea
          id={`${id}-detail`}
          aria-labelledby={`${id}-detail-label`}
          aria-describedby={`${id}-detail-hint`}
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          rows={2}
        />
      </div>
      <div className="outcome-capture__submit">
        <Button type="submit" fullWidth>
          {submitLabel}
        </Button>
        <p className="outcome-capture__reassure">{reassurance}</p>
      </div>
    </form>
  );
}

export default OutcomeCapture;
