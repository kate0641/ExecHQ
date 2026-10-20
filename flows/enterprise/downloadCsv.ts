import { cohortCsv, csvFileName, type Cohort, type WindowId } from "@/mock/enterprise";

/** Hands the sponsor the figures on screen as a CSV file. Made in the page:
 *  nothing is sent anywhere. */
export function downloadCsv(cohort: Cohort, window: WindowId) {
  const url = URL.createObjectURL(new Blob([cohortCsv(cohort, window)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = csvFileName(cohort);
  link.click();
  URL.revokeObjectURL(url);
}
