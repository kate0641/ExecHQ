"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { conceptHref } from "@/lib/manifest";
import { toolboxActions, type ToolFlowPage } from "@/lib/toolbox-store";

/** The tool every concept opens on from the hub, so the three compare like
 *  for like (Kate, 15 Oct). */
const OPENS_ON = "situation-brief";

/** What a tool flow can be opened with. Without one there is nothing to open. */
const OPENS_WITH = ["artifact", "reuse", "tool", "source", "step", "after"];

/**
 * A tool flow opened with nothing to open (from the file hub, say) starts on
 * its step one: the Situation Brief's start screen, in this concept. Toolbox
 * Concept 2 is the only Toolbox page, so no concept sends her there first.
 *
 * Opening a concept records it, so the Toolbox's tools, the Briefing's
 * hand-off and what comes next after an outcome open in the same one.
 */
function Gate({ concept, children }: { concept: ToolFlowPage; children: ReactNode }) {
  const params = useSearchParams();
  const router = useRouter();
  const bare = !OPENS_WITH.some((key) => params.has(key));

  useEffect(() => {
    toolboxActions.openFlow(concept);
  }, [concept]);

  useEffect(() => {
    if (bare) router.replace(`${conceptHref("toolbox-flow", concept)}?tool=${OPENS_ON}`);
  }, [bare, concept, router]);

  return bare ? null : children;
}

// Reading the address needs a Suspense boundary, or a full page load stays
// blank (as each concept does for its own content).
export function ToolFlowGate(props: { concept: ToolFlowPage; children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Gate {...props} />
    </Suspense>
  );
}

export default ToolFlowGate;
