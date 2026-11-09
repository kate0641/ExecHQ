import Link from "next/link";
import { useId } from "react";
import { PLAN_DIRECTION_COPY as C } from "@/mock/plan";

export interface PlanDirectionProps {
  /** Her direction, in her own words. */
  direction: string;
  /** She changed it since onboarding. */
  edited?: boolean;
  /** Why she has this plan, tied to what she said in onboarding ("You said …, so this plan starts with …"). */
  why?: string;
  /** Where "Change your direction" goes: the onboarding questions again. Without it the card only reads. */
  editHref?: string;
  className?: string;
}

/**
 * Her direction, above the road it leads to: "Your direction" as a grey eyebrow, then her words in
<<<<<<< HEAD
 * full in the serif, in the system's white card. It only reads: with no text
 * ever cut short there was nothing for an accordion to open, so the chevron and the button went.
 * Changing her direction stays in the plan sheet.
=======
 * full in the serif, in the system's white card. Under a hairline, why she has this plan, as a quiet
 * paragraph that explains itself ("You said …"), and Change your direction, a text link (9 Nov: in place
 * of the plan sheet See your plan opened). What changing it means is said on the edit flow's first page.
>>>>>>> origin/main
 */
export function PlanDirection({ direction, edited, why, editHref, className }: PlanDirectionProps) {
  const labelId = useId();
  return (
    <section className={["plan-direction", className].filter(Boolean).join(" ")} aria-labelledby={labelId}>
      <h2 className="plan-direction__label" id={labelId}>
        {C.label}
      </h2>
      <q className="plan-direction__quote">{direction}</q>
      {edited ? <p className="plan-direction__edited">{C.edited}</p> : null}
      {why || editHref ? (
        <div className="plan-direction__foot">
          {why ? <p className="plan-direction__why">{why}</p> : null}
          {editHref ? (
            <Link href={editHref} className="link link--standalone plan-direction__change">
              {C.change}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default PlanDirection;
