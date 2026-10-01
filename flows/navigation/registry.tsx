import type { ReactElement } from "react";
import { ConciergeHeaderCentre, ConciergeNav } from "./concept-1";
import type { NavConceptProps } from "./types";

/** Where in the chrome a navigation concept can draw. */
export type NavPart = "nav" | "headerStart" | "headerCentre" | "headerEnd";

/**
 * A built navigation concept: what it draws in each part of the chrome.
 *
 * - `nav`         — the navigation itself, in the chrome's nav slot, before
 *                   `main` in the DOM.
 * - `headerStart` — before the wordmark, e.g. a menu button.
 * - `headerCentre` — the middle of the header, e.g. the Concierge's pill.
 * - `headerEnd`   — at the right of the header, e.g. a profile icon.
 *
 * Each is a render function rather than a component looked up and rendered by
 * the caller, which would count as creating a component during render and
 * remount the nav every time (see `flows/registry.tsx`).
 */
export type BuiltNav = Partial<Record<NavPart, (props: NavConceptProps) => ReactElement | null>>;

/**
 * Navigation concepts that have been built, by concept slug. A concept not
 * listed here is not built yet, and the signed-in pages show the baseline
 * navigation in `components/layout/AppNav` in its place.
 */
const BUILT_NAVS: Record<string, BuiltNav> = {
  "concept-1": {
    nav: (props) => <ConciergeNav {...props} />,
    headerCentre: (props) => <ConciergeHeaderCentre {...props} />,
  },
};

export function isNavBuilt(conceptSlug: string): boolean {
  return conceptSlug in BUILT_NAVS;
}

/** What a built concept draws in one part, or `undefined` if the concept is
 *  not built. `null` means built, with nothing in that part. */
export function renderBuiltNav(
  conceptSlug: string,
  part: NavPart,
  props: NavConceptProps
): ReactElement | null | undefined {
  const built = BUILT_NAVS[conceptSlug];
  if (!built) return undefined;
  return built[part]?.(props) ?? null;
}
