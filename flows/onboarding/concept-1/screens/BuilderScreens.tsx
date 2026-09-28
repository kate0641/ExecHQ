"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/form/Input";
import { GeneratingState } from "@/components/onboarding/GeneratingState";
import { ExportLinks } from "@/components/onboarding/ExportLinks";
import { StoryDraft } from "@/components/onboarding/StoryDraft";
import { WizardStep } from "@/components/onboarding/WizardStep";
import { Button } from "@/components/primitives/Button";
import {
  DRAFT_C1,
  DRAFT_EXPORTS,
  POSITIONING_C1,
  SHARPEN_C1,
  firstDraftFor,
  isSharpened,
  planById,
  type PlanTemplate,
} from "@/mock/onboarding";
import type { ScreenProps } from "./types";

/**
 * The story, Concept 1's first artifact for every plan.
 *
 * Written before anything is asked, by decision on 2026-09-28: confirming the
 * plan hands over a first draft built from the direction and the refinement
 * answers. It replaces a ten-field build page and a four-output page, which
 * made the first win cost more than the plan did. Sharpening is optional and
 * asks three things; the bio, the opener and the rest of the builder move out
 * of onboarding.
 */

/** The plan the user chose, or the one recommended to them. */
function usePlan({ flow }: Pick<ScreenProps, "flow">): PlanTemplate | undefined {
  const { state, derived } = flow;
  return planById(state.answers.planId ?? "") ?? derived?.recommended;
}

/** Where a hand edit of the draft is kept, with the builder's other edits. */
const DRAFT_EDIT = "draft";

/**
 * The first draft, with the optional sharpen page behind it.
 *
 * Saving is the skip: the draft is kept whichever way the user goes, so there
 * is nothing to decline. Sharpening is quieter than saving, and says what
 * happens if it is left: it becomes this week's quick win on the plan.
 */
export function StoryDraftScreen({ flow, step, total, headingId }: ScreenProps) {
  const { state, dispatch, generating } = flow;
  const inputs = state.answers.positioning;
  const plan = usePlan({ flow });
  const [sharpening, setSharpening] = useState(false);
  const [editing, setEditing] = useState(false);

  // The shell moves focus on a step change; opening and closing the sharpen
  // page is a change inside the step, so it moves focus itself.
  const wasSharpening = useRef(sharpening);
  useEffect(() => {
    if (wasSharpening.current === sharpening) return;
    wasSharpening.current = sharpening;
    document.getElementById(headingId)?.focus();
  }, [sharpening, headingId]);

  if (generating === "drafting") {
    return (
      <WizardStep step={step} total={total} title="One moment" headingId={headingId}>
        <GeneratingState label={DRAFT_C1.writing} />
      </WizardStep>
    );
  }

  if (sharpening) {
    return (
      <SharpenPage
        flow={flow}
        headingId={headingId}
        onDone={() => setSharpening(false)}
      />
    );
  }

  const sharpened = isSharpened(inputs);
  const text = firstDraftFor(state.answers.direction ?? "", state.answers.refinement, inputs);

  return (
    <WizardStep
      step={step}
      total={total}
      eyebrow={DRAFT_C1.eyebrow}
      title={DRAFT_C1.title}
      description={DRAFT_C1.hint}
      headingId={headingId}
      primaryLabel={DRAFT_C1.save}
      onPrimary={() => {
        dispatch({ type: "save-artifact" });
        dispatch({ type: "go-to", step: "complete" });
      }}
      primaryDisabled={editing}
      actionsLead={<ExportLinks actions={DRAFT_EXPORTS} />}
    >
      <StoryDraft
        // A new draft, from sharpening, opens fresh rather than in an editor
        // still holding the old one.
        key={text}
        label={sharpened ? DRAFT_C1.sharpenedLabel : DRAFT_C1.label}
        text={text}
        edited={inputs.edits[DRAFT_EDIT]}
        onSaveEdit={(own) =>
          dispatch({
            type: "set-positioning",
            patch: { edits: { ...inputs.edits, [DRAFT_EDIT]: own } },
          })
        }
        onEditingChange={setEditing}
        usesLabel={DRAFT_C1.usesLabel}
        uses={plan?.uses ?? []}
      />

      <div className="draft-sharpen">
        <p className="draft-sharpen__lead">
          {sharpened ? DRAFT_C1.sharpenedLead : DRAFT_C1.sharpenLead}
        </p>
        <Button variant="secondary" fullWidth onClick={() => setSharpening(true)}>
          {sharpened ? DRAFT_C1.sharpenAgain : DRAFT_C1.sharpen}
        </Button>
      </div>
    </WizardStep>
  );
}

/**
 * The three facts only the user knows. Reached only from the draft and not
 * counted in progress, like the custom-plan wizard. Every field is optional,
 * and anything left empty is left out of the draft rather than drawn as a gap.
 */
function SharpenPage({
  flow,
  headingId,
  onDone,
}: Pick<ScreenProps, "flow" | "headingId"> & { onDone: () => void }) {
  const { state, dispatch } = flow;
  const inputs = state.answers.positioning;
  const [role, setRole] = useState(inputs.role);
  const [own, setOwn] = useState(inputs.own);
  const [result, setResult] = useState(inputs.result);
  const handEdited = Boolean(inputs.edits[DRAFT_EDIT]);

  return (
    <WizardStep
      step={1}
      total={1}
      showProgress={false}
      eyebrow={SHARPEN_C1.eyebrow}
      title={SHARPEN_C1.title}
      description={handEdited ? `${SHARPEN_C1.hint} ${SHARPEN_C1.rewrites}` : SHARPEN_C1.hint}
      headingId={headingId}
      backLabel={SHARPEN_C1.back}
      onBack={onDone}
      primaryLabel={SHARPEN_C1.update}
      onPrimary={() => {
        // The draft is rewritten from the facts, so a hand edit is replaced.
        const otherEdits = { ...inputs.edits };
        delete otherEdits[DRAFT_EDIT];
        dispatch({
          type: "set-positioning",
          patch: { role: role.trim(), own: own.trim(), result: result.trim(), edits: otherEdits },
        });
        onDone();
      }}
    >
      <Input
        label={POSITIONING_C1.role.label}
        placeholder={POSITIONING_C1.role.placeholder}
        value={role}
        onChange={(event) => setRole(event.target.value)}
      />
      <Input
        label={POSITIONING_C1.own.label}
        placeholder={POSITIONING_C1.own.placeholder}
        value={own}
        onChange={(event) => setOwn(event.target.value)}
      />
      <Input
        label={POSITIONING_C1.result.label}
        placeholder={POSITIONING_C1.result.placeholder}
        multiline
        rows={2}
        value={result}
        onChange={(event) => setResult(event.target.value)}
      />
    </WizardStep>
  );
}
