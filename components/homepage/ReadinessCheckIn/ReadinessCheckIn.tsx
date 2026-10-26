import { READINESS_HOME_COPY as C } from "@/mock/homepage";

export interface ReadinessCheckInProps {
  /** Her direction, short: "leading a broader marketing organization". It
   *  says what "your next move" is. */
  toward?: string;
  /** Her answers before this week's, oldest first. The first is her
   *  starting point. */
  history: readonly number[];
  /** This week's answer, once given. */
  answer?: number;
  /** She chose Not now this week. */
  later?: boolean;
  onAnswer?: (value: number) => void;
  onNotNow?: () => void;
  headingId?: string;
  /** Catalogue only: shows the middle answer in a state a static page can't
   *  reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The weekly check-in in Stay on track (Homepage Concept 4b, Kate,
 * 2026-10-23): "How ready do you feel for your next move?", five answers in
 * one tap, and Not now, which costs nothing. Above the question, what her
 * next move is (her direction); under it, what "ready" means (Kate,
 * 2026-10-26). Once answered it reads back this week against
 * where she started, with her answers week by week, so the one tap gives her
 * something back. Drawn as the other Stay on track cards are.
 */
export function ReadinessCheckIn({ toward, history, answer, later, onAnswer, onNotNow, headingId = "readiness-check-in", demo, className }: ReadinessCheckInProps) {
  const classes = ["check-in", "check-in--question", "readiness-check", className].filter(Boolean).join(" ");
  const start = history[0] ?? answer ?? 0;

  if (answer !== undefined) {
    const answers = [...history, answer];
    return (
      <section className={classes} aria-labelledby={headingId}>
        <p className="check-in__about">{C.about}</p>
        <div className="check-in__logged-body">
          <p className="check-in__logged">{C.counted}</p>
          <p className="check-in__readback" id={headingId} tabIndex={-1}>
            <span className="check-in__readback-lead">{C.thisWeek(answer)}</span>
            {history.length ? C.versus(answer, start) : null}
          </p>
          <p className="u-visually-hidden">{C.trendLabel(answers)}</p>
          <div className="readiness-check__trend" aria-hidden="true">
            {answers.map((value, i) => (
              <span key={i} className={i === answers.length - 1 ? "is-now" : undefined}>
                <b>{value}</b>
                <i style={{ height: `${value * 0.6}rem` }} />
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
      {toward ? <p className="readiness-check__toward">{C.toward(toward)}</p> : null}
      <h3 className="check-in__question" id={headingId} tabIndex={-1}>
        {C.question}
      </h3>
      <p className="check-in__sub readiness-check__meaning">{C.meaning}</p>
      <fieldset className="readiness-check__scale">
        <legend className="u-visually-hidden">{C.question}</legend>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={["readiness-check__answer", demo && n === 3 ? `is-${demo}` : null].filter(Boolean).join(" ")}
            aria-label={C.answerName(n)}
            onClick={() => onAnswer?.(n)}
          >
            {n}
          </button>
        ))}
      </fieldset>
      <p className="readiness-check__ends" aria-hidden="true">
        <span>{C.low}</span>
        <span>{C.high}</span>
      </p>
      <div className="check-in__quiet">
        <button type="button" className="link link--standalone" onClick={onNotNow}>
          {C.notNow}
        </button>
      </div>
    </section>
  );
}

export default ReadinessCheckIn;
