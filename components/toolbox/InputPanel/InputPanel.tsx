"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { INPUT_COPY as C, SOURCE_LABELS, type ToolInput } from "@/mock/toolbox";

export interface InputPanelProps {
  inputs: readonly ToolInput[];
  /** Her answers so far, by input id. Pre-filled values count until changed. */
  values: Readonly<Record<string, string>>;
  onChange: (id: string, value: string) => void;
  /** An optional enricher (`EnricherCard`), offered above the button. */
  enricher?: ReactNode;
  onWrite: () => void;
  /** The draft is being written. */
  writing?: boolean;
  /** Opens with an unanswered required field flagged (catalogue). */
  showErrors?: boolean;
  /** Leaves the heading out, where the page already has one. */
  noHeading?: boolean;
  /** The button's words where it moves on rather than writes: "Next", in a
   *  guided flow that asks one thing a screen. */
  submitLabel?: string;
  /** Leaves out "You don't need anything else to start" (not the last step). */
  hideNote?: boolean;
  className?: string;
}


/** What ExecHQ already knows: read, with where it came from, and Edit. */
function KnownRow({ input, value, onChange }: { input: ToolInput; value: string; onChange: (value: string) => void }) {
  const [editing, setEditing] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  const source = input.source ? SOURCE_LABELS[input.source] : undefined;
  // Edit and Keep this swap places, so focus follows: into the field to type,
  // then back to Edit.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    box.current?.querySelector<HTMLElement>(editing ? "input, textarea" : "button")?.focus();
  }, [editing]);
  const toggle = (next: boolean) => {
    moved.current = true;
    setEditing(next);
  };
  if (editing) {
    return (
      <div className="input-panel__known is-editing" ref={box}>
        <Input
          label={input.label}
          hint={source}
          value={value}
          multiline={input.kind === "long"}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
        />
        <Button variant="secondary" size="sm" onClick={() => toggle(false)}>
          {C.keep}
        </Button>
      </div>
    );
  }
  return (
    <div className="input-panel__known" ref={box}>
      <span className="input-panel__known-label">{input.label}</span>
      <span className="input-panel__known-value">{value}</span>
      <span className="input-panel__known-foot">
        {source ? <span className="input-panel__source">{source}</span> : <span />}
        <Button variant="ghost" size="sm" onClick={() => toggle(true)}>
          {C.edit}
          <span className="u-visually-hidden"> {input.label}</span>
        </Button>
      </span>
    </div>
  );
}

/**
 * What a tool needs before its first draft, and nothing more. Anything ExecHQ
 * already knows arrives filled in, says where it came from, and can be
 * changed; only what only she can answer is asked. An enricher may be offered,
 * but the draft never waits for it.
 */
export function InputPanel({
  inputs,
  values,
  onChange,
  enricher,
  onWrite,
  writing = false,
  showErrors = false,
  noHeading = false,
  submitLabel,
  hideNote = false,
  className,
}: InputPanelProps) {
  const [tried, setTried] = useState(showErrors);
  const known = inputs.filter((input) => input.source && input.kind !== "choice");
  const asked = inputs.filter((input) => !known.includes(input));
  const valueOf = (input: ToolInput) => values[input.id] ?? input.value ?? "";
  const missing = asked.filter((input) => !input.optional && !valueOf(input).trim());

  return (
    <div className={["input-panel", className].filter(Boolean).join(" ")}>
      {noHeading ? null : <h2 className="input-panel__heading">{C.heading}</h2>}

      {known.length ? (
        <section className="input-panel__group" aria-label={C.known}>
          <p className="input-panel__lead">{C.known}</p>
          {known.map((input) => (
            <KnownRow key={input.id} input={input} value={valueOf(input)} onChange={(value) => onChange(input.id, value)} />
          ))}
        </section>
      ) : null}

      {asked.length ? (
        <section className="input-panel__group" aria-label={C.asked}>
          <p className="input-panel__lead">{asked.every((input) => input.optional) ? C.askedOptional : C.asked}</p>
          {asked.map((input) =>
            input.kind === "choice" ? (
              <ChipGroup
                key={input.id}
                label={input.label}
                options={input.options ?? []}
                value={valueOf(input) ? [valueOf(input)] : []}
                onChange={(next) => onChange(input.id, next[0] ?? "")}
              />
            ) : (
              <Input
                key={input.id}
                label={input.optional ? `${input.label} (${C.optional.toLowerCase()})` : input.label}
                hint={input.hint}
                placeholder={input.placeholder}
                value={valueOf(input)}
                multiline={input.kind === "long"}
                rows={3}
                error={tried && missing.includes(input) ? C.missing : undefined}
                onChange={(event) => onChange(input.id, event.target.value)}
              />
            )
          )}
        </section>
      ) : null}

      {enricher}

      <div className="input-panel__actions">
        <Button
          fullWidth
          loading={writing}
          onClick={() => {
            setTried(true);
            if (missing.length === 0) onWrite();
          }}
        >
          {writing ? C.writing : (submitLabel ?? C.write)}
        </Button>
        {hideNote ? null : <p className="input-panel__note">{C.notNeeded}</p>}
      </div>
    </div>
  );
}

export default InputPanel;
