# Profile: no Leave organization

25 November 2026 · Kate Hester

A member can no longer leave their organization from Profile. The rule is in the Profile spec, sections 3.3 and 4.2.

## What changes

- **Your organization is read only.** It keeps its lead ("{Organization} sees only totals for the whole group. It never sees your plan or your work.") and **What stays private**. The **Leave organization** button is gone.
- **The leave dialog is gone too:** "Leave {Organization}?", **Leave** and **Stay a member**, and the "You left {Organization}." message.
- Someone who is not a member still sees no Your organization section, as before.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The section | `components/profile/OrganizationDetail/OrganizationDetail.tsx` |
| The page | `flows/profile/concept-1/ProfileConcept1.tsx` (no `organization` sheet) |
| The words | `PROFILE_COPY.organization` in `mock/profile.ts` |
| Catalogue | `OrganizationDetail.states.ts`; the playground no longer lists "Leave your organization" |
