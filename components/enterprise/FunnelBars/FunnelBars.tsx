import { Icon } from "@/components/primitives/Icon";

export interface FunnelStep {
  label: string;
  /** Absent while the step is hidden below the minimum cohort size. */
  value?: number;
  /** The first step a funnel is measured against, drawn as an outline: the
   *  size expected, not people who did anything. */
  outline?: boolean;
}

export interface FunnelBarsProps {
  /** In order, each no more than the one before. The first sets the scale. */
  steps: FunnelStep[];
  /** Names the list for screen readers. */
  label: string;
  /** Said in place of a hidden step's number. */
  hiddenLabel: string;
  className?: string;
}

const count = new Intl.NumberFormat("en-GB");

/**
 * How many made it through each step, as bars on one baseline that get
 * shorter (2026-10-20): where people drop off, at a glance and on paper.
 * Every step says its number in words beside its bar, so the bars are
 * decoration for a screen reader, which hears a list. A hidden step keeps
 * its place and names the rule, never an empty bar that reads as nought.
 */
export function FunnelBars({ steps, label, hiddenLabel, className }: FunnelBarsProps) {
  const scale = steps[0]?.value ?? 1;
  return (
    <ul className={["funnel-bars", className].filter(Boolean).join(" ")} aria-label={label}>
      {steps.map((step) => (
        <li className="funnel-bars__step" key={step.label}>
          <span className="funnel-bars__label">{step.label}</span>
          <span className="funnel-bars__track" aria-hidden="true">
            {step.value !== undefined ? (
              <span
                className={["funnel-bars__fill", step.outline ? "funnel-bars__fill--outline" : null].filter(Boolean).join(" ")}
                style={{ inlineSize: `${Math.min(100, (step.value / scale) * 100)}%` }}
              />
            ) : null}
          </span>
          <span className="funnel-bars__value">
            {step.value !== undefined ? (
              count.format(step.value)
            ) : (
              <>
                <Icon name="lock" size={14} />
                {hiddenLabel}
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default FunnelBars;
