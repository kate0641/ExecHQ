import { notFound } from "next/navigation";
import { SpecDocument } from "@/components/hub/SpecDocument";
import { HubChrome } from "@/components/layout/HubChrome";
import { TextLink } from "@/components/primitives/TextLink";
import { BUILDER_BRIEFS, getBuilderBrief } from "@/lib/builder-briefs";

export const dynamicParams = false;

export function generateStaticParams() {
  return BUILDER_BRIEFS.map((brief) => ({ brief: brief.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brief: string }> }) {
  const brief = getBuilderBrief((await params).brief);
  return { title: brief ? `${brief.title} — builder brief` : "Builder brief" };
}

/**
 * One builder brief, read from `builders/<slug>.md` at build time and drawn
 * by the same renderer as the interaction specs and plan briefs. The agent's
 * background, not a product page.
 */
export default async function BuilderBriefPage({ params }: { params: Promise<{ brief: string }> }) {
  const brief = getBuilderBrief((await params).brief);
  if (!brief) notFound();

  return (
    <HubChrome
      page="hub"
      bare
      title={brief.makes ? `${brief.title}: builder brief` : brief.title}
      intro={
        <p>
          <TextLink href="/#builder-briefs" tone="standalone">
            Back to the file hub
          </TextLink>
        </p>
      }
    >
      {brief.content ? (
        <SpecDocument source={brief.content} />
      ) : (
        <p>
          Not written yet. It will live at <code>{brief.path}</code>.
        </p>
      )}
    </HubChrome>
  );
}
