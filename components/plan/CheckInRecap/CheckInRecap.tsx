"use client";

import { Button } from "@/components/primitives/Button";
import type { MilestoneAnswer, StageFeeling } from "@/lib/stage-checkins";
import { STAGE_CHECKIN_COPY as C } from "@/mock/plan";

export interface CheckInRecapProps {
  /** She checked in on the stage, or put it off. */
  status: "done" | "later";
  milestone?: MilestoneAnswer;
  feeling?: StageFeeling;
  /** Anything she said ExecHQ should know, in her words. */
  words?: string;
  /** Opens the check-in: on its read-back when she has done it, at the start when she put it off. */
  onOpen: () => void;
  className?: string;
}

/**
 * Her check-in, on the finished stage in the roadmap. Done, it reads back where she landed and how she
 * felt, in her words, with the way into the whole read-back, where she can change an answer. Put off, it
 * says what checking in is for and opens the check-in. Nothing here nags: it sits on the stage it is about.
 */
export function CheckInRecap({ status, milestone, feeling, words, onOpen, className }: CheckInRecapProps) {
  const classes = ["checkin-recap", `checkin-recap--${status}`, className].filter(Boolean).join(" ");
  if (status === "later") {
    return (
      <div className={classes}>
        <p className="checkin-recap__text">{C.recapLater}</p>
        <Button variant="secondary" size="sm" onClick={onOpen}>
          {C.recapStart}
        </Button>
      </div>
    );
  }
  const landed = C.milestones.find((m) => m.id === milestone)?.label;
  const felt = C.feelings.find((f) => f.id === feeling)?.label;
  return (
    <div className={classes}>
      <p className="checkin-recap__label">{C.recapLabel}</p>
      <dl className="checkin-recap__answers">
        <div>
          <dt>{C.recapLanded}</dt>
          <dd>{landed ?? C.notAnswered}</dd>
        </div>
        <div>
          <dt>{C.feelingLabel}</dt>
          <dd>{felt ?? C.notAnswered}</dd>
        </div>
      </dl>
      {words ? (
        <p className="checkin-recap__words">
          <q>{words}</q>
        </p>
      ) : null}
      <button type="button" className="checkin-recap__open" onClick={onOpen}>
        {C.recapOpen}
      </button>
    </div>
  );
}

export default CheckInRecap;
