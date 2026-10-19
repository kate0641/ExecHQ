/**
 * Where a step, an artifact or a suggestion opens, from anywhere outside the
 * Toolbox: the Plan, the homepage, the Concierge, the Signal Picture.
 *
 * Sprint 4 brief (as amended 11 October): any artifact shown in the Plan, an
 * action step or a Loop follow-up opens that artifact directly, without going
 * through the Toolbox page. A step that makes something opens its tool, with
 * the step's own facts filled in. "Read today's Briefing" opens the Briefing,
 * marked as coming from the Plan, so reading one item completes the step.
 *
 * Links go to the Toolbox concept the reviewer last opened (Concept 1 until
 * one is), so any page can be reviewed with any Toolbox concept.
 */

import { useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { flowFor, useToolbox } from "@/lib/toolbox-store";
import type { ArtifactKind } from "@/mock/loop";
import { stepById } from "@/mock/plan";
import { ACTIONS } from "@/mock/plan-stub";
import { TOOL_ORDER, TOOLS } from "@/mock/toolbox";

/** The step that "Read today's Briefing" is. */
export const READ_BRIEFING_STEP = "read-briefing";

const kindOfTool = (name?: string): ArtifactKind | undefined => TOOL_ORDER.find((k) => TOOLS[k].name === name);

export function useToolboxLinks() {
  const loop = useLoop();
  const toolbox = useToolbox();
  const concept = toolbox.concept ?? "concept-2";
  const flow = conceptHref("toolbox-flow", flowFor(toolbox));

  const forRecord = (id: string) => `${flow}?artifact=${encodeURIComponent(id)}`;

  /** The artifact a step already has, if she has started it. */
  const artifactFor = (stepId: string): string | undefined => {
    const step = stepById(stepId);
    const fromStub = ACTIONS.find((a) => a.id === stepId)?.artifactId;
    if (fromStub && loop.records.some((r) => r.id === fromStub)) return fromStub;
    const byTitle = step ? loop.records.find((r) => r.recommendation === step.title && r.state !== "closed") : undefined;
    if (byTitle) return byTitle.id;
    return Object.entries(toolbox.drafts).find(([id, d]) => d.meta.planStepId === stepId && loop.records.some((r) => r.id === id && r.state !== "closed"))?.[0];
  };

  const forStep = (stepId: string): string => {
    if (stepId === READ_BRIEFING_STEP) return `${conceptHref("daily-briefing", "concept-2")}?from=plan`;
    const existing = artifactFor(stepId);
    if (existing) return forRecord(existing);
    const kind = kindOfTool(stepById(stepId)?.toolboxTool);
    return kind ? `${flow}?tool=${kind}&step=${encodeURIComponent(stepId)}` : conceptHref("toolbox", concept);
  };

  /** True when the step already has a draft she can open. */
  const hasDraft = (stepId: string) => Boolean(artifactFor(stepId));

  return { forStep, forRecord, hasDraft, toolbox: conceptHref("toolbox", concept) };
}
