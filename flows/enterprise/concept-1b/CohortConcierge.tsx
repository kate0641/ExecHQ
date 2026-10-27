"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { AdvisorWho, ConciergePanel } from "@/components/navigation/ConciergePanel";
import { ConciergePill } from "@/components/navigation/ConciergePill";
import { ASSISTANT_COPY, type Cohort, type DateRange } from "@/mock/enterprise";
import { AnswerText } from "../AnswerText";
import { useAssistant } from "../useAssistant";

const C = ASSISTANT_COPY;
const PILL_ID = "cohort-concierge-pill";
const PANEL_ID = "cohort-concierge-panel";

/**
 * The assistant on the dashboard (Kate, 2026-10-20): the same floating bar as
 * the app's navigation, "Your cohort · Ask about your cohort", at the foot of
 * the page. It grows into a card over a soft scrim, as the navigation's does:
 * suggested questions first, then the conversation. Escape, the scrim or the
 * close button shut it and put focus back on the bar.
 */
export function CohortConcierge({ cohort, window }: { cohort: Cohort; window: DateRange }) {
  const anchor = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [screen, setScreen] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const assistant = useAssistant(cohort, window);
  const chatting = assistant.messages.length > 0;

  useEffect(() => {
    setScreen(anchor.current?.closest<HTMLElement>(".device__screen") ?? null);
  }, []);

  // Open, the card is modal: the page behind is inert and Escape closes it.
  useEffect(() => {
    if (!screen) return;
    screen.setAttribute("data-concierge", open ? "open" : "closed");
    const content = screen.querySelector<HTMLElement>(".device__content");
    if (!open) return;
    if (content) content.inert = true;
    screen.querySelector<HTMLInputElement>(`#${PANEL_ID} .chat-composer__field`)?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (content) content.inert = false;
    };
  }, [screen, open]);

  useEffect(() => () => screen?.removeAttribute("data-concierge"), [screen]);

  // Keep the latest message in view.
  useEffect(() => {
    const scroller = bodyRef.current?.parentElement;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  }, [assistant.messages.length, assistant.typing]);

  function close() {
    setOpen(false);
    // The bar it came from takes focus back once the card has gone.
    setTimeout(() => document.getElementById(PILL_ID)?.focus(), 0);
  }

  return (
    <>
      <span ref={anchor} hidden />
      {screen
        ? createPortal(
            <div className="concierge-host concierge-host--card">
              <div className="concierge-host__pill">
                <ConciergePill
                  id={PILL_ID}
                  here={{ label: C.pillHere, icon: "people" }}
                  ask={C.pillAsk}
                  expanded={open}
                  controls={PANEL_ID}
                  onClick={() => (open ? close() : setOpen(true))}
                />
              </div>
              <button type="button" className="concierge-host__scrim" tabIndex={-1} aria-hidden="true" onClick={close} />
              <div className="concierge-host__panel" inert={!open}>
                <ConciergePanel
                  id={PANEL_ID}
                  mode="card"
                  label={C.pillAsk}
                  name={C.name}
                  role={C.role}
                  whoInHead={chatting}
                  newLabel={C.newChat}
                  closeLabel={C.close}
                  onNew={chatting ? assistant.clear : undefined}
                  onClose={close}
                  className={chatting ? "is-chatting" : undefined}
                  footer={
                    <>
                      <p className="concierge-panel__hint">{C.rule}</p>
                      <ChatComposer
                        value={draft}
                        onChange={setDraft}
                        placeholder={C.placeholder}
                        holdSend={assistant.typing}
                        onSend={(value) => {
                          setDraft("");
                          assistant.ask(value);
                        }}
                      />
                    </>
                  }
                >
                  <div className="concierge-body" ref={bodyRef}>
                    {chatting ? (
                      <div className="concierge-thread" role="log" aria-label={C.thread}>
                        {assistant.messages.map((m, i) =>
                          m.from === "you" ? (
                            <ChatMessage key={m.id} from="you">
                              {m.text}
                            </ChatMessage>
                          ) : (
                            <ChatMessage key={m.id} from="advisor" lead={assistant.messages[i - 1]?.from !== "advisor"} advisorName={C.name}>
                              <AnswerText text={m.text} />
                            </ChatMessage>
                          )
                        )}
                        {assistant.typing ? <ChatMessage from="advisor" lead typing advisorName={C.name} /> : null}
                      </div>
                    ) : (
                      <div className="concierge-start">
                        <section aria-labelledby="cohort-concierge-ask">
                          <AdvisorWho name={C.name} role={C.role} brand className="concierge-start__who" />
                          <h2 id="cohort-concierge-ask" className="concierge-start__title">
                            {C.startTitle}
                          </h2>
                          <ul className="concierge-suggest">
                            {C.prompts.dashboard.map((prompt) => (
                              <li key={prompt.label}>
                                <button type="button" className="concierge-suggest__item" onClick={() => assistant.ask(prompt.label, prompt.key)}>
                                  {prompt.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </section>
                      </div>
                    )}
                  </div>
                </ConciergePanel>
              </div>
            </div>,
            screen
          )
        : null}
    </>
  );
}

export default CohortConcierge;
