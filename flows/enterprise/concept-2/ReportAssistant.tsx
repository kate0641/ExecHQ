"use client";

import { useEffect, useRef, useState } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { ASSISTANT_COPY, type Cohort, type DateRange } from "@/mock/enterprise";
import { AnswerText } from "../AnswerText";
import { useAssistant } from "../useAssistant";

const C = ASSISTANT_COPY;

/**
 * "Ask about this report" (Kate, 2026-10-20): a panel always beside the
 * sheet, with no way to close it, never printed. As tall as the window and
 * stuck while the report scrolls (2026-10-21), so the box is always in reach. Its suggestions lean towards writing for the sponsor's
 * leadership, and every answer written to be used elsewhere has Copy, so it
 * can go straight into an email.
 */
export function ReportAssistant({ id, cohort, window }: { id: string; cohort: Cohort; window: DateRange }) {
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState<number | null>(null);
  const assistant = useAssistant(cohort, window);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [assistant.messages.length, assistant.typing]);

  function copy(messageId: number, text: string) {
    // Clipboard access can be refused; the words are on screen either way.
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(messageId);
  }

  return (
    <aside className="report-ask" id={id} aria-labelledby={`${id}-title`}>
      <div className="report-ask__head">
        <h2 className="report-ask__title" id={`${id}-title`}>
          {C.reportButton}
        </h2>
      </div>

      <div className="report-ask__body" ref={bodyRef}>
        {assistant.messages.length === 0 ? <p className="report-ask__intro">{C.reportIntro}</p> : null}
        <div className="concierge-thread" role="log" aria-label={C.thread}>
          {assistant.messages.map((m, i) =>
            m.from === "you" ? (
              <ChatMessage key={m.id} from="you">
                {m.text}
              </ChatMessage>
            ) : (
              <ChatMessage key={m.id} from="advisor" lead={assistant.messages[i - 1]?.from !== "advisor"} advisorName={C.name}>
                <AnswerText text={m.text} />
                {m.usable ? (
                  <Button variant="secondary" size="sm" className="report-ask__copy" onClick={() => copy(m.id, m.text)}>
                    <Icon name={copied === m.id ? "check" : "copy"} size={16} />
                    {copied === m.id ? C.copied : C.copy}
                  </Button>
                ) : null}
              </ChatMessage>
            )
          )}
          {assistant.typing ? <ChatMessage from="advisor" lead typing advisorName={C.name} /> : null}
        </div>
        <output className="u-visually-hidden">{copied !== null ? C.copied : ""}</output>
      </div>

      <div className="report-ask__foot">
        <ul className="concierge-suggest">
          {C.prompts.report.map((prompt) => (
            <li key={prompt.label}>
              <button type="button" className="concierge-suggest__item" onClick={() => assistant.ask(prompt.label, prompt.key)}>
                {prompt.label}
              </button>
            </li>
          ))}
        </ul>
        <ChatComposer
          value={draft}
          onChange={setDraft}
          placeholder={C.reportPlaceholder}
          fieldLabel={C.reportButton}
          holdSend={assistant.typing}
          onSend={(value) => {
            setDraft("");
            assistant.ask(value);
          }}
        />
      </div>
    </aside>
  );
}

export default ReportAssistant;
