/**
 * ExecHQ prototype — the manifest.
 *
 * This is the single source of truth. The file hub, the slide-out hub panel, the
 * navigation chrome and every route are generated from it.
 *
 * Adding a concept page is ONE entry in THIS file. If adding a page ever means
 * editing a route, a nav item and a hub link separately, the plumbing is broken.
 *
 * Status is changed by Kate only, and only when she says a page has passed final
 * review. Never promote a status on your own initiative.
 */

/** Review state of a concept page. Component status is tracked separately, in
 *  each component's `*.states.ts` file, because one component may appear across
 *  several flows at different stages. */
export type Status = "draft" | "in-review" | "approved";

/** Which navigation chrome a flow's pages render.
 *  - `minimal`    — logo and step context only (Onboarding, Login)
 *  - `app`        — the signed-in app chrome: top nav on web, tab bar on mobile
 *  - `enterprise` — the separate enterprise surface (web only) */
export type NavChrome = "minimal" | "app" | "enterprise";

export interface Concept {
  /** URL segment. Explicit, never derived from the title. */
  slug: string;
  title: string;
  /** Defaults to "draft" when omitted. Read via `conceptStatus()`. */
  status?: Status;
  /** One line shown under the concept in the hub. */
  summary?: string;
}

export interface Flow {
  /** URL segment. Explicit, so titles can change without breaking routes. */
  slug: string;
  title: string;
  /** Drives the "Not yet built — Sprint N" placeholder text. */
  sprint: number;
  chrome: NavChrome;
  /** Locks the viewport toggle to web width and disables Mobile and Tablet. */
  webOnly?: boolean;
  /** One line shown under the flow in the hub. */
  description: string;
  concepts: Concept[];
}

/** An entry in the signed-in app navigation. `flowSlug` must match a flow. */
export interface NavItem {
  flowSlug: string;
  label: string;
}

export interface PrototypeConfig {
  flows: Flow[];
  /** Primary destinations in the `app` chrome. Deliberately shorter than the
   *  list of `app` flows — Toolbox artifact flow is a sub-flow, not a tab. */
  appNav: NavItem[];
  /** Destinations in the `enterprise` chrome. */
  enterpriseNav: NavItem[];
}

export const prototypeConfig: PrototypeConfig = {
  flows: [
    {
      slug: "onboarding",
      title: "Onboarding",
      sprint: 1,
      chrome: "minimal",
      description:
        "The first ninety seconds: privacy promise, career direction, plan selection and one usable artifact — one continuous sequence, never a setup tool.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1 — Paged wizard",
          summary:
            "One decision per screen, explicit progress, nothing below the fold. The baseline.",
        },
        {
          slug: "concept-2",
          title: "Concept 2",
          summary: "Not yet briefed.",
        },
        {
          slug: "concept-3",
          title: "Concept 3",
          summary: "Not yet briefed.",
        },
      ],
    },
    {
      slug: "login",
      title: "Login",
      sprint: 2,
      chrome: "minimal",
      description:
        "Returning to a private account. Personal email only; no employer visible anywhere.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Sign in and account recovery.",
        },
      ],
    },
    {
      slug: "navigation",
      title: "Navigation patterns",
      sprint: 2,
      chrome: "app",
      description:
        "How the signed-in app is structured and moved through on web, tablet and mobile.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Primary navigation model.",
        },
      ],
    },
    {
      slug: "homepage",
      title: "Homepage",
      sprint: 2,
      chrome: "app",
      description:
        "The signed-in landing surface: current direction, what to do next, and the way into the Plan, Toolbox and Briefing.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Signed-in home.",
        },
      ],
    },
    {
      slug: "profile",
      title: "Profile",
      sprint: 2,
      chrome: "app",
      description:
        "Direction, signal background, connections and settings — all optional, none of it a completion gate.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Profile and settings.",
        },
      ],
    },
    {
      slug: "plan",
      title: "Plan",
      sprint: 3,
      chrome: "app",
      description:
        "Roadmap, Active Landscape and plan progress in one place. Factual, never a score.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Roadmap and Active Landscape.",
        },
      ],
    },
    {
      slug: "toolbox",
      title: "Toolbox",
      sprint: 4,
      chrome: "app",
      description:
        "The four pilot workflows: Positioning Builder, Pitch Builder, Situation Brief, Thought Leadership Builder.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Toolbox index.",
        },
      ],
    },
    {
      slug: "toolbox-flow",
      title: "Toolbox artifact flow",
      sprint: 4,
      chrome: "app",
      description:
        "Producing an artifact end to end: gather context, generate an editable draft, revise, export, and enter the Loop.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Draft, revise, export, record outcome.",
        },
      ],
    },
    {
      slug: "daily-briefing",
      title: "Daily Briefing",
      sprint: 4,
      chrome: "app",
      description:
        "A standalone daily read: three curated items, why each matters, and an optional route into Thought Leadership Builder.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Three reads worth your time.",
        },
      ],
    },
    {
      slug: "enterprise",
      title: "Enterprise Dashboard",
      sprint: 5,
      chrome: "enterprise",
      webOnly: true,
      description:
        "The enterprise surface. Cohort level only, never individual identity. Web only.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1",
          summary: "Cohort view.",
        },
      ],
    },
  ],

  appNav: [
    { flowSlug: "homepage", label: "Home" },
    { flowSlug: "plan", label: "Plan" },
    { flowSlug: "toolbox", label: "Toolbox" },
    { flowSlug: "daily-briefing", label: "Briefing" },
    { flowSlug: "profile", label: "Profile" },
  ],

  enterpriseNav: [{ flowSlug: "enterprise", label: "Overview" }],
};

export default prototypeConfig;
