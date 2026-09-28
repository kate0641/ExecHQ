import type { ReactElement } from "react";
import type { NavConceptProps } from "./types";

/**
 * Navigation concepts that have been built, by concept slug.
 *
 * Each entry renders its concept with the page's destinations and current
 * flow: `"concept-1": (props) => <NavConcept1 {...props} />`. A render
 * function rather than a component looked up and rendered by the caller,
 * which would count as creating a component during render and remount the
 * nav every time (see `flows/registry.tsx`).
 *
 * A concept not listed here is not built yet, and the signed-in pages show the
 * baseline navigation in `components/layout/AppNav` in its place.
 */
const BUILT_NAVS: Record<string, (props: NavConceptProps) => ReactElement> = {};

export function isNavBuilt(conceptSlug: string): boolean {
  return conceptSlug in BUILT_NAVS;
}

export function renderBuiltNav(
  conceptSlug: string,
  props: NavConceptProps
): ReactElement | undefined {
  return BUILT_NAVS[conceptSlug]?.(props);
}
