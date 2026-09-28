"use client";

import Link from "next/link";
import { useState } from "react";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { Icon } from "@/components/primitives/Icon";
import { lastTouched, shortDate, type LoopRecord } from "@/lib/loop";
import { ARTIFACT_KINDS } from "@/mock/loop";

export type RecentWorkFilter = "all" | "progress" | "waiting" | "done";
type Filter = RecentWorkFilter;

const GROUP: Record<LoopRecord["state"], Exclude<Filter, "all">> = {
  drafted: "progress",
  "in-progress": "progress",
  ready: "progress",
  used: "waiting",
  waiting: "waiting",
  outcome: "done",
  closed: "done",
};

export interface RecentWorkProps {
  records: LoopRecord[];
  /** Where each opens. Stubbed until Sprint 4. */
  hrefFor: (record: LoopRecord) => string;
  /** A small label above each title, e.g. the ring it belongs to. */
  labelFor?: (record: LoopRecord) => string | undefined;
  heading?: string;
  /** Filter chips — All, In progress, Waiting, Done — each with its count. */
  filterable?: boolean;
  /** How many to show before the list stops. */
  limit?: number;
  emptyText?: string;
  /** Starts filtered. For the catalogue. */
  defaultFilter?: Filter;
  /** Catalogue only: shows the first item in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  headingId?: string;
  className?: string;
}

const FILTERS: [Filter, string][] = [
  ["all", "All"],
  ["progress", "In progress"],
  ["waiting", "Waiting"],
  ["done", "Done"],
];

/** When it last moved, said the way the list wants it. */
function whenLine(record: LoopRecord): string {
  if (record.usedOn) return `${ARTIFACT_KINDS[record.kind].usedLabel} ${shortDate(record.usedOn)}`;
  const touched = lastTouched(record);
  return touched === record.createdOn ? `Drafted ${shortDate(touched)}` : `Edited ${shortDate(touched)}`;
}

/**
 * The user's artifacts, most recently touched first, each with its Loop
 * status. The counts on the chips are just how many are in each group: never
 * a score.
 */
export function RecentWork({
  records,
  hrefFor,
  labelFor,
  heading = "Your work",
  filterable = true,
  limit = 5,
  emptyText = "Nothing here right now.",
  defaultFilter = "all",
  demo,
  headingId = "recent-work",
  className,
}: RecentWorkProps) {
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const sorted = [...records].sort((a, b) => (lastTouched(a) < lastTouched(b) ? 1 : -1));
  const shown = sorted.filter((r) => filter === "all" || GROUP[r.state] === filter).slice(0, limit);
  const count = (f: Filter) => (f === "all" ? records.length : records.filter((r) => GROUP[r.state] === f).length);

  return (
    <section className={["recent-work", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="recent-work__heading" id={headingId}>
        {heading}
      </h2>
      {filterable && records.length ? (
        <fieldset className="recent-work__chips">
          <legend className="u-visually-hidden">Show</legend>
          {FILTERS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>
              <b>{count(id)}</b>
              {label}
            </button>
          ))}
        </fieldset>
      ) : null}
      {shown.length ? (
        <ul className="recent-work__list">
          {shown.map((record, index) => {
            const label = labelFor?.(record);
            return (
              <li key={record.id}>
                <Link
                  href={hrefFor(record)}
                  className={["recent-work__item", demo && index === 0 ? `is-${demo}` : null].filter(Boolean).join(" ")}
                >
                  {label ? <span className="recent-work__label">{label}</span> : null}
                  <span className="recent-work__title">{record.title}</span>
                  <span className="recent-work__meta">
                    <LoopStatus record={record} />
                    <span>{whenLine(record)}</span>
                  </span>
                  <Icon name="chevron" size={16} className="recent-work__go" />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="recent-work__empty">{emptyText}</p>
      )}
    </section>
  );
}

export default RecentWork;
