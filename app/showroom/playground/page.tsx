import Link from "next/link";
import { HubChrome } from "@/components/layout/HubChrome";
import { Panel } from "@/components/layout/Panel";
import { StatusBadge } from "@/components/primitives/Badge";
import { getBuiltConceptKeys } from "@/flows/registry";
import { conceptHref, conceptStatus, getConcept } from "@/lib/manifest";

export const metadata = {
  title: "Playground",
};

/**
 * The playground: every built flow, ready to step through.
 *
 * The concept pages already are the playground — they run the real screens on
 * the sample data in `mock/`, and the step bar jumps to any screen with the
 * earlier answers filled in. So this room is a launcher onto them rather than a
 * second copy of each flow, which would drift.
 */
export default function PlaygroundPage() {
  const built = getBuiltConceptKeys().flatMap(({ flow, concept }) => {
    const match = getConcept(flow, concept);
    return match ? [match] : [];
  });

  return (
    <HubChrome
      page="playground"
      intro={
        <p>
          Every flow that has been built, running on sample data. Nothing you
          type is saved or sent anywhere, and there is no account to sign in to.
        </p>
      }
    >
      <section className="hub__section" aria-labelledby="flows-title">
        <h2 className="hub__section-title" id="flows-title">
          Built flows
        </h2>
        <ul className="hub-tools">
          {built.map(({ flow, concept }) => (
            <li key={`${flow.slug}/${concept.slug}`}>
              <Link href={conceptHref(flow.slug, concept.slug)} className="hub-tools__card">
                <span className="t-eyebrow">{flow.title}</span>
                <span className="hub-tools__card-title">{concept.title}</span>
                {concept.summary ? (
                  <span className="hub-tools__card-description">{concept.summary}</span>
                ) : null}
                <span className="hub-tools__card-count">
                  <StatusBadge status={conceptStatus(concept)} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Panel title="Stepping through" headingLevel={2} tone="sunken">
        <ul className="playground__tips t-measure">
          <li>Open a flow and use it as a person would: every answer moves you on.</li>
          <li>
            The step bar above the screen jumps to any step. Everything before it
            is filled in with sample answers, so later screens always have
            something real to show.
          </li>
          <li>The dock on the right switches between phone, tablet and web.</li>
          <li>
            The sample answers live in <code>mock/</code>. Change them there to
            see a flow with different content.
          </li>
        </ul>
      </Panel>
    </HubChrome>
  );
}
