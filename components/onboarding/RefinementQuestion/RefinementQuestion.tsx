"use client";

import { ToggleGroup } from "@/components/form/ToggleGroup";
import type { RefinementQuestionSpec } from "@/mock/onboarding";

export interface RefinementQuestionProps {
  question: RefinementQuestionSpec;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * One refinement question.
 *
 * Every question is optional, so the control carries no required marker and no
 * validation: there is no wrong answer here and no answer at all is a valid
 * outcome. The skip path is not part of this component — it belongs to the
 * step's actions, where it sits at the same weight as the primary action.
 *
 * Options are stacked rather than in a row: the labels are sentences, and a
 * segmented row of sentences is unreadable at 390px.
 */
export function RefinementQuestion({
  question,
  value,
  onChange,
  className,
}: RefinementQuestionProps) {
  return (
    <div className={["refinement", className].filter(Boolean).join(" ")}>
      <p className="refinement__hint">{question.hint}</p>
      <ToggleGroup
        label={question.question}
        labelHidden
        orientation="vertical"
        options={question.options}
        value={value ?? ""}
        onChange={(next) => onChange?.(next)}
      />
    </div>
  );
}

export default RefinementQuestion;
