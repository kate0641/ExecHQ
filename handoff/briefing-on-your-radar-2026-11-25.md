# Briefing: Spark Signals is now On Your Radar

25 November 2026 · Kate Hester

The section after the day's three reads in the Daily Briefing is renamed. Only its name changes: it still offers up to three opportunities a week (a show to pitch, an event to speak at, a publication to write for), each with Start a pitch and Not for me. The full rules are in the Daily Briefing spec, 3.4a; the section itself is described in "Briefing: Spark Signals" (18 Nov).

| | Heading |
| --- | --- |
| Before | Spark Signals |
| Now | On Your Radar |

- Set as before: in the serif, under a hairline, with "Picked for you this week" at the right.
- The section is labelled by this heading, so screen readers hear "On Your Radar" too.
- Code names keep the old one (`SparkSignals`, `SPARK_SIGNALS_COPY`); only the words on screen change.

## Where it is in the prototype

| Piece | Where |
| --- | --- |
| The heading | `SPARK_SIGNALS_COPY.heading` in `mock/briefing.ts` |
| Specs and briefs that name it | `specs/daily-briefing.md`, `plans/shared.md`, `builders/pitch.md` |
