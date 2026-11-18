import type { CSSProperties, ReactNode } from "react";

export interface PlanPathStage {
  title: string;
  /** Its finish line, as a sign it's working: "Someone repeats your one-line
   *  story back to you." Shown after "Done when", first letter lowered. */
  done?: string;
}

export interface PlanPathHorizon {
  /** Home's own name for it: "Short-term". */
  label: string;
  /** How far ahead it looks, in plain words: "Quick wins, this week". */
  span: string;
  /** What is in it, by name. The first horizon's list follows the first step's card. */
  items: readonly string[];
}

export interface PlanPathProps {
  /** "What you're working on now", over the three horizons. */
  nowLabel: string;
  /** Which stage that is, under the heading: "Stage 1 of 3 · Say what you lead". */
  stage: string;
  /** The first step, drawn as the Plan page's move card at the top of the first horizon. */
  first: { label: string; title: string; line: string };
  /** The first step's own button. Left out when the plan is being changed. */
  firstAction?: ReactNode;
  /** Short-term, medium-term and long-term, as Home names them. */
  horizons: readonly PlanPathHorizon[];
  /** That the horizons run side by side, not one after another. */
  together: string;
  /** Every stage; the first is the one she is in, the rest fold under "The stages ahead". */
  stages: readonly PlanPathStage[];
  /** What it all leads to: "The C-suite within three years". */
  goal: string;
  doneLabel: string;
  aheadLabel: string;
  /** "2 more", beside the fold's label. */
  aheadCount: string;
  /** What happens when this stage is done, at the foot of the fold. */
  next: string;
  /** The stages ahead start unfolded. For the catalogue; the page starts folded. */
  aheadOpen?: boolean;
  /** Builds in once, when the page arrives. Off: at rest, as it is whenever
   *  reduced motion is asked for. */
  animate?: boolean;
  className?: string;
}

const at = (seconds: number) => ({ "--path-delay": `${seconds}s` }) as CSSProperties;

/** "Someone repeats…" reads on from "Done when" as "someone repeats…". */
function onFrom(sentence: string): string {
  return sentence.charAt(0).toLowerCase() + sentence.slice(1);
}

/**
 * Her plan, on the page that ends onboarding: the stage she is in, as Home's
 * What you're working on now shows it (short-term, medium-term and
 * long-term, side by side), the first step leading the short-term as the Plan
 * page's move card with its own button. The later stages and her goal fold
 * away underneath, so the first screen is about now. Everything is in the
 * page from the start; only its showing waits on the motion.
 */
export function PlanPath({
  nowLabel,
  stage,
  first,
  firstAction,
  horizons,
  together,
  stages,
  goal,
  doneLabel,
  aheadLabel,
  aheadCount,
  next,
  aheadOpen = false,
  animate = true,
  className,
}: PlanPathProps) {
  const ahead = stages.slice(1);
  return (
    <div className={["plan-path", animate ? "plan-path--animate" : null, className].filter(Boolean).join(" ")}>
      <section className="plan-path__now" aria-label={nowLabel}>
        <div className="plan-path__now-head">
          <h2 className="plan-path__now-label">{nowLabel}</h2>
          <p className="plan-path__now-stage">{stage}</p>
        </div>
        {horizons.map((horizon, index) => (
          <div key={horizon.label} className="plan-path__horizon plan-path__in" style={at(0.2 + index * 0.3)}>
            <div className="plan-path__horizon-head">
              <h3 className="plan-path__horizon-label">{horizon.label}</h3>
              <p className="plan-path__horizon-span">{horizon.span}</p>
            </div>
            <ul className="plan-path__items">
              {index === 0 ? (
                <li className="plan-path__move">
                  <p className="plan-path__move-label">{first.label}</p>
                  <p className="plan-path__move-title">{first.title}</p>
                  <p className="plan-path__move-line">{first.line}</p>
                  {firstAction ? <div className="plan-path__move-action">{firstAction}</div> : null}
                </li>
              ) : null}
              {horizon.items.map((item) => (
                <li key={item} className="plan-path__item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="plan-path__together plan-path__in" style={at(0.2 + horizons.length * 0.3)}>
          {together}
        </p>
      </section>

      {ahead.length ? (
        <details className="plan-path__ahead" open={aheadOpen || undefined}>
          <summary className="plan-path__ahead-toggle">
            <span>{aheadLabel}</span>
            <span className="plan-path__ahead-count">{aheadCount}</span>
          </summary>
          <ol className="plan-path__steps">
            {ahead.map((stage, index) => (
              <li key={stage.title} className="plan-path__step">
                <span className="plan-path__marker" aria-hidden="true">
                  {index + 2}
                </span>
                <p className="plan-path__stage">{stage.title}</p>
                {stage.done ? (
                  <p className="plan-path__done">
                    <span className="plan-path__done-label">{doneLabel}</span> {onFrom(stage.done)}
                  </p>
                ) : null}
              </li>
            ))}
            <li className="plan-path__step plan-path__step--goal">
              <span className="plan-path__marker" aria-hidden="true">
                ★
              </span>
              <p className="plan-path__stage">{goal}</p>
            </li>
          </ol>
          <p className="plan-path__next">{next}</p>
        </details>
      ) : null}
    </div>
  );
}

export default PlanPath;
