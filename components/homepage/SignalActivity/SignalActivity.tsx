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
  headingLevel?: 2 | 3;
  headingId?: string;
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
 * Every entry says in words whether it was seen in ExecHQ or the user told
 * us. The node beside it repeats that by shape (filled or hollow) and is
 * hidden from assistive technology, so nothing rests on the mark alone.
 * There are no counts, bars or trends: facts only.
 */
export function SignalActivity({
  name,
  entries,
  quiet = SIGNAL_COPY.quiet,
  eyebrow,
  window,
  tone = "plain",
  today,
  headingLevel = 3,
  headingId = "signal",
  className,
}: SignalActivityProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <section className={["signal", `signal--${tone}`, className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      {eyebrow ? <p className="signal__eyebrow">{eyebrow}</p> : null}
      <Heading className="signal__name" id={headingId} tabIndex={-1}>
        {name}
      </Heading>
      {window ? <p className="signal__window">{window}</p> : null}
      {entries.length ? (
        <ol className="signal__list">
          {entries.map((entry) => (
            <li key={`${entry.on}-${entry.text}`}>
              <span className={`signal__node signal__node--${entry.source}`} aria-hidden="true" />
              <span className="signal__body">
                <span className="signal__text">{entry.quote ? <q>{entry.text}</q> : entry.text}</span>
                <span className="signal__meta">
                  <time dateTime={entry.on}>{dayLabel(entry.on, today)}</time>
                  <span className={`signal__source signal__source--${entry.source}`}>
                    {SIGNAL_COPY.sources[entry.source]}
                  </span>
                </span>
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
