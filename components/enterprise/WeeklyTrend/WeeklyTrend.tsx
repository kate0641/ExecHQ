"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Icon } from "@/components/primitives/Icon";
import { ENTERPRISE_COPY, TREND_COPY, formatDate, type TrendView } from "@/mock/enterprise";

const C = TREND_COPY;

/** The plot's own measures, in pixels: drawn at the width it is given, so
 *  lines and words never scale with it. */
const HEIGHT = 120;
const PAD = { top: 12, right: 8, bottom: 4, left: 8 };
const count = new Intl.NumberFormat("en-GB");
const shortDay = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const dayOf = (iso: string) => shortDay.format(new Date(`${iso}T00:00:00Z`));

export interface WeeklyTrendProps {
  trend: TrendView;
  /** Catalogue only: the week a hover would pick, so the tooltip shows. */
  demoWeek?: number;
  className?: string;
}

/**
 * People active each week since the program started: one line, no legend
 * (the heading names it), the latest week marked and labelled. A week below
 * the minimum cohort size breaks the line rather than show a small number.
 * Too few weeks says when a trend will appear; a cohort below the minimum
 * hides it. Hovering a week shows its figure; the same figures sit in a
 * table for screen readers.
 */
export function WeeklyTrend({ trend, demoWeek, className }: WeeklyTrendProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(560);
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const picked = demoWeek ?? hovered;

  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(160, Math.round(entry.contentRect.width))));
    observer.observe(plot);
    return () => observer.disconnect();
  }, [trend.state]);

  const classes = ["weekly-trend", `weekly-trend--${trend.state}`, className].filter(Boolean).join(" ");
  const heading = <p className="weekly-trend__label">{C.heading}</p>;

  if (trend.state === "suppressed") {
    return (
      <div className={classes}>
        {heading}
        <p className="weekly-trend__message">
          <Icon name="lock" size={16} />
          {ENTERPRISE_COPY.suppressed}
        </p>
      </div>
    );
  }
  if (trend.state === "early") {
    return (
      <div className={classes}>
        {heading}
        <p className="weekly-trend__message">
          <Icon name="clock" size={16} />
          {C.early(trend.weeks.length)}
        </p>
      </div>
    );
  }

  const { weeks } = trend;
  const shown = weeks.filter((week) => week.active !== undefined).map((week) => week.active!);
  const peak = Math.max(...shown);
  const top = niceCeiling(peak);
  const latestIndex = weeks.length - 1;
  const latest = weeks[latestIndex];
  const hasGap = shown.length < weeks.length;

  const x = (i: number) => PAD.left + (i / Math.max(1, weeks.length - 1)) * (width - PAD.left - PAD.right);
  const y = (value: number) => PAD.top + (1 - value / top) * (HEIGHT - PAD.top - PAD.bottom);

  // One path, broken wherever a week was hidden.
  let path = "";
  let drawing = false;
  weeks.forEach((week, i) => {
    if (week.active === undefined) {
      drawing = false;
      return;
    }
    path += `${drawing ? "L" : "M"}${x(i).toFixed(1)},${y(week.active).toFixed(1)}`;
    drawing = true;
  });

  // A week with hidden weeks either side has no line to sit on: mark it.
  const lone = weeks
    .map((week, i) => ({ week, i }))
    .filter(({ week, i }) => week.active !== undefined && weeks[i - 1]?.active === undefined && weeks[i + 1]?.active === undefined);

  function pick(event: PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const share = (event.clientX - box.left - PAD.left) / (box.width - PAD.left - PAD.right);
    setHovered(Math.min(latestIndex, Math.max(0, Math.round(share * latestIndex))));
  }

  const pickedWeek = picked === undefined ? undefined : weeks[picked];
  const firstShown = shown[0];

  return (
    <figure className={classes}>
      <figcaption className="weekly-trend__head">
        {heading}
        <span className="weekly-trend__covers">{C.covers}</span>
      </figcaption>

      {/* The drawing is decoration for a screen reader: it hears the shape
          in a sentence, then the weeks in the table below. */}
      <p className="u-visually-hidden">{C.summary(firstShown, peak, latest.active ?? shown[shown.length - 1], weeks.length)}</p>
      <div className="weekly-trend__plot" ref={plotRef}>
        <span className="weekly-trend__scale" aria-hidden="true">
          {count.format(top)}
        </span>
        <svg
          className="weekly-trend__svg"
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          aria-hidden="true"
          onPointerMove={pick}
          onPointerLeave={() => setHovered(undefined)}
        >
          <line className="weekly-trend__grid" x1={0} x2={width} y1={y(top)} y2={y(top)} />
          <line className="weekly-trend__grid weekly-trend__grid--base" x1={0} x2={width} y1={y(0)} y2={y(0)} />
          {pickedWeek ? <line className="weekly-trend__crosshair" x1={x(picked!)} x2={x(picked!)} y1={PAD.top} y2={y(0)} /> : null}
          <path className="weekly-trend__line" d={path} />
          {lone.map(({ week, i }) => (
            <circle key={week.weekOf} className="weekly-trend__dot" cx={x(i)} cy={y(week.active!)} r={3} />
          ))}
          {latest.active !== undefined ? <circle className="weekly-trend__dot" cx={x(latestIndex)} cy={y(latest.active)} r={4} /> : null}
          {pickedWeek?.active !== undefined && picked !== latestIndex ? (
            <circle className="weekly-trend__dot" cx={x(picked!)} cy={y(pickedWeek.active)} r={4} />
          ) : null}
        </svg>

        {pickedWeek ? (
          <p
            className="weekly-trend__tip"
            aria-hidden="true"
            style={{ left: `${(x(picked!) / width) * 100}%` }}
            data-side={picked! > latestIndex * 0.66 ? "left" : undefined}
          >
            <span>{C.week} {dayOf(pickedWeek.weekOf)}</span>
            <strong>{pickedWeek.active === undefined ? C.hiddenWeek : count.format(pickedWeek.active)}</strong>
          </p>
        ) : null}
      </div>

      <div className="weekly-trend__axis" aria-hidden="true">
        <span>{dayOf(weeks[0].weekOf)}</span>
        <span>
          {latest.active === undefined ? C.hiddenWeek : C.latest(count.format(latest.active))}
        </span>
      </div>

      {hasGap ? <p className="weekly-trend__note">{C.gap}</p> : null}

      <table className="u-visually-hidden">
        <caption>{C.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{C.week}</th>
            <th scope="col">{C.active}</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.weekOf}>
              <th scope="row">{formatDate(week.weekOf)}</th>
              <td>{week.active === undefined ? C.hiddenWeek : count.format(week.active)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** A round number just above the peak, for the one labelled rule. */
function niceCeiling(value: number): number {
  const step = 10 ** Math.max(1, Math.floor(Math.log10(value)));
  return Math.ceil(value / step) * step;
}

export default WeeklyTrend;
