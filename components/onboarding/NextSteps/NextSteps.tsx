import { Button } from "@/components/primitives/Button";

export interface NextStep {
  label: string;
  /** One line on what it does. */
  detail: string;
  onChoose: () => void;
}

export interface NextStepsProps {
  /** A heading for the set, e.g. "What next?". */
  label: string;
  steps: readonly NextStep[];
  className?: string;
}

/**
 * The ways on from a finished piece of work, as peers: refine it now, take it
 * further, or save it and come back. None is the default, so leaving it for
 * later reads as a real choice and not an escape. Each is a full-width button
 * with a line saying what it does, the same width as the options elsewhere in
 * the flow.
 */
export function NextSteps({ label, steps, className }: NextStepsProps) {
  return (
    <section className={["next-steps", className].filter(Boolean).join(" ")} aria-label={label}>
      <p className="next-steps__label">{label}</p>
      <ul className="next-steps__list">
        {steps.map((step) => (
          <li key={step.label}>
            <Button variant="secondary" fullWidth onClick={step.onChoose}>
              <span className="next-steps__text">
                <span className="next-steps__title">{step.label}</span>
                <span className="next-steps__detail">{step.detail}</span>
              </span>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NextSteps;
