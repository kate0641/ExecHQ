"use client";

import { useEffect, useRef, useState } from "react";
import { CardCarousel, type CarouselItem } from "@/components/layout/CardCarousel";
import { ActionStepCard } from "@/components/plan/ActionStepCard";
import { Switch } from "@/components/form/Switch";
import {
  accept,
  decline,
  defer,
  complete,
  edit as editStep,
  stepDay,
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
import { LIVE_LIMITS, MAX_LIVE, PLAN_COPY, STEP_COPY as C, stepById, type ActionStep } from "@/mock/plan";
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
  /** Told whenever the steps on her Plan change, so the Calendar shows the same ones. */
  onState?: (state: PlanState) => void;
  /** `list` is a column of cards by horizon (Concepts 2 and 3). `carousel` is one swiping row of compact
   *  cards in order, short-term to long-term, with chips that jump to a horizon (Concept 1). */
  layout?: "list" | "carousel";
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
  onState,
  layout = "list",
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

  // Whoever shows these steps elsewhere hears of every change, hand-offs included.
  useEffect(() => {
    onState?.(state);
  });

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
  // The swiping row: where something asked it to go, and which horizon it has settled on.
  const [goTo, setGoTo] = useState<{ id: string; n: number } | undefined>();
  const [here, setHere] = useState<Horizon>("short");

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
      setGoTo((g) => ({ id: r.step.id, n: (g?.n ?? 0) + 1 }));
    } else if (r) {
      setEmpties((e) => ({ ...e, [from.horizon]: r.empty }));
      setMessage(`${said} ${C.announce.nothingNew}`);
      focus.current = `steps-empty-${from.horizon}`;
      setGoTo((g) => ({ id: `free-${from.horizon}`, n: (g?.n ?? 0) + 1 }));
    } else {
      setMessage(said);
    }
  }

  const live = liveSteps(state);

  function renderCard(step: ActionStep, opts: { compact?: boolean; headingLevel: 3 | 4; first?: boolean }) {
    return (
      <ActionStepCard
        key={step.id}
        id={`step-${step.id}`}
        step={step}
        compact={opts.compact}
        accepted={state.decisions[step.id]?.decision === "accepted"}
        edit={state.edits[step.id]}
        date={stepDay(state, step).date}
        suggested={stepDay(state, step).suggested}
        heard={notes[step.id]?.heard}
        offerRecord={notes[step.id]?.offerRecord}
        startHref={startHref}
        today={state.today}
        headingLevel={opts.headingLevel}
        demoPanel={demoPanel && opts.first ? demoPanel : undefined}
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
    );
  }

  if (layout === "carousel") {
    // One row, in order: short-term, then medium, then the long-term milestone. A free place ends it.
    const cards: CarouselItem[] = HORIZONS.flatMap((h) =>
      liveIn(state, h.id).map((step, i) => ({
        id: step.id,
        group: h.id,
        node: renderCard(step, { compact: true, headingLevel: 3, first: h.id === "short" && i === 0 }),
      }))
    );
    const withRoom = HORIZONS.filter((h) => liveIn(state, h.id).length < LIVE_LIMITS[h.id]);
    const freeHorizon = withRoom.find((h) => empties[h.id]) ?? withRoom[0];
    if (freeHorizon) {
      cards.push({
        id: `free-${freeHorizon.id}`,
        group: freeHorizon.id,
        node: (
          <div className="steps-free" id={`steps-empty-${freeHorizon.id}`} tabIndex={-1}>
            <b>{C.freePlace}</b>
            <span>{empties[freeHorizon.id] ? PLAN_COPY.empty[empties[freeHorizon.id]!] : C.roomFree}</span>
          </div>
        ),
      });
    }
    const horizonOf = (id: string): Horizon =>
      (id.startsWith("free-") ? (id.slice(5) as Horizon) : stepById(id)?.horizon) ?? "short";
    return (
      <section className={["steps", "steps--carousel", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
        <div className="steps__head">
          <h2 className="steps__heading" id={headingId}>
            {C.heading}
          </h2>
          <p className="steps__count">{C.inUse(live.length, MAX_LIVE)}</p>
        </div>
        <output className="u-visually-hidden">{message}</output>
        <ul className="steps__jump" aria-label={C.jumpLabel}>
          {HORIZONS.map((h) => {
            const here0 = liveIn(state, h.id)[0];
            return here0 ? (
              <li key={h.id}>
                <button
                  type="button"
                  aria-current={here === h.id}
                  onClick={() => setGoTo((g) => ({ id: here0.id, n: (g?.n ?? 0) + 1 }))}
                >
                  {C.horizonShort[h.id]}
                  <small>{liveIn(state, h.id).length}</small>
                </button>
              </li>
            ) : null;
          })}
        </ul>
        <CardCarousel
          fixed
          label={C.heading}
          items={cards}
          previousLabel={C.previousStep}
          nextLabel={C.nextStep}
          goTo={goTo}
          onCurrent={(id) => setHere(horizonOf(id))}
        />
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
              {steps.map((step, i) => renderCard(step, { headingLevel: 4, first: i === 0 }))}
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
