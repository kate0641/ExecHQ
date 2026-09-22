import { Icon } from "@/components/primitives/Icon";
import type { RecommendedAction } from "@/mock/onboarding";

export interface ActionCardProps {
  action: RecommendedAction;
  headingLevel?: 1 | 2 | 3;
  className?: string;
}

/**
 * The first recommended action, with its reasoning shown rather than implied.
 *
 * "Why this, why now, why you" is a product rule, not a layout choice: the PRD
 * requires every recommendation to carry transparent reasoning, and the brand
 * position is that ExecHQ gives people the intelligence to decide rather than
 * telling them what to do. So the three reasons are a definition list — they
 * are labelled pairs, and marking them up as one makes the relationship real
 * rather than visual.
 */
export function ActionCard({
  action,
  headingLevel = 2,
  className,
}: ActionCardProps) {
  const Heading = `h${headingLevel}` as const;

  return (
    <article className={["action-card", className].filter(Boolean).join(" ")}>
      <div className="action-card__head">
        <Heading className="action-card__title">{action.title}</Heading>
        <p className="action-card__outcome">{action.outcome}</p>
      </div>

      <dl className="action-card__reasons">
        <div className="action-card__reason">
          <dt>Why this</dt>
          <dd>{action.whyThis}</dd>
        </div>
        <div className="action-card__reason">
          <dt>Why now</dt>
          <dd>{action.whyNow}</dd>
        </div>
        <div className="action-card__reason">
          <dt>Why you</dt>
          <dd>{action.whyYou}</dd>
        </div>
      </dl>

      <p className="action-card__meta">
        <Icon name="document" size={15} />
        {action.tool} · {action.effort}
      </p>
    </article>
  );
}

export default ActionCard;
