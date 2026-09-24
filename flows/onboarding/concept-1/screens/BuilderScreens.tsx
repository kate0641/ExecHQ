"use client";

import { useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { ExportLinks } from "@/components/onboarding/ExportLinks";
import { StoryOutputs } from "@/components/onboarding/StoryOutputs";
import { WizardStep } from "@/components/onboarding/WizardStep";
import type { PositioningInputs } from "@/flows/onboarding/shared";
import {
  OPENER_KIND,
  POSITIONING_C1,
  STORY_EXPORTS,
  builtFrom,
  planById,
  type OutputKind,
  type PlanTemplate,
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

/**
 * What comes out: the builder's four outputs, drawn by StoryOutputs, which
 * Concept 2's story card shares. Copy, Download and Email sit with the pinned
 * action, available the whole time, and each takes everything at once.
 */
export function PositioningOutputScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, generating } = flow;
  const inputs = state.answers.positioning;
  const plan = usePlan({ flow });
  const copy = POSITIONING_C1;
  const [editing, setEditing] = useState(false);

  if (generating === "drafting") {
    return (
      <WizardStep step={step} total={total} title="One moment" headingId={headingId}>
        <GeneratingState label={copy.building} />
      </WizardStep>
    );
  }

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
      actionsLead={<ExportLinks actions={STORY_EXPORTS} />}
    >
      <StoryOutputs
        inputs={inputs}
        direction={state.answers.direction ?? ""}
        showFirst={inputs.showFirst as OutputKind}
        nextStage={plan?.stages?.[1]?.title}
        edits={inputs.edits}
        onSaveEdit={(key, text) =>
          dispatch({ type: "set-positioning", patch: { edits: { ...inputs.edits, [key]: text } } })
        }
        onEditingChange={setEditing}
      />
    </WizardStep>
  );
}

