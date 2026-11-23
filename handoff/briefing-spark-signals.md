# Briefing: Spark Signals

18 November 2026 · Kate Hester

From the 18 November ExecEngine UX review (edit 20). The MVP pointed people at real opportunities (a show to pitch, an event to speak at), and the current product had nothing like it: Signals records what she has done, and the Briefing is news. Spark Signals add up to three opportunities a week to the Briefing, after the reads. The full rules are in the Daily Briefing spec, 3.4a; option E of the three explored.

## The section

Cleaned up the same day (option 2 of three): on the page like the reads, not in a navy box.

| Part | Words |
| --- | --- |
| Heading | Spark Signals (serif), with "Picked for you this week" at the right, under a hairline |
| Card | Kind (Podcast, Event, Publication) · name (serif) · why it fits · one line: what they want · closing date in bold ("Due Fri, Nov 13, 2026") or reading cycle |
| Buttons | **Start a pitch** (**Start a proposal** for an event), navy · an × in the corner, named "Not for me: {name}" |
| Passed | Got it. You'll see fewer like this. |
| None left | That's this week's. New ones come on Monday. |
| Under the cards | Picked by ExecEngine from your plan. Check before you reach out. |

## How it behaves

- **Where:** after the three reads, before "That's today's three." On web, in the list column under the reads.
- **A carousel** of light cards, one at a time with the next peeking, as Home's In progress, with dots and no arrow buttons. One card: no controls.
- **Start a pitch** opens Pitch Builder with the outlet chosen (`?tool=pitch&outlet={id}`): its kind as What are you pitching for? and its name as Who are you pitching?. How to reach it shows there, not on the card.
- **The ×** removes it for good and is announced. In production it also tells ExecEngine what to leave out.
- **Up to three a week,** in her field: big events, shows and publications, not local meetups. Never a way out of her company.

## Where they come from

In the prototype, three of Pitch Builder's outlets (`OUTLETS` in `mock/playbook.ts`), listed in `SPARK_SIGNAL_IDS` in `mock/briefing.ts`. In production, found each week by ExecEngine (AI) from her plan, direction and field, each checked for a live page and a date, and framed as suggestions she checks.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The section | `components/briefing/SparkSignals`, in the component catalogue |
| The words | `SPARK_SIGNALS_COPY` in `mock/briefing.ts` |
| Built from outlets, Not for me kept | `flows/daily-briefing/useBriefingPage.tsx`, `passSignal` in `lib/briefing-store.ts` |
| Pitch Builder's `outlet` start | `flows/playbook-flow/useToolFlow.tsx` |
| Styles | `.spark-signals`, `.spark-signal` in `styles/app.css` |
