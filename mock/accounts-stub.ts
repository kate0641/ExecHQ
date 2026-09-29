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
  heading: "What your accounts say",
  sub: "Numbers from your accounts, as of the dates shown. Only you see this.",
  subNotConnected: "Not connected yet. Only you would see this.",
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

/* Concept 3's simpler version: one row per account, a finding and the one
   thing to try, no numbers grid or chart (decided 2026-09-29). */
export const ACCOUNTS_ROWS = {
  heading: "What your accounts say",
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
