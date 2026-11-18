"use client";

import { useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Button } from "@/components/primitives/Button";
import { REVISION_COPY as C, REVISION_OPTIONS, type RevisionOption } from "@/mock/playbook";

export type RevisionChoice = Partial<Record<RevisionOption["id"], string>>;

export interface RevisionControlsProps {
  /** Asks for a revision: what she chose, and what she typed. */
  onRevise: (choice: RevisionChoice, followUp: string) => void;
  /** A revision is being written. */
  revising?: boolean;
  /** Which options show. All five by default. */
  options?: readonly RevisionOption[];
  /** Opens with these chosen (catalogue). */
  initial?: RevisionChoice;
  initialFollowUp?: string;
  /** Opens having pressed Revise with nothing chosen (catalogue). */
  showNothing?: boolean;
  /** What else she can do with the draft, under Revise in the same action
   *  area, which stays at the foot of a phone's screen. */
  after?: ReactNode;
  className?: string;
}

/**
 * How she changes a draft: a few structured choices (voice, specificity,
 * length, audience, emphasis), each one tap, and a line to say anything else
 * in her own words. Every revision is saved as a new version, so nothing she
 * had is lost.
 */
export function RevisionControls({
  onRevise,
  revising = false,
  options = REVISION_OPTIONS,
  initial = {},
  initialFollowUp = "",
  showNothing = false,
  after,
  className,
}: RevisionControlsProps) {
  const [choice, setChoice] = useState<RevisionChoice>(initial);
  const [followUp, setFollowUp] = useState(initialFollowUp);
  const [nothing, setNothing] = useState(showNothing);

  return (
    <section className={["revision-controls", className].filter(Boolean).join(" ")} aria-labelledby="revision-heading">
      <h2 className="revision-controls__heading" id="revision-heading">
        {C.heading}
      </h2>
      <div className="revision-controls__options">
        {options.map((option) => (
          <ChipGroup
            key={option.id}
            label={option.label}
            options={option.choices}
            value={choice[option.id] ? [choice[option.id] as string] : []}
            onChange={(next) => {
              setNothing(false);
              setChoice((c) => ({ ...c, [option.id]: next[0] }));
            }}
          />
        ))}
      </div>
      <Input
        label={C.followUpLabel}
        placeholder={C.followUpPlaceholder}
        value={followUp}
        error={nothing ? C.nothing : undefined}
        onChange={(event) => {
          setNothing(false);
          setFollowUp(event.target.value);
        }}
      />
      <div className="revision-controls__actions">
        <Button
          fullWidth
          loading={revising}
          onClick={() => {
            const chosen = Object.values(choice).some(Boolean);
            if (!chosen && !followUp.trim()) {
              setNothing(true);
              return;
            }
            onRevise(choice, followUp.trim());
            setChoice({});
            setFollowUp("");
          }}
        >
          {revising ? C.revising : C.revise}
        </Button>
        {after}
      </div>
    </section>
  );
}

export default RevisionControls;
