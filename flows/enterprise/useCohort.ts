"use client";

import { useState } from "react";
import type { CohortDetails } from "@/components/enterprise/CohortForm";
import { useUpdateLate } from "@/lib/cohort-store";
import { COHORTS, lateCohort, makeCode, newCohort, type Cohort, type CohortId } from "@/mock/enterprise";

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
 * swaps in last week's figures wherever there was a last week.
 */
export function useCohort(id: CohortId): CohortControls {
  const [cohort, setCohort] = useState<Cohort | undefined>(id === "none" ? undefined : COHORTS[id]);
  const [justCreated, setJustCreated] = useState(false);
  const [justRegenerated, setJustRegenerated] = useState(false);
  const late = useUpdateLate();
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
