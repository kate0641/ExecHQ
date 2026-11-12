import type { CSSProperties } from "react";

export interface PlanPathStage {
  title: string;
  /** Its finish line, as a sign it's working: "Someone repeats your one-line
   *  story back to you." Shown after "Done when", first letter lowered. */
  done?: string;
}

export interface PlanPathProps {
  /** Where she is, as the Plan page says it: "Step Up · Stage 1 of 3 · Say
   *  what you lead". */
  where: string;
  /** This week's step, drawn as the Plan page's move card. */
  thisWeek: { label: string; title: string; line: string };
  stages: readonly PlanPathStage[];
  /** What it all leads to: "The C-suite within three years". */
  goal: string;
  doneLabel: string;
  /** Draws itself once, when the page arrives (Kate, 2026-11-12). Off: at rest,
   *  as it is whenever reduced motion is asked for. */
  animate?: boolean;
  className?: string;
}

const at = (seconds: number) => ({ "--path-delay": `${seconds}s` }) as CSSProperties;

/** "Someone repeats…" reads on from "Done when" as "someone repeats…". */
function onFrom(sentence: string): string {
  return sentence.charAt(0).toLowerCase() + sentence.slice(1);
}

/**
 * The plan as a path (Kate, 2026-11-12): where she is, this week's step as
 * the Plan page's move card, each stage with its finish line, and her goal at
 * the end. The stage bar and card are the Plan page's, so the page she opens
 * tomorrow looks like the one she just made. Everything is in the page from
 * the start; only its showing waits on the motion.
 */
export function PlanPath({ where, thisWeek, stages, goal, doneLabel, animate = true, className }: PlanPathProps) {
  return (
    <div className={["plan-path", animate ? "plan-path--animate" : null, className].filter(Boolean).join(" ")}>
      <div className="plan-path__where">
        <p className="plan-path__where-text">{where}</p>
        <ol className="plan-path__bar" aria-hidden="true">
          {stages.map((stage, index) => (
            <li key={stage.title} className={index === 0 ? "is-now" : undefined} />
          ))}
        </ol>
      </div>

      <ol className="plan-path__steps">
        <li className="plan-path__step plan-path__step--now plan-path__in" style={at(0.2)}>
          <span className="plan-path__marker" aria-hidden="true" />
          <div className="plan-path__move">
            <p className="plan-path__move-label">{thisWeek.label}</p>
            <p className="plan-path__move-title">{thisWeek.title}</p>
            <p className="plan-path__move-line">{thisWeek.line}</p>
          </div>
        </li>
        {stages.map((stage, index) => (
          <li key={stage.title} className="plan-path__step plan-path__in" style={at(0.7 + index * 0.4)}>
            <span className="plan-path__marker" aria-hidden="true">
              {index + 1}
            </span>
            <p className="plan-path__stage">{stage.title}</p>
            {stage.done ? (
              <p className="plan-path__done">
                <span className="plan-path__done-label">{doneLabel}</span> {onFrom(stage.done)}
              </p>
            ) : null}
          </li>
        ))}
        <li className="plan-path__step plan-path__step--goal plan-path__in" style={at(0.7 + stages.length * 0.4)}>
          <span className="plan-path__marker" aria-hidden="true">
            ★
          </span>
          <p className="plan-path__stage">{goal}</p>
        </li>
      </ol>
    </div>
  );
}

export default PlanPath;
