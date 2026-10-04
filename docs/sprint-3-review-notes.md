# Sprint 3 — The Plan: review notes

_Updated 4 October 2026 for the Concept 1 tweak: see section 8._

For the Wednesday presentation and the Thursday client review. Written 4 October 2026 from the built prototype. Everything below is in `main`; nothing is pushed yet.

## 1. Say this at kickoff

**The homepage's Signal Picture is not the approved design.** Homepage Concept 2 previewed a provisional Signal Picture. The Sprint 3 version (`/plan/*`) replaces it, and any differences have to be reconciled before the homepage is finalised. The homepage also still reads Sprint 2's stub steps and works out its own current stage, so it does not yet see what a user saves on the Plan.

**"Active Landscape" is now "action steps"** everywhere in the prototype. The source PDF still says Active Landscape.

## 2. Framing note: the six channels

Not yet seen: Erik's 12 September email. This is built from the brief and from your note that he defended the six-channel framework there and that this is the second time it has been demoted. Check it against the email before presenting.

**What changed.** The Signal Picture is organised by plan area (the 30-day view groups by "Being seen as a leader", "A broader remit", "Time with the people who decide"). The channel is a tag on each item, not the way the record is cut.

**Why, in one line.** In a leadership-scope plan most movement is internal: a brief used in a 1:1, a pitch sent for a planning review. Cut by channel, most of the record would sit under "other". Cut by plan area, every item says what it moved.

**What is kept.**
- Every item that has a channel shows it as a visible tag: Published, Spoke, Podcast appearance, Press mention.
- The entry flow still asks which kind of activity it was, so channel data is captured for every outside item.
- The channels do real work elsewhere: declining a step as "uncomfortable channel" removes that channel from every later suggestion.

**What to offer Erik rather than let him find.** A plan-area view and a channel view are two cuts of the same items. We chose the area view as the default because the plan is the product's spine. A channel view is a small addition if the framework needs to stay visible to him.

**Gaps to know about before he asks.**
- The brief's open question lists LinkedIn as its own channel; its Signal Picture section lists five types without it. The entry flow currently has Published, Spoke, Podcast appearance, Press mention and Something else, so a LinkedIn post is entered as Published. Decide whether LinkedIn gets its own type.
- AI discoverability is left out, per the deck's limit that V1 covers signals a tool can move.

## 3. The Momentum A/B cannot be settled by the pilot

**The thing that separates the concepts is the 90-day label.** Concept A (Momentum, a labeled trend) and Concept B (Plan progress, counts only) show the same three counts for 7 days, and nearly the same for 30. They differ at 90 days, and at 30 days in how it is worded. A pilot user will have about three weeks of history, so the 90-day view will not fill for any of them. Usage data cannot pick between the concepts. Pilot metrics (the success table's "preference between Momentum Concepts A and B", "reaction to 'needs attention'") only work in sessions where the history is shown, not lived.

**How to test it.** In the prototype, `/plan/concept-1` has a dashed reviewer control above Momentum:
- **Concept A / B** switches the concept.
- **Show 95 days of history** makes the 90-day view real.
- **Needs attention / Quieter lately** swaps the label wording.

Same data, both concepts, in a session. Ask three things:
1. Does "Needs attention" read as candour or as a grade, against "Quieter lately"?
2. Do counts alone (B) give enough sense of direction?
3. What does she do next after seeing each? (The label always sits beside her next move; watch whether she takes it.)

**Placeholder in A.** What counts as building, steady or needs attention is not defined. The prototype compares the last 45 days with the 45 before and calls a gap of more than one either way. It says "Placeholder rule · D&T to define" on screen. D&T need to give the real thresholds before A can show realistic states.

**Decline and defer.** Neither concept counts a declined or deferred step in anything, and neither says her activity caused a result.

## 4. What the system does with a decline

The brief captures six reasons and says declining is never penalised, but not what happens next. Built:

| Reason | What it does |
| --- | --- |
| Uncomfortable channel | That channel is never offered again. The replacement says "Nothing on podcasts, from here on." |
| Too much effort | The replacement is lighter, and says "A lighter one this time" only when it is. |
| Not relevant | The replacement is a different area and a different kind of step. |
| Wrong timing | The step comes back once, after 14 days, with no reminder. |
| Already done | Offers to add it to her record. |
| Other, or no reason | A different step. |

Every replacement carries its own why this / why now / why you, and is never the same type, area and channel as what left, so a second decline is heard.

**No conveyor belt.** One replacement per horizon per visit, then the place stays empty and says so. "Keep what I have" stops replacement altogether. Empty places say why: nothing suitable, kept workload, or limit reached for this visit.

This is also where the homepage rejection point lands: a rejected step changes what comes next, visibly.

## 5. Open decisions, with a recommendation

| # | Decision | Recommendation |
| --- | --- | --- |
| 1 | Cap: one replacement per horizon per visit | Keep; the constant is `MAX_REPLACEMENTS_PER_HORIZON` |
| 2 | Wrong-timing decline returns once after 14 days | Keep; it makes the reason do something |
| 3 | An avoided channel stays avoided, with no way to undo it yet | Add a setting in Profile |
| 4 | Fourth stage added to four of the plans (onboarding shows three) | Review wording on `/plan/templates`; then update onboarding or drop them |
| 5 | Stage advances only when she confirms | Keep, per the brief. The homepage must read her confirmed stage |
| 6 | All Loop events are "Recorded in ExecHQ" (the brief); Sprint 2 called a "used" event "Your word" | Follow the brief; update Homepage Concept 2's wording |
| 7 | Reported entries default to the plan area "Being seen as a leader" unless added from an artifact | Replace with an area picker if outside activity needs to reach other areas |
| 8 | "Where you started" (homepage baseline counts) sits under the new Signal Picture | Merge once a homepage concept is chosen |
| 9 | Plans other than Step up have no steps written; the Plan says so after a switch | Write them in Sprint 4 |
| 10 | Momentum follow-through counts the plan's accepted set, not her saved declines | Wire it to saved decisions if the concept survives |
| 11 | Narrative is rule-based, standing in for the model | Fine for review; smooth the wording for presentation |
| 12 | The next-step offer after a published post can only be seen in the catalogue (no Maya scenario has one) | Add a published-post scenario if reviewers should see it live |

## 6. Where to look

Open `/plan/concept-1`, `/plan/concept-2` and `/plan/concept-3` (the three layouts), `/plan/templates` (all five roadmaps), and the component catalogue for each state: ActionStepCard, ActionSteps, PlanRoadmap, TemplateRoadmaps, PlanSignalPicture, SignalEntrySheet, MomentumLabeled, MomentumCounts, PlanNarrative.

The dock's scenario picker (1–5) shows the Plan at one, sixteen, eighteen and thirty days of history. The 90-day view needs the reviewer switch.

**Review order that works:** Concept 1 on mobile (the five steps, then decline a podcast pitch and watch the reply); then thin versus full history on the Signal Picture; then Momentum A against B with the 95-day switch on; then Concepts 2 and 3 for layout.

## 7. Not done, on purpose

- **No interaction spec.** `specs/plan.md` waits for approved concepts.
- **No statuses changed.** Every concept and component is still `draft`.
- **No model.** Ranking, narrative and the label rules are mock stand-ins.
- **Monthly and quarterly reviews, the custom-plan wizard, IC versus management paths, the Toolbox flows beyond the stub:** out of scope per the brief.

## 8. Concept 1 tweak: roadmap as a calendar, her direction, stage periods

Built after the first review, on Plan Concept 1 only (Concepts 2 and 3 still use the earlier roadmap). Chosen from three options: **C, the Agenda, with A, the Calendar, beside it.**

**What changed**
- **Her direction** sits at the top, in her own words, editable at any time. Saving never changes her plan ("Saved. Your plan stays as it is"), and "Why this plan" keeps the reason she was given.
- **The roadmap is an Agenda:** stage cards with a suggested period, what finishing looks like, and what is on her calendar inside each stage. The stage she is in is open and the rest are one tap away.
- **The Calendar** is a month grid with the stages tinted across it, her own items (added by hand, with edit and delete), and her plan steps. On a phone it is a switch beside the Agenda; on tablet and web the two sit side by side and stay linked. The grid is one tab stop with arrow-key navigation.
- **Finishing a stage recommends the next.** She can say she has finished at any time, or her work can suggest it. Starting the next stage moves the later windows. "Not yet" leaves the next stage marked and never nags.
- **Plan steps are on the calendar** as a suggested day, pinned when she accepts, movable with a date picker.

**Decision reversed: periods against "no end date."** On 29 September we decided a plan has no end date and stages are an order, not a schedule. Periods reverse that. They are a suggested pace that moves as she does, never a deadline, and the plan carries on after the last stage. If the periods are firmer in the product, it changes the "past the suggested pace" wording and nothing else.

**Open items**
| # | Decision | Recommendation |
| --- | --- | --- |
| 13 | Onboarding still shows stages with no lengths, so onboarding and the Plan disagree | Show the periods in onboarding too, once this concept is approved |
| 14 | "Get ready for a big moment" runs to the date of the moment, not four weeks | Tie its stage windows to that date |
| 15 | A step's suggested day is a mock rule (an event it is tied to, else its horizon) | Replace with the real timing when the model exists |
| 16 | Her calendar is manual only; V1 has no connections, so nothing syncs from Google or Outlook | Keep for V1 |
| 17 | The Calendar covers only the months the plan and her items cover | Keep; it is a roadmap view, not a general calendar |
| 18 | In greyscale the stage tints are close, so the start markers (S1, S2) and the legend carry the stages | Check the tints once the real palette lands |
| 19 | The homepage still works out its own current stage and does not see her confirmed stage or her calendar | Reconcile when a homepage concept is chosen |
