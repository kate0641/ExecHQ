"use client";

import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { StepHeader } from "@/components/onboarding/StepHeader";
import type { ToolInput } from "@/mock/toolbox";

/**
 * One question on its own screen (Concepts 1 and 3): the question is the
 * heading, so the field's own label is hidden rather than said twice.
 */
export function QuestionStep({
  input,
  value,
  onChange,
  error,
  eyebrow,
  headingId,
  headingLevel = 1,
}: {
  input: ToolInput;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  eyebrow?: string;
  headingId: string;
  headingLevel?: 1 | 2;
}) {
  return (
    <div className="question-step">
      <StepHeader eyebrow={eyebrow} title={input.label} description={input.hint} id={headingId} headingLevel={headingLevel} />
      {input.kind === "choice" ? (
        <ChipGroup label={input.label} labelHidden options={input.options ?? []} value={value ? [value] : []} onChange={(next) => onChange(next[0] ?? "")} />
      ) : (
        <Input
          label={input.label}
          labelHidden
          placeholder={input.placeholder}
          value={value}
          type={input.kind === "date" ? "date" : undefined}
          multiline={input.kind === "long"}
          rows={4}
          error={error}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
