"use client";

import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { PICK_COPY as C } from "@/mock/toolbox";

export interface PickAnswerProps {
  /** The question: names the chips for assistive technology. */
  label: string;
  /** "one": a single answer (who she is pitching); "many": check all that apply. */
  mode: "one" | "many";
  options: readonly string[];
  picked: readonly string[];
  /** What she wrote under Other. */
  other: string;
  onChange: (picked: string[], other: string) => void;
  /** The question is the page's heading, so the chips' own label is hidden. */
  labelHidden?: boolean;
  error?: string;
  className?: string;
}

/** Her picks as one phrase for the draft: "the CEO, the CFO and my manager". */
export function pickedPhrase(picked: readonly string[], other: string): string {
  const all = [...picked, ...(other.trim() ? [other.trim()] : [])].map((item, i) =>
    // Mid-sentence, an item starts lower case unless it is an acronym ("HR").
    i > 0 && !/^[A-Z]{2}/.test(item) ? item.charAt(0).toLowerCase() + item.slice(1) : item
  );
  if (all.length <= 1) return all[0] ?? "";
  return `${all.slice(0, -1).join(", ")} ${C.and} ${all[all.length - 1]}`;
}

/**
 * Toolbox flow Concept 3's way of answering (13 October): tap, don't type.
 * Chips to check all that apply (or pick one, where there is only one
 * answer), and Other, which opens a line for her own words. Where ExecHQ
 * knows something only she would say, it leads the chips, so a tap still
 * says something specific.
 */
export function PickAnswer({ label, mode, options, picked, other, onChange, labelHidden = false, error, className }: PickAnswerProps) {
  const otherOn = picked.includes(C.other);
  return (
    <div className={["pick-answer", className].filter(Boolean).join(" ")}>
      <ChipGroup
        label={label}
        labelHidden={labelHidden}
        note={mode === "many" ? C.many : undefined}
        options={[...options, C.other]}
        value={picked}
        max={mode === "many" ? options.length + 1 : 1}
        onChange={(next) => onChange(next, next.includes(C.other) ? other : "")}
      />
      {otherOn ? (
        <Input
          label={C.otherLabel}
          placeholder={C.otherPlaceholder}
          value={other}
          error={error}
          onChange={(event) => onChange([...picked], event.target.value)}
        />
      ) : error ? (
        <p className="pick-answer__error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default PickAnswer;
