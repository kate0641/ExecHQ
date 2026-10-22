import { cohortCsv, csvFileName, type Cohort, type Period } from "@/mock/enterprise";

/** Hands the sponsor the figures on screen as a CSV file. Made in the page:
 *  nothing is sent anywhere. `signals` for Concept 1, which shows them. */
export function downloadCsv(cohort: Cohort, window: Period, options: { signals?: boolean } = {}) {
  const url = URL.createObjectURL(new Blob([cohortCsv(cohort, window, options)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = csvFileName(cohort, window);
  link.click();
  URL.revokeObjectURL(url);
}
