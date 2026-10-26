import { READINESS_HOME_COPY as C } from "@/mock/homepage";

export interface ReadinessCheckInProps {
  /** Her direction after "How ready do you feel to": "lead a broader
   *  marketing organization". Without it the question asks about her next
   *  move. */
  toward?: string;
  /** Her answers before this week's, 1 to 5, oldest first. The first is her
   *  starting point. */
  history: readonly number[];
  /** This week's answer, 1 to 5, once given. */
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

/** An answer, 1 to 5, as she chose it: in words. */
const word = (value: number) => C.answers[value - 1];

/**
 * The weekly check-in in Stay on track (Homepage Concept 4b, Kate,
 * 2026-10-23, simplified 2026-10-26): one question with her direction in it,
 * "How ready do you feel to lead a broader marketing organization?", five
 * answers in words, from Not yet to Ready, and Not now, which costs nothing.
 * The words need no scale or explanation; behind them they are 1 to 5, for
 * her trend and the dashboard's totals. Once answered it reads back this
 * week against where she started, in the same words, with her answers week
 * by week. Drawn as the other Stay on track cards are.
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
            <span className="check-in__readback-lead">{C.thisWeek(word(answer))}</span>
            {history.length ? C.versus(answer, start, word(start)) : null}
          </p>
          <p className="u-visually-hidden">{C.trendLabel(answers.map(word))}</p>
          <div className="readiness-check__trend" aria-hidden="true">
            {answers.map((value, i) => (
              <span key={i} className={i === answers.length - 1 ? "is-now" : undefined}>
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
      <h3 className="check-in__question" id={headingId} tabIndex={-1}>
        {C.question(toward)}
      </h3>
      <fieldset className="readiness-check__scale">
        <legend className="u-visually-hidden">{C.question(toward)}</legend>
        {C.answers.map((label, i) => (
          <button
            key={label}
            type="button"
            className={["readiness-check__answer", demo && i === 2 ? `is-${demo}` : null].filter(Boolean).join(" ")}
            onClick={() => onAnswer?.(i + 1)}
          >
            {label}
          </button>
        ))}
      </fieldset>
      <div className="check-in__quiet">
        <button type="button" className="link link--standalone" onClick={onNotNow}>
          {C.notNow}
        </button>
      </div>
    </section>
  );
}

export default ReadinessCheckIn;
