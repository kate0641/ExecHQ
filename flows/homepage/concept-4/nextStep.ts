import { ACTIONS, actionById } from "@/mock/plan-stub";
import type { LoopView } from "@/lib/loop-store";
import type { MapRing } from "@/lib/map";

/**
 * Her next step on the homepage: after a logged outcome, none (that step
 * is done); otherwise the first recommendation she has started whose work has
 * not reached the Loop yet. Never one she has not started, or has skipped.
 * The card under the rings opens on it, on its own ring.
 */
export function nextStepOf(loop: LoopView, rings: MapRing[]) {
  const answered =
    loop.homeState === "just-answered" && loop.justAnswered ? loop.records.find((r) => r.id === loop.justAnswered) : undefined;
  const inProgress = new Set(rings.flatMap((r) => r.segments.filter((s) => s.state === "in-progress").map((s) => s.action.id)));
  const outcome = answered?.outcome;
  const updated = Boolean(answered && outcome && outcome.type !== "no-response-yet");
  /* A step she has just logged an outcome for is done. It does not bring a
     replacement: the card says it is done and points to the Plan. */
  const done = updated ? ACTIONS.find((a) => a.artifactId === answered!.id) : undefined;
  const step = updated
    ? undefined
    : loop.recommendations.find((rec) => {
        const action = actionById(rec.id);
        if (action && !inProgress.has(action.id)) return false;
        const record = action?.artifactId ? loop.records.find((r) => r.id === action.artifactId) : undefined;
        if (loop.tasks?.[rec.id]) return false;
        return !record || record.state === "drafted" || record.state === "in-progress";
      });
  return { step, stepAction: step ? actionById(step.id) : undefined, updated, done };
}
