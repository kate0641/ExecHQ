# Homepage: the weekly check-in

26 October 2026 · Kate Hester

Homepage Concept 4b replaces Concept 4. The page is the same except for one addition: a **weekly check-in card in Stay on track**. If you have built Concept 4, this is the whole of the change. The full behavior is in the Homepage spec, section 4.5. The admin's side is in the Admin Dashboard spec, section 2.2.

## What the person sees

One card, once a week, after the cards about their work:

- **Band:** "Your weekly check-in", with an × that means "Not now".
- **Question:** "How ready do you feel to {their direction}?". In the prototype that is "How ready do you feel to lead a broader marketing organization?".
- **Under the question:** "Your answer helps shape what comes next in your plan.", small. (It said "helps ExecHQ shape" until 28 Oct.)
- **A slider with three stops:** Not yet · Getting there · Ready. It starts on their last answer.
- **Save**, at the card's right edge, with "Same as last week" or "Changed to {word}" on its left.

After Save, the card reads back "{word} this week. Up from {start} when you started." with a small bar per week, then what the answer changes in their plan (below).

## What to build

| Piece | What it is | Where it is in the prototype |
| --- | --- | --- |
| The card | A new Stay on track card type, drawn like the others (band, question, foot) | `components/homepage/ReadinessCheckIn` |
| The slider | A new form control: the browser's range input, styled from tokens, each stop's word under the track, the screen reader hearing the word | `components/form/Slider` |
| Where it goes | After "Have you done this yet?", "What they just answered", "How did it go?" and "{Draft} is ready", before the quiet rows | `flows/homepage/concept-4b/InProgress.tsx` |
| The direction in the question | A fixed phrase per direction that reads after "How ready do you feel to" (below) | `Account.towardVerb` in `mock/account.ts` |
| The plan line | The read-back's last part: what the answer changed, and for Ready an offer with Add it and Not now | `ReadinessCheckIn`, copy in `READINESS_HOME_COPY.plan` |

Everything else on Home (the rings, the next step, the Briefing card, the Signal Picture, the five moments) is unchanged from Concept 4.

## Rules

- **Due** 7 days after the last answer, or straight away if there has never been one, and not on the first return. Never twice in a day.
- **Not now** (the ×) costs nothing. It isn't stored as an answer, isn't shown to anyone, and the card comes back next week.
- **The first answer is the starting point.** Onboarding doesn't ask.
- **Answers are 1 to 3** (Not yet, Getting there, Ready), one per week, kept on the person's account with the date.
- **The question needs a direction.** If the account has none, the question falls back to "How ready do you feel for your next move?".

## The direction in the question

Onboarding has no free text. The person picks one of 9 options and narrows it to one of 2 versions, so there are **18 directions**. Each gets a fixed phrase, written once, not generated. Most are the narrower version with its first letter lowered, "my" becoming "your" and "I" becoming "you": "Own a bigger area of the business" becomes "How ready do you feel to own a bigger area of the business?". The full table of 18 is in the Homepage spec, 4.6.

- Store the chosen direction as its id, and look the phrase up. Don't store the phrase on the account.
- With several picks, use the one they said matters most (their direction).
- When the direction changes, the question changes from the next check-in. In the prototype, editing the direction in onboarding clears `towardShort` but not `towardVerb`. A lookup by id avoids the problem.

## What the answer changes in the plan

The line under the question, "Your answer helps shape what comes next in your plan.", has to be true every week. Each answer changes the next step offered, using levers the Plan already has, and the read-back says what changed.

| Answer | Change | Plan lever it uses | Read-back |
| --- | --- | --- | --- |
| Not yet | The next step becomes its lighter version, and the week is one move at a time | The "too much effort" swap (`effort`, lighter `scope`) and the stage check-in's one-at-a-time mode | "Next on your plan: a lighter first step, one at a time." |
| Getting there | None | — | "Your plan stays as it is. Keep going." |
| Ready | Offers to bring forward the plan's next stretch step; adds it only on **Add it** | The plan brief's "bring forward" rule | "Want something bigger this week? {step}", then "Added. "{step}" is next on your plan." or "No problem. Your plan stays as it is." |

- **At most one change a week,** and never to a step already started. Stage timing is not touched.
- **"Not yet" twice in a row:** Spark offers to talk it through. **Three times:** Spark can offer a different plan, only by asking.
- **Ready with no stretch step left** behaves as Getting there.
- **The Plan page shows the change** with its usual "why it's here" line, for example "You said you're not ready yet, so this is a lighter first step."
- **In the prototype** the read-back says what would change, but the plan itself does not change.

## The data it feeds

The Admin Dashboard (Concept 1b) shows the cohort's readiness. For that, the backend needs, per cohort:

- **Each person's first and latest answer**, never shown on their own.
- **"Answered":** how many have answered at least twice.
- **"Moved up":** how many have a higher latest answer than their first.
- **The spread** of first answers and of latest answers across the three stops.

The card stays hidden on the dashboard until 10 or more have answered twice. No answer is ever shown to the organization on its own.

## Open

- **Disclosure.** Nothing on the card tells the person their answer counts in their organization's totals. The privacy policy has to cover it.
