/**
 * Words the Profile concept uses, so designers can change them without
 * touching how the page works.
 *
 * Profile and settings are one page, by decision on 2026-09-28. The account
 * itself is Maya's, read from the Loop (`mock/account.ts`, through the
 * snapshot), and every change made here is kept the way Loop changes are.
 *
 * Copy marked `provisional` answers a question the Sprint 2 brief leaves open
 * with the client: export format and scope, deletion timing and the follow-up frequency cap. Each shows on the page
 * as a flagged note, so reviewers read it as a placeholder.
 */

/** Every row that opens something: a sheet on mobile and tablet, the detail
 *  pane on web. */
export type ProfileDetailId =
  | "account"
  | "organization"
  | "delete";

export const PROFILE_COPY = {
  title: "Profile",
  back: "Home",
  noName: "Add your name",

  groups: {
    you: "You",
    settings: "Settings",
    organization: "Organization",
    data: "Your data",
    delete: "Delete account",
  },

  rows: {
    direction: "Direction",
    directionValue: "In your words",
    plan: "Plan",
    planValue: (name: string, formalName: string) => `${name} · ${formalName}`,
    notifications: "Notifications",
    notificationsValue: (on: number) => `${on} on`,
    organization: "Membership",
    noOrganization: "None",
    export: "Download your data",
    exportValue: "PDF",
    exportWorking: "Downloading…",
    exportStarted: "Your data is downloading as a PDF.",
    delete: "Delete account",
    signOut: "Sign out",
  },

  notifications: {
    heading: "Notifications",
    /** Email is the only way ExecHQ reaches a person, said on the page. */
    lead: "ExecHQ sends these by email. There are no app or push notifications.",
    items: {
      plan: { label: "Plan and follow-ups", hint: "A question after you use something, and a nudge when a step is due." },
      briefing: { label: "Daily Briefing", hint: "Three reads, once a day." },
    },
    savedOn: (label: string) => `${label} emails: on.`,
    savedOff: (label: string) => `${label} emails: off.`,
  },

  organization: {
    heading: "Your organization",
    member: (name: string) => `${name} sees a summary of everyone in the group, as a whole. Your own details stay yours.`,
    joined: "Joined",
    never: "What stays private",
    leave: "Leave organization",
    confirmHeading: (name: string) => `Leave ${name}?`,
    confirmBody: "You keep your account and everything in it. You drop out of the group’s summary.",
    confirm: "Leave",
    keep: "Stay a member",
    left: (name: string) => `You left ${name}.`,
    noneLead: "You are not part of an organization. This account is yours alone.",
    noneHint: "If a program invites you, it will show up here, with exactly what it can see.",
  },

  account: {
    heading: "Your account",
    nameLabel: "Name",
    edit: "Edit",
    editHeading: "Edit your account",
    firstNameLabel: "First name",
    lastNameLabel: "Last name",
    titleLabel: "Current title (optional)",
    titleHint: "As you’d say it yourself. Never your employer.",
    firstNameMissing: "Add your first name.",
    lastNameMissing: "Add your last name.",
    emailMissing: "Add your email.",
    emailInvalid: "Check your email. It should look like name@example.com.",
    emailLabel: "Email",
    save: "Save",
    cancel: "Cancel",
    saved: "Saved.",
  },

  direction: {
    heading: "Your direction",
    body: (plan: string) =>
      `You wrote this during onboarding. Your plan, ${plan}, is built around it, so you change it from your Plan.`,
    toPlan: "Go to your Plan",
  },

  export: {
    heading: "Download your data",
    body: "One file with everything you’ve made here and everything you told us happened.",
    includes: {
      drafts: (titles: string[]) =>
        titles.length === 1 ? `Your draft: ${titles[0]}` : `Your ${titles.length} drafts: ${titles.join(", ")}`,
      loop: "Your Loop record: every status and outcome, with dates",
      answers: "Your direction and your onboarding answers",
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
    body: (email: string) => `Next time, we’ll email a login code to ${email}.`,
    confirm: "Sign out",
    stay: "Stay signed in",
    doneHeading: "You’re signed out",
    doneBody: "We’ll email you a login code when you want to sign back in.",
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
  revoke: "What revoking deletes needs confirming with the client.",
} as const;
