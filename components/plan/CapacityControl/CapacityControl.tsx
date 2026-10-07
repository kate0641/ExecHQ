"use client";

import { useId } from "react";
import { Switch } from "@/components/form/Switch";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { CAPACITY_COPY as C, CAPACITY_LEVELS, type CapacityLevel } from "@/mock/plan";

export interface CapacityControlProps {
  level: CapacityLevel;
  hold: boolean;
  /** How many steps are live now, said under the control. */
  live: number;
  onLevel: (level: CapacityLevel) => void;
  onHold: (hold: boolean) => void;
  className?: string;
}

/**
 * How much she can take on right now: light, steady or full, which is three,
 * four or five live steps, never more than five. "Hold my workload" means the
 * plan offers nothing new until she lifts it. It is her own setting, kept
 * between visits, and neither choice is ever counted against her.
 */
export function CapacityControl({ level, hold, live, onLevel, onHold, className }: CapacityControlProps) {
  const holdId = useId();
  return (
    <section className={["capacity", className].filter(Boolean).join(" ")} aria-label={C.heading}>
      <h3 className="capacity__heading">{C.heading}</h3>
      <ToggleGroup
        label={C.levelLabel}
        labelHidden
        shape="pill"
        size="sm"
        options={CAPACITY_LEVELS.map((l) => ({ value: l.id, label: `${l.label} · ${l.steps}` }))}
        value={level}
        onChange={(v) => onLevel(v === "light" || v === "full" ? v : "steady")}
      />
      <div className="capacity__hold">
        <Switch checked={hold} onChange={onHold} aria-labelledby={holdId} />
        <p id={holdId}>{C.hold}</p>
      </div>
      <p className="capacity__live">
        {C.live(live)}. {C.atMost}
      </p>
    </section>
  );
}

export default CapacityControl;
