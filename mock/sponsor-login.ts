/**
 * Admin login, was Sponsor login (Kate, 2026-10-23). How an admin, the person at the client
 * who runs the program, gets back into the enterprise dashboard. Desktop
 * only. The same three ways in as participants (an emailed code, Google,
 * Apple) and the same rules: no password, and the code screen never says
 * whether an account exists. What differs is the address (their work email,
 * which ExecHQ set up when the program was agreed), that there is no sign-up,
 * and the privacy line, which says what a sponsor sees.
 *
 * Shared with the participant Login, not copied: the code, the code's rules
 * and the drawn email come from mock/login.ts.
 */

import { SPONSOR_PERSON, SPONSOR_PROFILE_COPY } from "@/mock/enterprise";
import type { Provider, ProviderAccount } from "@/mock/login";

/** What a provider's own picker might offer a sponsor: their work account,
 *  which matches, and the one that doesn't. */
export const SPONSOR_PROVIDER_ACCOUNTS: Record<Provider, ProviderAccount[]> = {
  google: [
    { id: "work", title: SPONSOR_PERSON.email, detail: "Work: the address ExecHQ set up for you", matches: true },
    { id: "personal", title: "dana.okafor@gmail.example", detail: "Personal", matches: false },
  ],
  apple: [
    { id: "share", title: "Share my email", detail: SPONSOR_PERSON.email, matches: true },
    { id: "hide", title: "Hide my email", detail: "Apple makes up a relay address", matches: false },
  ],
};

export const SPONSOR_LOGIN_COPY = {
  /** The one serif line on the dark panel. */
  quote: "See how your leaders are putting their plans into practice.",
  suffix: "Enterprise",

  signIn: {
    kicker: "Welcome back",
    heading: "Log in to ExecHQ Enterprise",
    lede: "Use the work email your ExecHQ contact set up for you.",
    emailLabel: "Your work email",
    keep: "Keep me logged in on this computer",
    send: "Log in",
    or: "or",
    notSetUp: "Not set up yet? Your ExecHQ contact sends the invitation.",
  },

  inbox: {
    lostAccess: "Can’t get into that inbox?",
  },

  otherAccount: {
    heading: "That account isn’t set up",
    lede: "No ExecHQ Enterprise account uses that address. Log in with the work email your ExecHQ contact set up.",
    back: "Log in with my work email",
  },

  /** The line at the foot of the page, and what "Learn more" opens. */
  private: {
    line: "Totals for your cohort. Never a participant.",
    more: "Learn more",
    heading: "What you can see",
    points: SPONSOR_PROFILE_COPY.privacy.points,
    told: SPONSOR_PROFILE_COPY.privacy.told,
    close: "Got it",
  },

  recovery: {
    heading: "Can’t get into that inbox?",
    body: `Write to your ExecHQ contact from any address. They can check the email on your account, and send a new invitation if it has changed.`,
    close: "Close",
  },

  signedIn: "Logged in.",
} as const;
