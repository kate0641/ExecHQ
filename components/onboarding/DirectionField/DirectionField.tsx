"use client";

import { useId } from "react";
import { Input } from "@/components/form/Input";
import type { PromptedDirection } from "@/mock/onboarding";

export interface DirectionFieldProps {
  label: string;
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
  className,
}: DirectionFieldProps) {
  const examplesId = useId();

  return (
    <div className={["direction-field", className].filter(Boolean).join(" ")}>
      <Input
        label={label}
        hint={hint}
        error={error}
        multiline
        rows={3}
        required
        value={value}
        describedBy={examples?.length ? examplesId : undefined}
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
                    onClick={() => onSelectPrompt?.(prompt)}
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
