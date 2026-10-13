"use client";

import { Suspense, useMemo, useState } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { ProgressStepper } from "@/components/navigation/ProgressStepper";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useStepNav } from "@/lib/step-nav";
import { useViewport } from "@/lib/viewport-context";
import { FLOW_COPY as C, INPUT_COPY, STEP_BAR_COPY, STEP_LABELS, VERSION_COPY } from "@/mock/toolbox";
import { QuestionStep } from "../QuestionStep";
import { draftSteps, focusSoon, questionStep, TOOL_TITLE_ID, useToolFlow } from "../useToolFlow";

const STEP_HEADING = "tool-step-heading";

function GuidedSteps() {
  const f = useToolFlow("concept-1");
  const phone = useViewport().viewport === "mobile";
  // -1 is the use case; 0..asked.length-1 the questions; asked.length the last screen.
  const [at, setAt] = useState(-1);
  const [error, setError] = useState<string>();
  const [sheet, setSheet] = useState<"revise" | "versions" | null>(null);
  // Once it is ready the page is a clean read (option A, 13 Oct); "Change
  // something" brings the working draft back until she says she is done.
  const [changing, setChanging] = useState(false);

  // The use case screen asks the tool's first question beside its button, so
  // the steps after it leave that one out.
  const asked = f.notFirst(f.asked);
  const rest = f.notFirst(f.rest);
  const hasKnown = rest.some((input) => input.source && input.kind !== "choice");
  const hasDraft = Boolean(f.draft && f.version);

  // The step bar: Start, each question, the last screen, then the draft on.
  const stepKey = `${f.kind}|${asked.map((i) => i.id).join(",")}|${hasKnown}`;
  const steps = useMemo(
    () => [
      { id: "start", label: STEP_BAR_COPY.start },
      ...asked.map((input) => questionStep(f.kind, input)),
      { id: "last", label: hasKnown ? STEP_BAR_COPY.check : STEP_BAR_COPY.anythingElse },
      ...draftSteps(f.kind, true),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the key names everything the steps are made from
    [stepKey]
  );
  const firstQuestions = f.firstChoice ? [f.firstChoice] : [];
  const current = hasDraft
    ? sheet ?? f.stage
    : at < 0
      ? "start"
      : at < asked.length
        ? `q-${asked[at].id}`
        : "last";
  const jumpTo = (id: string) => {
    setError(undefined);
    if (id === "start") {
      f.jumpBefore([], [...firstQuestions, ...asked, ...rest]);
      setSheet(null);
      setAt(-1);
    } else if (id.startsWith("q-") || id === "last") {
      const k = id === "last" ? asked.length : asked.findIndex((input) => `q-${input.id}` === id);
      f.jumpBefore([...firstQuestions, ...asked.slice(0, k)], [...asked.slice(k), ...rest.filter((input) => input.optional)]);
      setSheet(null);
      setAt(k);
    } else {
      f.jumpAfter(id === "ready" || id === "used" ? id : "draft");
      setSheet(id === "revise" || id === "versions" ? id : null);
    }
  };
  useStepNav(steps, current, jumpTo);

  // Her stepper (13 Oct): the first question, each question asked, the last
  // screen, then the draft. Done steps go back while she is building; once
  // there is a draft it only says where she is, so going back never undoes it.
  const stepper = (
    <ProgressStepper
      label={C.progress}
      steps={[
        { id: "start", label: (f.firstChoice && STEP_LABELS[f.kind][f.firstChoice.id]) || STEP_BAR_COPY.start },
        ...asked.map((input) => ({ ...questionStep(f.kind, input), error: Boolean(error) && current === `q-${input.id}` })),
        { id: "last", label: hasKnown ? STEP_BAR_COPY.check : STEP_BAR_COPY.anythingElse },
        { id: "draft", label: STEP_BAR_COPY.draft },
      ]}
      current={hasDraft ? "draft" : current}
      onSelect={hasDraft ? undefined : jumpTo}
      labels={phone ? "none" : "all"}
      className="tool-flow__stepper"
    />
  );

  if (f.later) return f.laterNote;

  if (f.draft && f.version) {
    const clean = f.isReady && !changing;
    return (
      <div className="tool-flow tool-flow--guided tool-flow--has-bar">
        {f.header}
        {clean ? null : stepper}
        {f.outcome}
        {f.source}
        {clean ? f.draftAs("clean", () => setChanging(true)) : f.draftEditor}
        {clean ? null : (
          <button type="button" className="tool-flow__versions-link" onClick={() => setSheet("versions")}>
            <Icon name="clock" size={16} />
            {C.versions} · {VERSION_COPY.count(f.draft.versions.length)}
          </button>
        )}
        {/* The fixed bar (13 Oct). A draft: Revise or Mark ready. Ready: one
            button across the row, "I've used this" (sent, published); Copy
            and the downloads are in the draft's Actions menu. Changing a
            ready draft: Revise or Done. Used: no bar. */}
        {changing && f.isReady ? (
          <div className="tool-flow__fixed tool-flow__fixed--pair">
            <Button variant="secondary" onClick={() => setSheet("revise")}>
              {C.revise}
            </Button>
            <Button onClick={() => setChanging(false)}>{C.doneChanging}</Button>
          </div>
        ) : f.stage === "used" ? null : (
          <div className="tool-flow__fixed tool-flow__fixed--pair">
            {f.stage === "draft" ? (
              <Button variant="secondary" onClick={() => setSheet("revise")}>
                {C.revise}
              </Button>
            ) : null}
            {f.useBar({ noNotes: true, copyInMenu: true })}
          </div>
        )}
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

  const go = (next: number) => {
    setError(undefined);
    setAt(next);
    focusSoon(next < 0 ? TOOL_TITLE_ID : STEP_HEADING);
  };

  if (at < 0) {
    return (
      <div className="tool-flow tool-flow--guided">
        {f.header}
        {stepper}
        {/* Tapping an answer to the first question is the start (13 Oct);
            nothing here sends her elsewhere, so "Goes with this" is left out. */}
        {f.useCase({ onStart: () => go(0), choiceStarts: true, noGoesWith: true })}
      </div>
    );
  }

  const back = (
    <Button variant="ghost" onClick={() => go(at - 1)}>
      {C.previous}
    </Button>
  );

  if (at < asked.length) {
    const input = asked[at];
    return (
      <div className="tool-flow tool-flow--guided tool-flow--pinned">
        {f.header}
        {stepper}
        <QuestionStep
          input={input}
          value={f.valueOf(input.id)}
          onChange={(v) => {
            setError(undefined);
            f.setValue(input.id, v);
          }}
          error={error}
          headingId={STEP_HEADING}
        />
        {/* Next is pinned to the foot of the screen, in the thumb zone. */}
        <div className="tool-flow__step-actions tool-flow__step-actions--pinned">
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
    <div className="tool-flow tool-flow--guided tool-flow--pinned">
      {f.header}
      {stepper}
      {/* "Check what ExecHQ has" only when there is something it has to show
          (a fact from her plan, profile or onboarding); otherwise only the
          optional questions are left. */}
      <StepHeader
        title={hasKnown ? C.knownStep : C.lastStep}
        id={STEP_HEADING}
      />
      {/* One instruction line, compact rows for what ExecHQ has, and Write
          my first draft pinned to the foot with Back, like Next (13 Oct). */}
      {f.inputPanel(rest, { compact: true, footer: back, actionsClassName: "tool-flow__step-actions--pinned" })}
    </div>
  );
}

/**
 * Toolbox flow, Concept 1 — Guided steps. Each thing only she can answer is
 * its own screen, under a stepper with Next pinned to the foot; what ExecHQ already knows waits on the
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
