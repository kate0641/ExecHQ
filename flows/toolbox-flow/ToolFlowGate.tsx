"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { conceptHref } from "@/lib/manifest";
import { toolboxPageFor } from "@/lib/toolbox-store";

/** The tool the Interview opens on from the hub: a fresh start, so its whole
 *  flow can be walked through. */
const INTERVIEW_OPENS_ON = "situation-brief";

/** What a tool flow can be opened with. Without one there is nothing to open. */
const OPENS_WITH = ["artifact", "reuse", "tool", "source", "step", "after"];

/**
 * A tool flow opened with nothing to open (from the file hub, say) starts on
 * its own concept's Toolbox page, or, for the Interview, whose page was
 * scratched, on a tool, never in a blank builder. The tools are
 * reached from there.
 */
function Gate({ concept, children }: { concept: string; children: ReactNode }) {
  const params = useSearchParams();
  const router = useRouter();
  const bare = !OPENS_WITH.some((key) => params.has(key));

  useEffect(() => {
    if (!bare) return;
    // The Interview has no Toolbox page of its own (scratched 13 Oct), so it
    // opens on a tool rather than sending her to another concept's page.
    router.replace(concept === "concept-3" ? `${conceptHref("toolbox-flow", concept)}?tool=${INTERVIEW_OPENS_ON}` : conceptHref("toolbox", toolboxPageFor(concept)));
  }, [bare, concept, router]);

  return bare ? null : children;
}

// Reading the address needs a Suspense boundary, or a full page load stays
// blank (as each concept does for its own content).
export function ToolFlowGate(props: { concept: string; children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Gate {...props} />
    </Suspense>
  );
}

export default ToolFlowGate;
