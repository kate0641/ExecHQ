"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { StepHeader } from "@/components/onboarding/StepHeader";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/form/Input";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { GuidePage } from "@/components/onboarding/GuidePage";
import { PickAnswer, pickedPhrase } from "@/components/playbook/PickAnswer";
import { InputPanel } from "@/components/playbook/InputPanel";
import { PinnedDraft } from "@/components/playbook/PinnedDraft";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { useStepNav } from "@/lib/step-nav";
import { useViewport } from "@/lib/viewport-context";
import { DRAFT_COPY, EXAMPLE_ANSWERS, FLOW_COPY as C, INPUT_COPY, INTERVIEW_PICKS, PICK_COPY, STEP_BAR_COPY, type ToolInput } from "@/mock/playbook";
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
    // Who she is pitching: the outlets that fit what she is pitching for
    // (Kate, 14 Oct). Other is still there for her own.
    if (f.kind === "pitch" && input.id === "target" && f.outletChoices.length) return { ...pick, options: f.outletChoices.map((o) => o.name) };
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

  /* The showroom opens the interview on one of its screens with `?screen=`
     (designer, 2026-10-21): a question, named as the step bar names it
     (`q-<id>`), the last question (`q-final`), or the draft opened. The tool
     comes from the address as usual. Only what shows changes; nothing she has
     saved is. The questions and her draft load after the page, so it waits for
     them and opens once. */
  const [screen, setScreen] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after mount
    setScreen(new URLSearchParams(window.location.search).get("screen"));
  }, []);
  const screenOpened = useRef(false);
  useEffect(() => {
    if (!screen || screenOpened.current) return;
    /* eslint-disable react-hooks/set-state-in-effect -- opens the screen the showroom asked for, once */
    if (screen.startsWith("q-")) {
      const k = screen === "q-final" ? asked.length - 1 : asked.findIndex((input) => `q-${input.id}` === screen);
      if (k < 0) return;
      setAt(k);
    } else if (screen === "draft-open") {
      if (!hasDraft) return;
      setExpanded(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    screenOpened.current = true;
    // The key names the questions; the draft is there once hasDraft is.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, stepKey, hasDraft]);

  if (f.later) return f.laterNote;

  const go = (next: number) => {
    setDrawerOpen(true);
    setMissing(false);
    setAt(next);
    focusSoon(next < 0 ? TOOL_TITLE_ID : STEP_HEADING);
  };

  const clean = hasDraft && f.isReady && !changing;
  const draftView = clean ? f.draftAs("clean", () => setChanging(true)) : f.draftEditor;

  /** A question's answer: chips where there are picks, else a field. */
  const answerFor = (input: ToolInput): ReactNode => {
    const pick = pickFor(input);
    // An answer she already has (building out again, or a step-bar jump)
    // shows as picked: an option she chose, or her own words under Other.
    const had = f.valueOf(input.id).trim();
    const mine = picks[input.id] ?? (pick && had ? (pick.options.includes(had) ? { picked: [had], other: "" } : { picked: [], other: had }) : { picked: [], other: "" });
    return pick ? (
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
    );
  };
  /** Next, Skip on an optional question still empty, or Write on the last. */
  const primaryFor = (input: ToolInput) => {
    const last = at === asked.length - 1;
    const said = f.valueOf(input.id).trim();
    return {
      label: last ? INPUT_COPY.write : input.optional && !said ? PICK_COPY.skip : C.next,
      onPress: () => {
        if (!input.optional && !said) {
          setMissing(true);
          return;
        }
        if (last) {
          f.write();
          setExpanded(true);
        } else go(at + 1);
      },
    };
  };
  /** The last question writes the draft; what ExecHQ has is one line above
   *  its button (13 Oct), so there is no check page. */
  const builtWith =
    at === asked.length - 1 && hasKnown ? (
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
    ) : null;
  /** Once written: the draft's title, what came of it, Change the draft,
   *  what to do with it and its versions. */
  const draftHead = (
    <>
      <StepHeader eyebrow={f.tool.name} title={f.record?.title ?? f.tool.name} id={STEP_HEADING} />
      {f.source}
    </>
  );
  /* On a phone, the top of Change the draft is the open draft's (designer,
     29 Oct): "Draft · Saved" as the eyebrow, the name in the heading role,
     "For:" 4 under it, at the same places, so nothing moves between them. */
  const draftTop = (
    <div className="tool-flow__draft-top">
      <span className="tool-flow__draft-head">
        {f.record ? <LoopStatus record={f.record} detail={false} /> : null}
        {f.record ? (
          <span className="tool-flow__draft-saved">
            <span aria-hidden="true">·</span>
            <span className="u-visually-hidden">,</span> {C.savedShort}
          </span>
        ) : null}
      </span>
      <h1 className="tool-flow__draft-name" id={STEP_HEADING} tabIndex={-1}>
        {f.record?.title ?? f.tool.name}
      </h1>
      {f.source}
    </div>
  );
  const afterDraft = (head: boolean) => (
    <div className="tool-flow__interview">
      {head ? draftHead : null}
      {f.outcome}
      {/* Mark ready sits with Revise, so on a phone both stay at the foot
          of the screen while she chooses (Kate, 19 Oct). */}
      {f.revision(() => setExpanded(true), f.useBar({ noNotes: true, copyInMenu: true, secondary: true, className: "draft-use--single" }))}
      {f.versions}
    </div>
  );
  /** The screen after the questions, when ExecHQ has things to check. */
  const knownStep = (
    <div className="tool-flow__interview">
      <StepHeader eyebrow={C.step(asked.length + 1, asked.length + 1)} title={hasKnown ? C.knownStep : C.lastStep} id={STEP_HEADING} />
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

  /* Web: the page leads (option B, 19 Oct). The draft is the page, there
     from the start with every section named, and the interview sits in a
     rail beside it. The section the current question fills is shaded; once
     written, the rail is Change the draft. The rail comes first in the
     reading order, because the question is what she is doing. */
  if (web) {
    const input = !hasDraft && at >= 0 && at < asked.length ? asked[at] : undefined;
    const lit = hasDraft ? [] : f.sectionsFor(at < 0 ? f.firstChoice?.id : input?.id);
    let rail: ReactNode;
    if (hasDraft) rail = afterDraft(true);
    else if (at < 0)
      rail = (
        <>
          {f.moment ? <p className="tool-flow__moment">{C.momentLine(f.moment)}</p> : null}
          {f.useCase({ onStart: () => go(0), choiceStarts: true, noGoesWith: true, noPicture: true })}
        </>
      );
    else if (input) {
      const primary = primaryFor(input);
      rail = (
        <div className="tool-flow__ask">
          <StepHeader eyebrow={`${f.tool.name} · ${C.step(at + 1, asked.length)}`} title={input.label} description={pickFor(input) ? undefined : input.hint} id={STEP_HEADING} />
          {at === 0 ? f.source : null}
          {answerFor(input)}
          {builtWith}
          <div className="tool-flow__ask-actions">
            <Button fullWidth onClick={primary.onPress}>
              {primary.label}
            </Button>
            <Button variant="ghost" fullWidth onClick={() => go(at - 1)}>
              {C.previous}
            </Button>
          </div>
        </div>
      );
    } else rail = knownStep;
    return (
      <div className="tool-flow tool-flow--interview tool-flow--page">
        {f.header}
        <div className="tool-flow__desk">
          <div className="tool-flow__rail">{rail}</div>
          <div className="tool-flow__sheet">
            {hasDraft ? (
              draftView
            ) : (
              <section className="tool-flow__so-far" aria-labelledby="draft-so-far">
                <h2 className="tool-flow__so-far-label" id="draft-so-far">
                  {C.soFar}
                </h2>
                <p className="tool-flow__so-far-note">{C.pageNote}</p>
                {f.draftPage(lit)}
              </section>
            )}
          </div>
        </div>
      </div>
    );
  }

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
  // On a phone or tablet the draft card is only for a written draft: no
  // "Your draft so far" on the questions or the last step (13 Oct).
  const pinned = hasDraft ? (
    <PinnedDraft
      label={f.version ? DRAFT_COPY.label(f.version.n) : C.soFar}
      // Collapsed, the draft's opening; open, marked as the draft is: her
      // words apart from ExecHQ's wording.
      preview={f.draftPreview()}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {draftView}
    </PinnedDraft>
  ) : null;

  let interview;
  if (hasDraft) {
    // On a phone the draft's name leads, above the draft card (designer,
    // 29 Oct), so the card sits between it and Change the draft.
    interview = afterDraft(false);
  } else if (at < asked.length) {
    // The question screens are onboarding's (13 Oct): the question on the
    // page with the draft so far, the answer in a drawer at the foot.
    const input = asked[at];
    const pick = pickFor(input);
    const primary = primaryFor(input);
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
              primaryLabel={primary.label}
              onPrimary={primary.onPress}
              secondaryLabel={C.previous}
              onSecondary={() => go(at - 1)}
              autoFocusField={!pick && input.kind !== "choice"}
            >
              {answerFor(input)}
              {builtWith}
            </AnswerDrawer>
          }
        >
          {at === 0 ? f.source : null}
        </GuidePage>
      </>
    );
  } else {
    interview = knownStep;
  }

  // On a phone the open draft hides the interview, so what she does next
  // with the draft comes with it: what came of it, Mark ready or used, and
  // a way to change it.
  // As in Concept 1 (13 Oct), a fixed bar: a draft, Change it or Mark ready;
  // ready, one button, "I've used this", with Copy and the downloads in the
  // draft's Actions menu; changing a ready draft, Change it or Done.
  const underDraft =
    hasDraft && expanded ? (
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
    <div className={["tool-flow", "tool-flow--interview", !hasDraft ? "tool-flow--pinned" : null, hasDraft && expanded ? "tool-flow--has-bar" : null].filter(Boolean).join(" ")}>
      {f.header}
      {/* Where it came from stays in sight while the draft is open; what it
          is for now sits under the draft's name. */}
      {hasDraft && expanded ? f.origin : null}
      {hasDraft && !expanded ? draftTop : null}
      {pinned}
      {underDraft}
      {expanded ? null : interview}
    </div>
  );
}

/**
 * Playbook flow, Concept 3 — Interview. A start screen with the use case, as
 * in Concepts 1 and 2, then one question a screen, with the draft
 * pinned above as a collapsed card that fills in as she answers and opens
 * with a tap. A phone can't hold both at once, so she switches between them;
 * tablet does the same. On the web the page leads (option B, 19 Oct): the
 * draft as a page with every section named, filling in as she answers, and
 * the interview in a rail beside it. Once written, the questions give way to
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
