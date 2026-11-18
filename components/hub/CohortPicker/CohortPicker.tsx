"use client";

import { usePathname } from "next/navigation";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { getFlow } from "@/lib/manifest";
import { Icon } from "@/components/primitives/Icon";
import { selectCohort, setUpdateLate, useCohortId, useUpdateLate } from "@/lib/cohort-store";
import { COHORTS, COHORT_CHOICES, COHORT_IDS, weekBefore, type CohortId } from "@/mock/enterprise";

/**
 * The reviewer's cohort switcher: which cohort every enterprise page shows,
 * from none yet to the December demo. A reviewer tool, not product UI.
 *
 * Under it, Update late: today's figures have not arrived, so every concept
 * shows yesterday's, and the letter its last issue. It needs a cohort with
 * a week before, so the letter has an issue to fall back on.
 *
 * Only on enterprise pages; nothing anywhere else reads the cohort.
 */
export function CohortPicker() {
  const pathname = usePathname();
  const flow = getFlow(pathname.split("/")[1] ?? "");
  const cohort = useCohortId();
  const late = useUpdateLate();

  if (flow?.chrome !== "enterprise") return null;

  const canBeLate = cohort !== "none" && Boolean(weekBefore(COHORTS[cohort]));
  const lateLabel = !canBeLate
    ? "Update late needs a cohort with at least two weekly updates"
    : late
      ? "Update late. Show today’s update"
      : "Update on time. Make today’s update late";

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
      <button
        type="button"
        className="devtools__late"
        aria-pressed={late && canBeLate}
        disabled={!canBeLate}
        title={lateLabel}
        onClick={() => setUpdateLate(!late)}
      >
        <Icon name="clock" size={17} />
        <span className="u-visually-hidden">{lateLabel}</span>
      </button>
    </div>
  );
}

export default CohortPicker;
