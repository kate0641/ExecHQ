import { LoopStatus } from "@/components/loop/LoopStatus";
import { shortDate, type LoopRecord } from "@/lib/loop";
import { ARTIFACT_KINDS } from "@/mock/loop";
import { HORIZONS, type LandscapeAction } from "@/mock/plan-stub";

export interface StageActionsItem {
  action: LandscapeAction;
  /** The Loop record of the artifact that does it, once there is one. */
  record?: LoopRecord;
}

export interface StageActionsProps {
  items: StageActionsItem[];
  /** "Also in Show the proof". */
  heading: string;
  /** Shown when the focal item was the stage's only action. */
  emptyText?: string;
  headingId?: string;
  className?: string;
}

/** When the record last moved, in the list's words. */
function whenLine(record: LoopRecord): string {
  if (record.usedOn) return `${ARTIFACT_KINDS[record.kind].usedLabel} ${shortDate(record.usedOn)}`;
  return `Drafted ${shortDate(record.createdOn)}`;
}

/**
 * The current stage's other live actions, each with its horizon and where
 * its work stands in the Loop. Accepted actions only: the page passes no
 * declined or deferred ones. Where each stands is the Loop's own status,
 * never a score.
 */
export function StageActions({
  items,
  heading,
  emptyText = "That’s the only action in this stage right now.",
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
              <span className="stage-actions__title">{action.title}</span>
              <span className="stage-actions__meta">
                <span>{HORIZONS.find((h) => h.id === action.horizon)?.label}</span>
                {record ? (
                  <>
                    <LoopStatus record={record} detail={false} />
                    <span>{whenLine(record)}</span>
                  </>
                ) : (
                  <span>Not started</span>
                )}
              </span>
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
