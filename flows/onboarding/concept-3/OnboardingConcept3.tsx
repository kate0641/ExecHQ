"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { AdvisorFile, type AdvisorFileItem } from "@/components/onboarding/AdvisorFile";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { ExportLinks } from "@/components/onboarding/ExportLinks";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { GoodExample } from "@/components/onboarding/GoodExample";
import { StoryOutputs } from "@/components/onboarding/StoryOutputs";
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
  useOnboardingFlow,
  type OnboardingFlow,
  type OnboardingStep,
} from "@/flows/onboarding/shared";
import { useStepNav } from "@/lib/step-nav";
import {
  DIRECTION_PROMPTS_C1,
  DONE_C1,
  GUIDE_C3,
  POSITIONING_C1,
  STORY_EXPORTS,
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
  type OutputKind,
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
  | "reflect-story"
  | "story-intro"
  | "build-doing"
  | "build-known"
  | "build-audience"
  | "build-source"
  | "story"
  | "done";

interface Page {
  id: PageId;
  /** The step bar's name for it. */
  label: string;
  /** The shared step it belongs to, for jumps and for the flow's own state. */
  step: OnboardingStep;
  /** Left out of the step bar: reached from another page, not jumped to. */
  offBar?: boolean;
  /** Reached only from another page, never by moving on. */
  aside?: boolean;
}

const PAGES: Page[] = [
  { id: "welcome", label: "Welcome", step: "account" },
  { id: "about", label: "What ExecHQ is", step: "account" },
  { id: "account", label: "Account", step: "account" },
  { id: "privacy", label: "Privacy", step: "privacy" },
  { id: "signals", label: "Signals", step: "direction" },
  { id: "direction", label: "Direction", step: "direction" },
  { id: "rec", label: "Recommendation", step: "refinement" },
  { id: "reflect-time", label: "Reflection", step: "refinement" },
  // The tailored questions, with two reflections between them. A direction
  // can come with fewer than three questions; the missing pages are passed.
  // Question, reflection, question, reflection: the two alternate whether a
  // direction gets two questions or three.
  { id: "q-0", label: "Questions", step: "refinement" },
  { id: "reflect-ceo", label: "Reflection 2", step: "refinement", offBar: true },
  { id: "q-1", label: "Question 2", step: "refinement", offBar: true },
  { id: "reflect-conversation", label: "Reflection 3", step: "refinement", offBar: true },
  { id: "q-2", label: "Question 3", step: "refinement", offBar: true },
  { id: "readback", label: "Read-back", step: "interpretation" },
  // The plan, taught a part at a time.
  { id: "plan-intro", label: "Your plan", step: "plan" },
  { id: "plan-start", label: "Starting point", step: "plan", offBar: true },
  { id: "plan-others", label: "Other plans", step: "plan", offBar: true, aside: true },
  { id: "plan-week", label: "This week", step: "plan", offBar: true },
  { id: "plan-stages", label: "Stages", step: "plan", offBar: true },
  { id: "plan-done", label: "Done when", step: "plan", offBar: true },
  { id: "plan-grows", label: "It grows", step: "plan", offBar: true },
  // The Positioning Builder, coached: a reflection, what it is, four pages
  // of what goes in, each with what good looks like, then the story.
  { id: "reflect-story", label: "Your story", step: "artifact" },
  { id: "story-intro", label: "The builder", step: "artifact", offBar: true },
  { id: "build-doing", label: "What you do", step: "artifact", offBar: true },
  { id: "build-known", label: "Known for", step: "artifact", offBar: true },
  { id: "build-audience", label: "Who it’s for", step: "artifact", offBar: true },
  { id: "build-source", label: "Start from", step: "artifact", offBar: true },
  { id: "story", label: "Story", step: "artifact" },
  { id: "done", label: "Done", step: "complete" },
];
/** An answer drawer's state: open, folded to a peek, or answered (gone). */
type DrawerMode = "open" | "peek" | "done";
interface DrawerControl {
  mode: DrawerMode;
  setMode: (mode: DrawerMode) => void;
}

/** What every page is handed about where it sits. */
type Frame = Pick<ComponentProps<typeof GuidePage>, "headingId">;

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
  "reflect-story": "story",
};

export function OnboardingConcept3() {
  const flow = useOnboardingFlow();
  const { state, dispatch } = flow;
  const a = state.answers;
  const headingId = useId();
  const router = useRouter();

  const [pageId, setPageId] = useState<PageId>("welcome");
  const [reflections, setReflections] = useState<Record<string, string>>({});
  // The current page's answer drawer: open, folded to a peek, or answered.
  const [mode, setMode] = useState<DrawerMode>("open");
  // The other directions picked, beyond the one to start from.
  const [alsoGoals, setAlsoGoals] = useState<string[]>([]);
  const at = pageIndex(pageId);

  /** Moves on, keeping the shared flow's step in step with the page. */
  function goTo(id: PageId) {
    const next = PAGES[pageIndex(id)];
    if (next.step !== state.step) dispatch({ type: "go-to", step: next.step });
    setPageId(id);
    setMode("open");
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
    if (pageIndex(target.id) <= pageIndex("direction")) setAlsoGoals([]);
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
    setMode("open");
  });

  // Focus moves to the new page's heading, never on first paint.
  const previous = useRef(pageId);
  useEffect(() => {
    if (previous.current === pageId) return;
    previous.current = pageId;
    document.getElementById(headingId)?.focus();
  }, [pageId, headingId]);

  /* ---- What ExecHQ has learned, in the order it learned it: the summary
     on the last page. */
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
  if (direction)
    items.push({
      label: "Where you’re going",
      value: alsoGoals.length ? `${direction}, and ${joinGoals(alsoGoals)}` : direction,
    });
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
  if (reflections.story) items.push({ label: GUIDE_C3.story.reflect.label, value: reflections.story });
  if (a.artifactSaved) items.push({ label: "Your story", value: plan?.thisWeek?.output ?? "Saved" });
  /** Where the page sits. Progress and the running file were cut from the
   *  pages by decision on 2026-09-24; what ExecHQ learned is shown once, as
   *  the summary on the last page. */
  function frame(): Frame {
    return { headingId };
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
      return <AccountPage flow={flow} frame={frame()} drawer={{ mode, setMode }} onDone={next} />;

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
      return (
        <DirectionPage
          flow={flow}
          frame={frame()}
          drawer={{ mode, setMode }}
          also={alsoGoals}
          onAlso={setAlsoGoals}
          onDone={next}
        />
      );

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
          {alsoGoals.length ? (
            <p className="guide__next">{c.also(joinGoals(alsoGoals))}</p>
          ) : null}
          <p className="guide__next">{c.next}</p>
        </GuidePage>
      );
    }

    case "reflect-time":
    case "reflect-ceo":
    case "reflect-conversation":
    case "reflect-story": {
      const key = REFLECTION_PAGES[pageId]!;
      const c =
        key === "time"
          ? GUIDE_C3.reflect.time
          : key === "ceo"
            ? GUIDE_C3.reflect2.ceo
            : key === "story"
              ? GUIDE_C3.story.reflect
              : GUIDE_C3.reflect2.conversation;
      return (
        <ReflectPage
          frame={frame()}
          drawer={{ mode, setMode }}
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
          drawer={{ mode, setMode }}
          question={question}
          answered={questions.slice(0, index + 1).filter((q) => a.refinement[q.id]).length}
          onDone={next}
        />
      );
    }

    case "readback":
      return <ReadbackPage flow={flow} frame={frame()} drawer={{ mode, setMode }} onDone={next} />;

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

    case "story-intro": {
      const c = GUIDE_C3.story.intro;
      return (
        <GuidePage
          {...frame()}
          kicker={c.kicker}
          title={`First: ${(plan?.thisWeek?.output ?? "the story of what you lead").toLowerCase()}`}
          lede={c.lede}
          why={c.why}
          primaryLabel={c.cta}
          onPrimary={next}
        >
          <PointList items={c.outputs} label={c.outputsLabel} />
        </GuidePage>
      );
    }

    case "build-doing":
    case "build-known":
    case "build-audience":
    case "build-source":
      return (
        <BuildPage
          key={pageId}
          flow={flow}
          frame={frame()}
          drawer={{ mode, setMode }}
          page={pageId}
          connected={connected}
          onDone={
            pageId === "build-source"
              ? () => {
                  // A build starts from the inputs, so any earlier edits go.
                  dispatch({ type: "set-positioning", patch: { built: true, edits: {} } });
                  flow.withDelay("drafting", () => {});
                  next();
                }
              : next
          }
        />
      );

    case "story": {
      const c = GUIDE_C3.story.output;
      const inputs = a.positioning;
      if (flow.generating === "drafting")
        return (
          <GuidePage {...frame()} kicker={GUIDE_C3.story.kicker} title={c.building}>
            <GeneratingState label={c.building} />
          </GuidePage>
        );
      return (
        <StoryPage
          frame={frame()}
          title={plan?.thisWeek?.output ?? "The story of what you lead"}
          onSave={() => {
            dispatch({ type: "save-artifact" });
            next();
          }}
        >
          {(setEditing) => (
            <>
              <StoryOutputs
                inputs={inputs}
                direction={direction}
                showFirst={inputs.showFirst as OutputKind}
                nextStage={plan?.stages?.[1]?.title}
                edits={inputs.edits}
                onSaveEdit={(key, text) =>
                  dispatch({ type: "set-positioning", patch: { edits: { ...inputs.edits, [key]: text } } })
                }
                onEditingChange={setEditing}
              />
              <ExportLinks actions={STORY_EXPORTS} />
            </>
          )}
        </StoryPage>
      );
    }

    case "done": {
      const c = GUIDE_C3.done;
      const stages = plan?.stages ?? [];
      // This week, then the next two stages: what the plan does next.
      const steps: { title: string; detail: string }[] = [];
      if (plan?.thisWeek) steps.push({ title: c.thisWeek, detail: plan.thisWeek.title });
      if (stages[1]) steps.push({ title: c.then, detail: `${stages[1].window}: ${stages[1].title}` });
      if (stages[2]) steps.push({ title: c.after, detail: `${stages[2].window}: ${stages[2].title}` });
      return (
        <GuidePage
          headingId={headingId}
          kicker={c.kicker}
          title={c.title}
          lede={c.lede}
          why={c.why}
          primaryLabel={c.home}
          onPrimary={() => router.push(DONE_C1.homeHref)}
        >
          {/* The file, open: everything learned, as the summary. */}
          <AdvisorFile
            label={GUIDE_C3.file.label}
            items={items}
            open
            fixed
          />
          <PointList items={steps} numbered label={c.nextLabel} />
          {connected.length ? null : <p className="guide__next">{c.signals}</p>}
        </GuidePage>
      );
    }
  }
}

/**
 * The account: email, and an invite code for those who have one. Same rules
 * as Concept 1: any address, and a code only changes who pays.
 */
interface PageProps {
  flow: OnboardingFlow;
  frame: Frame;
  drawer: DrawerControl;
  onDone: () => void;
}

/** Folds the drawer to its peek, or brings it back. */
const toggle = (drawer: DrawerControl) => () => drawer.setMode(drawer.mode === "open" ? "peek" : "open");

/** What the user said, back on the page, with the way to change it. */
function Said({ value, onChange }: { value: string; onChange: () => void }) {
  return (
    <div className="guide__said">
      <p>
        <span className="guide__said-label">{GUIDE_C3.drawer.said}</span>
        <span className="guide__said-value">{value}</span>
      </p>
      <button type="button" className="guide__said-change" onClick={onChange}>
        {GUIDE_C3.drawer.change}
      </button>
    </div>
  );
}

/**
 * The account: email, and an invite code for those who have one. Same rules
 * as Concept 1: any address, and a code only changes who pays. Typed, so the
 * drawer opens with the field focused and the keyboard up.
 */
function AccountPage({ flow, frame, drawer, onDone }: PageProps) {
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

  const open = drawer.mode === "open";
  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={c.title}
      lede={c.lede}
      why={c.why}
      drawerOpen={open}
      drawer={
        <AnswerDrawer
          question={c.ask}
          questionId={frame.headingId}
          kicker={c.kicker}
          open={open}
          onToggle={toggle(drawer)}
          primaryLabel={c.cta}
          onPrimary={submit}
          autoFocusField
        >
          <Input
            label={c.ask}
            labelHidden
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
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
                setShowCode((shown) => !shown);
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
              Check it against the invitation you were sent. You can also continue without one — a
              code only changes who pays, never what you get.
            </Notice>
          ) : null}
        </AnswerDrawer>
      }
    />
  );
}

/**
 * Where the user wants to go, picked from a list: as many as are true, by
 * decision on 2026-09-24, with no typing or voice here. The plan, its
 * questions and the read-back work from one direction, so when more than one
 * is picked the drawer asks which matters most, and the rest are kept in
 * view rather than lost.
 */
function DirectionPage({
  flow,
  frame,
  drawer,
  also,
  onAlso,
  onDone,
}: PageProps & { also: string[]; onAlso: (goals: string[]) => void }) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.direction;
  const d = GUIDE_C3.drawer;
  const current = DIRECTION_PROMPTS_C1.find((p) => p.text === state.answers.direction);
  const [picks, setPicks] = useState<string[]>(current ? [current.label, ...also] : []);
  const [lead, setLead] = useState<string | null>(current?.label ?? null);
  const [asking, setAsking] = useState(false);

  function finish(first: string) {
    const prompt = DIRECTION_PROMPTS_C1.find((p) => p.label === first)!;
    dispatch({ type: "set-direction", direction: prompt.text, source: "prompted" });
    onAlso(picks.filter((label) => label !== first));
    onDone();
  }

  const open = drawer.mode === "open";
  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={c.title}
      lede={c.lede}
      why={c.why}
      drawerOpen={open}
      questionInDrawer={!asking}
      drawer={
        asking ? (
          <AnswerDrawer
            key="first"
            question={c.first}
            questionId={frame.headingId}
            kicker={c.kicker}
            lede={c.firstLede}
            step="2 of 2"
            open={open}
            onToggle={toggle(drawer)}
            primaryLabel={d.continue}
            primaryDisabled={!lead || !picks.includes(lead)}
            onPrimary={() => lead && finish(lead)}
            secondaryLabel={d.back}
            onSecondary={() => setAsking(false)}
          >
            <ChipGroup
              label={c.first}
              labelHidden
              options={picks}
              value={lead && picks.includes(lead) ? [lead] : []}
              onChange={(next) => setLead(next[0] ?? null)}
            />
          </AnswerDrawer>
        ) : (
          <AnswerDrawer
            key="picks"
            question={c.title}
            questionId={frame.headingId}
            kicker={c.kicker}
            lede={c.lede}
            step={picks.length > 1 ? "1 of 2" : undefined}
            open={open}
            onToggle={toggle(drawer)}
            peekStatus={picks.length ? `${picks.length} picked` : d.peek}
            primaryLabel={picks.length > 1 ? d.next : d.continue}
            primaryDisabled={!picks.length}
            onPrimary={() => {
              if (picks.length === 1) return finish(picks[0]);
              if (!lead || !picks.includes(lead)) setLead(picks[0]);
              setAsking(true);
            }}
          >
            <ChipGroup
              label={c.title}
              labelHidden
              options={DIRECTION_PROMPTS_C1.map((p) => p.label)}
              value={picks}
              max={DIRECTION_PROMPTS_C1.length}
              onChange={setPicks}
            />
          </AnswerDrawer>
        )
      }
    />
  );
}

/** "a, b and c", in lower case, for saying picked goals in a sentence. */
function joinGoals(goals: string[]): string {
  const said = goals.map((goal) => (goal.startsWith("C-suite") ? goal : goal.charAt(0).toLowerCase() + goal.slice(1)));
  return said.length > 1 ? `${said.slice(0, -1).join(", ")} and ${said[said.length - 1]}` : said[0];
}

type ReflectCopy =
  | typeof GUIDE_C3.story.reflect
  | typeof GUIDE_C3.reflect.time
  | typeof GUIDE_C3.reflect2.ceo
  | typeof GUIDE_C3.reflect2.conversation;

/**
 * A question to sit with: not needed for the plan, asked to make the user
 * reflect. Answered in the drawer; once answered, the drawer drops away and
 * the reply lands on the page, with a fact where there is one.
 */
function ReflectPage({
  frame,
  drawer,
  copy,
  value,
  onChange,
  onDone,
}: {
  frame: Frame;
  drawer: DrawerControl;
  copy: ReflectCopy;
  value?: string;
  onChange: (value: string) => void;
  onDone: () => void;
}) {
  const index = copy.options.findIndex((option) => option === value);
  const d = GUIDE_C3.drawer;
  const done = drawer.mode === "done" && Boolean(value);
  const open = drawer.mode === "open";
  return (
    <GuidePage
      {...frame}
      kicker={GUIDE_C3.reflect.kicker}
      title={copy.title}
      lede={copy.lede}
      why={copy.why}
      primaryLabel={done ? GUIDE_C3.reflect.cta : undefined}
      onPrimary={onDone}
      drawerOpen={open}
      questionInDrawer
      drawer={
        done ? undefined : (
          <AnswerDrawer
            question={copy.title}
            questionId={frame.headingId}
            kicker={GUIDE_C3.reflect.kicker}
            lede={copy.lede}
            open={open}
            onToggle={toggle(drawer)}
            peekStatus={value ? d.peekAnswered : d.peek}
            primaryLabel={d.answer}
            primaryDisabled={!value}
            onPrimary={() => drawer.setMode("done")}
          >
            <ChipGroup
              label={copy.title}
              labelHidden
              options={copy.options}
              value={value ? [value] : []}
              onChange={(next) => onChange(next[0] ?? "")}
            />
          </AnswerDrawer>
        )
      }
    >
      {done && index >= 0 ? (
        <>
          <Said value={value!} onChange={() => drawer.setMode("open")} />
          <ReflectionReply from={GUIDE_C3.from} text={copy.replies[index]} fact={{ ...copy.fact, placeholder: true }} />
        </>
      ) : null}
    </GuidePage>
  );
}

/**
 * One tailored question, which checks the recommendation. Answered in the
 * drawer; once answered, the page says at once whether the answer confirms
 * the recommendation or changes it. A typed answer is kept in the user's
 * words; it confirms rather than guesses at a change.
 */
function QuestionPage({
  flow,
  frame,
  drawer,
  question,
  answered,
  onDone,
}: {
  flow: OnboardingFlow;
  frame: Frame;
  drawer: DrawerControl;
  question: TailoredQuestion;
  /** How many of the questions so far have an answer, for the check count. */
  answered: number;
  onDone: () => void;
}) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.questions;
  const d = GUIDE_C3.drawer;
  const value = state.answers.refinement[question.id];
  const option = question.options.find((o) => o.value === value);
  const [typed, setTyped] = useState(value && !option ? value : "");
  const direction = state.answers.direction ?? "";
  const now = recommendC3(direction, state.answers.refinement);
  const change = value ? verdictC3(question.id, value) : undefined;
  const done = drawer.mode === "done" && Boolean(value);
  const open = drawer.mode === "open";

  function answer(next: string) {
    dispatch({ type: "answer-refinement", id: question.id, value: next });
  }

  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={question.question}
      why={c.why[question.id] ?? c.whyDefault}
      primaryLabel={done ? c.cta : undefined}
      onPrimary={onDone}
      drawerOpen={open}
      questionInDrawer
      drawer={
        done ? undefined : (
          <AnswerDrawer
            question={question.question}
            questionId={frame.headingId}
            kicker={c.kicker}
            open={open}
            onToggle={toggle(drawer)}
            peekStatus={value ? d.peekAnswered : d.peek}
            primaryLabel={d.answer}
            primaryDisabled={!value && !typed.trim()}
            onPrimary={() => {
              if (!option && typed.trim()) answer(typed.trim());
              drawer.setMode("done");
            }}
            secondaryLabel={c.skip}
            onSecondary={() => {
              dispatch({ type: "note-skip", id: question.id });
              onDone();
            }}
          >
            <ChipGroup
              label={question.question}
              labelHidden
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
          </AnswerDrawer>
        )
      }
    >
      {done ? (
        <>
          <Said value={option?.label ?? value} onChange={() => drawer.setMode("open")} />
          <RecommendationCard
            lead={change ? c.switchLead : c.confirmLead}
            name={now.plan.name}
            formalName={now.plan.formalName}
            reason={change ? change.reason : (option?.heard ?? c.typedHeard)}
            status={c.checked(answered)}
          />
        </>
      ) : null}
    </GuidePage>
  );
}

/**
 * What ExecHQ heard, said back, with the recommendation as the answers left
 * it. "Change it" brings up the drawer to put it in the user's own words.
 */
function ReadbackPage({ flow, frame, drawer, onDone }: PageProps) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.readback;
  const direction = state.answers.direction ?? "";
  const heard = state.answers.interpretation ?? readBack(direction, state.answers.refinement);
  const now = recommendC3(direction, state.answers.refinement);
  const [draft, setDraft] = useState(heard);
  // No drawer until the user asks to change what was heard.
  const [asked, setAsked] = useState(false);
  const showDrawer = asked;
  const open = asked && drawer.mode === "open";

  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={c.title}
      why={c.why}
      primaryLabel={showDrawer ? undefined : c.confirm}
      onPrimary={onDone}
      secondaryLabel={showDrawer ? undefined : c.change}
      onSecondary={() => {
        setDraft(heard);
        setAsked(true);
        drawer.setMode("open");
      }}
      drawerOpen={open}
      drawer={
        showDrawer ? (
          <AnswerDrawer
            question={c.editLabel}
            questionId={frame.headingId}
            kicker={c.kicker}
            open={open}
            onToggle={toggle(drawer)}
            primaryLabel={c.save}
            onPrimary={() => {
              dispatch({ type: "edit-interpretation", interpretation: draft.trim() || heard });
              setAsked(false);
            }}
            secondaryLabel={c.cancel}
            onSecondary={() => setAsked(false)}
            autoFocusField
          >
            <Input label={c.editLabel} labelHidden multiline rows={4} value={draft} onChange={(event) => setDraft(event.target.value)} />
          </AnswerDrawer>
        ) : undefined
      }
    >
      <p className="guide__heard">{heard}</p>
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

/**
 * One part of the builder's inputs, coached. Its questions come up one at a
 * time in the drawer, "1 of 3" and so on; the page behind keeps what good
 * looks like and why it is asked. Everything is optional, as in Concepts 1
 * and 2: a gap stays visible in the story until it is filled.
 */
function BuildPage({
  flow,
  frame,
  drawer,
  page,
  connected,
  onDone,
}: PageProps & { page: PageId; connected: string[] }) {
  const { state, dispatch } = flow;
  const inputs = state.answers.positioning;
  const p = POSITIONING_C1;
  const c = GUIDE_C3.story;
  const d = GUIDE_C3.drawer;
  const copy =
    page === "build-doing" ? c.doing : page === "build-known" ? c.known : page === "build-audience" ? c.audience : c.source;
  const set = (patch: Partial<typeof inputs>) => dispatch({ type: "set-positioning", patch });
  const [index, setIndex] = useState(0);

  /** Each of the part's questions, as the drawer asks it. */
  const steps: { ask: string; typed: boolean; field: ReactNode }[] =
    page === "build-doing"
      ? [
          {
            ask: c.asks.role,
            typed: true,
            field: <Input label={c.asks.role} labelHidden placeholder={p.role.placeholder} value={inputs.role} onChange={(e) => set({ role: e.target.value })} />,
          },
          {
            ask: c.asks.own,
            typed: true,
            field: <Input label={c.asks.own} labelHidden placeholder={p.own.placeholder} value={inputs.own} onChange={(e) => set({ own: e.target.value })} />,
          },
          {
            ask: c.asks.team,
            typed: false,
            field: (
              <ChipGroup
                label={c.asks.team}
                labelHidden
                options={p.team.options}
                value={inputs.teamSize ? [inputs.teamSize] : []}
                onChange={(next) => set({ teamSize: next[0] ?? "" })}
              />
            ),
          },
        ]
      : page === "build-known"
        ? [
            {
              ask: c.asks.strengths,
              typed: false,
              field: (
                <ChipGroup
                  label={c.asks.strengths}
                  labelHidden
                  options={p.strengths.options}
                  value={inputs.strengths}
                  max={p.strengths.max}
                  onChange={(next) => set({ strengths: next })}
                />
              ),
            },
            {
              ask: c.asks.result,
              typed: true,
              field: <Input label={c.asks.result} labelHidden placeholder={p.result.placeholder} value={inputs.result} onChange={(e) => set({ result: e.target.value })} />,
            },
          ]
        : page === "build-audience"
          ? [
              {
                ask: c.asks.audience,
                typed: false,
                field: (
                  <ChipGroup
                    label={c.asks.audience}
                    labelHidden
                    options={p.audience.options}
                    value={inputs.audience ? [inputs.audience] : []}
                    onChange={(next) => set({ audience: next[0] ?? "", showFirst: "narrative" })}
                  />
                ),
              },
              {
                ask: c.asks.name,
                typed: true,
                field: <Input label={c.asks.name} labelHidden autoComplete="name" value={inputs.name} onChange={(e) => set({ name: e.target.value })} />,
              },
            ]
          : [
              {
                ask: c.asks.source,
                typed: true,
                field: (
                  <>
                    <Input
                      label={c.asks.source}
                      labelHidden
                      placeholder={p.source.placeholder}
                      multiline
                      rows={3}
                      value={inputs.source}
                      onChange={(e) => set({ source: e.target.value })}
                    />
                    {/* What was connected earlier, in Signals, is used here. */}
                    {connected.length ? <p className="answer-drawer__lede">{c.source.connected(connected.join(" and "))}</p> : null}
                  </>
                ),
              },
            ];
  const current = steps[Math.min(index, steps.length - 1)];
  const last = index >= steps.length - 1;
  const open = drawer.mode === "open";

  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={copy.title}
      lede={copy.lede}
      why={copy.why}
      drawerOpen={open}
      drawer={
        <AnswerDrawer
          key={index}
          question={current.ask}
          questionId={frame.headingId}
          kicker={copy.title}
          step={steps.length > 1 ? `${index + 1} of ${steps.length}` : undefined}
          open={open}
          onToggle={toggle(drawer)}
          primaryLabel={last ? (page === "build-source" ? c.source.cta : d.continue) : d.next}
          onPrimary={() => (last ? onDone() : setIndex(index + 1))}
          autoFocusField={current.typed}
        >
          {current.field}
        </AnswerDrawer>
      }
    >
      <GoodExample label={c.goodLabel} whyLabel={c.goodWhy} {...copy.good} />
    </GuidePage>
  );
}

/** The story, with its outputs; the action waits while one is being edited. */
function StoryPage({
  frame,
  title,
  onSave,
  children,
}: {
  frame: Frame;
  title: string;
  onSave: () => void;
  children: (setEditing: (editing: boolean) => void) => ReactNode;
}) {
  const c = GUIDE_C3.story.output;
  const [editing, setEditing] = useState(false);
  return (
    <GuidePage
      {...frame}
      kicker={GUIDE_C3.story.kicker}
      title={title}
      lede={c.lede}
      why={c.why}
      primaryLabel={c.cta}
      primaryDisabled={editing}
      onPrimary={onSave}
    >
      {children(setEditing)}
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
