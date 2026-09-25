import Link from "next/link";
import { FlowList } from "@/components/hub/FlowList";
import { HubChrome } from "@/components/layout/HubChrome";
import { registry } from "@/components/registry";
import { SHOWROOM_ROOMS } from "@/lib/hub-pages";
import { flows } from "@/lib/manifest";
import { getBuiltConceptKeys } from "@/flows/registry";
import { getSpec, type Spec } from "@/lib/specs";
import { readTokens } from "@/lib/tokens";

export const metadata = {
  title: "File hub",
};

/**
 * The file hub — the prototype's home base.
 *
 * The index of flows and pages, plus the way in to the showroom's rooms where
 * the showroom is built. On the public production site it is not, and the
 * Showroom section is left out rather than linking to pages that 404.
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
          {flows.length} flows and {conceptCount} concept pages. Nothing here talks
          to a network.
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
          its interaction spec in the slot beneath it. Adding a concept is one
          entry in <code>prototype.config.ts</code>.
        </p>
        <FlowList specs={specs} headingLevel={4} />
      </section>
    </HubChrome>
  );
}
