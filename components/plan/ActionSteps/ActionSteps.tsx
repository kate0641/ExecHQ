"use client";

import { useEffect, useRef, useState } from "react";
import { ActionStepCard } from "@/components/plan/ActionStepCard";
import { Switch } from "@/components/form/Switch";
import {
  accept,
  decline,
  defer,
  complete,
  edit as editStep,
  initialPlanState,
  keepWorkload,
  liveIn,
  newVisit,
  liveSteps,
  reconcile,
  type EmptyReason,
  type Move,
  type PlanState,
} from "@/lib/action-steps";
import type { LoopDate } from "@/lib/loop";
import { LIVE_LIMITS, MAX_LIVE, PLAN_COPY, STEP_COPY as C, type ActionStep } from "@/mock/plan";
import { HORIZONS, type Horizon } from "@/mock/plan-stub";

interface Note {
  heard?: string;
  offerRecord?: boolean;
}

/** What the page keeps between visits. */
export interface SavedSteps {
  state: PlanState;
  notes: Record<string, Note>;
  empties: Partial<Record<Horizon, EmptyReason>>;
}

export interface ActionStepsProps {
  today: LoopDate;
  /** Where Start leads: the Toolbox flow, stubbed until Sprint 4. */
  startHref: string;
  /** Her Plan as it opens. Defaults to Maya's. */
  initial?: PlanState;
  /** Whether a step is done: its artifact reached used, sent or published, or
   *  she said so. A step that is done leaves and the next is offered. */
  isDone?: (step: ActionStep) => boolean;
  /** An outcome was just recorded: the next step is tied to what she said. */
  answered?: { recordId: string; reported?: string };
  /** She marked a step done on her word; the Loop is told. */
  onComplete?: (step: ActionStep) => void;
  /** Her choices kept between visits. Without it they last until she leaves. */
  persist?: { saved?: SavedSteps; onChange: (steps: SavedSteps) => void };
  /** Catalogue only: a card opens with this panel showing. */
  demoPanel?: "decline" | "defer" | "edit";
  /** Catalogue only: a horizon opens saying why nothing fills its free place. */
  demoEmpty?: Partial<Record<Horizon, EmptyReason>>;
  headingId?: string;
  className?: string;
}

/**
 * The Plan's next steps: never more than five, three horizons, each step with
 * its reasons. The limit shows in the layout (a count, and a free place where
 * there is room), not as a bar toward anything.
 *
 * It holds the Plan state (`lib/action-steps.ts`) and applies each move. A
 * decline fills its place at once, or says why nothing did. Nothing here
 * counts a decline or a deferral against her.
 */
export function ActionSteps({
  today,
  startHref,
  initial,
  isDone = () => false,
  answered,
  onComplete,
  persist,
  demoPanel,
  demoEmpty,
  headingId = "action-steps-heading",
  className,
}: ActionStepsProps) {
  // A new visit starts the replacement count again; everything else she decided stays.
  const [state, setState] = useState<PlanState>(() =>
    persist?.saved ? newVisit(persist.saved.state, today) : initial ?? initialPlanState(today)
  );
  const [notes, setNotes] = useState<Record<string, Note>>(persist?.saved?.notes ?? {});
  const [empties, setEmpties] = useState<Partial<Record<Horizon, EmptyReason>>>(persist?.saved?.empties ?? demoEmpty ?? {});

  // Keep her choices, but only once they differ from how the page opened.
  const kept = useRef<string | null>(null);
  useEffect(() => {
    if (!persist) return;
    const json = JSON.stringify({ state, notes, empties });
    if (kept.current === null) kept.current = json;
    else if (json !== kept.current) {
      kept.current = json;
      persist.onChange({ state, notes, empties });
    }
  });
  const [message, setMessage] = useState("");
  const focus = useRef<string | null>(null);

  // A step done in the Loop leaves, and the next is offered. Worked out while
  // rendering, once per change, so nothing flashes.
  const doneKey = liveSteps(state).filter(isDone).map((s) => s.id).join();
  const [seen, setSeen] = useState("");
  if (doneKey !== seen) {
    setSeen(doneKey);
    if (doneKey) {
      const { state: next, arrivals } = reconcile(state, isDone, answered);
      setState(next);
      setNotes((n) => {
        const out = { ...n };
        for (const a of arrivals) {
          if ("step" in a.replacement) out[a.replacement.step.id] = { heard: a.replacement.heard };
        }
        return out;
      });
      setEmpties((e) => {
        const out = { ...e };
        for (const a of arrivals) {
          if ("empty" in a.replacement) out[a.from.horizon] = a.replacement.empty;
          else delete out[a.from.horizon];
        }
        return out;
      });
    }
  }

  useEffect(() => {
    const target = focus.current;
    if (!target) return;
    focus.current = null;
    const node = document.getElementById(target);
    (node?.querySelector<HTMLElement>("h3, h4") ?? node)?.focus();
  });

  function apply(move: Move, from: ActionStep, said: string) {
    setState(move.state);
    const r = move.replacement;
    if (r && "step" in r) {
      setNotes((n) => ({ ...n, [r.step.id]: { heard: r.heard, offerRecord: r.offerRecord } }));
      setEmpties((e) => ({ ...e, [from.horizon]: undefined }));
      setMessage(`${said} ${C.announce.replacedBy(r.step.title)}`);
      focus.current = `step-${r.step.id}`;
    } else if (r) {
      setEmpties((e) => ({ ...e, [from.horizon]: r.empty }));
      setMessage(`${said} ${C.announce.nothingNew}`);
      focus.current = `steps-empty-${from.horizon}`;
    } else {
      setMessage(said);
    }
  }

  const live = liveSteps(state);

  return (
    <section className={["steps", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="steps__head">
        <h2 className="steps__heading" id={headingId}>
          {C.heading}
        </h2>
        <p className="steps__count">{C.inUse(live.length, MAX_LIVE)}</p>
      </div>
      <output className="u-visually-hidden">{message}</output>

      {HORIZONS.map((h) => {
        const steps = liveIn(state, h.id);
        const room = LIVE_LIMITS[h.id] - steps.length;
        const emptyReason = empties[h.id];
        const labelId = `steps-${h.id}`;
        return (
          <section className={`steps__group steps__group--${h.id}`} key={h.id} aria-labelledby={labelId}>
            <div className="steps__group-head">
              <h3 className="steps__group-title" id={labelId}>
                {C.horizonLabels[h.id]}
              </h3>
              <p className="steps__group-meta">
                {h.span} · {C.horizonInUse(steps.length, LIVE_LIMITS[h.id])}
              </p>
            </div>
            <div className="steps__cards">
              {steps.map((step) => (
                <ActionStepCard
                  key={step.id}
                  id={`step-${step.id}`}
                  step={step}
                  accepted={state.decisions[step.id]?.decision === "accepted"}
                  edit={state.edits[step.id]}
                  heard={notes[step.id]?.heard}
                  offerRecord={notes[step.id]?.offerRecord}
                  startHref={startHref}
                  today={state.today}
                  headingLevel={4}
                  demoPanel={demoPanel && step.id === steps[0].id ? demoPanel : undefined}
                  onAccept={() => setState((s) => accept(s, step.id))}
                  onDecline={(reason) => apply(decline(state, step.id, reason), step, C.announce.declined(step.title))}
                  onDefer={(on) => apply(defer(state, step.id, on), step, C.announce.deferred(step.title))}
                  onEdit={(change) => setState((s) => editStep(s, step.id, change))}
                  onComplete={() => {
                    onComplete?.(step);
                    apply(complete(state, step.id), step, C.announce.completed(step.title));
                  }}
                  onRecord={() => setNotes((n) => ({ ...n, [step.id]: { ...n[step.id], offerRecord: false } }))}
                />
              ))}
              {room > 0 ? (
                <p className="steps__free" id={`steps-empty-${h.id}`} tabIndex={-1}>
                  {emptyReason ? PLAN_COPY.empty[emptyReason] : C.roomFree}
                </p>
              ) : null}
            </div>
          </section>
        );
      })}

      <div className="steps__hold">
        <Switch
          checked={state.holdWorkload}
          onChange={(on) => setState((s) => keepWorkload(s, on))}
          aria-labelledby="steps-hold-label"
          aria-describedby="steps-hold-hint"
        />
        <div>
          <p className="steps__hold-label" id="steps-hold-label">
            {C.keepWorkload}
          </p>
          <p className="steps__hold-hint" id="steps-hold-hint">
            {C.keepWorkloadHint}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ActionSteps;
