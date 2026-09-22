import { ComponentCatalogue } from "@/components/hub/ComponentCatalogue";
import { FlowList } from "@/components/hub/FlowList";
import { StyleguideViewer } from "@/components/hub/StyleguideViewer";
import { registry } from "@/components/registry";
import { flows } from "@/lib/manifest";
import { getSpec, type Spec } from "@/lib/specs";

export const metadata = {
  title: "File hub",
};

/**
 * The file hub — the prototype's home base.
 *
 * Three sections: the flows and pages index (generated from the manifest, with
 * each flow's interaction spec beneath it), the component catalogue, and the
 * stylesheet viewer.
 */
export default function HubPage() {
  const specs: Record<string, Spec> = Object.fromEntries(
    flows.map((flow) => [flow.slug, getSpec(flow.slug)])
  );

  const conceptCount = flows.reduce((total, flow) => total + flow.concepts.length, 0);

  return (
    <div className="hub">
      <header className="hub__header">
        <p className="t-eyebrow">ExecHQ design prototype</p>
        <h1 className="hub__title">File hub</h1>
        <p className="hub__intro t-measure">
          Everything in this prototype is declared in{" "}
          <code>prototype.config.ts</code>. {flows.length} flows, {conceptCount}{" "}
          concept pages and {registry.length} catalogued components. Nothing here
          talks to a network.
        </p>
        <nav className="hub__local-nav" aria-label="Sections of the hub">
          <ul className="hub__local-nav-list">
            <li>
              <a className="link link--standalone" href="#flows">
                Flows and pages
              </a>
            </li>
            <li>
              <a className="link link--standalone" href="#components">
                Component catalogue
              </a>
            </li>
            <li>
              <a className="link link--standalone" href="#styleguide">
                Stylesheet
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="hub__main" id="main">
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

        <section
          className="hub__section"
          id="components"
          aria-labelledby="components-title"
        >
          <h2 className="hub__section-title" id="components-title">
            Component catalogue
          </h2>
          <p className="hub__section-intro t-measure">
            The real components, imported from <code>/components</code>, shown in
            every state their own states file declares. It grows each sprint.
            Status is per component, not per page, because one component may
            appear across several flows at different stages.
          </p>
          <ComponentCatalogue />
        </section>

        <section
          className="hub__section"
          id="styleguide"
          aria-labelledby="styleguide-title"
        >
          <h2 className="hub__section-title" id="styleguide-title">
            Stylesheet
          </h2>
          <p className="hub__section-intro t-measure">
            Read directly from <code>styles/tokens.css</code>. Greyscale for this
            sprint: the raw palette and the brand slots are the only things that
            change when navy, gold and slate blue arrive, and contrast will need
            re-verifying then.
          </p>
          <StyleguideViewer />
        </section>
      </main>

      <footer className="hub__footer">
        <p className="hub__footer-text">
          Sprint 0 — shell only. Product screens are designed in sprints 1 to 5.
        </p>
      </footer>
    </div>
  );
}
