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
  /** The standing privacy line in the chrome footer. Defaults to shown. Turned
   *  off for Onboarding, where a dedicated privacy screen makes the same promise
   *  properly and a permanent footer repeating it in small type weakens it. */
  privacyFooter?: boolean;
  /** The chrome header carrying the wordmark. Defaults to shown. Turned off for
   *  Onboarding, whose first screen carries the wordmark itself; a header
   *  repeating it on every later step would only take room from the question. */
  header?: boolean;
  /** One line shown under the flow in the hub. */
  description: string;
  /** What a signed-in destination shows until its sprint designs it: a
   *  heading and one line in product voice, so the navigation can be
   *  reviewed against pages that look intentional without committing that
   *  sprint to a layout. Only for `app` flows. */
  stub?: { heading: string; body: string };
  /** For the navigation flow: the page each navigation concept is reviewed
   *  on. By decision on 2026-09-28, all three wrap one homepage concept. */
  navCanvas?: { flowSlug: string; conceptSlug: string };
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
      privacyFooter: false,
      header: false,
      description:
        "The first ninety seconds: privacy promise, career direction, plan selection and one usable artifact — one continuous sequence, never a setup tool.",
      concepts: [
        {
          slug: "concept-3",
          title: "Concept 3 — Guided",
          summary:
            "Explains as it goes: what ExecHQ is, why each thing is asked, and what a plan is. Asks what decides the plan first, recommends once, then asks what makes it hers.",
        },
      ],
    },
    {
      slug: "login",
      title: "Login",
      sprint: 2,
      chrome: "minimal",
      header: false,
      privacyFooter: false,
      description:
        "Returning to a private account. Personal email only; no employer visible anywhere.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1 — Open page",
          status: "approved",
          summary:
            "A quiet white page: an emailed link or a code to sign in, Google and Apple beside it, and help when the inbox is out of reach.",
        },
      ],
    },
    {
      slug: "navigation",
      title: "Navigation patterns",
      sprint: 2,
      chrome: "app",
      description:
        "How the signed-in app is structured and moved through on web, tablet and mobile. Each concept is reviewed on the homepage.",
      navCanvas: { flowSlug: "homepage", conceptSlug: "concept-1" },
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1 — Concierge",
          status: "approved",
          summary:
            "The onboarding advisor on every page: one box to go anywhere, log what happened, get ready, or talk it through.",
        },
      ],
    },
    {
      slug: "homepage",
      title: "Homepage",
      sprint: 2,
      chrome: "app",
      privacyFooter: false,
      description:
        "The signed-in landing surface: current direction, what to do next, and the way into the Plan, Toolbox and Briefing.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1 — Rings",
          summary:
            "Task forward: three rings for the actions Maya has accepted, and the one action that fills the next segment.",
        },
        {
          slug: "concept-2",
          title: "Concept 2 — Stay on track",
          summary:
            "Day forward: today’s Briefing, then Maya’s next step, then everything waiting on her word, then what her LinkedIn and website say.",
        },
        {
          slug: "concept-3",
          title: "Concept 3 — Plan",
          summary:
            "Plan forward: the roadmap as a table of contents, the current stage opened up with what it asks now, and the next step.",
        },
        {
          slug: "concept-4",
          title: "Concept 4 — Combined",
          summary:
            "The three together: a map of three rings, what is in progress, today’s Briefing, and Your Signal Picture.",
        },
      ],
    },
    {
      slug: "profile",
      title: "Profile",
      sprint: 2,
      chrome: "app",
      privacyFooter: false,
      description:
        "Direction, signal background, connections and settings — all optional, none of it a completion gate.",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1 — Grouped",
          status: "approved",
          summary:
            "Profile and settings on one page: labelled groups of rows, each ending in its current value. Details open in a sheet on mobile and tablet, beside the list on web.",
        },
      ],
    },
    {
      slug: "plan",
      title: "Plan",
      sprint: 3,
      chrome: "app",
      description:
        "Roadmap, action steps and plan progress in one place. Factual, never a score.",
      stub: {
        heading: "Your plan",
        body: "Where your plan will live: the road ahead, what\u2019s next on it, and what you\u2019ve done so far.",
      },
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1 — Steps forward",
          summary:
            "Action steps lead: the five live steps by horizon, then the Signal Picture and Momentum. The roadmap is one step away.",
        },
        {
          slug: "concept-2",
          title: "Concept 2 — Road forward",
          summary:
            "The roadmap leads: where she is on it and what finishing the stage looks like, with that stage’s action steps opened up beneath.",
        },
        {
          slug: "concept-3",
          title: "Concept 3 — Record forward",
          summary:
            "What changed leads: the narrative and the Signal Picture, ending in one next move that opens the matching action step.",
        },
        {
          slug: "templates",
          title: "All five plans",
          summary:
            "Reference, not a concept: the roadmap of every plan template, stage by stage, to review the wording in one place.",
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
      stub: {
        heading: "Toolbox",
        body: "Where you\u2019ll make your next draft: a pitch, a brief, a post or your positioning.",
      },
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
      stub: {
        heading: "Briefing",
        body: "Where your daily read will live: three things worth your time, and why each one matters.",
      },
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
