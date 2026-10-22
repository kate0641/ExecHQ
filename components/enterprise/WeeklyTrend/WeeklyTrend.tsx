"use client";

import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { Icon } from "@/components/primitives/Icon";
import { ENTERPRISE_COPY, TREND_COPY, abbrevDate, formatDate, weekInRange, type TrendView } from "@/mock/enterprise";

const C = TREND_COPY;

/** The plot's own measures, in pixels: drawn at the width it is given, so
 *  lines and words never scale with it. */
const HEIGHT = 120;
const PAD = { top: 20, right: 4, bottom: 0, left: 4 };
/** Below this the scale would be too fine for so few people. */
const MIN_PEAK = 10;
const count = new Intl.NumberFormat("en-GB");
/** "14 Sep": three-letter months throughout, as `abbrevDate` (en-GB would
 *  write "Sept"). */
const dayOf = (iso: string) => abbrevDate(iso).slice(0, -5);

export interface WeeklyTrendProps {
  trend: TrendView;
  /** The dates chosen in the picker: the weeks they touch are shaded. Left
   *  off, every week is drawn as chosen. */
  highlight?: { from: string; to: string };
  /** Catalogue only: the week a hover would pick, so the tooltip shows. */
  demoWeek?: number;
  className?: string;
}

/**
 * People active each week since the program started, Monday to Sunday, as
 * bars (Kate, 2026-10-22). There are no weekly updates: the chart shows from
 * the first week, and this week, still going, is hatched and labelled so far
 * so a short week never reads as a drop. It always shows every week; the
 * dates chosen in the picker are shaded on it, so it follows the picker and
 * keeps the weeks around them. A week below the minimum is a gap, never a
 * small number; a cohort below the minimum hides it. Hovering a week shows
 * its figure; the same figures sit in a table for screen readers.
 */
export function WeeklyTrend({ trend, highlight, demoWeek, className }: WeeklyTrendProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  // React's ids hold colons, which a url() reference can't: keep the rest.
  const hatchId = `hatch${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
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

  const { weeks } = trend;
  const shown = weeks.filter((week) => week.active !== undefined).map((week) => week.active!);
  const peak = Math.max(MIN_PEAK, ...shown);
  const top = niceCeiling(peak);
  const latestIndex = weeks.length - 1;
  const latest = weeks[latestIndex];
  const hasGap = shown.length < weeks.length;
  const inDates = weeks.map((week) => (highlight ? weekInRange(week.weekOf, highlight) : true));
  const shadedWeeks = weeks.filter((_, i) => inDates[i]);
  // Values sit over the bars while there is room for them.
  const labelled = weeks.length <= 10;

  const slot = (width - PAD.left - PAD.right) / weeks.length;
  const barWidth = Math.min(44, Math.max(4, slot * 0.64));
  const x = (i: number) => PAD.left + slot * i + (slot - barWidth) / 2;
  const y = (value: number) => PAD.top + (1 - value / top) * (HEIGHT - PAD.top - PAD.bottom);
  const base = y(0);

  function pick(event: PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const at = Math.floor(((event.clientX - box.left) * (width / box.width) - PAD.left) / slot);
    setHovered(Math.min(latestIndex, Math.max(0, at)));
  }

  const pickedWeek = picked === undefined ? undefined : weeks[picked];

  return (
    <figure className={classes}>
      <figcaption className="weekly-trend__head">
        {heading}
        <span className="weekly-trend__covers">{highlight ? C.covers : C.coversAll}</span>
      </figcaption>

      {/* The drawing is decoration for a screen reader: it hears the shape
          in a sentence, then the weeks in the table below. */}
      <p className="u-visually-hidden">
        {shown.length ? C.summary(shown[0], Math.max(...shown), latest.active ?? shown[shown.length - 1], weeks.length) : null}{" "}
        {highlight && shadedWeeks.length ? C.shaded(dayOf(shadedWeeks[0].weekOf), dayOf(shadedWeeks[shadedWeeks.length - 1].weekOf)) : null}
      </p>
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
          <defs>
            {(["on", "off"] as const).map((tone) => (
              <pattern key={tone} id={`${hatchId}-${tone}`} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect className="weekly-trend__hatch-ground" width={6} height={6} />
                <line className={`weekly-trend__hatch weekly-trend__hatch--${tone}`} x1={0} y1={0} x2={0} y2={6} />
              </pattern>
            ))}
          </defs>
          {/* The dates chosen: a band behind the weeks they touch. */}
          {highlight
            ? weeks.map((week, i) =>
                inDates[i] ? <rect key={`band-${week.weekOf}`} className="weekly-trend__band" x={PAD.left + slot * i} y={0} width={slot} height={base} /> : null,
              )
            : null}
          <line className="weekly-trend__grid" x1={0} x2={width} y1={y(top)} y2={y(top)} />
          <line className="weekly-trend__grid weekly-trend__grid--base" x1={0} x2={width} y1={base} y2={base} />
          {weeks.map((week, i) => {
            const tone = inDates[i] ? "on" : "off";
            if (week.active === undefined) {
              return <rect key={week.weekOf} className="weekly-trend__gap" x={x(i)} y={base - 3} width={barWidth} height={3} />;
            }
            const h = Math.max(2, base - y(week.active));
            return (
              <g key={week.weekOf}>
                <rect
                  className={["weekly-trend__bar", `weekly-trend__bar--${tone}`, week.partial ? "is-partial" : null, picked === i ? "is-picked" : null].filter(Boolean).join(" ")}
                  x={x(i)}
                  y={base - h}
                  width={barWidth}
                  height={h}
                  rx={Math.min(4, barWidth / 4)}
                  // Inline, so the hatching wins over the bar's fill in the stylesheet.
                  style={week.partial ? { fill: `url(#${hatchId}-${tone})` } : undefined}
                />
                {labelled ? (
                  <text className={`weekly-trend__value weekly-trend__value--${tone}`} x={x(i) + barWidth / 2} y={base - h - 4} textAnchor="middle">
                    {count.format(week.active)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        {pickedWeek ? (
          <p
            className="weekly-trend__tip"
            aria-hidden="true"
            style={{ left: `${((x(picked!) + barWidth) / width) * 100}%` }}
            data-side={picked! > latestIndex * 0.66 ? "left" : undefined}
          >
            <span>{pickedWeek.partial ? C.thisWeek : `${C.week} ${dayOf(pickedWeek.weekOf)}`}</span>
            <strong>{pickedWeek.active === undefined ? C.hiddenWeek : count.format(pickedWeek.active)}</strong>
          </p>
        ) : null}
      </div>

      <div className="weekly-trend__axis" aria-hidden="true">
        <span>{dayOf(weeks[0].weekOf)}</span>
        <span>
          {latest.partial
            ? latest.active === undefined
              ? `${C.thisWeek}: ${C.hiddenWeek.toLowerCase()}`
              : C.latest(count.format(latest.active))
            : dayOf(latest.weekOf)}
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
          {weeks.map((week, i) => (
            <tr key={week.weekOf}>
              <th scope="row">
                {week.partial ? C.thisWeek : formatDate(week.weekOf)}
                {highlight && inDates[i] ? `, ${C.inDates}` : null}
              </th>
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
