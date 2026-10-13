"use client";

import { useState } from "react";
import type { OutcomeNextOffer } from "@/components/loop/OutcomeNext";
import { aheadPhrase, shortDate, type LoopRecord, type OutcomeType } from "@/lib/loop";
import { useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { resolveNextAfter, resolveTaskNext, type NextAfter, type ResolvedOffer } from "@/lib/next-after";
import { addStepToPlan, planShownNow, usePlanShown } from "@/lib/plan-store";
import { draftText, revise, revisionLabel } from "@/lib/toolbox-draft";
import { toolboxActions, toolboxNow, toolboxPageFor, useToolbox, type DraftState } from "@/lib/toolbox-store";
import { ACTION_QUEUE } from "@/mock/plan";
import { NEXT_STEP_COPY as N, REVISION_COPY } from "@/mock/toolbox";

const DAY = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" });
function stamp(today: string): string {
  const now = new Date();
  return `${DAY.format(new Date(`${today}T00:00:00Z`))} ${shortDate(today)}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
}

/** The step a piece of work was for, by its recommendation's title. */
export const stepServed = (record: LoopRecord | undefined): string | undefined =>
  record?.recommendation ? ACTION_QUEUE.find((s) => s.title === record.recommendation)?.id : undefined;

/** Does an offer that stays on the page: adds the step to her Plan, copies
 *  part of the work, or makes a sharper version. Links are followed instead. */
export function doOffer(offer: ResolvedOffer, record: LoopRecord | undefined, draft: DraftState | undefined, scenario: string, today: string): void {
  const version = draft ? draft.versions[draft.showing - 1] : undefined;
  if (offer.stepId) addStepToPlan(scenario, offer.stepId, today, offer.heard);
  if (offer.sections && draft && version) {
    const part = version.sections.filter((section) => offer.sections!.includes(section.id));
    navigator.clipboard?.writeText(draftText(part, draft.edits[draft.showing] ?? {}, draft.answers)).catch(() => undefined);
  }
  if (offer.choice && record && version) {
    toolboxActions.addVersion(record.id, { when: stamp(today), what: revisionLabel(offer.choice, "") || REVISION_COPY.revise, sections: revise(version.sections, offer.choice) });
  }
}

/** The next step for a record, read fresh from the stores outside React:
 *  the advisor's reply. */
export function nextAfterNow(record: LoopRecord, type: OutcomeType, scenario: string, today: string): NextAfter {
  const toolbox = toolboxNow();
  return resolveNextAfter({
    record,
    type,
    draft: toolbox.drafts[record.id],
    planShown: planShownNow(scenario, today),
    servedStepId: stepServed(record),
    flowConcept: toolboxPageFor(toolbox.concept ?? "concept-1"),
  });
}

export interface UseNextAfter {
  readback: string;
  offers: OutcomeNextOffer[];
  /** After "Nothing yet": when ExecHQ asks again. */
  note?: string;
}

/**
 * The next step after she answers, as `OutcomeNext` shows it, with its
 * actions done here: adding a step to her Plan (only on her word), copying
 * part of the work, making a sharper version. The builder, Home and the
 * advisor's card all read the same rules (`lib/next-after.ts`).
 *
 * `answer` is the record (or Plan action with no draft) and what she said;
 * nothing shows until there is one.
 */
export function useNextAfter(
  answer: { record: LoopRecord; type: OutcomeType } | { taskId: string; type: OutcomeType } | undefined,
  options: { servedStepId?: string; flowConcept?: string } = {}
): UseNextAfter | undefined {
  const loop = useLoop();
  const toolbox = useToolbox();
  const planShown = usePlanShown(loop.id, loop.today);
  const [done, setDone] = useState<string[]>([]);
  const [lastAnswer, setLastAnswer] = useState<string>("");
  const answerKey = answer ? `${"record" in answer ? answer.record.id : answer.taskId}|${answer.type}` : "";
  if (answerKey !== lastAnswer) {
    setLastAnswer(answerKey);
    setDone([]);
  }
  if (!answer) return undefined;

  const record = "record" in answer ? answer.record : undefined;
  const draft = record ? toolbox.drafts[record.id] : undefined;
  const next: NextAfter = record
    ? resolveNextAfter({
        record,
        type: answer.type,
        draft,
        planShown,
        servedStepId: options.servedStepId ?? stepServed(record),
        flowConcept: options.flowConcept ?? toolboxPageFor(toolbox.concept ?? "concept-1"),
      })
    : resolveTaskNext(answer.type, planShown, "taskId" in answer ? answer.taskId : "");

  const act = (offer: ResolvedOffer) => {
    doOffer(offer, record, draft, loop.id, loop.today);
    setDone((d) => [...d, offer.key]);
  };

  const offers: OutcomeNextOffer[] = next.offers.map((offer) => ({
    id: offer.key,
    eyebrow: offer.eyebrow,
    title: offer.title,
    body: offer.body,
    action: offer.href ? { label: offer.label, href: offer.href } : { label: offer.label, onClick: () => act(offer) },
    done:
      offer.type === "plan-step"
        ? offer.onPlan
          ? { said: N.planStep.added, link: { label: N.planStep.open, href: conceptHref("plan", "concept-3") } }
          : undefined
        : done.includes(offer.key) && offer.doneText
          ? { said: offer.doneText }
          : undefined,
  }));

  return {
    readback: next.readback,
    offers,
    note:
      answer.type === "no-response-yet" && record?.checkBackOn ? N.askAgain(record.kind, aheadPhrase(record.checkBackOn, loop.today)) : undefined,
  };
}
