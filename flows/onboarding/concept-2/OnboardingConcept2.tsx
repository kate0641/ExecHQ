"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { QuickReplies, type QuickReply } from "@/components/chat/QuickReplies";
import { Sheet } from "@/components/layout/Sheet";
import { DraftSection } from "@/components/onboarding/DraftSection";
import { LinkedInSteps } from "@/components/onboarding/LinkedInSteps";
import { PlanSummaryCard } from "@/components/onboarding/PlanSummaryCard";
import { PlanTimeline } from "@/components/onboarding/PlanTimeline";
import { ThisWeekCard } from "@/components/onboarding/ThisWeekCard";
import { Icon } from "@/components/primitives/Icon";
import { Wordmark } from "@/components/primitives/Wordmark";
import {
  linkedInIn,
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
  DONE_C1,
  DRAFT_C1,
  LINKEDIN_UPLOAD,
  PLAN_C1,
  PLAN_TEMPLATES,
  VOICE_SAMPLE,
  builtFrom,
  firstDraftFor,
  isSharpened,
  looksLikeLinkedInExport,
  planById,
  quickWinFor,
  readBack,
  refinementFor,
  towardFor,
  type PlanTemplate,
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

/** The whole intake, and its ending: Done, then Signals, as in Concept 1. */
const CHAT_STEPS: OnboardingStep[] = [
  "account",
  "privacy",
  "direction",
  "refinement",
  "interpretation",
  "plan",
  "artifact",
  "complete",
  "connect",
];
const STEP_NAV = stepNavItems(CHAT_STEPS).map((item) =>
  item.id === "artifact"
    ? { ...item, label: "Your story" }
    : item.id === "connect"
      ? { ...item, label: "Signals" }
      : item
);

/**
 * Sharpening the story's first draft: three questions, asked one at a time,
 * each skippable. By decision on 2026-09-28 they replace the Positioning
 * Builder's eight questions and five part reviews. The draft comes first, so
 * none of them is needed to have a story.
 */
type SharpenField = "role" | "own" | "result";
interface SharpenQuestion {
  field: SharpenField;
  question: string;
  placeholder: string;
}
const B = CHAT_C2.builder;
const SHARPEN: SharpenQuestion[] = [
  { field: "role", ...B.role },
  { field: "own", ...B.own },
  { field: "result", ...B.result },
];
const NO_FACTS = { role: "", own: "", result: "" };
/** Markers kept in `positioning.approved`: chose to sharpen, approved it. */
const CHOSE_SHARPEN = "sharpen";
const APPROVED_STORY = "story";
/** Where the user's own version of the story is kept. */
const DRAFT_EDIT = "draft";

/** Skips are kept with the flow's other skips, under their own prefix. */
const skipId = (field: SharpenField) => `positioning:${field}`;

/** Signals: the sources, and what happened in the conversation about them. */
type SignalId = "linkedin" | "website";
const SIGNAL_IDS: SignalId[] = ["linkedin", "website"];
type SignalEvent =
  | { type: "pick"; id: SignalId }
  /** A file attached for LinkedIn; `ok` is false when it is not an export. */
  | { type: "file"; name: string; ok: boolean }
  | { type: "sent" }
  | { type: "link"; id: SignalId; link: string }
  | { type: "end"; label: string };

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
  // The plan open in the sheet, if any.
  const [sheetPlan, setSheetPlan] = useState<string | null>(null);
  // The story: every version the user wrote in their own words, in order,
  // and whether they are writing one now.
  const [rewrites, setRewrites] = useState<string[]>([]);
  const [rewriting, setRewriting] = useState(false);
  // Signals: the conversation so far, and a connection in progress.
  const [signalLog, setSignalLog] = useState<SignalEvent[]>([]);
  // The LinkedIn spreadsheet's picker, opened from a reply or the composer.
  const fileInputId = useId();
  // Reading finishes in the background. When it does, the thread says so
  // once, where it had got to: how far the signals conversation was is kept
  // at that moment, so the message holds its place from then on.
  const [readyAt, setReadyAt] = useState<number | null>(null);
  const uploaded = signalLog.some((event) => event.type === "file" && event.ok);
  if (state.answers.linkedin.status === "ready" && uploaded && readyAt === null) {
    setReadyAt(signalLog.length);
  }
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  /** A jump or a changed answer: the thread re-forms from the new state. */
  function restartFrom() {
    setDraft("");
    setChanging(false);
    setLooked([]);
    setBrowsing(false);
    setSheetPlan(null);
    setRewrites([]);
    setRewriting(false);
    setSignalLog([]);
    setReadyAt(null);
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
    // Why this comes first, before it is asked. By decision on 2026-09-28.
    say("direction-lead", CHAT_C2.directionLead);
    say("direction-why", CHAT_C2.directionWhy);
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
          withDelay("drafting", () => {});
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

  /* ---- The story: a first draft, handed over, then the choice to use it
     as it is or sharpen it. Sharpening is three questions and one review. */
  const inputs = a.positioning;
  const S2 = CHAT_C2.storyDraft;
  const storyPlan = planById(a.planId ?? "") ?? recommended;
  const chose = inputs.approved.includes(CHOSE_SHARPEN);
  const sharpened = isSharpened(inputs);
  const set = (patch: Partial<PositioningInputs>) => dispatch({ type: "set-positioning", patch });
  const saveStory = () =>
    reply(() => {
      dispatch({ type: "save-artifact" });
      dispatch({ type: "go-to", step: "complete" });
    });
  const storyCard = (key: string, text: string, eyebrow: string, approved: boolean) =>
    say(
      key,
      <DraftSection
        eyebrow={eyebrow}
        title={S2.title}
        segments={[{ text }]}
        approvedLabel={approved ? CHAT_C2.draft.approved : undefined}
        usesLabel={DRAFT_C1.usesLabel}
        uses={storyPlan?.uses}
      />,
      true
    );

  if (reached("artifact") && generating !== "drafting") {
    say("story-lead", S2.lead);
    storyCard(
      "story-draft",
      firstDraftFor(direction, a.refinement, NO_FACTS),
      S2.eyebrow,
      past("artifact") && !chose
    );
    say("story-offer", S2.offer);

    if (!chose) {
      if (past("artifact")) said("story-as-is", S2.asIs, change("artifact"));
      else
        ask = {
          label: S2.offer,
          replies: [{ label: S2.asIs }, { label: S2.sharpen }],
          onReply: (label) => {
            if (label === S2.sharpen) reply(() => set({ approved: [...inputs.approved, CHOSE_SHARPEN] }));
            else saveStory();
          },
          placeholder: S2.asIs,
          voice: CHAT_C2.voice.asIs,
          onSend: saveStory,
        };
    } else {
      said("story-sharpen", S2.sharpen, change("artifact"));
      say("sharpen-lead", S2.sharpenLead);
      const open = SHARPEN.findIndex((q) => !sharpenAnswered(q, inputs, state.skipped));
      const upTo = open === -1 ? SHARPEN.length - 1 : open;
      SHARPEN.slice(0, upTo + 1).forEach((q, i) => {
        say(`s-${q.field}`, q.question);
        if (sharpenAnswered(q, inputs, state.skipped)) {
          said(`s-${q.field}-said`, inputs[q.field] || CHAT_C2.skipped, () => changeSharpen(i));
        }
      });

      if (open !== -1 && state.step === "artifact") {
        const q = SHARPEN[open];
        ask = {
          label: q.question,
          replies: [{ label: CHAT_C2.skip, quiet: true }],
          onReply: () => reply(() => dispatch({ type: "note-skip", id: skipId(q.field) })),
          placeholder: q.placeholder,
          voice: CHAT_C2.voice[q.field],
          onSend: (value) => reply(() => set({ [q.field]: value.trim() })),
        };
      }

      if (open === -1) {
        // The sharpened draft, then every version the user wrote, each card
        // keeping what it showed. Only the last is the one approved.
        const approvedStory = inputs.approved.includes(APPROVED_STORY);
        const saved = rewrites.length ? undefined : inputs.edits[DRAFT_EDIT];
        say("sharpen-review", sharpened ? S2.review : S2.unchanged);
        storyCard(
          "story-sharpened",
          saved ?? firstDraftFor(direction, a.refinement, inputs),
          sharpened ? S2.sharpenedEyebrow : S2.eyebrow,
          approvedStory && !rewrites.length
        );
        rewrites.forEach((text, n) => {
          said(`story-rewrite-${n}`, text);
          say(`story-rewrite-${n}-done`, CHAT_C2.draft.rewritten);
          storyCard(`story-rewrite-${n}-card`, text, S2.sharpenedEyebrow, approvedStory && n === rewrites.length - 1);
        });

        if (approvedStory) said("story-approved", CHAT_C2.draft.approve);
        else if (state.step === "artifact") {
          const approve = () => {
            set({ approved: [...inputs.approved, APPROVED_STORY] });
            saveStory();
          };
          const current = inputs.edits[DRAFT_EDIT] ?? firstDraftFor(direction, a.refinement, inputs);
          ask = rewriting
            ? {
                label: CHAT_C2.draft.change,
                replies: [],
                onReply: () => {},
                placeholder: CHAT_C2.draft.changePlaceholder,
                voice: { full: current, addition: "and I want it to sound like me." },
                // Their version comes back as the next draft, to review like any other.
                onSend: (text) =>
                  reply(() => {
                    setRewriting(false);
                    setRewrites((all) => [...all, text]);
                    set({ edits: { ...inputs.edits, [DRAFT_EDIT]: text } });
                  }),
              }
            : {
                label: sharpened ? S2.review : S2.unchanged,
                replies: [{ label: CHAT_C2.draft.approve }, { label: CHAT_C2.draft.change, quiet: true }],
                onReply: (label) => {
                  if (label === CHAT_C2.draft.change) {
                    setRewriting(true);
                    setDraft(current);
                    setFocusTick((tick) => tick + 1);
                    return;
                  }
                  approve();
                },
                placeholder: CHAT_C2.draft.approve,
                voice: CHAT_C2.voice.approve,
                onSend: approve,
              };
        }
      }
    }
  }

  /* ---- The ending: the win, said and shown, then signals as an optional
     extra, as in Concept 1. Home is always one tap away. */
  // Done and Signals both sit after the story in the step order; which one
  // the user is on decides whether the invitation has been taken up.
  const ended = past("artifact");
  const inSignals = state.step === "connect";
  if (ended) {
    const plan = planById(a.planId ?? "") ?? recommended;
    say("done-lead", CHAT_C2.doneLead);
    say(
      "done",
      <div className="chat-readback">
        <p className="chat-done__title">{DONE_C1.title}</p>
        <ul className="done-saved">
          {plan ? (
            <li>
              <Icon name="check" size={18} />
              {DONE_C1.planPrefix} {plan.name}
            </li>
          ) : null}
          <li>
            <Icon name="check" size={18} />
            {sharpened ? DONE_C1.storySharpened : DONE_C1.storyDraft}
          </li>
        </ul>
        <p className="chat-hint">{DONE_C1.hint}</p>
      </div>,
      true
    );
    // What comes next on the plan: sharpening, if the draft was used as it
    // was, or the bio once the story is sharpened.
    const win = quickWinFor(plan, sharpened);
    say(
      "done-next",
      <>
        <b>
          {DONE_C1.nextLabel}: {win.title.toLowerCase()}.
        </b>{" "}
        {win.detail}
      </>
    );
    say("done-invite", CHAT_C2.doneInvite);
    if (inSignals) said("done-said", CHAT_C2.doneSignals);
    else
      ask = {
        label: CHAT_C2.doneInvite,
        replies: [{ label: CHAT_C2.doneSignals }, { label: CHAT_C2.doneHome, quiet: true }],
        onReply: (label) => {
          if (label === CHAT_C2.doneHome) return router.push(DONE_C1.homeHref);
          reply(() => dispatch({ type: "go-to", step: "connect" }));
        },
        placeholder: CHAT_C2.doneSignals,
        voice: CHAT_C2.voice.signals,
        onSend: () => reply(() => dispatch({ type: "go-to", step: "connect" })),
      };
  }

  /* ---- Signals: which source, then bring it in. LinkedIn is an upload of
     the analytics spreadsheet the user exports, by decision on 2026-09-28:
     the steps arrive as a card, the file as the user's own message, and
     ExecHQ says when it has been read. The website is added by link. What
     is brought in, and what it is for, is said before anything is asked. */
  let attach: { label: string; onAttach: () => void } | undefined;
  if (inSignals) {
    const S = CHAT_C2.signals;
    const U = LINKEDIN_UPLOAD;
    const title = (id: SignalId) => (id === "linkedin" ? S.linkedin : S.website);
    const isOn = (id: SignalId) =>
      id === "linkedin" ? linkedInIn(a.linkedin) : a.connections[id] === "connected" || Boolean(a.signalLinks[id]);
    type Mode = "choose" | "more" | "upload" | "link-website" | "ended";
    // Widened: the replay below sets it inside a callback, out of the checker's sight.
    let mode = "choose" as Mode;
    // What has been dealt with so far, as the thread replays: brought in, or
    // (for LinkedIn) emailed for later. Each "anything else?" is asked from
    // where the thread was, not from where it is now.
    const dealt = new Set<SignalId>();
    const moveOn = (k: string) => {
      if (SIGNAL_IDS.every((id) => dealt.has(id))) {
        say(`${k}-all`, S.end);
        mode = "ended";
      } else {
        say(`${k}-more`, S.more);
        mode = "more";
      }
    };
    say("sig-which", S.which);
    signalLog.forEach((event, i) => {
      const k = `sig-${i}`;
      // The file finished reading here: said once, where the thread was.
      if (i === readyAt) say("sig-ready", S.ready);
      if (event.type === "pick") {
        said(k, title(event.id));
        if (event.id === "linkedin") {
          say(`${k}-what`, S.linkedinWhat);
          say(`${k}-steps`, <LinkedInSteps label={U.stepsLabel} steps={U.steps} linkNote={U.linkNote} />, true);
          mode = "upload";
        } else {
          say(`${k}-ask`, S.websiteAsk);
          mode = "link-website";
        }
      } else if (event.type === "file") {
        said(
          k,
          <span className="chat-file">
            <span className="linkedin-file__mark" aria-hidden="true">
              {fileKind(event.name)}
            </span>
            <span className="chat-file__name">{event.name}</span>
          </span>
        );
        if (event.ok) {
          say(`${k}-reading`, S.reading);
          dealt.add("linkedin");
          moveOn(k);
        } else {
          say(`${k}-wrong`, U.status.wrongFile);
          mode = "upload";
        }
      } else if (event.type === "sent") {
        said(k, S.emailSteps);
        say(`${k}-sent`, U.status.sent(a.email || "your email"));
        dealt.add("linkedin");
        moveOn(k);
      } else if (event.type === "link") {
        said(k, event.link);
        say(`${k}-added`, S.added);
        dealt.add(event.id);
        moveOn(k);
      } else {
        said(k, event.label);
        say(`${k}-end`, SIGNAL_IDS.some(isOn) || a.linkedin.status === "sent" ? S.end : S.endNone);
        mode = "ended";
      }
    });
    if (readyAt === signalLog.length) say("sig-ready", S.ready);
    const left = SIGNAL_IDS.filter((id) => !dealt.has(id));

    const log = (event: SignalEvent) => setSignalLog((all) => [...all, event]);
    const finish = (label: string) => reply(() => log({ type: "end", label }));
    const addLink = (id: SignalId) => (text: string) =>
      reply(() => {
        const link = text.trim();
        if (!link) return;
        dispatch({ type: "set-signal-link", id, link });
        dispatch({ type: "set-connection", id, state: "connected" });
        log({ type: "link", id, link });
      });

    if (mode === "choose" || mode === "more") {
      const pick = (label: string) => {
        const id = SIGNAL_IDS.find((source) => title(source) === label);
        if (id) reply(() => log({ type: "pick", id }));
        else finish(label);
      };
      ask = {
        label: mode === "choose" ? S.which : S.more,
        replies: [
          ...left.map((id) => ({ label: title(id) })),
          { label: mode === "choose" ? S.notNow : S.thatsAll, quiet: true },
        ],
        onReply: pick,
        placeholder: S.which,
        voice: { full: title(left[0] ?? "linkedin") },
        onSend: pick,
      };
    } else if (mode === "upload") {
      const choose = () => document.getElementById(fileInputId)?.click();
      attach = { label: S.attach, onAttach: choose };
      ask = {
        label: S.linkedinWhat,
        replies: [{ label: S.upload }, { label: S.emailSteps }, { label: S.notNow, quiet: true }],
        onReply: (label) => {
          if (label === S.notNow) return finish(label);
          if (label === S.emailSteps)
            return reply(() => {
              dispatch({ type: "set-linkedin", patch: { status: "sent" } });
              log({ type: "sent" });
            });
          choose();
        },
        placeholder: S.uploadPlaceholder,
        voice: { full: S.upload },
        // A typed message is not a file: the picker is the way to send one.
        onSend: choose,
      };
    } else if (mode === "link-website") {
      ask = {
        label: S.websiteAsk,
        replies: [{ label: S.notNow, quiet: true }],
        onReply: finish,
        placeholder: S.websitePlaceholder,
        voice: CHAT_C2.voice.website,
        onSend: addLink("website"),
      };
    } else if (mode === "ended") {
      ask = {
        label: CHAT_C2.doneHome,
        replies: [{ label: CHAT_C2.doneHome }],
        onReply: () => router.push(DONE_C1.homeHref),
        placeholder: CHAT_C2.doneHome,
        voice: { full: CHAT_C2.doneHome },
        onSend: () => router.push(DONE_C1.homeHref),
      };
    }
  }

  /** Confirming the read-back: ExecHQ puts the plan together. */
  function toPlan() {
    dispatch({ type: "next" });
    withDelay("planning", () => {});
  }

  /** Changing a sharpen answer asks it, and everything after it, again. The
   *  review, and any version the user wrote, go with them. */
  function changeSharpen(from: number) {
    const fields = SHARPEN.slice(from).map((q) => q.field);
    const cleared = Object.fromEntries(fields.map((field) => [field, ""]));
    const laterSkips = new Set(fields.map(skipId));
    const edits = { ...inputs.edits };
    delete edits[DRAFT_EDIT];
    restartFrom();
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
            edits,
            approved: inputs.approved.filter((marker) => marker !== APPROVED_STORY),
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
        detailsLabel={CHAT_C2.planFull}
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
  const showAsk = ask && !revealing;

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
        {/* The LinkedIn spreadsheet's picker. Only the name is kept: in the
            prototype nothing is read or sent. */}
        <input
          id={fileInputId}
          type="file"
          className="u-visually-hidden"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            const ok = looksLikeLinkedInExport(file.name);
            reply(() => {
              dispatch({
                type: "set-linkedin",
                patch: { fileName: file.name, status: ok ? "reading" : "wrong-file" },
              });
              setSignalLog((all) => [...all, { type: "file", name: file.name, ok }]);
            });
          }}
        />
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
          attach={showAsk ? attach : undefined}
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

    </div>
  );
}

/** A file's kind, as its mark shows it: the extension, e.g. "XLSX". */
function fileKind(name: string): string {
  const ext = name.includes(".") ? name.split(".").pop() ?? "" : "";
  return ext.slice(0, 4).toUpperCase() || "FILE";
}

/** Answered, or deliberately passed. */
function sharpenAnswered(q: SharpenQuestion, inputs: PositioningInputs, skipped: readonly string[]) {
  return skipped.includes(skipId(q.field)) || inputs[q.field] !== "";
}

export default OnboardingConcept2;
