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

/** No figure is shown for fewer active participants than this. Settled in the
 *  brief of 2026-10-20. */
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
  /** Planned actions accepted in the window, and how many were completed
   *  within 30 days. Declined and deferred actions are not in the base. */
  actionsAccepted: number;
  actionsCompleted: number;
  /** Artifacts made, and how many were marked used. Recorded outcomes are
   *  tracked inside ExecHQ, never shown to the sponsor: without the work or
   *  the person behind them they give no context (Kate, 2026-10-20). */
  artifacts: number;
  artifactsUsed: number;
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
  /** People active in each week, one per Monday update, oldest first (see
   *  `updateMondays`). Drawn as the weekly trend, always since launch. */
  weeklyActive: number[];
  /** The previous Monday's figures, where scaling back from the latest would
   *  say the wrong thing (a closed cohort can't gain joiners). */
  lastWeek?: Pick<Cohort, "joined" | "activated" | "planAccepted" | "byWindow">;
  /** This Monday's update has not arrived: the Monday it was due. The
   *  figures are the week before's (`lateCohort`). */
  lateSince?: string;
  /** Set up on this visit: no figures and no issues yet, only the first
   *  update to come. */
  fresh?: boolean;
}

const PILOT_WEEK_2: CohortCounts = {
  active: 29,
  actionsAccepted: 74,
  actionsCompleted: 31,
  artifacts: 58,
  artifactsUsed: 19,
  briefingWeekly: 22,
};

const SMALL_WEEK_1: CohortCounts = {
  active: 4,
  actionsAccepted: 9,
  actionsCompleted: 2,
  artifacts: 6,
  artifactsUsed: 1,
  briefingWeekly: 3,
};

const DEMO_SINCE_LAUNCH: CohortCounts = {
  active: 781,
  actionsAccepted: 5820,
  actionsCompleted: 3317,
  artifacts: 3950,
  artifactsUsed: 1580,
  briefingWeekly: 529,
};

const DEMO_LAST_WEEK_SINCE_LAUNCH: CohortCounts = {
  active: 776,
  actionsAccepted: 5610,
  actionsCompleted: 3205,
  artifacts: 3820,
  artifactsUsed: 1523,
  briefingWeekly: 525,
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
    weeklyActive: [4],
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
    weeklyActive: [21, 26],
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
        actionsAccepted: 2140,
        actionsCompleted: 1262,
        artifacts: 1384,
        artifactsUsed: 590,
        briefingWeekly: 401,
      },
      "90d": DEMO_SINCE_LAUNCH,
      launch: DEMO_SINCE_LAUNCH,
    },
    // Climbs while people join, peaks in week 5, then eases off a little:
    // the shape a sponsor asking "are they still using it?" needs to see.
    weeklyActive: [212, 389, 497, 560, 588, 571, 549, 562, 540, 518, 527, 509, 496],
    // Closed, so joining holds; fewer were active over the last 30 days than
    // a week ago, matching the trend. Since launch only ever grows.
    lastWeek: {
      joined: 912,
      activated: 842,
      planAccepted: 696,
      byWindow: {
        "30d": {
          active: 611,
          actionsAccepted: 2190,
          actionsCompleted: 1281,
          artifacts: 1402,
          artifactsUsed: 597,
          briefingWeekly: 407,
        },
        "90d": DEMO_LAST_WEEK_SINCE_LAUNCH,
        launch: DEMO_LAST_WEEK_SINCE_LAUNCH,
      },
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
    source: "The Playbook and its library.",
  },
  loop: {
    label: "Work used",
    question: "following",
    definition:
      "Of the work made, how much participants marked as used outside ExecHQ.",
    source: "Work marked used in ExecHQ.",
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
  /** The same share as a fraction from 0 to 1, for a ring or a bar. Absent
   *  for counts (Work made), which are not a share of anything. */
  fraction?: number;
  /** Why it is hidden, or how much of the window has passed. */
  note?: string;
}

const count = new Intl.NumberFormat("en-GB");

/** A share as a fraction, held to 0–1: joining can pass the expected size. */
function fraction(part: number, whole: number): number {
  return whole === 0 ? 0 : Math.min(1, Math.max(0, part / whole));
}

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
  const values: Record<DataPointId, { value: string; detail: string; fraction?: number }> = {
    invites: {
      value: count.format(cohort.joined),
      detail: `of ${count.format(cohort.expectedSize)} expected`,
      fraction: fraction(cohort.joined, cohort.expectedSize),
    },
    onboarding: {
      value: share(cohort.activated, cohort.joined),
      detail: `${count.format(cohort.activated)} of ${count.format(cohort.joined)} who joined`,
      fraction: fraction(cohort.activated, cohort.joined),
    },
    active: {
      value: share(c.active, cohort.activated),
      detail: `${count.format(c.active)} of ${count.format(cohort.activated)} set up`,
      fraction: fraction(c.active, cohort.activated),
    },
    briefing: {
      value: share(c.briefingWeekly, c.active),
      detail: `${count.format(c.briefingWeekly)} of ${count.format(c.active)} active`,
      fraction: fraction(c.briefingWeekly, c.active),
    },
    plans: {
      value: share(cohort.planAccepted, cohort.activated),
      detail: `${count.format(cohort.planAccepted)} of ${count.format(cohort.activated)} set up`,
      fraction: fraction(cohort.planAccepted, cohort.activated),
    },
    "follow-through": {
      value: share(c.actionsCompleted, c.actionsAccepted),
      detail: `${count.format(c.actionsCompleted)} of ${count.format(c.actionsAccepted)} accepted actions`,
      fraction: fraction(c.actionsCompleted, c.actionsAccepted),
    },
    artifacts: {
      value: count.format(c.artifacts),
      detail: "pieces of work",
    },
    loop: {
      value: share(c.artifactsUsed, c.artifacts),
      detail: `${count.format(c.artifactsUsed)} of ${count.format(c.artifacts)} pieces`,
      fraction: fraction(c.artifactsUsed, c.artifacts),
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
   SINCE LAST WEEK
   -------------------------------------------------------------------------- */

export type Direction = "up" | "down";

/** The figures that count people, and the count behind each. Counts of
 *  actions or work never get a direction: one busy person could move them. */
const PEOPLE_BEHIND: Partial<Record<DataPointId, (cohort: Cohort, window: WindowId) => number>> = {
  invites: (cohort) => cohort.joined,
  onboarding: (cohort) => cohort.activated,
  active: (cohort, window) => cohort.byWindow[window].active,
  briefing: (cohort, window) => cohort.byWindow[window].briefingWeekly,
  plans: (cohort) => cohort.planAccepted,
};

/**
 * Which way a figure moved since last week's update, or nothing. Windows a
 * week apart overlap, so a direction shows only when at least the minimum
 * cohort size of people is behind the change, and only when both weeks are
 * above the minimum: a smaller change could point to one person's week. No
 * counts, ever: a direction, not a score.
 */
export function directionFor(cohort: Cohort, id: DataPointId, window: WindowId): Direction | undefined {
  const people = PEOPLE_BEHIND[id];
  const before = weekBefore(cohort);
  if (!people || !before || !comparesWeeks(cohort, window)) return undefined;
  const now = people(cohort, window);
  const then = people(before, window);
  if (Math.abs(now - then) < MIN_COHORT_SIZE) return undefined;
  return now > then ? "up" : "down";
}

export const DIRECTION_COPY = {
  figure: {
    invites: { up: "More joined than last week", down: "Fewer in the cohort than last week" },
    onboarding: { up: "More set up than last week", down: "Fewer set up than last week" },
    active: { up: "More active than last week", down: "Fewer active than last week" },
    briefing: { up: "More reading it than last week", down: "Fewer reading it than last week" },
    plans: { up: "More with a plan than last week", down: "Fewer with a plan than last week" },
  } satisfies Partial<Record<DataPointId, Record<Direction, string>>>,
  /** Concept 2's clause, after the line's figures. */
  clause: { up: "more than last week", down: "fewer than last week" } satisfies Record<Direction, string>,
  rule: `Arrows show a change since last week’s update, only when at least ${MIN_COHORT_SIZE} participants are behind it.`,
  /** Concept 2 has no arrows: the change is in the sentence. */
  clauseRule: `A change since last week’s update is mentioned only when at least ${MIN_COHORT_SIZE} participants are behind it.`,
} as const;

/** Whether this week can be set against last week at all: there was a last
 *  week, and both are above the minimum. The page states the rule then, so
 *  a figure without an arrow reads as "not enough to say", not as missing. */
export function comparesWeeks(cohort: Cohort, window: WindowId): boolean {
  const before = weekBefore(cohort);
  return Boolean(before) && isAboveMinimum(cohort, window) && isAboveMinimum(before!, window);
}

/** A figure's direction in words, if it has one. */
export function directionText(id: DataPointId, direction: Direction): string {
  const words = DIRECTION_COPY.figure as Partial<Record<DataPointId, Record<Direction, string>>>;
  return words[id]?.[direction] ?? DIRECTION_COPY.clause[direction];
}

/* -----------------------------------------------------------------------------
   WEEKLY TREND
   -------------------------------------------------------------------------- */

/** Weekly updates needed before the trend is drawn: fewer says nothing. */
export const TREND_MIN_WEEKS = 4;

/** One week of the trend. `active` is absent when that week was below the
 *  minimum: the line breaks rather than show a small number. */
export interface TrendWeek {
  weekOf: string;
  active?: number;
}

export interface TrendView {
  state: "shown" | "early" | "suppressed";
  weeks: TrendWeek[];
}

/** People active each week since launch, ready to draw. */
export function trendFor(cohort: Cohort): TrendView {
  const mondays = updateMondays(cohort);
  const weeks = mondays.map((weekOf, i) => {
    const active = cohort.weeklyActive[i];
    return active !== undefined && active >= MIN_COHORT_SIZE ? { weekOf, active } : { weekOf };
  });
  if (!isAboveMinimum(cohort, "launch")) return { state: "suppressed", weeks: [] };
  if (weeks.length < TREND_MIN_WEEKS) return { state: "early", weeks };
  return { state: "shown", weeks };
}

export const TREND_COPY = {
  heading: "Active each week",
  covers: "Since the program started.",
  definition: "How many people signed in and did at least one thing in each week, since the program started, whichever window you choose.",
  source: "Sign-ins and actions in ExecHQ.",
  early: (weeks: number) =>
    `A trend appears after ${TREND_MIN_WEEKS} weekly updates. ${weeks === 1 ? "There has been 1 so far." : `There have been ${weeks} so far.`}`,
  gap: `A gap is a week with fewer than ${MIN_COHORT_SIZE} active, left out to protect privacy.`,
  summary: (first: number, peak: number, latest: number, weeks: number) =>
    `People active each week over ${weeks} weeks: ${count.format(first)} in the first week, ${count.format(peak)} at the peak, ${count.format(latest)} in the latest.`,
  tableCaption: "People active each week",
  week: "Week of",
  active: "Active",
  hiddenWeek: "Hidden",
  latest: (active: string) => `${active} in the latest week`,
} as const;

/* -----------------------------------------------------------------------------
   CSV EXPORT
   -------------------------------------------------------------------------- */

/** One cell, quoted when it holds a comma, a quote or a line break. */
function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/**
 * The figures as shown, as a spreadsheet: one row per Tier 1 figure, totals
 * only. Never a row per participant (the brief, 2026-10-20). A hidden figure
 * stays hidden here, with the reason in its note, so the file can say no more
 * than the page.
 */
export function cohortCsv(cohort: Cohort, window: WindowId): string {
  const H = CSV_COPY.headers;
  const rows: string[][] = [[H.figure, H.value, H.detail, H.direction, H.covers, H.asOf, H.counts, H.note]];
  for (const id of DATA_POINT_IDS) {
    const point = DATA_POINTS[id];
    const figure = figureFor(cohort, id, window);
    const direction = directionFor(cohort, id, window);
    rows.push([
      figure.label,
      figure.value ?? ENTERPRISE_COPY.hidden,
      figure.detail ?? "",
      direction ? directionText(id, direction) : "",
      point.sinceLaunch || window === "launch" ? CSV_COPY.sinceLaunch : WINDOWS[window].long,
      cohort.asOf,
      point.definition,
      figure.note ?? "",
    ]);
  }
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}

/** The file's name: the cohort and the Monday its figures are from. */
export function csvFileName(cohort: Cohort): string {
  const slug = cohort.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${slug || "cohort"}-${cohort.asOf}.csv`;
}

export const CSV_COPY = {
  headers: {
    figure: "Figure",
    value: "Value",
    detail: "Out of",
    direction: "Since last week",
    covers: "Covers",
    asOf: "As of",
    counts: "What it counts",
    note: "Note",
  },
  sinceLaunch: "since the program started",
  hint: "Downloads the figures on this page as a spreadsheet. Totals for the whole cohort, never a row per participant.",
} as const;

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
    firstUpdate: (asOf: string) => `Updated weekly, on Mondays. The first update is ${formatAsOf(asOf)}.`,
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

/* -----------------------------------------------------------------------------
   A COHORT THE REVIEWER MAKES
   -------------------------------------------------------------------------- */

const NOTHING_YET: CohortCounts = {
  active: 0,
  actionsAccepted: 0,
  actionsCompleted: 0,
  artifacts: 0,
  artifactsUsed: 0,
  briefingWeekly: 0,
};

/** The first Monday on or after a date. A new cohort's figures first update
 *  on the Monday after it starts. */
function firstMonday(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + ((8 - date.getUTCDay()) % 7));
  return date.toISOString().slice(0, 10);
}

/** A cohort just set up: its code, and nobody in it yet. */
export function newCohort(details: { name: string; expectedSize: number; startsOn: string; endsOn: string }, code: string): Cohort {
  return {
    id: "small",
    ...details,
    asOf: firstMonday(addDays(details.startsOn, 1)),
    code,
    open: true,
    joined: 0,
    activated: 0,
    planAccepted: 0,
    byWindow: { "30d": NOTHING_YET, "90d": NOTHING_YET, launch: NOTHING_YET },
    weeklyActive: [],
    fresh: true,
  };
}

/** A fresh shared code. The format matches the codes in onboarding. */
export function makeCode(): string {
  return `EXEC-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

/* -----------------------------------------------------------------------------
   CONCEPT 1 — THE THREE QUESTIONS
   -------------------------------------------------------------------------- */

/** The data points under each question, the first set large. */
export const QUESTION_POINTS: Record<QuestionId, DataPointId[]> = {
  joined: ["invites", "onboarding"],
  using: ["active", "briefing"],
  following: ["follow-through", "plans", "artifacts", "loop"],
};

/** The one-sentence answer that opens each question. Reports activity, never
 *  results: what participants did, not what ExecHQ caused. Undefined while
 *  the question's figures are hidden. */
export function answerFor(cohort: Cohort, question: QuestionId, window: WindowId): string | undefined {
  const c = cohort.byWindow[window];
  const above = isAboveMinimum(cohort, window);
  const long = WINDOWS[window].long;
  switch (question) {
    case "joined":
      return above
        ? `${count.format(cohort.joined)} of the ${count.format(cohort.expectedSize)} leaders you expected have joined, and ${count.format(cohort.activated)} have finished setting up.`
        : `${count.format(cohort.joined)} of the ${count.format(cohort.expectedSize)} leaders you expected have joined so far.`;
    case "using":
      return above
        ? `${count.format(c.active)} participants were active in ${long}, and ${count.format(c.briefingWeekly)} read the Daily Briefing at least once a week.`
        : undefined;
    case "following":
      return above
        ? `Participants completed ${count.format(c.actionsCompleted)} planned actions within 30 days of taking them on, and made ${count.format(c.artifacts)} pieces of work.`
        : undefined;
  }
}

export const C1_COPY = {
  eyebrow: "Your cohort",
  dates: (startsOn: string, endsOn: string) => `${formatDate(startsOn)} to ${formatDate(endsOn)}`,
  age: (day: number) => (day === 1 ? "Day 1" : `Day ${day}`),
  notStarted: "Not started yet",
  export: "Export as PDF",
  exportCsv: "Export as CSV",
  printWindow: (long: string, asOf: string) => `Figures cover ${long}. As of ${formatAsOf(asOf)}.`,
  questions: {
    joined: "Did they join?",
    using: "Are they still using it?",
    following: "Do they follow through?",
  } satisfies Record<QuestionId, string>,
  building: {
    heading: "Your cohort is still filling",
    body: `Until ${MIN_COHORT_SIZE} or more participants are active, you see only how many joined. Every other figure stays hidden, so none can point to one person.`,
  },
  filling: (day: number) =>
    `Your program is ${day} days old, so figures over 30 and 90 days are still filling in. Since launch shows everything so far.`,
  privacy: "You see totals for the whole cohort, never a participant, their plan or their work.",
  setup: {
    heading: "Set up your cohort",
    lead: "Give it a name, how many people you plan to invite, and the program’s dates. You will get one code to share.",
    readyHeading: "Your cohort is ready",
    readyLead: "Share the code through your own channels. Figures start to appear once 10 or more participants are active.",
    toDashboard: "See your dashboard",
  },
} as const;

/* -----------------------------------------------------------------------------
   CONCEPT 2 — THE REPORT
   -------------------------------------------------------------------------- */

/** One line of the report: the figure set large, then the rest of the
 *  sentence. A hidden line keeps its label and names the rule instead. */
export interface ReportLine {
  figure: FigureView;
  /** The words after the number. */
  rest?: string;
  /** Which way it moved since last week, already folded into `rest`. */
  direction?: Direction;
}

/** The report's sections, in reading order, and the lines in each. */
export const REPORT_SECTIONS: { id: QuestionId; heading: string; points: DataPointId[] }[] = [
  { id: "joined", heading: "Joining", points: ["invites", "onboarding"] },
  { id: "using", heading: "Use", points: ["active", "briefing"] },
  { id: "following", heading: "Follow-through", points: ["plans", "follow-through", "artifacts", "loop"] },
];

export function reportLine(cohort: Cohort, id: DataPointId, window: WindowId): ReportLine {
  const figure = figureFor(cohort, id, window);
  if (figure.state === "suppressed") return { figure };
  const c = cohort.byWindow[window];
  const long = WINDOWS[window].long;
  const n = (value: number) => count.format(value);
  const rest: Record<DataPointId, string> = {
    invites: `of the ${n(cohort.expectedSize)} leaders you expected have joined.`,
    onboarding: `of them finished setting up (${n(cohort.activated)} of ${n(cohort.joined)}).`,
    active: `of those set up were active in ${long} (${n(c.active)} of ${n(cohort.activated)}).`,
    briefing: `of active participants read the Daily Briefing at least once a week (${n(c.briefingWeekly)} of ${n(c.active)}).`,
    plans: `of those set up chose a development plan (${n(cohort.planAccepted)} of ${n(cohort.activated)}).`,
    "follow-through": `of the planned actions participants took on were completed within 30 days (${n(c.actionsCompleted)} of ${n(c.actionsAccepted)}).`,
    artifacts: `pieces of work were made in ExecHQ in ${long}.`,
    loop: `of that work was marked as used outside ExecHQ (${n(c.artifactsUsed)} of ${n(c.artifacts)}).`,
  };
  const direction = directionFor(cohort, id, window);
  const words = direction ? rest[id].replace(/\.$/, `, ${DIRECTION_COPY.clause[direction]}.`) : rest[id];
  return { figure, rest: words, direction };
}

export const C2_COPY = {
  letterhead: "Cohort report",
  sponsor: "Northgate",
  windowLine: (long: string) => `Figures cover ${long}.`,
  windowLineSinceLaunch: "Figures cover the program since it started.",
  asOf: (asOf: string) => `As of ${formatAsOf(asOf)}.`,
  firstUpdate: (asOf: string) => `First figures on ${formatAsOf(asOf)}.`,
  dates: (startsOn: string, endsOn: string) => `${formatDate(startsOn)} to ${formatDate(endsOn)}`,
  day: (day: number) => `day ${day}`,
  notStarted: "not started yet",
  building: `Only the number who joined is shown until ${MIN_COHORT_SIZE} or more participants are active, so no figure can point to one person.`,
  filling: (day: number) =>
    `The program is ${day} days old, so figures over 30 and 90 days are still filling in.`,
  fillingTag: "Filling in",
  hiddenLine: `hidden until ${MIN_COHORT_SIZE} or more participants are active.`,
  footer:
    "Totals for the whole cohort. Northgate never sees a participant, their plan or their work. Prepared by ExecHQ from activity in the product.",
  export: "Export as PDF",
  exportHint: "Exports this page as it is, on one page.",
  exportCsv: "Export as CSV",
  setup: {
    title: "Untitled cohort",
    lead: "Fill in the cohort’s details to start its report. You will get one code to share.",
    empty: "The report starts here once people join.",
  },
} as const;

/* -----------------------------------------------------------------------------
   CONCEPT 3 — THE WEEKLY LETTER
   -------------------------------------------------------------------------- */

/** One Monday's issue: the cohort as it stood that day. */
export interface LetterIssue {
  number: number;
  /** The Monday it went out. */
  on: string;
  cohort: Cohort;
  /** 30 days once the program is that old; until then, everything so far. */
  window: WindowId;
}

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function scaleCounts(counts: CohortCounts, by: number): CohortCounts {
  const out = { ...counts };
  for (const key of Object.keys(out) as (keyof CohortCounts)[]) out[key] = Math.round(out[key] * by);
  return out;
}

/** Every Monday the cohort's figures were updated, oldest first: the first
 *  Monday after it started, through its latest refresh. */
export function updateMondays(cohort: Cohort): string[] {
  if (cohort.fresh) return [];
  const mondays: string[] = [];
  for (let on = firstMonday(addDays(cohort.startsOn, 1)); on <= cohort.asOf; on = addDays(on, 7)) mondays.push(on);
  return mondays;
}

/**
 * The cohort as it stood at an earlier Monday update, `index` of `total`.
 * Earlier updates are the cohort scaled back toward its start (most people
 * join in the first weeks), so the latest always matches the dashboard
 * exactly. One source for the letter's issues and for "since last week".
 */
function snapshotAt(cohort: Cohort, index: number, total: number, on: string): Cohort {
  if (index + 1 === total) return cohort;
  if (index + 2 === total && cohort.lastWeek) {
    return { ...cohort, ...cohort.lastWeek, asOf: on, weeklyActive: cohort.weeklyActive.slice(0, index + 1) };
  }
  const share = (index + 1) / total;
  const joining = Math.min(1, 0.6 + 0.4 * share);
  const by = joining * share ** 0.5;
  return {
    ...cohort,
    asOf: on,
    joined: Math.round(cohort.joined * joining),
    activated: Math.round(cohort.activated * joining),
    planAccepted: Math.round(cohort.planAccepted * joining * share),
    byWindow: {
      "30d": scaleCounts(cohort.byWindow["30d"], by),
      "90d": scaleCounts(cohort.byWindow["90d"], by),
      launch: scaleCounts(cohort.byWindow.launch, by),
    },
    weeklyActive: cohort.weeklyActive.slice(0, index + 1),
  };
}

/** The cohort at the Monday update before its latest, if there was one.
 *  None while an update is late: there is nothing new to set it against. */
export function weekBefore(cohort: Cohort): Cohort | undefined {
  const mondays = updateMondays(cohort);
  if (cohort.lateSince || mondays.length < 2) return undefined;
  return snapshotAt(cohort, mondays.length - 2, mondays.length, mondays[mondays.length - 2]);
}

/** The cohort as a sponsor sees it when this Monday's update is late: last
 *  week's figures, marked with the Monday that is missing. Undefined until
 *  there has been a week before. */
export function lateCohort(cohort: Cohort): Cohort | undefined {
  const before = weekBefore(cohort);
  return before && { ...before, lastWeek: undefined, lateSince: cohort.asOf };
}

export const LATE_COPY = {
  notice: (asOf: string) =>
    `This Monday’s update is late. The figures here are from ${formatAsOf(asOf)}. ExecHQ is looking into it, and changes since last week return with the next update.`,
  letter: (asOf: string) =>
    `This week’s issue is late. Here is the last one, from ${formatAsOf(asOf)}. The next comes as soon as the figures are in.`,
  archive: "Late",
} as const;

/** Every issue so far, oldest first: one each Monday update. */
export function letterIssues(cohort: Cohort): LetterIssue[] {
  const mondays = updateMondays(cohort);
  return mondays.map((on, i) => {
    const snapshot = snapshotAt(cohort, i, mondays.length, on);
    const window: WindowId = programDay(snapshot) >= 30 ? "30d" : "launch";
    return { number: i + 1, on, cohort: snapshot, window };
  });
}

/**
 * What moved since the last issue, as plain directions with no counts.
 * Overlapping 30-day windows a week apart differ by one week, so a change is
 * only mentioned when at least the minimum cohort size of people is behind
 * it: fewer could point to one person's week. Counts of actions or work are
 * never compared, since one busy person could move them alone.
 */
export function whatMoved(issue: LetterIssue, previous?: LetterIssue): string[] {
  if (!previous) return [];
  if (!isAboveMinimum(issue.cohort, issue.window) || !isAboveMinimum(previous.cohort, previous.window)) return [];
  const now = issue.cohort;
  const then = previous.cohort;
  const a = now.byWindow[issue.window];
  const b = then.byWindow[previous.window];
  const lines: string[] = [];
  const moved = (x: number, y: number) => Math.abs(x - y) >= MIN_COHORT_SIZE;
  if (moved(now.joined, then.joined)) lines.push(now.joined > then.joined ? C3_COPY.moved.joinedUp : C3_COPY.moved.joinedDown);
  if (moved(a.active, b.active)) lines.push(a.active > b.active ? C3_COPY.moved.activeUp : C3_COPY.moved.activeDown);
  return lines;
}

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", timeZone: "UTC" });
const fmtDay = (iso: string) => longDate.format(new Date(`${iso}T00:00:00Z`));

export const C3_COPY = {
  archive: "Issues",
  archiveLabel: "Past issues",
  issueName: (n: number) => (n === 0 ? "Issue 0" : `Issue ${n}`),
  issueDate: (on: string) => fmtDay(on),
  setupName: "Setting up",
  upcoming: "Next issue",
  eyebrow: (n: number, on: string) => `${n === 0 ? "Issue 0" : `Issue ${n}`} · ${formatAsOf(on)}`,
  to: "To Northgate, about",
  headline: (joined: number, expected: number, active?: number, day = 30) =>
    active === undefined
      ? `${count.format(joined)} of ${count.format(expected)} have joined.`
      : `${count.format(joined)} of ${count.format(expected)} have joined, and ${count.format(active)} ${day >= 30 ? "were active this month" : "have been active so far"}.`,
  covers: (day: number) =>
    day >= 30 ? "These figures cover the last 30 days." : `The program is ${day} days old, so these figures cover all of it so far.`,
  joining: (joined: number, expected: number, activated?: number) =>
    activated === undefined
      ? `${count.format(joined)} of the ${count.format(expected)} leaders you expected have joined so far.`
      : `${count.format(joined)} of the ${count.format(expected)} leaders you expected have joined, and ${count.format(activated)} have finished setting up.`,
  using: (active: number, share: string, briefing: number) =>
    `${count.format(active)} were active, ${share} of those set up, and ${count.format(briefing)} read the Daily Briefing at least once a week.`,
  following: (plans: number, completed: number, accepted: number, artifacts: number, used: number) =>
    `${count.format(plans)} have chosen a development plan. Participants completed ${count.format(completed)} of the ${count.format(accepted)} planned actions they took on within 30 days, and made ${count.format(artifacts)} pieces of work: ${count.format(used)} were used outside ExecHQ.`,
  hidden: `Everything else stays hidden until ${MIN_COHORT_SIZE} or more participants are active, so no figure can point to one person. I’ll tell you when it opens.`,
  movedHeading: "Since the last issue",
  movedNone: `Nothing moved by enough to mention. I only mention a change when at least ${MIN_COHORT_SIZE} participants are behind it.`,
  movedRule: `Changes are mentioned only when at least ${MIN_COHORT_SIZE} participants are behind them.`,
  moved: {
    joinedUp: "More people joined.",
    joinedDown: "Fewer people are in the cohort.",
    activeUp: "More participants were active.",
    activeDown: "Fewer participants were active.",
  },
  definitions: "What these figures count",
  signOff: "ExecHQ",
  privacy: "Totals for the whole cohort. You never see a participant, their plan or their work.",
  save: "Save this issue as PDF",
  saveCsv: "Save this issue as CSV",
  manage: "Manage the code",
  hideManage: "Hide",
  codeLine: (code: string, joined: number, expected: number, open: boolean) =>
    open
      ? `Your cohort’s code is ${code}. ${count.format(joined)} of ${count.format(expected)} have joined.`
      : `Your cohort is closed to new joiners. ${count.format(joined)} of ${count.format(expected)} joined.`,
  firstIssue: (on: string) => `Your first issue comes on ${formatAsOf(on)}.`,
  ready: {
    headline: "Your cohort is set up.",
    body: "Here is the code to share through your own channels.",
    then: (on: string) => `Every Monday I’ll write to you with how the cohort is doing. The first issue comes on ${formatAsOf(on)}.`,
  },
  setup: {
    intro: "Before the first issue, I need three things about your cohort.",
    name: "What should we call the cohort?",
    nameHint: "What your participants will call it, e.g. Leadership Programme 2027.",
    size: "How many people do you plan to invite?",
    sizeHint: `Figures stay hidden until ${MIN_COHORT_SIZE} or more are active.`,
    dates: "When does the program run?",
    starts: "Program starts",
    ends: "Program ends",
    next: "Next",
    back: "Back",
    create: "Set up the cohort",
    step: (n: number) => `Question ${n} of 3`,
  },
} as const;

/** When a cohort's first issue goes out: the Monday after it starts. */
export function firstIssueOn(cohort: Cohort): string {
  return firstMonday(addDays(cohort.startsOn, 1));
}
