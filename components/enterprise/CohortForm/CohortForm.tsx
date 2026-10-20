"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { ENTERPRISE_COPY } from "@/mock/enterprise";

const C = ENTERPRISE_COPY.form;

export interface CohortDetails {
  name: string;
  expectedSize: number;
  startsOn: string;
}

type Field = "name" | "size" | "starts";

export interface CohortFormProps {
  onCreate: (details: CohortDetails) => void;
  /** Starting values, as typed. */
  initial?: Partial<Record<"name" | "size" | "startsOn", string>>;
  /** Hides the form's own heading where the page already gives one. */
  headingHidden?: boolean;
  /** Catalogue only: opens having been sent once, so its errors show. */
  startSubmitted?: boolean;
  className?: string;
}

function validate(name: string, size: string, startsOn: string): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!name.trim()) errors.name = C.nameMissing;
  if (!/^\d+$/.test(size.trim()) || Number(size) < 1) errors.size = C.sizeMissing;
  if (!startsOn) errors.starts = C.startMissing;
  return errors;
}

/**
 * Starting a cohort: its name, how many people the sponsor expects, and when
 * the program starts. A cohort has no end date: it stops growing when the
 * sponsor closes its code (Kate, 2026-10-20). That is all: nothing about the people in it, and no list
 * of who to invite, because the sponsor shares one code through its own
 * channels.
 */
export function CohortForm({ onCreate, initial = {}, headingHidden = false, startSubmitted = false, className }: CohortFormProps) {
  const [name, setName] = useState(initial.name ?? "");
  const [size, setSize] = useState(initial.size ?? "");
  const [startsOn, setStartsOn] = useState(initial.startsOn ?? "");
  const [submitted, setSubmitted] = useState(startSubmitted);

  const errors = submitted ? validate(name, size, startsOn) : {};

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(validate(name, size, startsOn)).length > 0) return;
    onCreate({ name: name.trim(), expectedSize: Number(size), startsOn });
  }

  return (
    <form className={["cohort-form", className].filter(Boolean).join(" ")} onSubmit={submit} noValidate>
      <h3 className={headingHidden ? "u-visually-hidden" : "cohort-form__heading"}>{C.heading}</h3>
      <Input label={C.name} hint={C.nameHint} value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
      <Input
        label={C.size}
        hint={C.sizeHint}
        inputMode="numeric"
        value={size}
        onChange={(e) => setSize(e.target.value.replace(/[^\d]/g, ""))}
        error={errors.size}
      />
      <Input
        className="cohort-form__date"
        label={C.starts}
        type="date"
        value={startsOn}
        onChange={(e) => setStartsOn(e.target.value)}
        error={errors.starts}
      />
      <Button type="submit">{C.create}</Button>
    </form>
  );
}

export default CohortForm;
