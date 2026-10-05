"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/form/Input";
import { Stepper } from "@/components/form/Stepper";
import { Button } from "@/components/primitives/Button";
import type { Baseline } from "@/lib/presence";
import { BASELINE_COPY as C, PRESENCE_ORDER, type CountedKind } from "@/mock/accounts-stub";

export interface BaselineFormProps {
  onSave: (baseline: Baseline) => void;
  /** Leaves it for later. Omitted where skipping makes no sense. */
  onSkip?: () => void;
  /** Catalogue only: fills the form. */
  demo?: { counts?: Partial<Record<CountedKind, number>>; followers?: string };
  className?: string;
}

const NONE: Record<CountedKind, number> = { podcast: 0, press: 0, speaking: 0, writing: 0 };

/**
 * Where she says she is starting from, in one card: a stepper for each thing
 * she can count and a number for her LinkedIn followers. All of it is typed
 * by hand. Nothing is looked up, so there is nothing to connect or explain,
 * and zero is a fine answer. The followers are optional.
 */
export function BaselineForm({ onSave, onSkip, demo, className }: BaselineFormProps) {
  const [counts, setCounts] = useState<Record<CountedKind, number>>({ ...NONE, ...demo?.counts });
  const [followers, setFollowers] = useState(demo?.followers ?? "");

  function submit(event: FormEvent) {
    event.preventDefault();
    const digits = followers.replace(/[^0-9]/g, "");
    onSave({ counts, ...(digits ? { followers: Number(digits) } : {}) });
  }

  return (
    <form className={["baseline-form", className].filter(Boolean).join(" ")} onSubmit={submit} noValidate>
      <p className="baseline-form__intro">{C.intro}</p>
      <Input
        label={C.linkedin.label}
        hint={C.linkedin.hint}
        placeholder={C.linkedin.placeholder}
        inputMode="numeric"
        value={followers}
        onChange={(event) => setFollowers(event.target.value)}
      />
      {PRESENCE_ORDER.map((kind) => (
        <Stepper
          key={kind}
          label={C.kinds[kind].label}
          hint={C.kinds[kind].hint}
          value={counts[kind]}
          onChange={(value) => setCounts((current) => ({ ...current, [kind]: value }))}
        />
      ))}
      <div className="baseline-form__actions">
        <Button type="submit" variant="primary" fullWidth>
          {C.save}
        </Button>
        {onSkip ? (
          <Button type="button" variant="ghost" fullWidth onClick={onSkip}>
            {C.skip}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export default BaselineForm;
