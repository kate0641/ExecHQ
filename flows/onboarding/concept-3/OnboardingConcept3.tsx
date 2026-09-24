"use client";

import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { AdvisorFile, type AdvisorFileItem } from "@/components/onboarding/AdvisorFile";
import { DirectionField } from "@/components/onboarding/DirectionField";
import { PlanTemplateCard } from "@/components/onboarding/PlanTemplateCard";
import { ThisWeekCard } from "@/components/onboarding/ThisWeekCard";
import { GuidePage } from "@/components/onboarding/GuidePage";
import { Notice } from "@/components/onboarding/Notice";
import { PointList } from "@/components/onboarding/PointList";
import { RecommendationCard } from "@/components/onboarding/RecommendationCard";
import { ReflectionReply } from "@/components/onboarding/ReflectionReply";
import { SignalSources } from "@/components/onboarding/SignalSources";
import { Button } from "@/components/primitives/Button";
import {
  useDictation,
  useOnboardingFlow,
  type OnboardingFlow,
  type OnboardingStep,
} from "@/flows/onboarding/shared";
import { useStepNav } from "@/lib/step-nav";
import {
  DIRECTION_PROMPTS_C1,
  GUIDE_C3,
  PLAN_C1,
  PLAN_TEMPLATES,
  SIGNALS_C1,
  builtFrom,
  checkEmail,
  earlyReasonFor,
  isValidInviteCode,
  planById,
  readBack,
  recommendC3,
  recommendPlan,
  refinementFor,
  towardFor,
  verdictC3,
  type PlanTemplate,
  type TailoredQuestion,
} from "@/mock/onboarding";

/**
 * Concept 3 — the guided onboarding.
 *
 * Rebuilt on 2026-09-24 from the living canvas. It keeps Concepts 1 and 2's
 * steps and logic, and explains as it goes: what ExecHQ is and how it is
 * built, why each thing is asked, what a plan is and how each part helps. It
 * is paged, like Concept 1, and differs from it on purpose:
 *
 *  - It recommends as soon as it hears where the user wants to go, then tests
 *    that recommendation with every question after, rather than asking first
 *    and recommending at the end.
 *  - It carries a file of what it has learned on every page, so "it
 *    remembers" is shown rather than claimed.
 *  - It reads like an advisor's briefing: progress in words, a margin note on
 *    every page saying why it is there, and reflections set as pull quotes.
 *  - It stops to make the user reflect, with questions that are not needed
 *    for the plan but are worth sitting with.
 *
 * Signals come early, straight after the privacy promise, by decision on
 * 2026-09-24: connecting LinkedIn or a website first means the first draft
 * already sounds like the user. The promise comes first because it is the
 * first time the user is asked for their data.
 *
 * Pages are this concept's own; each maps to the shared step it belongs to,
 * so a step-bar jump fills in everything before it the same way it does in
 * the other two concepts.
 */
type PageId =
  | "welcome"
  | "about"
  | "account"
  | "privacy"
  | "signals"
  | "direction"
  | "rec"
  | "reflect-time"
  | "q-0"
  | "reflect-ceo"
  | "q-1"
  | "reflect-conversation"
  | "q-2"
  | "readback"
  | "plan-intro"
  | "plan-start"
  | "plan-others"
  | "plan-week"
  | "plan-stages"
  | "plan-done"
  | "plan-grows"
  | "stage-end";

interface Page {
  id: PageId;
  /** The step bar's name for it. */
  label: string;
  /** Which of the four parts it sits in. Omitted: outside them (the cover). */
  part?: number;
  /** The shared step it belongs to, for jumps and for the flow's own state. */
  step: OnboardingStep;
  /** Left out of the step bar: reached from another page, not jumped to. */
  offBar?: boolean;
  /** Reached only from another page, never by moving on. */
  aside?: boolean;
}

const PAGES: Page[] = [
  { id: "welcome", label: "Welcome", step: "account" },
  { id: "about", label: "What ExecHQ is", part: 0, step: "account" },
  { id: "account", label: "Account", part: 0, step: "account" },
  { id: "privacy", label: "Privacy", part: 0, step: "privacy" },
  { id: "signals", label: "Signals", part: 0, step: "direction" },
  { id: "direction", label: "Direction", part: 1, step: "direction" },
  { id: "rec", label: "Recommendation", part: 1, step: "refinement" },
  { id: "reflect-time", label: "Reflection", part: 1, step: "refinement" },
  // The tailored questions, with two reflections between them. A direction
  // can come with fewer than three questions; the missing pages are passed.
  // Question, reflection, question, reflection: the two alternate whether a
  // direction gets two questions or three.
  { id: "q-0", label: "Questions", part: 1, step: "refinement" },
  { id: "reflect-ceo", label: "Reflection 2", part: 1, step: "refinement", offBar: true },
  { id: "q-1", label: "Question 2", part: 1, step: "refinement", offBar: true },
  { id: "reflect-conversation", label: "Reflection 3", part: 1, step: "refinement", offBar: true },
  { id: "q-2", label: "Question 3", part: 1, step: "refinement", offBar: true },
  { id: "readback", label: "Read-back", part: 1, step: "interpretation" },
  // The plan, taught a part at a time.
  { id: "plan-intro", label: "Your plan", part: 2, step: "plan" },
  { id: "plan-start", label: "Starting point", part: 2, step: "plan", offBar: true },
  { id: "plan-others", label: "Other plans", part: 2, step: "plan", offBar: true, aside: true },
  { id: "plan-week", label: "This week", part: 2, step: "plan", offBar: true },
  { id: "plan-stages", label: "Stages", part: 2, step: "plan", offBar: true },
  { id: "plan-done", label: "Done when", part: 2, step: "plan", offBar: true },
  { id: "plan-grows", label: "It grows", part: 2, step: "plan", offBar: true },
  { id: "stage-end", label: "Next", step: "plan" },
];
/** Where a page sits, handed to every page. */
type Frame = Pick<
  ComponentProps<typeof GuidePage>,
  "part" | "position" | "partIndex" | "partCount" | "file" | "headingId"
>;

const STEP_NAV = PAGES.filter((page) => !page.offBar).map((page) => ({ id: page.id, label: page.label }));
const pageIndex = (id: PageId) => PAGES.findIndex((page) => page.id === id);
/** The step bar entry a page falls under: itself, or the last one before it. */
function barEntry(id: PageId): PageId {
  for (let i = pageIndex(id); i >= 0; i--) if (!PAGES[i].offBar) return PAGES[i].id;
  return "welcome";
}
const PLAN_PARTS: PageId[] = ["plan-start", "plan-week", "plan-stages", "plan-done", "plan-grows"];

/** Pages whose answers live only in this concept, cleared when a jump lands
 *  on or before them. */
const REFLECTION_PAGES: Partial<Record<PageId, string>> = {
  "reflect-time": "time",
  "reflect-ceo": "ceo",
  "reflect-conversation": "conversation",
};

export function OnboardingConcept3() {
  const flow = useOnboardingFlow();
  const { state, dispatch } = flow;
  const a = state.answers;
  const headingId = useId();

  const [pageId, setPageId] = useState<PageId>("welcome");
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [fileOpen, setFileOpen] = useState(false);
  const at = pageIndex(pageId);
  const page = PAGES[at];

  /** Moves on, keeping the shared flow's step in step with the page. */
  function goTo(id: PageId) {
    const next = PAGES[pageIndex(id)];
    if (next.step !== state.step) dispatch({ type: "go-to", step: next.step });
    setPageId(id);
    setFileOpen(false);
  }
  const questions = refinementFor(a.direction ?? "");
  /** Pages this user never sees: questions their direction doesn't get, and
   *  pages reached only from another page. */
  const passed = (p: Page) =>
    Boolean(p.aside) || (p.id.startsWith("q-") && Number(p.id.slice(2)) >= questions.length);
  const next = () => {
    let i = at + 1;
    while (i < PAGES.length - 1 && passed(PAGES[i])) i++;
    goTo(PAGES[Math.min(i, PAGES.length - 1)].id);
  };

  useStepNav(STEP_NAV, barEntry(pageId), (id) => {
    const target = PAGES[pageIndex(id as PageId)];
    flow.jumpTo(target.step);
    // What only this concept asks is cleared from the target onward.
    setReflections((all) =>
      Object.fromEntries(
        Object.entries(all).filter(([key]) => {
          const owner = (Object.keys(REFLECTION_PAGES) as PageId[]).find((p) => REFLECTION_PAGES[p] === key);
          return owner ? pageIndex(owner) < pageIndex(target.id) : true;
        })
      )
    );
    setPageId(target.id);
    setFileOpen(false);
  });

  // Focus moves to the new page's heading, never on first paint.
  const previous = useRef(pageId);
  useEffect(() => {
    if (previous.current === pageId) return;
    previous.current = pageId;
    document.getElementById(headingId)?.focus();
  }, [pageId, headingId]);

  /* ---- The file: what ExecHQ knows so far. Each line appears once the
     answer behind it exists, in the order it was learned. */
  const direction = a.direction ?? "";
  // The recommendation as the answers so far leave it, or the plan chosen.
  const verdict = direction ? recommendC3(direction, a.refinement) : null;
  const chosen = planById(a.planId ?? "");
  const plan = chosen ?? verdict?.plan ?? null;
  const connected = SIGNALS_C1.sources
    .filter((source) => a.connections[source.id] === "connected" || a.signalLinks[source.id])
    .map((source) => source.title);
  const items: AdvisorFileItem[] = [];
  if (connected.length) items.push({ label: "Signals", value: connected.join(", ") });
  if (direction) items.push({ label: "Where you’re going", value: direction });
  if (plan && at > pageIndex("rec")) items.push({ label: "Starting point", value: plan.name });
  if (reflections.time) items.push({ label: GUIDE_C3.reflect.time.label, value: reflections.time });
  questions.forEach((question) => {
    const value = a.refinement[question.id];
    if (!value) return;
    const label = question.options.find((o) => o.value === value)?.label ?? value;
    items.push({ label: question.question, value: label });
  });
  if (reflections.ceo) items.push({ label: GUIDE_C3.reflect2.ceo.label, value: reflections.ceo });
  if (reflections.conversation)
    items.push({ label: GUIDE_C3.reflect2.conversation.label, value: reflections.conversation });
  if (a.planId && at > pageIndex("plan-grows")) items.push({ label: "Your plan", value: plan?.name ?? "" });
  const file = (
    <AdvisorFile
      label={GUIDE_C3.file.label}
      items={items}
      newest={items[items.length - 1]?.label}
      newestLabel={GUIDE_C3.file.added}
      open={fileOpen}
      onToggle={() => setFileOpen((open) => !open)}
    />
  );

  /** Where the page sits, in words. */
  function frame(): Frame {
    if (page.part === undefined) return { headingId };
    const inPart = PAGES.filter((p) => p.part === page.part && !passed(p));
    return {
      part: GUIDE_C3.parts[page.part],
      position: page.aside ? undefined : `${inPart.indexOf(page) + 1} of ${inPart.length}`,
      partIndex: page.part,
      partCount: GUIDE_C3.parts.length,
      file,
      headingId,
    };
  }

  switch (pageId) {
    case "welcome":
      return (
        <GuidePage
          cover
          headingId={headingId}
          title={GUIDE_C3.welcome.title}
          lede={GUIDE_C3.welcome.lede}
          primaryLabel={GUIDE_C3.welcome.cta}
          onPrimary={next}
        >
          <p className="guide__quote">{GUIDE_C3.welcome.quote}</p>
        </GuidePage>
      );

    case "about": {
      const c = GUIDE_C3.about;
      return (
        <GuidePage {...frame()} kicker={c.kicker} title={c.title} why={c.why} primaryLabel={c.cta} onPrimary={next}>
          <PointList items={c.points} numbered />
          <PointList items={c.built} label={c.builtLabel} />
        </GuidePage>
      );
    }

    case "account":
      return <AccountPage flow={flow} frame={frame()} onDone={next} />;

    case "privacy": {
      const c = GUIDE_C3.privacy;
      return (
        <GuidePage {...frame()} kicker={c.kicker} title={c.title} why={c.why} primaryLabel={c.cta} onPrimary={next}>
          <PointList items={c.points} />
        </GuidePage>
      );
    }

    case "signals": {
      const c = GUIDE_C3.signals;
      const anyOn = connected.length > 0;
      return (
        <GuidePage
          {...frame()}
          kicker={c.kicker}
          title={c.title}
          lede={c.lede}
          why={c.why}
          primaryLabel={anyOn ? c.done : c.skip}
          onPrimary={next}
        >
          <SignalSources
            connections={a.connections}
            signalLinks={a.signalLinks}
            onConnect={(id) => dispatch({ type: "set-connection", id, state: "connected" })}
            onAddLink={(id, link) => {
              dispatch({ type: "set-signal-link", id, link });
              dispatch({ type: "set-connection", id, state: "connected" });
            }}
            onDisconnect={(id) => {
              dispatch({ type: "set-signal-link", id, link: null });
              dispatch({ type: "set-connection", id, state: "declined" });
            }}
          />
        </GuidePage>
      );
    }

    case "direction":
      return <DirectionPage flow={flow} frame={frame()} onDone={next} />;

    case "rec": {
      const c = GUIDE_C3.rec;
      if (!plan) return null;
      return (
        <GuidePage {...frame()} kicker={c.kicker} title={c.title} why={c.why} primaryLabel={c.cta} onPrimary={next}>
          <RecommendationCard
            lead={c.lead}
            name={recommendPlan(direction).name}
            formalName={recommendPlan(direction).formalName}
            reason={earlyReasonFor(direction, recommendPlan(direction))}
          />
          <p className="guide__next">{c.next}</p>
        </GuidePage>
      );
    }

    case "reflect-time":
    case "reflect-ceo":
    case "reflect-conversation": {
      const key = REFLECTION_PAGES[pageId]!;
      const c =
        key === "time"
          ? GUIDE_C3.reflect.time
          : key === "ceo"
            ? GUIDE_C3.reflect2.ceo
            : GUIDE_C3.reflect2.conversation;
      return (
        <ReflectPage
          frame={frame()}
          copy={c}
          value={reflections[key]}
          onChange={(value) => setReflections((all) => ({ ...all, [key]: value }))}
          onDone={next}
        />
      );
    }

    case "q-0":
    case "q-1":
    case "q-2": {
      const index = Number(pageId.slice(2));
      const question = questions[index];
      if (!question) return null;
      return (
        <QuestionPage
          key={question.id}
          flow={flow}
          frame={frame()}
          question={question}
          answered={questions.slice(0, index + 1).filter((q) => a.refinement[q.id]).length}
          onDone={next}
        />
      );
    }

    case "readback":
      return <ReadbackPage flow={flow} frame={frame()} onDone={next} />;

    case "plan-intro": {
      const c = GUIDE_C3.plan;
      return (
        <GuidePage
          {...frame()}
          kicker={c.kicker}
          title={c.intro.title}
          lede={c.intro.lede}
          why={c.intro.why}
          primaryLabel={c.intro.cta}
          onPrimary={next}
        >
          <PointList
            numbered
            items={c.parts.map((part) => ({ title: part.title, detail: part.what, helps: part.helps }))}
          />
        </GuidePage>
      );
    }

    case "plan-start":
    case "plan-week":
    case "plan-stages":
    case "plan-done":
    case "plan-grows": {
      if (!plan) return null;
      const c = GUIDE_C3.plan;
      const index = PLAN_PARTS.indexOf(pageId);
      const part = c.parts[index];
      const last = pageId === "plan-grows";
      const usePlan = () => {
        dispatch({
          type: "select-plan",
          planId: plan.id,
          source: plan.id === recommendPlan(direction).id ? "recommended" : "switched",
        });
        next();
      };
      return (
        <GuidePage
          {...frame()}
          kicker={`${c.kicker} \u00b7 ${c.partOf(index)}`}
          title={part.title}
          primaryLabel={pageId === "plan-start" ? c.right : last ? c.use : c.next}
          onPrimary={last ? usePlan : next}
          secondaryLabel={pageId === "plan-start" ? c.others : undefined}
          onSecondary={pageId === "plan-start" ? () => goTo("plan-others") : undefined}
        >
          <PointList
            label={part.title}
            items={[
              { title: c.whatLabel, detail: part.what },
              { title: c.helpsLabel, detail: part.helps },
            ]}
          />
          <section className="guide__yours" aria-label={c.yoursLabel}>
            <p className="guide__yours-label">{c.yoursLabel}</p>
            <PlanPart part={pageId} plan={plan} direction={direction} refinement={a.refinement} />
          </section>
        </GuidePage>
      );
    }

    case "plan-others": {
      const c = GUIDE_C3.plan;
      const recommendedId = verdict?.plan.id;
      return (
        <GuidePage
          {...frame()}
          kicker={c.kicker}
          title={c.othersTitle}
          lede={c.othersLede}
          primaryLabel={c.othersCta}
          onPrimary={() => goTo("plan-start")}
        >
          <div className="plan-set" role="radiogroup" aria-label="Plans">
            {PLAN_TEMPLATES.map((template) => (
              <PlanTemplateCard
                key={template.id}
                plan={template}
                comparison
                recommended={template.id === recommendedId}
                selected={template.id === plan?.id}
                name="plan-c3"
                onSelect={(planId) =>
                  dispatch({
                    type: "select-plan",
                    planId,
                    source: planId === recommendPlan(direction).id ? "recommended" : "switched",
                  })
                }
              />
            ))}
          </div>
        </GuidePage>
      );
    }

    case "stage-end":
      return (
        <GuidePage headingId={headingId} title={GUIDE_C3.stageEnd.title} lede={GUIDE_C3.stageEnd.lede}>
          <div className="guide__file-end">{file}</div>
        </GuidePage>
      );
  }
}

/**
 * The account: email, and an invite code for those who have one. Same rules
 * as Concept 1: any address, and a code only changes who pays.
 */
interface PageProps {
  flow: OnboardingFlow;
  frame: Frame;
  onDone: () => void;
}

function AccountPage({ flow, frame, onDone }: PageProps) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.account;
  const [email, setEmail] = useState(state.answers.email ?? "");
  const [code, setCode] = useState(state.answers.inviteCode ?? "");
  const [showCode, setShowCode] = useState(Boolean(state.answers.inviteCode));
  const [codeError, setCodeError] = useState(false);
  const [verdict, setVerdict] = useState<ReturnType<typeof checkEmail> | null>(null);
  const codeId = useId();

  function submit() {
    const codeOk = !showCode || !code.trim() || isValidInviteCode(code);
    const check = checkEmail(email);
    setCodeError(!codeOk);
    setVerdict(check === "ok" ? null : check);
    if (!codeOk || check !== "ok") return;
    dispatch({ type: "set-invite-code", code: showCode ? code.trim() || null : null });
    dispatch({ type: "set-email", email: email.trim() });
    onDone();
  }

  return (
    <GuidePage {...frame} kicker={c.kicker} title={c.title} lede={c.lede} why={c.why} primaryLabel={c.cta} onPrimary={submit}>
      <Input
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={email}
        error={
          verdict === "empty"
            ? "We need an email address to create the account."
            : verdict === "malformed"
              ? "That does not look like an email address."
              : undefined
        }
        onChange={(event) => {
          setEmail(event.target.value);
          setVerdict(null);
        }}
      />
      <div className="guide__invite">
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={showCode}
          aria-controls={codeId}
          onClick={() => {
            setShowCode((open) => !open);
            setCodeError(false);
          }}
        >
          {showCode ? c.inviteHide : c.inviteShow}
        </Button>
      </div>
      <div id={codeId} hidden={!showCode}>
        <Input
          label="Invite code"
          autoComplete="off"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setCodeError(false);
          }}
        />
      </div>
      {codeError ? (
        <Notice tone="explain" title="We do not recognise that code" live>
          Check it against the invitation you were sent. You can also continue without one — a code
          only changes who pays, never what you get.
        </Notice>
      ) : null}
    </GuidePage>
  );
}

/** Where the user wants to go: typed, spoken, or started from a prompt. */
function DirectionPage({ flow, frame, onDone }: PageProps) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.direction;
  const [value, setValue] = useState(state.answers.direction ?? "");
  const [selected, setSelected] = useState<string | null>(
    DIRECTION_PROMPTS_C1.find((p) => p.text === state.answers.direction)?.id ?? null
  );
  const [error, setError] = useState<string | undefined>();
  const dictation = useDictation(value, (text) => {
    setValue(text);
    setSelected(null);
    setError(undefined);
  });

  function submit() {
    dictation.stop();
    if (!value.trim()) {
      setError("Tell me roughly where you want to go. A few words is enough.");
      return;
    }
    dispatch({ type: "set-direction", direction: value.trim(), source: selected ? "prompted" : "free" });
    onDone();
  }

  return (
    <GuidePage {...frame} kicker={c.kicker} title={c.title} lede={c.lede} why={c.why} primaryLabel={c.cta} onPrimary={submit}>
      <DirectionField
        label={c.title}
        labelHidden
        value={value}
        onChange={(text) => {
          dictation.stop();
          setValue(text);
          setSelected(null);
          if (text.trim()) setError(undefined);
        }}
        prompted={DIRECTION_PROMPTS_C1}
        promptedLabel={c.promptedLabel}
        selectedPromptId={selected}
        onSelectPrompt={(prompt) => {
          dictation.stop();
          setValue(prompt.text);
          setSelected(prompt.id);
          setError(undefined);
        }}
        focusOnSelect
        voice={{ listening: dictation.listening, onToggle: dictation.toggle }}
        error={error}
      />
    </GuidePage>
  );
}

type ReflectCopy =
  | typeof GUIDE_C3.reflect.time
  | typeof GUIDE_C3.reflect2.ceo
  | typeof GUIDE_C3.reflect2.conversation;

/**
 * A question to sit with: not needed for the plan, asked to make the user
 * reflect. The answer gets a reply, and a fact where there is one.
 */
function ReflectPage({
  frame,
  copy,
  value,
  onChange,
  onDone,
}: {
  frame: Frame;
  copy: ReflectCopy;
  value?: string;
  onChange: (value: string) => void;
  onDone: () => void;
}) {
  const index = copy.options.findIndex((option) => option === value);
  return (
    <GuidePage
      {...frame}
      kicker={GUIDE_C3.reflect.kicker}
      title={copy.title}
      lede={copy.lede}
      why={copy.why}
      primaryLabel={GUIDE_C3.reflect.cta}
      primaryDisabled={!value}
      onPrimary={onDone}
    >
      <ChipGroup
        label={GUIDE_C3.reflect.answerLabel}
        options={copy.options}
        value={value ? [value] : []}
        onChange={(next) => onChange(next[0] ?? "")}
      />
      {/* The reply lands where the answer was given, and is announced. */}
      <div aria-live="polite">
        {index >= 0 ? (
          <ReflectionReply from={GUIDE_C3.from} text={copy.replies[index]} fact={{ ...copy.fact, placeholder: true }} />
        ) : null}
      </div>
    </GuidePage>
  );
}

/**
 * One tailored question, which checks the recommendation: each answer either
 * confirms it or changes it, and says which at once. A typed answer is kept
 * in the user's words; it confirms rather than guesses at a change.
 */
function QuestionPage({
  flow,
  frame,
  question,
  answered,
  onDone,
}: {
  flow: OnboardingFlow;
  frame: Frame;
  question: TailoredQuestion;
  /** How many of the questions so far have an answer, for the check count. */
  answered: number;
  onDone: () => void;
}) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.questions;
  const value = state.answers.refinement[question.id];
  const option = question.options.find((o) => o.value === value);
  const [typed, setTyped] = useState(value && !option ? value : "");
  const direction = state.answers.direction ?? "";
  const now = recommendC3(direction, state.answers.refinement);
  const change = value ? verdictC3(question.id, value) : undefined;

  function answer(next: string) {
    dispatch({ type: "answer-refinement", id: question.id, value: next });
  }

  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={question.question}
      why={c.why[question.id] ?? c.whyDefault}
      primaryLabel={c.cta}
      primaryDisabled={!value && !typed.trim()}
      onPrimary={() => {
        if (!option && typed.trim()) answer(typed.trim());
        onDone();
      }}
      secondaryLabel={c.skip}
      onSecondary={() => {
        dispatch({ type: "note-skip", id: question.id });
        onDone();
      }}
    >
      <ChipGroup
        label={GUIDE_C3.reflect.answerLabel}
        options={question.options.map((o) => o.label)}
        value={option ? [option.label] : []}
        onChange={(next) => {
          const picked = question.options.find((o) => o.label === next[0]);
          setTyped("");
          answer(picked?.value ?? "");
        }}
      />
      <Input
        label={c.typedLabel}
        value={typed}
        onChange={(event) => {
          setTyped(event.target.value);
          if (option) answer("");
        }}
      />
      <div aria-live="polite">
        {option ? (
          <RecommendationCard
            lead={change ? c.switchLead : c.confirmLead}
            name={now.plan.name}
            formalName={now.plan.formalName}
            reason={change ? change.reason : option.heard}
            status={c.checked(answered)}
          />
        ) : null}
      </div>
    </GuidePage>
  );
}

/**
 * What ExecHQ heard, said back and editable, with the recommendation as the
 * answers left it. The last chance to correct it before the plan is built.
 */
function ReadbackPage({ flow, frame, onDone }: PageProps) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.readback;
  const direction = state.answers.direction ?? "";
  const heard = state.answers.interpretation ?? readBack(direction, state.answers.refinement);
  const now = recommendC3(direction, state.answers.refinement);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(heard);

  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={c.title}
      why={c.why}
      primaryLabel={editing ? c.save : c.confirm}
      onPrimary={() => {
        if (editing) {
          dispatch({ type: "edit-interpretation", interpretation: draft.trim() || heard });
          setEditing(false);
          return;
        }
        onDone();
      }}
      secondaryLabel={editing ? undefined : c.change}
      onSecondary={() => {
        setDraft(heard);
        setEditing(true);
      }}
    >
      {editing ? (
        <Input label={c.editLabel} multiline rows={6} value={draft} onChange={(event) => setDraft(event.target.value)} />
      ) : (
        <p className="guide__heard">{heard}</p>
      )}
      <RecommendationCard
        lead={c.recLead}
        name={now.plan.name}
        formalName={now.plan.formalName}
        reason={now.reason}
        status={c.checked}
      />
    </GuidePage>
  );
}

/** The user's own version of one part of the plan. */
function PlanPart({
  part,
  plan,
  direction,
  refinement,
}: {
  part: PageId;
  plan: PlanTemplate;
  direction: string;
  refinement: Record<string, string>;
}) {
  if (part === "plan-start")
    return (
      <div className="guide__plan-start">
        <p className="recommendation__name">{plan.name}</p>
        {plan.formalName ? <p className="recommendation__formal">{plan.formalName}</p> : null}
        <div className="plan-built">
          <p className="plan-built__label">{GUIDE_C3.plan.builtFrom}</p>
          <ul className="plan-built__tags">
            {builtFrom(direction, refinement).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  if (part === "plan-week")
    return plan.thisWeek ? <ThisWeekCard label={PLAN_C1.thisWeek} whyLabel={PLAN_C1.why} {...plan.thisWeek} /> : null;
  if (part === "plan-stages")
    return (
      <div className="plan-ahead">
        <p className="plan-ahead__toward">
          {plan.horizon}, toward <b>{towardFor(direction)}</b>
        </p>
        <ol className="guide__stages">
          {plan.stages?.map((stage, index) => (
            <li key={stage.title}>
              <p className="guide__stage-when">
                {stage.window}
                {index === 0 ? ` \u00b7 ${PLAN_C1.now}` : ""}
              </p>
              <p className="guide__stage-title">{stage.title}</p>
              <ul>
                {stage.outcomes.map((outcome) => (
                  <li key={outcome}>{outcome}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    );
  if (part === "plan-done")
    return (
      <ol className="guide__done">
        {plan.stages?.map((stage) => (
          <li key={stage.title}>
            <p className="guide__stage-title">{stage.title}</p>
            <p>
              <b>{PLAN_C1.doneWhen}</b> {stage.done}
            </p>
          </li>
        ))}
      </ol>
    );
  // It grows: the plan's open end, and what feeds it.
  return (
    <div className="guide__grows">
      <p className="guide__heard">{plan.after}</p>
      <p className="guide__grows-note">{PLAN_C1.grows}</p>
    </div>
  );
}

export default OnboardingConcept3;
