# Plan: when a move falls

9 November 2026 · Kate Hester

No change to what the person sees. This sets down, exactly, how the Plan decides the time on each move ("This week", "Next month") and on each stage, so it can be built the same way. Until now these rules lived only in the prototype's code. The full rules are in the Plan spec, section 4.7; this note is the summary, and four choices in it are still open (below).

## The idea

Every step has a real day underneath, so the calendar, the roadmap and the check-ins work. The person never sees that day on a move. They see the stretch it falls in, in words, because a date on a card reads as a deadline.

## 1. The suggested day

Worked out when the step is offered. The first rule that applies wins.

| Step | Suggested day |
| --- | --- |
| Tied to a weekly event (their 1:1, a standing check-in) | The next time that weekday comes round, today included |
| Tied to the end of the month | The last weekday of this month; if that has passed, of next month |
| Tied to a fixed date | That date; if it has passed, today |
| Short-term, nothing to tie it to | Today + 3 days |
| Medium-term, nothing to tie it to | Today + 14 days |
| Long-term, nothing to tie it to | Today + 60 days |

- Never before today.
- **Not yet on their plan:** worked out afresh from each day's date.
- **Pinned** by **I'll do it {when}**, the start button, or **Change when**. A pinned day never moves on its own; only the person moves it. A step that leaves their plan loses its day.
- **Steps are not spaced apart.** Each day is worked out on its own, so steps offered together can share one.

In production, which steps are tied to an event, and the event's day, come from what the person has told ExecHQ. The prototype uses a fixed list.

## 2. The words for a day

The first stretch the day falls in, nearest first, against today every time it is shown:

| Words | Runs to |
| --- | --- |
| This week | This Sunday (weeks run Monday to Sunday). Days already past count too |
| Next week | The Sunday after |
| This month | The end of this calendar month |
| Next month | The end of next calendar month |
| This quarter | The end of this calendar quarter |
| Next quarter | The end of next calendar quarter |
| Later | Anything after |

Used on the move's kicker, **I'll do it {when}**, each roadmap line's pill, and each stage's head.

## 3. Change when

- Offers This week to Next quarter, nearest first.
- Leaves out a stretch that a nearer one has already covered. In November, "This quarter" ends with "Next month", so it is left out.
- Each choice pins the last weekday of its stretch (never before today), so the step reads back as the choice they made.

## 4. Stages

- Each stage is suggested to last 4 weeks.
- Stage 1 starts the day their plan began, and each next stage starts the day after the last one ends.
- A stage ends on the day they finished it. If they are past it with no day recorded, it ends today, unless its 4 weeks ended sooner. Otherwise it ends 4 weeks after it started.
- Finishing early pulls later stages earlier; finishing late pushes them later.
- Running past 4 weeks is never flagged.

## Worked example: Monday 9 November 2026

| | Day | Shown as |
| --- | --- | --- |
| Short-term step | Thu 12 Nov | This week |
| Medium-term step | Mon 23 Nov | This month |
| Long-term step | Fri 8 Jan 2027 | Next quarter |
| Tied to a Tuesday 1:1 | Tue 10 Nov | This week |

**Change when** offers This week (Fri 13 Nov), Next week (Fri 20 Nov), This month (Mon 30 Nov), Next month (Thu 31 Dec) and Next quarter (Wed 31 Mar 2027).

## Still open

These are the Plan spec's decisions to confirm, 8 to 11. Build what is above until they are settled.

1. **Spacing.** Up to three short-term moves can all say "This week". A rule could stagger them.
2. **The offsets.** The plan rules give medium-term as about 30 to 60 days and long-term as a quarter or longer, against 14 and 60 days here.
3. **"Later" in Change when.** It is not offered, and would need a day to stand for.
4. **Stage length.** Every stage is 4 weeks; each plan could set its own.

## Where it is in the prototype

| Piece | File |
| --- | --- |
| The suggested day | `lib/step-dates.ts` |
| The event-tied steps and the horizon offsets | `STEP_TIMING` and `HORIZON_OFFSET_DAYS` in `mock/plan.ts` |
| Pinning | `accept` and `edit` in `lib/action-steps.ts` |
| The words, and Change when's choices | `bucketOf` and `timeChoices` in `lib/time-words.ts` |
| Stage periods | `stageWindows` in `lib/roadmap-dates.ts`, with `STAGE_WEEKS` in `mock/plan.ts` |
