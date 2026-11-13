"use client";

import { useEffect, useState } from "react";
import type { CohortDetails } from "@/components/enterprise/CohortForm";
import { useCohortId, useUpdateLate } from "@/lib/cohort-store";
import { COHORT_IDS, COHORTS, lateCohort, makeCode, newCohort, type Cohort, type CohortId } from "@/mock/enterprise";

/** `?cohort=` and `?late=1`, read once after mount. */
function useUrlChoice(): { cohort?: CohortId; late?: boolean } {
  const [choice, setChoice] = useState<{ cohort?: CohortId; late?: boolean }>({});
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const cohort = query.get("cohort");
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after mount */
    setChoice({
      cohort: (COHORT_IDS as readonly string[]).includes(cohort ?? "") ? (cohort as CohortId) : undefined,
      late: query.get("late") === "1" ? true : undefined,
    });
  }, []);
  return choice;
}

/**
 * The cohort the admin pages show: the dock's pick, unless the page was
 * opened with `?cohort=`, so the playground can show
 * each cohort side by side. The dock's pick is one per browser.
 */
export function useShownCohortId(): CohortId {
  const picked = useCohortId();
  return useUrlChoice().cohort ?? picked;
}

export interface CohortControls {
  /** Undefined until the sponsor has set one up. Last week's figures while
   *  this Monday's update is late (`cohort.lateSince`). */
  cohort?: Cohort;
  /** The cohort was set up on this visit, from the form. */
  justCreated: boolean;
  justRegenerated: boolean;
  create: (details: CohortDetails) => void;
  regenerate: () => void;
  close: () => void;
}

/**
 * The cohort a concept shows, with what the reviewer does to it on the page:
 * setting one up, making a new code, closing it. Changes last until the
 * reviewer picks another cohort in the dock; mount the page with the cohort
 * id as its key so a new pick starts clean. The dock's Update late switch
 * swaps in last week's figures wherever there was a last week, as does
 * `?late=1`.
 */
export function useCohort(id: CohortId): CohortControls {
  const [cohort, setCohort] = useState<Cohort | undefined>(id === "none" ? undefined : COHORTS[id]);
  const [justCreated, setJustCreated] = useState(false);
  const [justRegenerated, setJustRegenerated] = useState(false);
  // A new pick, or `?cohort=` read after mount, starts clean.
  const [shownId, setShownId] = useState(id);
  if (shownId !== id) {
    setShownId(id);
    setCohort(id === "none" ? undefined : COHORTS[id]);
    setJustCreated(false);
    setJustRegenerated(false);
  }
  const urlLate = useUrlChoice().late;
  const pickedLate = useUpdateLate();
  const late = urlLate ?? pickedLate;
  const shown = late && cohort ? (lateCohort(cohort) ?? cohort) : cohort;

  return {
    cohort: shown,
    justCreated,
    justRegenerated,
    create: (details) => {
      setCohort(newCohort(details, makeCode()));
      setJustCreated(true);
    },
    regenerate: () => {
      setCohort((current) => current && { ...current, code: makeCode() });
      setJustRegenerated(true);
    },
    close: () => {
      setCohort((current) => current && { ...current, open: false });
      setJustRegenerated(false);
    },
  };
}
