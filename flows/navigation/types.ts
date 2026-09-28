/** One destination in the signed-in navigation, resolved from the manifest's
 *  `appNav`: Home, Plan, Toolbox, Briefing, Profile. */
export interface NavDestination {
  label: string;
  href: string;
  flowSlug: string;
}

/**
 * What every navigation concept is given. A concept renders its own pattern
 * for all three breakpoints, written against `data-viewport` (never `@media`),
 * and must keep every destination reachable on each of them.
 *
 * It renders inside the chrome, before `main` in the DOM, so reading order
 * stays navigation then content wherever it sits visually. Its wrapper carries
 * `data-nav-concept="<slug>"`, so a concept that needs a different layout (a
 * side rail, say) can restructure the chrome from its own CSS with
 * `.chrome:has(> [data-nav-concept="concept-2"])`.
 */
export interface NavConceptProps {
  destinations: NavDestination[];
  /** The flow the page belongs to; its destination is the current one. */
  currentFlow: string;
  /** The nav landmark's accessible name. */
  label: string;
}
