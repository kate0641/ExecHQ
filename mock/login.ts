/**
 * Words the Login concept uses, and the prototype's stand-ins for what a real
 * sign-in would receive.
 *
 * Decisions on 2026-09-28: an emailed link is the main way in, with a 6-digit
 * code in the same email for signing in on another device. Google and Apple
 * sit beside it, which reopens the brief's "personal email only" (flagged
 * below). The screen says the same thing whether or not an address has an
 * account, so it never reveals who is a member. After sign-in the reviewer
 * lands on Home.
 *
 * Nothing is sent. The email is drawn on screen so reviewers can see its
 * neutral subject line, which is the brief's lock-screen privacy rule.
 */

import { MAYA } from "@/mock/account";

/** The code in the drawn email. Any other six digits is the wrong code. */
export const SIGN_IN_CODE = "482913";

/** How long the resend waits, in seconds. Short, so reviewers can try it. */
export const RESEND_SECONDS = 30;

/** When the email arrives after it is asked for, in milliseconds. */
export const EMAIL_DELAY_MS = 1600;

export type Provider = "google" | "apple";

/** An account a provider's own picker might offer. `matches` is whether its
 *  address is the one on Maya's ExecHQ account. */
export interface ProviderAccount {
  id: string;
  title: string;
  detail: string;
  matches: boolean;
}

export const PROVIDER_ACCOUNTS: Record<Provider, ProviderAccount[]> = {
  google: [
    { id: "personal", title: MAYA.email, detail: "Personal: the address on her ExecHQ account", matches: true },
    { id: "work", title: "maya.chen@northwind.example", detail: "Work: her employer’s Google account", matches: false },
  ],
  apple: [
    { id: "share", title: "Share my email", detail: MAYA.email, matches: true },
    { id: "hide", title: "Hide my email", detail: "Apple makes up a relay address", matches: false },
  ],
};

export const LOGIN_COPY = {
  signIn: {
    kicker: "Welcome back",
    heading: "Sign in to ExecHQ",
    lede: "We’ll email you a link to sign in. There’s no password to remember.",
    emailLabel: "Your personal email",
    keep: "Keep me signed in on this device",
    send: "Email me a link",
    or: "or",
    providers: { google: "Google", apple: "Apple" } satisfies Record<Provider, string>,
    providerLabel: (name: string) => `Continue with ${name}`,
    newHere: "New to ExecHQ?",
    start: "Start here",
    privacy: "Private to you. Nothing here is visible to your employer.",
    empty: "Enter your email address to get a sign-in link.",
    malformed: "That doesn’t look like an email address. Check it and try again.",
  },

  inbox: {
    heading: "Check your inbox",
    lede: (email: string) =>
      `If there’s an account for ${email}, a sign-in link is on its way. It works for 15 minutes.`,
    codeLabel: "Signing in on another device? Type the code from the email.",
    codeName: "Six-digit code from the email",
    wrongCode: "That code doesn’t match. Check the latest email and try again.",
    resendIn: (seconds: number) => `Send it again in ${seconds}s`,
    resend: "Send it again",
    resent: "Sent again.",
    otherAddress: "Use a different address",
    nothing: "Nothing arrived? Check your junk folder.",
    lostAccess: "Can’t get into that inbox?",
    arrived: "New email from ExecHQ: Your sign-in link.",
  },

  /** The drawn email. The subject and preview say nothing about her career. */
  email: {
    app: "Mail",
    back: "Inbox",
    from: "ExecHQ",
    subject: "Your sign-in link",
    preview: "Here’s the link you asked for.",
    to: (email: string) => `to ${email} · now`,
    button: "Sign in to ExecHQ",
    codeLead: "Signing in on another device? Type this code instead:",
    footer:
      "This link and code work for 15 minutes and only once. If you didn’t ask for them, you can ignore this email. No one can sign in without it.",
    tryExpired: "Open it again after 15 minutes",
    note: "The subject and preview say nothing about her career, so nothing private shows on a lock screen.",
    noteLabel: "Note",
  },

  expired: {
    heading: "That link has expired",
    lede: (email: string) => `Sign-in links work for 15 minutes and only once. We can send a new one to ${email}.`,
    send: "Send a new link",
  },

  otherAccount: {
    heading: "That’s a different account",
    lede: "No ExecHQ account uses that address. Sign in with the email you used when you joined, or start fresh.",
    back: "Sign in with my email",
    fresh: "Start fresh",
  },

  picker: {
    heading: (name: string) => `Continue with ${name}`,
    lede: (name: string) => `In the product, ${name}’s own window opens here. This stands in for it.`,
  },

  recovery: {
    heading: "Can’t get into that inbox?",
    body: "Your account is tied to your personal email so it stays yours wherever you work. If you’ve lost access to it, write to us from any address and we’ll check it’s you before moving the account.",
    close: "Close",
  },

  close: "Close",
  signedIn: "Signed in.",
} as const;

/** Open questions, shown on the page as flagged notes. */
export const LOGIN_PROVISIONAL = {
  label: "Open",
  work: "This is a work Google account. The brief says personal email only, and a provider can’t tell us which is which.",
  relay:
    "With Hide My Email, Apple gives us a relay address, so it can’t match the email already on her account. How to link the two is for the client.",
  recovery: "The recovery route and how we check who someone is are still to be decided.",
  marks: "Drawn stand-ins. The real buttons follow Google’s and Apple’s own brand rules.",
} as const;

/** Shape only, like onboarding's check: something, an @, a dot after it. */
export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}
