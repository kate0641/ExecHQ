# Homepage: the weekly check-in

26 October 2026 · Kate Hester

Homepage Concept 4b replaces Concept 4. The page is the same except for one addition: a **weekly check-in card in Stay on track**. If you have built Concept 4, this is the whole of the change. The full behavior is in the Homepage spec, section 4.5. The admin's side is in the Admin Dashboard spec, section 2.2.

## What the person sees

One card, once a week, after the cards about their work:

- **Band:** "Your weekly check-in", with an × that means "Not now".
- **Question:** "How ready do you feel to {their direction}?". In the prototype that is "How ready do you feel to lead a broader marketing organization?".
- **Under the question:** "Your answer helps ExecHQ shape what comes next in your plan.", small.
- **A slider with three stops:** Not yet · Getting there · Ready. It starts on their last answer.
- **Save**, at the card's right edge, with "Same as last week" or "Changed to {word}" on its left.

After Save, the card reads back "{word} this week. Up from {start} when you started." with a small bar per week.

## What to build

| Piece | What it is | Where it is in the prototype |
| --- | --- | --- |
| The card | A new Stay on track card type, drawn like the others (band, question, foot) | `components/homepage/ReadinessCheckIn` |
| The slider | A new form control: the browser's range input, styled from tokens, each stop's word under the track, the screen reader hearing the word | `components/form/Slider` |
| Where it goes | After "Have you done this yet?", "What they just answered", "What came of it?" and "{Draft} is ready", before the quiet rows | `flows/homepage/concept-4b/InProgress.tsx` |
| The direction in the question | A short form of the person's direction that reads after "How ready do you feel to" | `Account.towardVerb` in `mock/account.ts` |

Everything else on Home (the rings, the next step, the Briefing card, the Signal Picture, the five moments) is unchanged from Concept 4.

## Rules

- **Due** 7 days after the last answer, or straight away if there has never been one, and not on the first return. Never twice in a day.
- **Not now** (the ×) costs nothing. It isn't stored as an answer, isn't shown to anyone, and the card comes back next week.
- **The first answer is the starting point.** Onboarding doesn't ask.
- **Answers are 1 to 3** (Not yet, Getting there, Ready), one per week, kept on the person's account with the date.
- **The question needs a direction.** If the account has no short direction, the question falls back to "How ready do you feel for your next move?".

## The data it feeds

The Admin Dashboard (Concept 1b) shows the cohort's readiness. For that, the backend needs, per cohort:

- **Each person's first and latest answer**, never shown on their own.
- **"Answered":** how many have answered at least twice.
- **"Moved up":** how many have a higher latest answer than their first.
- **The spread** of first answers and of latest answers across the three stops.

The card stays hidden on the dashboard until 10 or more have answered twice. No answer is ever shown to the organization on its own.

## Open

- **"Your answer helps ExecHQ shape what comes next in your plan."** The plan has to actually respond to the answer. How is not yet designed.
- **Disclosure.** Nothing on the card tells the person their answer counts in their organization's totals. The privacy policy has to cover it.
- **The short direction** ("lead a broader marketing organization") is written by hand in the prototype. The product needs a way to make it from the person's own words at onboarding.
