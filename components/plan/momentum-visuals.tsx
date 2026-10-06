import { daysBetween, shortDate, type LoopDate } from "@/lib/loop";
import { Icon } from "@/components/primitives/Icon";
import type { MomentumEvent } from "@/lib/momentum";
import { MOMENTUM_COPY as C, type MomentumFigure } from "@/mock/plan";

/**
 * The drawings Momentum can wear. Each is a plain picture of real events:
 * one mark for each day or each thing she did, never a score. An empty day is
 * neutral, not a miss, and every drawing has its words beside it.
 */

const dayOf = (e: MomentumEvent, today: LoopDate) => daysBetween(e.on, today);
const weekdayLetter = (date: LoopDate) => ["S", "M", "T", "W", "T", "F", "S"][new Date(`${date}T00:00:00`).getDay()];

const point = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
const round = (n: number) => Math.round(n * 10) / 10;

/** A ring with one tick for each day: longer where she did more, gold for today,
 *  and dots for days she has not reached yet. */
export function DialRing({ events, today, days, history }: { events: MomentumEvent[]; today: LoopDate; days: number; history: number }) {
  const dense = days > 40;
  const perDay = new Map<number, number>();
  for (const e of events) perDay.set(dayOf(e, today), (perDay.get(dayOf(e, today)) ?? 0) + 1);
  const marks = Array.from({ length: days }, (_, i) => {
    const d = days - 1 - i;
    const deg = (i / days) * 360;
    if (d >= history) {
      const [x, y] = point(160, 160, 144, deg);
      return <circle key={i} className="dial-ring__future" cx={round(x)} cy={round(y)} r={1.6} />;
    }
    const n = perDay.get(d) ?? 0;
    const len = (n ? (dense ? 16 : 22) : dense ? 8 : 12) + Math.min(n, 3) * (n ? (dense ? 5 : 8) : 0);
    const [x1, y1] = point(160, 160, 150, deg);
    const [x2, y2] = point(160, 160, 150 - len, deg);
    const tone = d === 0 ? "dial-ring__tick--today" : n ? "dial-ring__tick--on" : "dial-ring__tick--off";
    return (
      <line
        key={i}
        className={`dial-ring__tick ${tone}`}
        x1={round(x1)}
        y1={round(y1)}
        x2={round(x2)}
        y2={round(y2)}
        strokeWidth={dense ? 2 : 3.2}
      />
    );
  });
  return (
    <>
      <svg className="dial-ring" viewBox="0 0 320 320" aria-hidden="true">
        {marks}
      </svg>
      <p className="u-visually-hidden">{C.dial.aria(days)}</p>
    </>
  );
}

/** Seven circles, the last seven days ending today: dark where she did
 *  something, dashed for days she has not reached. Beneath, a letter for each
 *  weekday. */
export function DayCircles({ events, today, history }: { events: MomentumEvent[]; today: LoopDate; history: number }) {
  const days = Array.from({ length: 7 }, (_, i) => 6 - i);
  const has = new Set(events.map((e) => dayOf(e, today)));
  return (
    <div className="day-circles">
      <ol className="day-circles__row">
        {days.map((d) => {
          const date = shortDate(addBack(today, d));
          const future = d >= history;
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

/** The three counts as a bar and a pill. Length grows with the count and stops
 *  at a fixed width: there is no axis, no scale and no percentage. */
export function PillBars({ events }: { events: MomentumEvent[] }) {
  const figures: { figure: MomentumFigure; tone: "completed" | "artifact" | "outcome" }[] = [
    { figure: "completed", tone: "completed" },
    { figure: "artifact", tone: "artifact" },
    { figure: "outcome", tone: "outcome" },
  ];
  return (
    <ul className="pill-bars">
      {figures.map(({ figure, tone }) => {
        const n = events.filter((e) => e.figure === figure).length;
        return (
          <li
            key={figure}
            className={`pill-bar pill-bar--${tone}`}
            style={{ ["--bar" as string]: `${Math.min(26 + Math.min(n, 6) * 6, 62)}%` }}
            aria-label={`${C.barLabels[figure]}: ${n}`}
          >
            <span className="pill-bar__rect" aria-hidden="true">
              {C.barLabels[figure]}
            </span>
            <span className="pill-bar__pill" aria-hidden="true">
              {n}
            </span>
            <span className="pill-bar__tip" aria-hidden="true" />
          </li>
        );
      })}
    </ul>
  );
}
