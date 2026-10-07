"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { QuickReplies } from "@/components/chat/QuickReplies";
import { AdvisorWho, ConciergePanel } from "@/components/navigation/ConciergePanel";
import { ConciergePill } from "@/components/navigation/ConciergePill";
import { Icon, type IconName } from "@/components/primitives/Icon";
import { EntryLink } from "@/components/homepage/EntryLink";
import {
  respond,
  suggestions,
  understand,
  type AdvisorTurn,
  type ConciergeAction,
  type ConciergeContext,
  type ConciergeEffect,
  type ConciergeReply,
} from "@/lib/concierge";
import { nextFollowUp, shortDate } from "@/lib/loop";
import {
  currentSnapshot,
  getLoopState,
  loopActions,
  nextStepAfter,
  useLoop,
} from "@/lib/loop-store";
import { conceptHref, type NavDestination } from "@/lib/manifest";
import { useViewport } from "@/lib/viewport-context";
import { CONCIERGE_COPY as C } from "@/mock/concierge";
import type { NavConceptProps } from "../types";

/**
 * Navigation Concept 1 — Concierge.
 *
 * The onboarding advisor on every signed-in page. One pill, "Ask or go",
 * floating above the foot of the screen on phone, tablet and web. On the phone
 * it opens a sheet that rises over the page. On tablet and web the pill grows
 * into a centred card over a soft scrim, so it opens from where it sits and
 * the page never moves.
 *
 * Type a destination and he takes you there. Type anything else and he
 * answers — scripted, from `lib/concierge.ts` — and what he does is real:
 * answering a follow-up, marking something used or taking up a next step
 * changes the Loop, so Home, the statuses and the dot all follow.
 */

const TOOLBOX = conceptHref("toolbox-flow", "concept-1");
const PANEL_ID = "concierge-panel";
const PILL_ID = "concierge-pill";
/** How long he takes to reply. Instant under reduced motion. */
const TYPING_MS = 650;
/** A beat between "Here's your plan." and actually going. */
const GO_MS = 350;

const ICONS: Record<string, IconName> = {
  homepage: "home",
  plan: "flag",
  signals: "trend-up",
  toolbox: "pencil",
  "daily-briefing": "calendar",
  profile: "person",
};

/* -----------------------------------------------------------------------------
   The conversation, kept for the tab's life so it survives moving between
   pages. Shared by the pill in the header and the panel in the nav slot.
   -------------------------------------------------------------------------- */

type Message = { id: number; from: "you"; text: string } | { id: number; from: "advisor"; turn: AdvisorTurn };

interface ConciergeState {
  open: boolean;
  messages: Message[];
  typing: boolean;
  asked?: "follow-up";
}

let state: ConciergeState = { open: false, messages: [], typing: false };
let nextId = 1;
const listeners = new Set<() => void>();
function update(change: Partial<ConciergeState>) {
  state = { ...state, ...change };
  for (const listener of listeners) listener();
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const SERVER_STATE: ConciergeState = { open: false, messages: [], typing: false };
const useConcierge = () => useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);

/**
 * Opens the chat on a question, from anywhere on the page: a step's "Why now?", say. The question
 * is queued and the panel's own conversation asks it once it is open, so it is answered the same
 * way as anything she types.
 */
let queued: { label: string; action: ConciergeAction } | null = null;
export function askConcierge(label: string, action: ConciergeAction): void {
  queued = { label, action };
  update({ open: true });
}

/** Whether focus should go back to the pill when the panel closes. */
let returnFocus = false;
function closePanel(focusPill = true) {
  returnFocus = focusPill;
  update({ open: false });
}

/** The Loop as it stands this moment, read fresh when he replies. */
function contextNow(destinations: NavDestination[]): ConciergeContext {
  const snapshot = currentSnapshot(getLoopState());
  return {
    snapshot,
    followUp: nextFollowUp(snapshot.records, snapshot.today),
    nextStep: snapshot.recommendations[0],
    destinations,
    nextStepAfter,
  };
}

function applyEffect(effect: ConciergeEffect | undefined, go: (href: string) => void) {
  if (!effect) return;
  switch (effect.kind) {
    case "go":
      go(effect.href);
      break;
    case "answer":
      loopActions.answer(effect.recordId, { type: effect.outcome, detail: effect.detail });
      break;
    case "mark-used":
      loopActions.markUsed(effect.recordId, { checkBackDays: effect.days });
      break;
    case "take-next":
      loopActions.takeNextStep(effect.recordId);
      break;
    case "set-aside":
      loopActions.setNextStepAside(effect.recordId);
      break;
  }
}

/* -----------------------------------------------------------------------------
   The pill
   -------------------------------------------------------------------------- */

function Pill({ destinations, currentFlow }: NavConceptProps) {
  const { open } = useConcierge();
  const loop = useLoop();
  const here = destinations.find((d) => d.flowSlug === currentFlow);
  return (
    <ConciergePill
      id={PILL_ID}
      here={{ label: here?.label ?? "Home", icon: ICONS[currentFlow] ?? "home" }}
      ask={C.pillAsk}
      followUpDue={Boolean(loop.followUp)}
      expanded={open}
      controls={PANEL_ID}
      onClick={() => (open ? closePanel() : update({ open: true }))}
    />
  );
}

/* -----------------------------------------------------------------------------
   The panel
   -------------------------------------------------------------------------- */

/** The floating pill, and what it opens: a sheet on the phone, a card on
 *  tablet and web. Drawn on the device screen, over the page. */
export function ConciergeNav(props: NavConceptProps) {
  const { viewport } = useViewport();
  const concierge = useConcierge();
  const anchor = useRef<HTMLSpanElement>(null);
  const [screen, setScreen] = useState<HTMLElement | null>(null);
  const mobile = viewport === "mobile";

  useEffect(() => {
    setScreen(anchor.current?.closest<HTMLElement>(".device__screen") ?? null);
  }, []);

  // Tell the screen what is showing, so the page can leave room for the
  // floating pill. Open, the sheet or card is modal: the page behind is inert
  // and Escape closes it.
  useEffect(() => {
    if (!screen) return;
    screen.setAttribute("data-concierge", concierge.open ? "open" : "closed");
    const content = screen.querySelector<HTMLElement>(".device__content");
    const modal = concierge.open;
    if (content) content.inert = modal;
    if (!concierge.open) {
      if (returnFocus) document.getElementById(PILL_ID)?.focus();
      returnFocus = false;
      return;
    }
    screen.querySelector<HTMLInputElement>(`#${PANEL_ID} .chat-composer__field`)?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closePanel();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (content) content.inert = false;
    };
  }, [screen, concierge.open]);

  useEffect(() => {
    return () => {
      screen?.removeAttribute("data-concierge");
    };
  }, [screen]);

  return (
    <>
      <span ref={anchor} hidden />
      {screen
        ? createPortal(
            <div className={`concierge-host concierge-host--${mobile ? "mobile" : "card"}`}>
              <div className="concierge-host__pill">
                <Pill {...props} />
              </div>
              <button
                type="button"
                className="concierge-host__scrim"
                tabIndex={-1}
                aria-hidden="true"
                onClick={() => closePanel()}
              />
              <div className="concierge-host__panel" inert={!concierge.open}>
                <Conversation {...props} mode={mobile ? "sheet" : "card"} />
              </div>
            </div>,
            screen
          )
        : null}
    </>
  );
}

function Conversation({ destinations, currentFlow, mode }: NavConceptProps & { mode: "sheet" | "card" }) {
  const router = useRouter();
  const concierge = useConcierge();
  const loop = useLoop();
  const [draft, setDraft] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const chatting = concierge.messages.length > 0;
  const ctx: ConciergeContext = {
    snapshot: loop,
    followUp: loop.followUp,
    nextStep: loop.nextStep,
    destinations,
    nextStepAfter,
  };

  // Keep the latest message in view. The panel's body is what scrolls.
  useEffect(() => {
    const scroller = bodyRef.current?.parentElement;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [concierge.messages.length, concierge.typing]);

  function go(href: string) {
    // The sheet or card makes way for the page he is taking you to.
    closePanel(false);
    router.push(href);
  }

  /** How many of his last turns, in a row, were misses. */
  function recentMisses(): number {
    let count = 0;
    for (let i = state.messages.length - 1; i >= 0; i--) {
      const m = state.messages[i];
      if (m.from === "you") continue;
      if (!m.turn.miss) break;
      count++;
    }
    return count;
  }

  function send(text: string, chosen?: ConciergeAction) {
    if (state.typing) return;
    const action = chosen ?? understand(text, contextNow(destinations), state.asked, recentMisses());
    const you: Message = { id: nextId++, from: "you", text };
    if (action.kind === "go") {
      const { turn, effect } = respond(action, contextNow(destinations));
      update({ messages: [...state.messages, you, { id: nextId++, from: "advisor", turn }], asked: undefined });
      setTimeout(() => applyEffect(effect, go), GO_MS);
      return;
    }
    update({ messages: [...state.messages, you], typing: true });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => {
      // Read the Loop now, not when the message was sent.
      const { turn, effect } = respond(action, contextNow(destinations));
      applyEffect(effect, go);
      update({
        messages: [...state.messages, { id: nextId++, from: "advisor", turn }],
        typing: false,
        asked: turn.asked,
      });
    }, reduce ? 0 : TYPING_MS);
  }

  function choose(reply: ConciergeReply) {
    send(reply.label, reply.action);
  }

  // A question asked from the page: put it to him once the panel is open.
  useEffect(() => {
    if (!concierge.open || !queued) return;
    const { label, action } = queued;
    queued = null;
    send(label, action);
    // send reads the live conversation, so it is not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concierge.open]);

  // Typing a place offers to go straight there.
  const typed = draft.trim().toLowerCase().replace(/^(go to|open)\s+/, "");
  const goTo =
    typed.length > 1 ? destinations.find((d) => d.label.toLowerCase().startsWith(typed)) : undefined;

  const last = concierge.messages[concierge.messages.length - 1];
  const replies = !concierge.typing && last?.from === "advisor" ? last.turn.replies ?? [] : [];

  return (
    <ConciergePanel
      id={PANEL_ID}
      mode={mode}
      name={C.name}
      role={C.role}
      whoInHead={chatting}
      newLabel={C.newConversation}
      closeLabel={C.close}
      onNew={chatting ? () => update({ messages: [], asked: undefined }) : undefined}
      onClose={() => closePanel()}
      className={chatting ? "is-chatting" : undefined}
      footer={
        <>
          {replies.length ? (
            <QuickReplies
              label="Answers"
              replies={replies.map((r) => ({ label: r.label }))}
              onChoose={(label) => {
                const reply = replies.find((r) => r.label === label);
                if (reply) choose(reply);
              }}
            />
          ) : null}
          {goTo ? (
            <button
              type="button"
              className="concierge-go"
              onClick={() => {
                setDraft("");
                send(draft.trim(), { kind: "go", flow: goTo.flowSlug });
              }}
            >
              <Icon name={ICONS[goTo.flowSlug] ?? "home"} size={18} />
              {C.goHint(goTo.label)}
              <kbd>Enter</kbd>
            </button>
          ) : null}
          <ChatComposer
            value={draft}
            onChange={setDraft}
            placeholder={C.placeholder}
            disabled={concierge.typing}
            onSend={(value) => {
              setDraft("");
              send(value, goTo ? { kind: "go", flow: goTo.flowSlug } : undefined);
            }}
        />
        </>
      }
    >
      <div className="concierge-body" ref={bodyRef}>
        {chatting ? (
          <>
            <ul className="concierge-mini" aria-label={C.goTo}>
              {destinations.map((d) => (
                <li key={d.flowSlug}>
                  <Link
                    href={d.href}
                    className={d.flowSlug === currentFlow ? "is-current" : undefined}
                    aria-current={d.flowSlug === currentFlow ? "page" : undefined}
                    onClick={() => closePanel(false)}
                  >
                    <Icon name={ICONS[d.flowSlug] ?? "home"} size={16} />
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="concierge-thread" role="log" aria-label="Conversation">
              {concierge.messages.map((m, i) => {
                const prev = concierge.messages[i - 1];
                if (m.from === "you") return <ChatMessage key={m.id} from="you">{m.text}</ChatMessage>;
                return (
                  <ChatMessage key={m.id} from="advisor" lead={prev?.from !== "advisor"} card={Boolean(m.turn.card)}>
                    <Turn turn={m.turn} />
                  </ChatMessage>
                );
              })}
              {concierge.typing ? <ChatMessage from="advisor" lead typing /> : null}
            </div>
          </>
        ) : (
          <Start destinations={destinations} currentFlow={currentFlow} ctx={ctx} onAsk={choose} />
        )}
      </div>
    </ConciergePanel>
  );
}

function Turn({ turn }: { turn: AdvisorTurn }) {
  return (
    <>
      {turn.paragraphs.map((p, i) => (
        <p key={`p${i}`}>{p}</p>
      ))}
      {turn.list ? (
        <ol className="concierge-list">
          {turn.list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      ) : null}
      {turn.after?.map((p, i) => (
        <p key={`a${i}`}>{p}</p>
      ))}
      {turn.card ? (
        <div className="concierge-card">
          <b>{turn.card.title}</b>
          <span>{turn.card.body}</span>
        </div>
      ) : null}
    </>
  );
}

/** Before anything is asked: where to go, the draft in hand, then the advisor and what to ask. */
function Start({
  destinations,
  currentFlow,
  ctx,
  onAsk,
}: {
  destinations: NavDestination[];
  currentFlow: string;
  ctx: ConciergeContext;
  onAsk: (reply: ConciergeReply) => void;
}) {
  const loop = useLoop();
  const resume = [...loop.records]
    .filter((r) => r.state === "drafted" || r.state === "in-progress")
    .sort((a, b) => (a.history.at(-1)!.on < b.history.at(-1)!.on ? 1 : -1))[0];
  const resumeLast = resume?.history.at(-1);
  return (
    <div className="concierge-start">
      <section aria-labelledby="concierge-goto">
        <h2 id="concierge-goto" className="concierge-start__title">{C.goTo}</h2>
        <ul className="concierge-dests">
          {destinations.map((d) => (
            <li key={d.flowSlug}>
              <Link
                href={d.href}
                className={["concierge-dest", d.flowSlug === currentFlow ? "is-current" : null].filter(Boolean).join(" ")}
                aria-current={d.flowSlug === currentFlow ? "page" : undefined}
                onClick={() => closePanel(false)}
              >
                <Icon name={ICONS[d.flowSlug] ?? "home"} size={20} />
                <span>{d.label}</span>
                {d.flowSlug === "homepage" && loop.followUp ? (
                  <>
                    <span className="concierge-dest__dot" aria-hidden="true" />
                    <span className="u-visually-hidden">, a follow-up is waiting</span>
                  </>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {resume && resumeLast ? (
        <EntryLink
          href={TOOLBOX}
          icon="draft"
          eyebrow={C.resumeEyebrow}
          title={resume.title}
          detail={`${resumeLast.type === "drafted" ? "Drafted" : "Edited"} ${shortDate(resumeLast.on)}`}
          onClick={() => closePanel(false)}
        />
      ) : null}

      <section aria-labelledby="concierge-ask">
        <AdvisorWho name={C.name} role={C.role} className="concierge-start__who" />
        {/* Not shown: the advisor's name already introduces the questions
            (designer, 2026-10-07). Kept for screen readers, which name the
            section by it. */}
        <h2 id="concierge-ask" className="u-visually-hidden">{C.askMe}</h2>
        <ul className="concierge-suggest">
          {suggestions(ctx).map((s) => (
            <li key={s.label}>
              <button type="button" className="concierge-suggest__item" onClick={() => onAsk(s)}>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
