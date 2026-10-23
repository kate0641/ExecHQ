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
  /** Set aside, not chosen. It still opens, and the hub labels it
   *  "Scratched" in place of its status, until it is moved to the `scratch`
   *  branch and removed from `main`. Only Kate scratches a concept. */
  scratched?: boolean;
  /** Kept for a later version, not chosen and not scratched: the hub labels
   *  it "Saved for V2" (or whichever version) in place of its status, and it
   *  stays on `main`. Only Kate sets it. */
  savedFor?: string;
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
  /** The chrome header carrying the wordmark. Defaults to shown. Turned off for
   *  Onboarding, whose first screen carries the wordmark itself; a header
   *  repeating it on every later step would only take room from the question. */
  header?: boolean;
  /** The navigation item this flow sits under, when it is not one itself:
   *  the Playbook flow is reached from the Playbook, so the navigation says
   *  Playbook while she is in a tool. */
  navAs?: string;
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
   *  list of `app` flows — Playbook artifact flow is a sub-flow, not a tab. */
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
      header: false,
      description:
        "The first ninety seconds: privacy promise, career direction, plan selection and one usable artifact — one continuous sequence, never a setup tool.",
      concepts: [
        {
          slug: "concept-3",
          title: "Concept 3 — Guided",
          status: "approved",
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
      navCanvas: { flowSlug: "homepage", conceptSlug: "concept-4" },
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
      description:
        "The signed-in landing surface: current direction, what to do next, and the way into the Plan, Playbook and Briefing.",
      concepts: [
        {
          slug: "concept-4",
          title: "Concept 4 — Combined",
          status: "approved",
          summary:
            "A map of three rings with the next step under it, Stay on track, today’s Briefing, and Your Signal Picture.",
        },
      ],
    },
    {
      slug: "profile",
      title: "Profile",
      sprint: 2,
      chrome: "app",
      description:
        "Direction, signal background and settings — all optional, none of it a completion gate.",
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
          slug: "concept-3",
          title: "Concept 3 — Guided check-in",
          status: "approved",
          summary:
            "A guided check-in, built from onboarding’s page and answer drawer: one move at a time, with where she is with it as the answer. Answering changes her plan and comes back as a short reply. Under the move is the roadmap, a stack of stage cards, which shows when she folds the drawer; adding her own items slides up as a sheet.",
        },
      ],
    },
    {
      slug: "signals",
      title: "Signal Picture",
      sprint: 3,
      chrome: "app",
      description:
        "The home of the Signal Picture and Momentum: what she has put out there, where she started beside where she is now, and how her follow-through is going. Factual, never a score.",
      stub: {
        heading: "Your Signal Picture",
        body: "Where your Signal Picture and Momentum will live.",
      },
      concepts: [
        {
          slug: "concept-2",
          title: "Concept 2 — Momentum first",
          status: "approved",
          summary:
            "This week leads as seven day circles, then what came of the things she did, then where she started.",
        },
      ],
    },
    {
      slug: "playbook",
      title: "Playbook",
      sprint: 4,
      chrome: "app",
      description:
        "The four pilot workflows: Positioning Builder, Pitch Builder, Situation Brief, Thought Leadership Builder.",
      stub: {
        heading: "Playbook",
        body: "Where you\u2019ll make your next draft: a pitch, a brief, a post or your positioning.",
      },
      concepts: [
        {
          slug: "concept-2",
          title: "Concept 2 — Starter row",
          status: "approved",
          summary:
            "The tools as one row of four icons, then Next on your plan as one row; the library as four folders, one per tool, each opening to its list. Which tool do I need? is the advisor’s first prompt on the Playbook. Tools open as a document workspace.",
        },
      ],
    },
    {
      slug: "playbook-flow",
      title: "Playbook artifact flow",
      sprint: 4,
      chrome: "app",
      navAs: "playbook",
      description:
        "Producing an artifact end to end: gather context, generate an editable draft, revise, export, and enter the Loop.",
      concepts: [
        {
          slug: "concept-3",
          title: "Concept 3 — Interview",
          status: "approved",
          summary: "One question a screen with the draft pinned above as a card; side by side on desktop.",
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
          slug: "concept-2",
          title: "Concept 2 — News app",
          status: "approved",
          summary:
            "A front page like a news app: the lead story with a big picture, two rows with small ones, each saying why it is here. A story opens the whole article in ExecHQ, with ExecHQ’s notes on highlighted passages all the way through, and a bar at the foot: Back, Relevant, Not for me, Save, Write a post.",
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
          title: "Concept 1 — The four measures",
          summary:
            "The dashboard is four cards, each a measure of how the cohort is doing: Putting it into practice leads, then Staying with it, Showing up in the world and Getting started. Each opens with a one-sentence answer, with the figures under it. The cohort's code and settings are a Cohort page of their own.",
        },
        {
          slug: "concept-2",
          title: "Concept 2 — The report",
          // Kate, 2026-10-22: Concept 1 chosen; to move to scratch later.
          scratched: true,
          summary:
            "The screen is the one-page report the sponsor exports: figures set in sentences, each definition in the margin beside it. Setting up the cohort writes the report's header; the code sits in a box in the margin.",
        },
        {
          slug: "concept-3",
          title: "Concept 3 — The weekly letter (wildcard)",
          // Kate, 2026-10-21: to go with the dashboard concept chosen, in V2.
          savedFor: "V2",
          summary:
            "Saved for V2, to go alongside whichever dashboard concept is chosen. No dashboard: each Monday an issue in the advisor's voice, leading with follow-through, and past issues stack into an archive. Setting up the cohort is Issue 0.",
        },
      ],
    },
    {
      slug: "sponsor-profile",
      title: "Sponsor profile",
      sprint: 5,
      chrome: "enterprise",
      webOnly: true,
      description:
        "The sponsor's own account, opened from the initials in the dashboard's header. No brief: plain and practical (Kate, 2026-10-22).",
      concepts: [
        {
          slug: "concept-1",
          title: "Concept 1 — One page",
          summary:
            "Settings rows in four groups on one page: You, Your cohort, What you can see and Signing in. One Edit changes the name and job title; the cohort's details are shown, not edited. Sign out is a button at the foot.",
        },
      ],
    },
  ],

  appNav: [
    { flowSlug: "homepage", label: "Home" },
    { flowSlug: "plan", label: "Plan" },
    { flowSlug: "signals", label: "Signals" },
    { flowSlug: "playbook", label: "Playbook" },
    { flowSlug: "daily-briefing", label: "Briefing" },
    { flowSlug: "profile", label: "Profile" },
  ],

  // Empty: each enterprise concept draws its own navigation, because they
  // differ (Concept 1 has Overview and Cohort; the report and the letter have
  // none), and a shared link could only ever point at the first concept.
  enterpriseNav: [],
};

export default prototypeConfig;
