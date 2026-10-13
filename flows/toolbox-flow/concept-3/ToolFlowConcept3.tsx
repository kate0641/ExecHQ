"use client";

import { Suspense, useMemo, useState } from "react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/primitives/Button";
import { PinnedDraft } from "@/components/toolbox/PinnedDraft";
import { useStepNav } from "@/lib/step-nav";
import { useViewport } from "@/lib/viewport-context";
import { DRAFT_COPY, FLOW_COPY as C, INPUT_COPY, STEP_BAR_COPY } from "@/mock/toolbox";
import { QuestionStep } from "../QuestionStep";
import { draftSteps, focusSoon, questionStep, TOOL_TITLE_ID, useToolFlow } from "../useToolFlow";

const STEP_HEADING = "tool-step-heading";

function Interview() {
  const f = useToolFlow("concept-3");
  const web = useViewport().viewport === "web";
  // -1 is the start screen (the use case); 0..asked.length-1 the questions; asked.length the last screen.
  const [at, setAt] = useState(-1);
  const [error, setError] = useState<string>();
  const [expanded, setExpanded] = useState(false);

  const hasDraft = Boolean(f.draft && f.version);
  // The start screen asks the tool's first question beside its button, as in
  // Concept 1, so the interview leaves that one out.
  const asked = f.notFirst(f.asked);
  const rest = f.notFirst(f.rest);
  const hasKnown = rest.some((input) => input.source && input.kind !== "choice");
  const firstQuestions = f.firstChoice ? [f.firstChoice] : [];

  // The step bar: the start, each question, the last screen, then the draft
  // on. Here the versions sit under the changes, so they are not a step of
  // their own; the draft is the card opened, Revise the interview beside it.
  const stepKey = `${f.kind}|${asked.map((i) => i.id).join(",")}|${hasKnown}`;
  const steps = useMemo(
    () => [
      { id: "start", label: STEP_BAR_COPY.start },
      ...asked.map((input) => questionStep(f.kind, input)),
      { id: "last", label: hasKnown ? STEP_BAR_COPY.check : STEP_BAR_COPY.anythingElse },
      ...draftSteps(f.kind, false),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the key names everything the steps are made from
    [stepKey]
  );
  const current = hasDraft
    ? f.stage !== "draft"
      ? f.stage
      : expanded
        ? "draft"
        : "revise"
    : at < 0
      ? "start"
      : at < asked.length
        ? `q-${asked[at].id}`
        : "last";
  useStepNav(steps, current, (id) => {
    setError(undefined);
    if (id === "start") {
      f.jumpBefore([], [...firstQuestions, ...asked, ...rest]);
      setAt(-1);
      setExpanded(false);
      return;
    }
    if (id.startsWith("q-") || id === "last") {
      const k = id === "last" ? asked.length : asked.findIndex((input) => `q-${input.id}` === id);
      f.jumpBefore([...firstQuestions, ...asked.slice(0, k)], [...asked.slice(k), ...rest.filter((input) => input.optional)]);
      setAt(k);
      setExpanded(false);
      return;
    }
    f.jumpAfter(id === "ready" || id === "used" ? id : "draft");
    setExpanded(id !== "revise");
  });

  if (f.later) return f.laterNote;

  const go = (next: number) => {
    setError(undefined);
    setAt(next);
    focusSoon(next < 0 ? TOOL_TITLE_ID : STEP_HEADING);
  };

  // The start screen: what it makes, when to use it, what she'll need, how it
  // connects to her plan, and what it goes with, as in Concepts 1 and 2.
  if (!hasDraft && at < 0) {
    return (
      <div className="tool-flow tool-flow--interview">
        {f.header}
        {f.moment ? <p className="tool-flow__moment">{C.momentLine(f.moment)}</p> : null}
        {f.useCase({ onStart: () => go(0) })}
      </div>
    );
  }

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
        {f.outcome}
        {f.revision(() => setExpanded(true))}
        {f.useBar()}
        {f.versions}
      </div>
    );
  } else if (at < asked.length) {
    const input = asked[at];
    interview = (
      <div className="tool-flow__interview">
        {at === 0 ? f.source : null}
        <QuestionStep
          input={input}
          value={f.valueOf(input.id)}
          onChange={(v) => {
            setError(undefined);
            f.setValue(input.id, v);
          }}
          error={error}
          eyebrow={`${f.tool.name} · ${C.step(at + 1, asked.length + 1)}`}
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
          <Button variant="ghost" onClick={() => go(at - 1)}>
            {C.previous}
          </Button>
        </div>
      </div>
    );
  } else {
    interview = (
      <div className="tool-flow__interview">
        <StepHeader eyebrow={`${f.tool.name} · ${C.step(asked.length + 1, asked.length + 1)}`} title={hasKnown ? C.knownStep : C.lastStep} id={STEP_HEADING} />
        {f.inputPanel(rest, {
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

  // On a phone the open draft hides the interview, so what she does next
  // with the draft comes with it: what came of it, Mark ready or used, and
  // a way to change it.
  const underDraft =
    hasDraft && expanded && !web ? (
      <div className="tool-flow__under-draft">
        {f.outcome}
        {f.useBar()}
        <Button variant="secondary" fullWidth onClick={() => setExpanded(false)}>
          {C.changeDraft}
        </Button>
      </div>
    ) : null;

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
          {underDraft}
          {expanded ? null : interview}
        </>
      )}
    </div>
  );
}

/**
 * Toolbox flow, Concept 3 — Interview. A start screen with the use case, as
 * in Concepts 1 and 2, then one question a screen, with the draft
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
