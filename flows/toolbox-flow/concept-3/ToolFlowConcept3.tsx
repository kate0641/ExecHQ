"use client";

import { Suspense, useMemo, useState } from "react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/form/Input";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { GuidePage } from "@/components/onboarding/GuidePage";
import { PickAnswer, pickedPhrase } from "@/components/toolbox/PickAnswer";
import { InputPanel } from "@/components/toolbox/InputPanel";
import { PinnedDraft } from "@/components/toolbox/PinnedDraft";
import { useStepNav } from "@/lib/step-nav";
import { useViewport } from "@/lib/viewport-context";
import { DRAFT_COPY, EXAMPLE_ANSWERS, FLOW_COPY as C, INPUT_COPY, INTERVIEW_PICKS, PICK_COPY, STEP_BAR_COPY, type ToolInput } from "@/mock/toolbox";
import { draftSteps, focusSoon, questionStep, TOOL_TITLE_ID, useToolFlow } from "../useToolFlow";

const STEP_HEADING = "tool-step-heading";

function Interview() {
  const f = useToolFlow("concept-3");
  const web = useViewport().viewport === "web";
  // -1 is the start screen (the use case); 0..asked.length-1 the questions; asked.length the last screen.
  const [at, setAt] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  // Once it is ready the draft is a clean read, as in Concept 1 (13 Oct);
  // "Change something" brings the working draft back until she is done.
  const [changing, setChanging] = useState(false);

  const hasDraft = Boolean(f.draft && f.version);
  // The start screen asks the tool's first question, as in Concept 1, so the
  // interview leaves that one out. Every other question is its own screen,
  // answered with taps, the optional ones too, with Skip (13 Oct); only what
  // ExecHQ already has waits for the last screen.
  const isKnown = (input: ToolInput) => Boolean(input.source && input.kind !== "choice");
  const open = f.notFirst(f.inputs.filter((input) => !isKnown(input)));
  // What she must answer first, then the optional questions.
  const asked = [...open.filter((input) => !input.optional), ...open.filter((input) => input.optional)];
  const rest = f.inputs.filter(isKnown);
  const hasKnown = rest.length > 0;
  const [drawerOpen, setDrawerOpen] = useState(true);
  // Next pressed with nothing answered: says what to do, rather than a
  // button that is simply off (13 Oct).
  const [missing, setMissing] = useState(false);
  const [picks, setPicks] = useState<Record<string, { picked: string[]; other: string }>>({});
  /** A question's chips: her own answer first, where ExecHQ knows it. */
  const pickFor = (input: ToolInput) => {
    const pick = INTERVIEW_PICKS[f.kind]?.[input.id];
    if (!pick) return undefined;
    const hers = pick.fromHer ? EXAMPLE_ANSWERS[f.kind]?.[input.id] : undefined;
    return { ...pick, options: hers && !pick.options.includes(hers) ? [hers, ...pick.options] : pick.options };
  };
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
    setDrawerOpen(true);
    setMissing(false);
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
  // Only once she has answered one of the interview's own questions: the
  // moment picked on the start screen is not yet a draft to show.
  const live = hasDraft || !asked.some((input) => f.valueOf(input.id).trim()) ? undefined : f.livePreview();

  // On a phone or tablet the draft card is only for a written draft: no
  // "Your draft so far" on the questions or the last step (13 Oct). On web
  // it sits beside the interview.
  const showCard = hasDraft || web;
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
    // The question screens are onboarding's (13 Oct): the question on the
    // page with the draft so far, the answer in a drawer at the foot.
    const input = asked[at];
    const pick = pickFor(input);
    // The last question writes the draft; what ExecHQ has is one line above
    // its button (13 Oct), so there is no check page.
    const last = at === asked.length - 1;
    const said = f.valueOf(input.id).trim();
    const mine = picks[input.id] ?? { picked: [], other: "" };
    return (
      <>
        {f.header}
        <GuidePage
          part={f.tool.name}
          position={C.step(at + 1, asked.length)}
          title={input.label}
          lede={pick ? undefined : input.hint}
          headingId={STEP_HEADING}
          className="tool-flow-questions"
          drawer={
            <AnswerDrawer
              question={input.label}
              questionId={STEP_HEADING}
              open={drawerOpen}
              onToggle={() => setDrawerOpen(!drawerOpen)}
              peekStatus={PICK_COPY.peek}
              // Optional and still empty, the main button skips it.
              primaryLabel={last ? INPUT_COPY.write : input.optional && !said ? PICK_COPY.skip : C.next}
              onPrimary={() => {
                if (!input.optional && !said) {
                  setMissing(true);
                  return;
                }
                if (last) {
                  f.write();
                  setExpanded(true);
                } else go(at + 1);
              }}
              secondaryLabel={C.previous}
              onSecondary={() => go(at - 1)}
              autoFocusField={!pick && input.kind !== "choice"}
            >
              {pick ? (
                <PickAnswer
                  label={input.label}
                  labelHidden
                  mode={pick.mode}
                  options={pick.options}
                  picked={mine.picked}
                  other={mine.other}
                  error={missing ? PICK_COPY.missing : undefined}
                  onChange={(picked, other) => {
                    setMissing(false);
                    setPicks((p) => ({ ...p, [input.id]: { picked, other } }));
                    f.setValue(input.id, pickedPhrase(picked, other));
                  }}
                />
              ) : (
                <Input
                  label={input.label}
                  labelHidden
                  placeholder={input.placeholder}
                  value={f.valueOf(input.id)}
                  type={input.kind === "date" ? "date" : undefined}
                  multiline={input.kind === "long"}
                  rows={4}
                  error={missing ? INPUT_COPY.missing : undefined}
                  onChange={(event) => {
                    setMissing(false);
                    f.setValue(input.id, event.target.value);
                  }}
                />
              )}
              {last && hasKnown ? (
                <InputPanel
                  inputs={rest}
                  values={Object.fromEntries(rest.map((known) => [known.id, f.valueOf(known.id)]))}
                  onChange={f.setValue}
                  onWrite={() => undefined}
                  builtWith
                  compact
                  noHeading
                  noActions
                />
              ) : null}
            </AnswerDrawer>
          }
        >
          {at === 0 ? f.source : null}
          {/* On web the draft fills in beside the answers as she taps (13 Oct);
              on a phone or tablet the question pages show none of it. */}
          {web ? pinned : null}
        </GuidePage>
      </>
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
