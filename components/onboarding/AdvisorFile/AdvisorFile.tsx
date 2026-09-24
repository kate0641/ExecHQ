"use client";

import { useId } from "react";

export interface AdvisorFileItem {
  label: string;
  value: string;
}

export interface AdvisorFileProps {
  label: string;
  items: readonly AdvisorFileItem[];
  /** The item just added, named while the file is closed. */
  newest?: string;
  newestLabel?: string;
  emptyText?: string;
  open: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * What ExecHQ knows so far: a file that gains a line with every answer, by
 * decision on 2026-09-24. It shows "it remembers" rather than claiming it.
 * Closed, it is one line with a count and what was just added; open, the
 * whole list. The disclosure is a real button, and the list leaves the page
 * when closed.
 */
export function AdvisorFile({
  label,
  items,
  newest,
  newestLabel = "Added",
  emptyText = "Nothing yet. It builds as we go.",
  open,
  onToggle,
  className,
}: AdvisorFileProps) {
  const listId = useId();
  return (
    <section className={["advisor-file", open ? "is-open" : null, className].filter(Boolean).join(" ")} aria-label={label}>
      <button
        type="button"
        className="advisor-file__toggle"
        aria-expanded={open}
        aria-controls={listId}
        onClick={onToggle}
      >
        <span className="advisor-file__label">{label}</span>
        <span className="advisor-file__count">{items.length}</span>
        {newest && !open ? (
          <span className="advisor-file__new">
            {newestLabel}: {newest}
          </span>
        ) : null}
      </button>
      <div className="advisor-file__list" id={listId} hidden={!open}>
        {items.length ? (
          <dl>
            {items.map((item) => (
              <div key={item.label} className={item.label === newest ? "is-new" : undefined}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="advisor-file__empty">{emptyText}</p>
        )}
      </div>
    </section>
  );
}

export default AdvisorFile;
