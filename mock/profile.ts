/**
 * Words the Profile concept uses, so designers can change them without
 * touching how the page works.
 *
 * Profile and settings are one page, by decision on 2026-09-28. The account
 * itself is Maya's, read from the Loop (`mock/account.ts`, through the
 * snapshot), so what is connected depends on the homepage state picked in the
 * dock, and every change made here is kept the way Loop changes are.
 *
 * Copy marked `provisional` answers a question the Sprint 2 brief leaves open
 * with the client: export format and scope, deletion timing, what revoking a
 * connection removes, and the follow-up frequency cap. Each shows on the page
 * as a flagged note, so reviewers read it as a placeholder.
 */

import type { ConnectionId } from "@/mock/account";

/** Every row that opens something: a sheet on mobile and tablet, the detail
 *  pane on web. */
export type ProfileDetailId =
  | "account"
  | "direction"
  | "linkedin"
  | "website"
  | "follow-ups"
  | "export"
  | "delete"
  | "sign-out";

export const PROFILE_COPY = {
  title: "Profile",
  back: "Home",
  noName: "Add your name",

  groups: {
    you: "You",
    connections: "Connections",
    email: "Email",
    briefing: "Briefing",
    data: "Your data",
  },

  rows: {
    direction: "Direction",
    directionValue: "In your words",
    plan: "Plan",
    planValue: (name: string, week: number) => `${name} · Week ${week}`,
    email: "Email",
    connected: "Connected",
    notConnected: "Not connected",
    followUps: "Loop follow-ups",
    publishers: "Publishers you follow",
    delivery: "Briefing delivery",
    later: "With the Briefing",
    export: "Download your data",
    delete: "Delete account",
    signOut: "Sign out",
  },

  followUps: {
    label: "Loop follow-ups by email",
    on: "One question after you use something, at most one a week. The subject line never says what it’s about.",
    off: "Off. Follow-ups show on Home only, when you sign in.",
    turnedOn: "Follow-up emails on.",
    turnedOff: "Follow-up emails off. They’ll show on Home instead.",
    detail: (email: string) =>
      `When you’ve used something, we ask once what came of it. Emails go to ${email} and the subject line never says what they’re about, so nothing sensitive shows on a lock screen.`,
  },

  owner: "This account is yours, and it stays yours. Nothing here is shared with anyone.",

  account: {
    heading: "Your account",
    nameLabel: "Name (optional)",
    nameHint: "Only used to greet you. Leave it empty and we’ll just say hello.",
    emailLabel: "Email",
    emailHint: "Your personal email. It’s how you sign in.",
    save: "Save",
    cancel: "Cancel",
    saved: "Saved.",
    removed: "Name removed.",
  },

  direction: {
    heading: "Your direction",
    body: (plan: string) =>
      `You wrote this during onboarding. Your plan, ${plan}, is built around it, so you change it from your Plan.`,
    toPlan: "Go to your Plan",
  },

  connection: {
    shares: "What it shares",
    wouldShare: "What it would share",
    since: (source: string, on: string) => `${source} · since ${on}`,
    connect: (label: string) => `Connect ${label}`,
    remove: (label: string) => `Remove ${label}`,
    confirmHeading: (label: string) => `Remove ${label}?`,
    confirmBody: (source: string) =>
      `ExecHQ stops using ${source} and deletes what it took from it. Drafts you’ve already made stay as they are.`,
    keep: "Keep it",
    connectedToast: (label: string) => `${label} connected.`,
    removedToast: (label: string) => `${label} removed.`,
    why: {
      linkedin: "So we can see how far your posts reach, and who they reach.",
      website: "So we can learn your voice from your own writing.",
    } satisfies Record<ConnectionId, string>,
    upload: "Upload the spreadsheet",
    uploadHint: "The .xlsx file from LinkedIn’s analytics export",
    sample: "Use a sample file",
    sampleSource: "LinkedIn analytics export, October 2026",
    wrongFile:
      "That doesn’t look like a LinkedIn analytics export. It should be the .xlsx file. Try again, or leave it for now.",
    siteLabel: "Your website address",
    sitePlaceholder: "https://",
    siteExample: "mayachen.com",
    badSite: "That doesn’t look like a web address. Check it and try again, for example mayachen.com.",
    connectSite: "Connect website",
  },

  export: {
    heading: "Download your data",
    body: "One file with everything you’ve made here and everything you told us happened.",
    includes: {
      drafts: (titles: string[]) =>
        titles.length === 1 ? `Your draft: ${titles[0]}` : `Your ${titles.length} drafts: ${titles.join(", ")}`,
      loop: "Your Loop record: every status and outcome, with dates",
      answers: "Your direction and your onboarding answers",
      connections: "Your connections, and what each one shared",
    },
    formatLabel: "File format",
    formats: {
      pdf: { name: "PDF", description: "To read or print" },
      json: { name: "JSON", description: "To take to another tool" },
    },
    prepare: "Prepare download",
    ready: (file: string) =>
      `Ready. In the product this saves ${file}. The prototype doesn’t make a file.`,
    fileName: (format: string) => `exechq-maya-chen.${format}`,
    done: "Done",
  },

  delete: {
    heading: "Delete your account",
    body: "This removes everything below, straight away. It can’t be undone.",
    removes: {
      account: (email: string) => `Your account and ${email}`,
      answers: "Your direction and onboarding answers",
      drafts: (count: number) => (count === 1 ? "Your draft" : `Your ${count} drafts`),
      loop: "Your Loop record",
      connection: (label: string) => `Your ${label.toLowerCase()} connection and what it shared`,
    },
    copyFirst: "Want a copy first?",
    confirm: "Delete my account",
    keep: "Keep my account",
    doneHeading: "Your account is deleted",
    doneBody: "Everything on the list is gone. If you come back, you’ll start fresh.",
    reset: "Reset this page",
  },

  signOut: {
    heading: "Sign out?",
    body: (email: string) => `Next time, we’ll email a sign-in link to ${email}.`,
    confirm: "Sign out",
    stay: "Stay signed in",
    doneHeading: "You’re signed out",
    doneBody: "We’ll email you a link when you want to sign back in.",
    back: "Sign back in",
  },

  /** On web, the detail pane before anything is picked has the account open. */
  close: "Close",
  toPlanToast: "In the prototype, this opens your Plan.",
} as const;

/** The open questions, shown as flagged notes beside the copy they affect. */
export const PROFILE_PROVISIONAL = {
  label: "Open",
  export: "Format and scope are still to be decided with the client.",
  delete: "Immediate or with a grace period is still to be decided. This copy assumes immediate.",
  revoke: "What revoking deletes needs confirming with the client.",
  followUps: "“At most one a week” stands in for the frequency cap the brief asks for.",
} as const;
