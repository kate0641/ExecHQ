/**
 * What comes after she says how something went: the next step, whatever she
 * answered (13 October). One set of rules (`AFTER_ANSWER` in mock/playbook) and
 * one reading of them, shared by the builder, Home and the advisor, so the
 * same answer always gets the same next step wherever she gives it.
 *
 * Pure: everything it needs is passed in. `lib/use-next-after.tsx` gathers
 * that from the stores and does the actions; the advisor calls this directly.
 */
import type { LoopRecord, OutcomeType } from "@/lib/loop";
import type { DraftState } from "@/lib/playbook-store";
import { conceptHref } from "@/lib/manifest";
import { HANDOFF_RULES, HANDOFF_STEP, stepById } from "@/mock/plan";
import { OUTCOME_READBACK } from "@/mock/loop";
import { AFTER_ANSWER, NEXT_STEP_COPY as N, type NextOffer } from "@/mock/playbook";

/** One offer, resolved to what it says and what it does. */
export interface ResolvedOffer {
  key: string;
  type: NextOffer["type"];
  eyebrow?: string;
  title: string;
  body?: string;
  /** The action's words. */
  label: string;
  /** Goes somewhere. */
  href?: string;
  /** Adds this step to her Plan, with why. */
  stepId?: string;
  heard?: string;
  /** It is on her Plan already. */
  onPlan?: boolean;
  /** Copies these sections of the work. */
  sections?: readonly string[];
  /** Makes a new version with this revision. */
  choice?: Readonly<Record<string, string>>;
  /** What it says once done (copied, sharpened). */
  doneText?: string;
}

export interface NextAfterInput {
  record: LoopRecord;
  type: OutcomeType;
  draft?: DraftState;
  /** What is on her Plan now, in order. */
  planShown: readonly string[];
  /** The step this work was for: never offered as what's next. */
  servedStepId?: string;
  /** The builder concept new work opens in. */
  flowConcept: string;
}

export interface NextAfter {
  readback: string;
  offers: ResolvedOffer[];
}

const NEXT_ON_PLAN: NextOffer = { type: "next-on-plan" };

/** The next step on her Plan that isn't the one just done or already offered. */
function nextOnPlan(planShown: readonly string[], not: readonly (string | undefined)[], key: string): ResolvedOffer[] {
  const id = planShown.find((s) => !not.includes(s));
  const step = id ? stepById(id) : undefined;
  return step ? [{ key, type: "next-on-plan", eyebrow: N.nextOnPlan.label, title: step.title, label: N.nextOnPlan.action, href: conceptHref("plan", "concept-3") }] : [];
}

export function resolveNextAfter({ record, type, draft, planShown, servedStepId, flowConcept }: NextAfterInput): NextAfter {
  const rule = AFTER_ANSWER[record.kind][type];
  // A brief reads its own goal to choose a step.
  const goal = record.kind === "situation-brief" ? (draft?.inputs.objective ?? "").trim() : "";
  const handsOffTo = goal ? HANDOFF_RULES.find((r) => r.says.test(goal))?.stepId : undefined;
  const goalStepId = handsOffTo ? (HANDOFF_STEP[handsOffTo] ?? handsOffTo) : undefined;
  const flow = conceptHref("playbook-flow", flowConcept);
  const offered: string[] = [];

  const resolve = (offer: NextOffer, i: number): ResolvedOffer[] => {
    const key = `${offer.type}-${i}`;
    switch (offer.type) {
      case "plan-step": {
        const id = offer.stepId ?? goalStepId;
        const step = id ? stepById(id) : undefined;
        if (!step) return resolve(NEXT_ON_PLAN, i);
        offered.push(step.id);
        return [
          {
            key,
            type: "plan-step",
            eyebrow: N.planStep.label,
            title: step.title,
            body: offer.stepId ? offer.because : N.planStep.because(goal),
            label: N.planStep.add,
            stepId: step.id,
            heard: offer.stepId ? N.planStep.from(record.title) : N.planStep.heard(goal),
            onPlan: planShown.includes(step.id),
            doneText: N.planStep.added,
          },
        ];
      }
      case "copy":
        return [{ key, type: "copy", title: offer.title, body: offer.body, label: offer.action, sections: offer.sections, doneText: offer.copied }];
      case "again":
        return [{ key, type: "again", title: offer.title, body: offer.body, label: offer.action, href: `${flow}?reuse=${encodeURIComponent(record.id)}` }];
      case "start":
        return [{ key, type: "start", title: offer.title, body: offer.body, label: offer.action, href: `${flow}?tool=${offer.tool}&after=${encodeURIComponent(record.id)}` }];
      case "briefing":
        return [{ key, type: "briefing", title: offer.title, body: offer.body, label: offer.action, href: conceptHref("daily-briefing", "concept-2") }];
      case "sharpen":
        return draft ? [{ key, type: "sharpen", title: offer.title, body: offer.body, label: offer.action, choice: offer.choice, doneText: offer.done }] : [];
      case "next-on-plan":
        return nextOnPlan(planShown, [servedStepId, ...offered], key);
    }
  };
  return { readback: rule.readback, offers: rule.offers.flatMap(resolve) };
}

/** After a Plan action with no draft, done on her word: what's next on her
 *  Plan, whatever she answered. */
export function resolveTaskNext(type: OutcomeType, planShown: readonly string[], taskId: string): NextAfter {
  return { readback: OUTCOME_READBACK[type].replace(/^You said /, "").replace(/^./, (c) => c.toUpperCase()), offers: nextOnPlan(planShown, [taskId], "next-on-plan-0") };
}
