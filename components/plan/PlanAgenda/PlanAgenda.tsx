"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { AddToPlanSheet } from "@/components/plan/AddToPlanSheet";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import type { LoopDate } from "@/lib/loop";
import { whenWords } from "@/lib/time-words";
import { PLAN_AGENDA_COPY as A, STEP_ANSWERS, STEP_QUESTIONS, type ActionStep, type StepQuestion } from "@/mock/plan";

export interface AgendaStage {
  index: number;
  title: string;
  /** Where its suggested end falls, in words. */
  when: string;
  /** What finishing it looks like. */
  finishing: string;
  status: "done" | "current" | "recommended" | "later";
}

export interface AgendaItem {
  id: string;
  stage: number;
  title: string;
  date: LoopDate;
  /** A step from her plan, or something she added herself. */
  kind: "step" | "yours";
  step?: ActionStep;
  accepted?: boolean;
}

export interface PlanAgendaProps {
  stages: AgendaStage[];
  items: AgendaItem[];
  today: LoopDate;
  /** Where Get started goes for a step with a draft or a tool. */
  startHref: string;
  /** She asked about a step: the page opens the chat on it. */
  onAsk: (step: ActionStep, question: StepQuestion) => void;
  /** She took a step on. */
  onAccept: (step: ActionStep) => void;
  /** She said a step with no tool is done. */
  onComplete: (step: ActionStep) => void;
  /** She added something of her own, to a day the words stand for. Says which stage it fell in. */
  onAdd: (item: { title: string; date: LoopDate }) => number | void;
  /** Whether the open stage opens on its first step. Off where the step is already said elsewhere on the page. */
  openFirstStep?: boolean;
  /** Something beside the heading, such as the way into her whole plan. */
  action?: ReactNode;
  /** Catalogue only. */
  demoStage?: number | null;
  demoStep?: string | null;
  demoAdding?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * The roadmap as an agenda: a drawer for each stage, and only the stage she is on open. In it,
 * each step shows as its title; the one she is on opens to the questions she can ask about it
 * (each opens the chat) and the way to start. Times are words, never days. What she adds herself
 * sits in the stage it falls in, marked as hers.
 *
 * Only one stage is open at a time, and one step in it: opening another closes the last.
 */
export function PlanAgenda({
  stages,
  items,
  today,
  startHref,
  onAsk,
  onAccept,
  onComplete,
  onAdd,
  openFirstStep = true,
  action,
  demoStage,
  demoStep,
  demoAdding,
  headingId = "plan-agenda",
  className,
}: PlanAgendaProps) {
  const uid = useId();
  const here = stages.find((s) => s.status === "current") ?? stages.find((s) => s.status === "recommended") ?? stages[0];
  const firstStep = (stage: number) => items.find((i) => i.stage === stage && i.kind === "step")?.id ?? null;
  const [open, setOpen] = useState<number | null>(demoStage !== undefined ? demoStage : here?.index ?? 0);
  const [step, setStep] = useState<string | null>(demoStep !== undefined ? demoStep : openFirstStep ? firstStep(open ?? 0) : null);
  const [adding, setAdding] = useState(Boolean(demoAdding));
  // The add button floats over the phone's screen, above the Ask or go pill, so it is drawn there.
  const anchor = useRef<HTMLSpanElement>(null);
  const [screen, setScreen] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setScreen(anchor.current?.closest<HTMLElement>(".device__screen") ?? null);
  }, []);
  const [note, setNote] = useState("");

  function toggleStage(index: number) {
    if (open === index) {
      setOpen(null);
      setStep(null);
    } else {
      setOpen(index);
      setStep(firstStep(index));
    }
    setAdding(false);
    setNote("");
  }

  const inStage = (index: number) =>
    items
      .filter((i) => i.stage === index)
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  return (
    <section className={["agenda", "agenda--stack", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="agenda__head">
        <h2 className="agenda__heading" id={headingId}>
          {A.heading}
        </h2>
        {action}
      </div>
      <output className="agenda__note" aria-live="polite">
        {note}
      </output>
      <div className="agenda__stages">
        {stages.map((stage) => {
          const isOpen = open === stage.index;
          const list = inStage(stage.index);
          return (
            <section
              key={`${uid}-${stage.index}`}
              className={["agenda__stage", `agenda__stage--${stage.index % 4}`, isOpen ? "is-open" : null, `is-${stage.status}`].filter(Boolean).join(" ")}
              aria-label={stage.title}
            >
              <h3 className="agenda__stage-head">
                <button type="button" className="agenda__stage-button" aria-expanded={isOpen} onClick={() => toggleStage(stage.index)}>
                  <span className="agenda__stage-name">
                    <span className="agenda__eyebrow">{A.stageOf(stage.index + 1, stages.length)}</span>
                    {stage.title}
                  </span>
                  <span className="agenda__when">{stage.status === "done" ? A.done : stage.when}</span>
                </button>
              </h3>
              {isOpen ? (
                <div className="agenda__body">
                  <p className="agenda__small">
                    <b>{A.finishing}</b> {stage.finishing}
                  </p>
                  {list.length ? (
                    <ul className="agenda__list">
                      {list.map((item) =>
                        item.kind === "yours" || !item.step ? (
                          <li className="agenda__item" key={item.id}>
                            <div className="agenda__line is-static">
                              <span className="agenda__pill">{whenWords(item.date, today)}</span>
                              <span className="agenda__title">
                                {item.title} <span className="agenda__yours">· {A.yours}</span>
                              </span>
                            </div>
                          </li>
                        ) : (
                          <StepItem
                            key={item.id}
                            item={item}
                            step={item.step}
                            open={step === item.id}
                            today={today}
                            startHref={startHref}
                            onToggle={() => setStep(step === item.id ? null : item.id)}
                            onAsk={onAsk}
                            onAccept={onAccept}
                            onComplete={onComplete}
                          />
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="agenda__small">{A.nothing}</p>
                  )}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
      <span ref={anchor} hidden />
      {(() => {
        const button = (
          <button
            type="button"
            className={["agenda__fab", screen ? null : "agenda__fab--inline"].filter(Boolean).join(" ")}
            aria-label={A.addLabel}
            aria-haspopup="dialog"
            onClick={() => setAdding(true)}
          >
            <Icon name="plus" size={24} />
          </button>
        );
        return screen ? createPortal(button, screen) : button;
      })()}
      <AddToPlanSheet
        open={adding}
        onClose={() => setAdding(false)}
        today={today}
        inline={demoAdding}
        onAdd={({ title, date, label }) => {
          const at = onAdd({ title, date });
          setAdding(false);
          // Show her where it went: that stage opens, and the page says so.
          if (typeof at === "number") {
            setOpen(at);
            setStep(null);
            setNote(A.added(stages[at]?.title ?? "", label));
          }
        }}
      />
    </section>
  );
}

/** A step: its title, and when it is the open one, the questions she can ask and the way to start. */
function StepItem({
  item,
  step,
  open,
  today,
  startHref,
  onToggle,
  onAsk,
  onAccept,
  onComplete,
}: {
  item: AgendaItem;
  step: ActionStep;
  open: boolean;
  today: LoopDate;
  startHref: string;
  onToggle: () => void;
  onAsk: (step: ActionStep, question: StepQuestion) => void;
  onAccept: (step: ActionStep) => void;
  onComplete: (step: ActionStep) => void;
}) {
  const hasDraft = step.kind === "artifact" || Boolean(step.artifactId);
  const tool = hasDraft || Boolean(step.toolboxTool);
  const label = step.startLabel ?? (step.toolboxTool ? `Start in ${step.toolboxTool}` : A.getStarted);
  return (
    <li className="agenda__item" id={`step-${step.id}`}>
      <button type="button" className="agenda__line" aria-expanded={open} onClick={onToggle}>
        <span className="agenda__pill">{whenWords(item.date, today)}</span>
        <span className="agenda__title">{item.title}</span>
      </button>
      {open ? (
        <div className="agenda__reveal">
          {step.stubbed ? (
            <Button variant="primary" fullWidth disabled>
              {label}
            </Button>
          ) : tool ? (
            <Link href={startHref} className="btn btn--primary btn--md btn--full agenda__cta" onClick={() => !item.accepted && onAccept(step)}>
              {label}
            </Link>
          ) : item.accepted ? (
            <Button variant="primary" fullWidth className="agenda__cta" onClick={() => onComplete(step)}>
              {A.doneIt}
            </Button>
          ) : (
            <Button variant="primary" fullWidth className="agenda__cta" onClick={() => onAccept(step)}>
              {A.getStarted}
            </Button>
          )}
          <div className="agenda__ask">
            <p className="agenda__ask-label">
              <AdvisorMark size={14} />
              {A.askLabel}
            </p>
            <ul className="agenda__ask-list">
              {STEP_QUESTIONS.map((q) => (
                <li key={q.id}>
                  <button type="button" className="agenda__ask-row" onClick={() => onAsk(step, q.id)}>
                    <span className="agenda__ask-q">{q.label}</span>
                    {q.id === "why" ? <span className="agenda__ask-t">{STEP_ANSWERS.teaseWhy(step)}</span> : null}
                    {q.id === "take" ? <span className="agenda__ask-t">{STEP_ANSWERS.teaseTake(step)}</span> : null}
                    <Icon name="chevron" size={16} className="agenda__ask-go" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </li>
  );
}

export default PlanAgenda;
