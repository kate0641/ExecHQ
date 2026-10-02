export interface RecommendationCardProps {
  /** A lead-in above the plan's name, where the name is shown here. */
  lead?: string;
  /** The plan's name. Left out where the page's own heading says it. */
  name?: string;
  formalName?: string;
  /** When the plan is for: a sentence, under the name. */
  forWhom?: string;
  reason: string;
  /** How sure ExecHQ is, said in words, e.g. "Checked against your answers". */
  status?: string;
  className?: string;
}

/**
 * ExecHQ's recommendation, stated as one: a plan and the reason for it, not a
 * menu. Concept 3 makes it as soon as it hears where the user wants to go,
 * then tests it with every question after.
 */
export function RecommendationCard({ lead, name, formalName, forWhom, reason, status, className }: RecommendationCardProps) {
  return (
    <div className={["recommendation", className].filter(Boolean).join(" ")}>
      {lead ? <p className="recommendation__lead">{lead}</p> : null}
      {name ? <p className="recommendation__name">{name}</p> : null}
      {formalName ? <p className="recommendation__formal">{formalName}</p> : null}
      {forWhom ? <p className="recommendation__for">{forWhom}</p> : null}
      <p className="recommendation__reason">{reason}</p>
      {status ? <p className="recommendation__status">{status}</p> : null}
    </div>
  );
}

export default RecommendationCard;
