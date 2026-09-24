"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatWelcome } from "@/components/chat/ChatWelcome";
import { Wordmark } from "@/components/primitives/Wordmark";
import { QuickReplies, type QuickReply } from "@/components/chat/QuickReplies";
import {
  stepIndex,
  stepNavItems,
  useDictation,
  useOnboardingFlow,
  type OnboardingStep,
} from "@/flows/onboarding/shared";
import { useStepNav } from "@/lib/step-nav";
import {
  CHAT_C2,
  DIRECTION_PROMPTS_C1,
  VOICE_SAMPLE,
  readBack,
  refinementFor,
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

/** Stage 1 builds the conversation up to the read-back. */
const CHAT_STEPS: OnboardingStep[] = ["account", "privacy", "direction", "refinement", "interpretation"];
const STEP_NAV = stepNavItems(CHAT_STEPS);

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
  const inputRef = useRef<HTMLInputElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useStepNav(STEP_NAV, CHAT_STEPS.includes(state.step) ? state.step : "interpretation", (id) => {
    setDraft("");
    setChanging(false);
    setJumpTick((tick) => tick + 1);
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
    setDraft("");
    setChanging(false);
    setJumpTick((tick) => tick + 1);
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
              reply(() => dispatch({ type: "next" }));
            },
            placeholder: CHAT_C2.confirm,
            voice: CHAT_C2.voice.confirm,
            onSend: () => reply(() => dispatch({ type: "next" })),
          };
  }

  /* ---- Stage 1 ends at the read-back. */
  if (past("interpretation")) {
    say("stage-end", <span className="chat-hint">{CHAT_C2.stageEnd}</span>);
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

  const revealing = shown < messages.length || generating === "interpreting";
  const typingNow =
    generating === "interpreting" || (shown < messages.length && messages[shown].from === "advisor");

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
    </div>
  );
}

export default OnboardingConcept2;
