import { daysBetween, shortDate, type LoopDate } from "@/lib/loop";
import { Icon } from "@/components/primitives/Icon";
import type { MomentumEvent } from "@/lib/momentum";
import { MOMENTUM_COPY as C } from "@/mock/plan";

/**
 * Momentum's week: one circle for each day, never a score. An empty day is
 * neutral, not a miss, and every drawing has its words beside it.
 */

const dayOf = (e: MomentumEvent, today: LoopDate) => daysBetween(e.on, today);
const weekdayLetter = (date: LoopDate) => ["S", "M", "T", "W", "T", "F", "S"][new Date(`${date}T00:00:00`).getDay()];

/** Seven circles for the calendar week that holds today, Sunday to Saturday, so
 *  the week is always the same seven days and starts afresh each Sunday: filled
 *  where she did something, a thin outline for a past day with nothing in it,
 *  dashed for days still to come or before her plan began. Beneath, a letter
 *  for each weekday. */
export function DayCircles({ events, today, history }: { events: MomentumEvent[]; today: LoopDate; history: number }) {
  const sinceSunday = new Date(`${today}T00:00:00`).getDay();
  // Days ago, left to right: Sunday is sinceSunday days back, Saturday is as many days ahead as are left.
  const days = Array.from({ length: 7 }, (_, i) => sinceSunday - i);
  const has = new Set(events.map((e) => dayOf(e, today)));
  return (
    <div className="day-circles">
      <ol className="day-circles__row">
        {days.map((d) => {
          const date = shortDate(addBack(today, d));
          const future = d < 0 || d >= history;
          const on = has.has(d) && !future;
          return (
            <li
              key={d}
              className={["day-circles__dot", future ? "is-future" : on ? "is-on" : "", d === 0 ? "is-today" : ""].filter(Boolean).join(" ")}
              aria-label={`${date}: ${future ? C.week.notYet : on ? C.week.did : C.week.none}`}
            >
              {on ? <Icon name="check" size={14} /> : null}
            </li>
          );
        })}
      </ol>
      <ol className="day-circles__letters" aria-hidden="true">
        {days.map((d) => (
          <li key={d}>{weekdayLetter(addBack(today, d))}</li>
        ))}
      </ol>
    </div>
  );
}

function addBack(today: LoopDate, days: number): LoopDate {
  const x = new Date(`${today}T00:00:00`);
  x.setDate(x.getDate() - days);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
}
