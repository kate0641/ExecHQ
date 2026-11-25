# Profile: the privacy promise, reworded

25 November 2026 · Kate Hester

From Eric's Profile review. The line every participant reads about their organization is tightened. The full rule is in the Profile spec, section 3.3.

| | Words |
| --- | --- |
| Before | {Organization} sees totals for the whole group. It never sees you, your plan or your work. |
| Now | {Organization} sees **only** totals for the whole group. It never sees your plan or your work. |

- **"Only" makes the limit explicit.** What the organization sees is unchanged: totals for the whole group, on the Admin Dashboard.
- **"You" is gone from the second sentence.** The organization does know some things about her (it invited her, it knows she joined, and she is counted in the totals), so the promise no longer says it never sees her. It says what it never sees: her plan and her work.
- Eric proposed "only data trends" and "never sees any information about you". Neither is used: "trends" is not quite what the dashboard shows, and "any information about you" would not be true.

## Where it shows

- Profile, Edit your account and Delete your account, under Your organization.
- The sponsor's Profile, where it is quoted as "What participants are told", read from the same copy.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The line | `PROFILE_COPY.organization.member` in `mock/profile.ts` |
| Specs that quote it | `specs/profile.md`, `specs/sponsor-profile.md`, `specs/enterprise.md` |
