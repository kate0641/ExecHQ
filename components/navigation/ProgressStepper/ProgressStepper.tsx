import { Icon } from "@/components/primitives/Icon";

export interface ProgressStep {
  id: string;
  /** A short name: one or two words. */
  label: string;
  /** Something on this step needs her attention. */
  error?: boolean;
}

export interface ProgressStepperProps {
  steps: readonly ProgressStep[];
  /** The step she is on. */
  current: string;
  /** Names the stepper for assistive technology: "Your progress". */
  label: string;
  /** Pressing a step that can be opened. Left out, no step can be. */
  onSelect?: (id: string) => void;
  /** Which steps can be opened. Defaults to the ones she has done; the
   *  current one and the ones ahead are locked. */
  canOpen?: (id: string, state: "done" | "upcoming") => boolean;
  orientation?: "horizontal" | "vertical";
  /**
   * - `all`: every step's name under (or beside) its number.
   * - `current`: only the current step's name, under the row, with where it
   *   sits ("Step 2 of 5"). For a phone, where five names don't fit.
   */
  labels?: "all" | "current";
  /** Catalogue only: shows the first done step in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

const STATE_WORDS = { done: "done", current: "current step", upcoming: "not started", error: "needs attention" } as const;

/**
 * Where she is in something with steps: numbered discs joined by lines. Done
 * is filled with a check, the current step a ring, steps ahead muted, joined
 * by a dashed line, and a step with a problem carries a warning mark. Each
 * state has a shape as well as a colour, so it reads in greyscale.
 *
 * Steps she has done can be opened to go back; the current one and those
 * ahead are locked, unless `canOpen` says otherwise. An ordered list, with
 * `aria-current="step"` on hers and each step's state said in words.
 *
 * Horizontal by default; vertical for a side column.
 */
export function ProgressStepper({
  steps,
  current,
  label,
  onSelect,
  canOpen,
  orientation = "horizontal",
  labels = "all",
  demo,
  className,
}: ProgressStepperProps) {
  const at = Math.max(0, steps.findIndex((step) => step.id === current));
  const currentStep = steps[at];
  const firstDone = steps.findIndex((_, i) => i < at);
  return (
    <nav
      className={["progress-stepper", `progress-stepper--${orientation}`, `progress-stepper--labels-${labels}`, className].filter(Boolean).join(" ")}
      aria-label={label}
    >
      <ol className="progress-stepper__list">
        {steps.map((step, i) => {
          const base = i < at ? "done" : i === at ? "current" : "upcoming";
          const state = step.error ? "error" : base;
          const open =
            Boolean(onSelect) && base !== "current" && (canOpen ? canOpen(step.id, base) : base === "done");
          const marker = (
            <>
              <span className="progress-stepper__disc" aria-hidden="true">
                {state === "error" ? (
                  <Icon name="warning" size={14} />
                ) : state === "done" ? (
                  <Icon name="check" size={14} />
                ) : (
                  i + 1
                )}
              </span>
              <span className="progress-stepper__label">
                {step.label}
                <span className="u-visually-hidden">
                  {`, step ${i + 1} of ${steps.length}, ${STATE_WORDS[state]}`}
                </span>
              </span>
            </>
          );
          return (
            <li
              key={step.id}
              className={["progress-stepper__step", `is-${state}`, base === "done" ? "is-past" : null].filter(Boolean).join(" ")}
              aria-current={base === "current" ? "step" : undefined}
            >
              {open ? (
                <button
                  type="button"
                  className={["progress-stepper__target", i === firstDone && demo ? `is-${demo}` : null].filter(Boolean).join(" ")}
                  onClick={() => onSelect?.(step.id)}
                >
                  {marker}
                </button>
              ) : (
                <span className="progress-stepper__target">{marker}</span>
              )}
            </li>
          );
        })}
      </ol>
      {labels === "current" && currentStep ? (
        <p className="progress-stepper__caption" aria-hidden="true">
          <span className="progress-stepper__caption-count">{`Step ${at + 1} of ${steps.length}`}</span>
          {currentStep.label}
        </p>
      ) : null}
    </nav>
  );
}

export default ProgressStepper;
