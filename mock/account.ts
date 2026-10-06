/**
 * The signed-in person every Sprint 2 page shows: Maya Chen, the PRD's pilot
 * persona, carried on from onboarding (same name, email and website as the
 * onboarding mocks).
 *
 * What the account holds follows the Sprint 2 brief's Profile contents:
 * personal email, first and last name, an optional current title, the selected
 * plan, the LinkedIn and website connections with exactly what each shares,
 * notification, frequency and permission settings, and the organization she
 * belongs to, if any. There is no employer or company field, by
 * rule. The current title was added on 2026-09-29 (Kate); like the rest, only
 * she sees it.
 */

export type ConnectionId = "linkedin" | "website";

/** What ExecHQ can email her about. Email is the only way it reaches her:
 *  there are no app or push notifications, no frequency setting and no quiet
 *  hours. */
export type NotifyTopic = "followUps" | "briefing" | "plan";
export type UseId = "loop" | "connections" | "drafts";

/** The organization she belongs to, if one gave her the account. It is never
 *  her employer's view of her: it holds what the organization may see. */
export interface Organization {
  name: string;
  role: string;
  joinedOn: string;
  /** Exactly what the organization can see, in plain words. */
  sees: string[];
  /** What it never sees. */
  never: string[];
}

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
  /** First name. It is what the greeting uses. */
  name?: string;
  lastName?: string;
  /** Optional. Her title today, in her own words. Never an employer. */
  jobTitle?: string;
  /** Her direction, in her own words from onboarding. */
  direction: string;
  /** The same direction, short enough to follow "toward" on the homepage:
   *  "leading a broader marketing organization". Written by hand in the
   *  prototype; the product needs a way to make it from her words. */
  towardShort?: string;
  plan: {
    id: string;
    name: string;
    formalName: string;
    /** When the plan began. It has no end date (decided 2026-09-29). */
    startedOn: string;
  };
  connections: Connection[];
  /** Which topics are emailed to her. Follow-ups off means they only appear
   *  on Home. */
  notify: Record<NotifyTopic, boolean>;
  /** What ExecHQ may draw on to suggest her next step. */
  uses: Record<UseId, boolean>;
  /** Undefined when she is not part of an organization. */
  org?: Organization;
}

/** "Maya Chen": first and last name together, whichever she has given. */
export function fullName(account: Pick<Account, "name" | "lastName">): string {
  return [account.name, account.lastName].map((part) => part?.trim()).filter(Boolean).join(" ");
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
 *  five homepage states in `mock/homepage.ts` build on this. */
export const MAYA: Account = {
  email: "maya.chen@example.com",
  name: "Maya",
  lastName: "Chen",
  jobTitle: "Senior Director, Campaigns",
  direction:
    "I want to move from running campaigns to leading a broader marketing organization.",
  towardShort: "leading a broader marketing organization",
  plan: {
    id: "leadership-scope",
    name: "Step up",
    formalName: "Increase leadership scope",
    startedOn: "2026-10-05",
  },
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
  notify: { followUps: true, briefing: true, plan: true },
  uses: { loop: true, connections: true, drafts: true },
  org: {
    name: "Northgate Leadership Programme",
    role: "Member",
    joinedOn: "2026-09-14",
    sees: ["a summary of everyone in the group, as a whole"],
    never: [
      "your name, email and role",
      "your direction, drafts, progress record and plan",
    ],
  },
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
