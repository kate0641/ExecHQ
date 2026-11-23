"use client";

import Link from "next/link";
import { AdvisorMark } from "@/components/chat/AdvisorMark";
import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import type { LoopDate } from "@/lib/loop";
import { whenWords } from "@/lib/time-words";
import { PLAN_AGENDA_COPY as A, STEP_QUESTIONS, type ActionStep, type StepQuestion } from "@/mock/plan";

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
  step: ActionStep;
  accepted?: boolean;
}

export interface PlanAgendaProps {
  stages: AgendaStage[];
  items: AgendaItem[];
  today: LoopDate;
  /** Where Get started goes for a step with a draft or a tool. */
  /** Where a step starts: one address, or one per step (its tool, its
   *  artifact, or the Briefing for the reading step). */
  startHref: string | ((step: ActionStep) => string);
  /** True when the step already has a draft: its button opens it. */
  hasDraftFor?: (step: ActionStep) => boolean;
  /** She asked about a step: the page opens the chat on it. */
  onAsk: (step: ActionStep, question: StepQuestion) => void;
  /** She took a step on. */
  onAccept: (step: ActionStep) => void;
  /** She said a step with no tool is done. */
  onComplete: (step: ActionStep) => void;
  /** Whether the open stage opens on its first step. Off where the step is already said elsewhere on the page. */
  openFirstStep?: boolean;
  /** Something on a stage under its name, shown whether the stage is open or not: her check-in on a finished one, say. */
  stageNote?: (index: number) => ReactNode;
  /** Catalogue only. */
  demoStage?: number | null;
  demoStep?: string | null;
  headingId?: string;
  className?: string;
}

/**
 * The roadmap as an agenda: a drawer for each stage, and only the stage she is on open. In it,
 * each step shows as its title; the one she is on opens to the questions she can ask about it
 * (each opens the chat) and the way to start. Times are words, never days. She adds nothing of her
 * own: Add to your plan was cut from V1 (UX review, 2026-11-18).
 *
 * Only one stage is open at a time, and one step in it: opening another closes the last.
 */
export function PlanAgenda({
  stages,
  items,
  today,
  startHref,
  hasDraftFor,
  onAsk,
  onAccept,
  onComplete,
  openFirstStep = true,
  stageNote,
  demoStage,
  demoStep,
  headingId = "plan-agenda",
  className,
}: PlanAgendaProps) {
  const uid = useId();
  const here = stages.find((s) => s.status === "current") ?? stages.find((s) => s.status === "recommended") ?? stages[0];
  const firstStep = (stage: number) => items.find((i) => i.stage === stage)?.id ?? null;
  const [open, setOpen] = useState<number | null>(demoStage !== undefined ? demoStage : here?.index ?? 0);
  const [step, setStep] = useState<string | null>(demoStep !== undefined ? demoStep : openFirstStep ? firstStep(open ?? 0) : null);
  // The first paint is the server's, which cannot see what she has saved, so where she is can change once her
  // plan loads (a stage she finished, say). Follow it there, as the page would have opened on it.
  const [hereSeen, setHereSeen] = useState(here?.index);
  if (demoStage === undefined && here && here.index !== hereSeen) {
    setHereSeen(here.index);
    setOpen(here.index);
    setStep(openFirstStep ? firstStep(here.index) : null);
  }

  function toggleStage(index: number) {
    if (open === index) {
      setOpen(null);
      setStep(null);
    } else {
      setOpen(index);
      setStep(firstStep(index));
    }
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
      </div>
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
                  <span className="agenda__stage-top">
                    <span className="agenda__eyebrow">{A.stageOf(stage.index + 1, stages.length)}</span>
                    <span className="agenda__when">{stage.status === "done" ? A.done : stage.when}</span>
                  </span>
                  <span className="agenda__stage-name">{stage.title}</span>
                </button>
              </h3>
              {stageNote?.(stage.index) ? <div className="agenda__stage-note">{stageNote(stage.index)}</div> : null}
              {isOpen ? (
                <div className="agenda__body">
                  <p className="agenda__small">
                    <b>{A.finishing}</b> {stage.finishing}
                  </p>
                  {list.length ? (
                    <ul className="agenda__list">
                      {list.map((item) => (
                          <StepItem
                            key={item.id}
                            item={item}
                            step={item.step}
                            open={step === item.id}
                            today={today}
                            startHref={startHref}
                            hasDraftFor={hasDraftFor}
                            onToggle={() => setStep(step === item.id ? null : item.id)}
                            onAsk={onAsk}
                            onAccept={onAccept}
                            onComplete={onComplete}
                          />
                      ))}
                    </ul>
                  ) : (
                    <p className="agenda__small">{stage.status === "done" ? A.nothingDone : A.nothing}</p>
                  )}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
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
  hasDraftFor,
  onToggle,
  onAsk,
  onAccept,
  onComplete,
}: {
  item: AgendaItem;
  step: ActionStep;
  open: boolean;
  today: LoopDate;
  startHref: string | ((step: ActionStep) => string);
  hasDraftFor?: (step: ActionStep) => boolean;
  onToggle: () => void;
  onAsk: (step: ActionStep, question: StepQuestion) => void;
  onAccept: (step: ActionStep) => void;
  onComplete: (step: ActionStep) => void;
}) {
  const hasDraft = step.kind === "artifact" || Boolean(step.artifactId);
  // The reading step opens the Briefing, so it starts with a link too.
  const tool = hasDraft || Boolean(step.playbookTool) || step.kind === "reading";
  const href = typeof startHref === "function" ? startHref(step) : startHref;
  const label = hasDraftFor?.(step) ? A.openDraft : (step.startLabel ?? (step.playbookTool ? `Start in ${step.playbookTool}` : A.getStarted));
  return (
    <li className="agenda__item" id={`step-${step.id}`}>
      <button type="button" className="agenda__line" aria-expanded={open} onClick={onToggle}>
        <span className="agenda__pill">{whenWords(item.date, today)}</span>
        <span className="agenda__title">{item.title}</span>
        <Icon name="chevron" size={20} className="agenda__open" />
      </button>
      {open ? (
        <div className="agenda__reveal">
          {step.stubbed ? (
            <Button variant="secondary" fullWidth className="agenda__cta" disabled>
              {label}
            </Button>
          ) : tool ? (
            <Link href={href} className="btn btn--secondary btn--md btn--full agenda__cta" onClick={() => !item.accepted && onAccept(step)}>
              {label}
            </Link>
          ) : item.accepted ? (
            <Button variant="secondary" fullWidth className="agenda__cta" onClick={() => onComplete(step)}>
              {A.doneIt}
            </Button>
          ) : (
            <Button variant="secondary" fullWidth className="agenda__cta" onClick={() => onAccept(step)}>
              {A.getStarted}
            </Button>
          )}
          <div className="agenda__ask">
            {/* Each question opens the chat on it, so it looks like the chat's own prompts: a navy pill with the
                advisor's mark. Their short answers are left for the chat to give. */}
            <ul className="agenda__ask-list" aria-label={A.askLabel}>
              {STEP_QUESTIONS.map((q) => (
                <li key={q.id}>
                  <button type="button" className="agenda__ask-pill" onClick={() => onAsk(step, q.id)}>
                    <AdvisorMark size={16} />
                    {q.label}
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
