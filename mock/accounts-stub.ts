// TEMPORARY. Sprint 3 designs the Signal Picture and replaces this file.

/**
 * What Maya's connected accounts say, for Homepage Concept 2's "What your
 * accounts say" section (Account cards, chosen 2026-09-29). Invented but
 * consistent numbers for a senior marketing manager.
 *
 * Labelled by who vouches for them (the Stage 2 rule): every number is from
 * her accounts, so every card carries its source and date. The section says
 * what changed, never that her work caused it. It breaks the Concept 2
 * brief's "no counts, bars or trends" rule at Kate's request; flagged for the
 * client.
 */

export const ACCOUNTS_COPY = {
  heading: "What your signals say",
  sub: "Where you started and where you are now, as of the dates shown. Only you see this.",
  subNotConnected: "Nothing brought in yet. Only you would see this.",
  baseline: "Where you started",
  /** The column captions over a then-and-now pair. */
  then: "Start",
  now: "Now",
  asOfLinkedIn: (date: string) => `Uploaded ${date}`,
  asOfWebsite: (date: string) => `Read ${date}`,
  says: "What it suggests",
  tryThis: "Try this",
} as const;

export const LINKEDIN_STUB = {
  name: "LinkedIn",
  mark: "in",
  stats: [
    { value: "1,284", label: "followers", note: "+37 in 90 days" },
    { value: "6,820", label: "people reached", note: "4 posts" },
    { value: "31%", label: "director or above, planning post", note: "usually 14%" },
  ],
  /** Where the followers were at the start of the chart, thirteen weeks
   *  before the upload, and where they are now. */
  baseline: { label: "Followers, 13 weeks ago", then: "1,247", now: "1,284" },
  /** Followers, weekly, oldest first: thirteen weeks to the upload. */
  followers: [1247, 1249, 1252, 1252, 1255, 1258, 1259, 1263, 1266, 1270, 1276, 1281, 1284],
  chartCaption: "Followers, weekly · last 90 days",
  chartSummary: "Followers rose from 1,247 to 1,284 over 90 days, about half of it in the last month.",
  says: "Your audience is mostly peers in marketing. The planning post reached twice as many directors and above as your usual posts.",
  tryThis: {
    title: "Write one post a month about the planning work",
    why: "It’s the one topic reaching the people who decide on scope, and the review gives you plenty to say.",
    label: "Draft a post",
  },
  invite: {
    intro: "Upload your LinkedIn analytics export, and this shows:",
    shows: [
      "how your followers and post reach change",
      "the seniority and industries of the people who see your posts",
      "which topics reach the people who decide on scope",
    ],
    label: "Connect LinkedIn",
  },
} as const;

export const WEBSITE_STUB = {
  name: "Your website",
  mark: "www",
  stats: [
    { value: "4", label: "pages read" },
    { value: "3×", label: "“campaign lead”", note: "0 on leading a team" },
    { value: "14 mo", label: "since it changed" },
  ],
  /** Unchanged since she began: a baseline that has not moved says so. */
  baseline: { label: "Mentions of leading a team", then: "0", now: "0", note: "Unchanged since you started" },
  says: "Your site calls you a “campaign lead” three times and never mentions leading a team. It still describes the job you’re moving on from.",
  tryThis: {
    title: "Open your About page with what you lead",
    why: "Your leadership story already says it. The first line of the page is where it would do the most.",
    label: "Use your story",
  },
  invite: {
    intro: "Give us your site’s address, and we’ll read its public pages to show how you describe yourself, and whether it matches where you’re heading.",
    shows: [],
    label: "Add your website",
  },
} as const;

/* -----------------------------------------------------------------------------
   YOUR PRESENCE: the four signals she adds herself, by decision on 2026-09-30
   (podcast appearances, press mentions, speaking engagements, thought pieces).
   Nothing is searched for: she adds a link or a note. Each has a baseline, the
   count on the day her plan began, and moves only when she adds one, so what
   the card shows is always her own record and never a score.
   -------------------------------------------------------------------------- */

/** The four she keeps a count of, and "other": anything else she did that the
 *  Signal Picture should remember, which no count tracks. */
export type PresenceKind = "podcast" | "press" | "speaking" | "writing" | "other";
export type CountedKind = Exclude<PresenceKind, "other">;

export interface PresenceItem {
  id: string;
  kind: PresenceKind;
  title: string;
  /** The show, publication, event or place it ran. */
  where: string;
  /** The day she added it. Counts on a given day include everything added by then. */
  on: string;
  /** Where to find it, if she gave a link. */
  link?: string;
  /** The day it happened, when that is not the day she added it. The Signal
   *  Picture's windows run on this. */
  happenedOn?: string;
  /** A note in her words, in place of a title. */
  note?: string;
  /** The plan area it belongs to, when she added it from an artifact. */
  area?: string;
  /** The Loop record it was added from, when she was offered to add it. */
  fromRecord?: string;
}

export const PRESENCE_KINDS: Record<
  PresenceKind,
  { label: string; noun: string; nouns: string; /** The chip in the add sheet. */ chip: string; /** The question about where it ran. */ whereLabel: string; wherePlaceholder: string }
> = {
  podcast: { label: "Podcast appearances", noun: "appearance", nouns: "appearances", chip: "Podcast", whereLabel: "Which show?", wherePlaceholder: "The Modern CMO" },
  press: { label: "Press mentions", noun: "mention", nouns: "mentions", chip: "Press mention", whereLabel: "Which publication?", wherePlaceholder: "Marketing Week" },
  speaking: { label: "Speaking engagements", noun: "engagement", nouns: "engagements", chip: "Talk", whereLabel: "Which event?", wherePlaceholder: "Growth Summit" },
  other: { label: "Something else", noun: "item", nouns: "items", chip: "Something else", whereLabel: "Where was it?", wherePlaceholder: "" },
  writing: {
    label: "Writing you publish",
    noun: "piece",
    nouns: "pieces",
    chip: "Something I publish",
    whereLabel: "Where do you publish?",
    wherePlaceholder: "My newsletter, Medium, LinkedIn",
  },
};

/** The add sheet: she adds these herself, with a note and, if she has one, a
 *  link. Nothing is searched for and nothing leaves the browser. */
export const ADD_COPY = {
  title: "Add something you’ve done",
  kindLabel: "What is it?",
  noteLabel: "A title or a note",
  noteHint: "Just enough for you to recognize it.",
  linkLabel: "A link, if you have one",
  linkPlaceholder: "https://",
  submit: "Add",
  cancel: "Cancel",
  privacy: "Only you see this. Nothing is searched for or shared.",
  errorKind: "Choose what it is.",
  errorNote: "Add a title or a note.",
  errorWhere: "Say where it ran.",
  /** The button on the card that opens the sheet. */
  open: "Add one",
  /** Read out with the link on a latest item. */
  opensNewTab: "(opens in a new tab)",
} as const;

export const PRESENCE_ORDER: readonly CountedKind[] = ["podcast", "press", "speaking", "writing"];

/** What she already had when her plan began: the baseline. */
export const PRESENCE_BASELINE: Record<CountedKind, number> = {
  podcast: 1,
  press: 2,
  speaking: 1,
  writing: 3,
};

/** What she has added since, oldest first. The five homepage states fall on
 *  different days, so each shows a different count. */
export const PRESENCE_ITEMS: readonly PresenceItem[] = [
  { id: "w1", kind: "writing", title: "Why I review my plan every quarter", where: "LinkedIn article", on: "2026-10-09" },
  { id: "p1", kind: "podcast", title: "Planning as a leadership skill", where: "The Modern CMO", on: "2026-10-17" },
  { id: "s1", kind: "speaking", title: "Panel: planning for growth", where: "Growth Summit", on: "2026-10-29" },
  { id: "r1", kind: "press", title: "Quoted on planning cycles", where: "Marketing Week", on: "2026-11-01" },
];

export const PRESENCE_STUB = {
  name: "Your presence",
  mark: "you",
  asOf: (date: string) => `Since ${date}`,
  /** The one line under the rows: what has moved, as a count and no more. */
  summary: (added: number) =>
    added === 0
      ? "Nothing added since you started, so what you had then is your baseline."
      : `${added} added since you started.`,
  tryThis: {
    title: "Pitch one show about planning as a leadership skill",
    why: "Your story already says it, and you’ve been asked about it once on air.",
    label: "Draft a pitch",
  },
  invite: {
    intro: "Add a podcast, a mention in the press, a talk or a piece you’ve written, and this shows:",
    shows: [
      "how many of each you had when you started, and how many now",
      "what you’ve added lately",
    ],
    label: "Add one",
  },
} as const;

/* -----------------------------------------------------------------------------
   THE SPARK: a small note when something she can see has moved, by decision
   on 2026-09-30. It names the thing and says what changed. On 2026-10-02
   Kate dropped the no-praise rule, so it is friendly now: a warm word and
   an exclamation mark are fine. It still never says her work caused it,
   and there are no streaks. It appears inline at the top of the signals section, is
   dismissed in one press, and is gone for good once dismissed.
   -------------------------------------------------------------------------- */

export const SPARK_COPY = {
  label: "Recent movement",
  dismiss: "Dismiss",
  dismissNote: (text: string) => `Dismiss: ${text}`,
  /** The small words above each note, by where it came from. */
  source: {
    linkedin: "LinkedIn",
    podcast: "Podcast",
    press: "Press",
    speaking: "Speaking",
    writing: "Writing",
    other: "Something you added",
  },
  other: (what: string) => `Added: ${what}.`,
  linkedin: "Your planning post reached twice as many directors and above as usual.",
  podcast: (where: string, ordinal: string) => `Great job! You’re on ${where}, your ${ordinal} podcast appearance.`,
  press: (where: string, ordinal: string) => `Great to see you in ${where}. That’s your ${ordinal} press mention.`,
  speaking: (where: string, ordinal: string) => `Well done! You’re speaking at ${where}, your ${ordinal} engagement.`,
  writing: (title: string, ordinal: string) => `“${title}” is up. Nicely done, that’s your ${ordinal} piece.`,
} as const;

/* Concept 3's simpler version: one row per account, a finding and the one
   thing to try, no numbers grid or chart (decided 2026-09-29). */
export const ACCOUNTS_ROWS = {
  heading: "What your signals say",
  /** Where she started, for every signal at once. */
  baselineHeading: "Where you started",
  baselineAsOf: (date: string) => `Since ${date}`,
  baselineLinkedIn: "LinkedIn followers",
  baselineWebsite: "Website mentions of leading a team",
  baselineWebsiteNote: "Unchanged since you started",
  linkedIn: {
    eyebrow: (date: string) => `LinkedIn · uploaded ${date}`,
    finding: "Your planning post reached twice as many directors and above as usual",
    tryThis: "Try: one post a month about the planning work",
    offEyebrow: "LinkedIn · not connected",
    offTitle: "See who your posts reach",
    offDetail: "Upload your analytics export in Profile",
  },
  website: {
    eyebrow: (date: string) => `Your website · read ${date}`,
    finding: "Your site still calls you a “campaign lead”",
    tryThis: "Try: open your About page with what you lead",
    offEyebrow: "Your website · not connected",
    offTitle: "See how your site describes you",
    offDetail: "Add its address in Profile",
  },
} as const;

/** What the dock's toggle records as the source when it connects both. */
export const DEMO_SOURCES = {
  linkedin: "LinkedIn analytics export, October 2026",
  website: "maya-chen.com",
} as const;

/* -----------------------------------------------------------------------------
   WHERE SHE STARTS (Homepage Concept 4, decided 2026-10-02: "Quick counts").
   On the first return the Signal Picture asks for a starting point in one
   card: a stepper for each thing she can count, and a number for her LinkedIn
   followers. All of it is typed by hand. Nothing is looked up or connected,
   and zero is a fine answer.
   -------------------------------------------------------------------------- */

export const LINKEDIN_ROW_LABEL = "LinkedIn followers";

export const BASELINE_COPY = {
  intro: "Tell us where you are starting from. Rough is fine, and zero is a fine answer.",
  linkedin: { label: LINKEDIN_ROW_LABEL, hint: "Look at your profile and type the number", placeholder: "e.g. 1,240" },
  /** One row per thing she can count: the question's label and a line under it. */
  kinds: {
    podcast: { label: "Podcast appearances", hint: "Shows you have been a guest on" },
    press: { label: "Press mentions", hint: "Quoted or featured" },
    speaking: { label: "Talks you have given", hint: "Panels, keynotes, events" },
    writing: { label: "Somewhere you publish", hint: "A newsletter, blog or articles, and how many pieces" },
  },
  save: "Save my starting point",
  skip: "Skip for now",
  privacy: "Only you see this. Nothing is looked up or shared.",
  /** After she skips: one line, and a way back. */
  skipped: "Add where you are starting from whenever you like, and this shows how far you have come.",
  addBack: "Add my starting point",
  saved: "Saved where you are starting from.",
} as const;
