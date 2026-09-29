"use client";

import { useId, useState } from "react";
import type { SignalActivityEntry } from "@/lib/signals";
import { SIGNAL_COPY } from "@/mock/plan-stub";

export interface SignalActivityProps {
  /** The signal, as the Plan names it. */
  name: string;
  /** Its facts from the window, newest first. */
  entries: SignalActivityEntry[];
  /** The one quiet line shown when there are none. Never a verdict. */
  quiet?: string;
  /** A line above the name, e.g. "Your next step adds to". */
  eyebrow?: string;
  /** The window, e.g. "Last 7 days · 13 Oct – 20 Oct". */
  window?: string;
  /** `focal` is the dark panel for the signal the next step touches. */
  tone?: "focal" | "plain";
  /** Today, so today's entries say "Today". */
  today?: string;
  /** The key to the labels, under the window: "Unmarked lines happened in
   *  ExecHQ." Given once per page, where the first list is. */
  keyLine?: string;
  headingLevel?: 2 | 3;
  headingId?: string;
  /** Catalogue only: opens one entry's "how ExecHQ knows", or shows the
   *  first label in a state a static page can't reach. */
  demo?: { open?: number; label?: "hover" | "focus" | "active" };
  className?: string;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Tue 13 Oct", or "Today". */
function dayLabel(date: string, today?: string): string {
  if (date === today) return "Today";
  const d = new Date(`${date}T00:00:00Z`);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

/**
 * One tracked signal and what happened on it recently, as a dated list of
 * facts. PROVISIONAL: a stand-in for the Signal Picture, designed in Sprint 3.
 *
 * Labelled by who can vouch for each fact. What ExecHQ saw happen carries no
 * label (a key line says so); what the user reported is marked "Your word",
 * and tapping that says how ExecHQ knows. The node beside each entry repeats
 * the difference by shape (filled or hollow) and is hidden from assistive
 * technology, so nothing rests on the mark alone. There are no counts, bars
 * or trends: facts only.
 */
export function SignalActivity({
  name,
  entries,
  quiet = SIGNAL_COPY.quiet,
  eyebrow,
  window,
  tone = "plain",
  today,
  keyLine,
  headingLevel = 3,
  headingId = "signal",
  demo,
  className,
}: SignalActivityProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const [open, setOpen] = useState<number | null>(demo?.open ?? null);
  const uid = useId();
  const firstReported = entries.findIndex((e) => e.source === "reported");
  return (
    <section className={["signal", `signal--${tone}`, className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {eyebrow ? <p className="signal__eyebrow">{eyebrow}</p> : null}
      <Heading className="signal__name" id={headingId} tabIndex={-1}>
        {name}
      </Heading>
      {window ? <p className="signal__window">{window}</p> : null}
      {keyLine && entries.length ? <p className="signal__key">{keyLine}</p> : null}
      {entries.length ? (
        <ol className="signal__list">
          {entries.map((entry, i) => (
            <li key={`${entry.on}-${entry.text}`}>
              <span className={`signal__node signal__node--${entry.source}`} aria-hidden="true" />
              <span className="signal__body">
                <span className="signal__text">{entry.quote ? <q>{entry.text}</q> : entry.text}</span>
                <span className="signal__meta">
                  <time dateTime={entry.on}>{dayLabel(entry.on, today)}</time>
                  {entry.source === "reported" ? (
                    <button
                      type="button"
                      className={["signal__source", i === firstReported && demo?.label ? `is-${demo.label}` : null]
                        .filter(Boolean)
                        .join(" ")}
                      aria-expanded={open === i}
                      aria-controls={`${uid}-how-${i}`}
                      onClick={() => setOpen(open === i ? null : i)}
                    >
                      {SIGNAL_COPY.reportedLabel}
                      <span className="u-visually-hidden">: {SIGNAL_COPY.reportedLabelHint}</span>
                    </button>
                  ) : null}
                </span>
                {entry.source === "reported" ? (
                  <span className="signal__how" id={`${uid}-how-${i}`} hidden={open !== i}>
                    {entry.how}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="signal__quiet">{quiet}</p>
      )}
    </section>
  );
}

export default SignalActivity;
