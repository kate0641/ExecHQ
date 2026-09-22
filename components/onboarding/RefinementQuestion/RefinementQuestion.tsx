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
 * The answers are chips rather than a segmented control or a stacked list: they
 * are short, and pills read as choices where a joined track reads as a form
 * field. It also reuses the language already on the direction screen, so the two
 * optional moments in the flow look related.
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
        shape="chips"
        options={question.options}
        value={value ?? ""}
        onChange={(next) => onChange?.(next)}
      />
    </div>
  );
}

export default RefinementQuestion;
