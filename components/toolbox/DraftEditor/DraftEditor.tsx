"use client";

import { useState, type ReactNode } from "react";
import { Input } from "@/components/form/Input";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { Button } from "@/components/primitives/Button";
import { DRAFT_COPY as C, type DraftSection, type DraftSegment } from "@/mock/toolbox";

export interface DraftEditorProps {
  /** "First draft", "Draft, version 2". Never "your post". */
  label: string;
  sections: readonly DraftSection[];
  /** Sections she has rewritten, by id. An edited section is all hers. */
  edits?: Readonly<Record<string, string>>;
  /** Her answers to the draft's questions, by question. */
  answers?: Readonly<Record<string, string>>;
  onEditSection: (id: string, text: string) => void;
  onAnswer: (question: string, answer: string) => void;
  /** Above the draft: its Loop status and where it came from. */
  header?: ReactNode;
  /** A line under the label: "Here is a first draft of your post." */
  intro?: string;
  /** A revision is being written: the draft waits under a status. */
  revising?: string;
  /** Beside each section's Edit: its own Copy or Export, where each output
   *  is used on its own (Positioning Builder's bios). */
  sectionActions?: (section: DraftSection) => ReactNode;
  /** Lets a page move focus to the draft once it is written. */
  id?: string;
  /** Opens a section in an editing state (catalogue). */
  preview?: { editing: string; error?: boolean };
  className?: string;
}

const isQuestion = (s: DraftSegment): s is { question: string } => "question" in s;

/** A section as plain text, for editing and copying. An unanswered question
 *  stays in brackets, so editing never loses it. */
export function sectionText(section: DraftSection, answers: Readonly<Record<string, string>> = {}): string {
  if (section.list) return section.segments.map((s) => ("question" in s ? `[${s.question}]` : s.text)).join("\n");
  return section.segments
    .map((s) => (isQuestion(s) ? (answers[s.question] ? `${answers[s.question]} ` : `[${s.question}] `) : s.text))
    .join("")
    .trim();
}

/** The questions a draft leaves for her, unanswered first. */
export function draftQuestions(sections: readonly DraftSection[]): string[] {
  return sections.flatMap((section) => section.segments.filter(isQuestion).map((s) => s.question));
}

function SectionEditor({
  name,
  initial,
  startError,
  onSave,
  onCancel,
}: {
  name: string;
  initial: string;
  startError?: boolean;
  onSave: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(startError ? "" : initial);
  const [error, setError] = useState(startError ? C.empty : undefined);
  return (
    <div className="draft-editor__editing">
      <Input
        label={C.editSection(name)}
        labelHidden
        multiline
        rows={8}
        value={text}
        error={error}
        onChange={(event) => {
          setText(event.target.value);
          setError(undefined);
        }}
      />
      <div className="draft-editor__edit-actions">
        <Button
          size="sm"
          onClick={() => {
            if (!text.trim()) {
              setError(C.empty);
              return;
            }
            onSave(text.trim());
          }}
        >
          {C.save}
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          {C.cancel}
        </Button>
      </div>
    </div>
  );
}

/**
 * The draft, where she reads and changes it. It is always called a draft
 * until she marks it ready. Her words and ExecHQ's wording look different,
 * with a key to say which is which, so generated framing is never mistaken
 * for what she said. Anything only she knows is a question in the text, not
 * an invented number or name, and the questions are gathered under the draft
 * to answer. Any section can be rewritten in place; once she does, it is hers.
 */
export function DraftEditor({
  label,
  sections,
  edits = {},
  answers = {},
  onEditSection,
  onAnswer,
  header,
  intro,
  revising,
  preview,
  sectionActions,
  id,
  className,
}: DraftEditorProps) {
  const [editing, setEditing] = useState<string | null>(preview?.editing ?? null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const open = draftQuestions(sections).filter((q) => !answers[q] && !sections.some((s) => edits[s.id] && s.segments.some((g) => isQuestion(g) && g.question === q)));

  return (
    <article
      className={["draft-editor", revising ? "is-revising" : null, className].filter(Boolean).join(" ")}
      aria-label={label}
      id={id}
      tabIndex={id ? -1 : undefined}
    >
      <div className="draft-editor__top">
        <span className="draft-editor__label">{label}</span>
        {header}
      </div>
      {intro ? <p className="draft-editor__intro">{intro}</p> : null}

      <ul className="draft-editor__legend" aria-label="Key">
        <li className="draft-editor__key draft-editor__key--you">{C.legendYou}</li>
        <li className="draft-editor__key draft-editor__key--exechq">{C.legendExechq}</li>
        <li className="draft-editor__key draft-editor__key--question">{C.legendQuestion}</li>
      </ul>

      {revising ? <GeneratingState label={revising} /> : null}

      <div className="draft-editor__body" aria-busy={Boolean(revising) || undefined}>
        {sections.map((section) => {
          const name = section.heading ?? "the draft";
          const edited = edits[section.id];
          return (
            <section key={section.id} className="draft-editor__section" aria-label={section.heading ?? label}>
              <div className="draft-editor__section-head">
                {section.heading ? <h3 className="draft-editor__section-heading">{section.heading}</h3> : <span />}
                {editing === section.id ? null : (
                  <span className="draft-editor__section-actions">
                    {sectionActions?.(section)}
                    <Button variant="ghost" size="sm" onClick={() => setEditing(section.id)} disabled={Boolean(revising)}>
                      {C.edit}
                      <span className="u-visually-hidden"> {name}</span>
                    </Button>
                  </span>
                )}
              </div>
              {editing === section.id ? (
                <SectionEditor
                  name={name}
                  initial={edited ?? sectionText(section, answers)}
                  startError={preview?.editing === section.id && preview.error}
                  onCancel={() => setEditing(null)}
                  onSave={(text) => {
                    onEditSection(section.id, text);
                    setEditing(null);
                  }}
                />
              ) : edited ? (
                <>
                  <p className="draft-editor__text">
                    <span className="draft-editor__you">{edited}</span>
                  </p>
                  <span className="draft-editor__edited">{C.edited}</span>
                </>
              ) : section.list ? (
                <ul className="draft-editor__text draft-editor__list">
                  {section.segments.map((segment, i) =>
                    isQuestion(segment) ? null : (
                      <li key={i} className={segment.by === "you" ? "draft-editor__you" : "draft-editor__exechq"}>
                        {segment.by === "exechq" ? <span className="u-visually-hidden">ExecHQ: </span> : null}
                        {segment.text}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="draft-editor__text">
                  {section.segments.map((segment, i) =>
                    isQuestion(segment) ? (
                      answers[segment.question] ? (
                        <span key={i} className="draft-editor__you">
                          {answers[segment.question]}{" "}
                        </span>
                      ) : (
                        <span key={i} className="draft-editor__question">
                          <span className="u-visually-hidden">{C.questionLabel} </span>
                          {segment.question}
                        </span>
                      )
                    ) : (
                      <span key={i} className={segment.by === "you" ? "draft-editor__you" : "draft-editor__exechq"}>
                        {segment.by === "exechq" ? <span className="u-visually-hidden">ExecHQ: </span> : null}
                        {segment.text}
                      </span>
                    )
                  )}
                </p>
              )}
            </section>
          );
        })}
      </div>

      {open.length ? (
        <section className="draft-editor__gaps" aria-labelledby="draft-gaps-heading">
          <h3 className="draft-editor__gaps-heading" id="draft-gaps-heading">
            {C.gapsHeading}
          </h3>
          <p className="draft-editor__gaps-lead">{C.gapsLead}</p>
          {open.map((question) => (
            <form
              key={question}
              className="draft-editor__gap"
              onSubmit={(event) => {
                event.preventDefault();
                const answer = drafts[question]?.trim();
                if (answer) onAnswer(question, answer);
              }}
            >
              <Input
                label={question}
                value={drafts[question] ?? ""}
                onChange={(event) => setDrafts((d) => ({ ...d, [question]: event.target.value }))}
              />
              <Button type="submit" variant="secondary" size="sm">
                {C.answer}
              </Button>
            </form>
          ))}
        </section>
      ) : null}
    </article>
  );
}

export default DraftEditor;
