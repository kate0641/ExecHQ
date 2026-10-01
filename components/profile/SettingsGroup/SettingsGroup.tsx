import { useId, type ReactNode } from "react";

export interface SettingsGroupProps {
  /** The group's name, set as a small label above its card. */
  label: string;
  /** SettingsRow elements. */
  children: ReactNode;
  headingLevel?: 2 | 3;
  /** Keeps the label for assistive technology but not on screen, where the
   *  section already has a heading of its own. */
  hideLabel?: boolean;
  className?: string;
}

/**
 * A labelled set of settings rows on one white card: You, Connections,
 * Email, Briefing, Your data. The label is a real heading, so the page's
 * outline reads as its groups.
 */
export function SettingsGroup({ label, children, headingLevel = 2, hideLabel = false, className }: SettingsGroupProps) {
  const id = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <section className={["settings-group", className].filter(Boolean).join(" ")} aria-labelledby={id}>
      <Heading className={["settings-group__label", hideLabel ? "u-visually-hidden" : null].filter(Boolean).join(" ")} id={id}>
        {label}
      </Heading>
      <div className="settings-group__rows">{children}</div>
    </section>
  );
}

export default SettingsGroup;
