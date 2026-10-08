"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/form/Input";
import { Stepper } from "@/components/form/Stepper";
import { Button } from "@/components/primitives/Button";
import type { Baseline } from "@/lib/presence";
import { BASELINE_COPY as C, PRESENCE_ORDER, type CountedKind } from "@/mock/accounts-stub";

export interface BaselineFormProps {
  onSave: (baseline: Baseline) => void;
  /** Leaves it for later. Omitted where skipping makes no sense. */
  onSkip?: () => void;
  /** What the numbers start at. Empty when she is first saying. */
  initial?: Baseline;
  /** Words for a form that is not the first ask. Each falls back to the first. */
  intro?: string;
  saveLabel?: string;
  skipLabel?: string;
  /** Catalogue only: fills the form. */
  demo?: { counts?: Partial<Record<CountedKind, number>>; followers?: string };
  /** Something optional between the numbers and the buttons. */
  children?: ReactNode;
  /** Something optional under the buttons. */
  after?: ReactNode;
  className?: string;
}

const NONE: Record<CountedKind, number> = { podcast: 0, press: 0, speaking: 0, writing: 0 };

/**
 * Where she says she is starting from, in one card: a stepper for each thing
 * she can count and a number for her LinkedIn followers. All of it is typed
 * by hand. Nothing is looked up, so there is nothing to connect or explain,
 * and zero is a fine answer. The followers are optional.
 */
export function BaselineForm({ onSave, onSkip, initial, intro, saveLabel, skipLabel, demo, children, after, className }: BaselineFormProps) {
  const [counts, setCounts] = useState<Record<CountedKind, number>>({ ...NONE, ...initial?.counts, ...demo?.counts });
  const [followers, setFollowers] = useState(demo?.followers ?? (initial?.followers !== undefined ? initial.followers.toLocaleString("en-US") : ""));

  function submit(event: FormEvent) {
    event.preventDefault();
    const digits = followers.replace(/[^0-9]/g, "");
    onSave({ counts, ...(digits ? { followers: Number(digits) } : {}) });
  }

  return (
    <form className={["baseline-form", className].filter(Boolean).join(" ")} onSubmit={submit} noValidate>
      {/* Two groups: what to read and type, and what to count. They lay nothing out themselves; a page with
          room sets them side by side (the Signal Picture's first visit on the web). */}
      <div className="baseline-form__about">
      <p className="baseline-form__intro">{intro ?? C.intro}</p>
      <Input
        label={C.linkedin.label}
        hint={C.linkedin.hint}
        placeholder={C.linkedin.placeholder}
        inputMode="numeric"
        value={followers}
        onChange={(event) => setFollowers(event.target.value)}
      />
      </div>
      <div className="baseline-form__counts">
      {PRESENCE_ORDER.map((kind) => (
        <Stepper
          key={kind}
          label={C.kinds[kind].label}
          hint={C.kinds[kind].hint}
          value={counts[kind]}
          onChange={(value) => setCounts((current) => ({ ...current, [kind]: value }))}
        />
      ))}
      {children}
      <div className="baseline-form__actions">
        <Button type="submit" variant="primary" fullWidth>
          {saveLabel ?? C.save}
        </Button>
        {onSkip ? (
          <Button type="button" variant="ghost" fullWidth onClick={onSkip}>
            {skipLabel ?? C.skip}
          </Button>
        ) : null}
      </div>
      </div>
      {after}
    </form>
  );
}

export default BaselineForm;
