/**
 * The signed-in person every Sprint 2 page shows: Maya Chen, the PRD's pilot
 * persona, carried on from onboarding (same name, email and website as the
 * onboarding mocks).
 *
 * What the account holds follows the Sprint 2 brief's Profile contents:
 * personal email, first and last name, an optional current title, the selected
 * plan, notification settings, and the organization she
 * belongs to, if any. There is no employer or company field, by
 * rule. The current title was added on 2026-09-29 (Kate); like the rest, only
 * she sees it.
 */

/** What ExecHQ can email her about. Email is the only way it reaches her:
 *  there are no app or push notifications, no frequency setting and no quiet
 *  hours. */
export type NotifyTopic = "followUps" | "briefing" | "plan";

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
  /** Which topics are emailed to her. Follow-ups off means they only appear
   *  on Home. */
  notify: Record<NotifyTopic, boolean>;
  /** Undefined when she is not part of an organization. */
  org?: Organization;
}

/** "Maya Chen": first and last name together, whichever she has given. */
export function fullName(account: Pick<Account, "name" | "lastName">): string {
  return [account.name, account.lastName].map((part) => part?.trim()).filter(Boolean).join(" ");
}

/** Maya as she leaves onboarding: follow-ups on. The
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
  notify: { followUps: true, briefing: true, plan: true },
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
