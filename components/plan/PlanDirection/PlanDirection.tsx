"use client";

import { useId, useState } from "react";
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
 * Her direction, above the road it leads to. "Your direction" with a chevron opens it like an
 * accordion, to her words quoted in a card. It starts closed, and opening it is remembered on her
 * device. The way into her whole plan sits beside the roadmap's heading, not here.
 */
export function PlanDirection({ direction, demoOpen, demoState, className }: PlanDirectionProps) {
  const stored = useDirectionOpen();
  // The catalogue's variants set it themselves and leave what her device remembers alone.
  const [demoOpenNow, setDemoOpenNow] = useState(demoOpen);
  const open = demoOpenNow ?? stored;
  const bodyId = useId();

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
          aria-controls={bodyId}
          onClick={toggle}
        >
          {C.label}
          <Icon name="chevron-down" size={16} />
        </button>
      </h2>
      <div className="plan-direction__card" id={bodyId} hidden={!open}>
        <p className="plan-direction__quote">
          <q>{direction}</q>
        </p>
      </div>
    </section>
  );
}

export default PlanDirection;
