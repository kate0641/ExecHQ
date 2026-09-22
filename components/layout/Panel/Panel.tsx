import type { ReactNode } from "react";

export type PanelTone = "default" | "sunken" | "inverse";
export type HeadingLevel = 2 | 3 | 4;

export interface PanelProps {
  title?: string;
  /** Keeps heading order correct on whatever page the panel lands on. */
  headingLevel?: HeadingLevel;
  eyebrow?: string;
  description?: string;
  /** Controls, badges or links shown alongside the title. */
  actions?: ReactNode;
  tone?: PanelTone;
  /** Removes the inner padding, for panels whose child manages its own. */
  flush?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * A titled surface. The generic container the rest of the prototype composes
 * with: cards, hub sections, catalogue panes and placeholder states.
 */
export function Panel({
  title,
  headingLevel = 2,
  eyebrow,
  description,
  actions,
  tone = "default",
  flush = false,
  className,
  children,
}: PanelProps) {
  const Heading = `h${headingLevel}` as const;
  const classes = [
    "panel",
    `panel--${tone}`,
    flush ? "panel--flush" : null,
    tone === "inverse" ? "u-on-inverse" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hasHeader = Boolean(title || eyebrow || description || actions);

  return (
    <section className={classes}>
      {hasHeader ? (
        <header className="panel__header">
          <div className="panel__heading">
            {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
            {title ? <Heading className="panel__title">{title}</Heading> : null}
            {description ? <p className="panel__description">{description}</p> : null}
          </div>
          {actions ? <div className="panel__actions">{actions}</div> : null}
        </header>
      ) : null}
      {children ? <div className="panel__body">{children}</div> : null}
    </section>
  );
}

export default Panel;
