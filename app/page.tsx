import Link from "next/link";
import { FlowList } from "@/components/hub/FlowList";
import { HubChrome } from "@/components/layout/HubChrome";
import { TextLink } from "@/components/primitives/TextLink";
import { registry } from "@/components/registry";
import { SHOWROOM_ROOMS } from "@/lib/hub-pages";
import { flows } from "@/lib/manifest";
import { getBuiltConceptKeys } from "@/flows/registry";
import { getSpec, type Spec } from "@/lib/specs";
import { PLAN_BRIEFS, getPlanBrief } from "@/lib/plan-briefs";
import { readTokens } from "@/lib/tokens";

export const metadata = {
  title: "File hub",
};

/**
 * The file hub — the prototype's home base.
 *
 * The index of flows and pages, plus the way in to the showroom's rooms where
 * the showroom is built. Where it is not, the Showroom section is left out
 * rather than linking to pages that 404.
 */
export default function HubPage() {
  const specs: Record<string, Spec> = Object.fromEntries(
    flows.map((flow) => [flow.slug, getSpec(flow.slug)])
  );

  const conceptCount = flows.reduce((total, flow) => total + flow.concepts.length, 0);
  const counts: Record<string, string> = {
    "design-system": `${readTokens().length} tokens`,
    components: `${registry.length} components`,
    playground: `${getBuiltConceptKeys().length} built flows`,
  };

  return (
    <HubChrome
      page="hub"
      intro={
        <p>
          Everything in this prototype is declared in <code>prototype.config.ts</code>.{" "}
          {flows.length} flows and {conceptCount} concept pages, then the{" "}
          <TextLink href="#plan-briefs">plan briefs</TextLink>. Nothing here talks to a network.
        </p>
      }
    >
      {SHOWROOM_ROOMS.length > 0 ? (
        <section className="hub__section" aria-labelledby="tools-title">
          <h2 className="hub__section-title" id="tools-title">
            Showroom
          </h2>
          <ul className="hub-tools">
            {SHOWROOM_ROOMS.map((tool) => (
              <li key={tool.key}>
                <Link href={tool.href} className="hub-tools__card">
                  <span className="hub-tools__card-title">{tool.title}</span>
                  <span className="hub-tools__card-description">{tool.description}</span>
                  <span className="hub-tools__card-count t-eyebrow">
                    {counts[tool.key]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="hub__section" id="flows" aria-labelledby="flows-title">
        <h2 className="hub__section-title" id="flows-title">
          Flows and pages
        </h2>
        <p className="hub__section-intro t-measure">
          Every flow from the manifest, with its concepts linked underneath and
          a link to its interaction spec, which opens on its own page. Adding a concept is one
          entry in <code>prototype.config.ts</code>.
        </p>
        <FlowList specs={specs} headingLevel={4} />
      </section>

      <section className="hub__section" id="plan-briefs" aria-labelledby="plan-briefs-title">
        <h2 className="hub__section-title" id="plan-briefs-title">
          Plan briefs
        </h2>
        <p className="hub__section-intro t-measure">
          The agent&rsquo;s background for each V1 plan: who it is for, its stages, the action
          steps it can recommend and when, and the signals each stage leans on. Reference, like
          the interaction specs, not product screens. One markdown file each in{" "}
          <code>plans/</code>.
        </p>
        <div className="flow-list">
          <ul className="flow-list__flows">
            {PLAN_BRIEFS.map((entry) => (
              <li className="flow-list__flow" key={entry.slug}>
                <div className="flow-list__flow-header">
                  <h3 className="flow-list__flow-title">{entry.title}</h3>
                </div>
                <p className="flow-list__flow-description">
                  {entry.template ? `${entry.template}. ${entry.description}` : entry.description}
                </p>
                <p className="flow-list__spec">
                  <TextLink href={`/plans/${entry.slug}`} tone="standalone">
                    {entry.template ? "Plan brief" : "Read the rules"}
                    <span className="u-visually-hidden"> for {entry.title}</span>
                  </TextLink>
                  {getPlanBrief(entry.slug)?.content ? null : (
                    <span className="flow-list__spec-empty"> · not yet written</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </HubChrome>
  );
}
