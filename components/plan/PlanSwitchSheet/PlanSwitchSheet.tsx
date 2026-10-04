"use client";

import { useState } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { Button } from "@/components/primitives/Button";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import { ROADMAP_COPY as C } from "@/mock/plan";

export interface PlanSwitchSheetProps {
  open: boolean;
  onClose: () => void;
  /** The plan she is on now. It cannot be chosen again. */
  currentPlanId: string;
  /** She chose another plan and confirmed. */
  onSwitch: (planId: string) => void;
  /** Render in place instead of over the device screen. For the catalogue. */
  inline?: boolean;
  /** Catalogue only: opens on the confirmation for this plan. */
  demoPicked?: string;
}

/**
 * Where she changes plan: the other plans, then what carries over before she
 * confirms. Everything she made, every Loop record and everything on her Signal
 * Picture stays; her next steps are chosen again; the plan she leaves stays in
 * her history. Changing plan is here but quiet, never the way in.
 */
export function PlanSwitchSheet({ open, onClose, currentPlanId, onSwitch, inline, demoPicked }: PlanSwitchSheetProps) {
  const [picked, setPicked] = useState<string | null>(demoPicked ?? null);
  const name = PLAN_TEMPLATES.find((p) => p.id === picked)?.name ?? "";
  const close = () => {
    setPicked(null);
    onClose();
  };
  return (
    <Sheet open={open} onClose={close} label={C.switchTitle} inline={inline}>
      <div className="roadmap__switch">
        <h2 className="roadmap__switch-title">{C.switchTitle}</h2>
        {picked === null ? (
          <>
            <p className="roadmap__switch-intro">{C.switchIntro}</p>
            <ul className="roadmap__plans">
              {PLAN_TEMPLATES.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="roadmap__plan-option"
                    disabled={p.id === currentPlanId}
                    onClick={() => setPicked(p.id)}
                  >
                    <span className="roadmap__plan-name">{p.name}</span>
                    <span className="roadmap__plan-for">{p.bestFor}</span>
                    {p.id === currentPlanId ? <span className="roadmap__plan-current">{C.current}</span> : null}
                  </button>
                </li>
              ))}
            </ul>
            <p className="roadmap__switch-intro">{C.customPlan}</p>
            <Button variant="ghost" onClick={close}>
              {C.close}
            </Button>
          </>
        ) : (
          <>
            <p className="roadmap__switch-intro">
              <b>{name}</b>
            </p>
            <ul className="roadmap__carry">
              {C.carriesOver.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="roadmap__advance-actions">
              <Button
                variant="primary"
                onClick={() => {
                  onSwitch(picked);
                  setPicked(null);
                }}
              >
                {C.switchTo(name)}
              </Button>
              <Button variant="ghost" onClick={() => setPicked(null)}>
                {C.back}
              </Button>
            </div>
          </>
        )}
      </div>
    </Sheet>
  );
}

export default PlanSwitchSheet;
