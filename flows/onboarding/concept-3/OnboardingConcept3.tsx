"use client";

import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { AdvisorFile, type AdvisorFileItem } from "@/components/onboarding/AdvisorFile";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { ExportLinks } from "@/components/onboarding/ExportLinks";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { GoodExample } from "@/components/onboarding/GoodExample";
import { LinkedInUpload } from "@/components/onboarding/LinkedInUpload";
import { StoryDraft } from "@/components/onboarding/StoryDraft";
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
  linkedInIn,
  type OnboardingFlow,
  type OnboardingStep,
  type PositioningInputs,
} from "@/flows/onboarding/shared";
import { useStepNav } from "@/lib/step-nav";
import {
  DIRECTION_MORE_C3,
  DIRECTION_NARROWER_C3,
  DIRECTION_PROMPTS_C1,
  baseDirection,
  isNarrowedDirection,
  DONE_C1,
  DRAFT_C1,
  DRAFT_EXPORTS,
  GUIDE_C3,
  LINKEDIN_UPLOAD,
  POSITIONING_C1,
  PLAN_C1,
  PLAN_TEMPLATES,
  SIGNALS_C1,
  builtFrom,
  checkEmail,
  answerOptions,
  decidesPlanC3,
  encodeAnswer,
  parseAnswer,
  earlyReasonFor,
  firstDraftFor,
  isSharpened,
  isValidInviteCode,
  looksLikeLinkedInExport,
  planById,
  quickWinFor,
  readBack,
  recommendC3,
  recommendPlan,
  refinementFor,
  towardFor,
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
 *  - It asks the one question that decides the plan (where the direction has
 *    one), recommends once, and then asks the questions that make the plan
 *    the user's own. The recommendation is never reversed by a later answer,
 *    by decision on 2026-09-30.
 *  - It carries a file of what it has learned on every page, so "it
 *    remembers" is shown rather than claimed.
 *  - It reads like an advisor's briefing: progress in words, a margin note on
 *    every page saying why it is there, and reflections set as pull quotes.
 *  - It stops to make the user reflect, with questions that are not needed
 *    for the plan but are worth sitting with.
 *
 * Signals come early, straight after the account, by decision on
 * 2026-09-24: connecting LinkedIn first means the first draft
 * already sounds like the user. The privacy promise is said before that, on
 * the page that says what ExecHQ is (2026-10-02), because signals are the
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
  | "signals"
  | "linkedin"
  | "direction"
  | "decide"
  | "rec"
  | "reflect-time"
  | "t-0"
  | "reflect-ceo"
  | "t-1"
  | "reflect-conversation"
  | "t-2"
  | "readback"
  | "plan-intro"
  | "plan-start"
  | "plan-others"
  | "plan-week"
  | "plan-stages"
  | "plan-done"
  | "plan-grows"
  | "reflect-story"
  | "draft"
  | "sharpen"
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
  { id: "signals", label: "Signals", step: "direction" },
  // LinkedIn's upload, reached from Signals: the steps and the picker.
  { id: "linkedin", label: "LinkedIn", step: "direction", offBar: true, aside: true },
  { id: "direction", label: "Direction", step: "direction" },
  // The question that decides the plan comes first, so the recommendation is
  // made once. Only some directions have one; the page is passed otherwise.
  { id: "decide", label: "Deciding question", step: "refinement", offBar: true },
  { id: "rec", label: "Recommendation", step: "refinement" },
  { id: "reflect-time", label: "Reflection", step: "refinement" },
  // The questions that make the plan the user's own, each after a reflection.
  // A direction can come with fewer than three; the missing questions, and
  // the reflections that would have come before them, are passed.
  { id: "t-0", label: "Questions", step: "refinement" },
  { id: "reflect-ceo", label: "Reflection 2", step: "refinement", offBar: true },
  { id: "t-1", label: "Question 2", step: "refinement", offBar: true },
  { id: "reflect-conversation", label: "Reflection 3", step: "refinement", offBar: true },
  { id: "t-2", label: "Question 3", step: "refinement", offBar: true },
  { id: "readback", label: "Read-back", step: "interpretation" },
  // The plan, taught a part at a time.
  { id: "plan-intro", label: "Your plan", step: "plan" },
  { id: "plan-start", label: "Starting point", step: "plan", offBar: true },
  { id: "plan-others", label: "Other plans", step: "plan", offBar: true, aside: true },
  { id: "plan-week", label: "This week", step: "plan", offBar: true },
  { id: "plan-stages", label: "Stages", step: "plan", offBar: true },
  { id: "plan-done", label: "Done when", step: "plan", offBar: true },
  { id: "plan-grows", label: "It grows", step: "plan", offBar: true },
  // The story: a reflection, then a first draft written from what the user
  // has said, by decision on 2026-09-28. Sharpening is optional, reached only
  // from the draft. It replaces the builder's intro and four input pages.
  { id: "reflect-story", label: "Your story", step: "artifact" },
  { id: "draft", label: "First draft", step: "artifact" },
  { id: "sharpen", label: "Sharpen", step: "artifact", offBar: true, aside: true },
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
  /** The question that can change the plan, asked before it is recommended,
   *  and the ones that only make it the user's own, asked after. */
  const deciding = questions.filter((q) => decidesPlanC3(q.id));
  const tailoring = questions.filter((q) => !decidesPlanC3(q.id));
  /** Pages this user never sees: questions their direction doesn't get, and
   *  pages reached only from another page. */
  const passed = (p: Page) =>
    Boolean(p.aside) ||
    (p.id === "decide" && deciding.length === 0) ||
    (p.id.startsWith("t-") && Number(p.id.slice(2)) >= tailoring.length) ||
    // A reflection only comes before a question, so two never run together.
    (p.id === "reflect-ceo" && tailoring.length < 2) ||
    (p.id === "reflect-conversation" && tailoring.length < 3);
  const next = () => {
    let i = at + 1;
    while (i < PAGES.length - 1 && passed(PAGES[i])) i++;
    goTo(PAGES[Math.min(i, PAGES.length - 1)].id);
  };
  // Moving on runs in the same tick as the answer that decides which pages
  // remain, so it can land on a page the new answer passes over (a direction
  // with no deciding question, say). Move on from it once the answer is in.
  const landedOnPassed = !PAGES[at].aside && passed(PAGES[at]);
  const latestNext = useRef(next);
  useEffect(() => {
    latestNext.current = next;
  });
  useEffect(() => {
    if (landedOnPassed) latestNext.current();
  }, [landedOnPassed, pageId]);

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
  const sharpened = isSharpened(a.positioning);
  const items: AdvisorFileItem[] = [];
  // The LinkedIn file is read while the user does the rest, so by the last
  // page it has usually finished: the file says what came in, or that it is
  // still being read.
  if (linkedInIn(a.linkedin))
    items.push({
      label: "LinkedIn",
      value:
        a.linkedin.status === "reading"
          ? LINKEDIN_UPLOAD.short.reading
          : a.linkedin.status === "empty"
            ? GUIDE_C3.linkedin.fileEmpty
            : SIGNALS_C1.sources[0].imported,
    });
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
    const { chosen, typed } = parseAnswer(question, value);
    items.push({
      label: question.question,
      value: [...chosen.map((o) => o.label), ...(typed ? [typed] : [])].join(", "),
    });
  });
  if (reflections.ceo) items.push({ label: GUIDE_C3.reflect2.ceo.label, value: reflections.ceo });
  if (reflections.conversation)
    items.push({ label: GUIDE_C3.reflect2.conversation.label, value: reflections.conversation });
  if (a.planId && at > pageIndex("plan-grows")) items.push({ label: "Your plan", value: plan?.name ?? "" });
  if (reflections.story) items.push({ label: GUIDE_C3.story.reflect.label, value: reflections.story });
  if (a.artifactSaved)
    items.push({
      label: "Your story",
      value: sharpened ? GUIDE_C3.story.draft.fileSharpened : GUIDE_C3.story.draft.fileDraft,
    });
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
          kicker={GUIDE_C3.welcome.wordmark}
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
        <GuidePage {...frame()} kicker={c.kicker} title={c.title} lede={c.lede} primaryLabel={c.cta} onPrimary={next}>
          <PointList items={c.points} numbered />
          <PointList items={c.before} />
        </GuidePage>
      );
    }

    case "account":
      return <AccountPage flow={flow} frame={frame()} drawer={{ mode, setMode }} onDone={next} />;

    case "signals": {
      const c = GUIDE_C3.signals;
      // Handled: the file is in, or the steps were emailed for later.
      const handled = linkedInIn(a.linkedin) || a.linkedin.status === "sent";
      return (
        <GuidePage
          {...frame()}
          kicker={c.kicker}
          title={c.title}
          lede={c.lede}
          primaryLabel={handled ? c.done : c.add}
          onPrimary={handled ? next : () => goTo("linkedin")}
          secondaryLabel={handled ? undefined : c.skip}
          onSecondary={handled ? undefined : next}
        >
          <SignalSources linkedin={a.linkedin} onOpenLinkedIn={() => goTo("linkedin")} />
        </GuidePage>
      );
    }

    case "linkedin": {
      const fileIn = linkedInIn(a.linkedin);
      return (
        <GuidePage
          {...frame()}
          kicker={LINKEDIN_UPLOAD.eyebrow}
          title={LINKEDIN_UPLOAD.title}
          lede={fileIn ? undefined : LINKEDIN_UPLOAD.lede}
          primaryLabel={fileIn ? LINKEDIN_UPLOAD.done : LINKEDIN_UPLOAD.skip}
          primaryVariant={fileIn ? undefined : "secondary"}
          onPrimary={() => goTo("signals")}
        >
          <LinkedInUpload
            status={a.linkedin.status}
            fileName={a.linkedin.fileName}
            email={a.email}
            onChoose={(fileName) =>
              dispatch({
                type: "set-linkedin",
                patch: { fileName, status: looksLikeLinkedInExport(fileName) ? "reading" : "wrong-file" },
              })
            }
            onSendSteps={() => dispatch({ type: "set-linkedin", patch: { status: "sent" } })}
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
      // Made once, from the direction and the question that decides it.
      const made = recommendC3(direction, a.refinement);
      return (
        <GuidePage {...frame()} kicker={c.kicker} title={c.title} why={c.why} primaryLabel={c.cta} onPrimary={next}>
          <RecommendationCard
            lead={c.lead}
            name={made.plan.name}
            formalName={made.plan.formalName}
            reason={made.changedBy ? made.reason : earlyReasonFor(direction, made.plan)}
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
          onDone={
            key === "story"
              ? () => {
                  flow.withDelay("drafting", () => {});
                  next();
                }
              : next
          }
        />
      );
    }

    case "decide":
    case "t-0":
    case "t-1":
    case "t-2": {
      const question = pageId === "decide" ? deciding[0] : tailoring[Number(pageId.slice(2))];
      if (!question) return null;
      return (
        <QuestionPage
          key={question.id}
          flow={flow}
          frame={frame()}
          drawer={{ mode, setMode }}
          question={question}
          kicker={pageId === "decide" ? GUIDE_C3.decide.kicker : GUIDE_C3.questions.kicker}
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

    case "draft": {
      const c = GUIDE_C3.story.draft;
      if (flow.generating === "drafting")
        return (
          <GuidePage {...frame()} kicker={GUIDE_C3.story.kicker} title={c.writing}>
            <GeneratingState label={c.writing} />
          </GuidePage>
        );
      return (
        <DraftPage
          flow={flow}
          frame={frame()}
          plan={plan}
          lede={c.ledes[reflections.story ?? ""] ?? c.lede}
          onSharpen={() => goTo("sharpen")}
          onSave={() => {
            dispatch({ type: "save-artifact" });
            goTo("done");
          }}
        />
      );
    }

    case "sharpen":
      return (
        <SharpenPage
          flow={flow}
          frame={frame()}
          drawer={{ mode, setMode }}
          onDone={() => goTo("draft")}
        />
      );

    case "done": {
      const c = GUIDE_C3.done;
      const stages = plan?.stages ?? [];
      // What was done today, the quick win that comes next (sharpening, or
      // the bio once the story is sharpened), then the plan's next stage.
      const steps: { title: string; detail: string }[] = [];
      steps.push({ title: c.thisWeek, detail: sharpened ? DONE_C1.storySharpened : DONE_C1.storyDraft });
      steps.push({ title: c.then, detail: quickWinFor(plan ?? undefined, sharpened).title });
      if (stages[1]) steps.push({ title: c.after, detail: `${stages[1].window}: ${stages[1].title}` });
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
          {linkedInIn(a.linkedin) ? null : <p className="guide__next">{c.signals}</p>}
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
      drawer={
        <AnswerDrawer
          question={c.ask}
          questionId={frame.headingId}
          open={open}
          onToggle={toggle(drawer)}
          primaryLabel={c.cta}
          onPrimary={submit}
          autoFocusField
        >
          <Input
            label={c.ask}
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
  const allPrompts = [...DIRECTION_PROMPTS_C1, ...DIRECTION_MORE_C3];
  const labels = (list: typeof allPrompts) => list.map((p) => p.label);
  const promptFor = (text: string) => allPrompts.find((p) => p.label === text || p.text === text);

  // What was answered before, if the user comes back: the lead first, then the
  // rest. A narrower version stands for the option it came from; anything that
  // is not one of the listed options was typed.
  const earlierLead = state.answers.direction;
  const earlier = earlierLead
    ? [promptFor(baseDirection(earlierLead))?.label ?? earlierLead, ...also]
    : [];
  const typedBefore = earlier.find((item) => !promptFor(item)) ?? "";
  const [picks, setPicks] = useState<string[]>(earlier.filter((item) => promptFor(item)));
  const [typed, setTyped] = useState(typedBefore);
  const [more, setMore] = useState(earlier.some((item) => DIRECTION_MORE_C3.some((p) => p.label === item)));
  // The second question's answer: a narrower version, or one of the typed
  // words from the first question; or said afresh in its own field.
  const [lead, setLead] = useState<string | null>(earlierLead && isNarrowedDirection(earlierLead) ? earlierLead : null);
  const [leadTyped, setLeadTyped] = useState("");
  const [asking, setAsking] = useState(false);

  // Everything picked, in the order picked, with the typed answer counted once
  // it has something in it. Its field is always open.
  const typedText = typed.trim();
  const chosen = typedText ? [...picks, typedText] : picks;
  // The picks that have narrower versions to offer; the typed words have none.
  const narrowable = picks.filter((label) => DIRECTION_NARROWER_C3[promptFor(label)?.text ?? label]);
  const leadNow = leadTyped.trim() || lead;
  const optionsLeft = [...narrowable.flatMap((label) => DIRECTION_NARROWER_C3[promptFor(label)!.text]), ...(typedText ? [typedText] : [])];
  const leadChosen = leadNow && (leadTyped.trim() || optionsLeft.includes(leadNow)) ? leadNow : null;

  function finish(first: string) {
    const narrowed = isNarrowedDirection(first);
    const parent = narrowed ? promptFor(baseDirection(first))?.label : first;
    const prompt = promptFor(first);
    dispatch({
      type: "set-direction",
      direction: prompt ? prompt.text : first,
      source: narrowed || prompt ? "prompted" : "free",
    });
    onAlso(chosen.filter((label) => label !== parent));
    onDone();
  }

  const options = [...labels(DIRECTION_PROMPTS_C1), ...(more ? labels(DIRECTION_MORE_C3) : [])];
  const several = chosen.length > 1;
  const open = drawer.mode === "open";
  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={asking ? (several ? c.first : c.narrowTitle) : c.title}
      lede={asking ? (several ? c.firstLede : c.narrowLede) : c.lede}
      why={asking ? (several ? c.firstWhy : c.narrowWhy) : c.why}
      drawer={
        asking ? (
          <AnswerDrawer
            key="first"
            question={several ? c.first : c.narrowTitle}
            questionId={frame.headingId}
            open={open}
            onToggle={toggle(drawer)}
            primaryLabel={d.continue}
            primaryDisabled={!leadChosen}
            onPrimary={() => leadChosen && finish(leadChosen)}
            secondaryLabel={d.back}
            onSecondary={() => setAsking(false)}
          >
            {narrowable.map((label) => (
              <ChipGroup
                key={label}
                label={label}
                options={DIRECTION_NARROWER_C3[promptFor(label)!.text]}
                equalWidth
                value={leadChosen && !leadTyped.trim() ? [leadChosen] : []}
                onChange={(next) => {
                  setLead(next[0] ?? null);
                  setLeadTyped("");
                }}
              />
            ))}
            {typedText ? (
              <ChipGroup
                label={c.ownLabel}
                options={[typedText]}
                equalWidth
                value={leadChosen === typedText && !leadTyped.trim() ? [typedText] : []}
                onChange={(next) => {
                  setLead(next[0] ?? null);
                  setLeadTyped("");
                }}
              />
            ) : null}
            <Input
              label={c.firstField}
              autoComplete="off"
              value={leadTyped}
              onChange={(event) => setLeadTyped(event.target.value)}
            />
          </AnswerDrawer>
        ) : (
          <AnswerDrawer
            key="picks"
            question={c.title}
            questionId={frame.headingId}
            open={open}
            onToggle={toggle(drawer)}
            peekStatus={chosen.length ? `${chosen.length} picked` : d.peek}
            primaryLabel={several ? c.whichFirst : narrowable.length ? c.narrow : d.continue}
            primaryDisabled={!chosen.length}
            onPrimary={() => {
              // Only the typed words picked: nothing to narrow.
              if (!narrowable.length) return finish(chosen[0]);
              setAsking(true);
            }}
          >
            <ChipGroup
              label={c.title}
              labelHidden
              options={options}
              value={picks}
              equalWidth
              max={options.length}
              onChange={setPicks}
            />
            {more ? null : (
              <Button variant="ghost" size="sm" onClick={() => setMore(true)}>
                {c.more}
              </Button>
            )}
            <Input
              label={c.elseField}
              autoComplete="off"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
            />
          </AnswerDrawer>
        )
      }
    />
  );
}

/** "a, b and c", in lower case, for saying picked goals in a sentence. */
function joinGoals(goals: string[]): string {
  const said = goals.map((goal) => (/^C-suite|^I\b/.test(goal) ? goal : goal.charAt(0).toLowerCase() + goal.slice(1)));
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
      drawer={
        done ? undefined : (
          <AnswerDrawer
            question={copy.title}
            questionId={frame.headingId}
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
          <ReflectionReply from={GUIDE_C3.from} text={copy.replies[index]} fact={copy.fact} />
        </>
      ) : null}
    </GuidePage>
  );
}

/**
 * One question, answered in the drawer, then on to the next page. Nothing is
 * said back: a question that decides the plan is asked before the
 * recommendation, so no answer reverses it, and the rest only make the plan
 * the user's own. A typed answer is kept in the user's words.
 */
function QuestionPage({
  flow,
  frame,
  drawer,
  question,
  kicker,
  onDone,
}: {
  flow: OnboardingFlow;
  frame: Frame;
  drawer: DrawerControl;
  question: TailoredQuestion;
  kicker: string;
  onDone: () => void;
}) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.questions;
  const d = GUIDE_C3.drawer;
  const value = state.answers.refinement[question.id];
  const everyOption = answerOptions(question);
  const multi = Boolean(question.multi);
  const parsed = parseAnswer(question, value);
  const chosenValues = parsed.chosen.map((o) => o.value);
  const [typed, setTyped] = useState(parsed.typed);
  // Held-back options come out when none of the first ones fit, or when an
  // answer chosen earlier is one of them.
  const [more, setMore] = useState(parsed.chosen.some((o) => question.more?.includes(o)));
  const open = drawer.mode === "open";

  function answer(next: string) {
    dispatch({ type: "answer-refinement", id: question.id, value: next });
  }

  return (
    <GuidePage
      {...frame}
      kicker={kicker}
      title={question.question}
      lede={multi ? c.multiLede : undefined}
      why={c.why[question.id] ?? c.whyDefault}
      drawer={
        <AnswerDrawer
          question={question.question}
          questionId={frame.headingId}
          open={open}
          onToggle={toggle(drawer)}
          peekStatus={value ? d.peekAnswered : d.peek}
          primaryLabel={d.next}
          primaryDisabled={!chosenValues.length && !typed.trim()}
          onPrimary={() => {
            // A typed answer is kept with whatever was chosen, in the user's words.
            answer(encodeAnswer(chosenValues, typed));
            onDone();
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
            options={(more ? everyOption : question.options).map((o) => o.label)}
            equalWidth
            max={multi ? everyOption.length : 1}
            value={parsed.chosen.map((o) => o.label)}
            onChange={(next) => {
              const values = next
                .map((label) => everyOption.find((o) => o.label === label)?.value)
                .filter((v): v is string => Boolean(v));
              // One answer, chosen or typed, unless several are asked for.
              if (!multi) setTyped("");
              answer(encodeAnswer(values, multi ? typed : ""));
            }}
          />
          {question.more && !more ? (
            <Button variant="ghost" size="sm" onClick={() => setMore(true)}>
              {c.more}
            </Button>
          ) : null}
          <Input
            label={c.typedLabel}
            value={typed}
            onChange={(event) => {
              setTyped(event.target.value);
              answer(encodeAnswer(multi ? chosenValues : [], event.target.value));
            }}
          />
        </AnswerDrawer>
      }
    />
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
      drawer={
        showDrawer ? (
          <AnswerDrawer
            question={c.editLabel}
            questionId={frame.headingId}
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
            <Input label={c.editLabel} multiline rows={4} value={draft} onChange={(event) => setDraft(event.target.value)} />
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

/** Where a hand edit of the draft is kept, with the builder's other edits. */
const DRAFT_EDIT = "draft";

/** The facts the draft is written from: what the user gave when sharpening,
 *  with a connected LinkedIn's role standing in until they give their own. */
function draftFacts(inputs: PositioningInputs) {
  return { role: inputs.role, own: inputs.own, result: inputs.result };
}

/**
 * The first draft, written from what the user has said. Saving is the skip:
 * the draft is kept whichever way they go. Sharpening is the quieter action.
 */
function DraftPage({
  flow,
  frame,
  plan,
  lede,
  onSharpen,
  onSave,
}: {
  flow: OnboardingFlow;
  frame: Frame;
  plan: PlanTemplate | null;
  lede: string;
  onSharpen: () => void;
  onSave: () => void;
}) {
  const { state, dispatch } = flow;
  const inputs = state.answers.positioning;
  const c = GUIDE_C3.story.draft;
  const [editing, setEditing] = useState(false);
  const text = firstDraftFor(state.answers.direction ?? "", state.answers.refinement, draftFacts(inputs));
  const sharpened = isSharpened(inputs);
  return (
    <GuidePage
      {...frame}
      kicker={GUIDE_C3.story.kicker}
      title={c.title}
      lede={lede}
      why={c.why}
      primaryLabel={c.cta}
      primaryDisabled={editing}
      onPrimary={onSave}
      secondaryLabel={sharpened ? c.sharpenAgain : c.sharpen}
      onSecondary={onSharpen}
    >
      <StoryDraft
        key={text}
        label={sharpened ? DRAFT_C1.sharpenedLabel : DRAFT_C1.label}
        text={text}
        edited={inputs.edits[DRAFT_EDIT]}
        onSaveEdit={(own) =>
          dispatch({ type: "set-positioning", patch: { edits: { ...inputs.edits, [DRAFT_EDIT]: own } } })
        }
        onEditingChange={setEditing}
        usesLabel={DRAFT_C1.usesLabel}
        uses={plan?.uses ?? []}
      />
      <ExportLinks actions={DRAFT_EXPORTS} />
    </GuidePage>
  );
}

/**
 * Sharpening: role, scope and a result, asked one at a time in the drawer,
 * each skippable, with what good looks like for the one being asked. Nothing
 * is saved until "Update my draft", so backing out loses nothing.
 */
function SharpenPage({
  flow,
  frame,
  drawer,
  onDone,
}: PageProps) {
  const { state, dispatch } = flow;
  const inputs = state.answers.positioning;
  const p = POSITIONING_C1;
  const c = GUIDE_C3.story;
  const d = GUIDE_C3.drawer;
  const [role, setRole] = useState(inputs.role);
  const [own, setOwn] = useState(inputs.own);
  const [result, setResult] = useState(inputs.result);
  const [index, setIndex] = useState(0);

  const steps = [
    { ask: c.asks.role, value: role, set: setRole, placeholder: p.role.placeholder, good: c.doing.good },
    { ask: c.asks.own, value: own, set: setOwn, placeholder: p.own.placeholder, good: c.doing.good },
    { ask: c.asks.result, value: result, set: setResult, placeholder: p.result.placeholder, good: c.known.good },
  ];
  const current = steps[index];
  const last = index === steps.length - 1;
  const open = drawer.mode === "open";

  function finish() {
    // The draft is rewritten from the facts, so a hand edit is replaced.
    const edits = { ...inputs.edits };
    delete edits[DRAFT_EDIT];
    dispatch({
      type: "set-positioning",
      patch: { role: role.trim(), own: own.trim(), result: result.trim(), edits },
    });
    onDone();
  }
  const forward = () => (last ? finish() : setIndex(index + 1));

  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={c.sharpen.title}
      lede={c.sharpen.lede}
      why={c.sharpen.why}
      drawer={
        <AnswerDrawer
          key={index}
          question={current.ask}
          questionId={frame.headingId}
          step={`${index + 1} of ${steps.length}`}
          open={open}
          onToggle={toggle(drawer)}
          primaryLabel={last ? c.sharpen.cta : d.next}
          onPrimary={forward}
          secondaryLabel={d.skip}
          onSecondary={() => {
            current.set("");
            forward();
          }}
          autoFocusField
        >
          <Input
            label={current.ask}
            placeholder={current.placeholder}
            multiline={last}
            rows={last ? 2 : undefined}
            value={current.value}
            onChange={(event) => current.set(event.target.value)}
          />
        </AnswerDrawer>
      }
    >
      <GoodExample label={c.goodLabel} whyLabel={c.goodWhy} {...current.good} />
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
