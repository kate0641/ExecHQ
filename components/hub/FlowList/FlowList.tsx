import { StatusBadge, Badge } from "@/components/primitives/Badge";
import { TextLink } from "@/components/primitives/TextLink";
import { conceptHref, conceptStatus, flowsBySprint } from "@/lib/manifest";
import type { Spec } from "@/lib/specs";

export interface FlowListProps {
  /** Compact drops the descriptions and the spec slots — used in the panel. */
  compact?: boolean;
  /** Interaction specs keyed by flow slug. Only the full hub passes these. */
  specs?: Record<string, Spec>;
  /** Heading level for each flow title, so heading order stays correct. */
  headingLevel?: 2 | 3 | 4;
}

/**
 * Every flow in the manifest, grouped by sprint, with its concepts listed and
 * linked underneath. Generated entirely from `prototype.config.ts` — adding a
 * flow or a concept there is enough to make it appear here.
 */
export function FlowList({ compact = false, specs, headingLevel = 3 }: FlowListProps) {
  const FlowHeading = `h${headingLevel}` as const;
  const SprintHeading = `h${(headingLevel - 1) as 2 | 3}` as const;
  const groups = flowsBySprint();

  return (
    <div className={`flow-list${compact ? " flow-list--compact" : ""}`}>
      {groups.map(({ sprint, flows: sprintFlows }) => (
        <section className="flow-list__sprint" key={sprint}>
          <SprintHeading className="flow-list__sprint-title t-eyebrow">
            Sprint {sprint}
          </SprintHeading>

          <ul className="flow-list__flows">
            {sprintFlows.map((flow) => {
              const spec = specs?.[flow.slug];
              return (
                <li className="flow-list__flow" key={flow.slug}>
                  <div className="flow-list__flow-header">
                    <FlowHeading className="flow-list__flow-title">
                      {flow.title}
                    </FlowHeading>
                    {flow.webOnly ? <Badge>Web only</Badge> : null}
                  </div>

                  {compact ? null : (
                    <p className="flow-list__flow-description">{flow.description}</p>
                  )}

                  <ul className="flow-list__concepts">
                    {flow.concepts.map((concept) => (
                      <li className="flow-list__concept" key={concept.slug}>
                        <TextLink
                          href={conceptHref(flow.slug, concept.slug)}
                          tone="quiet"
                          className="flow-list__concept-link"
                        >
                          {concept.title}
                        </TextLink>
                        {concept.summary && !compact ? (
                          <span className="flow-list__concept-summary">
                            {concept.summary}
                          </span>
                        ) : null}
                        <StatusBadge status={conceptStatus(concept)} />
                      </li>
                    ))}
                  </ul>

                  {compact ? null : (
                    <div className="flow-list__spec">
                      <p className="t-eyebrow">Interaction spec</p>
                      {spec?.content ? (
                        <pre className="flow-list__spec-content">{spec.content}</pre>
                      ) : (
                        <p className="flow-list__spec-empty">
                          No spec file yet. Run <code>npm run sync:specs</code>.
                        </p>
                      )}
                      <p className="flow-list__spec-path">
                        <code>{spec?.path ?? `specs/${flow.slug}.md`}</code>
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default FlowList;
