"use client";

import { useState } from "react";
import { Icon } from "@/components/primitives/Icon";
import { setDirectionOpen, useDirectionOpen } from "@/lib/direction-open";
import { PLAN_DIRECTION_COPY as C } from "@/mock/plan";

export interface PlanDirectionProps {
  /** Her direction, in her own words. */
  direction: string;
  /** Catalogue only: open or closed, ignoring what her device remembers. */
  demoOpen?: boolean;
  /** Catalogue only: shows the toggle's hover or focus. */
  demoState?: "hover" | "focus";
  className?: string;
}

/**
 * Her direction, above the road it leads to, as a soft row: "Your direction" small, then the first
 * line of her words in the serif, cut off, and a chevron. The whole row opens it like an accordion,
 * letting her words run in full. It starts closed, and opening it is remembered on her device. The way
 * into her whole plan sits beside the roadmap's heading, not here.
 */
export function PlanDirection({ direction, demoOpen, demoState, className }: PlanDirectionProps) {
  const stored = useDirectionOpen();
  // The catalogue's variants set it themselves and leave what her device remembers alone.
  const [demoOpenNow, setDemoOpenNow] = useState(demoOpen);
  const open = demoOpenNow ?? stored;

  function toggle() {
    if (demoOpenNow !== undefined) setDemoOpenNow(!open);
    else setDirectionOpen(!open);
  }

  return (
    <section className={["plan-direction", open ? "is-open" : null, className].filter(Boolean).join(" ")}>
      <h2 className="plan-direction__head">
        <button
          type="button"
          className={["plan-direction__toggle", demoState ? `is-${demoState}` : null].filter(Boolean).join(" ")}
          aria-expanded={open}
          onClick={toggle}
        >
          <span className="plan-direction__text">
            <span className="plan-direction__label">{C.label}</span>
            {/* So a screen reader says the label and her words apart. */}
            <span className="u-visually-hidden">: </span>
            <q className="plan-direction__quote">{direction}</q>
          </span>
          <Icon name="chevron-down" size={16} />
        </button>
      </h2>
    </section>
  );
}

export default PlanDirection;
