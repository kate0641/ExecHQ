"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { QuickReplies, type QuickReply } from "@/components/chat/QuickReplies";
import { Sheet } from "@/components/layout/Sheet";
import { ExportLinks } from "@/components/onboarding/ExportLinks";
import { DraftSection } from "@/components/onboarding/DraftSection";
import { PlanSummaryCard } from "@/components/onboarding/PlanSummaryCard";
import { StorySummaryCard } from "@/components/onboarding/StorySummaryCard";
import { PlanTimeline } from "@/components/onboarding/PlanTimeline";
import { StoryOutputs, narrativePartKey } from "@/components/onboarding/StoryOutputs";
import { ThisWeekCard } from "@/components/onboarding/ThisWeekCard";
import { Wordmark } from "@/components/primitives/Wordmark";
import {
  emptyPositioning,
  stepIndex,
  stepNavItems,
  useDictation,
  useOnboardingFlow,
  type OnboardingStep,
  type PositioningInputs,
} from "@/flows/onboarding/shared";
import { useStepNav } from "@/lib/step-nav";
import {
  CHAT_C2,
  DIRECTION_PROMPTS_C1,
  OPENER_KIND,
  PLAN_C1,
  PLAN_TEMPLATES,
  POSITIONING_C1,
  STORY_EXPORTS,
  VOICE_SAMPLE,
  bioFor,
  builtFrom,
  goalFor,
  narrativeFor,
  openerFor,
  planById,
  readBack,
  refinementFor,
  segmentsToText,
  toggleRevision,
  towardFor,
  visibleRevisions,
  type OutputKind,
  type PlanTemplate,
  type StorySegment,
} from "@/mock/onboarding";

/**
 * Concept 2 — the intake as a conversation.
 *
 * A chat with ExecHQ from the first moment, by decision on 2026-09-24: it
 * replaces the earlier "not a chatbot" thread. ExecHQ asks, the user answers
 * by typing, speaking or tapping a quick reply, and ExecHQ's replies arrive one
 * at a time behind a typing indicator.
 *
 * The logic is Concept 1's: the same prompts, the same tailored questions,
 * the same read-back. Only the telling differs.
 *
 * The thread is built from the flow's state rather than kept as a log of its
 * own, so the step bar can jump anywhere and a changed answer re-forms the
 * conversation from that point: everything after it is asked again.
 *
 * Accessibility: the thread is a live log, so each new message is announced
 * once as it lands. Focus stays in the composer the whole time — sending, or
 * tapping a quick reply, never leaves a keyboard user stranded.
 */

/** Stages 1 and 2 build the conversation up to a saved story. */
const CHAT_STEPS: OnboardingStep[] = [
  "account",
  "privacy",
  "direction",
  "refinement",
  "interpretation",
  "plan",
  "artifact",
];
const STEP_NAV = stepNavItems(CHAT_STEPS).map((item) =>
  item.id === "artifact" ? { ...item, label: "Your story" } : item
);

/**
 * The Positioning Builder's inputs, asked one at a time in Concept 1's order.
 * What earlier answers already told us — the direction, the plan — is used,
 * not asked again. Every question can be skipped; a skipped fact stays a
 * visible gap in the story.
 */
type BuilderField = "role" | "own" | "teamSize" | "strengths" | "result" | "audience" | "name" | "source";
interface BuilderQuestion {
  field: BuilderField;
  question: string;
  hint?: string;
  placeholder: string;
  /** Chips to tap. Omitted: typed or spoken only. */
  options?: readonly string[];
  /** Pick several, up to this many. */
  max?: number;
  /** The way past it, when "Skip this one" reads wrong. */
  none?: string;
}

const B = CHAT_C2.builder;
const BUILDER: BuilderQuestion[] = [
  { field: "role", ...B.role },
  { field: "own", ...B.own },
  { field: "teamSize", ...B.teamSize, options: POSITIONING_C1.team.options },
  {
    field: "strengths",
    ...B.strengths,
    options: POSITIONING_C1.strengths.options,
    max: POSITIONING_C1.strengths.max,
  },
  { field: "result", ...B.result },
  {
    field: "audience",
    ...B.audience,
    // "None for now" is an answer here, not a skip: no opener is written.
    options: POSITIONING_C1.audience.options,
  },
  { field: "name", ...B.name },
  { field: "source", ...B.source },
];

/** Skips are kept with the flow's other skips, under their own prefix. */
const skipId = (field: BuilderField) => `positioning:${field}`;
const questionFor = (field: BuilderField) => BUILDER.find((q) => q.field === field)!;

/**
 * The story is built a part at a time, by decision on 2026-09-24: ExecHQ asks
 * what one part needs, drafts just that part, and the user approves it,
 * adjusts it or rewrites it before the next is started. The whole story then
 * arrives already agreed. "Anything to start from" comes first, since it
 * informs every part.
 */
type SectionId = "source" | "doing" | "known" | "toward" | "bio" | "opener";
const SECTIONS: { id: SectionId; intro?: string; fields: BuilderField[]; review: boolean }[] = [
  { id: "source", fields: ["source"], review: false },
  { id: "doing", intro: CHAT_C2.sections.doing, fields: ["role", "own", "teamSize"], review: true },
  { id: "known", intro: CHAT_C2.sections.known, fields: ["strengths", "result"], review: true },
  // Built from the plan and the direction: nothing to ask.
  { id: "toward", intro: CHAT_C2.sections.toward, fields: [], review: true },
  { id: "bio", intro: CHAT_C2.sections.bio, fields: ["name"], review: true },
  { id: "opener", intro: CHAT_C2.sections.opener, fields: ["audience"], review: true },
];
/** Every question and every review, in order. */
type BuilderStep = { section: SectionId; field?: BuilderField };
const STEPS: BuilderStep[] = SECTIONS.flatMap((section) => [
  ...section.fields.map((field) => ({ section: section.id, field })),
  ...(section.review ? [{ section: section.id }] : []),
]);
const SECTION_ORDER = SECTIONS.map((section) => section.id);
/** Where a part's hand rewrite is kept: the same keys the full editor uses. */
const EDIT_KEY: Record<SectionId, string> = {
  source: "",
  doing: narrativePartKey(0),
  known: narrativePartKey(1),
  toward: narrativePartKey(2),
  bio: "bio-short",
  opener: "opener",
};
const PART_INDEX: Partial<Record<SectionId, number>> = { doing: 0, known: 1, toward: 2 };
/** Revisions that only make sense on the whole story, not on one part. */
const WHOLE_STORY_ONLY = ["asOne", "spoken"];
/** One edit to a draft, and the version it produced: a chip's tone, or the
 *  user's own words. Each is answered with the new draft to review. */
type DraftEdit =
  | { section: SectionId; kind: "revision"; label: string; applied: string[] }
  | { section: SectionId; kind: "rewrite"; text: string };
const NARRATIVE_SECTIONS: SectionId[] = ["doing", "known", "toward"];

function stepDone(step: BuilderStep, inputs: PositioningInputs, skipped: readonly string[]) {
  if (step.field) return builderAnswered(questionFor(step.field), inputs, skipped);
  // No audience with an opener: there is no opener to review.
  if (step.section === "opener" && !OPENER_KIND[inputs.audience]) return true;
  return inputs.approved.includes(step.section);
}

/** How long ExecHQ "types" before each message lands. */
const TYPING_MS = 650;

interface Message {
  key: string;
  from: "advisor" | "you";
  content: ReactNode;
  card?: boolean;
  onEdit?: () => void;
}

/** What the user can do right now: tap a reply, or type into the composer. */
interface Ask {
  label: string;
  replies: QuickReply[];
  onReply: (label: string) => void;
  placeholder: string;
  onSend: (text: string) => void;
  /** What the mic "hears" here. Omitted: the direction sample. */
  voice?: { full: string; addition?: string };
}

export function OnboardingConcept2() {
  const flow = useOnboardingFlow();
  const { state, dispatch, generating, withDelay } = flow;
  const a = state.answers;
  const at = stepIndex(state.step);
  const past = (step: OnboardingStep) => at > stepIndex(step);
  const reached = (step: OnboardingStep) => at >= stepIndex(step);

  const headingId = useId();
  const [draft, setDraft] = useState("");
  const [changing, setChanging] = useState(false);
  // Bumped after every reply; an effect then puts focus back in the composer,
  // since the quick reply that was pressed has been removed from under it.
  const [focusTick, setFocusTick] = useState(0);
  // Bumped on a step-bar jump or a changed answer, so the thread that results
  // is shown at once rather than replayed.
  const [jumpTick, setJumpTick] = useState(0);
  // The plans looked at through "See other plans", in order, and whether the
  // list of them is open. Local, since only this telling has the browsing.
  const [looked, setLooked] = useState<string[]>([]);
  const [browsing, setBrowsing] = useState(false);
  const [storyEditing, setStoryEditing] = useState(false);
  // The plan open in the sheet, if any.
  const [sheetPlan, setSheetPlan] = useState<string | null>(null);
  // The builder: the tone applied to each part of the narrative, every edit
  // asked for in the chat (each one sends a new draft back for review), the
  // part being rewritten, and whether the full story is open.
  const [partApplied, setPartApplied] = useState<Partial<Record<SectionId, string[]>>>({});
  const [edits, setEdits] = useState<DraftEdit[]>([]);
  const [rewriting, setRewriting] = useState<SectionId | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  /** A jump or a changed answer: the thread re-forms from the new state. */
  function restartFrom() {
    setDraft("");
    setChanging(false);
    setLooked([]);
    setBrowsing(false);
    setStoryEditing(false);
    setSheetPlan(null);
    setPartApplied({});
    setEdits([]);
    setRewriting(null);
    setStoryOpen(false);
    setJumpTick((tick) => tick + 1);
  }

  useStepNav(STEP_NAV, CHAT_STEPS.includes(state.step) ? state.step : "artifact", (id) => {
    restartFrom();
    flow.jumpTo(id as OnboardingStep);
  });

  const direction = a.direction ?? "";
  const questions = refinementFor(direction);
  const heard = readBack(direction, a.refinement);
  const started = a.email !== null;

  /** Everything the user says goes through here, so focus always comes back
   *  to the composer after a quick reply has been removed from under it. */
  function reply(run: () => void) {
    dictation.stop();
    setDraft("");
    run();
    setFocusTick((tick) => tick + 1);
  }

  const messages: Message[] = [];
  let ask: Ask | null = null;
  const say = (key: string, content: ReactNode, card = false) =>
    messages.push({ key, from: "advisor", content, card });
  const said = (key: string, content: ReactNode, onEdit?: () => void) =>
    messages.push({ key, from: "you", content, onEdit });
  const change = (step: OnboardingStep) => () => {
    restartFrom();
    flow.jumpTo(step);
  };

  /* ---- Account: the email, then the invite code. */
  if (started) {
    said("email", a.email, change("account"));
    say("invite", CHAT_C2.invite);
    // Past the account step it was answered, even if a jump skipped the asking.
    const inviteAnswered =
      a.inviteCode !== null || state.skipped.includes("invite") || past("account");
    if (inviteAnswered) {
      said("invite-said", a.inviteCode ?? CHAT_C2.inviteNo);
      if (a.inviteCode) say("invite-thanks", CHAT_C2.inviteThanks);
    } else {
      ask = {
        label: CHAT_C2.invite,
        replies: [{ label: CHAT_C2.inviteNo, quiet: true }],
        onReply: () =>
          reply(() => {
            dispatch({ type: "note-skip", id: "invite" });
            dispatch({ type: "next" });
          }),
        placeholder: CHAT_C2.invitePlaceholder,
        voice: CHAT_C2.voice.invite,
        onSend: (code) =>
          reply(() => {
            dispatch({ type: "set-invite-code", code });
            dispatch({ type: "next" });
          }),
      };
    }
  } else {
    ask = {
      label: CHAT_C2.welcomeAsk,
      replies: [],
      onReply: () => {},
      placeholder: CHAT_C2.emailPlaceholder,
      voice: CHAT_C2.voice.email,
      onSend: (email) => reply(() => dispatch({ type: "set-email", email })),
    };
  }

  /* ---- Privacy. */
  if (reached("privacy")) {
    say("privacy-lead", CHAT_C2.privacyLead);
    say(
      "privacy",
      <>
        <b>{CHAT_C2.privacy}</b> {CHAT_C2.privacyBody}
      </>
    );
    if (past("privacy")) said("privacy-said", CHAT_C2.privacyReply);
    else
      ask = {
        label: CHAT_C2.privacy,
        replies: [{ label: CHAT_C2.privacyReply }],
        onReply: () => reply(() => dispatch({ type: "next" })),
        placeholder: CHAT_C2.privacyReply,
        voice: CHAT_C2.voice.reply,
        onSend: () => reply(() => dispatch({ type: "next" })),
      };
  }

  /* ---- Direction: typed, spoken, or a prompt. */
  if (reached("direction")) {
    say(
      "direction",
      <>
        <b>{CHAT_C2.direction}</b>
        <span className="chat-hint">{CHAT_C2.directionHint}</span>
      </>
    );
    if (past("direction")) said("direction-said", direction, change("direction"));
    else {
      const setDirection = (text: string) =>
        reply(() => {
          const prompt = DIRECTION_PROMPTS_C1.find((p) => p.label === text);
          dispatch({
            type: "set-direction",
            direction: prompt ? prompt.text : text,
            source: prompt ? "prompted" : "free",
          });
          dispatch({ type: "next" });
        });
      ask = {
        label: CHAT_C2.direction,
        replies: DIRECTION_PROMPTS_C1.map((p) => ({ label: p.label })),
        onReply: setDirection,
        placeholder: CHAT_C2.directionPlaceholder,
        onSend: setDirection,
      };
    }
  }

  /* ---- Refinement: the plan's own questions, minus any already answered. */
  if (reached("refinement") && questions.length) {
    say("refinement-lead", CHAT_C2.refinementLead);
    const index = past("refinement") ? questions.length : Math.min(state.refinementIndex, questions.length - 1);
    questions.forEach((question, i) => {
      if (i > index) return;
      if (i === index && past("refinement")) return;
      say(`q-${question.id}`, question.question);
      const value = a.refinement[question.id];
      const skipped = state.skipped.includes(question.id);
      if (i < index || past("refinement")) {
        const label = question.options.find((o) => o.value === value)?.label ?? value;
        said(`a-${question.id}`, skipped || !label ? CHAT_C2.skipped : label, change("refinement"));
      }
    });
    if (state.step === "refinement") {
      const question = questions[index];
      const isLast = index === questions.length - 1;
      const advance = () => {
        if (isLast) {
          dispatch({ type: "go-to", step: "interpretation" });
          withDelay("interpreting", () => {});
        } else dispatch({ type: "refinement-to", index: index + 1 });
      };
      ask = {
        label: question.question,
        replies: [...question.options.map((o) => ({ label: o.label })), { label: CHAT_C2.skip, quiet: true }],
        onReply: (label) =>
          reply(() => {
            if (label === CHAT_C2.skip) dispatch({ type: "note-skip", id: question.id });
            else {
              const option = question.options.find((o) => o.label === label);
              dispatch({ type: "answer-refinement", id: question.id, value: option?.value ?? label });
            }
            advance();
          }),
        placeholder: CHAT_C2.answerPlaceholder,
        voice: CHAT_C2.voice.answer,
        // A typed answer is kept in their words and said back in them.
        onSend: (text) =>
          reply(() => {
            dispatch({ type: "answer-refinement", id: question.id, value: text });
            advance();
          }),
      };
    }
  }

  /* ---- Interpretation: what ExecHQ heard, said back. */
  if (reached("interpretation") && generating !== "interpreting") {
    say("heard-lead", CHAT_C2.interpretLead);
    say(
      "heard",
      <div className="chat-readback">
        <p>{heard}</p>
        <p className="chat-readback__close">{CHAT_C2.interpretClose}</p>
      </div>,
      true
    );
    if (a.interpretation) {
      said("heard-changed", a.interpretation);
      say("heard-thanks", CHAT_C2.changed);
    }
    if (past("interpretation")) said("heard-said", CHAT_C2.confirm);
    else
      ask = changing
        ? {
            label: CHAT_C2.change,
            replies: [],
            onReply: () => {},
            placeholder: CHAT_C2.changePlaceholder,
            voice: { full: CHAT_C2.voice.answer.full, addition: "and I want the title to match." },
            onSend: (text) =>
              reply(() => {
                setChanging(false);
                dispatch({ type: "edit-interpretation", interpretation: text });
              }),
          }
        : {
            label: CHAT_C2.interpretLead,
            replies: [{ label: CHAT_C2.confirm }, { label: CHAT_C2.change, quiet: true }],
            onReply: (label) => {
              if (label === CHAT_C2.change) {
                setChanging(true);
                setDraft(a.interpretation ?? heard);
                setFocusTick((tick) => tick + 1);
                return;
              }
              reply(toPlan);
            },
            placeholder: CHAT_C2.confirm,
            voice: CHAT_C2.voice.confirm,
            onSend: () => reply(toPlan),
          };
  }

  /* ---- Plan: the starting point as a card, with the others a tap away. */
  const recommended = flow.derived?.recommended;
  if (reached("plan") && recommended && generating !== "planning") {
    const chosen = planById(a.planId ?? "") ?? recommended;
    // Before any browsing the card is the plan in use: the recommendation, or
    // what was chosen before a jump back.
    const first = looked.length ? recommended : chosen;
    const current = looked.length ? planById(looked[looked.length - 1]) ?? recommended : first;
    const planName = (plan: PlanTemplate) =>
      plan.id === recommended.id ? `${plan.name} ${CHAT_C2.planRecommended}` : plan.name;

    say("plan-lead", CHAT_C2.planLead);
    say("plan-0", planCard(first), true);
    looked.forEach((id, i) => {
      const plan = planById(id) ?? recommended;
      said(`plan-others-${i}`, CHAT_C2.planOthers);
      say(`plan-which-${i}`, CHAT_C2.planWhich);
      said(`plan-pick-${i}`, plan.name);
      say(`plan-${i + 1}`, planCard(plan), true);
    });

    if (past("plan")) said("plan-said", CHAT_C2.planUse, change("plan"));
    else if (browsing) {
      said("plan-others-open", CHAT_C2.planOthers);
      say("plan-which-open", CHAT_C2.planWhich);
      const others = PLAN_TEMPLATES.filter((plan) => plan.id !== current.id);
      const pick = (label: string) => {
        const plan = others.find((p) => planName(p) === label || p.name === label);
        if (!plan) return;
        reply(() => {
          setBrowsing(false);
          setLooked((ids) => [...ids, plan.id]);
        });
      };
      ask = {
        label: CHAT_C2.planWhich,
        replies: others.map((plan) => ({ label: planName(plan) })),
        onReply: pick,
        placeholder: CHAT_C2.planOthers,
        voice: { full: others[0]?.name ?? "" },
        onSend: pick,
      };
    } else {
      const takePlan = () =>
        reply(() => {
          dispatch({
            type: "select-plan",
            planId: current.id,
            source: current.id === recommended.id ? "recommended" : "switched",
          });
          dispatch({ type: "go-to", step: "artifact" });
        });
      ask = {
        label: CHAT_C2.planLead,
        replies: [{ label: CHAT_C2.planUse }, { label: CHAT_C2.planOthers, quiet: true }],
        onReply: (label) => {
          if (label === CHAT_C2.planOthers) reply(() => setBrowsing(true));
          else takePlan();
        },
        placeholder: CHAT_C2.planUse,
        voice: CHAT_C2.voice.plan,
        onSend: takePlan,
      };
    }
  }

  /* ---- The Positioning Builder, a part at a time: each part's questions,
     then a draft of just that part to approve, then the whole story. */
  const inputs = a.positioning;
  const goal = goalFor(direction);
  const opener = openerFor(inputs, goal);

  /** A part's tone: its own changes, or where the part before it left off,
   *  so a tone set early carries forward but never reaches back into a part
   *  already approved. */
  function appliedFor(section: SectionId): string[] {
    const own = partApplied[section];
    if (own) return own;
    const index = NARRATIVE_SECTIONS.indexOf(section);
    return index > 0 ? appliedFor(NARRATIVE_SECTIONS[index - 1]) : [];
  }
  /** The part as generated, in a given tone. */
  function generated(section: SectionId, applied: readonly string[]): StorySegment[] {
    if (section === "bio") return bioFor(inputs, goal, "short");
    if (section === "opener") return opener?.segments ?? [];
    return narrativeFor(inputs, goal, applied)[PART_INDEX[section] ?? 0].segments;
  }
  /** The part as it stands now: the user's own words, or the draft. */
  function partSegments(section: SectionId): StorySegment[] {
    const own = inputs.edits[EDIT_KEY[section]];
    return own ? [{ text: own }] : generated(section, appliedFor(section));
  }
  /** The narrative as approved, part by part, for the finished story. */
  const storyParts = NARRATIVE_SECTIONS.map((section) => ({
    heading: POSITIONING_C1.parts[section === "doing" ? "doing" : section === "known" ? "known" : "toward"],
    segments: partSegments(section),
  }));
  const partTitle = (section: SectionId) =>
    section === "bio"
      ? CHAT_C2.draft.bioTitle
      : section === "opener"
        ? (opener?.kind ?? "")
        : POSITIONING_C1.parts[section === "doing" ? "doing" : section === "known" ? "known" : "toward"];
  const revisionsFor = (section: SectionId) => {
    const applied = appliedFor(section);
    return visibleRevisions("narrative", applied)
      .filter((option) => !applied.includes(option.id))
      .filter((option) => !WHOLE_STORY_ONLY.includes(option.id));
  };
  const draftCard = (key: string, section: SectionId, segments: StorySegment[], approved: boolean) =>
    say(
      key,
      <DraftSection
        eyebrow={CHAT_C2.draft.eyebrow}
        title={partTitle(section)}
        segments={segments}
        approvedLabel={approved ? CHAT_C2.draft.approved : undefined}
      />,
      true
    );

  if (reached("artifact")) {
    say("builder-lead", CHAT_C2.builderLead);
    const open = STEPS.findIndex((step) => !stepDone(step, inputs, state.skipped));
    const upTo = open === -1 ? STEPS.length - 1 : open;
    const set = (patch: Partial<PositioningInputs>) => dispatch({ type: "set-positioning", patch });
    /** After this change, is every part done? Then the whole story is built. */
    const finishIf = (patch: Partial<PositioningInputs>, skipped: readonly string[] = state.skipped) => {
      const next = { ...inputs, ...patch };
      if (STEPS.every((step) => stepDone(step, next, skipped))) {
        set({ built: true });
        withDelay("drafting", () => {});
      }
    };

    STEPS.slice(0, upTo + 1).forEach((step, i) => {
      const section = SECTIONS.find((s) => s.id === step.section)!;
      const firstOfSection = STEPS.findIndex((s) => s.section === step.section) === i;
      if (firstOfSection && section.intro) say(`sec-${section.id}`, section.intro);
      const done = stepDone(step, inputs, state.skipped);

      if (step.field) {
        const q = questionFor(step.field);
        say(
          `b-${q.field}`,
          q.hint ? (
            <>
              {q.question}
              <span className="chat-hint">{q.hint}</span>
            </>
          ) : (
            q.question
          )
        );
        if (done) said(`b-${q.field}-said`, builderAnswer(q, inputs, state.skipped), () => changeBuilder(i));
        return;
      }

      // A review. No opener to review: said so, and on.
      if (step.section === "opener" && !opener) {
        say("no-opener", CHAT_C2.noOpener);
        return;
      }
      // The first draft, then every edit and the version it sent back. Each
      // card keeps the version it showed; only the last is the one approved.
      const history = edits.filter((edit) => edit.section === step.section);
      const index = NARRATIVE_SECTIONS.indexOf(step.section);
      const firstTone = index > 0 ? appliedFor(NARRATIVE_SECTIONS[index - 1]) : [];
      // Before any edit here, a rewrite already saved is the draft to show.
      const saved = history.length ? undefined : inputs.edits[EDIT_KEY[step.section]];
      say(`draft-${step.section}-lead`, step.section === "bio" ? CHAT_C2.draft.bioLead : CHAT_C2.draft.lead);
      draftCard(
        `draft-${step.section}-0`,
        step.section,
        saved ? [{ text: saved }] : generated(step.section, firstTone),
        done && !history.length
      );
      history.forEach((edit, n) => {
        const last = n === history.length - 1;
        if (edit.kind === "revision") {
          said(`draft-${step.section}-${n}-ask`, edit.label);
          say(`draft-${step.section}-${n}-done`, CHAT_C2.revisedSection(edit.label));
          draftCard(`draft-${step.section}-${n + 1}`, step.section, generated(step.section, edit.applied), done && last);
        } else {
          said(`draft-${step.section}-${n}-ask`, edit.text);
          say(`draft-${step.section}-${n}-done`, CHAT_C2.draft.rewritten);
          draftCard(`draft-${step.section}-${n + 1}`, step.section, [{ text: edit.text }], done && last);
        }
      });
      if (done) said(`draft-${step.section}-said`, CHAT_C2.draft.approve);
    });

    const current = open === -1 ? null : STEPS[open];
    if (current && state.step === "artifact") {
      if (current.field) {
        const q = questionFor(current.field);
        const skip = () =>
          reply(() => {
            const skipped = [...state.skipped, skipId(q.field)];
            dispatch({ type: "note-skip", id: skipId(q.field) });
            finishIf({}, skipped);
          });
        const answer = (value: string) =>
          reply(() => {
            const patch: Partial<PositioningInputs> =
              q.field === "audience"
                ? { audience: value, showFirst: "narrative" }
                : ({ [q.field]: value } as Partial<PositioningInputs>);
            set(patch);
            finishIf(patch);
          });

        if (q.max) {
          // Pick several: each tap toggles, and "That's all" moves on. The
          // third pick moves on by itself. A typed strength is added as said.
          const picks = inputs.strengths;
          const pickTo = (next: string[]) => {
            if (next.length >= q.max!) reply(() => set({ strengths: next }));
            else {
              setDraft("");
              set({ strengths: next });
            }
          };
          ask = {
            label: q.question,
            replies: [
              ...(q.options ?? []).map((label) => ({ label, pressed: picks.includes(label) })),
              picks.length ? { label: B.strengths.done, quiet: true } : { label: CHAT_C2.skip, quiet: true },
            ],
            onReply: (label) => {
              if (label === B.strengths.done || label === CHAT_C2.skip) skip();
              else pickTo(picks.includes(label) ? picks.filter((p) => p !== label) : [...picks, label]);
            },
            placeholder: q.placeholder,
            voice: CHAT_C2.voice.strengths,
            onSend: (text) => pickTo([...picks, text]),
          };
        } else {
          const way = q.none ?? CHAT_C2.skip;
          ask = {
            label: q.question,
            replies: [...(q.options ?? []).map((label) => ({ label })), { label: way, quiet: true }],
            onReply: (label) => (label === way ? skip() : answer(label)),
            placeholder: q.placeholder,
            voice: CHAT_C2.voice[q.field],
            onSend: answer,
          };
        }
      } else {
        const section = current.section;
        const approve = () =>
          reply(() => {
            const patch = { approved: [...inputs.approved, section] };
            set(patch);
            finishIf(patch);
          });
        // A tone change on a part the user rewrote would throw their words
        // away, so after a rewrite only approving or rewriting again is offered.
        const tones =
          NARRATIVE_SECTIONS.includes(section) && !inputs.edits[EDIT_KEY[section]] ? revisionsFor(section) : [];
        ask =
          rewriting === section
            ? {
                label: CHAT_C2.draft.change,
                replies: [],
                onReply: () => {},
                placeholder: CHAT_C2.draft.changePlaceholder,
                voice: { full: segmentsToText(partSegments(section)), addition: "and I want it to sound like me." },
                // Their version comes back as the next draft, to review like any other.
                onSend: (text) =>
                  reply(() => {
                    setRewriting(null);
                    setEdits((all) => [...all, { section, kind: "rewrite", text }]);
                    set({ edits: { ...inputs.edits, [EDIT_KEY[section]]: text } });
                  }),
              }
            : {
                label: CHAT_C2.draft.lead,
                replies: [
                  { label: CHAT_C2.draft.approve },
                  ...tones.map((option) => ({ label: option.label })),
                  { label: CHAT_C2.draft.change, quiet: true },
                ],
                onReply: (label) => {
                  if (label === CHAT_C2.draft.approve) return approve();
                  if (label === CHAT_C2.draft.change) {
                    setRewriting(section);
                    setDraft(segmentsToText(partSegments(section)));
                    setFocusTick((tick) => tick + 1);
                    return;
                  }
                  const option = tones.find((o) => o.label === label);
                  if (!option) return;
                  reply(() => {
                    const applied = toggleRevision("narrative", appliedFor(section), option.id);
                    setPartApplied((all) => ({ ...all, [section]: applied }));
                    setEdits((all) => [...all, { section, kind: "revision", label: option.label, applied }]);
                  });
                },
                placeholder: CHAT_C2.draft.approve,
                voice: CHAT_C2.voice.approve,
                onSend: approve,
              };
      }
    }

    if (inputs.built && generating !== "drafting") {
      say("story-lead", CHAT_C2.storyLead);
      say(
        "story",
        <StorySummaryCard
          title={recommendedOutput()}
          parts={storyParts}
          also={CHAT_C2.storyAlso(opener?.kind ?? null)}
          detailsLabel={CHAT_C2.storyOpen}
          onDetails={() => setStoryOpen(true)}
        />,
        true
      );
      if (past("artifact")) said("story-said", CHAT_C2.save);
      else {
        const save = () =>
          reply(() => {
            dispatch({ type: "save-artifact" });
            dispatch({ type: "go-to", step: "complete" });
          });
        ask = {
          label: CHAT_C2.storyLead,
          replies: [{ label: CHAT_C2.save }],
          onReply: save,
          placeholder: CHAT_C2.save,
          voice: CHAT_C2.voice.save,
          onSend: save,
        };
      }
    }
  }

  /* ---- Stage 2 ends at the saved story. */
  if (past("artifact")) {
    say("stage-end", <span className="chat-hint">{CHAT_C2.stageEnd}</span>);
  }

  /** Confirming the read-back: ExecHQ puts the plan together. */
  function toPlan() {
    dispatch({ type: "next" });
    withDelay("planning", () => {});
  }

  /** The plan's own name for what it makes first. */
  function recommendedOutput() {
    const plan = planById(a.planId ?? "") ?? recommended;
    return plan?.thisWeek?.output ?? "The story of what you lead";
  }

  /** Changing a builder answer asks it, and everything after it, again:
   *  the later answers go, and so does every approval and rewrite from its
   *  part onward. */
  function changeBuilder(from: number) {
    const later = STEPS.slice(from);
    const fields = later.flatMap((step) => (step.field ? [step.field] : []));
    const cleared = Object.fromEntries(fields.map((field) => [field, emptyPositioning[field]]));
    const laterSkips = new Set(fields.map(skipId));
    const sections = SECTION_ORDER.slice(SECTION_ORDER.indexOf(STEPS[from].section));
    const keptEdits = Object.fromEntries(
      Object.entries(inputs.edits).filter(([key]) => !sections.some((section) => EDIT_KEY[section] === key))
    );
    restartFrom();
    // Parts before the change stay exactly as they were approved.
    const kept = (section: SectionId) => !sections.includes(section);
    setPartApplied(Object.fromEntries(Object.entries(partApplied).filter(([section]) => kept(section as SectionId))));
    setEdits(edits.filter((edit) => kept(edit.section)));
    dispatch({
      type: "jump",
      state: {
        ...state,
        step: "artifact",
        answers: {
          ...a,
          artifactSaved: false,
          positioning: {
            ...inputs,
            ...cleared,
            built: false,
            edits: keptEdits,
            approved: inputs.approved.filter((section) => !sections.includes(section as SectionId)),
          },
        },
        skipped: state.skipped.filter((id) => !laterSkips.has(id)),
      },
    });
  }

  /** The plan as a card, by decision on 2026-09-24 (option A): short enough
   *  to sit in the conversation, with the full plan one tap away. */
  function planCard(plan: PlanTemplate) {
    return (
      <PlanSummaryCard
        eyebrow={PLAN_C1.eyebrow}
        name={plan.name}
        formalName={plan.formalName}
        thisWeekLabel={PLAN_C1.thisWeek}
        thisWeek={plan.thisWeek?.title}
        toward={
          <>
            {plan.horizon}, toward <b>{towardFor(direction)}</b>
          </>
        }
        stages={plan.stages ?? []}
        nowLabel={PLAN_C1.now}
        detailsLabel={plan.horizon === "The next 12 weeks" ? CHAT_C2.planFullWeeks : CHAT_C2.planFull}
        onDetails={() => setSheetPlan(plan.id)}
      />
    );
  }

  /** Everything the card leaves out: Concept 1's starting point, in full. */
  function fullPlan(plan: PlanTemplate) {
    return (
      <div className="chat-plan-sheet">
        {/* Done sits at the top, where focus lands, so the sheet opens at its
            start rather than scrolled to a close button at the end. */}
        <div className="chat-plan-sheet__head">
          <div className="plan-summary__head">
            <p className="plan-summary__name">{plan.name}</p>
            {plan.formalName ? <p className="plan-summary__formal">{plan.formalName}</p> : null}
          </div>
          <button type="button" className="plan-summary__details" onClick={() => setSheetPlan(null)}>
            {CHAT_C2.planClose}
          </button>
        </div>
        <div className="plan-built">
          <p className="plan-built__label">{PLAN_C1.builtFrom}</p>
          <ul className="plan-built__tags">
            {builtFrom(direction, a.refinement).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
          <p className="plan-built__grows">{PLAN_C1.grows}</p>
        </div>
        {plan.thisWeek ? (
          <ThisWeekCard label={PLAN_C1.thisWeek} whyLabel={PLAN_C1.why} {...plan.thisWeek} />
        ) : null}
        {plan.stages?.length ? (
          <div className="plan-ahead">
            <p className="plan-ahead__toward">
              {plan.horizon}, toward <b>{towardFor(direction)}</b>
            </p>
            <PlanTimeline
              stages={plan.stages}
              nowLabel={PLAN_C1.now}
              doneLabel={PLAN_C1.doneWhen}
              after={plan.after}
            />
          </div>
        ) : null}
      </div>
    );
  }


  // The mic is on every question; what it "hears" follows the question. Called
  // here, once the question is known; the reply handlers above use it only
  // when tapped, never during render.
  const dictation = useDictation(draft, setDraft, (ask as Ask | null)?.voice ?? VOICE_SAMPLE);

  /* ---- Reveal: new messages land one at a time, ExecHQ's behind a typing
     indicator. A jump, or the first paint, shows everything at once. */
  const keys = messages.map((m) => m.key).join("|");
  const [reveal, setReveal] = useState({ keys, shown: messages.length, jump: jumpTick });
  // Adjusted during render, React's pattern for state that follows a change:
  // a conversation that grew by a few messages is revealed one at a time;
  // anything else — a jump, a changed answer — is shown as it stands.
  if (reveal.keys !== keys || reveal.jump !== jumpTick) {
    const grew =
      reveal.jump === jumpTick && keys.startsWith(reveal.keys) && messages.length - reveal.shown <= 6;
    setReveal({ keys, shown: grew ? reveal.shown : messages.length, jump: jumpTick });
  }
  const shown = Math.min(reveal.shown, messages.length);
  const nextFrom = messages[shown]?.from;

  useEffect(() => {
    if (!nextFrom) return;
    const timer = window.setTimeout(
      () => setReveal((r) => ({ ...r, shown: r.shown + 1 })),
      nextFrom === "advisor" ? TYPING_MS : 0
    );
    return () => window.clearTimeout(timer);
  }, [shown, nextFrom]);

  useEffect(() => {
    if (focusTick) inputRef.current?.focus();
  }, [focusTick]);

  // ExecHQ "thinking": reading the answers, planning, writing the story.
  const thinking = generating !== null;
  const revealing = shown < messages.length || thinking;
  const typingNow = thinking || (shown < messages.length && messages[shown].from === "advisor");

  // Keep the newest message in view.
  useEffect(() => {
    const thread = threadRef.current;
    if (!thread) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    thread.scrollTo({ top: thread.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [shown, typingNow]);

  const visible = messages.slice(0, shown);
  // While a story output is being hand-edited, the conversation waits.
  const showAsk = ask && !revealing && !storyEditing;

  return (
    <div className="chat">
      {started ? (
        // Once the conversation starts, the welcome folds into this small
        // header: the wordmark and the serif line, by decision on 2026-09-24.
        <header className="chat__head">
          <h1 className="chat__name" id={headingId} tabIndex={-1}>
            <Wordmark size="md" as="span" />
            <span className="u-visually-hidden">, {CHAT_C2.role}</span>
          </h1>
          <p className="chat__quote">{CHAT_C2.welcomeQuote}</p>
        </header>
      ) : null}

      <div
        className="chat__thread"
        ref={threadRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation with ExecHQ"
      >
        {started ? null : (
          <ChatWelcome
            title={CHAT_C2.welcomeTitle}
            quote={CHAT_C2.welcomeQuote}
            lede={CHAT_C2.welcomeLede}
            ask={CHAT_C2.welcomeAsk}
            headingId={headingId}
          />
        )}
        {visible.map((message, index) => (
          <ChatMessage
            key={message.key}
            from={message.from}
            // The mark and name open each run of ExecHQ's messages.
            lead={message.from === "advisor" && visible[index - 1]?.from !== "advisor"}
            card={message.card}
            onEdit={message.onEdit}
            editLabel={CHAT_C2.edit}
          >
            {message.content}
          </ChatMessage>
        ))}
        {typingNow ? (
          <ChatMessage from="advisor" typing lead={visible[visible.length - 1]?.from !== "advisor"} />
        ) : null}
      </div>

      <div className="chat__foot">
        {showAsk ? (
          <QuickReplies label={ask!.label} replies={ask!.replies} onChoose={ask!.onReply} />
        ) : null}
        <ChatComposer
          value={draft}
          onChange={(value) => {
            dictation.stop();
            setDraft(value);
          }}
          onSend={(text) => ask?.onSend(text)}
          placeholder={showAsk ? ask!.placeholder : ""}
          disabled={!showAsk}
          // The mic is always there; it rests while ExecHQ is writing.
          voice={{ listening: dictation.listening, onToggle: dictation.toggle }}
          micDisabled={!showAsk}
          inputRef={inputRef}
        />
      </div>

      <Sheet
        open={sheetPlan !== null}
        onClose={() => setSheetPlan(null)}
        label={planById(sheetPlan ?? "")?.name ?? ""}
      >
        {sheetPlan && planById(sheetPlan) ? fullPlan(planById(sheetPlan)!) : null}
      </Sheet>

      {/* The whole story, every output, with hand edits and export. */}
      <Sheet open={storyOpen} onClose={() => setStoryOpen(false)} label={recommendedOutput()}>
        {storyOpen ? (
          <div className="chat-plan-sheet">
            <div className="chat-plan-sheet__head">
              <p className="plan-summary__name">{recommendedOutput()}</p>
              <button type="button" className="plan-summary__details" onClick={() => setStoryOpen(false)}>
                {CHAT_C2.planClose}
              </button>
            </div>
            <StoryOutputs
              inputs={inputs}
              direction={direction}
              showFirst={inputs.showFirst as OutputKind}
              nextStage={(planById(a.planId ?? "") ?? flow.derived?.recommended)?.stages?.[1]?.title}
              edits={inputs.edits}
              onSaveEdit={(key, text) =>
                dispatch({ type: "set-positioning", patch: { edits: { ...inputs.edits, [key]: text } } })
              }
              onEditingChange={setStoryEditing}
              narrativeParts={storyParts}
            />
            <ExportLinks actions={STORY_EXPORTS} className="chat-story__export" />
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}

/** Answered, or deliberately passed. A pick-several question is answered
 *  once it is full or the user says that's all. */
function builderAnswered(q: BuilderQuestion, inputs: PositioningInputs, skipped: readonly string[]) {
  if (skipped.includes(skipId(q.field))) return true;
  if (q.max) return inputs.strengths.length >= q.max;
  return inputs[q.field] !== "";
}

/** What the user said, as their message reads back. */
function builderAnswer(q: BuilderQuestion, inputs: PositioningInputs, skipped: readonly string[]) {
  if (q.max) return inputs.strengths.length ? inputs.strengths.join(", ") : CHAT_C2.skipped;
  const value = inputs[q.field] as string;
  if (value) return value;
  return skipped.includes(skipId(q.field)) ? (q.none ?? CHAT_C2.skipped) : CHAT_C2.skipped;
}

export default OnboardingConcept2;
