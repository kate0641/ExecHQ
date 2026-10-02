import { notFound } from "next/navigation";
import { SpecDocument } from "@/components/hub/SpecDocument";
import { HubChrome } from "@/components/layout/HubChrome";
import { TextLink } from "@/components/primitives/TextLink";
import { flows, getFlow } from "@/lib/manifest";
import { getSpec } from "@/lib/specs";

export const dynamicParams = false;

export function generateStaticParams() {
  return flows.map((flow) => ({ flow: flow.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ flow: string }> }) {
  const flow = getFlow((await params).flow);
  return { title: flow ? `${flow.title} — interaction spec` : "Interaction spec" };
}

/**
 * One flow's interaction spec, read from `specs/<flow-slug>.md` at build time
 * and shown on its own page. The hub links here instead of carrying the spec
 * inline.
 */
export default async function SpecPage({ params }: { params: Promise<{ flow: string }> }) {
  const flow = getFlow((await params).flow);
  if (!flow) notFound();
  const spec = getSpec(flow.slug);

  return (
    <HubChrome
      page="hub"
      bare
      title={`${flow.title}: interaction spec`}
      intro={
        <p>
          <TextLink href="/" tone="standalone">
            Back to the file hub
          </TextLink>
        </p>
      }
    >
      {spec.content ? (
        <SpecDocument source={spec.content} />
      ) : (
        <p>
          No spec file yet. It lives at <code>{spec.path}</code>.
        </p>
      )}
    </HubChrome>
  );
}
