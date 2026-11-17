# Home: the stage she is in, and every stage counted

17 November 2026 · Kate Hester

Home's section, What you're working on now, now says which stage she is in, as the plan page that ends onboarding does. Putting the two side by side showed they counted differently: onboarding said "Stage 1 of 3", the Plan page and Home "1 of 4", because each plan's roadmap adds a stage onboarding left out. Now every page counts them all. Onboarding spec 3.9 and decision 44; Homepage spec 2.

## What changed

| Where | Was | Now |
| --- | --- | --- |
| Home, under What you're working on now | Nothing | STAGE 1 OF 4 · SAY WHAT YOU LEAD, in small capitals; muted grey by day, light on the night sky |
| Onboarding's Your plan, the stage line | STAGE 1 OF 3 · SAY WHAT YOU LEAD | STAGE 1 OF 4 · SAY WHAT YOU LEAD |
| Onboarding's Your plan, The stages ahead | 2 more: Show the proof, Get in front of the deciders | 3 more: Show the proof, Get in front of the deciders, Make the case (Done when you've asked for the broader role, with your record behind you.) |

The stage on Home is the one the Plan page shows as current, worked out the same way (her work, her confirmed stage, the scenario she started in), so the two always agree. Each plan's added stage is in `ADDED_STAGES` in `mock/plan.ts`; Step Up's is Make the case.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| Home's line | `MAP_COPY.stage` in `mock/homepage.ts`; worked out in `flows/homepage/concept-4b/HomepageConcept4b.tsx` with `roadmapWindows` |
| Onboarding's stages | `roadmapFor(plan.id)` in `case "plan-week"`, `flows/onboarding/concept-3/OnboardingConcept3.tsx` (was the template's own stages) |
| Styles | `.map-home__head`, `.map-home__stage` in `styles/app.css` |
