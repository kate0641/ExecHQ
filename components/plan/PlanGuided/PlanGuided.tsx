"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { AddToPlanSheet } from "@/components/plan/AddToPlanSheet";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { GuidePage } from "@/components/onboarding/GuidePage";
import { ReflectionReply } from "@/components/onboarding/ReflectionReply";
import { Button } from "@/components/primitives/Button";
import type { LoopDate } from "@/lib/loop";
import { timeChoices } from "@/lib/time-words";
import type { PlanSpark } from "@/lib/plan-sparks";
import { PLAN_AGENDA_COPY as AG, DECLINE_REASONS, GUIDED_COPY as G, stepById, type ActionStep, type DeclineReason, type GuidedAnswer } from "@/mock/plan";

export interface GuidedStage {
  title: string;
  status: "done" | "current" | "recommended" | "later";
}

export interface PlanGuidedProps {
  planName: string;
  stageIndex: number;
  stages: GuidedStage[];
  /** Her live steps now. The page keeps the order she met them in, so a step she answers stays where it was. */
  moves: ActionStep[];
  /** When a move is, in words. */
  whenOf: (step: ActionStep) => string;
  today: LoopDate;
  startHref: string;
  /** What changed on her plan, newest last. */
  sparks: PlanSpark[];
  /** She answered a move: the page changes her plan to match. For "not for me", the reason she gave, if any.
   *  Returns a line to add to the reply, such as what was offered in its place. */
  onAnswer: (step: ActionStep, answer: Exclude<GuidedAnswer, "talk">, o?: { reason?: DeclineReason; date?: LoopDate }) => string | void;
  /** She wants to talk it through: the page opens the chat on the move. Nothing about her plan changes. */
  onTalk: (step: ActionStep) => void;
  /** She has a draft under way for this move, so starting it is going on with it. */
  workingOn?: (step: ActionStep) => boolean;
  /** She took a move on, to start it. */
  onStart: (step: ActionStep) => void;
  /** She added something of her own. Says which stage it fell in. */
  onAdd: (item: { title: string; date: LoopDate }) => number | void;
  /** Why a move is on her plan, when something she said brought it there: "You passed on this before." */
  heardOf?: (step: ActionStep) => string | undefined;
  /** The roadmap, read under the move. Always on the page; the open drawer covers it until she folds it. */
  roadmap?: ReactNode;
  /** Catalogue only. */
  demoPage?: number;
  demoAnswered?: Record<string, GuidedAnswer>;
  demoPassed?: Record<string, string>;
  demoFolded?: boolean;
  className?: string;
}

/**
 * The Plan as a guided check-in, built from onboarding's own parts: a page that says one move and why
 * it matters, and a drawer that holds where she is with it. Answering changes her plan for real
 * (done, put in her week, made smaller, or passed on) and comes back as a short reply in the serif
 * voice, then the next move. The last page says where the plan stands. The roadmap sits on the page under
 * the move, so folding the drawer shows the whole road; adding something of her own slides up as a sheet.
 *
 * Nothing here is a list she scans: one move at a time, the way onboarding asks one question at a time.
 */
export function PlanGuided({
  planName,
  stageIndex,
  stages,
  moves: live,
  whenOf,
  today,
  startHref,
  sparks,
  onAnswer,
  onTalk,
  workingOn,
  onStart,
  onAdd,
  heardOf,
  demoPage,
  demoAnswered,
  roadmap,
  demoPassed,
  demoFolded,
  className,
}: PlanGuidedProps) {
  const headingId = useId();
  const [page, setPage] = useState(demoPage ?? 0);
  const [answered, setAnswered] = useState<Record<string, GuidedAnswer>>(demoAnswered ?? {});
  // "Not for me" asks why before it acts, one optional tap; the line says what was offered in its place.
  const [picking, setPicking] = useState(false);
  // The time she chose instead of the step's own, in words.
  const [chosenWhen, setChosenWhen] = useState<Record<string, string>>({});
  const [passedLine, setPassedLine] = useState<Record<string, string>>(demoPassed ?? {});
  const [open, setOpen] = useState(!demoFolded);
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState("");
  const first = useRef(true);
  // Once she answers, the order is frozen: a step that leaves her plan stays on its page, and any step offered
  // in its place comes after the rest.
  const [frozen, setFrozen] = useState<string[] | null>(null);
  const ids = frozen ? [...frozen, ...live.filter((s) => !frozen.includes(s.id)).map((s) => s.id)] : live.map((s) => s.id);
  const moves = ids.map((id) => live.find((s) => s.id === id) ?? stepById(id)).filter((s): s is ActionStep => Boolean(s));

  // Focus goes to the new page's heading, never on first paint.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById(headingId)?.focus();
  }, [page, headingId]);

  const stage = stages[stageIndex];
  const top = {
    part: planName,
    position: `${AG.stageOf(stageIndex + 1, stages.length)}${stage ? ` · ${stage.title}` : ""}`,
    partIndex: stageIndex,
    partCount: stages.length,
    after: roadmap,
  };
  const sheets = (
    <>
      <AddToPlanSheet
        open={adding}
        onClose={() => setAdding(false)}
        today={today}
        onAdd={({ title, date, label }) => {
          const at = onAdd({ title, date });
          setAdding(false);
          if (typeof at === "number") setNote(AG.added(stages[at]?.title ?? "", label));
        }}
      />
    </>
  );

  if (!moves.length || page >= moves.length) {
    const none = !moves.length;
    return (
      <>
        <GuidePage
          {...top}
          kicker={none ? undefined : G.lastKicker}
          headingId={headingId}
          title={none ? G.noneTitle : G.lastTitle}
          lede={none ? G.noneLede : G.lastLede}
          className={["plan-guided", className].filter(Boolean).join(" ")}
          primaryLabel={none ? G.add : G.again}
          onPrimary={() => (none ? setAdding(true) : (setPage(0), setAnswered({}), setOpen(true)))}
          secondaryLabel={none ? undefined : G.add}
          onSecondary={none ? undefined : () => setAdding(true)}
        >
          {note ? <output className="plan-guided__note">{note}</output> : null}
          {sparks.length ? (
            <ul className="plan-guided__sparks">
              {sparks.map((s) => (
                <li key={s.id}>{s.text}</li>
              ))}
            </ul>
          ) : null}
          <ReflectionReply from="ExecHQ" text={G.after} />
        </GuidePage>
        {sheets}
      </>
    );
  }

  const step = moves[page];
  const answer = answered[step.id];
  const reasoned = passedLine[step.id] !== undefined;
  const asking = answer === "pass" && !reasoned;
  const hasDraft = step.kind === "artifact" || Boolean(step.artifactId);
  const tool = hasDraft || Boolean(step.toolboxTool);
  const when = chosenWhen[step.id] ?? whenOf(step);
  const started = Boolean(workingOn?.(step));
  const label = started ? G.working : (step.startLabel ?? (step.toolboxTool ? `Start in ${step.toolboxTool}` : "Get started"));
  const answers = G.answers(whenOf(step));
  const details = Object.fromEntries(answers.map((a) => [a.label, a.hint]));
  const settle = (id: Exclude<GuidedAnswer, "talk">, o?: { date?: LoopDate; label?: string }) => {
    if (!frozen) setFrozen(live.map((s) => s.id));
    // Not for me waits for its reason; putting it on her plan acts now.
    const extra = id === "pass" ? undefined : onAnswer(step, id, { date: o?.date });
    if (o?.label) setChosenWhen((all) => ({ ...all, [step.id]: o.label as string }));
    setAnswered((all) => ({ ...all, [step.id]: id }));
    if (extra) setPassedLine((all) => ({ ...all, [step.id]: extra }));
    setPicking(false);
    setOpen(true);
  };
  const choose = (id: GuidedAnswer) => (id === "talk" ? onTalk(step) : settle(id));
  const pass = (reason?: DeclineReason) => {
    const extra = onAnswer(step, "pass", { reason });
    setPassedLine((all) => ({ ...all, [step.id]: extra ?? "" }));
  };
  const done = Boolean(answer) && !asking;
  const replyText = answer && answer !== "talk" ? G.reply(answer, { when }) : "";
  const choices = timeChoices(today);

  return (
    <>
      <GuidePage
        {...top}
        key={step.id}
        kicker={G.kicker(page + 1, moves.length, when)}
        headingId={headingId}
        title={step.title}
        lede={step.whyLine}
        why={step.whyThis}
        className={["plan-guided", className].filter(Boolean).join(" ")}
        primaryLabel={done ? (page + 1 < moves.length ? G.next : G.seeRoad) : undefined}
        onPrimary={done ? () => (setPage(page + 1), setOpen(true)) : undefined}
        drawer={
          answer ? undefined : (
            <AnswerDrawer
              question={G.question}
              questionId={headingId}
              open={open}
              onToggle={() => setOpen(!open)}
              peekStatus={G.peek}
              primaryLabel={label}
              onPrimary={() => undefined}
              hideActions
            >
              {tool ? (
                <Link href={startHref} className="btn btn--primary btn--md btn--full" onClick={() => onStart(step)}>
                  {label}
                </Link>
              ) : (
                // A step with no tool is started by putting it on her plan for its time.
                <Button variant="primary" fullWidth onClick={() => choose("plan")}>
                  {label}
                </Button>
              )}
              <ChipGroup
                label={G.question}
                labelHidden
                options={answers.map((a) => a.label)}
                value={[]}
                equalWidth
                details={details}
                onChange={(next) => {
                  const picked = answers.find((a) => a.label === next[0]);
                  if (picked) choose(picked.id);
                }}
              />
              {picking ? (
                <ChipGroup
                  label={G.changeWhen}
                  options={choices.map((c) => c.label)}
                  value={[]}
                  onChange={(next) => {
                    const picked = choices.find((c) => c.label === next[0]);
                    if (picked) settle("plan", { date: picked.date, label: picked.label });
                  }}
                />
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setPicking(true)}>
                  {G.changeWhen}
                </Button>
              )}
            </AnswerDrawer>
          )
        }
      >
        {!answer && heardOf?.(step) ? <p className="plan-guided__heard">{heardOf(step)}</p> : null}
        {answer ? <ReflectionReply from="ExecHQ" text={asking ? replyText : answer === "pass" ? [G.passed, passedLine[step.id]].filter(Boolean).join(" ") : replyText} /> : null}
        {asking ? (
          <div className="plan-guided__reasons">
            <ChipGroup
              label={G.reasonLabel}
              options={DECLINE_REASONS.map((r) => r.label)}
              value={[]}
              onChange={(next) => {
                const picked = DECLINE_REASONS.find((r) => r.label === next[0]);
                if (picked) pass(picked.id);
              }}
            />
            <Button variant="ghost" size="sm" onClick={() => pass(undefined)}>
              {G.noReason}
            </Button>
          </div>
        ) : null}
        {note ? <output className="plan-guided__note">{note}</output> : null}
      </GuidePage>
      {sheets}
    </>
  );
}

export default PlanGuided;
