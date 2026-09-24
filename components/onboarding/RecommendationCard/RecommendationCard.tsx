export interface RecommendationCardProps {
  /** The lead-in, e.g. "From that alone, I'd start you on". */
  lead: string;
  name: string;
  formalName?: string;
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
export function RecommendationCard({ lead, name, formalName, reason, status, className }: RecommendationCardProps) {
  return (
    <div className={["recommendation", className].filter(Boolean).join(" ")}>
      <p className="recommendation__lead">{lead}</p>
      <p className="recommendation__name">{name}</p>
      {formalName ? <p className="recommendation__formal">{formalName}</p> : null}
      <p className="recommendation__reason">{reason}</p>
      {status ? <p className="recommendation__status">{status}</p> : null}
    </div>
  );
}

export default RecommendationCard;
