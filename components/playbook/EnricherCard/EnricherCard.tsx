import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { INPUT_COPY, type Enricher } from "@/mock/playbook";

export interface EnricherCardProps {
  enricher: Enricher;
  /** `offered` until she answers; `added` once she has; `skipped` folds it
   *  to one quiet line. */
  state?: "offered" | "added" | "skipped";
  onAdd?: () => void;
  onSkip?: () => void;
  /** What was added, once it is: "3 accomplishments added". */
  addedLine?: string;
  className?: string;
}

/**
 * Something that would make the draft better, offered inside the flow: "Add
 * three recent accomplishments". It never blocks the draft. Skipping it is as
 * easy as adding it, and the draft can be written either way.
 */
export function EnricherCard({ enricher, state = "offered", onAdd, onSkip, addedLine, className }: EnricherCardProps) {
  const classes = ["enricher", `enricher--${state}`, className].filter(Boolean).join(" ");
  if (state === "skipped") return null;
  if (state === "added") {
    return (
      <p className={classes}>
        <Icon name="check" size={16} />
        {addedLine ?? enricher.title}
      </p>
    );
  }
  return (
    <aside className={classes} aria-label={enricher.title}>
      <span className="enricher__eyebrow">
        <Icon name="plus" size={14} />
        {INPUT_COPY.optional}
      </span>
      <p className="enricher__title">{enricher.title}</p>
      <p className="enricher__why">{enricher.why}</p>
      <div className="enricher__actions">
        <Button variant="secondary" size="sm" onClick={onAdd}>
          {enricher.add}
        </Button>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          {enricher.skip}
        </Button>
      </div>
    </aside>
  );
}

export default EnricherCard;
