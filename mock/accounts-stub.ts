// TEMPORARY. Sprint 3 designs the Signal Picture and replaces this file.

/* V1 has no account connections: LinkedIn and her website are never read or
   connected, so everything here is what she types or ExecHQ records. The only
   LinkedIn thing is an optional spreadsheet she uploads, as in onboarding. */

/** The column captions over a start-and-now pair, and the suggestion's caption. */
export const COUNT_COPY = {
  then: "Start",
  now: "Now",
  tryThis: "Try this",
} as const;

/** Where her LinkedIn followers started and are now, in the prototype's own record. */
export const LINKEDIN_START = { then: "1,247", now: "1,284" } as const;

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
  /** What came of it, in her words. Typed by her, never worked out: a reply,
   *  a comment, an invitation. The Signal Picture shows it as hers. */
  impact?: string;
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
  open: "Add",
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
  { id: "p1", kind: "podcast", title: "Planning as a leadership skill", where: "The Modern CMO", on: "2026-10-17", impact: "Two people wrote to me afterwards about their own planning cycles." },
  { id: "s1", kind: "speaking", title: "Panel: planning for growth", where: "Growth Summit", on: "2026-10-29" },
  { id: "r1", kind: "press", title: "Quoted on planning cycles", where: "Marketing Week", on: "2026-11-01", impact: "My manager forwarded it to the leadership team." },
];

/** The Where you started card: words for the parts of it. */
export const PRESENCE_CARD_COPY = {
  counts: "Counts",
  addedHeading: "Added since you started",
  /** Under the heading when she has added nothing. */
  addedNone: "Nothing yet. What you add shows here, and the counts move.",
  /** The hero's line under her followers. */
  sameAsStart: (then: string) => `Same as when you started, ${then}`,
  was: (then: string) => `was ${then}`,
  up: (n: string) => `up ${n}`,
  changeLabel: "Change",
} as const;

export const PRESENCE_STUB = {
  name: "Your presence",
  mark: "you",
  asOf: (date: string) => `Since ${date}`,
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
  /** A signal ExecHQ recorded for her, so she knows it did not come from her. */
  recordedSource: "Added for you",
  recorded: (what: string) => `ExecHQ recorded: ${what}`,
  hide: "Not right? Hide it",
  dismiss: "Dismiss",
  dismissNote: (text: string) => `Dismiss: ${text}`,
  /** The small words above each note, by where it came from. */
  source: {
    podcast: "Podcast",
    press: "Press",
    speaking: "Speaking",
    writing: "Writing",
    other: "Something you added",
  },
  other: (what: string) => `Added: ${what}.`,
  podcast: (where: string, ordinal: string) => `Great job! You’re on ${where}, your ${ordinal} podcast appearance.`,
  press: (where: string, ordinal: string) => `Great to see you in ${where}. That’s your ${ordinal} press mention.`,
  speaking: (where: string, ordinal: string) => `Well done! You’re speaking at ${where}, your ${ordinal} engagement.`,
  writing: (title: string, ordinal: string) => `“${title}” is up. Nicely done, that’s your ${ordinal} piece.`,
} as const;

/* -----------------------------------------------------------------------------
   WHERE SHE STARTS (Homepage Concept 4, decided 2026-10-02: "Quick counts").
   On the first return the Signal Picture asks for a starting point in one
   card: a stepper for each thing she can count, and a number for her LinkedIn
   followers. All of it is typed by hand. Nothing is looked up or connected,
   and zero is a fine answer.
   -------------------------------------------------------------------------- */

export const LINKEDIN_ROW_LABEL = "LinkedIn followers";

/** The invitation under the starting numbers: the onboarding's LinkedIn upload, for later or now. */
export const LINKEDIN_MORE_COPY = {
  title: "Add more LinkedIn data",
  body: "Optional. Your LinkedIn analytics export shows how your posts and audience are doing. Add it now, or any time later.",
  open: "Upload my LinkedIn export",
  close: "Done",
  /** Once a file is in, it is no longer an invitation: it says what she has, and what another upload does. */
  titleAdded: "Your LinkedIn export",
  bodyReading: "Reading it now. Carry on, and it will be ready when you need it.",
  bodyReady: (file: string) => `Added from ${file}. Upload a newer one whenever you like and it will replace this.`,
  bodyEmpty: (file: string) => `Added from ${file}. It had no posts in the last year. Upload a newer one whenever you like and it will replace this.`,
  openAgain: "Upload a newer export",
} as const;

export const BASELINE_COPY = {
  intro: "Your Signal Picture is a private record of how your visibility changes. Tell us where you are now, so you can see your progress at the end of each stage. A rough guess, even zero, is fine.",
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
  /** The first Signals visit: the intro says she may leave it, and then she starts at zero. */
  introZero: "Your Signal Picture is a private record of how your visibility changes. Tell us where you are now, so you can see your progress at the end of each stage. Mark your starting point yourself, or we will mark you at zero.",
  zeroSkip: "Start me at zero",
  /** After she skips: one line, and a way back. */
  skipped: "Add where you are starting from whenever you like, and this shows how far you have come.",
  addBack: "Add my starting point",
  saved: "Saved where you are starting from.",
} as const;
