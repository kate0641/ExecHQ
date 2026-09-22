import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppChrome } from "@/components/layout/AppChrome";
import { PlaceholderState } from "@/components/layout/PlaceholderState";
import { StatusBadge } from "@/components/primitives/Badge";
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
  const spec = getSpec(flow.slug);

  return (
    <AppChrome flow={flow}>
      <div className="page">
        <div className="page__header">
          <p className="t-eyebrow">{flow.title}</p>
          <h1 className="page__title">{concept.title}</h1>
          <StatusBadge status={conceptStatus(concept)} />
        </div>

        <PlaceholderState
          sprint={flow.sprint}
          title={flow.title}
          description={flow.description}
          specPath={spec.path}
        />
      </div>
    </AppChrome>
  );
}
