"use client";

import { useState } from "react";
import { Slider } from "@/components/form/Slider";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { READINESS_HOME_COPY as C } from "@/mock/homepage";

export interface ReadinessCheckInProps {
  /** Her direction after "How ready do you feel to": "lead a broader
   *  marketing organization". Without it the question asks about her next
   *  move. */
  toward?: string;
  /** Her answers before this week's, 1 to 3, oldest first. The first is her
   *  starting point. */
  history: readonly number[];
  /** This week's answer, 1 to 3, once given. */
  answer?: number;
  /** She chose Not now this week. */
  later?: boolean;
  onAnswer?: (value: number) => void;
  onNotNow?: () => void;
  headingId?: string;
  /** Catalogue only: shows the slider in a state a static page can't
   *  reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/** An answer, 1 to 3, as she chose it: in words. */
const word = (value: number) => C.answers[value - 1];

/**
 * The weekly check-in in Stay on track (Homepage Concept 4b, Kate,
 * 2026-10-23, simplified 2026-10-26): one question with her direction in it,
 * "How ready do you feel to lead a broader marketing organization?", a
 * slider with three answers, Not yet, Getting there and Ready, and Save at
 * the right edge, with what it will record on its left.
 * The slider starts on her last answer, so a week with no change is one
 * press. Not now, which costs nothing, is an x in the card's top corner.
 * Behind the words the answers are 1 to 3, for her trend and the
 * dashboard's totals. Once answered it reads back this
 * week against where she started, in the same words, with her answers week
 * by week. Drawn as the other Stay on track cards are.
 */
export function ReadinessCheckIn({ toward, history, answer, later, onAnswer, onNotNow, headingId = "readiness-check-in", demo, className }: ReadinessCheckInProps) {
  const classes = ["check-in", "check-in--question", "readiness-check", className].filter(Boolean).join(" ");
  const start = history[0] ?? answer ?? 0;
  const middle = Math.ceil(C.answers.length / 2);
  const [picked, setPicked] = useState(history[history.length - 1] ?? middle);

  if (answer !== undefined) {
    const answers = [...history, answer];
    return (
      <section className={classes} aria-labelledby={headingId}>
        <p className="check-in__about">{C.about}</p>
        <div className="check-in__logged-body">
          <p className="check-in__logged">{C.counted}</p>
          <p className="check-in__readback" id={headingId} tabIndex={-1}>
            <span className="check-in__readback-lead">{C.thisWeek(word(answer))}</span>
            {history.length ? C.versus(answer, start, word(start)) : null}
          </p>
          <p className="u-visually-hidden">{C.trendLabel(answers.map(word))}</p>
          <div className="readiness-check__trend" aria-hidden="true">
            {answers.map((value, i) => (
              <span key={i} className={i === answers.length - 1 ? "is-now" : undefined}>
                <i style={{ height: `${value}rem` }} />
                <small>{i === 0 ? C.start : i === answers.length - 1 ? C.now : C.week(i + 1)}</small>
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (later) {
    return (
      <section className={classes} aria-labelledby={headingId}>
        <p className="check-in__about">{C.about}</p>
        <p className="check-in__readback" id={headingId} tabIndex={-1}>
          {C.later}
        </p>
      </section>
    );
  }

  return (
    <section className={classes} aria-labelledby={headingId}>
      <p className="check-in__about">{C.about}</p>
      <button
        type="button"
        className="readiness-check__close"
        title={C.notNow}
        onClick={onNotNow}
      >
        <Icon name="close" size={18} />
        <span className="u-visually-hidden">{C.notNow}</span>
      </button>
      <h3 className="check-in__question" id={headingId} tabIndex={-1}>
        {C.question(toward)}
      </h3>
      <p className="check-in__sub readiness-check__why">{C.why}</p>
      <Slider label={C.question(toward)} steps={C.answers} value={picked} onChange={setPicked} demo={demo} />
      {/* Save at the card's right edge, under the right thumb, as every card
          button that isn't full width; on its left, what it will record
          (Kate, 2026-10-26). */}
      <div className="readiness-check__foot">
        {history.length ? (
          <p className="readiness-check__hint" aria-live="polite">
            {picked === history[history.length - 1] ? C.sameAsLast : C.changedTo(word(picked))}
          </p>
        ) : null}
        <Button className="readiness-check__save" onClick={() => onAnswer?.(picked)}>
          {C.save}
        </Button>
      </div>
    </section>
  );
}

export default ReadinessCheckIn;
