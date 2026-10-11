"use client";

import { Suspense, useState } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { FLOW_COPY as C, INPUT_COPY, VERSION_COPY } from "@/mock/toolbox";
import { QuestionStep } from "../QuestionStep";
import { focusSoon, TOOL_TITLE_ID, useToolFlow } from "../useToolFlow";

const STEP_HEADING = "tool-step-heading";

function GuidedSteps() {
  const f = useToolFlow("concept-1");
  // -1 is the use case; 0..asked.length-1 the questions; asked.length the last screen.
  const [at, setAt] = useState(-1);
  const [error, setError] = useState<string>();
  const [sheet, setSheet] = useState<"revise" | "versions" | null>(null);

  if (f.later) return f.laterNote;

  if (f.draft && f.version) {
    return (
      <div className="tool-flow tool-flow--guided tool-flow--has-bar">
        {f.header}
        {f.source}
        {f.draftEditor}
        <button type="button" className="tool-flow__versions-link" onClick={() => setSheet("versions")}>
          <Icon name="clock" size={16} />
          {C.versions} · {VERSION_COPY.count(f.draft.versions.length)}
        </button>
        {/* The fixed bar: Revise, Copy, Mark ready, in the thumb zone. */}
        <div className="tool-flow__fixed">
          <Button variant="secondary" onClick={() => setSheet("revise")}>
            {C.revise}
          </Button>
          {f.useBar()}
        </div>
        <Sheet open={sheet !== null} onClose={() => setSheet(null)} label={sheet === "versions" ? C.versions : C.revise} className="toolbox-sheet">
          {sheet === "revise" ? (
            f.revision(() => setSheet(null))
          ) : sheet === "versions" ? (
            f.versions
          ) : null}
        </Sheet>
      </div>
    );
  }

  const total = f.asked.length + 1;
  const go = (next: number) => {
    setError(undefined);
    setAt(next);
    focusSoon(next < 0 ? TOOL_TITLE_ID : STEP_HEADING);
  };

  if (at < 0) {
    return (
      <div className="tool-flow tool-flow--guided">
        {f.header}
        {f.useCase}
        <Button fullWidth onClick={() => go(0)}>
          {f.tool.start}
        </Button>
      </div>
    );
  }

  const back = (
    <Button variant="ghost" onClick={() => go(at - 1)}>
      {C.previous}
    </Button>
  );

  if (at < f.asked.length) {
    const input = f.asked[at];
    return (
      <div className="tool-flow tool-flow--guided">
        {f.header}
        <QuestionStep
          input={input}
          value={f.valueOf(input.id)}
          onChange={(v) => {
            setError(undefined);
            f.setValue(input.id, v);
          }}
          error={error}
          eyebrow={C.step(at + 1, total)}
          headingId={STEP_HEADING}
        />
        <div className="tool-flow__step-actions">
          <Button
            fullWidth
            onClick={() => {
              if (!f.valueOf(input.id).trim()) {
                setError(INPUT_COPY.missing);
                return;
              }
              go(at + 1);
            }}
          >
            {C.next}
          </Button>
          {back}
        </div>
      </div>
    );
  }

  return (
    <div className="tool-flow tool-flow--guided">
      {f.header}
      <StepHeader eyebrow={C.step(total, total)} title={C.knownStep} id={STEP_HEADING} />
      {f.inputPanel(f.rest)}
      <div className="tool-flow__step-actions">{back}</div>
    </div>
  );
}

/**
 * Toolbox flow, Concept 1 — Guided steps. Each thing only she can answer is
 * its own screen, with "Step 2 of 3"; what ExecHQ already knows waits on the
 * last screen to check, with anything optional. The draft then opens full
 * screen, with Revise, Copy and Mark ready in a fixed bar at the foot.
 */
export function ToolFlowConcept1() {
  return (
    <Suspense fallback={null}>
      <GuidedSteps />
    </Suspense>
  );
}

export default ToolFlowConcept1;
