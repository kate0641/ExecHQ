/**
 * The Daily Intelligence Briefing: Maya's three reads, why each is there, the
 * publishers they come from, and every word the Briefing says.
 *
 * Source: the Sprint 4 experience brief, "Daily Intelligence Briefing" and
 * "Content & Copy Considerations". Rules this file keeps:
 *
 * - Never more than three reads a day, and every read carries a reason line.
 * - A reason line is grounded in her direction or her plan, to the standard of
 *   Sprint 3's why lines. "You lead the planning workstream" is a reason;
 *   "Relevant to marketing leaders" is a category, and is not allowed here.
 * - Nothing here looks like a plan step: no horizon, no effort or reading
 *   time, no done state. A read is read or not read, and that is all.
 * - The Briefing never offers more. Once all three are seen it says so, and
 *   stops.
 * - Relevance feedback is acknowledged in a few words, without promising more
 *   than the pilot's rules-based curation can do.
 *
 * Mock content is written to the standard real curation will have to meet,
 * because the brief names generic reason lines as the feature's main risk.
 *
 * STAND-INS: every publisher here is invented, by decision on 2026-10-11, so
 * nothing invented (headlines, standfirsts, the quoted passages Concept C
 * highlights) is put in a real publisher's mouth on a public site. In the
 * product the list is real publications.
 */

/* -----------------------------------------------------------------------------
   PUBLISHERS
   Where her reads come from, chosen on her first visit and changed later
   (on the Briefing page itself in one concept, in Profile in the others).
   -------------------------------------------------------------------------- */

export type PublisherGroupId = "leadership" | "business" | "marketing";

export interface Publisher {
  id: string;
  name: string;
  group: PublisherGroupId;
}

export const PUBLISHER_GROUPS: { id: PublisherGroupId; label: string }[] = [
  { id: "leadership", label: "Leadership and management" },
  { id: "business", label: "Business news" },
  { id: "marketing", label: "Marketing" },
];

export const PUBLISHERS: Publisher[] = [
  { id: "marlow", name: "Marlow Management Review", group: "leadership" },
  { id: "calder", name: "The Calder Quarterly", group: "leadership" },
  { id: "ridgeline", name: "Ridgeline Leadership Journal", group: "leadership" },
  { id: "kestrel", name: "Kestrel Strategy Notes", group: "leadership" },
  { id: "halden", name: "Halden Business Daily", group: "business" },
  { id: "arden", name: "Arden Financial", group: "business" },
  { id: "thornbury", name: "The Thornbury Report", group: "business" },
  { id: "grayson", name: "Grayson Weekly", group: "business" },
  { id: "fieldwork", name: "Fieldwork Marketing Weekly", group: "marketing" },
  { id: "brandline", name: "Brandline", group: "marketing" },
  { id: "tessel", name: "Tessel Media Review", group: "marketing" },
  { id: "oakmont", name: "The Oakmont CMO Letter", group: "marketing" },
];

/** The suggested set for Maya: leadership-heavy, because her direction is
 *  about leading an organization, with one marketing title so her own field
 *  is still in it. Proposed, from her direction, not from any data. */
export const SUGGESTED_PUBLISHERS = ["marlow", "calder", "ridgeline", "halden", "fieldwork"];

/** The fewest she can choose. Three reads a day need room to choose from.
 *  Proposed: the brief does not set a number. */
export const MIN_PUBLISHERS = 3;

export const publisherName = (id: string): string =>
  PUBLISHERS.find((p) => p.id === id)?.name ?? id;

/* -----------------------------------------------------------------------------
   TODAY'S THREE READS
   The first matches the homepage's approved Briefing card (`BRIEFING_STUB` in
   `mock/homepage.ts`): same headline, same tag. It is the Maya journey's
   hand-off read: relevant to her planning workstream, it opens Thought
   Leadership Builder with itself as the source.
   -------------------------------------------------------------------------- */

export interface BriefingRead {
  id: string;
  title: string;
  publisherId: string;
  /** One line: why it matters to her this week. Grounded in her direction or
   *  her plan, never a category. */
  reason: string;
  /** What it grounds in, for the spec and the review notes. Never shown. */
  groundedIn: "plan" | "direction";
  /** Two or three sentences on what it says, shown when she opens it. In the
   *  product this is the publisher's own standfirst, not ExecHQ's summary. */
  standfirst: string;
  /** Concept C: one passage from the article, highlighted, that she can tap
   *  to respond to. A short quote with its source, which the product can show
   *  without a licence for the whole article. */
  passage: string;
  /** Concept C: ExecHQ's note on that passage: why this part, for her. The
   *  reason line says why the read is here; this says why this sentence. */
  note: string;
}

export const TODAYS_READS: BriefingRead[] = [
  {
    id: "planning-season",
    title: "How planning season decides who gets new work",
    publisherId: "marlow",
    reason: "You lead the planning workstream, and the Q1 review is where new scope gets handed out.",
    groundedIn: "plan",
    standfirst:
      "Annual planning is where most new remits are assigned, often before any role is posted. The leaders who get them are usually the ones already shaping the plan, not the ones waiting to be asked.",
    passage:
      "The remit goes to whoever has already described the problem it solves, usually in the planning document itself.",
    note: "You are writing part of that document. This is the part to bring to the Q1 review.",
  },
  {
    id: "widen-a-remit",
    title: "What chief marketing officers look for when they widen a remit",
    publisherId: "calder",
    reason: "You want to lead a broader marketing organization, and this is how the people who decide that think about it.",
    groundedIn: "direction",
    standfirst:
      "When a marketing remit grows, the people deciding look less at campaign results and more at how a leader runs work they do not own. Cross-functional judgment is the signal they say they look for first.",
    passage:
      "The question is no longer whether the campaigns worked, but whether the teams around them would follow the same leader again.",
    note: "The workstream puts you across teams now. That is the evidence this describes.",
  },
  {
    id: "passed-over",
    title: "Why strong operators get passed over for scope, and what changes it",
    publisherId: "ridgeline",
    reason: "You said you want to be seen as a leader, not only as the person who delivers.",
    groundedIn: "direction",
    standfirst:
      "Reliable delivery can keep a leader in the role they already do well. The shift comes from naming the problems they would take on next, out loud, to the people who assign them.",
    passage:
      "Nobody hands new scope to the person they cannot spare. They hand it to the person who has said what they would do with it.",
    note: "Your leadership story already says what you would take on. This is the case for saying it out loud.",
  },
];

/* -----------------------------------------------------------------------------
   WHAT THE BRIEFING SAYS
   -------------------------------------------------------------------------- */

export const BRIEFING_COPY = {
  heading: "Today’s Briefing",
  /** Said once, when reading completes the Plan's step. Done is the word for
   *  action steps, so it is right here. */
  stepDone: "Done on your plan: Read today’s Briefing.",
  /** "Monday 12 October · Three reads". Words, not a count to work through. */
  dateLine: (date: string) => `${date} · Three reads`,
  lead: "Three reads, chosen for where you’re headed.",

  /* --- First visit: no publishers chosen ---------------------------------- */
  firstVisit: {
    heading: "Where should your reads come from?",
    body: "Choose the publishers you trust. Each morning ExecHQ picks three reads from them and says why each one is there.",
    suggestedHeading: "Suggested for you",
    suggestedWhy: "Chosen for leading a broader marketing organization. Change any of them.",
    useSuggested: "Start with these",
    chooseOwn: "Choose my own",
    min: (n: number) => `Choose at least ${n}.`,
    chosen: (n: number) => (n === 1 ? "1 chosen" : `${n} chosen`),
    done: "Show today’s three",
    later: "You can change these at any time.",
  },

  /* --- A read ------------------------------------------------------------- */
  read: {
    /** Above the reason line, so it reads as ExecHQ's words, not the publisher's. */
    reasonLabel: "Why it’s here",
    open: "Read",
    /** In the product this leaves for the publisher's site. */
    openAt: (publisher: string) => `Read it at ${publisher}`,
    openAtNote: "Opens on the publisher’s site.",
    markRead: "Mark as read",
    markUnread: "Mark as not read",
    readState: "Read",
    save: "Save",
    saved: "Saved",
    savedNotice: "Saved. It stays in your saved reads after today.",
    unsavedNotice: "Removed from your saved reads.",
  },

  /* --- Relevance feedback ------------------------------------------------- */
  relevance: {
    question: "Was this worth your time?",
    yes: "Relevant",
    no: "Not relevant",
    /** Acknowledged in the moment, in a few words. The brief's own line for
     *  "no"; nothing more is promised than the rules can do. */
    ackYes: "Noted. You’ll see more like this.",
    ackNo: "Noted. You’ll see less like this.",
    undo: "Undo",
  },

  /* --- Hand-off into Thought Leadership Builder --------------------------- */
  respond: {
    action: "Write a post about this",
    hint: "Opens Thought Leadership Builder with this read as your source.",
    /** The provenance label. Plain, the same everywhere, and it stays with
     *  the draft in the library for the life of the artifact. */
    provenance: "Started from today’s Briefing",
    sourceLine: (title: string, publisher: string) => `${title}, ${publisher}`,
  },

  /* --- Concept B: one at a time ----------------------------------------- */
  oneAtATime: {
    count: (n: number, of: number) => `${n} of ${of}`,
    next: "Next",
    /** Concept 2's news-app reader: the next read by its publisher. */
    nextRead: (publisher: string) => `Next: ${publisher}`,
    /** After the third read: back to the front page. */
    finish: "That’s today’s three",
    front: "Today’s three",
    back: "Back",
    toEnd: "See all three",
  },

  /* --- Concept 2: the reader's action bar --------------------------------- */
  bar: {
    label: "Actions for this read",
    back: "Back",
    relevant: "Relevant",
    notForMe: "Not for me",
    save: "Save",
    saved: "Saved",
    post: "Post",
    postFull: "Write a post about this",
  },

  /* --- Concept 1: the deck ---------------------------------------------- */
  deck: {
    /** Read before a strip's headline: pressing it brings that read forward. */
    show: "Show",
    label: "Today’s three reads",
  },

  /* --- Concept C: the highlighted passage --------------------------------- */
  passage: {
    label: "A passage for you",
    noteLabel: "ExecHQ’s note",
    tapHint: "Tap the passage to respond to it.",
    sheetHeading: "This passage",
    respond: "Respond to this",
    respondHint: "Opens Thought Leadership Builder with this passage and its article as your source.",
    /** Web only: her own selection, where the full text is shown. In the
     *  product that needs the whole article in ExecHQ, and so a licence from
     *  the publisher: a review note (docs/sprint-4-review-notes.md), never
     *  said on the page. */
    selection: "Respond to your selection",
  },

  /* --- End of the day's set ----------------------------------------------- */
  end: {
    heading: "That’s today’s three.",
    /** Concept A, once all three have been opened. */
    allRead: "You’ve read today’s three.",
    body: "Tomorrow’s arrive in the morning.",
  },

  /* --- Saved reads -------------------------------------------------------- */
  savedReads: {
    heading: "Saved reads",
    link: (n: number) => (n === 1 ? "1 saved read" : `${n} saved reads`),
    empty: "Nothing saved yet. Save a read to keep it after today.",
  },

  /* --- Settings: publishers and the email --------------------------------- */
  settings: {
    publishersHeading: "Your publishers",
    publishersValue: (n: number) => `${n} chosen`,
    changePublishers: "Change publishers",
    save: "Save",
    cancel: "Cancel",
    publishersSaved: "Saved. Tomorrow’s reads come from these.",
    /** Concept A's line under the three: where they come from, and Change. */
    fromLine: (names: string[]) =>
      names.length <= 2 ? `From ${names.join(" and ")}` : `From ${names[0]}, ${names[1]} and ${names.length - 2} more`,
    inProfile: "Change publishers in Profile",
    emailLabel: "Email me the Briefing",
    /** Off by default, per the brief. The 8 am send is from the 8 Oct
     *  notifications sheet. */
    emailHint: "Each morning at 8 am, your time. The same three reads, with links back here.",
  },
} as const;
