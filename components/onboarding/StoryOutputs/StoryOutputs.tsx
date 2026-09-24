"use client";

import { useState } from "react";
import { Input } from "@/components/form/Input";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { RevisionChips } from "@/components/onboarding/RevisionChips";
import { StoryText } from "@/components/onboarding/StoryText";
import { Button } from "@/components/primitives/Button";
import {
  POSITIONING_C1,
  bioFor,
  goalFor,
  narrativeFor,
  nextUseFor,
  openerFor,
  segmentsToText,
  toggleRevision,
  visibleRevisions,
  type BioLength,
  type OutputKind,
  type PositioningSource,
  type StorySegment,
} from "@/mock/onboarding";

export interface StoryOutputsProps {
  inputs: PositioningSource;
  /** The user's direction: the goal the story works toward. */
  direction: string;
  /** Which output opens first. */
  showFirst?: OutputKind;
  /** The plan's next stage, for "Where to use it next". */
  nextStage?: string;
  /** Hand edits, keyed by output. */
  edits: Record<string, string>;
  onSaveEdit: (key: string, text: string) => void;
  /** Told when editing starts and stops, so a page can hold its own action. */
  onEditingChange?: (editing: boolean) => void;
  /** The revisions applied, when the page shares them with its own controls
   *  (Concept 2's quick replies). Omitted: kept here. */
  applied?: Record<OutputKind, string[]>;
  onAppliedChange?: (applied: Record<OutputKind, string[]>) => void;
  /** The narrative's parts as the user already approved them, one by one
   *  (Concept 2). Shown as they are: the narrative's revision chips step
   *  aside, since each part was settled on its own. Edit still works. */
  narrativeParts?: readonly { heading: string; segments: StorySegment[] }[];
  className?: string;
}

const NO_REVISIONS: Record<OutputKind, string[]> = { narrative: [], bio: [], opener: [] };

/** A part of the narrative the user rewrote on its own, keyed by its place. */
export const narrativePartKey = (index: number) => `narrative-${index}`;

/**
 * The Positioning Builder's outputs: the leadership narrative in its three
 * parts (or read as one), the executive bio at three lengths, the optional
 * opener for the chosen audience, and where to use it next.
 *
 * Each output has its own revision chips, which build on each other; a hand
 * edit replaces the generated text and the chips step aside. Shared by
 * Concept 1's outputs page and Concept 2's story card, so the two can only
 * ever differ in where they sit.
 */
export function StoryOutputs({
  inputs,
  direction,
  showFirst = "narrative",
  nextStage,
  edits,
  onSaveEdit,
  onEditingChange,
  applied: appliedProp,
  onAppliedChange,
  narrativeParts,
  className,
}: StoryOutputsProps) {
  const copy = POSITIONING_C1;
  const goal = goalFor(direction);
  const [view, setView] = useState<OutputKind>(showFirst);
  const [appliedOwn, setAppliedOwn] = useState<Record<OutputKind, string[]>>(NO_REVISIONS);
  const applied = appliedProp ?? appliedOwn;
  const setApplied = (next: (all: Record<OutputKind, string[]>) => Record<OutputKind, string[]>) => {
    const value = next(applied);
    if (onAppliedChange) onAppliedChange(value);
    else setAppliedOwn(value);
  };
  const [length, setLength] = useState<BioLength>("short");
  const [editing, setEditingState] = useState(false);
  const [draft, setDraft] = useState("");

  function setEditing(next: boolean) {
    setEditingState(next);
    onEditingChange?.(next);
  }

  const opener = openerFor(inputs, goal, applied.opener);
  const shown: OutputKind = view === "opener" && !opener ? "narrative" : view;
  const revisions = applied[shown];
  // A part rewritten on its own keeps the user's words.
  const parts =
    narrativeParts ??
    narrativeFor(inputs, goal, applied.narrative).map((part, index) => {
      const own = edits[narrativePartKey(index)];
      return own ? { ...part, segments: [{ text: own }] } : part;
    });
  const settled = Boolean(narrativeParts) && shown === "narrative";
  const asOne = applied.narrative.includes("asOne");
  const editKey = shown === "bio" ? `bio-${length}` : shown;
  const edited = edits[editKey];
  // The long bio already says the goal, so adding it would change nothing.
  const unavailable = shown === "bio" && length === "long" ? ["goal"] : [];

  function currentSegments(): StorySegment[] {
    if (shown === "bio") return bioFor(inputs, goal, length, applied.bio);
    if (shown === "opener" && opener) return opener.segments;
    return parts.flatMap((part, index) =>
      index === 0 ? part.segments : [{ text: " " }, ...part.segments]
    );
  }

  const viewOptions = [
    { value: "narrative", label: copy.outputs.narrative },
    { value: "bio", label: copy.outputs.bio },
    ...(opener ? [{ value: "opener", label: opener.kind }] : []),
  ];

  return (
    <div className={["story-outputs", className].filter(Boolean).join(" ")}>
      <ToggleGroup
        label="Output"
        labelHidden
        shape="pill"
        options={viewOptions}
        value={shown}
        onChange={(next) => {
          setView(next as OutputKind);
          setEditing(false);
        }}
      />

      {shown === "bio" ? (
        <ToggleGroup
          label="Length"
          labelHidden
          shape="underline"
          options={[
            { value: "short", label: copy.lengths.short },
            { value: "medium", label: copy.lengths.medium },
            { value: "long", label: copy.lengths.long },
          ]}
          value={length}
          onChange={(next) => {
            setLength(next as BioLength);
            setEditing(false);
          }}
        />
      ) : null}

      {shown === "opener" && opener ? (
        <p className="builder-output__for">For {inputs.audience.toLowerCase().replace(/^my /, "your ")}.</p>
      ) : null}

      {editing ? (
        <div className="builder-output__edit">
          <Input
            label="Your version"
            labelHidden
            multiline
            rows={8}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="builder-output__edit-actions">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onSaveEdit(editKey, draft);
                setEditing(false);
              }}
            >
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : edited ? (
        <StoryText segments={[{ text: edited }]} className="builder-output__text" />
      ) : shown === "narrative" && !asOne ? (
        <ol className="builder-narrative">
          {parts.map((part) => (
            <li key={part.heading}>
              <p className="builder-narrative__label">{part.heading}</p>
              <StoryText segments={part.segments} className="builder-output__text" />
            </li>
          ))}
        </ol>
      ) : (
        <StoryText segments={currentSegments()} className="builder-output__text" />
      )}

      {!editing ? (
        <div className="builder-output__tools">
          <button
            type="button"
            className="builder-output__edit-link"
            onClick={() => {
              setDraft(edited ?? segmentsToText(currentSegments()));
              setEditing(true);
            }}
          >
            {copy.edit}
          </button>
        </div>
      ) : null}

      {!editing && !edited && !settled ? (
        <RevisionChips
          label={copy.revise.label}
          options={visibleRevisions(shown, revisions, unavailable)}
          applied={revisions}
          onToggle={(id) =>
            setApplied((all) => ({
              ...all,
              [shown]: toggleRevision(shown, all[shown], id, unavailable),
            }))
          }
        />
      ) : null}

      <section className="builder-next" aria-label={copy.nextUse}>
        <p className="builder-next__label">{copy.nextUse}</p>
        <p className="builder-next__text">{nextUseFor(inputs.audience, nextStage)}</p>
      </section>
    </div>
  );
}

export default StoryOutputs;
