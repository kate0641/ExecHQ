"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Input } from "@/components/form/Input";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { addDays, type LoopDate } from "@/lib/loop";
import {
  CHANNELS,
  DECLINE_REASONS,
  KIND_LABELS,
  SCOPE_OPTIONS,
  STEP_COPY as C,
  TIMING_OPTIONS,
  type ActionStep,
  type DeclineReason,
} from "@/mock/plan";
import { signalById } from "@/mock/plan-stub";

export type StepPanel = "decline" | "defer" | "edit";

export interface StepEdit {
  timing?: string;
  scope?: "lighter" | "as-is";
}

export interface ActionStepCardProps {
  step: ActionStep;
  /** She has accepted it. Until then it is offered, and Accept comes first. */
  accepted: boolean;
  /** Her edits to its timing or scope, shown as a line she can see she made. */
  edit?: StepEdit;
  /** Says her last answer was heard: "A lighter one this time." */
  heard?: string;
  /** She said it was already done: offer to add it to her record. */
  offerRecord?: boolean;
  /** Where Start leads: the Toolbox flow, stubbed until Sprint 4. */
  startHref: string;
  /** Today, so a deferral cannot be set in the past. */
  today: LoopDate;
  onAccept: () => void;
  /** She declined, with a reason if she gave one. Never asks to confirm. */
  onDecline: (reason?: DeclineReason) => void;
  onDefer: (returnsOn: LoopDate) => void;
  onEdit: (change: StepEdit) => void;
  /** She says she has done it. Only for a step with no draft. */
  onComplete: () => void;
  onRecord?: () => void;
  /** Heading level, so the card sits right in the page outline. */
  headingLevel?: 3 | 4;
  /** Catalogue only: opens with this panel showing. */
  demoPanel?: StepPanel;
  /** Catalogue only: shows the primary button in a state props cannot reach. */
  demoState?: "hover" | "focus" | "active";
  id?: string;
  className?: string;
}

/**
 * One action step: what it is, why this and why now and why you, what it
 * asks of her and what counts as done, then what she can do about it.
 *
 * Accept (or Start, once accepted) is the one primary move. Doing it later,
 * not wanting it and changing it are one step further, behind "Change this
 * step", so the card stays calm on a phone. Declining takes one tap and asks
 * nothing: the reason picker is optional and there is no "Are you sure?".
 *
 * It does not borrow the Briefing card: no image, no byline, no pull quote.
 * It is rows of fact about work she can do.
 */
export function ActionStepCard({
  step,
  accepted,
  edit,
  heard,
  offerRecord,
  startHref,
  today,
  onAccept,
  onDecline,
  onDefer,
  onEdit,
  onComplete,
  onRecord,
  headingLevel = 3,
  demoPanel,
  demoState,
  id,
  className,
}: ActionStepCardProps) {
  const uid = useId();
  const [more, setMore] = useState(Boolean(demoPanel));
  const [panel, setPanel] = useState<StepPanel | null>(demoPanel ?? null);
  const panelRef = useRef<HTMLFieldSetElement>(null);
  const Heading = `h${headingLevel}` as "h3" | "h4";
  const titleId = `${uid}-title`;
  const area = signalById(step.area)?.name;
  // Done by the Loop when it has a draft; on her word when it has none.
  const hasDraft = step.kind === "artifact" || Boolean(step.artifactId);
  const stateClass = demoState ? `is-${demoState}` : undefined;

  // Opening a panel puts the keyboard inside it.
  useEffect(() => {
    if (panel && !demoPanel) panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
  }, [panel, demoPanel]);

  const [timing, setTiming] = useState<string[]>(edit?.timing ? [edit.timing] : []);
  const [scope, setScope] = useState<string[]>(edit?.scope === "lighter" ? [SCOPE_OPTIONS.lighter] : []);
  const [date, setDate] = useState(addDays(today, 7));

  const edited = C.edited(edit?.timing, edit?.scope === "lighter");

  return (
    <article
      id={id}
      className={["step-card", `step-card--${step.horizon}`, className].filter(Boolean).join(" ")}
      aria-labelledby={titleId}
    >
      {heard ? (
        <p className="step-card__heard">
          <Icon name="check" size={14} />
          <span>{heard}</span>
        </p>
      ) : null}

      <div className="step-card__tags">
        <Badge tone="neutral">{KIND_LABELS[step.kind]}</Badge>
        {step.channel ? <Badge tone="neutral">{CHANNELS[step.channel].label}</Badge> : null}
        {step.stubbed ? <Badge tone="sprint">{C.stubbedNote}</Badge> : null}
        <span className="step-card__state">{accepted ? C.accepted : C.offered}</span>
      </div>

      <Heading className="step-card__title" id={titleId} tabIndex={-1}>
        {step.title}
      </Heading>
      {area ? (
        <p className="step-card__moves">
          <span>{C.moves}</span> {area}
        </p>
      ) : null}
      {edited ? <p className="step-card__edited">{edited}</p> : null}

      <dl className="step-card__why">
        {(
          [
            ["Why this", step.whyThis],
            ["Why now", step.whyNow],
            ["Why you", step.whyYou],
          ] as const
        ).map(([term, text]) => (
          <div className="step-card__row" key={term}>
            <dt>{term}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>

      <dl className="step-card__facts">
        <div>
          <dt>{C.effort}</dt>
          <dd>{step.effortText}</dd>
        </div>
        <div>
          <dt>{C.doneWhen}</dt>
          <dd>{step.done}</dd>
        </div>
      </dl>

      {offerRecord && onRecord ? (
        <Button variant="secondary" size="sm" onClick={onRecord}>
          {C.recordIt}
        </Button>
      ) : null}

      <div className="step-card__actions">
        {accepted ? (
          step.stubbed ? (
            <Button variant="primary" disabled className={stateClass}>
              {C.stubbedStart}
            </Button>
          ) : hasDraft || step.toolboxTool ? (
            <Link href={startHref} className={["btn btn--primary btn--md", stateClass].filter(Boolean).join(" ")}>
              {step.startLabel ?? C.start(step.toolboxTool)}
              <Icon name="chevron" size={16} />
            </Link>
          ) : null
        ) : (
          <Button variant="primary" onClick={onAccept} className={stateClass}>
            {C.accept}
          </Button>
        )}
        {accepted && !hasDraft ? (
          <Button variant="secondary" onClick={onComplete}>
            {C.markDone}
          </Button>
        ) : null}
        <Button
          variant="ghost"
          aria-expanded={more}
          aria-controls={`${uid}-more`}
          onClick={() => {
            setMore((open) => !open);
            if (more) setPanel(null);
          }}
        >
          {C.change}
          <Icon name={more ? "chevron-up" : "chevron-down"} size={16} />
        </Button>
      </div>

      <div className="step-card__more" id={`${uid}-more`} hidden={!more}>
        {panel === null ? (
          <div className="step-card__menu">
            <Button variant="secondary" size="sm" onClick={() => setPanel("defer")}>
              {C.later}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setPanel("edit")}>
              {C.edit}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setPanel("decline")}>
              {C.decline}
            </Button>
          </div>
        ) : null}

        {panel === "decline" ? (
          <fieldset className="step-card__panel" ref={panelRef}>
            <legend className="u-visually-hidden">{C.decline}</legend>
            <p className="step-card__prompt">{C.declinePrompt}</p>
            <div className="step-card__reasons">
              {DECLINE_REASONS.map((reason) => (
                <Button key={reason.id} variant="secondary" size="sm" onClick={() => onDecline(reason.id)}>
                  {reason.label}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => onDecline(undefined)}>
              {C.declineNoReason}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPanel(null)}>
              {C.cancel}
            </Button>
          </fieldset>
        ) : null}

        {panel === "defer" ? (
          <fieldset className="step-card__panel" ref={panelRef}>
            <legend className="u-visually-hidden">{C.later}</legend>
            <Input
              label={C.deferPrompt}
              type="date"
              min={addDays(today, 1)}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <div className="step-card__panel-actions">
              <Button variant="primary" size="sm" disabled={date <= today} onClick={() => onDefer(date)}>
                {C.deferConfirm}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPanel(null)}>
                {C.cancel}
              </Button>
            </div>
          </fieldset>
        ) : null}

        {panel === "edit" ? (
          <fieldset className="step-card__panel" ref={panelRef}>
            <legend className="u-visually-hidden">{C.edit}</legend>
            <ChipGroup label={C.timing} options={TIMING_OPTIONS} value={timing} onChange={setTiming} />
            <ChipGroup
              label={C.scope}
              options={Object.values(SCOPE_OPTIONS)}
              value={scope}
              onChange={setScope}
            />
            <div className="step-card__panel-actions">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onEdit({
                    timing: timing[0],
                    scope: scope[0] === SCOPE_OPTIONS.lighter ? "lighter" : "as-is",
                  });
                  setPanel(null);
                  setMore(false);
                }}
              >
                {C.save}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setPanel(null)}>
                {C.cancel}
              </Button>
            </div>
          </fieldset>
        ) : null}
      </div>
    </article>
  );
}

export default ActionStepCard;
