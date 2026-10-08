"use client";

import { Suspense, useEffect, useId, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChipGroup } from "@/components/form/ChipGroup";
import { CodeField } from "@/components/form/CodeField";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { AccountPicker } from "@/components/login/AccountPicker";
import { MailNotification } from "@/components/login/MailNotification";
import { ProviderButtons } from "@/components/login/ProviderButtons";
import { SignInEmail } from "@/components/login/SignInEmail";
import { DetailPanel } from "@/components/profile/DetailPanel";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { ExportLinks } from "@/components/onboarding/ExportLinks";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { GoodExample } from "@/components/onboarding/GoodExample";
import { LinkedInUpload } from "@/components/onboarding/LinkedInUpload";
import { StoryDraft } from "@/components/onboarding/StoryDraft";
import { StoryText } from "@/components/onboarding/StoryText";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { PlanTemplateCard } from "@/components/onboarding/PlanTemplateCard";
import { ThisWeekCard } from "@/components/onboarding/ThisWeekCard";
import { GuidePage } from "@/components/onboarding/GuidePage";
import { NextSteps } from "@/components/onboarding/NextSteps";
import { Notice } from "@/components/onboarding/Notice";
import { WelcomeSplit } from "@/components/onboarding/WelcomeSplit";
import { PointList } from "@/components/onboarding/PointList";
import { RecommendationCard } from "@/components/onboarding/RecommendationCard";
import { ReflectionReply } from "@/components/onboarding/ReflectionReply";
import { SignalSources } from "@/components/onboarding/SignalSources";
import { Button } from "@/components/primitives/Button";
import {
  useOnboardingFlow,
  type AccountRoute,
  linkedInIn,
  type OnboardingFlow,
  type OnboardingStep,
  type PositioningInputs,
} from "@/flows/onboarding/shared";
import { loopActions, useLoop } from "@/lib/loop-store";
import { roadmapAfterEdit } from "@/lib/plan-edit";
import { saveRoadmap, useRoadmapChoices } from "@/lib/plan-store";
import { useStepNav } from "@/lib/step-nav";
import { useViewport } from "@/lib/viewport-context";
import {
  DIRECTION_MORE_C3,
  DIRECTION_NARROWER_C3,
  DIRECTION_PROMPTS_C1,
  baseDirection,
  isNarrowedDirection,
  DONE_C1,
  DRAFT_C1,
  EDIT_FLOW_COPY,
  bioFor,
  goalFor,
  type BioLength,
  DRAFT_EXPORTS,
  GUIDE_C3,
  LINKEDIN_UPLOAD,
  POSITIONING_C1,
  PLAN_C1,
  PLAN_TEMPLATES,
  SIGNUP_PROVIDER_ACCOUNTS,
  checkEmail,
  answerOptions,
  decidesPlanC3,
  encodeAnswer,
  parseAnswer,
  planForWhom,
  recommendationReasonC3,
  firstDraftFor,
  isSharpened,
  isValidInviteCode,
  looksLikeLinkedInExport,
  planById,
  recommendC3,
  refinementFor,
  towardFor,
  type PlanTemplate,
  type TailoredQuestion,
} from "@/mock/onboarding";
import {
  EMAIL_DELAY_MS,
  LOGIN_COPY,
  LOGIN_PROVISIONAL,
  RESEND_SECONDS,
  SIGN_IN_CODE,
  type Provider,
} from "@/mock/login";

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
  | "verify"
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
  | "plan-others"
  | "plan-week"
  | "plan-stages"
  | "reflect-story"
  | "draft"
  | "sharpen"
  | "versions"
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
  // The emailed code, for a typed address only: Google and Apple have
  // confirmed theirs, so Account moves past it (2026-10-08).
  { id: "verify", label: "Check your email", step: "account", offBar: true, aside: true },
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
  // The plan was chosen on the recommendation. Here it is, tuned to what the
  // user said, a part at a time.
  { id: "plan-others", label: "Other plans", step: "refinement", offBar: true, aside: true },
  { id: "plan-week", label: "Your plan", step: "plan" },
  { id: "plan-stages", label: "Stages", step: "plan", offBar: true },
  // The story: a reflection, then a first draft written from what the user
  // has said. After it the user chooses: add detail now, build longer
  // versions, or save it and come back to either later (2026-10-02). The
  // detail questions and the longer versions are reached only from the draft.
  { id: "reflect-story", label: "Your story", step: "artifact" },
  { id: "draft", label: "First draft", step: "artifact" },
  { id: "sharpen", label: "Add detail", step: "artifact", offBar: true, aside: true },
  { id: "versions", label: "Longer versions", step: "artifact", offBar: true, aside: true },
  { id: "done", label: "Done", step: "complete" },
];
/** An answer drawer's state: open, folded to a peek, or answered (gone). */
type DrawerMode = "open" | "peek" | "done";
interface DrawerControl {
  mode: DrawerMode;
  setMode: (mode: DrawerMode) => void;
}

/** What every page is handed about where it sits. */
type Frame = Pick<ComponentProps<typeof GuidePage>, "headingId" | "part" | "file">;

const STEP_NAV = PAGES.filter((page) => !page.offBar).map((page) => ({ id: page.id, label: page.label }));
/** Changing her direction from the Plan: the direction, the recommendation, the questions and the plan. */
const EDIT_PAGES: PageId[] = ["direction", "rec", "reflect-time", "t-0", "plan-week"];
const EDIT_STEP_NAV = STEP_NAV.filter((entry) => EDIT_PAGES.includes(entry.id as PageId));
const pageIndex = (id: PageId) => PAGES.findIndex((page) => page.id === id);
/** The step bar entry a page falls under: itself, or the last one before it. */
function barEntry(id: PageId): PageId {
  for (let i = pageIndex(id); i >= 0; i--) if (!PAGES[i].offBar) return PAGES[i].id;
  return "welcome";
}
const PLAN_PARTS: PageId[] = ["plan-week", "plan-stages"];

/** Pages whose answers live only in this concept, cleared when a jump lands
 *  on or before them. */
const REFLECTION_PAGES: Partial<Record<PageId, string>> = {
  "reflect-time": "time",
  "reflect-ceo": "ceo",
  "reflect-conversation": "conversation",
  "reflect-story": "story",
};

/**
 * Concept 3, or its edit mode: `?edit=1` (from Edit on the Plan) opens it on the direction and
 * ends on the plan, saving what she chose. Everything in between is the same pages.
 */
export function OnboardingConcept3() {
  return (
    <Suspense fallback={null}>
      <OnboardingEntry />
    </Suspense>
  );
}

function OnboardingEntry() {
  const editing = useSearchParams().has("edit");
  return <OnboardingGuide key={editing ? "edit" : "new"} edit={editing} />;
}

function OnboardingGuide({ edit }: { edit: boolean }) {
  const flow = useOnboardingFlow();
  const loop = useLoop();
  const roadmapChoices = useRoadmapChoices(loop.id);
  const { state, dispatch } = flow;
  const a = state.answers;
  const headingId = useId();
  const router = useRouter();

  const [pageId, setPageId] = useState<PageId>(edit ? "direction" : "welcome");
  const [reflections, setReflections] = useState<Record<string, string>>({});
  // The current page's answer drawer: open, folded to a peek, or answered.
  const [chosenMode, setMode] = useState<DrawerMode>("open");
  const { viewport } = useViewport();
  // On web the answers sit beside the question and there is no sheet to fold,
  // so a drawer left folded on a phone reads as open there.
  const mode: DrawerMode = viewport === "web" && chosenMode === "peek" ? "open" : chosenMode;
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
  /** The page after `from`, passing over those this user never sees. */
  const pageAfter = (from: PageId) => {
    let i = pageIndex(from) + 1;
    while (i < PAGES.length - 1 && passed(PAGES[i])) i++;
    return PAGES[Math.min(i, PAGES.length - 1)].id;
  };
  // Set when the user goes back from the plan to change an answer: finishing
  // that page brings them straight back to the plan.
  const [returnTo, setReturnTo] = useState<PageId | null>(null);
  // Where the detail questions go back to: the draft, or the longer versions.
  const [detailBack, setDetailBack] = useState<PageId>("draft");
  // Whether the longer versions have been looked at, for the Done page.
  const [builtVersions, setBuiltVersions] = useState(false);
  // The Toolbox is introduced once, on the first draft.
  const [toolboxSeen, setToolboxSeen] = useState(false);
  const next = () => {
    if (returnTo && returnTo !== pageId) {
      setReturnTo(null);
      goTo(returnTo);
      return;
    }
    goTo(pageAfter(pageId));
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

  useStepNav(edit ? EDIT_STEP_NAV : STEP_NAV, barEntry(pageId), (id) => {
    setReturnTo(null);
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
  // The answers the plan is built from, each with the page to change it on.
  const heardRows: { label: string; value: string; target: PageId }[] = [];
  if (direction)
    heardRows.push({
      label: GUIDE_C3.plan.heardDirection,
      value: alsoGoals.length ? `${direction}, and ${joinGoals(alsoGoals)}` : direction,
      target: "direction",
    });
  refinementFor(direction).forEach((question) => {
    const { chosen: picked, typed } = parseAnswer(question, a.refinement[question.id]);
    const value = [...picked.map((o) => o.label), ...(typed ? [typed] : [])].join(", ");
    if (!value) return;
    heardRows.push({
      label: question.question,
      value,
      target: decidesPlanC3(question.id) ? "decide" : (`t-${tailoring.indexOf(question)}` as PageId),
    });
  });
  /** Where the page sits. Progress and the running file were cut from the
   *  pages by decision on 2026-09-24; what ExecHQ learned is shown once, as
   *  the summary on the last page. */
  function frame(): Frame {
    if (!edit) return { headingId };
    return {
      headingId,
      part: EDIT_FLOW_COPY.part,
      file: (
        <Link href={EDIT_FLOW_COPY.backTo} className="link">
          {EDIT_FLOW_COPY.cancel}
        </Link>
      ),
    };
  }

  /** Saves what she chose and takes her back to her plan: her direction, and her plan if it is another. */
  function finishEdit() {
    const said = direction || loop.account.direction;
    loopActions.updateAccount({ direction: said, towardShort: undefined });
    const next = roadmapAfterEdit(loop, roadmapChoices, plan?.id ?? loop.account.plan.id, said !== loop.account.direction);
    if (next) saveRoadmap(loop.id, next);
    router.push(EDIT_FLOW_COPY.backTo);
  }

  switch (pageId) {
    case "welcome":
      // On web the welcome splits, as Login's does: the wordmark and the line
      // on a dark panel, the statement and the way in on the sheet.
      if (viewport === "web")
        return (
          <WelcomeSplit
            quote={GUIDE_C3.welcome.title}
            title={GUIDE_C3.welcome.quote}
            description={GUIDE_C3.welcome.lede}
            headingId={headingId}
            primaryLabel={GUIDE_C3.welcome.cta}
            onPrimary={next}
            centred
          />
        );
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
      return (
        <AccountPage
          flow={flow}
          frame={frame()}
          drawer={{ mode, setMode }}
          onDone={(confirmed) => (confirmed ? next() : goTo("verify"))}
        />
      );

    case "verify":
      return (
        <VerifyPage
          flow={flow}
          frame={frame()}
          drawer={{ mode, setMode }}
          onDone={next}
          onOtherAddress={() => goTo("account")}
        />
      );

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
          current={edit ? loop.account.direction : undefined}
        />
      );

    case "rec": {
      const c = GUIDE_C3.rec;
      if (!plan) return null;
      // Made once, from the direction and the question that decides it. The
      // plan is chosen here: the questions after only make it the user's own.
      const made = recommendC3(direction, a.refinement);
      const switched = plan.id !== made.plan.id;
      const parts = GUIDE_C3.plan.parts;
      const usePlan = () => {
        dispatch({
          type: "select-plan",
          planId: plan.id,
          source: switched ? "switched" : "recommended",
        });
        next();
      };
      return (
        <GuidePage
          {...frame()}
          kicker={c.kicker}
          title={plan.name}
          why={c.why}
          primaryLabel={c.cta}
          onPrimary={usePlan}
          secondaryLabel={c.others}
          onSecondary={() => goTo("plan-others")}
        >
          <RecommendationCard
            forWhom={planForWhom(plan)}
            reason={switched ? c.switched(made.plan.name) : recommendationReasonC3(direction, a.refinement, made)}
          />
          {alsoGoals.length ? (
            <p className="guide__next">{c.also(listGoals(alsoGoals), alsoGoals.length)}</p>
          ) : null}
          <p className="guide__next">{c.whatIs}</p>
          <PointList items={parts.map((part) => ({ title: part.title, detail: part.what }))} numbered />
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

    case "plan-week":
    case "plan-stages": {
      if (!plan) return null;
      const c = GUIDE_C3.plan;
      const index = PLAN_PARTS.indexOf(pageId);
      const part = c.parts[index];
      const last = pageId === "plan-stages";
      return (
        <GuidePage
          {...frame()}
          kicker={c.kicker}
          title={part.title}
          lede={pageId === "plan-week" ? c.firstLede : part.helps}
          primaryLabel={last ? (edit ? EDIT_FLOW_COPY.save : c.continue) : c.next}
          onPrimary={last && edit ? finishEdit : next}
        >
          {pageId === "plan-week" && heardRows.length ? (
            <section className="guide__heard-rows" aria-label={c.heardLabel}>
              <p className="guide__yours-label">{c.heardLabel}</p>
              {heardRows.map((row) => (
                <Said
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  onChange={() => {
                    // A question changes in place and comes back here; a new
                    // direction starts the questions again.
                    if (row.target !== "direction") setReturnTo("plan-week");
                    goTo(row.target);
                  }}
                />
              ))}
            </section>
          ) : null}
          <PlanPart part={pageId} plan={plan} direction={direction} />
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
          // Choosing another plan is choosing the plan: on to what follows the
          // recommendation, not back to it.
          onPrimary={() => goTo(pageAfter("rec"))}
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
                    source: planId === verdict?.plan.id ? "recommended" : "switched",
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
      const saveAndFinish = () => {
        dispatch({ type: "save-artifact" });
        goTo("done");
      };
      return (
        <DraftPage
          flow={flow}
          frame={frame()}
          plan={plan}
          lede={sharpened ? c.ledeSharpened : c.ledeStart}
          intro={toolboxSeen ? undefined : GUIDE_C3.story.toolboxIntro}
          onDetail={() => {
            setToolboxSeen(true);
            setDetailBack("draft");
            goTo("sharpen");
          }}
          onVersions={() => {
            setToolboxSeen(true);
            setBuiltVersions(true);
            goTo("versions");
          }}
          onLater={() => {
            setToolboxSeen(true);
            saveAndFinish();
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
          onDone={() => {
            // The draft is rewritten from what was added; the longer versions
            // simply read it.
            if (detailBack === "draft") flow.withDelay("drafting", () => {});
            goTo(detailBack);
          }}
        />
      );

    case "versions":
      return (
        <VersionsPage
          flow={flow}
          frame={frame()}
          drawer={{ mode, setMode }}
          onDetail={() => {
            setDetailBack("versions");
            goTo("sharpen");
          }}
          onBack={() => goTo("draft")}
          onSave={() => {
            dispatch({ type: "save-artifact" });
            goTo("done");
          }}
        />
      );

    case "done": {
      const c = GUIDE_C3.done;
      const stages = plan?.stages ?? [];
      // What is left to do, in order: the rest of the story, then the plan's
      // next stage, then the LinkedIn numbers if they have not come in.
      const steps: { title: string; detail: string }[] = [];
      if (!sharpened) steps.push(c.nextDetail);
      if (!builtVersions) steps.push(c.nextVersions);
      if (stages[1]) steps.push({ title: stages[1].title, detail: stages[1].outcomes[0] ?? "" });
      if (!linkedInIn(a.linkedin)) steps.push(c.nextSignals);
      return (
        <GuidePage
          headingId={headingId}
          kicker={c.kicker}
          title={c.title}
          lede={c.lede}
          className="guide--done"
          primaryLabel={c.home}
          onPrimary={() => router.push(DONE_C1.homeHref)}
        >
          <PointList items={steps} numbered label={c.nextLabel} />
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
function Said({ value, onChange, label }: { value: string; onChange: () => void; label?: string }) {
  return (
    <div className="guide__said">
      <p>
        <span className="guide__said-label">{label ?? GUIDE_C3.drawer.said}</span>
        <span className="guide__said-value">{value}</span>
      </p>
      <button
        type="button"
        className="guide__said-change"
        aria-label={label ? `${GUIDE_C3.drawer.change}: ${label}` : undefined}
        onClick={onChange}
      >
        {GUIDE_C3.drawer.change}
      </button>
    </div>
  );
}

/**
 * The account: Google or Apple, or an email, and an invite code for those who
 * have one. Same rules as Concept 1: any address, and a code only changes who
 * pays. A typed address is confirmed by a code on the next page; Google and
 * Apple, as on Login, have confirmed theirs, so `onDone` says which it was.
 */
function AccountPage({
  flow,
  frame,
  drawer,
  onDone,
}: Omit<PageProps, "onDone"> & { onDone: (confirmed: boolean) => void }) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.account;
  const names = LOGIN_COPY.signIn.providers;
  const [email, setEmail] = useState(state.answers.email ?? "");
  const [code, setCode] = useState(state.answers.inviteCode ?? "");
  // Google or Apple, once an account is picked in its window.
  const [route, setRoute] = useState<AccountRoute>(state.answers.accountRoute ?? "email");
  const [picker, setPicker] = useState<Provider | null>(null);
  // The invite code is a required choice: a code, or "I don't have a code".
  // Coming back to the page, an email already given means the choice was made.
  const [choice, setChoice] = useState<"yes" | "no" | null>(
    state.answers.inviteCode ? "yes" : state.answers.email ? "no" : null
  );
  const [codeError, setCodeError] = useState(false);
  const [verdict, setVerdict] = useState<ReturnType<typeof checkEmail> | null>(null);
  const codeBox = useRef<HTMLDivElement>(null);
  const emailBox = useRef<HTMLDivElement>(null);
  // Set by Change on a Google or Apple address: the field it gives way to
  // takes the cursor, so focus is not lost with the button.
  const refocus = useRef(false);
  useEffect(() => {
    if (route !== "email" || !refocus.current) return;
    refocus.current = false;
    emailBox.current?.querySelector("input")?.focus();
  }, [route]);

  // Choosing "I have an invite code" puts the cursor in its field.
  useEffect(() => {
    if (choice === "yes" && !code) codeBox.current?.querySelector("input")?.focus();
    // Only when the choice changes, not as the code is typed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choice]);

  const hasCode = choice === "yes";
  const via = route === "email" ? null : route;

  function submit() {
    if (!choice || (hasCode && !code.trim())) return;
    const codeOk = !hasCode || isValidInviteCode(code);
    const check = checkEmail(email);
    setCodeError(!codeOk);
    setVerdict(check === "ok" ? null : check);
    if (!codeOk || check !== "ok") return;
    const address = email.trim();
    // Confirmed already: Google or Apple, or the address the code confirmed.
    const confirmed = via !== null || (state.answers.emailVerified && state.answers.email === address);
    dispatch({ type: "set-invite-code", code: hasCode ? code.trim() : null });
    dispatch({ type: "set-email", email: address, route });
    onDone(confirmed);
  }

  const open = drawer.mode === "open";
  return (
    <>
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
            primaryDisabled={!choice || (hasCode && !code.trim())}
            onPrimary={submit}
            autoFocusField={via === null}
          >
            {via ? (
              <Said
                label={c.viaLabel(names[via])}
                value={email}
                onChange={() => {
                  refocus.current = true;
                  setRoute("email");
                  setEmail("");
                }}
              />
            ) : (
              <>
                <ProviderButtons onChoose={setPicker} />
                <p className="login__or">{c.or}</p>
                <div ref={emailBox}>
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
                </div>
              </>
            )}
            <ChipGroup
              label={c.inviteAsk}
              options={[c.inviteYes, c.inviteNo]}
              equalWidth
              value={choice ? [choice === "yes" ? c.inviteYes : c.inviteNo] : []}
              onChange={(next) => {
                setChoice(next[0] === c.inviteYes ? "yes" : next[0] === c.inviteNo ? "no" : null);
                setCodeError(false);
              }}
            />
            {hasCode ? (
              <div ref={codeBox}>
                <Input
                  label={c.inviteField}
                  autoComplete="off"
                  value={code}
                  onChange={(event) => {
                    setCode(event.target.value);
                    setCodeError(false);
                  }}
                />
              </div>
            ) : null}
            {codeError ? (
              <Notice tone="explain" title="We do not recognize that code" live>
                Check it against the invitation you were sent. If you don’t have one, choose “{c.inviteNo}”.
                A code only changes who pays, never what you get.
              </Notice>
            ) : null}
          </AnswerDrawer>
        }
      />
      <Sheet
        open={picker !== null}
        onClose={() => setPicker(null)}
        label={picker ? LOGIN_COPY.picker.heading(names[picker]) : ""}
      >
        {picker ? (
          <DetailPanel
            heading={LOGIN_COPY.picker.heading(names[picker])}
            headingId="account-picker-heading"
            lead={c.pickerLede(names[picker])}
            onClose={() => setPicker(null)}
          >
            <AccountPicker
              accounts={SIGNUP_PROVIDER_ACCOUNTS[picker]}
              onChoose={(account) => {
                const picked = SIGNUP_PROVIDER_ACCOUNTS[picker].find((a) => a.id === account.id);
                if (!picked) return;
                setEmail(picked.email);
                setVerdict(null);
                setRoute(picker);
                setPicker(null);
              }}
            />
            <p className="login__small">{LOGIN_PROVISIONAL.marks}</p>
          </DetailPanel>
        ) : null}
      </Sheet>
    </>
  );
}

/**
 * Confirming a typed address: the same 6-digit code as Login, emailed and
 * typed here. The email arrives a moment later as the phone's notification;
 * tapping it opens the drawn email. Login's wrong and expired code screens
 * are used here too (2026-10-08): only the code in the email confirms the
 * address, and the email's "open it again later" shows the code expired.
 */
function VerifyPage({ flow, frame, drawer, onDone, onOtherAddress }: PageProps & { onOtherAddress: () => void }) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.verify;
  const email = state.answers.email ?? "";
  const [code, setCode] = useState("");
  const [wrong, setWrong] = useState(false);
  const [expired, setExpired] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [reading, setReading] = useState(false);
  const [resendLeft, setResendLeft] = useState(RESEND_SECONDS);
  const [message, setMessage] = useState("");

  // The email arrives a moment after it is sent, and again after a resend.
  useEffect(() => {
    if (arrived || expired) return;
    const timer = window.setTimeout(() => {
      setArrived(true);
      setMessage(c.arrived);
    }, EMAIL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [arrived, expired, c.arrived]);

  // The resend waits a little, so it cannot be pressed over and over.
  useEffect(() => {
    if (resendLeft <= 0) return;
    const timer = window.setTimeout(() => setResendLeft((n) => n - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendLeft]);

  // Expired and back is a change of screen, so focus goes to its heading.
  const wasExpired = useRef(expired);
  useEffect(() => {
    if (wasExpired.current === expired) return;
    wasExpired.current = expired;
    if (frame.headingId) document.getElementById(frame.headingId)?.focus();
  }, [expired, frame.headingId]);

  function confirm() {
    if (code.length !== 6) return;
    if (code !== SIGN_IN_CODE) {
      setWrong(true);
      return;
    }
    dispatch({ type: "verify-email" });
    onDone();
  }

  /** A new code: the cells cleared, and the email on its way again. */
  function send() {
    setCode("");
    setWrong(false);
    setExpired(false);
    setArrived(false);
    setReading(false);
    setResendLeft(RESEND_SECONDS);
  }

  // Login's expired screen: no code to type, a new one to send.
  if (expired)
    return (
      <>
        <GuidePage
          {...frame}
          kicker={c.kicker}
          title={LOGIN_COPY.expired.heading}
          lede={c.expiredLede(email)}
          primaryLabel={LOGIN_COPY.expired.send}
          onPrimary={() => {
            send();
            setMessage(c.resent);
          }}
          secondaryLabel={c.otherAddress}
          onSecondary={onOtherAddress}
        />
        <output className="u-visually-hidden">{message}</output>
      </>
    );

  return (
    <>
      <GuidePage
        {...frame}
        kicker={c.kicker}
        title={c.title}
        lede={c.lede(email)}
        why={c.why}
        overlay={
          arrived && !reading ? (
            <MailNotification
              from={LOGIN_COPY.email.from}
              subject={c.email.subject}
              preview={c.email.preview}
              onOpen={() => setReading(true)}
            />
          ) : null
        }
        drawer={
          <AnswerDrawer
            question={c.ask}
            questionId={frame.headingId}
            open={drawer.mode === "open"}
            onToggle={toggle(drawer)}
            primaryLabel={c.cta}
            primaryDisabled={code.length !== 6}
            onPrimary={confirm}
            autoFocusField
          >
            <CodeField
              label={c.ask}
              value={code}
              error={wrong ? LOGIN_COPY.inbox.wrongCode : undefined}
              onChange={(value) => {
                setCode(value);
                setWrong(false);
              }}
            />
            <p className="login__actions">
              {resendLeft > 0 ? (
                <span className="login__small">{c.resendIn(resendLeft)}</span>
              ) : (
                <button
                  type="button"
                  className="login__link"
                  onClick={() => {
                    send();
                    setMessage(c.resent);
                  }}
                >
                  {c.resend}
                </button>
              )}
              <button type="button" className="login__link" onClick={onOtherAddress}>
                {c.otherAddress}
              </button>
            </p>
            <p className="login__small">{c.nothing}</p>
          </AnswerDrawer>
        }
      />
      <Sheet open={reading} onClose={() => setReading(false)} label={c.email.subject} className="sheet--tall">
        {reading ? (
          <SignInEmail
            email={email}
            code={SIGN_IN_CODE}
            message={c.email}
            headingId="verify-email-heading"
            onBack={() => setReading(false)}
            onExpired={() => {
              setReading(false);
              setExpired(true);
            }}
          />
        ) : null}
      </Sheet>
      <output className="u-visually-hidden">{message}</output>
    </>
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
  current,
}: PageProps & { also: string[]; onAlso: (goals: string[]) => void; current?: string }) {
  const { state, dispatch } = flow;
  const c = GUIDE_C3.direction;
  const d = GUIDE_C3.drawer;
  const allPrompts = [...DIRECTION_PROMPTS_C1, ...DIRECTION_MORE_C3];
  const labels = (list: typeof allPrompts) => list.map((p) => p.label);
  const promptFor = (text: string) => allPrompts.find((p) => p.label === text || p.text === text);

  // What was answered before, if the user comes back: the lead first, then the
  // rest. A narrower version stands for the option it came from.
  const earlierLead = state.answers.direction;
  const earlier = earlierLead ? [promptFor(baseDirection(earlierLead))?.label ?? earlierLead, ...also] : [];
  const [picks, setPicks] = useState<string[]>(earlier.filter((item) => promptFor(item)));
  const [more, setMore] = useState(earlier.some((item) => DIRECTION_MORE_C3.some((p) => p.label === item)));
  // The second question's answer: one of the narrower versions.
  const [lead, setLead] = useState<string | null>(earlierLead && isNarrowedDirection(earlierLead) ? earlierLead : null);
  const [asking, setAsking] = useState(false);

  // Every pick has two narrower versions to choose between.
  const optionsLeft = picks.flatMap((label) => DIRECTION_NARROWER_C3[promptFor(label)!.text]);
  const leadChosen = lead && optionsLeft.includes(lead) ? lead : null;

  function finish(first: string) {
    const parent = promptFor(baseDirection(first))?.label;
    dispatch({ type: "set-direction", direction: first, source: "prompted" });
    onAlso(picks.filter((label) => label !== parent));
    onDone();
  }

  const options = [...labels(DIRECTION_PROMPTS_C1), ...(more ? labels(DIRECTION_MORE_C3) : [])];
  const several = picks.length > 1;
  const open = drawer.mode === "open";
  return (
    <GuidePage
      {...frame}
      kicker={c.kicker}
      title={asking ? (several ? c.first : c.narrowTitle) : c.title}
      lede={asking ? (several ? c.firstLede : c.narrowLede) : c.lede}
      why={asking ? (several ? c.firstWhy : c.narrowWhy) : c.why}
      // Changing it from the Plan: what it says now, and a way to keep it.
      {...(current && !asking
        ? {
            children: (
              <>
                <p className="guide__next">{EDIT_FLOW_COPY.now(current)}</p>
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      dispatch({ type: "set-direction", direction: current, source: "free" });
                      onDone();
                    }}
                  >
                    {EDIT_FLOW_COPY.keep}
                  </Button>
                </div>
              </>
            ),
          }
        : {})}
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
            {picks.map((label) => (
              <ChipGroup
                key={label}
                label={label}
                options={DIRECTION_NARROWER_C3[promptFor(label)!.text]}
                equalWidth
                value={leadChosen ? [leadChosen] : []}
                onChange={(next) => setLead(next[0] ?? null)}
              />
            ))}
          </AnswerDrawer>
        ) : (
          <AnswerDrawer
            key="picks"
            question={c.title}
            questionId={frame.headingId}
            open={open}
            onToggle={toggle(drawer)}
            peekStatus={picks.length ? `${picks.length} picked` : d.peek}
            primaryLabel={several ? c.whichFirst : c.narrow}
            primaryDisabled={!picks.length}
            onPrimary={() => setAsking(true)}
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
          </AnswerDrawer>
        )
      }
    />
  );
}

/** "A, B and C", as the user picked them. */
function listGoals(goals: string[]): string {
  return goals.length > 1 ? `${goals.slice(0, -1).join(", ")} and ${goals[goals.length - 1]}` : goals[0];
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
      // Once answered, what the question is for and how to read it are said.
      lede={done ? undefined : copy.lede}
      why={done ? undefined : copy.why}
      className={done ? "guide--answered" : undefined}
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
              equalWidth
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
          primaryDisabled={!chosenValues.length}
          onPrimary={onDone}
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
              answer(encodeAnswer(values, ""));
            }}
          />
          {question.more && !more ? (
            <Button variant="ghost" size="sm" onClick={() => setMore(true)}>
              {c.more}
            </Button>
          ) : null}
        </AnswerDrawer>
      }
    />
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
 * The first draft, written from what the user has said. Under it, the ways
 * on are equal choices, so leaving the rest for later reads as a real one:
 * add detail now, build longer versions, or save it and come back.
 */
function DraftPage({
  flow,
  frame,
  plan,
  lede,
  intro,
  onDetail,
  onVersions,
  onLater,
}: {
  flow: OnboardingFlow;
  frame: Frame;
  plan: PlanTemplate | null;
  lede: string;
  /** Where this is, said once. */
  intro?: string;
  onDetail: () => void;
  onVersions: () => void;
  onLater: () => void;
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
      foot={
        editing ? undefined : (
          <NextSteps
            label={c.next.label}
            steps={[
              { label: c.next.detail.label, detail: c.next.detail.detail, onChoose: onDetail },
              { label: c.next.versions.label, detail: c.next.versions.detail, onChoose: onVersions },
              { label: c.next.later.label, detail: c.next.later.detail, onChoose: onLater },
            ]}
          />
        )
      }
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
      {intro ? <p className="guide__next">{intro}</p> : null}
    </GuidePage>
  );
}

/**
 * The same story in three lengths. A fact ExecHQ doesn't know yet is a
 * marked gap rather than something made up; the drawer asks for the few a
 * bio needs that the draft didn't (name, team size, strengths), and "add more
 * detail" covers the role and a result.
 */
function VersionsPage({
  flow,
  frame,
  drawer,
  onDetail,
  onBack,
  onSave,
}: {
  flow: OnboardingFlow;
  frame: Frame;
  drawer: DrawerControl;
  onDetail: () => void;
  onBack: () => void;
  onSave: () => void;
}) {
  const { state, dispatch } = flow;
  const inputs = state.answers.positioning;
  const c = GUIDE_C3.story.versions;
  const p = POSITIONING_C1;
  const { viewport } = useViewport();
  // On web the fields sit right beside the bio, so it fills in as they are
  // answered and there is no button. On phone and tablet the drawer covers
  // the bio, so a button applies what was typed.
  const live = viewport === "web";
  const [length, setLength] = useState<BioLength>("medium");
  const [name, setName] = useState(inputs.name);
  const [teamSize, setTeamSize] = useState(inputs.teamSize);
  const [strengths, setStrengths] = useState<string[]>(inputs.strengths);
  const [updated, setUpdated] = useState(false);
  const goal = goalFor(state.answers.direction ?? "");
  const segments = bioFor(live ? { ...inputs, name: name.trim(), teamSize, strengths } : inputs, goal, length);
  const hasGaps = segments.some((segment) => "gap" in segment);
  // The fields are offered if the bio had gaps on arrival, and stay for as
  // long as the person is on the page, even once the last gap is filled.
  const [offerFields] = useState(() => bioFor(inputs, goal, "long").some((segment) => "gap" in segment));
  const open = drawer.mode === "open";
  /** A change to a field: kept at once on web. */
  const change = (patch: { name?: string; teamSize?: string; strengths?: string[] }) => {
    setUpdated(false);
    if (live) dispatch({ type: "set-positioning", patch });
  };
  return (
    <GuidePage
      {...frame}
      kicker={GUIDE_C3.story.kicker}
      title={c.title}
      lede={c.lede}
      primaryLabel={c.save}
      onPrimary={onSave}
      secondaryLabel={c.back}
      onSecondary={onBack}
      drawer={
        offerFields ? (
          <AnswerDrawer
            question={c.fill.ask}
            questionId={frame.headingId}
            open={open}
            onToggle={toggle(drawer)}
            peekStatus={c.fill.peek}
            webTitle={c.fill.ask}
            hideActions={live}
            primaryLabel={c.fill.cta}
            onPrimary={() => {
              dispatch({ type: "set-positioning", patch: { name: name.trim(), teamSize, strengths } });
              setUpdated(true);
              drawer.setMode("peek");
            }}
          >
            <Input
              label={c.fill.name}
              autoComplete="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                change({ name: event.target.value.trim() });
              }}
            />
            <ChipGroup
              label={c.fill.team}
              options={p.team.options}
              value={teamSize ? [teamSize] : []}
              onChange={(next) => {
                setTeamSize(next[0] ?? "");
                change({ teamSize: next[0] ?? "" });
              }}
            />
            <ChipGroup
              label={c.fill.strengths}
              note={p.strengths.note}
              options={p.strengths.options}
              value={strengths}
              max={p.strengths.max}
              onChange={(next) => {
                setStrengths(next);
                change({ strengths: next });
              }}
            />
          </AnswerDrawer>
        ) : undefined
      }
    >
      <ToggleGroup
        label={c.lengthLabel}
        shape="chips"
        value={length}
        onChange={(next) => setLength(next as BioLength)}
        options={(Object.keys(p.lengths) as BioLength[]).map((key) => ({ value: key, label: p.lengths[key] }))}
      />
      <StoryText segments={segments} />
      <output className="u-visually-hidden">{updated ? c.fill.updated : ""}</output>
      {hasGaps ? (
        <p className="guide__next">
          {c.gapNote}{" "}
          <button type="button" className="guide__said-change" onClick={onDetail}>
            {GUIDE_C3.story.draft.sharpen}
          </button>
        </p>
      ) : null}
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
}: {
  part: PageId;
  plan: PlanTemplate;
  direction: string;
}) {
  if (part === "plan-week")
    return plan.thisWeek ? <ThisWeekCard label={PLAN_C1.thisWeek} whyLabel={PLAN_C1.why} labelHidden {...plan.thisWeek} /> : null;
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
              {stage.done ? (
                <p className="guide__stage-done">
                  <b>{PLAN_C1.doneWhen}</b> {stage.done}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="guide__next">
          {plan.after} {PLAN_C1.grows}
        </p>
      </div>
    );
  return null;
}

export default OnboardingConcept3;
