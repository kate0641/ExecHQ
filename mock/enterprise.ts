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
  /** Planned actions accepted in the window, and how many have been
   *  completed so far, each within 30 days of accepting it (Kate,
   *  2026-10-20). Declined and deferred actions are not in the base. */
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

export const CHANNEL_IDS = ["linkedin", "writing", "speaking", "podcasts", "press"] as const;
export type ChannelId = (typeof CHANNEL_IDS)[number];

/** Active participants with at least one signal in the window: on any
 *  channel, and on each. Someone on two channels counts in both. */
export interface SignalCounts {
  any: number;
  channels: Record<ChannelId, number>;
}

const NO_SIGNALS: SignalCounts = { any: 0, channels: { linkedin: 0, writing: 0, speaking: 0, podcasts: 0, press: 0 } };

export interface Cohort {
  id: Exclude<CohortId, "none">;
  name: string;
  expectedSize: number;
  /** When the program started. There is no end date: a cohort stops
   *  growing when its code is closed (Kate, 2026-10-20). */
  startsOn: string;
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
  /** Signals: what participants put out in the world, by channel, per
   *  window (Kate, 2026-10-20, Concept 1 only). */
  signals: Record<WindowId, SignalCounts>;
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

const SMALL_SIGNALS: SignalCounts = { any: 3, channels: { linkedin: 3, writing: 1, speaking: 0, podcasts: 0, press: 0 } };
const PILOT_SIGNALS: SignalCounts = { any: 21, channels: { linkedin: 17, writing: 10, speaking: 6, podcasts: 2, press: 3 } };
const DEMO_SIGNALS_SINCE_LAUNCH: SignalCounts = { any: 590, channels: { linkedin: 520, writing: 260, speaking: 96, podcasts: 30, press: 51 } };

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
    asOf: "2026-09-28",
    code: "EXEC-7390",
    open: true,
    joined: 6,
    activated: 5,
    planAccepted: 4,
    byWindow: { "30d": SMALL_WEEK_1, "90d": SMALL_WEEK_1, launch: SMALL_WEEK_1 },
    signals: { "30d": SMALL_SIGNALS, "90d": SMALL_SIGNALS, launch: SMALL_SIGNALS },
    weeklyActive: [4],
  },
  /** Maya's cohort, at week 2: every figure shows, and the 30 and 90-day
   *  ones are still filling in. */
  pilot: {
    id: "pilot",
    name: "Northgate Leadership Program",
    expectedSize: 50,
    startsOn: "2026-09-14",
    asOf: "2026-09-28",
    code: "EXEC-4821",
    open: true,
    joined: 38,
    activated: 33,
    planAccepted: 26,
    byWindow: { "30d": PILOT_WEEK_2, "90d": PILOT_WEEK_2, launch: PILOT_WEEK_2 },
    // Speaking, podcasts and press stay under the minimum: held back.
    signals: { "30d": PILOT_SIGNALS, "90d": PILOT_SIGNALS, launch: PILOT_SIGNALS },
    weeklyActive: [21, 26],
  },
  /** The December partner meeting: 1,000 at day 90, so 90 days and since
   *  launch are the same, and 30 days is the last month alone. */
  demo: {
    id: "demo",
    name: "Northgate Senior Leaders",
    expectedSize: 1000,
    startsOn: "2026-09-08",
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
    signals: {
      "30d": { any: 402, channels: { linkedin: 351, writing: 164, speaking: 58, podcasts: 21, press: 33 } },
      "90d": DEMO_SIGNALS_SINCE_LAUNCH,
      launch: DEMO_SIGNALS_SINCE_LAUNCH,
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

/** "2 weeks in": how long the program has run, in the weekly rhythm of
 *  its updates. */
export function weeksIn(day: number): string {
  const weeks = Math.floor(day / 7);
  return weeks < 1 ? "First week" : weeks === 1 ? "1 week in" : `${weeks} weeks in`;
}

/** "14 Sep 2026": a short date, with three-letter months throughout (en-GB
 *  would write "Sept"). */
export function abbrevDate(iso: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(`${iso}T00:00:00Z`);
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

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
  /** The definition cut to one short sentence, for the report's margin. */
  brief: string;
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
    brief: "Accounts made with your cohort’s code, against the size you expected.",
    source: "Codes redeemed. You see the count, never who.",
    sinceLaunch: true,
    alwaysShown: true,
  },
  onboarding: {
    label: "Set up",
    question: "joined",
    definition: "Of the people who joined, how many finished setting up and reached their first piece of work.",
    brief: "Of those who joined, how many finished setting up.",
    source: "The end of setup in ExecHQ.",
    sinceLaunch: true,
  },
  active: {
    label: "Active",
    question: "using",
    definition: "Of the people set up, how many signed in and did at least one thing in the window.",
    brief: "Of those set up, how many did at least one thing in the window.",
    source: "Sign-ins and actions in ExecHQ.",
  },
  briefing: {
    label: "Read the Briefing weekly",
    question: "using",
    definition: "Of the active participants, how many opened the Daily Briefing at least once a week.",
    brief: "Of those active, how many opened the Daily Briefing at least weekly.",
    source: "Opens of the Daily Briefing.",
  },
  plans: {
    label: "Chose a plan",
    question: "following",
    definition: "Of the people set up, how many accepted a development plan.",
    brief: "Of those set up, how many accepted a development plan.",
    source: "Plans accepted in ExecHQ.",
    sinceLaunch: true,
  },
  "follow-through": {
    label: "Followed through",
    question: "following",
    definition:
      "Of the planned actions participants accepted, how many they have completed so far, each within 30 days of accepting it. Actions accepted recently still have time, so this rises as they come due. Actions they declined or put off are not counted.",
    brief: "Of the planned actions taken on, how many are done, each within 30 days.",
    source: "Planned actions in ExecHQ.",
  },
  artifacts: {
    label: "Work made",
    question: "following",
    definition: "How many drafts, briefs and statements the cohort made in ExecHQ in the window.",
    brief: "Drafts, briefs and statements made in ExecHQ in the window.",
    source: "The Playbook and its library.",
  },
  loop: {
    label: "Work used",
    question: "following",
    definition:
      "Of the work made, how much participants marked as used outside ExecHQ.",
    brief: "Of the work made, how much was marked as used outside ExecHQ.",
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
  brief: "People who did at least one thing in each week, since the program started.",
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
   ARE THEY BEING SEEN?
   Signals (Kate, 2026-10-20, Concept 1 only): what participants put out in
   the world. Signals are public by nature, so each channel needs its own
   minimum: fewer than MIN_COHORT_SIZE people on a channel and it is held
   back, or a sponsor could search for the one podcast and find the person.
   -------------------------------------------------------------------------- */

export interface SeenView {
  /** Active participants with a signal on any channel, and their share. */
  any: { value: string; detail: string; fraction: number };
  /** Channels with enough people behind them, most first. */
  shown: { label: string; value: string; of: string }[];
  /** Channels held back, named together. */
  hidden: string[];
}

/** The seen card for one cohort and window. Undefined below the minimum. */
export function seenFor(cohort: Cohort, window: WindowId): SeenView | undefined {
  if (!isAboveMinimum(cohort, window)) return undefined;
  const s = cohort.signals[window];
  const active = cohort.byWindow[window].active;
  const n = (value: number) => count.format(value);
  const channels = [...CHANNEL_IDS].sort((a, b) => s.channels[b] - s.channels[a]);
  return {
    any: { value: share(s.any, active), detail: `${n(s.any)} of ${n(active)} active`, fraction: fraction(s.any, active) },
    shown: channels
      .filter((id) => s.channels[id] >= MIN_COHORT_SIZE)
      .map((id) => ({ label: SEEN_COPY.channels[id], value: n(s.channels[id]), of: `of ${n(active)}` })),
    // Held back in a fixed order, so the list never hints at which is larger.
    hidden: CHANNEL_IDS.filter((id) => s.channels[id] < MIN_COHORT_SIZE).map((id) => SEEN_COPY.channels[id]),
  };
}

/** "Speaking, podcasts, press": held-back channels, named together. */
function listChannels(labels: string[]): string {
  return labels.map((label, i) => (i === 0 ? label : label.toLowerCase())).join(", ");
}

export const SEEN_COPY = {
  heading: "Are they being seen?",
  answer: (any: number, active: number, window: WindowId) =>
    `${count.format(any)} of the ${count.format(active)} active participants put something out in the world ${inWindow(window)}.`,
  ring: "put something out, on any channel",
  channels: { linkedin: "LinkedIn", writing: "Published writing", speaking: "Speaking", podcasts: "Podcasts", press: "Press" } satisfies Record<ChannelId, string>,
  hidden: (labels: string[]) => listChannels(labels),
  fewer: `Fewer than ${MIN_COHORT_SIZE}`,
  fewerLabel: `Fewer than ${MIN_COHORT_SIZE} people each, held back so none can point to one person`,
  note: "Recorded in ExecHQ or added by the participant. Someone on two channels counts in both.",
  hiddenAll: `Hidden until ${MIN_COHORT_SIZE} or more participants are active.`,
  listLabel: "By channel",
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
export function cohortCsv(cohort: Cohort, window: WindowId, options: { signals?: boolean } = {}): string {
  const H = CSV_COPY.headers;
  const covers = window === "launch" ? CSV_COPY.sinceLaunch : WINDOWS[window].long;
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
      // The page no longer says "filling in" (Kate, 2026-10-20), so the file
      // doesn't either; a hidden figure still says why.
      figure.state === "suppressed" ? (figure.note ?? "") : "",
    ]);
  }
  // Concept 1 shows signals, so its file carries them, under the same rule:
  // a channel with fewer than the minimum of people behind it is held back.
  if (options.signals) {
    const seen = seenFor(cohort, window);
    const s = cohort.signals[window];
    const active = cohort.byWindow[window].active;
    const hidden = (label: string) => [label, ENTERPRISE_COPY.hidden, "", "", covers, cohort.asOf, CSV_COPY.signals.channel, ENTERPRISE_COPY.suppressed];
    if (!seen) {
      rows.push(hidden(CSV_COPY.signals.any));
      for (const id of CHANNEL_IDS) rows.push(hidden(`${CSV_COPY.signals.prefix}${SEEN_COPY.channels[id]}`));
    } else {
      rows.push([CSV_COPY.signals.any, seen.any.value, seen.any.detail, "", covers, cohort.asOf, CSV_COPY.signals.anyCounts, ""]);
      for (const id of CHANNEL_IDS) {
        const people = s.channels[id];
        const label = `${CSV_COPY.signals.prefix}${SEEN_COPY.channels[id]}`;
        rows.push(
          people >= MIN_COHORT_SIZE
            ? [label, count.format(people), `of ${count.format(active)} active`, "", covers, cohort.asOf, CSV_COPY.signals.channel, ""]
            : [label, SEEN_COPY.fewer, "", "", covers, cohort.asOf, CSV_COPY.signals.channel, CSV_COPY.signals.held],
        );
      }
    }
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
  signals: {
    any: "Put something out (any channel)",
    prefix: "Signals: ",
    anyCounts: "Of the active participants, how many put something out in the world on any channel, recorded in ExecHQ or added by them.",
    channel: "Of the active participants, how many put something out on this channel. Someone on two channels counts in both.",
    held: `Fewer than ${MIN_COHORT_SIZE} people, held back so it can't point to one person.`,
  },
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
    open: "How it’s measured",
    /** The icon's name and the panel's heading (Kate, 2026-10-20). */
    measured: (label: string) => `How ${label} is measured`,
    close: "Close",
    counts: "Measures",
    source: "Source",
    window: "Window",
    windowSinceLaunch: "Since the program started, whichever window you choose.",
    windowFor: (long: string) => `${long.charAt(0).toUpperCase()}${long.slice(1)}.`,
    /** The popover's last line, after the source. */
    covers: (long: string) => `Covers ${long}.`,
    coversSinceLaunch: "Covers the program since it started.",
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
    nameHint: "What your participants will call it, e.g. Leadership Program 2027.",
    size: "Expected size",
    sizeHint: `How many people you plan to invite. Figures stay hidden until ${MIN_COHORT_SIZE} or more are active.`,
    starts: "Program starts",
    create: "Create cohort",
    nameMissing: "Give the cohort a name.",
    sizeMissing: "Enter how many people you plan to invite.",
    startMissing: "Enter the date the program starts.",
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
export function newCohort(details: { name: string; expectedSize: number; startsOn: string }, code: string): Cohort {
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
    signals: { "30d": NO_SIGNALS, "90d": NO_SIGNALS, launch: NO_SIGNALS },
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
        ? `Participants have completed ${count.format(c.actionsCompleted)} of the ${count.format(c.actionsAccepted)} planned actions they took on so far, and made ${count.format(c.artifacts)} pieces of work.`
        : undefined;
  }
}

export const C1_COPY = {
  /** The line under the name: when it started, how long it has run, and
   *  how many people are in it. No end date: there is none. */
  meta: {
    started: (startsOn: string) => `Started ${abbrevDate(startsOn)}`,
    starts: (startsOn: string) => `Starts ${abbrevDate(startsOn)}`,
    people: (joined: number) => (joined === 0 ? "No one yet" : joined === 1 ? "1 person" : `${count.format(joined)} people`),
  },
  exportMenu: "Export",
  exportPdf: "PDF",
  exportCsv: "CSV",
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
  /** Said once for the page, so no figure's popover repeats it. */
  privacy: `You see totals for the whole cohort, never a participant, their plan or their work. Figures show once ${MIN_COHORT_SIZE} or more are active, and update every Monday.`,
  /** Under Followed through: recent actions still have time, so the share
   *  rises as they come due. */
  stillDue: "Some actions are still within their 30 days.",
  setup: {
    heading: "Set up your cohort",
    lead: "Give it a name, how many people you plan to invite, and when the program starts. You will get one code to share.",
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
/** Follow-through leads, as on the dashboard (Kate, 2026-10-20): a report is
 *  read from the top, often no further than its first section. */
export const REPORT_SECTIONS: { id: QuestionId; heading: string; points: DataPointId[] }[] = [
  { id: "following", heading: "Follow-through", points: ["follow-through", "plans", "artifacts", "loop"] },
  { id: "using", heading: "Use", points: ["active", "briefing"] },
  { id: "joined", heading: "Joining", points: ["invites", "onboarding"] },
];

/** The report's opening: what the cohort did, in two sentences, follow-through
 *  first. Undefined while the figures are hidden. */
export function reportSummary(cohort: Cohort, window: WindowId): string | undefined {
  if (!isAboveMinimum(cohort, window)) return undefined;
  const c = cohort.byWindow[window];
  const n = (value: number) => count.format(value);
  const long = window === "launch" ? "since the program started" : `in ${WINDOWS[window].long}`;
  // Which way activity moved, when enough people are behind it to say so:
  // the summary is the part most often read alone.
  const moved = directionFor(cohort, "active", window);
  const since = moved ? `, ${DIRECTION_COPY.clause[moved]}` : "";
  return `Participants have completed ${n(c.actionsCompleted)} of the ${n(c.actionsAccepted)} planned actions they took on so far. ${n(c.active)} of the ${n(cohort.activated)} set up were active ${long}${since}.`;
}

/** "in the last 30 days", or "since the program started": a window as it
 *  reads inside a sentence. */
function inWindow(window: WindowId): string {
  return window === "launch" ? WINDOWS.launch.long : `in ${WINDOWS[window].long}`;
}

/** The work line: the pieces made, and how many of them were used, drawn
 *  as one part of one whole. Undefined while hidden. */
export function reportWork(cohort: Cohort, window: WindowId): { made: string; rest: string; used: number; whole: number; usedLabel: string; restLabel: string } | undefined {
  if (!isAboveMinimum(cohort, window)) return undefined;
  const c = cohort.byWindow[window];
  const n = (value: number) => count.format(value);
  return {
    made: n(c.artifacts),
    rest: `pieces of work were made in ExecHQ ${inWindow(window)}, and ${n(c.artifactsUsed)} ${c.artifactsUsed === 1 ? "was" : "were"} used outside it.`,
    used: c.artifactsUsed,
    whole: c.artifacts,
    usedLabel: `${n(c.artifactsUsed)} used outside ExecHQ`,
    restLabel: `${n(c.artifacts - c.artifactsUsed)} not marked as used`,
  };
}

/** The joining line and its funnel: expected, joined, set up. Choosing a
 *  plan is Follow-through's, so it is drawn there only (Kate, 2026-10-20).
 *  Joined always shows; setting up hides below the minimum. */
export function reportJoining(cohort: Cohort, window: WindowId): { joined: string; rest: string; steps: { label: string; value?: number; outline?: boolean }[] } {
  const above = isAboveMinimum(cohort, window);
  const n = (value: number) => count.format(value);
  const F = C2_COPY.funnel;
  return {
    joined: n(cohort.joined),
    rest: above
      ? `of the ${n(cohort.expectedSize)} leaders you expected have joined, and ${n(cohort.activated)} have finished setting up.`
      : `of the ${n(cohort.expectedSize)} leaders you expected have joined so far.`,
    steps: [
      { label: F.expected, value: cohort.expectedSize, outline: true },
      { label: F.joined, value: cohort.joined },
      { label: F.setUp, value: above ? cohort.activated : undefined },
    ],
  };
}

export function reportLine(cohort: Cohort, id: DataPointId, window: WindowId): ReportLine {
  const figure = figureFor(cohort, id, window);
  if (figure.state === "suppressed") return { figure };
  const c = cohort.byWindow[window];
  const long = inWindow(window);
  const n = (value: number) => count.format(value);
  const rest: Record<DataPointId, string> = {
    invites: `of the ${n(cohort.expectedSize)} leaders you expected have joined.`,
    onboarding: `of them finished setting up (${n(cohort.activated)} of ${n(cohort.joined)}).`,
    active: `of those set up were active ${long} (${n(c.active)} of ${n(cohort.activated)}).`,
    briefing: `of active participants read the Daily Briefing at least once a week (${n(c.briefingWeekly)} of ${n(c.active)}).`,
    plans: `of those set up chose a development plan (${n(cohort.planAccepted)} of ${n(cohort.activated)}).`,
    "follow-through": `of the planned actions participants took on have been completed so far (${n(c.actionsCompleted)} of ${n(c.actionsAccepted)}). Some are still within their 30 days.`,
    artifacts: `pieces of work were made in ExecHQ ${long}.`,
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
  started: (startsOn: string) => `Started ${formatDate(startsOn)}`,
  starts: (startsOn: string) => `Starts ${formatDate(startsOn)}`,
  weeksIn: (day: number) => weeksIn(day).toLowerCase(),
  building: `Only the number who joined is shown until ${MIN_COHORT_SIZE} or more participants are active, so no figure can point to one person.`,
  hiddenLine: `hidden until ${MIN_COHORT_SIZE} or more participants are active.`,
  /** One paragraph at the foot: privacy, the change rule when it applies,
   *  where the numbers come from, and who prepared it. */
  footer: (comparing: boolean) =>
    [
      "Totals for the whole cohort. Northgate never sees a participant, their plan or their work.",
      comparing ? `A change since last week is mentioned only when at least ${MIN_COHORT_SIZE} participants are behind it.` : null,
      "Sources: codes redeemed, and setup, sign-ins, plans, planned actions and work in ExecHQ. Prepared by ExecHQ.",
    ]
      .filter(Boolean)
      .join(" "),
  exportMenu: "Export",
  exportPdf: "PDF",
  exportCsv: "CSV",
  funnel: { label: "Joining, step by step", expected: "Expected", joined: "Joined", setUp: "Set up", hidden: "Hidden" },
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
  /** Follow-through leads (Kate, 2026-10-20). Below the minimum, only how
   *  many joined can be said. */
  headline: (completed: number, accepted: number) =>
    `Participants have completed ${count.format(completed)} of the ${count.format(accepted)} planned actions they took on.`,
  headlineHidden: (joined: number, expected: number) => `${count.format(joined)} of ${count.format(expected)} have joined.`,
  covers: (day: number) => (day >= 30 ? "These figures cover the last 30 days." : `These figures cover the first ${day} days.`),
  /** By the numbers, under the headline (Kate, 2026-10-20): three figures,
   *  each "31 of 74" over what it counts. */
  numbers: {
    label: "By the numbers",
    of: (whole: number) => `of ${count.format(whole)}`,
    completed: "planned actions completed",
    active: (day: number) => (day >= 30 ? "active in the last 30 days" : `active in the first ${day} days`),
    joined: "joined",
  },
  joining: (joined: number, expected: number, activated?: number) =>
    activated === undefined
      ? `${count.format(joined)} of the ${count.format(expected)} leaders you expected have joined so far.`
      : `${count.format(joined)} of the ${count.format(expected)} leaders you expected have joined, and ${count.format(activated)} have finished setting up.`,
  using: (active: number, share: string, briefing: number) =>
    `${count.format(active)} were active, ${share} of those set up, and ${count.format(briefing)} read the Daily Briefing at least once a week.`,
  following: (plans: number, artifacts: number, used: number) =>
    `${count.format(plans)} have chosen a development plan, and the cohort made ${count.format(artifacts)} pieces of work: ${count.format(used)} were used outside ExecHQ. Some planned actions are still within their 30 days.`,
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
  definitions: "How these are measured",
  signOff: "ExecHQ",
  privacy: "Totals for the whole cohort. You never see a participant, their plan or their work.",
  save: "Save this issue",
  savePdf: "PDF",
  saveCsv: "CSV",
  manage: "Manage the code",
  hideManage: "Hide",
  codeLine: (code: string, open: boolean) => (open ? `Your cohort’s code is ${code}.` : "Your cohort is closed to new joiners."),
  firstIssue: (on: string) => `Your first issue comes on ${formatAsOf(on)}.`,
  ready: {
    headline: "Your cohort is set up.",
    body: "Here is the code to share through your own channels.",
    then: (on: string) => `Every Monday I’ll write to you with how the cohort is doing. The first issue comes on ${formatAsOf(on)}.`,
  },
  setup: {
    intro: "Before the first issue, I need three things about your cohort.",
    name: "What should we call the cohort?",
    nameHint: "What your participants will call it, e.g. Leadership Program 2027.",
    size: "How many people do you plan to invite?",
    sizeHint: `Figures stay hidden until ${MIN_COHORT_SIZE} or more are active.`,
    starts: "When does the program start?",
    startsLabel: "Program starts",
    next: "Next",
    back: "Back",
    create: "Set up the cohort",
    step: (n: number) => `Question ${n} of 3`,
  },
} as const;

/* -----------------------------------------------------------------------------
   THE ASSISTANT
   The ExecHQ assistant for sponsors (Kate, 2026-10-20), in each concept: a
   floating bar on the dashboard, "Ask about this report" beside the report,
   and replies to the letter. Answers come from the cohort's totals only, under
   the page's own rules: nothing below the minimum, directions rather than
   week-on-week counts, what participants did rather than what ExecHQ caused,
   and never anything about one person. The prototype has no AI: each
   suggested question has an answer written from the cohort's figures.
   -------------------------------------------------------------------------- */

export type AssistantKey = "follow" | "summary" | "setup" | "measured" | "change" | "note" | "who" | "other";

export interface AssistantPrompt {
  label: string;
  key: AssistantKey;
}

export const ASSISTANT_COPY = {
  name: "ExecHQ",
  role: "About your cohort",
  pillHere: "Your cohort",
  pillAsk: "Ask about your cohort",
  startTitle: "What would you like to know?",
  rule: `I answer from your cohort’s totals only, never about one person, and only once ${MIN_COHORT_SIZE} or more are active.`,
  placeholder: "Ask about your cohort",
  close: "Close",
  newChat: "New chat",
  thread: "Conversation",
  reportButton: "Ask about this report",
  reportIntro: "I can turn this report into words for your leadership, explain a figure, or suggest what to do next. Anything I write comes from the totals in the report.",
  reportPlaceholder: "Ask about this report",
  copy: "Copy",
  copied: "Copied",
  replyHeading: "Reply to this issue",
  replyField: "Your reply",
  replySend: "Send reply",
  replyPlaceholder: "Write a reply",
  you: "You",
  writing: "ExecHQ is writing…",
  suggested: "Suggested replies",
  prompts: {
    dashboard: [
      { label: "What should I tell my leadership about follow-through?", key: "follow" },
      { label: "Draft a two-line update for my CHRO", key: "summary" },
      { label: "What can I do to get more people set up?", key: "setup" },
    ],
    report: [
      { label: "Summarise this report for my CEO", key: "summary" },
      { label: "What should I tell my leadership about follow-through?", key: "follow" },
      { label: "How is follow-through measured?", key: "measured" },
    ],
    letter: [
      { label: "What’s behind the change in activity?", key: "change" },
      { label: "Draft a note I can send the cohort", key: "note" },
      { label: "What should I tell my leadership?", key: "follow" },
    ],
  } satisfies Record<string, AssistantPrompt[]>,
} as const;

/** What a typed question is asking for. A question about a person gets the
 *  refusal; anything else the prototype can't answer says so. */
export function assistantKeyFor(text: string): AssistantKey {
  return /\b(who|whom|which (person|people|participants?)|names?)\b/i.test(text) ? "who" : "other";
}

/** An answer, written from the cohort's figures for the window on screen. */
export function assistantAnswer(cohort: Cohort, window: WindowId, key: AssistantKey): string {
  const n = (value: number) => count.format(value);
  const c = cohort.byWindow[window];
  const day = programDay(cohort);
  const sponsor = ENTERPRISE_COPY.sponsor;
  const above = isAboveMinimum(cohort, window);
  const notYetSetUp = cohort.joined - cohort.activated;

  if (key === "who") {
    return `I can’t tell you about any one person. That promise is why leaders use ExecHQ honestly.\n\nWhat I can tell you: ${n(cohort.joined)} of the ${n(cohort.expectedSize)} leaders you expected have joined.`;
  }
  if (key === "other") {
    return "In this prototype I answer the suggested questions. In the product I’d answer from your cohort’s totals, and never about one person.";
  }
  if (key === "measured") return DATA_POINTS["follow-through"].definition;
  // Below the minimum, only how many joined can be said.
  if (!above && key !== "note") {
    return `I can say more once ${MIN_COHORT_SIZE} or more are active, so no figure can point to one person. So far, ${n(cohort.joined)} of the ${n(cohort.expectedSize)} leaders you expected have joined.`;
  }
  switch (key) {
    case "follow":
      return `${weeksIn(day)}, participants have completed ${n(c.actionsCompleted)} of the ${n(c.actionsAccepted)} planned actions they took on, ${share(c.actionsCompleted, c.actionsAccepted)}. Many of those actions are recent and each has 30 days, so expect this to rise.\n\nA line you could use: “Leaders are acting on their plans: ${n(c.actionsCompleted)} actions completed so far.”`;
    case "summary": {
      const moved = directionFor(cohort, "active", window);
      const since = moved ? `, ${DIRECTION_COPY.clause[moved]}` : "";
      return `${cohort.name}, ${weeksIn(day).toLowerCase()}: ${n(cohort.joined)} of the ${n(cohort.expectedSize)} leaders we expected have joined, and ${n(cohort.activated)} have set up. Participants have completed ${n(c.actionsCompleted)} of the ${n(c.actionsAccepted)} planned actions they took on, and ${n(c.active)} of those set up were active ${inWindow(window)}${since}.\n\nTotals only: ExecHQ never shows ${sponsor} a participant, their plan or their work.`;
    }
    case "setup":
      return notYetSetUp === 0
        ? "Everyone who has joined has finished setting up."
        : `${n(notYetSetUp)} of the ${n(cohort.joined)} who joined haven’t finished setting up yet. ExecHQ never contacts them on your behalf, but a note from you or their manager, through your own channels, tends to help. Say that it’s private: ${sponsor} never sees their plan or their work.`;
    case "change": {
      const moved = directionFor(cohort, "active", window);
      if (!moved) return `Activity hasn’t moved by enough to mention. I only say so when at least ${MIN_COHORT_SIZE} people are behind a change, so it can never point to one person’s week.`;
      return `${moved === "up" ? "More" : "Fewer"} participants were active than at the last update: at least ${MIN_COHORT_SIZE} ${moved === "up" ? "more" : "fewer"}, which is the most I’ll say about a change. I can’t tell you who, or why for any one person.`;
    }
    case "note":
      return `Here’s a note you could send through your own channels:\n\n“${weeksIn(day)}, many of you are already acting on your plans. If you haven’t finished setting up, now’s a good time, and it stays private: ${sponsor} never sees your plan or your work.”`;
  }
}

/** When a cohort's first issue goes out: the Monday after it starts. */
export function firstIssueOn(cohort: Cohort): string {
  return firstMonday(addDays(cohort.startsOn, 1));
}
