/**
 * The signed-in person every Sprint 2 page shows: Maya Chen, the PRD's pilot
 * persona, carried on from onboarding (same name, email and website as the
 * onboarding mocks).
 *
 * What the account holds follows the Sprint 2 brief's Profile contents:
 * personal email, optional name, the selected plan, the LinkedIn and website
 * connections with exactly what each shares, and the follow-up email setting.
 * There is no employer, company or title field, by rule. The role Maya gave
 * during onboarding lives in her story, not on her account.
 */

export type ConnectionId = "linkedin" | "website";

export interface Connection {
  id: ConnectionId;
  label: string;
  /** How it comes in. LinkedIn is an uploaded analytics export, by decision
   *  on 2026-09-28, not a sign-in. */
  method: string;
  connected: boolean;
  connectedOn?: string;
  /** What it points at, once connected: a file name or an address. */
  source?: string;
  /** Exactly what was shared, in plain words. Shown on Profile so every
   *  connection can be read before it is revoked. */
  shares: string[];
}

export interface Account {
  email: string;
  /** Optional. The only personal detail beyond the email. */
  name?: string;
  /** Her direction, in her own words from onboarding. */
  direction: string;
  plan: { id: string; name: string; formalName: string };
  connections: Connection[];
  /** Loop follow-ups by email. Off means they only appear on Home. */
  emailFollowUps: boolean;
}

export const LINKEDIN_SHARES = [
  "How your posts performed over the last year",
  "Your follower count and how it changed",
  "The seniority, roles and industries of the people who see your posts",
];

export const WEBSITE_SHARES = [
  "The public pages at the address you gave, read to learn how you write",
];

/** Maya as she leaves onboarding: nothing connected, follow-ups on. The
 *  snapshots in `mock/snapshots.ts` build on this. */
export const MAYA: Account = {
  email: "maya.chen@example.com",
  name: "Maya",
  direction:
    "I want to move from running campaigns to leading a broader marketing organisation.",
  plan: { id: "leadership-scope", name: "Step up", formalName: "Increase leadership scope" },
  connections: [
    {
      id: "linkedin",
      label: "LinkedIn",
      method: "Analytics export you upload",
      connected: false,
      shares: LINKEDIN_SHARES,
    },
    {
      id: "website",
      label: "Personal website",
      method: "Address you give us",
      connected: false,
      shares: WEBSITE_SHARES,
    },
  ],
  emailFollowUps: true,
};

/** Maya's account with one connection switched on. */
export function withConnection(
  account: Account,
  id: ConnectionId,
  on: string,
  source: string
): Account {
  return {
    ...account,
    connections: account.connections.map((c) =>
      c.id === id ? { ...c, connected: true, connectedOn: on, source } : c
    ),
  };
}
