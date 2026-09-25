/**
 * The prototype's own pages — the hub, and the showroom behind it.
 *
 * Declared here rather than in `prototype.config.ts` because these are not
 * product flows: they have no sprint, no concepts and no status. The hub's
 * navigation, its showroom cards and the slide-out panel all read from this
 * list, so adding a page is one entry here plus its route.
 *
 * Pages marked `showroom` exist only where the showroom is built (see
 * `lib/showroom.ts`). On the public production site they are left out of every
 * list, so nothing links to a page that 404s there.
 */
import { SHOWROOM_ENABLED } from "@/lib/showroom";

export type HubPageKey = "hub" | "showroom" | "design-system" | "components" | "playground";

export interface HubPage {
  key: HubPageKey;
  href: string;
  /** Short label, for navigation. */
  label: string;
  /** Full page title. */
  title: string;
  description: string;
  /** Locks the viewport toggle to web width, as `webOnly` does for a flow. */
  webOnly?: boolean;
  /** Part of the private showroom, so never built on the production site. */
  showroom?: boolean;
}

const ALL_HUB_PAGES: readonly HubPage[] = [
  {
    key: "hub",
    href: "/",
    label: "File hub",
    title: "File hub",
    webOnly: true,
    description:
      "Every flow and concept page in the prototype, with its status and its interaction spec.",
  },
  {
    key: "showroom",
    href: "/showroom",
    label: "Showroom",
    title: "Showroom",
    webOnly: true,
    showroom: true,
    description:
      "The private workspace for designing ExecHQ: the design system, every component in every state, and a playground for stepping through flows.",
  },
  {
    key: "design-system",
    href: "/showroom/design-system",
    label: "Design system",
    title: "Design system",
    webOnly: true,
    showroom: true,
    description:
      "Colour, type, spacing, surfaces, radii, shadows and borders, with the real buttons and form fields. Read from styles/tokens.css.",
  },
  {
    key: "components",
    href: "/showroom/components",
    label: "Component catalogue",
    title: "Component catalogue",
    webOnly: true,
    showroom: true,
    description:
      "Every component, in every state, imported from /components. Searchable and filterable by status and flow.",
  },
  {
    key: "playground",
    href: "/showroom/playground",
    label: "Playground",
    title: "Playground",
    webOnly: true,
    showroom: true,
    description:
      "Step through each built flow on sample data and watch the screens change. No account and no real data.",
  },
];

/** Every page that exists in this build, in navigation order. */
export const HUB_PAGES: readonly HubPage[] = ALL_HUB_PAGES.filter(
  (page) => SHOWROOM_ENABLED || !page.showroom
);

/** The showroom's three rooms — everything in it except its own front page.
 *  Empty on the production site. */
export const SHOWROOM_ROOMS: readonly HubPage[] = HUB_PAGES.filter(
  (page) => page.showroom && page.key !== "showroom"
);

/** The hub page a pathname belongs to, if any. */
export function getHubPageByPath(pathname: string): HubPage | undefined {
  return HUB_PAGES.find((page) => page.href === pathname);
}

export function getHubPage(key: HubPageKey): HubPage {
  const page = ALL_HUB_PAGES.find((item) => item.key === key);
  if (!page) throw new Error(`Unknown hub page: ${key}`);
  return page;
}
