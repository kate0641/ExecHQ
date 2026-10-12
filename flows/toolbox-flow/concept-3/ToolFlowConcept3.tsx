"use client";

import { Suspense, useState } from "react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/primitives/Button";
import { PinnedDraft } from "@/components/toolbox/PinnedDraft";
import { useViewport } from "@/lib/viewport-context";
import { DRAFT_COPY, FLOW_COPY as C, INPUT_COPY } from "@/mock/toolbox";
import { QuestionStep } from "../QuestionStep";
import { focusSoon, useToolFlow } from "../useToolFlow";

const STEP_HEADING = "tool-step-heading";

function Interview() {
  const f = useToolFlow("concept-3");
  const web = useViewport().viewport === "web";
  const [at, setAt] = useState(0);
  const [error, setError] = useState<string>();
  const [expanded, setExpanded] = useState(false);

  if (f.later) return f.laterNote;

  const hasDraft = Boolean(f.draft && f.version);
  const go = (next: number) => {
    setError(undefined);
    setAt(next);
    focusSoon(STEP_HEADING);
  };

  // The draft fills in as she answers: her words in, ExecHQ's framing round them.
  const live = hasDraft || !f.answered ? undefined : f.livePreview();

  const pinned = (
    <PinnedDraft
      label={hasDraft && f.version ? DRAFT_COPY.label(f.version.n) : DRAFT_COPY.label(1)}
      preview={hasDraft && f.draft ? f.draft.meta.preview : live}
      expanded={expanded || (hasDraft && web)}
      onToggle={() => setExpanded(!expanded)}
      side={web}
    >
      {hasDraft ? f.draftEditor : live ? <p className="pinned-draft__live">{live}</p> : undefined}
    </PinnedDraft>
  );

  let interview;
  if (hasDraft) {
    interview = (
      <div className="tool-flow__interview">
        <StepHeader eyebrow={f.tool.name} title={f.record?.title ?? f.tool.name} id={STEP_HEADING} />
        {f.revision(() => setExpanded(true))}
        {f.useBar()}
        {f.versions}
      </div>
    );
  } else if (at < f.asked.length) {
    const input = f.asked[at];
    interview = (
      <div className="tool-flow__interview">
        {at === 0 ? (
          <>
            {f.moment ? <p className="tool-flow__moment">{C.momentLine(f.moment)}</p> : null}
            {f.source}
          </>
        ) : null}
        <QuestionStep
          input={input}
          value={f.valueOf(input.id)}
          onChange={(v) => {
            setError(undefined);
            f.setValue(input.id, v);
          }}
          error={error}
          eyebrow={`${f.tool.name} · ${C.step(at + 1, f.asked.length + 1)}`}
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
          {at > 0 ? (
            <Button variant="ghost" onClick={() => go(at - 1)}>
              {C.previous}
            </Button>
          ) : null}
        </div>
      </div>
    );
  } else {
    interview = (
      <div className="tool-flow__interview">
        <StepHeader eyebrow={`${f.tool.name} · ${C.step(f.asked.length + 1, f.asked.length + 1)}`} title={C.knownStep} id={STEP_HEADING} />
        {f.inputPanel(f.rest, {
          onSubmit: () => {
            f.write();
            setExpanded(true);
          },
        })}
        <div className="tool-flow__step-actions">
          <Button variant="ghost" onClick={() => go(at - 1)}>
            {C.previous}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={["tool-flow", "tool-flow--interview", web ? "tool-flow--split" : null].filter(Boolean).join(" ")}>
      {f.header}
      {web ? (
        <div className="tool-flow__columns">
          {interview}
          {pinned}
        </div>
      ) : (
        <>
          {pinned}
          {expanded ? null : interview}
        </>
      )}
    </div>
  );
}

/**
 * Toolbox flow, Concept 3 — Interview. One question a screen, with the draft
 * pinned above as a collapsed card that fills in as she answers and opens
 * with a tap. A phone can't hold both at once, so she switches between them;
 * on the web they sit side by side. Once written, the questions give way to
 * "Change the draft".
 */
export function ToolFlowConcept3() {
  return (
    <Suspense fallback={null}>
      <Interview />
    </Suspense>
  );
}

export default ToolFlowConcept3;
