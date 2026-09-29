"use client";

import { useState } from "react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { QuickReplies } from "@/components/chat/QuickReplies";
import { Button } from "@/components/primitives/Button";
import { followUpQuestion, shortDate, whenPhrase, type LoopRecord, type OutcomeType } from "@/lib/loop";
import { CHECKIN_COPY as C } from "@/mock/homepage";
import { ARTIFACT_KINDS, OUTCOME_OPTIONS } from "@/mock/loop";

export type CheckInLayout = "question" | "stepper" | "chat";

export interface CheckInProps {
  /** The draft it's asking about. Its state decides the question. */
  record?: LoopRecord;
  /** Or a Plan action with no draft: done on her word, then asked what came
   *  of it. Used when there is no record. */
  task?: { doneOn?: string; outcome?: { type: OutcomeType; detail?: string } };
  /** The snapshot's today, for "last Tuesday". */
  today: string;
  /** The Plan action it belongs to, named in the context line. */
  about?: string;
  /** How it's drawn: Question first (Concept 1), Stepper (Concept 2) or
   *  Conversation (Concept 3). The words and answers are the same in all. */
  layout?: CheckInLayout;
  /** She has just answered: show what was logged, and offer a note. */
  answered?: boolean;
  /** What was logged, in the page's words, once answered. */
  readback?: string;
  /** "Yes, I've used it", for a ready draft. */
  onUsed?: () => void;
  /** "Yes, it's done", for an action with no draft. */
  onDone?: () => void;
  /** "I'm not doing it", for an action with no draft. */
  onDrop?: () => void;
  /** An outcome, saved on one tap. */
  onAnswer: (type: OutcomeType) => void;
  /** Her note, added to the outcome just logged. */
  onNote: (detail: string) => void;
  headingId?: string;
  className?: string;
}

const MAIN: OutcomeType[] = ["positive", "neutral", "negative"];
const QUIET: OutcomeType[] = ["no-response-yet", "no-longer-relevant"];
const labelOf = (type: OutcomeType) => OUTCOME_OPTIONS.find((o) => o.type === type)!.label;

/**
 * The one check-in the Loop uses everywhere: it asks the question for where a
 * draft stands — "Have you used it?" once it's ready, "What came of it?"
 * once it's used — or, for a Plan action with no draft, "Have you done this
 * yet?" and then what came of it. It takes the answer on one tap, and offers
 * a note after.
 * "Nothing yet" and "It's no longer relevant" sit quieter, because they
 * aren't about how it went.
 *
 * One component, three ways of drawing it, chosen per concept: a question
 * with its answers (Question first), the Loop's three steps with the current
 * one opened (Stepper), or the advisor asking in its own voice (Conversation).
 */
export function CheckIn({
  record,
  task,
  today,
  about,
  layout = "question",
  answered = false,
  readback,
  onUsed,
  onDone,
  onDrop,
  onAnswer,
  onNote,
  headingId = "check-in-question",
  className,
}: CheckInProps) {
  const [later, setLater] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noted, setNoted] = useState(false);
  const [said, setSaid] = useState<string | null>(null);
  /* The conversation keeps the reply as it was when she answered, so a note
     added afterwards follows it rather than rewriting it. */
  const [firstReadback, setFirstReadback] = useState<string | undefined>(undefined);
  if (answered && readback && firstReadback === undefined) setFirstReadback(readback);

  const usedVerb = record ? ARTIFACT_KINDS[record.kind].usedVerb : "";
  const ready = record?.state === "ready";
  /** An action with no draft, not yet done. */
  const todo = !record && !task?.doneOn;
  const outcome = record ? record.outcome : task?.outcome;
  const question = record
    ? ready
      ? C.readyQuestion(record.title)
      : followUpQuestion(record, today)
    : todo
      ? C.taskQuestion
      : C.taskDoneQuestion(whenPhrase(task!.doneOn!, today));
  const canNote = answered && Boolean(outcome) && outcome?.type !== "no-longer-relevant" && !outcome?.detail && !noted;
  const shown = later ? C.notYetReadback : readback;
  /** Where it is in the Loop: 0 drafted or accepted, 1 used or done, 2 what came of it. */
  const at = answered && outcome ? 3 : ready || todo ? 1 : 2;

  const saveNote = () => {
    if (note.trim()) onNote(note.trim());
    setNoted(true);
    setNoteOpen(false);
  };
  const noteForm = canNote ? (
    noteOpen ? (
      <div className="check-in__note">
        <label className="check-in__note-label" id={`${headingId}-note-label`} htmlFor={`${headingId}-note`}>
          {C.noteLabel}
        </label>
        <textarea
          id={`${headingId}-note`}
          aria-labelledby={`${headingId}-note-label`}
          className="check-in__note-field"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div className="check-in__row">
          <Button size="sm" onClick={saveNote}>
            {layout === "chat" ? C.chatSend : C.saveNote}
          </Button>
          <button type="button" className="link link--standalone" onClick={() => setNoted(true)}>
            {C.skipNote}
          </button>
        </div>
      </div>
    ) : (
      <button
        type="button"
        className="link link--standalone check-in__add"
        onClick={() => {
          setNoteOpen(true);
          setTimeout(() => document.getElementById(`${headingId}-note`)?.focus(), 0);
        }}
      >
        {C.addNote}
      </button>
    )
  ) : null;

  const answerButtons = todo ? (
    <>
      <div className="check-in__answers">
        <Button size="sm" onClick={onDone}>
          {C.taskDone}
        </Button>
      </div>
      <div className="check-in__quiet">
        <button type="button" className="link link--standalone" onClick={() => setLater(true)}>
          {C.notYet}
        </button>
        <button type="button" className="link link--standalone" onClick={onDrop}>
          {C.taskDrop}
        </button>
      </div>
    </>
  ) : ready ? (
    <>
      <div className="check-in__answers">
        <Button size="sm" onClick={onUsed}>
          {C.used(usedVerb)}
        </Button>
      </div>
      <div className="check-in__quiet">
        <button type="button" className="link link--standalone" onClick={() => setLater(true)}>
          {C.notYet}
        </button>
      </div>
    </>
  ) : (
    <>
      <div className="check-in__answers">
        {MAIN.map((type) => (
          <Button key={type} size="sm" variant="secondary" onClick={() => onAnswer(type)}>
            {labelOf(type)}
          </Button>
        ))}
      </div>
      <div className="check-in__quiet">
        {QUIET.map((type) => (
          <button key={type} type="button" className="link link--standalone" onClick={() => onAnswer(type)}>
            {labelOf(type)}
          </button>
        ))}
      </div>
    </>
  );
  const done = answered || later;

  /* Conversation: the advisor asks; her answer and its reply follow. */
  if (layout === "chat") {
    const replies = todo
      ? [{ label: C.taskDone }, { label: C.notYet, quiet: true }, { label: C.taskDrop, quiet: true }]
      : ready
      ? [{ label: C.used(usedVerb) }, { label: C.notYet, quiet: true }]
      : [...MAIN.map((t) => ({ label: labelOf(t) })), ...QUIET.map((t) => ({ label: labelOf(t), quiet: true }))];
    return (
      <section className={["check-in", "check-in--chat", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
        <div className="check-in__thread" role="log" aria-live="polite">
          <ChatMessage from="advisor" lead>
            <span id={headingId} tabIndex={-1}>
              {question}
            </span>
          </ChatMessage>
          {done && said ? <ChatMessage from="you">{said}</ChatMessage> : null}
          {done && (later ? shown : firstReadback) ? (
            <ChatMessage from="advisor">{later ? shown : firstReadback}</ChatMessage>
          ) : null}
          {noted && note.trim() ? (
            <>
              <ChatMessage from="you">{note.trim()}</ChatMessage>
              <ChatMessage from="advisor">{C.chatNoted}</ChatMessage>
            </>
          ) : null}
        </div>
        {done ? (
          canNote && !noteOpen ? (
            <QuickReplies
              label={C.noteLabel}
              replies={[{ label: C.addNote }, { label: C.chatDone, quiet: true }]}
              onChoose={(label) => (label === C.addNote ? setNoteOpen(true) : setNoted(true))}
            />
          ) : (
            noteForm
          )
        ) : (
          <QuickReplies
            label={question}
            replies={replies}
            onChoose={(label) => {
              setSaid(label);
              if (label === C.notYet) return setLater(true);
              if (label === C.taskDone) return onDone?.();
              if (label === C.taskDrop) return onDrop?.();
              if (label === C.used(usedVerb)) return onUsed?.();
              const type = OUTCOME_OPTIONS.find((o) => o.label === label)?.type;
              if (type) onAnswer(type);
            }}
          />
        )}
      </section>
    );
  }

  /* Stepper: the Loop's three steps, the current one opened underneath. */
  if (layout === "stepper") {
    const steps = record
      ? [
          { label: C.steps.drafted, when: shortDate(record.createdOn) },
          { label: C.steps.used, when: record.usedOn ? shortDate(record.usedOn) : C.stepNotYet },
          { label: C.steps.came, when: record.outcome ? C.stepLogged : record.usedOn ? C.stepWaiting : "" },
        ]
      : [
          { label: C.steps.accepted, when: "" },
          { label: C.steps.done, when: task?.doneOn ? shortDate(task.doneOn) : C.stepNotYet },
          { label: C.steps.came, when: task?.outcome ? C.stepLogged : task?.doneOn ? C.stepWaiting : "" },
        ];
    return (
      <section className={["check-in", "check-in--stepper", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
        {about ? <p className="check-in__about">{about}</p> : null}
        <ol className="check-in__steps" aria-label="Where it is in the Loop">
          {steps.map((s, i) => (
            <li key={s.label} className={i < at ? "is-done" : i === at ? "is-now" : undefined} aria-current={i === at ? "step" : undefined}>
              <b>{s.label}</b>
              <span>{s.when || " "}</span>
            </li>
          ))}
        </ol>
        <div className="check-in__panel">
          {done ? (
            <>
              {shown ? (
                <p className="check-in__readback" id={headingId} tabIndex={-1}>
                  {shown}
                </p>
              ) : null}
              {noteForm}
            </>
          ) : (
            <>
              <h3 className="check-in__question" id={headingId} tabIndex={-1}>
                {question}
              </h3>
              {ready ? <p className="check-in__sub">{C.readySub}</p> : todo ? <p className="check-in__sub">{C.taskSub}</p> : null}
              {answerButtons}
            </>
          )}
        </div>
      </section>
    );
  }

  /* Question first: one question, its answers, and a note after. */
  return (
    <section className={["check-in", "check-in--question", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {about ? (
        <p className="check-in__about">
          <span className="check-in__dots" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <i key={i} className={i < at ? "is-done" : i === at ? "is-now" : undefined} />
            ))}
          </span>
          <span>
            {C.aboutFor}: <b>{about}</b>
          </span>
        </p>
      ) : null}
      {done ? (
        <>
          {shown ? (
            <p className="check-in__readback" id={headingId} tabIndex={-1}>
              {shown}
            </p>
          ) : null}
          {noteForm}
        </>
      ) : (
        <>
          <h3 className="check-in__question" id={headingId} tabIndex={-1}>
            {question}
          </h3>
          {ready ? <p className="check-in__sub">{C.readySub}</p> : todo ? <p className="check-in__sub">{C.taskSub}</p> : null}
          {answerButtons}
        </>
      )}
    </section>
  );
}

export default CheckIn;
