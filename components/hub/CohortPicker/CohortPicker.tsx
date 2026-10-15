"use client";

import { usePathname } from "next/navigation";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { getFlow } from "@/lib/manifest";
import { selectCohort, useCohortId } from "@/lib/cohort-store";
import { COHORT_CHOICES, COHORT_IDS, type CohortId } from "@/mock/enterprise";

/**
 * The reviewer's cohort switcher: which cohort every enterprise page shows,
 * from none yet to the December demo. A reviewer tool, not product UI.
 *
 * Only on enterprise pages; nothing anywhere else reads the cohort.
 */
export function CohortPicker() {
  const pathname = usePathname();
  const flow = getFlow(pathname.split("/")[1] ?? "");
  const cohort = useCohortId();

  if (flow?.chrome !== "enterprise") return null;

  return (
    <div className="dock-picker">
      <span className="devtools__rule" aria-hidden="true" />
      <ToggleGroup
        label="Cohort"
        labelHidden
        size="sm"
        orientation="vertical"
        iconOnly
        options={COHORT_IDS.map((id) => ({
          value: id,
          label: COHORT_CHOICES[id].label,
          icon: (
            <span className="dock-picker__glyph" aria-hidden="true">
              {COHORT_CHOICES[id].glyph}
            </span>
          ),
          description: COHORT_CHOICES[id].summary,
        }))}
        value={cohort}
        onChange={(next) => selectCohort(next as CohortId)}
      />
      <output className="u-visually-hidden">Cohort: {COHORT_CHOICES[cohort].label}</output>
    </div>
  );
}

export default CohortPicker;
