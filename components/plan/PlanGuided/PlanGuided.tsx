"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChipGroup } from "@/components/form/ChipGroup";
import { Sheet } from "@/components/layout/Sheet";
import { AddToPlanSheet } from "@/components/plan/AddToPlanSheet";
import { AnswerDrawer } from "@/components/onboarding/AnswerDrawer";
import { GuidePage } from "@/components/onboarding/GuidePage";
import { ReflectionReply } from "@/components/onboarding/ReflectionReply";
import { Button } from "@/components/primitives/Button";
import type { LoopDate } from "@/lib/loop";
import type { PlanSpark } from "@/lib/plan-sparks";
import { PLAN_AGENDA_COPY as AG, GUIDED_COPY as G, stepById, type ActionStep, type GuidedAnswer } from "@/mock/plan";

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
  /** She answered a move: the page changes her plan to match. */
  onAnswer: (step: ActionStep, answer: GuidedAnswer) => void;
  /** She took a move on, to start it. */
  onStart: (step: ActionStep) => void;
  /** She added something of her own. Says which stage it fell in. */
  onAdd: (item: { title: string; date: LoopDate }) => number | void;
  /** Catalogue only. */
  demoPage?: number;
  demoAnswered?: Record<string, GuidedAnswer>;
  demoRoad?: boolean;
  demoFolded?: boolean;
  className?: string;
}

/**
 * The Plan as a guided check-in, built from onboarding's own parts: a page that says one move and why
 * it matters, and a drawer that holds where she is with it. Answering changes her plan for real
 * (done, put in her week, made smaller, or passed on) and comes back as a short reply in the serif
 * voice, then the next move. The last page says where the plan stands. The road, and adding something
 * of her own, slide up as sheets from the strip at the top.
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
  onStart,
  onAdd,
  demoPage,
  demoAnswered,
  demoRoad,
  demoFolded,
  className,
}: PlanGuidedProps) {
  const headingId = useId();
  const [page, setPage] = useState(demoPage ?? 0);
  const [answered, setAnswered] = useState<Record<string, GuidedAnswer>>(demoAnswered ?? {});
  const [open, setOpen] = useState(!demoFolded);
  const [road, setRoad] = useState(Boolean(demoRoad));
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
    file: (
      <button type="button" className="link plan-guided__road" onClick={() => setRoad(true)}>
        {G.road}
      </button>
    ),
  };
  const sheets = (
    <>
      <Sheet open={road} onClose={() => setRoad(false)} label={G.road} inline={demoRoad}>
        <div className="plan-guided__sheet">
          <h2 className="plan-guided__sheet-title">{G.road}</h2>
          <p className="plan-guided__small">{G.roadIntro}</p>
          <ol className="plan-guided__stages">
            {stages.map((s, i) => (
              <li key={s.title} className={i === stageIndex ? "is-current" : undefined} aria-current={i === stageIndex ? "step" : undefined}>
                <span>{s.title}</span>
                {i === stageIndex ? <b>{G.here}</b> : null}
              </li>
            ))}
          </ol>
          <div>
            <h3 className="plan-guided__label">{G.changed}</h3>
            {sparks.length ? (
              <ul className="plan-guided__sparks">
                {sparks.map((s) => (
                  <li key={s.id}>{s.text}</li>
                ))}
              </ul>
            ) : (
              <p className="plan-guided__small">{G.noChanges}</p>
            )}
          </div>
          <p className="plan-guided__small">{G.after}</p>
          <div className="plan-guided__actions">
            <Button
              variant="secondary"
              onClick={() => {
                setRoad(false);
                setAdding(true);
              }}
            >
              {G.add}
            </Button>
            <Button variant="ghost" onClick={() => setRoad(false)}>
              {G.close}
            </Button>
          </div>
        </div>
      </Sheet>
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
  const hasDraft = step.kind === "artifact" || Boolean(step.artifactId);
  const tool = hasDraft || Boolean(step.toolboxTool);
  const label = step.startLabel ?? (step.toolboxTool ? `Start in ${step.toolboxTool}` : "Get started");
  const options = G.answers.map((a) => a.label);
  const details = Object.fromEntries(G.answers.map((a) => [a.label, a.hint]));
  const choose = (id: GuidedAnswer) => {
    if (!frozen) setFrozen(live.map((s) => s.id));
    onAnswer(step, id);
    setAnswered((all) => ({ ...all, [step.id]: id }));
    setOpen(true);
  };

  return (
    <>
      <GuidePage
        {...top}
        key={step.id}
        kicker={G.kicker(page + 1, moves.length, whenOf(step))}
        headingId={headingId}
        title={step.title}
        lede={step.whyLine}
        why={step.whyThis}
        className={["plan-guided", className].filter(Boolean).join(" ")}
        primaryLabel={answer ? (page + 1 < moves.length ? G.next : G.seeRoad) : undefined}
        onPrimary={answer ? () => (setPage(page + 1), setOpen(true)) : undefined}
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
              <ChipGroup
                label={G.question}
                labelHidden
                options={options}
                value={[]}
                equalWidth
                details={details}
                onChange={(next) => {
                  const picked = G.answers.find((a) => a.label === next[0]);
                  if (picked) choose(picked.id);
                }}
              />
              {tool ? (
                <Link href={startHref} className="btn btn--primary btn--md btn--full" onClick={() => onStart(step)}>
                  {label}
                </Link>
              ) : (
                // A step with no tool is started by putting it in her week.
                <Button variant="primary" fullWidth onClick={() => choose("plan")}>
                  {label}
                </Button>
              )}
            </AnswerDrawer>
          )
        }
      >
        {answer ? <ReflectionReply from="ExecHQ" text={G.reply(step, answer, { stage: stage?.title ?? "", hasDraft })} /> : null}
        {note ? <output className="plan-guided__note">{note}</output> : null}
      </GuidePage>
      {sheets}
    </>
  );
}

export default PlanGuided;
