import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { keepAfterComma } from "@/components/primitives/keep-after-comma";

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
 * later reads as a real choice and not an escape. They sit in one card, a
 * hairline between them, each a row with a line saying what it does and a
 * chevron to say it can be pressed.
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
                <span className="next-steps__title">{keepAfterComma(step.label)}</span>
                <span className="next-steps__detail">{keepAfterComma(step.detail)}</span>
              </span>
              <Icon name="chevron" size={20} className="next-steps__go" />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default NextSteps;
