"use client";

import { useState } from "react";
import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ASSISTANT_COPY, type LetterIssue } from "@/mock/enterprise";
import { AnswerText } from "../AnswerText";
import { useAssistant } from "../useAssistant";

const C = ASSISTANT_COPY;

/**
 * Replying to the letter (Kate, 2026-10-20). The letter is already written
 * in ExecHQ's voice, so asking it something is a reply, and the answer comes
 * back under the issue in the same voice: no chat window. Suggested replies
 * first, then a box to write one. Mount it with the issue's number as its
 * key, so each issue keeps its own replies.
 */
export function LetterReplies({ issue }: { issue: LetterIssue }) {
  const [draft, setDraft] = useState("");
  const assistant = useAssistant(issue.cohort, issue.window);

  return (
    <section className="letter-replies" aria-labelledby="letter-replies">
      <h2 className="letter__subheading" id="letter-replies">
        {C.replyHeading}
      </h2>

      {assistant.messages.length > 0 || assistant.typing ? (
        <div className="letter-replies__thread" role="log" aria-label={C.thread}>
          {assistant.messages.map((m) => (
            <div className={`letter-replies__turn letter-replies__turn--${m.from}`} key={m.id}>
              <p className="letter-replies__who">
                {m.from === "advisor" ? (
                  <>
                    <AdvisorMark size={14} />
                    {C.name}
                  </>
                ) : (
                  C.you
                )}
              </p>
              <div className="letter-replies__text">{m.from === "advisor" ? <AnswerText text={m.text} /> : <p>{m.text}</p>}</div>
            </div>
          ))}
          {assistant.typing ? (
            <p className="letter-replies__writing">
              <AdvisorMark size={14} />
              {C.writing}
            </p>
          ) : null}
        </div>
      ) : null}

      <ul className="letter-replies__suggest" aria-label={C.suggested}>
        {C.prompts.letter.map((prompt) => (
          <li key={prompt.label}>
            <button type="button" className="letter-replies__chip" onClick={() => assistant.ask(prompt.label, prompt.key)}>
              {prompt.label}
            </button>
          </li>
        ))}
      </ul>
      <ChatComposer
        value={draft}
        onChange={setDraft}
        placeholder={C.replyPlaceholder}
        fieldLabel={C.replyField}
        sendLabel={C.replySend}
        holdSend={assistant.typing}
        onSend={(value) => {
          setDraft("");
          assistant.ask(value);
        }}
      />
    </section>
  );
}

export default LetterReplies;
