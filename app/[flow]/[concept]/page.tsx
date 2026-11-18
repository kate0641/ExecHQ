import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppChrome } from "@/components/layout/AppChrome";
import { DestinationStub } from "@/components/layout/DestinationStub";
import { PlaceholderState } from "@/components/layout/PlaceholderState";
import { StatusBadge } from "@/components/primitives/Badge";
import { getBuiltConcept } from "@/flows/registry";
import { allConceptParams, conceptStatus, getConcept } from "@/lib/manifest";
import { getSpec } from "@/lib/specs";

interface RouteParams {
  flow: string;
  concept: string;
}

/**
 * Every concept page in the prototype.
 *
 * Routes come from the manifest and nowhere else: `generateStaticParams` reads
 * it, and `dynamicParams = false` means anything it does not declare 404s.
 */
export const dynamicParams = false;

export function generateStaticParams(): RouteParams[] {
  return allConceptParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { flow: flowSlug, concept: conceptSlug } = await params;
  const match = getConcept(flowSlug, conceptSlug);
  if (!match) return { title: "Not found" };
  return { title: `${match.flow.title} — ${match.concept.title}` };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { flow: flowSlug, concept: conceptSlug } = await params;
  const match = getConcept(flowSlug, conceptSlug);
  if (!match) notFound();

  const { flow, concept } = match;

  // A navigation concept is reviewed on another flow's page (the manifest's
  // `navCanvas`): that page's content, inside this concept's navigation.
  const canvas = flow.navCanvas
    ? getConcept(flow.navCanvas.flowSlug, flow.navCanvas.conceptSlug)
    : undefined;
  const page = canvas ?? match;
  const navConcept = canvas
    ? { slug: concept.slug, currentFlow: canvas.flow.slug }
    : undefined;
  const Built = getBuiltConcept(page.flow.slug, page.concept.slug);

  // A built concept gets the canvas to itself. The page furniture — eyebrow,
  // concept title, status badge — is review scaffolding, and leaving it above a
  // finished screen would put a heading in the outline that the design does not
  // have and change what is being reviewed. The hub already says which concept
  // this is and what state it is in.
  if (Built) {
    return (
      <AppChrome flow={flow} navConcept={navConcept}>
        {Built}
      </AppChrome>
    );
  }

  // A signed-in destination a later sprint designs reads as a quiet, real
  // page, so the navigation around it can be judged.
  if (page.flow.stub) {
    return (
      <AppChrome flow={flow} navConcept={navConcept}>
        <DestinationStub
          heading={page.flow.stub.heading}
          body={page.flow.stub.body}
          sprint={page.flow.sprint}
        />
      </AppChrome>
    );
  }

  const spec = getSpec(page.flow.slug);

  return (
    <AppChrome flow={flow} navConcept={navConcept}>
      <div className="page">
        <div className="page__header">
          <p className="t-eyebrow">
            {canvas ? `${flow.title} — on the ${canvas.flow.title.toLowerCase()}` : flow.title}
          </p>
          <h1 className="page__title">{concept.title}</h1>
          <StatusBadge status={conceptStatus(concept)} />
        </div>

        <PlaceholderState
          sprint={page.flow.sprint}
          title={page.flow.title}
          description={page.flow.description}
          specPath={spec.path}
        />
      </div>
    </AppChrome>
  );
}
