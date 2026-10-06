"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { StepChangePanel } from "@/components/plan/StepChangePanel";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { bucketOf, timeChoices, whenWords } from "@/lib/time-words";
import { addDays, type LoopDate } from "@/lib/loop";
import {
  CHANNELS,
  DECLINE_REASONS,
  KIND_LABELS,
  SCOPE_OPTIONS,
  CHANGE_COPY as CH,
  STEP_COPY as C,
  timingWords,
  type ActionStep,
  type DeclineReason,
} from "@/mock/plan";
import { signalById } from "@/mock/plan-stub";

export type StepPanel = "decline" | "defer" | "edit";

export interface StepEdit {
  scope?: "lighter" | "as-is";
  /** What she wrote, in her own words. */
  note?: string;
  /** How long she says it will take her. */
  effort?: string;
  /** What done means to her. */
  done?: string;
  /** The day she moved it to. */
  date?: LoopDate;
}

export interface ActionStepCardProps {
  step: ActionStep;
  /** She has accepted it. Until then it is offered, and Accept comes first. */
  accepted: boolean;
  /** Her edit to its scope, shown as a line she can see she made. */
  edit?: Pick<StepEdit, "scope" | "effort" | "done">;
  /** The day it sits on her calendar, which the date field in "Change timing or scope" starts from. */
  date?: LoopDate;
  /** The day she chose for it. Only then does the card say a day; until then it says when in words. */
  chosenDay?: LoopDate;
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
  onDecline: (reason?: DeclineReason, note?: string) => void;
  onDefer: (returnsOn: LoopDate, note?: string) => void;
  onEdit: (change: StepEdit) => void;
  /** She says she has done it. Only for a step with no draft. */
  onComplete: () => void;
  onRecord?: () => void;
  /** The compact card, for the swiping row. Everything is on the card, nothing behind a button: the
   *  outcome, the area, when and how much effort, why this, why now, why you, what counts as done, and the
   *  link into the product as its main button. */
  compact?: boolean;
  /** Heading level, so the card sits right in the page outline. */
  headingLevel?: 3 | 4;
  /** Catalogue only: opens with this panel showing. */
  demoPanel?: StepPanel;
  /** Catalogue only: the compact card opens already taken over by the change questions. */
  demoChanging?: boolean;
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
  date: onDate,
  chosenDay,
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
  compact = false,
  headingLevel = 3,
  demoPanel,
  demoChanging,
  demoState,
  id,
  className,
}: ActionStepCardProps) {
  const uid = useId();
  const [more, setMore] = useState(Boolean(demoPanel));
  const [changing, setChanging] = useState(Boolean(demoChanging));
  const linkRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const [panel, setPanel] = useState<StepPanel | null>(demoPanel ?? null);
  const panelRef = useRef<HTMLFieldSetElement>(null);
  const Heading = `h${headingLevel}` as "h3" | "h4";
  const titleId = `${uid}-title`;
  const area = signalById(step.area)?.name;
  // Her own estimate and her own definition of done replace ours on the card once she has set them.
  const effortText = edit?.effort ?? step.effortText;
  const doneText = edit?.done ?? step.done;
  // Done by the Loop when it has a draft; on her word when it has none.
  const hasDraft = step.kind === "artifact" || Boolean(step.artifactId);
  const stateClass = demoState ? `is-${demoState}` : undefined;

  // Closing the change questions puts the keyboard back on the link that opened them.
  useEffect(() => {
    if (!changing && restoreFocus.current) {
      restoreFocus.current = false;
      linkRef.current?.focus();
    }
  });

  // Opening a panel puts the keyboard inside it.
  useEffect(() => {
    if (panel && !demoPanel) panelRef.current?.querySelector<HTMLElement>("button, input")?.focus();
  }, [panel, demoPanel]);

  const [moveTo, setMoveTo] = useState<string>(onDate ?? "");
  const [scope, setScope] = useState<string[]>(edit?.scope === "lighter" ? [SCOPE_OPTIONS.lighter] : []);
  // When she asks for it back, or moves it: a stretch of time in words, which stands for a day underneath.
  const [date, setDate] = useState("");
  const laterChoices = timeChoices(today, addDays(today, 1));
  const moveChoices = timeChoices(today);

  const edited = edit?.effort || edit?.done || chosenDay || edit?.scope === "lighter" ? C.editedByYou : undefined;

  const moreBlock = (
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
            <ChipGroup
              label={C.deferPrompt}
              options={laterChoices.map((c) => c.label)}
              value={laterChoices.filter((c) => c.date === date).map((c) => c.label)}
              onChange={(next) => setDate(laterChoices.find((c) => c.label === next[0])?.date ?? "")}
            />
            <div className="step-card__panel-actions">
              <Button variant="primary" size="sm" disabled={!date} onClick={() => onDefer(date)}>
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
            <ChipGroup
              label={C.timing}
              options={moveChoices.map((c) => c.label)}
              value={moveChoices.filter((c) => moveTo && c.bucket === bucketOf(moveTo, today)).map((c) => c.label)}
              onChange={(next) => {
                const picked = moveChoices.find((c) => c.label === next[0]);
                if (picked && !(moveTo && picked.bucket === bucketOf(moveTo, today))) setMoveTo(picked.date);
              }}
            />
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
                    date: moveTo && moveTo >= today ? moveTo : undefined,
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
  );

  const startButton = accepted ? (
    step.stubbed ? (
      <Button variant="primary" size="sm" disabled className={stateClass}>
        {C.stubbedStart}
      </Button>
    ) : hasDraft || step.toolboxTool ? (
      <Link href={startHref} className={["btn btn--primary btn--sm", stateClass].filter(Boolean).join(" ")}>
        {step.startLabel ?? C.start(step.toolboxTool)}
        <Icon name="chevron" size={16} />
      </Link>
    ) : (
      <Button variant="primary" size="sm" onClick={onComplete} className={stateClass}>
        {C.markDone}
      </Button>
    )
  ) : (
    <Button variant="primary" size="sm" onClick={onAccept} className={stateClass}>
      {C.accept}
    </Button>
  );

  if (compact && changing) {
    // It takes over the whole card, in place, so the row does not shift.
    const closePanel = () => setChanging(false);
    return (
      <article
        id={id}
        className={["step-card", "step-card--compact", "step-card--changing", `step-card--${step.horizon}`, className].filter(Boolean).join(" ")}
        aria-label={step.title}
      >
        <StepChangePanel
          title={step.title}
          today={today}
          date={onDate}
          effortText={effortText}
          done={doneText}
          onReplace={(reason, note) => onDecline(reason, note)}
          onEdit={(change) => {
            onEdit(change);
            closePanel();
          }}
          onClose={() => {
            closePanel();
            // Put the keyboard back where she was, once the card is back.
            restoreFocus.current = true;
          }}
        />
      </article>
    );
  }

  if (compact) {
    // Two tiers. Above: what it is and when and for how long, on a tinted zone. Below: why, and where it ends.
    return (
      <article
        id={id}
        className={["step-card", "step-card--compact", "step-card--tiered", `step-card--${step.horizon}`, className].filter(Boolean).join(" ")}
        aria-labelledby={titleId}
      >
        <div className="step-card__glance">
          {heard ? (
            <p className="step-card__heard">
              <Icon name="check" size={14} />
              <span>{heard}</span>
            </p>
          ) : null}
          <p className="step-card__eyebrow">
            {C.horizonLabels[step.horizon]}
            {/* Whether she has taken it on is said by the main button; a screen reader gets it here too. */}
            <span className="u-visually-hidden"> · {accepted ? C.accepted : C.offered}</span>
            {step.stubbed ? <Badge tone="sprint">{C.stubbedNote}</Badge> : null}
          </p>
          <Heading className="step-card__title" id={titleId} tabIndex={-1}>
            {step.title}
          </Heading>
          <p className="step-card__outcome">{step.outcome}</p>
        </div>
        <div className="step-card__facts-zone">
          <dl className="step-card__facts-panel">
            <div>
              <dt>{C.whenLabel}</dt>
              <dd>{chosenDay ? whenWords(chosenDay, today) : timingWords(step)}</dd>
            </div>
            <div>
              <dt>{C.howLongLabel}</dt>
              <dd>{effortText}</dd>
            </div>
            {area ? (
              <div>
                <dt>{C.moves}</dt>
                <dd>{area}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        <div className="step-card__body">
          <ul className="step-card__whys">
            <li>
              <span>
                <b>{C.whyThis}</b> {step.whyThis}
              </span>
            </li>
            <li>
              <span>
                <b>{C.whyNowLabel}</b> {step.whyNow}
              </span>
            </li>
            <li>
              <span>
                <b>{C.whyYouLabel}</b> {step.whyYou}
              </span>
            </li>
          </ul>
          <p className="step-card__finish">
            <Icon name="check" size={16} />
            <span>
              <b>{C.doneWhen}</b> {doneText}
            </span>
          </p>
          {edited ? <p className="step-card__edited">{edited}</p> : null}
          {offerRecord && onRecord ? (
            <Button variant="secondary" size="sm" onClick={onRecord}>
              {C.recordIt}
            </Button>
          ) : null}
          <div className="step-card__actions">
            {startButton}
            <button type="button" className="step-card__textlink" onClick={() => setChanging(true)} ref={linkRef}>
              {CH.link}
            </button>
          </div>
        </div>
      </article>
    );
  }

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
      <p className="step-card__when">{chosenDay ? whenWords(chosenDay, today) : timingWords(step)}</p>
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
          <dd>{effortText}</dd>
        </div>
        <div>
          <dt>{C.doneWhen}</dt>
          <dd>{doneText}</dd>
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

      {moreBlock}
    </article>
  );
}

export default ActionStepCard;
