"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { followUpQuestion, outcomeLabel, whenPhrase, type LoopRecord, type OutcomeType } from "@/lib/loop";
import { CHECKIN_COPY as C } from "@/mock/homepage";
import { ARTIFACT_KINDS, OUTCOME_NOTE_BY_KIND } from "@/mock/loop";

export interface CheckInProps {
  /** The draft it's asking about. Its state decides the question. */
  record?: LoopRecord;
  /** Or a Plan action with no draft: done on her word, then asked what came
   *  of it. Used when there is no record. */
  task?: { doneOn?: string; outcome?: { type: OutcomeType; detail?: string } };
  /** The snapshot's today, for "last Tuesday". */
  today: string;
  /** The question's heading level: 3 under a page section (default), 2 when it sits right under the page's title. */
  headingLevel?: 2 | 3;
  /** The Plan action it belongs to, named in the context line. */
  about?: string;
  /** She has just answered: show what was logged, and offer a note. */
  answered?: boolean;
  /** What was logged, in the page's words, once answered. */
  readback?: string;
  /** The readback is an outcome she gave, not a "check back later": the
   *  word Logged shows above it in a pill. */
  logged?: boolean;
  /** A line above the readback, on its own: "You told me:". */
  readbackLead?: string;
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

/**
 * The one check-in the Loop uses everywhere: it asks the question for where a
 * draft stands — "Have you used it?" once it's ready, "What came of it?"
 * once it's used — or, for a Plan action with no draft, "Have you done this
 * yet?" and then what came of it. It takes the answer on one tap, and offers
 * a note after.
 * "Nothing yet" and "It's no longer relevant" sit quieter, because they
 * aren't about how it went.
 */
export function CheckIn({
  record,
  task,
  today,
  about,
  answered = false,
  readback,
  logged = false,
  readbackLead,
  onUsed,
  onDone,
  onDrop,
  onAnswer,
  onNote,
  headingId = "check-in-question",
  headingLevel = 3,
  className,
}: CheckInProps) {
  const QuestionHeading = headingLevel === 2 ? "h2" : "h3";
  const [later, setLater] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState("");
  const [noted, setNoted] = useState(false);

  const usedVerb = record ? ARTIFACT_KINDS[record.kind].usedVerb : "";
  /** The answers in this kind's words ("Yes, a next step" for a brief). */
  const labelOf = (type: OutcomeType) => outcomeLabel(type, record?.kind);
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

  const saveNote = () => {
    if (note.trim()) onNote(note.trim());
    setNoted(true);
    setNoteOpen(false);
  };
  const noteForm = canNote ? (
    noteOpen ? (
      <div className="check-in__note">
        <label className="check-in__note-label" id={`${headingId}-note-label`} htmlFor={`${headingId}-note`}>
          {(record && outcome && (OUTCOME_NOTE_BY_KIND[record.kind]?.[outcome.type] ?? OUTCOME_NOTE_BY_KIND[record.kind]?.any)) || C.noteLabel}
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
            {C.saveNote}
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

  /* With one clear "yes", the other answers sit beside it as quiet text,
     in the same row, rather than in a section of their own. */
  const answerButtons = todo ? (
    <div className="check-in__answers check-in__answers--yes">
      <Button size="sm" onClick={onDone}>
        {C.taskDone}
      </Button>
      <button type="button" className="link link--standalone" onClick={() => setLater(true)}>
        {C.notYet}
      </button>
      <button type="button" className="link link--standalone" onClick={onDrop}>
        {C.taskDrop}
      </button>
    </div>
  ) : ready ? (
    <div className="check-in__answers check-in__answers--yes">
      <Button size="sm" onClick={onUsed}>
        {C.used(usedVerb)}
      </Button>
      <button type="button" className="link link--standalone" onClick={() => setLater(true)}>
        {C.notYet}
      </button>
    </div>
  ) : (
    <>
      <div className="check-in__answers">
        {MAIN.map((type) => (
          <Button key={type} size="md" variant="secondary" onClick={() => onAnswer(type)}>
            <span className={`check-in__dot check-in__dot--${type}`} aria-hidden="true" />
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

  /* One question, its answers, and a note after. */
  return (
    <section className={["card", "check-in", "check-in--question", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {about ? (
        <p className="check-in__about">
          {C.aboutFor}: {about}
        </p>
      ) : null}
      {done ? (
        <>
          {/* The pill rides at the top of the white area without taking any
              of it, so what she said is dead centre in the whole of it. */}
          <div className="check-in__logged-body">
            {logged && !later ? <p className="check-in__logged">{C.loggedLabel}</p> : null}
            {shown ? (
              <p className="check-in__readback" id={headingId} tabIndex={-1}>
                {readbackLead && !later ? <span className="check-in__readback-lead">{readbackLead}</span> : null}
                {shown}
              </p>
            ) : null}
          </div>
          {noteForm}
        </>
      ) : (
        <>
          <QuestionHeading className="check-in__question" id={headingId} tabIndex={-1}>
            {question}
          </QuestionHeading>
          {ready ? <p className="check-in__sub">{C.readySub}</p> : todo ? <p className="check-in__sub">{C.taskSub}</p> : null}
          {answerButtons}
        </>
      )}
    </section>
  );
}

export default CheckIn;
