import { useId } from "react";
import { PLAN_DIRECTION_COPY as C } from "@/mock/plan";

export interface PlanDirectionProps {
  /** Her direction, in her own words. */
  direction: string;
  className?: string;
}

/**
 * Her direction, above the road it leads to: "Your direction" as a grey eyebrow, then her words in
 * full in the serif, in the system's white card. It only reads (designer, 2026-10-13): with no text
 * ever cut short there was nothing for an accordion to open, so the chevron and the button went.
 * Changing her direction stays in the plan sheet.
 */
export function PlanDirection({ direction, className }: PlanDirectionProps) {
  const labelId = useId();
  return (
    <section className={["plan-direction", className].filter(Boolean).join(" ")} aria-labelledby={labelId}>
      <h2 className="plan-direction__label" id={labelId}>
        {C.label}
      </h2>
      <q className="plan-direction__quote">{direction}</q>
    </section>
  );
}

export default PlanDirection;
