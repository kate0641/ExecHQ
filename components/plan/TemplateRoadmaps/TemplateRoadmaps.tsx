import { Badge } from "@/components/primitives/Badge";
import { PLAN_TEMPLATES } from "@/mock/onboarding";
import { ROADMAP_COPY as C, roadmapFor } from "@/mock/plan";

export interface TemplateRoadmapsProps {
  /** Show only these plans, by id. Defaults to all five. */
  only?: string[];
  headingId?: string;
  className?: string;
}

/**
 * Every plan template, stage by stage, on one page: for reviewing the wording
 * of the five roadmaps together. Reference, not a screen of the product; the
 * real roadmap is `RoadmapTimeline` (Concept 1) and `PlanAgenda` (Concept 3). A stage the brief adds that onboarding does
 * not show yet is marked, so it is easy to find.
 */
export function TemplateRoadmaps({ only, headingId = "template-roadmaps", className }: TemplateRoadmapsProps) {
  const plans = PLAN_TEMPLATES.filter((p) => !only || only.includes(p.id));
  return (
    <section className={["templates", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="templates__heading" id={headingId}>
        All five plans
      </h2>
      <div className="templates__list">
        {plans.map((plan) => {
          const stages = roadmapFor(plan.id);
          return (
            <article className="templates__plan" key={plan.id} aria-labelledby={`${headingId}-${plan.id}`}>
              <h3 className="templates__name" id={`${headingId}-${plan.id}`}>
                {plan.name}
              </h3>
              {plan.formalName ? <p className="templates__formal">{plan.formalName}</p> : null}
              <p className="templates__for">{plan.bestFor}</p>
              <ol className="templates__stages">
                {stages.map((stage, i) => (
                  <li key={stage.title}>
                    <p className="templates__stage-name">
                      <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <span className="u-visually-hidden">{C.stageOf(i + 1, stages.length)}: </span> {stage.title}
                      {stage.added ? <Badge tone="sprint">{C.addedNote}</Badge> : null}
                    </p>
                    <p className="templates__milestone">
                      <b>{C.finishing}</b> {stage.milestone}
                    </p>
                    <ul className="templates__outcomes">
                      {stage.outcomes.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default TemplateRoadmaps;
