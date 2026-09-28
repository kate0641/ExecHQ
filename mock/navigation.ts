/**
 * Words the navigation concepts use, so designers can change them without
 * touching how the concepts work.
 */

/** Concept 3, the Drawer. */
export const DRAWER_COPY = {
  closeToPage: "Close the menu and go back to the page",
  widen: "Widen the menu",
  fold: "Fold the menu to a rail",
  /** The line under each destination: what is waiting there. Each is given
   *  the facts it needs and says only those. */
  lines: {
    homeDue: (name: string) => `A question about ${name}`,
    homeNext: (step: string) => `Next: ${step}`,
    plan: (planName: string, week: number, weeks: number) =>
      `${planName} · Week ${week} of ${weeks}`,
    toolboxOpen: (title: string) => `Open: ${title}`,
    toolbox: "Four ways to make your next draft",
    briefing: (weekday: string) => `Three reads for ${weekday}`,
  },
} as const;
