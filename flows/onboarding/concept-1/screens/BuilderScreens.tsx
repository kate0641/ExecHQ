"use client";

import { useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { RevisionChips } from "@/components/onboarding/RevisionChips";
import { StoryText } from "@/components/onboarding/StoryText";
import { WizardStep } from "@/components/onboarding/WizardStep";
import { Button } from "@/components/primitives/Button";
import type { PositioningInputs } from "@/flows/onboarding/shared";
import {
  EXPORT_ACTIONS,
  OPENER_KIND,
  POSITIONING_C1,
  bioFor,
  builtFrom,
  goalFor,
  narrativeFor,
  nextUseFor,
  openerFor,
  planById,
  segmentsToText,
  toggleRevision,
  visibleRevisions,
  type BioLength,
  type OutputKind,
  type PlanTemplate,
  type StorySegment,
} from "@/mock/onboarding";
import type { ScreenProps } from "./types";

/**
 * The Positioning Builder, Concept 1's first artifact for every plan, in two
 * pages: what goes in, then what comes out. Each page is its own mark in the
 * progress bar.
 */

/** The plan the user chose, or the one recommended to them. */
function usePlan({ flow }: Pick<ScreenProps, "flow">): PlanTemplate | undefined {
  const { state, derived } = flow;
  return planById(state.answers.planId ?? "") ?? derived?.recommended;
}

/* -----------------------------------------------------------------------------
   BUILD
   -------------------------------------------------------------------------- */

/**
 * What goes in, grouped by the part of the story each input fills. What
 * earlier steps told us is shown, not asked again. Everything is optional:
 * "Build my story" works with nothing filled in, and every gap stays visible
 * on the outputs page until the user fills it.
 */
export function PositioningBuildScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, withDelay } = flow;
  const inputs = state.answers.positioning;
  const plan = usePlan({ flow });
  const direction = state.answers.direction ?? "";
  const copy = POSITIONING_C1;

  const set = (patch: Partial<PositioningInputs>) =>
    dispatch({ type: "set-positioning", patch });

  const hasOpener = Boolean(OPENER_KIND[inputs.audience]);
  const showFirstOptions = [
    copy.outputs.narrative,
    copy.outputs.bio,
    ...(hasOpener ? [OPENER_KIND[inputs.audience]] : []),
  ];
  const showFirstKey: Record<string, string> = {
    [copy.outputs.narrative]: "narrative",
    [copy.outputs.bio]: "bio",
    ...(hasOpener ? { [OPENER_KIND[inputs.audience]]: "opener" } : {}),
  };
  const showFirstLabel =
    Object.keys(showFirstKey).find((label) => showFirstKey[label] === inputs.showFirst) ??
    copy.outputs.narrative;

  function build() {
    // A rebuild starts from the inputs, so earlier hand edits are dropped.
    set({ built: true, edits: {} });
    withDelay("drafting", () => {});
  }

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow={copy.tool}
      title={copy.buildTitle}
      description={copy.buildHint}
      headingId={headingId}
      primaryLabel={copy.build}
      onPrimary={build}
    >
      <section className="builder-part" aria-labelledby="builder-doing">
        <h2 className="builder-part__title" id="builder-doing">
          {copy.parts.doing}
        </h2>
        <Input
          label={copy.role.label}
          placeholder={copy.role.placeholder}
          value={inputs.role}
          onChange={(event) => set({ role: event.target.value })}
        />
        <Input
          label={copy.own.label}
          placeholder={copy.own.placeholder}
          value={inputs.own}
          onChange={(event) => set({ own: event.target.value })}
        />
        <ChipGroup
          label={copy.team.label}
          options={copy.team.options}
          value={inputs.teamSize ? [inputs.teamSize] : []}
          onChange={(next) => set({ teamSize: next[0] ?? "" })}
        />
      </section>

      <section className="builder-part" aria-labelledby="builder-known">
        <h2 className="builder-part__title" id="builder-known">
          {copy.parts.known}
        </h2>
        <ChipGroup
          label={copy.strengths.label}
          note={copy.strengths.note}
          options={copy.strengths.options}
          value={inputs.strengths}
          max={copy.strengths.max}
          onChange={(next) => set({ strengths: next })}
        />
        <Input
          label={copy.result.label}
          placeholder={copy.result.placeholder}
          multiline
          rows={2}
          value={inputs.result}
          onChange={(event) => set({ result: event.target.value })}
        />
      </section>

      {/* Already known from earlier steps, so shown rather than asked. */}
      <section className="builder-part" aria-labelledby="builder-toward">
        <h2 className="builder-part__title" id="builder-toward">
          {copy.parts.toward}
        </h2>
        <div className="builder-known">
          <p className="builder-known__label">{copy.fromPlan}</p>
          <ul className="builder-known__tags">
            {builtFrom(direction, state.answers.refinement).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
            {plan ? <li>{plan.name}</li> : null}
          </ul>
        </div>
      </section>

      <section className="builder-part" aria-labelledby="builder-use">
        <h2 className="builder-part__title" id="builder-use">
          {copy.parts.use}
        </h2>
        <ChipGroup
          label={copy.audience.label}
          note={copy.audience.note}
          options={copy.audience.options}
          value={inputs.audience ? [inputs.audience] : []}
          onChange={(next) => {
            const audience = next[0] ?? "";
            // Without an opener, it cannot be the output shown first.
            const keepFirst = OPENER_KIND[audience] || inputs.showFirst !== "opener";
            set({ audience, showFirst: keepFirst ? inputs.showFirst : "narrative" });
          }}
        />
        <ChipGroup
          label={copy.showFirst.label}
          options={showFirstOptions}
          value={[showFirstLabel]}
          onChange={(next) =>
            set({ showFirst: next[0] ? showFirstKey[next[0]] : "narrative" })
          }
        />
      </section>

      <section className="builder-part" aria-labelledby="builder-bio">
        <h2 className="builder-part__title" id="builder-bio">
          {copy.parts.bio}
        </h2>
        <Input
          label={copy.name.label}
          autoComplete="name"
          value={inputs.name}
          onChange={(event) => set({ name: event.target.value })}
        />
        <Input
          label={copy.source.label}
          placeholder={copy.source.placeholder}
          hint={copy.source.hint}
          multiline
          rows={3}
          value={inputs.source}
          onChange={(event) => set({ source: event.target.value })}
        />
      </section>
    </WizardStep>
  );
}

/* -----------------------------------------------------------------------------
   OUTPUTS
   -------------------------------------------------------------------------- */

type OutputView = OutputKind;

/**
 * What comes out: the builder's four outputs. The leadership narrative in its
 * three parts (or read as one), the executive bio at three lengths, the
 * optional opener for the audience they chose, and where to use it next.
 *
 * Each output has its own revision chips. They build on each other: an
 * applied one fades with a check and its follow-ups appear, and each output
 * keeps its own set, so shortening the narrative leaves the bio alone.
 *
 * Copy, Download and Email sit with the pinned action, available the whole
 * time, and each takes everything at once. Nothing in this prototype leaves
 * the browser, so they confirm and stop.
 */
export function PositioningOutputScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, generating } = flow;
  const inputs = state.answers.positioning;
  const plan = usePlan({ flow });
  const goal = goalFor(state.answers.direction ?? "");
  const copy = POSITIONING_C1;

  const [view, setView] = useState<OutputView>(inputs.showFirst as OutputView);
  const [applied, setApplied] = useState<Record<OutputView, string[]>>({
    narrative: [],
    bio: [],
    opener: [],
  });
  const [length, setLength] = useState<BioLength>("short");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [exported, setExported] = useState<string | null>(null);

  if (generating === "drafting") {
    return (
      <WizardStep step={step} total={total} title="One moment" headingId={headingId}>
        <GeneratingState label={copy.building} />
      </WizardStep>
    );
  }

  const opener = openerFor(inputs, goal, applied.opener);
  const shown: OutputView = view === "opener" && !opener ? "narrative" : view;
  const revisions = applied[shown];
  const parts = narrativeFor(inputs, goal, applied.narrative);
  const asOne = applied.narrative.includes("asOne");
  const editKey = shown === "bio" ? `bio-${length}` : shown;
  const edited = inputs.edits[editKey];
  // The long bio already says the goal, so adding it would change nothing.
  const unavailable = shown === "bio" && length === "long" ? ["goal"] : [];

  /** The current output as segments, for editing and for the as-one view. */
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

  function saveEdit() {
    dispatch({
      type: "set-positioning",
      patch: { edits: { ...inputs.edits, [editKey]: draft } },
    });
    setEditing(false);
  }

  const exportLinks = (
    <div className="builder-export">
      <div className="builder-export__links">
        <button type="button" onClick={() => setExported(copy.copied)}>
          {copy.copy}
        </button>
        <button type="button" onClick={() => setExported(EXPORT_ACTIONS.downloaded)}>
          {EXPORT_ACTIONS.downloadLabel}
        </button>
        <button type="button" onClick={() => setExported(EXPORT_ACTIONS.emailed)}>
          {EXPORT_ACTIONS.emailLabel}
        </button>
      </div>
      <output className="builder-export__status">{exported}</output>
    </div>
  );

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow={copy.tool}
      title={plan?.thisWeek?.output ?? "The story of what you lead"}
      description={copy.outputHint}
      headingId={headingId}
      primaryLabel={copy.save}
      onPrimary={() => {
        dispatch({ type: "save-artifact" });
        dispatch({ type: "go-to", step: "complete" });
      }}
      primaryDisabled={editing}
      actionsLead={exportLinks}
    >
      <ToggleGroup
        label="Output"
        labelHidden
        shape="pill"
        options={viewOptions}
        value={shown}
        onChange={(next) => {
          setView(next as OutputView);
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
            <Button variant="primary" size="sm" onClick={saveEdit}>
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

      {/* A hand edit replaces the generated text, so the chips that rewrite
          it step aside until the edit is cleared by a rebuild. */}
      {!editing && !edited ? (
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
        <p className="builder-next__text">
          {nextUseFor(inputs.audience, plan?.stages?.[1]?.title)}
        </p>
      </section>
    </WizardStep>
  );
}
