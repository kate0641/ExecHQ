/**
 * What a LinkedIn analytics export holds, stubbed. The prototype never reads
 * the file she brings: this is the shape of what a real export would give, so
 * the view that draws it can be designed now. A week of followers at a time,
 * and each post with the numbers LinkedIn reports for it. Made up, and
 * shown only after she has "uploaded" a file.
 */

export interface LinkedInPost {
  id: string;
  /** The day it was posted. */
  on: string;
  /** The first line of the post. */
  title: string;
  impressions: number;
  reactions: number;
  comments: number;
}

export interface LinkedInExport {
  /** The period the export covers. */
  from: string;
  to: string;
  /** Her followers at the end of each week, oldest first. */
  followers: { on: string; count: number }[];
  posts: LinkedInPost[];
}

/** What an export looks like to someone who has been here a while: already brought in, so the view of it is there from the second state on. */
export const SEEDED_EXPORT = { fileName: "Content_2025-10-06_2026-10-05_Jane.xlsx", status: "ready" } as const;

const DAY = 86_400_000;
const day = (ms: number) => new Date(ms).toISOString().slice(0, 10);

/** Followers at the end of each month, to draw weeks between. */
const MONTH_ENDS = [1103, 1109, 1121, 1134, 1146, 1155, 1171, 1184, 1203, 1226, 1247, 1266, 1284];
const START = Date.parse("2025-10-06T00:00:00Z");
const WEEKS = 52;

/** A small steady wobble, so the line is a record and not a ruler. */
const WOBBLE = [0, 1, -1, 2, 0, -2, 1, 0, 2, -1, 0, 1, -1];

const followers = Array.from({ length: WEEKS + 1 }, (_, i) => {
  const at = (i / WEEKS) * (MONTH_ENDS.length - 1);
  const lo = Math.floor(at);
  const hi = Math.min(lo + 1, MONTH_ENDS.length - 1);
  const base = MONTH_ENDS[lo] + (MONTH_ENDS[hi] - MONTH_ENDS[lo]) * (at - lo);
  const last = i === 0 || i === WEEKS;
  return { on: day(START + i * 7 * DAY), count: Math.round(base + (last ? 0 : WOBBLE[i % WOBBLE.length])) };
});

export const LINKEDIN_EXPORT: LinkedInExport = {
  from: "2025-10-06",
  to: "2026-10-05",
  followers,
  posts: ([
    { id: "p1", on: "2025-10-14", title: "What I wish I had known before my first leadership role", impressions: 1840, reactions: 38, comments: 5 },
    { id: "p2", on: "2025-11-06", title: "The planning meeting that changed how our team decides", impressions: 2610, reactions: 61, comments: 9 },
    { id: "p3", on: "2025-11-27", title: "Three questions I ask before taking on new work", impressions: 1220, reactions: 24, comments: 2 },
    { id: "p4", on: "2026-01-13", title: "Why I review my plan every quarter", impressions: 3480, reactions: 84, comments: 14 },
    { id: "p5", on: "2026-02-03", title: "What a good 1:1 actually covers", impressions: 2140, reactions: 47, comments: 6 },
    { id: "p6", on: "2026-02-24", title: "Saying no without closing the door", impressions: 1530, reactions: 29, comments: 3 },
    { id: "p7", on: "2026-03-17", title: "Notes from a panel on planning for growth", impressions: 4920, reactions: 121, comments: 19 },
    { id: "p8", on: "2026-04-07", title: "Handing a project to someone better placed to run it", impressions: 1760, reactions: 35, comments: 4 },
    { id: "p9", on: "2026-05-05", title: "How I prepare for a conversation I would rather avoid", impressions: 2890, reactions: 66, comments: 11 },
    { id: "p10", on: "2026-05-26", title: "Writing the update your manager actually reads", impressions: 2330, reactions: 52, comments: 7 },
    { id: "p11", on: "2026-06-16", title: "The quiet value of a standing weekly review", impressions: 1410, reactions: 27, comments: 2 },
    { id: "p12", on: "2026-07-14", title: "What I learned from a project that did not land", impressions: 3760, reactions: 97, comments: 16 },
    { id: "p13", on: "2026-08-11", title: "Mentoring someone more senior than you", impressions: 2050, reactions: 44, comments: 5 },
    { id: "p14", on: "2026-09-15", title: "A short guide to asking for more scope", impressions: 3190, reactions: 73, comments: 12 },
    // The quieter posts between them.
    { id: "q1", on: "2025-10-27", title: "A lesson from this week's team meeting", impressions: 717, reactions: 15, comments: 1 },
    { id: "q2", on: "2025-11-01", title: "One thing I changed in how I write updates", impressions: 386, reactions: 8, comments: 0 },
    { id: "q3", on: "2025-11-07", title: "What I asked my manager for, and what happened", impressions: 712, reactions: 9, comments: 1 },
    { id: "q4", on: "2025-11-12", title: "A book that changed how I plan my quarter", impressions: 853, reactions: 15, comments: 1 },
    { id: "q5", on: "2025-11-14", title: "A note on giving feedback sooner", impressions: 1429, reactions: 24, comments: 3 },
    { id: "q6", on: "2025-11-21", title: "Why I block time for thinking", impressions: 630, reactions: 8, comments: 0 },
    { id: "q7", on: "2025-11-23", title: "What new managers rarely hear", impressions: 644, reactions: 11, comments: 1 },
    { id: "q8", on: "2025-11-25", title: "Three habits from a good project week", impressions: 388, reactions: 8, comments: 1 },
    { id: "q9", on: "2025-12-10", title: "How I prepare for a board conversation", impressions: 1276, reactions: 29, comments: 3 },
    { id: "q10", on: "2025-12-24", title: "A small change to how I run 1:1s", impressions: 903, reactions: 17, comments: 2 },
    { id: "q11", on: "2026-01-25", title: "What I would tell my younger self about visibility", impressions: 1000, reactions: 16, comments: 2 },
    { id: "q12", on: "2026-02-08", title: "A question worth asking in every review", impressions: 759, reactions: 10, comments: 0 },
    { id: "q13", on: "2026-03-22", title: "Celebrating a colleague's promotion", impressions: 1273, reactions: 33, comments: 4 },
    { id: "q14", on: "2026-04-13", title: "Thoughts after a conference week", impressions: 849, reactions: 18, comments: 1 },
    { id: "q15", on: "2026-04-28", title: "How I say no to good ideas", impressions: 1308, reactions: 24, comments: 3 },
    { id: "q16", on: "2026-05-10", title: "A checklist I use before a big decision", impressions: 571, reactions: 15, comments: 1 },
    { id: "q17", on: "2026-05-13", title: "Lessons from onboarding a new hire", impressions: 418, reactions: 10, comments: 1 },
    { id: "q18", on: "2026-05-18", title: "What I read this month", impressions: 902, reactions: 15, comments: 1 },
    { id: "q19", on: "2026-06-24", title: "Why I keep a decision log", impressions: 1277, reactions: 27, comments: 2 },
    { id: "q20", on: "2026-07-09", title: "A thank-you to a mentor", impressions: 451, reactions: 12, comments: 1 },
    { id: "q21", on: "2026-07-17", title: "Notes on running a calmer sprint", impressions: 393, reactions: 5, comments: 0 },
    { id: "q22", on: "2026-07-24", title: "What I look for in a good brief", impressions: 1443, reactions: 40, comments: 6 },
    { id: "q23", on: "2026-08-02", title: "Learning from a missed deadline", impressions: 842, reactions: 19, comments: 3 },
    { id: "q24", on: "2026-09-06", title: "A short story about a hard conversation", impressions: 970, reactions: 11, comments: 1 },
  ] as LinkedInPost[]).sort((a, b) => (a.on < b.on ? -1 : a.on > b.on ? 1 : 0)),
};

/** The words around the view of her LinkedIn export. Plain counts, never a score, never a claim that her work caused them. */
export const LINKEDIN_PICTURE_COPY = {
  heading: "Your LinkedIn, from your export",
  intro: (from: string, to: string) => `${from} to ${to}. Your audience and your posts as LinkedIn reports them.`,
  followers: "Followers",
  followersSub: (n: number, from: string) => `${n > 0 ? "Up" : n < 0 ? "Down" : "Level"}${n === 0 ? "" : ` ${Math.abs(n).toLocaleString("en-US")}`} since ${from}`,
  followersCaption: "At the end of each week",
  followersSlider: "Followers by week. Use the left and right arrow keys to move through the weeks.",
  followersAt: (count: number, on: string) => `${on}: ${count.toLocaleString("en-US")} followers`,
  impressions: "Impressions",
  impressionsSub: "Across all your posts",
  impressionsCaption: "Added up from the posts in each month",
  monthsAt: (label: string, n: number, posts: number) =>
    posts === 0 ? `${label}: no posts` : `${label}: ${n.toLocaleString("en-US")} impressions from ${posts === 1 ? "1 post" : `${posts} posts`}`,
  posts: "Posts",
  postsSub: "In this export",
  postsCaption: "The three LinkedIn showed most, by impressions",
  reactionsComments: (r: number, c: number) => `${r} reactions · ${c} comments`,
  empty: "There is nothing in this export yet.",
} as const;
