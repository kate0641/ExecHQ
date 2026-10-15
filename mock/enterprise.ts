/**
 * The enterprise dashboard's data: the cohorts a reviewer can switch between,
 * the Tier 1 figures, and every word the sponsor reads (Sprint 5).
 *
 * The sponsor is Northgate, the same organization Maya's account came through
 * (`mock/account.ts`), and the pilot is her cohort: it opened on 14 September,
 * the day she joined, with the code from `mock/onboarding.ts`. Its figures are
 * the pilot at week 2, before any of the homepage states.
 *
 * Nothing here is ever about one person. A cohort holds totals only, and the
 * dashboard shows none of them until enough participants are active
 * (`MIN_COHORT_SIZE`). Tier 2 (development activity) is left out for now, by
 * decision on 2026-10-15.
 */

/** No figure is shown for fewer active participants than this. Proposed in the
 *  brief; used everywhere until it is confirmed. */
export const MIN_COHORT_SIZE = 10;

/* -----------------------------------------------------------------------------
   WINDOWS
   -------------------------------------------------------------------------- */

/** No window shorter than 30 days, so one person's week cannot move a figure. */
export const WINDOW_IDS = ["30d", "90d", "launch"] as const;
export type WindowId = (typeof WINDOW_IDS)[number];

export const WINDOWS: Record<WindowId, { label: string; long: string; days?: number }> = {
  "30d": { label: "30 days", long: "the last 30 days", days: 30 },
  "90d": { label: "90 days", long: "the last 90 days", days: 90 },
  launch: { label: "Since launch", long: "since the program started" },
};

/* -----------------------------------------------------------------------------
   COHORTS
   -------------------------------------------------------------------------- */

export const COHORT_IDS = ["none", "small", "pilot", "demo"] as const;
export type CohortId = (typeof COHORT_IDS)[number];

/** Totals for one window. Joining, onboarding and plans are counted since
 *  launch in every window: a person joins once. */
export interface CohortCounts {
  /** Signed in and took at least one action in the window. */
  active: number;
  /** Came back in a later week after their first. */
  returning: number;
  /** Planned actions accepted in the window, and how many were completed
   *  within 30 days. Declined and deferred actions are not in the base. */
  actionsAccepted: number;
  actionsCompleted: number;
  /** Artifacts made, how many were marked used, and how many of those have
   *  an outcome recorded. */
  artifacts: number;
  artifactsUsed: number;
  outcomesRecorded: number;
  /** Active participants who opened the Briefing at least once a week. */
  briefingWeekly: number;
}

export interface Cohort {
  id: Exclude<CohortId, "none">;
  name: string;
  expectedSize: number;
  startsOn: string;
  endsOn: string;
  /** The Monday the figures were last refreshed. */
  asOf: string;
  code: string;
  /** Still taking new joiners. */
  open: boolean;
  /** Codes redeemed: accounts made with the code. */
  joined: number;
  /** Joined and reached a first editable artifact. */
  activated: number;
  /** Activated with an accepted plan. */
  planAccepted: number;
  byWindow: Record<WindowId, CohortCounts>;
}

const PILOT_WEEK_2: CohortCounts = {
  active: 29,
  returning: 17,
  actionsAccepted: 74,
  actionsCompleted: 31,
  artifacts: 58,
  artifactsUsed: 19,
  outcomesRecorded: 7,
  briefingWeekly: 22,
};

const SMALL_WEEK_1: CohortCounts = {
  active: 4,
  returning: 0,
  actionsAccepted: 9,
  actionsCompleted: 2,
  artifacts: 6,
  artifactsUsed: 1,
  outcomesRecorded: 0,
  briefingWeekly: 3,
};

const DEMO_SINCE_LAUNCH: CohortCounts = {
  active: 781,
  returning: 690,
  actionsAccepted: 5820,
  actionsCompleted: 3317,
  artifacts: 3950,
  artifactsUsed: 1580,
  outcomesRecorded: 711,
  briefingWeekly: 529,
};

export const COHORTS: Record<Cohort["id"], Cohort> = {
  /** Below the minimum: only invites and codes redeemed show. */
  small: {
    id: "small",
    name: "Northgate Board Readiness",
    expectedSize: 12,
    startsOn: "2026-09-21",
    endsOn: "2026-12-18",
    asOf: "2026-09-28",
    code: "EXEC-7390",
    open: true,
    joined: 6,
    activated: 5,
    planAccepted: 4,
    byWindow: { "30d": SMALL_WEEK_1, "90d": SMALL_WEEK_1, launch: SMALL_WEEK_1 },
  },
  /** Maya's cohort, at week 2: every figure shows, and the 30 and 90-day
   *  ones are still filling in. */
  pilot: {
    id: "pilot",
    name: "Northgate Leadership Programme",
    expectedSize: 50,
    startsOn: "2026-09-14",
    endsOn: "2026-12-18",
    asOf: "2026-09-28",
    code: "EXEC-4821",
    open: true,
    joined: 38,
    activated: 33,
    planAccepted: 26,
    byWindow: { "30d": PILOT_WEEK_2, "90d": PILOT_WEEK_2, launch: PILOT_WEEK_2 },
  },
  /** The December partner meeting: 1,000 at day 90, so 90 days and since
   *  launch are the same, and 30 days is the last month alone. */
  demo: {
    id: "demo",
    name: "Northgate Senior Leaders",
    expectedSize: 1000,
    startsOn: "2026-09-08",
    endsOn: "2027-03-12",
    asOf: "2026-12-07",
    code: "EXEC-1155",
    open: false,
    joined: 912,
    activated: 846,
    planAccepted: 701,
    byWindow: {
      "30d": {
        active: 588,
        returning: 512,
        actionsAccepted: 2140,
        actionsCompleted: 1262,
        artifacts: 1384,
        artifactsUsed: 590,
        outcomesRecorded: 236,
        briefingWeekly: 401,
      },
      "90d": DEMO_SINCE_LAUNCH,
      launch: DEMO_SINCE_LAUNCH,
    },
  },
};

/** The reviewer's choices in the dock, in order: no cohort yet, then the
 *  three from the brief. */
export const COHORT_CHOICES: Record<CohortId, { label: string; glyph: string; summary: string }> = {
  none: { label: "No cohort yet", glyph: "+", summary: "A sponsor signing in for the first time." },
  small: { label: "6 participants", glyph: "6", summary: "Below the minimum: most figures are hidden." },
  pilot: { label: "Pilot of 50, week 2", glyph: "50", summary: "Every figure shows; 30 and 90 days are filling in." },
  demo: { label: "1,000 at day 90", glyph: "1k", summary: "The December demo." },
};

export const DEFAULT_COHORT: CohortId = "pilot";

/** How many days old the program was when the figures were refreshed. */
export function programDay(cohort: Cohort): number {
  const start = Date.parse(`${cohort.startsOn}T00:00:00Z`);
  const asOf = Date.parse(`${cohort.asOf}T00:00:00Z`);
  return Math.round((asOf - start) / 86_400_000);
}

/** Enough participants active in this window for any figure to show. */
export function isAboveMinimum(cohort: Cohort, window: WindowId): boolean {
  return cohort.byWindow[window].active >= MIN_COHORT_SIZE;
}

/* -----------------------------------------------------------------------------
   DATA POINTS
   -------------------------------------------------------------------------- */

/** The three questions the dashboard answers, in order. */
export const QUESTION_IDS = ["joined", "using", "following"] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

export const DATA_POINT_IDS = [
  "invites",
  "onboarding",
  "active",
  "returning",
  "briefing",
  "plans",
  "follow-through",
  "artifacts",
  "loop",
] as const;
export type DataPointId = (typeof DATA_POINT_IDS)[number];

export interface DataPoint {
  label: string;
  question: QuestionId;
  /** One sentence a talent lead can repeat to their own leadership. */
  definition: string;
  /** Where the number comes from, in the sponsor's words. */
  source: string;
  /** Counted since launch whatever window is chosen. */
  sinceLaunch?: boolean;
  /** Shown while the cohort is below the minimum: it is about the invite, not
   *  about what anyone does. */
  alwaysShown?: boolean;
}

export const DATA_POINTS: Record<DataPointId, DataPoint> = {
  invites: {
    label: "Joined",
    question: "joined",
    definition: "How many people made an account with your cohort’s code, against the size you expected.",
    source: "Codes redeemed. You see the count, never who.",
    sinceLaunch: true,
    alwaysShown: true,
  },
  onboarding: {
    label: "Set up",
    question: "joined",
    definition: "Of the people who joined, how many finished setting up and reached their first piece of work.",
    source: "The end of setup in ExecHQ.",
    sinceLaunch: true,
  },
  active: {
    label: "Active",
    question: "using",
    definition: "Of the people set up, how many signed in and did at least one thing in the window.",
    source: "Sign-ins and actions in ExecHQ.",
  },
  returning: {
    label: "Came back",
    question: "using",
    definition: "Of the people set up, how many came back in a later week after their first.",
    source: "Return visits to ExecHQ.",
  },
  briefing: {
    label: "Read the Briefing weekly",
    question: "using",
    definition: "Of the active participants, how many opened the Daily Briefing at least once a week.",
    source: "Opens of the Daily Briefing.",
  },
  plans: {
    label: "Chose a plan",
    question: "following",
    definition: "Of the people set up, how many accepted a development plan.",
    source: "Plans accepted in ExecHQ.",
    sinceLaunch: true,
  },
  "follow-through": {
    label: "Followed through",
    question: "following",
    definition:
      "Of the planned actions participants accepted, how many they completed within 30 days. Actions they declined or put off are not counted.",
    source: "Planned actions in ExecHQ.",
  },
  artifacts: {
    label: "Work made",
    question: "following",
    definition: "How many drafts, briefs and statements the cohort made in ExecHQ in the window.",
    source: "The Toolbox and its library.",
  },
  loop: {
    label: "Work used",
    question: "following",
    definition:
      "Of the work made, how much participants marked as used outside ExecHQ, and of that, how much has a result recorded.",
    source: "Work marked used, and results recorded, in ExecHQ.",
  },
};

/* -----------------------------------------------------------------------------
   FIGURES
   -------------------------------------------------------------------------- */

export type FigureState = "shown" | "filling" | "suppressed";

/** One data point, ready to draw. */
export interface FigureView {
  id: DataPointId;
  label: string;
  state: FigureState;
  /** The number, set large: "76%", "58". Absent when suppressed. */
  value?: string;
  /** What it is out of: "29 of 38 set up". */
  detail?: string;
  /** Why it is hidden, or how much of the window has passed. */
  note?: string;
}

const count = new Intl.NumberFormat("en-GB");

function share(part: number, whole: number): string {
  return whole === 0 ? "0%" : `${Math.round((part / whole) * 100)}%`;
}

/** A data point for one cohort and window: shown, filling in, or hidden. */
export function figureFor(cohort: Cohort, id: DataPointId, window: WindowId): FigureView {
  const point = DATA_POINTS[id];
  const label = point.label;

  if (!point.alwaysShown && !isAboveMinimum(cohort, window)) {
    return { id, label, state: "suppressed", note: ENTERPRISE_COPY.suppressed };
  }

  const c = cohort.byWindow[window];
  const values: Record<DataPointId, { value: string; detail: string }> = {
    invites: {
      value: count.format(cohort.joined),
      detail: `of ${count.format(cohort.expectedSize)} expected`,
    },
    onboarding: {
      value: share(cohort.activated, cohort.joined),
      detail: `${count.format(cohort.activated)} of ${count.format(cohort.joined)} who joined`,
    },
    active: {
      value: share(c.active, cohort.activated),
      detail: `${count.format(c.active)} of ${count.format(cohort.activated)} set up`,
    },
    returning: {
      value: share(c.returning, cohort.activated),
      detail: `${count.format(c.returning)} of ${count.format(cohort.activated)} set up`,
    },
    briefing: {
      value: share(c.briefingWeekly, c.active),
      detail: `${count.format(c.briefingWeekly)} of ${count.format(c.active)} active`,
    },
    plans: {
      value: share(cohort.planAccepted, cohort.activated),
      detail: `${count.format(cohort.planAccepted)} of ${count.format(cohort.activated)} set up`,
    },
    "follow-through": {
      value: share(c.actionsCompleted, c.actionsAccepted),
      detail: `${count.format(c.actionsCompleted)} of ${count.format(c.actionsAccepted)} accepted actions`,
    },
    artifacts: {
      value: count.format(c.artifacts),
      detail: "pieces of work",
    },
    loop: {
      value: share(c.artifactsUsed, c.artifacts),
      detail: `${count.format(c.artifactsUsed)} used, ${count.format(c.outcomesRecorded)} with a result`,
    },
  };

  const day = programDay(cohort);
  const days = WINDOWS[window].days;
  if (!point.sinceLaunch && days !== undefined && day < days) {
    return { id, label, state: "filling", ...values[id], note: ENTERPRISE_COPY.filling(day, days) };
  }
  return { id, label, state: "shown", ...values[id] };
}

/* -----------------------------------------------------------------------------
   COPY
   -------------------------------------------------------------------------- */

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatAsOf(iso: string): string {
  return dateFormat.format(new Date(`${iso}T00:00:00Z`));
}

export function formatDate(iso: string): string {
  return shortDate.format(new Date(`${iso}T00:00:00Z`));
}

export const ENTERPRISE_COPY = {
  sponsor: "Northgate",

  suppressed: `Hidden until ${MIN_COHORT_SIZE} or more participants are active. This protects individual privacy.`,
  hidden: "Hidden",
  filling: (day: number, days: number) =>
    `Filling in. The program is ${day} days old, so this covers ${day} of ${days} days.`,
  fillingTag: "Filling in",

  window: {
    label: "Window",
    refreshed: (asOf: string) => `Updated weekly, on Mondays. Last updated ${formatAsOf(asOf)}.`,
  },

  definition: {
    open: "What this counts",
    close: "Close",
    counts: "What it counts",
    source: "Where it comes from",
    window: "Window",
    windowSinceLaunch: "Since the program started, whichever window you choose.",
    windowFor: (long: string) => `${long.charAt(0).toUpperCase()}${long.slice(1)}.`,
    privacy: "Privacy",
    privacyRule: `Shown only when ${MIN_COHORT_SIZE} or more participants are active, and updated once a week, so no one person’s week can change it.`,
    privacyAlways: "A count of codes redeemed. It never says who.",
  },

  code: {
    heading: "Your cohort’s code",
    explain:
      "Share this code with your cohort. Each person creates an account with a personal email. You will see how many joined, not who.",
    copy: "Copy code",
    copied: "Copied",
    joined: (joined: number, expected: number) =>
      `${count.format(joined)} of ${count.format(expected)} joined`,
    regenerate: "Make a new code",
    regenerateAsk: "Make a new code?",
    regenerateBody: "The old code stops working. Everyone who has already joined stays in the cohort.",
    regenerateConfirm: "Make a new code",
    close: "Close to new joiners",
    closeAsk: "Close the cohort to new joiners?",
    closeBody: "The code stops working. Everyone who has already joined stays, and the figures carry on.",
    closeConfirm: "Close cohort",
    cancel: "Cancel",
    closed: "Closed to new joiners. The code no longer works.",
    madeNew: "New code made. The old one no longer works.",
  },

  form: {
    heading: "Set up your cohort",
    name: "Cohort name",
    nameHint: "What your participants will call it, e.g. Leadership Programme 2027.",
    size: "Expected size",
    sizeHint: `How many people you plan to invite. Figures stay hidden until ${MIN_COHORT_SIZE} or more are active.`,
    starts: "Program starts",
    ends: "Program ends",
    create: "Create cohort",
    nameMissing: "Give the cohort a name.",
    sizeMissing: "Enter how many people you plan to invite.",
    datesMissing: "Enter both dates.",
    endsBeforeStart: "The program has to end after it starts.",
  },
} as const;
