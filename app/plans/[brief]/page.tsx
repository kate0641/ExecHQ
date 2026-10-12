import { notFound } from "next/navigation";
import { SpecDocument } from "@/components/hub/SpecDocument";
import { HubChrome } from "@/components/layout/HubChrome";
import { TextLink } from "@/components/primitives/TextLink";
import { PLAN_BRIEFS, getPlanBrief } from "@/lib/plan-briefs";

export const dynamicParams = false;

export function generateStaticParams() {
  return PLAN_BRIEFS.map((brief) => ({ brief: brief.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brief: string }> }) {
  const brief = getPlanBrief((await params).brief);
  return { title: brief ? `${brief.title} — plan brief` : "Plan brief" };
}

/**
 * One plan brief, read from `plans/<slug>.md` at build time and drawn by the
 * same renderer as the interaction specs. The agent's background, not a
 * product page.
 */
export default async function PlanBriefPage({ params }: { params: Promise<{ brief: string }> }) {
  const brief = getPlanBrief((await params).brief);
  if (!brief) notFound();

  return (
    <HubChrome
      page="hub"
      bare
      title={brief.template ? `${brief.title}: plan brief` : brief.title}
      intro={
        <p>
          <TextLink href="/#plan-briefs" tone="standalone">
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
