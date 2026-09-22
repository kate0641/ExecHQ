/**
 * The prototype's own pages — the hub and the reference tools it links to.
 *
 * Declared here rather than in `prototype.config.ts` because these are not
 * product flows: they have no sprint, no concepts and no status. The hub's
 * navigation, its tool cards and the slide-out panel all read from this list, so
 * adding a tool page is one entry here plus its route.
 */
export type HubPageKey = "hub" | "catalogue" | "stylesheet";

export interface HubPage {
  key: HubPageKey;
  href: string;
  /** Short label, for navigation. */
  label: string;
  /** Full page title. */
  title: string;
  description: string;
}

export const HUB_PAGES: readonly HubPage[] = [
  {
    key: "hub",
    href: "/",
    label: "File hub",
    title: "File hub",
    description:
      "Every flow and concept page in the prototype, with its status and its interaction spec.",
  },
  {
    key: "catalogue",
    href: "/catalogue",
    label: "Component catalogue",
    title: "Component catalogue",
    description:
      "Every component, in every state, imported from /components. Searchable and filterable by status and flow.",
  },
  {
    key: "stylesheet",
    href: "/stylesheet",
    label: "Stylesheet",
    title: "Stylesheet",
    description:
      "The design system rendered: colour tokens, the type scale in all three fonts, spacing, radii, shadows and borders.",
  },
];

/** The reference tools — everything except the hub itself. */
export const HUB_TOOLS: readonly HubPage[] = HUB_PAGES.filter(
  (page) => page.key !== "hub"
);

export function getHubPage(key: HubPageKey): HubPage {
  const page = HUB_PAGES.find((item) => item.key === key);
  if (!page) throw new Error(`Unknown hub page: ${key}`);
  return page;
}
