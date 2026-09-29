import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";
import { shortDate, type LoopRecord } from "@/lib/loop";
import { ARTIFACT_KINDS } from "@/mock/loop";
import type { LandscapeAction } from "@/mock/plan-stub";

export interface StageActionsItem {
  action: LandscapeAction;
  /** The Loop record of the artifact that does it, once there is one. */
  record?: LoopRecord;
}

export interface StageActionsProps {
  items: StageActionsItem[];
  /** "Also in Show the proof". */
  heading: string;
  /** Where each row goes: its Toolbox flow, stubbed until Sprint 4. */
  href: string;
  /** Shown when the stage has nothing else. */
  emptyText?: string;
  headingId?: string;
  className?: string;
}

/** Where the action's work stands and what's next, in plain words. */
export function stageActionLine(record?: LoopRecord): string {
  if (!record) return "Not started · Start in the Toolbox";
  const used = record.usedOn ? `${ARTIFACT_KINDS[record.kind].usedLabel} ${shortDate(record.usedOn)}` : "";
  switch (record.state) {
    case "drafted":
    case "in-progress":
      return `Draft started ${shortDate(record.createdOn)} · Pick it up`;
    case "ready":
      return "Ready · Say when you’ve used it";
    case "used":
    case "waiting":
      return `${used} · Waiting to hear`;
    default:
      return used ? `${used} · Outcome logged` : "Done";
  }
}

/**
 * The current stage's other actions, after the next step and anything
 * waiting on the user's word. Each row is a way in: its title, and where its
 * work stands with what's next ("Draft started 16 Oct · Pick it up").
 * Accepted actions only; declined and deferred ones never reach it.
 */
export function StageActions({
  items,
  heading,
  href,
  emptyText = "Nothing else in this stage right now.",
  headingId = "stage-actions",
  className,
}: StageActionsProps) {
  return (
    <section className={["stage-actions", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="stage-actions__heading" id={headingId}>
        {heading}
      </h2>
      {items.length ? (
        <ul className="stage-actions__list">
          {items.map(({ action, record }) => (
            <li key={action.id}>
              <Link href={href} className="stage-actions__row">
                <span className="stage-actions__text">
                  <span className="stage-actions__title">{action.title}</span>
                  <span className="stage-actions__meta">{stageActionLine(record)}</span>
                </span>
                <Icon name="chevron" size={16} className="stage-actions__go" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="stage-actions__empty">{emptyText}</p>
      )}
    </section>
  );
}

export default StageActions;
