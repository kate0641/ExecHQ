"use client";

import { useId, useRef } from "react";
import { Input } from "@/components/form/Input";
import { MicButton } from "@/components/form/MicButton";
import type { PromptedDirection } from "@/mock/onboarding";

export interface DirectionFieldProps {
  label: string;
  /** Hides the label visually where the step's heading already asks the same
   *  question. The label stays in the accessibility tree — the field keeps its
   *  name, the outline just stops carrying the question twice. */
  labelHidden?: boolean;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  /** Selectable starting points. Choosing one fills the field and leaves it
   *  editable — it is a head start, not a choice between modes. */
  prompted?: readonly PromptedDirection[];
  promptedLabel?: string;
  /** Id of the prompt currently matching the field, if any. */
  selectedPromptId?: string | null;
  onSelectPrompt?: (prompt: PromptedDirection) => void;
  examples?: readonly string[];
  examplesLabel?: string;
  error?: string;
  /** Speak instead of type: puts a mic in the field's bottom edge, with a
   *  "Listening" line beside it while it is on. */
  voice?: { listening: boolean; onToggle: () => void };
  /** Moves focus into the field after a prompt is chosen, with the cursor at
   *  the end, so the next thing typed or said adds to it. */
  focusOnSelect?: boolean;
  /** `wrap` flows the prompts as pills; `stacked` puts one per row, all the
   *  same width and centred, for a short list. */
  promptLayout?: "wrap" | "stacked";
  className?: string;
}

/**
 * The career direction field.
 *
 * The one thing this component must not do is read as "fill in your job title".
 * Three deliberate choices work against that:
 *
 *  - the examples mix title-style and direction-style answers, so neither shape
 *    looks like the expected one;
 *  - the prompted directions include "I do not know yet" as a real, selectable
 *    answer rather than a way of declining to answer;
 *  - the open field comes first and the prompts sit under it, so the prompts
 *    read as a head start rather than as the menu of valid replies.
 *
 * The examples are wired to the field through `describedBy`, so they are part
 * of the field's description rather than text floating near it.
 */
export function DirectionField({
  label,
  labelHidden = false,
  hint,
  value,
  onChange,
  prompted,
  promptedLabel = "Or start from one of these",
  selectedPromptId,
  onSelectPrompt,
  examples,
  examplesLabel = "Answers that work here",
  error,
  voice,
  focusOnSelect = false,
  promptLayout = "wrap",
  className,
}: DirectionFieldProps) {
  const examplesId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  function select(prompt: PromptedDirection) {
    onSelectPrompt?.(prompt);
    if (!focusOnSelect) return;
    // After the value lands, so the cursor goes to the end of the new text.
    requestAnimationFrame(() => {
      const field = rootRef.current?.querySelector("textarea");
      if (!field) return;
      field.focus();
      field.setSelectionRange(field.value.length, field.value.length);
    });
  }

  // The status line is always rendered, so a change to it is announced; it
  // only has text while listening.
  const adornment = voice ? (
    <>
      <output className="direction-field__listening">
        {voice.listening ? (
          <>
            <span className="direction-field__bars" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            Listening…
          </>
        ) : null}
      </output>
      <MicButton listening={voice.listening} onToggle={voice.onToggle} />
    </>
  ) : undefined;

  return (
    <div
      ref={rootRef}
      className={[
        "direction-field",
        promptLayout === "stacked" ? "direction-field--stacked" : null,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Input
        label={label}
        labelHidden={labelHidden}
        hint={hint}
        error={error}
        multiline
        rows={3}
        required
        value={value}
        describedBy={examples?.length ? examplesId : undefined}
        adornment={adornment}
        onChange={(event) => onChange(event.target.value)}
      />

      {examples?.length ? (
        <div className="direction-field__examples" id={examplesId}>
          <p className="direction-field__examples-label">{examplesLabel}</p>
          <ul className="direction-field__examples-list">
            {examples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {prompted?.length ? (
        <div className="direction-field__prompts">
          <p className="direction-field__prompts-label" id={`${examplesId}-prompts`}>
            {promptedLabel}
          </p>
          <ul
            className="direction-field__prompt-list"
            aria-labelledby={`${examplesId}-prompts`}
          >
            {prompted.map((prompt) => {
              const isSelected = selectedPromptId === prompt.id;
              return (
                <li key={prompt.id}>
                  <button
                    type="button"
                    className={[
                      "direction-field__prompt",
                      isSelected ? "is-selected" : null,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    // Not a radio: choosing one fills an editable field rather
                    // than setting a value, so pressed state would overstate it.
                    aria-pressed={isSelected}
                    onClick={() => select(prompt)}
                  >
                    {prompt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default DirectionField;
