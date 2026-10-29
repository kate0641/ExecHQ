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
 * nothing invented (headlines, standfirsts, the articles and passages
 * Concept 2 shows) is put in a real publisher's mouth on a public site. In the
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
  /** One passage from the article: what a post started from a passage
   *  quotes (Thought Leadership Builder's source). The first noted passage
   *  in `body`. */
  passage: string;
  /** Concept 2: the whole article, read in ExecHQ, as paragraphs. A part
   *  with a note is a highlighted passage with ExecHQ's note on it, so the
   *  notes run all the way through. Invented, like everything here; in the
   *  product it needs a licence from the publisher. */
  body: ArticlePart[][];
}

/** A run of an article's text, or a highlighted passage with ExecHQ's note. */
export type ArticlePart = string | { text: string; note: string };

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
    body: [
      [
        "Ask a leader how they came to run something new and the answer rarely starts with a job posting. It starts in a planning meeting, months earlier, when a gap in next year’s plan needed an owner. ",
        { text: "The remit goes to whoever has already described the problem it solves, usually in the planning document itself.", note: "You are writing part of that document. This is the part to bring to the Q1 review." },
      ],
      [
        "That pattern holds across functions and company sizes. Planning is where the organization decides what it will do next year, and so where it decides who will do it. By the time a role is written up, the person who fills it has often been named in everything but title.",
      ],
      [
        "The leaders who come out of planning with more are rarely the loudest in the room. ",
        { text: "They are the ones who turned up with the problem already framed: what it costs now, what fixing it would take, and who would need to be involved.", note: "Cost, what it would take, who is involved: three lines you could draft before the review." },
        " Framing does half the work of asking.",
      ],
      [
        "Waiting to be asked has the opposite effect. A leader who delivers well on this year’s plan becomes part of next year’s baseline, and baselines don’t get new remits. ",
        { text: "The plan is the one document where saying what you want to take on reads as useful rather than ambitious.", note: "If saying you want more scope feels awkward, the planning document is the place it won’t." },
      ],
      [
        "None of this needs a title change first. It needs a page in the plan with your thinking on it, and a conversation with whoever signs the plan off before it is signed.",
      ],
    ],
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
    body: [
      [
        "When a chief marketing officer decides to widen someone’s remit, campaign results are the starting point, not the deciding one. Most candidates have good numbers. What separates them is harder to put in a dashboard.",
      ],
      [
        { text: "The question is no longer whether the campaigns worked, but whether the teams around them would follow the same leader again.", note: "The workstream puts you across teams now. That is the evidence this describes." },
        " Sales, product and finance all have a view on that, and the people deciding ask for it.",
      ],
      [
        "Cross-functional judgment shows up in small decisions: which trade-off a leader escalates, which they settle themselves, and how they explain the ones that go against another team. ",
        { text: "Leaders who keep a short record of those calls find them far easier to talk about when it matters.", note: "Two or three of your planning calls would make that record. Worth noting while they’re fresh." },
      ],
      [
        "The other signal is how a leader talks about work they don’t own. Credit given to a partner team is noticed more than credit taken. ",
        { text: "A broader remit is, in the end, a bet that someone can run work through people who don’t report to them.", note: "This is the line to keep in mind when you describe the workstream to your manager." },
      ],
      [
        "For marketing leaders aiming at that bet, the advice from the people making it is plain: make the cross-team work visible, and make it easy for others to say good things about it.",
      ],
    ],
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
    body: [
      [
        "Every organization has them: the leader whose team always delivers, who is trusted with anything difficult, and who somehow never gets the bigger job. Reliability, it turns out, can be a trap.",
      ],
      [
        { text: "Nobody hands new scope to the person they cannot spare. They hand it to the person who has said what they would do with it.", note: "Your leadership story already says what you would take on. This is the case for saying it out loud." },
      ],
      [
        "The fix is not to deliver less. It is to change what people hear from you. Strong operators tend to report on what is done; the leaders who get scope talk about what is next. ",
        { text: "A single sentence about the problem you would take on next does more than a quarter of flawless updates.", note: "That sentence is close to your positioning statement. Try it in your next one-to-one." },
      ],
      [
        "It also helps to make yourself easier to spare. A deputy who can run the current work is the strongest argument that you are ready for more. ",
        { text: "Leaders who have named a successor are moved on sooner than those who haven’t.", note: "Worth a thought before the Q1 review: who would run your work if you took on more?" },
      ],
      [
        "Being seen as a leader rather than a deliverer is not a matter of style. It is a matter of saying, to the people who decide, what you would lead.",
      ],
    ],
  },
];

/* -----------------------------------------------------------------------------
   READS SHE SAVED ON EARLIER DAYS
   Saved reads outlast the day (14 Oct), so the Saved page has some from the
   weeks before to show what it is for. Saved until she removes one. Invented,
   like today's three; no whole article (Concept 2 reads only today's in full).
   -------------------------------------------------------------------------- */

export interface EarlierSavedRead extends BriefingRead {
  /** How many days before today she saved it. */
  savedDaysAgo: number;
}

export const EARLIER_SAVED: EarlierSavedRead[] = [
  {
    id: "first-ninety-days",
    title: "The first ninety days in a bigger remit",
    publisherId: "calder",
    reason: "You want to lead a broader marketing organization, and the first months set how the role is seen.",
    groundedIn: "direction",
    standfirst: "Leaders who take on more scope are judged early, and mostly on what they choose not to change. The first ninety days are for listening in public.",
    passage: "The first decision people notice is the change you decided not to make.",
    body: [],
    savedDaysAgo: 3,
  },
  {
    id: "planning-review-people-attend",
    title: "Running a planning review people want to attend",
    publisherId: "ridgeline",
    reason: "You present marketing’s part of the Q1 plan, and the review is where it is decided.",
    groundedIn: "plan",
    standfirst: "The best planning reviews are short, start with the decision being asked for, and leave the detail in the appendix. Most do the opposite.",
    passage: "Open with the decision you need, not the work you did.",
    body: [],
    savedDaysAgo: 7,
  },
  {
    id: "sales-wants-from-marketing",
    title: "What sales leaders want from marketing in planning",
    publisherId: "marlow",
    reason: "Sales signs off part of the plan you are writing.",
    groundedIn: "plan",
    standfirst: "Sales leaders say they want fewer campaigns and clearer pipeline numbers from marketing’s plan, and a named owner for each.",
    passage: "Give every number in the plan a name beside it.",
    body: [],
    savedDaysAgo: 14,
  },
  {
    id: "quiet-scope",
    title: "How quiet operators make their case for scope",
    publisherId: "kestrel",
    reason: "You deliver well and want more scope; this is how that gets noticed without a campaign for it.",
    groundedIn: "direction",
    standfirst: "Not every case for a bigger role is made in a meeting. The leaders who get one often wrote it down first, in a page their manager could forward.",
    passage: "Write the page your manager would forward.",
    body: [],
    savedDaysAgo: 18,
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
    savedNotice: "Saved. Find it in Saved, at the top of your Briefing.",
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

  /* --- Concept 1: the deck ---------------------------------------------- */
  deck: {
    /** Read before a strip's headline: pressing it brings that read forward. */
    show: "Show",
    label: "Today’s three reads",
  },

  /* --- Concept 2: ExecHQ's notes on highlighted passages -------------------- */
  passage: {
    noteLabel: "ExecHQ’s note",
    /** Concept 2: after a highlighted passage, for screen readers. */
    noteRef: (n: number) => `ExecHQ’s note ${n} follows`,
    /** Concept 2: the foot of an article read in ExecHQ. */
    credit: (publisher: string) => `Published by ${publisher}. Highlights and notes by ExecHQ.`,
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
    /** At the top right of the Briefing, every day (14 Oct). */
    button: "Saved",
    /** Read after Saved by screen readers. */
    count: (n: number) => (n === 0 ? ", nothing saved yet" : n === 1 ? ", 1 read" : `, ${n} reads`),
    /** The Saved page (option B, 14 Oct). */
    title: "Saved",
    back: "Today’s Briefing",
    lead: (n: number) => `${n === 1 ? "1 read" : `${n} reads`}, newest first. They stay until you remove them.`,
    savedWhen: "Saved",
    remove: (title: string) => `Remove from Saved: ${title}`,
    removed: "Removed from Saved.",
    undo: "Undo",
    emptyHeading: "Nothing saved yet",
    empty: "Tap Save on any read to keep it here after the day it arrives.",
  },

  /* --- Settings: publishers and the email --------------------------------- */
  settings: {
    publishersHeading: "Your publishers",
    publishersValue: (n: number) => `${n} chosen`,
    save: "Save",
    cancel: "Cancel",
    publishersSaved: "Saved. Tomorrow’s reads come from these.",
    inProfile: "Change publishers in Profile",
    emailLabel: "Email me the Briefing",
    /** On by default (Kate, 28 Oct; the brief had it off). The 8 am send is
     *  from the 8 Oct notifications sheet. */
    emailHint: "Each morning at 8 am, your time. The same three reads, with links back here.",
  },
} as const;
