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
  // Once it is ready the draft is a clean read, as in Concept 1 (13 Oct);
  // "Change something" brings the working draft back until she is done.
  const [changing, setChanging] = useState(false);

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

  // The start screen sets the scene: what it makes, when to use it, what
  // she'll need, how it connects to her plan. As in Concept 1 (13 Oct): no
  // drawing, no "Goes with this", and tapping an answer to the first
  // question starts the interview.
  if (!hasDraft && at < 0) {
    return (
      <div className="tool-flow tool-flow--interview">
        {f.header}
        {f.moment ? <p className="tool-flow__moment">{C.momentLine(f.moment)}</p> : null}
        {f.useCase({ onStart: () => go(0), choiceStarts: true, noGoesWith: true, noPicture: true })}
      </div>
    );
  }
  const clean = hasDraft && f.isReady && !changing;
  const draftView = clean ? f.draftAs("clean", () => setChanging(true)) : f.draftEditor;

  // The draft fills in as she answers: her words in, ExecHQ's framing round them.
  const live = hasDraft || !f.answered ? undefined : f.livePreview();

  // The card waits until there is something to show (13 Oct): on a phone,
  // from her second answer; each answer shows where it lands as she types.
  const showCard = hasDraft || web || f.answeredCount >= 2;
  const pinned = showCard ? (
    <PinnedDraft
      label={hasDraft && f.version ? DRAFT_COPY.label(f.version.n) : C.soFar}
      // Collapsed, the draft so far as plain text; open, marked as the draft
      // is: her words apart from ExecHQ's wording.
      preview={hasDraft ? f.draftPreview() : live ? f.liveSoFar() : undefined}
      expanded={expanded || (hasDraft && web)}
      onToggle={() => setExpanded(!expanded)}
      side={web}
    >
      {hasDraft ? draftView : live ? <p className="pinned-draft__live">{f.liveDraft()}</p> : undefined}
    </PinnedDraft>
  ) : null;

  let interview;
  if (hasDraft) {
    interview = (
      <div className="tool-flow__interview">
        <StepHeader eyebrow={f.tool.name} title={f.record?.title ?? f.tool.name} id={STEP_HEADING} />
        {f.source}
        {f.outcome}
        {f.revision(() => setExpanded(true))}
        {f.useBar({ noNotes: true, copyInMenu: true, className: "draft-use--single" })}
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
          eyebrow={C.step(at + 1, asked.length + 1)}
          headingId={STEP_HEADING}
        />
        {/* Where her answer lands, as she types: the interview shows its work. */}
        {f.landsIn(input.id) ? (
          <div className="interview-lands" aria-live="polite">
            <span className="interview-lands__label">{C.landsIn}</span>
            <p className="interview-lands__text">{f.landsIn(input.id)}</p>
          </div>
        ) : null}
        {/* Next is pinned to the foot of the screen, as in Concept 1. */}
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
          <Button variant="ghost" onClick={() => go(at - 1)}>
            {C.previous}
          </Button>
        </div>
      </div>
    );
  } else {
    interview = (
      <div className="tool-flow__interview">
        <StepHeader eyebrow={C.step(asked.length + 1, asked.length + 1)} title={hasKnown ? C.knownStep : C.lastStep} id={STEP_HEADING} />
        {/* As in Concept 1: one instruction line, compact rows for what
            ExecHQ has, and Write my first draft pinned with Back. */}
        {f.inputPanel(rest, {
          onSubmit: () => {
            f.write();
            setExpanded(true);
          },
          compact: true,
          actionsClassName: "tool-flow__step-actions--pinned",
          footer: (
            <Button variant="ghost" onClick={() => go(at - 1)}>
              {C.previous}
            </Button>
          ),
        })}
      </div>
    );
  }

  // On a phone the open draft hides the interview, so what she does next
  // with the draft comes with it: what came of it, Mark ready or used, and
  // a way to change it.
  // As in Concept 1 (13 Oct), a fixed bar: a draft, Change it or Mark ready;
  // ready, one button, "I've used this", with Copy and the downloads in the
  // draft's Actions menu; changing a ready draft, Change it or Done.
  const underDraft =
    hasDraft && expanded && !web ? (
      <>
        {f.outcome}
        {f.stage === "used" && !changing ? null : (
          <div className="tool-flow__fixed tool-flow__fixed--pair">
            {f.stage === "draft" || changing ? (
              <Button variant="secondary" onClick={() => setExpanded(false)}>
                {C.changeDraft}
              </Button>
            ) : null}
            {changing ? <Button onClick={() => setChanging(false)}>{C.doneChanging}</Button> : f.useBar({ noNotes: true, copyInMenu: true })}
          </div>
        )}
      </>
    ) : null;

  return (
    <div
      className={["tool-flow", "tool-flow--interview", web ? "tool-flow--split" : null, !hasDraft && !web ? "tool-flow--pinned" : null, hasDraft && expanded && !web ? "tool-flow--has-bar" : null]
        .filter(Boolean)
        .join(" ")}
    >
      {f.header}
      {web ? (
        <div className="tool-flow__columns">
          {interview}
          {pinned}
        </div>
      ) : (
        <>
          {/* Where it came from stays in sight while the draft is open. */}
          {hasDraft && expanded ? f.source : null}
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
