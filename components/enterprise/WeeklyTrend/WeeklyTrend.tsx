"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "@/components/primitives/Icon";
import { ENTERPRISE_COPY, TREND_COPY, abbrevDate, formatDate, weekInRange, type TrendView } from "@/mock/enterprise";

const C = TREND_COPY;

/** The plot's own measures, in pixels: drawn at the width it is given, so
 *  lines and words never scale with it. */
const DEFAULT_HEIGHT = 120;
const PAD = { top: 20, right: 4, bottom: 0, left: 4 };
/** Room on the left for the scale's numbers in the fade look, and above the
 *  top line for the hover pill over the tallest week (designer, 2026-11-03). */
const FADE_GUTTER = 40;
const FADE_HEADROOM = 64;
/** How far the pill may reach past the plot, into the card's padding. */
const TIP_OVERHANG = 16;
/** Below this the scale would be too fine for so few people. */
const MIN_PEAK = 10;
const count = new Intl.NumberFormat("en-GB");
/** "14 Sep": three-letter months throughout, as `abbrevDate` (en-GB would
 *  write "Sept"). */
const dayOf = (iso: string) => abbrevDate(iso).slice(0, -5);
/** A day a number of days on, for a week's last day. */
const daysOn = (iso: string, days: number) => new Date(Date.parse(`${iso}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);

export interface WeeklyTrendProps {
  trend: TrendView;
  /** The dates chosen in the picker: the weeks they touch are shaded. Left
   *  off, every week is drawn as chosen. */
  highlight?: { from: string; to: string };
  /** The drawing's height in px, 120 unless a card has room to give it.
   *  `fill` grows it into whatever height its container leaves, never under
   *  that minimum (designer, 2026-11-03: the admin card's half). */
  height?: number | "fill";
  /** `fade` (designer, 2026-11-03): each bar fades from its colour at the top
   *  to a pale one at its base, this week in a darker fade so it stands out,
   *  and no numbers over the bars: hovering a week shows its figure. */
  look?: "flat" | "fade";
  /** Today, for the axis's right end in the fade look, which names the date
   *  rather than "this week" (its pill says that). */
  today?: string;
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
export function WeeklyTrend({ trend, highlight, height = DEFAULT_HEIGHT, look = "flat", today, demoWeek, className }: WeeklyTrendProps) {
  const fill = height === "fill";
  const plotRef = useRef<HTMLDivElement>(null);
  // React's ids hold colons, which a url() reference can't: keep the rest.
  const hatchId = `hatch${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [width, setWidth] = useState(560);
  const [room, setRoom] = useState(DEFAULT_HEIGHT);
  const HEIGHT = fill ? Math.max(DEFAULT_HEIGHT, room) : height;
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const picked = demoWeek ?? hovered;
  // The pill's own width, measured, so it leans in only when centring it
  // would run it off the chart.
  const tipRef = useRef<HTMLParagraphElement>(null);
  const [tipWidth, setTipWidth] = useState(0);
  useLayoutEffect(() => {
    const measured = tipRef.current?.offsetWidth ?? 0;
    if (measured && measured !== tipWidth) setTipWidth(measured);
  }, [hovered, demoWeek, trend, tipWidth]);

  useEffect(() => {
    const plot = plotRef.current;
    if (!plot) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(160, Math.round(entry.contentRect.width)));
      // Filling, the drawing is laid over the plot, so the plot's height is
      // the room it is given, never the drawing's own.
      if (fill) setRoom(Math.round(entry.contentRect.height));
    });
    observer.observe(plot);
    return () => observer.disconnect();
  }, [trend.state, fill]);

  const classes = ["weekly-trend", `weekly-trend--${trend.state}`, look === "fade" ? "weekly-trend--fade" : null, fill ? "weekly-trend--fill" : null, className]
    .filter(Boolean)
    .join(" ");
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
  const steps = scaleSteps(top);
  const latestIndex = weeks.length - 1;
  const latest = weeks[latestIndex];
  const hasGap = shown.length < weeks.length;
  const inDates = weeks.map((week) => (highlight ? weekInRange(week.weekOf, highlight) : true));
  const shadedWeeks = weeks.filter((_, i) => inDates[i]);
  // Values sit over the bars while there is room for them.
  const labelled = look === "flat" && weeks.length <= 10;

  // The fade look keeps a gutter on the left for the scale's numbers, so no
  // bar runs under them (designer, 2026-11-03).
  const pad = look === "fade" ? { ...PAD, left: FADE_GUTTER, top: FADE_HEADROOM } : PAD;
  const slot = (width - pad.left - pad.right) / weeks.length;
  const barWidth = Math.min(look === "fade" ? 36 : 44, Math.max(4, slot * (look === "fade" ? 0.56 : 0.64)));
  const x = (i: number) => pad.left + slot * i + (slot - barWidth) / 2;
  const y = (value: number) => pad.top + (1 - value / top) * (HEIGHT - pad.top - pad.bottom);
  const base = y(0);

  function pick(event: PointerEvent<SVGSVGElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const at = Math.floor(((event.clientX - box.left) * (width / box.width) - pad.left) / slot);
    setHovered(Math.min(latestIndex, Math.max(0, at)));
  }

  // In the fade look this week's pill shows until another week is picked
  // (designer, 2026-11-03), so the figure so far is always in view.
  const shownIndex = picked ?? (look === "fade" && latest.partial ? latestIndex : undefined);
  const pickedWeek = shownIndex === undefined ? undefined : weeks[shownIndex];
  const weekName = (i: number) => (weeks[i].partial ? C.thisWeek : `${C.week} ${dayOf(weeks[i].weekOf)}`);
  const weekFigure = (i: number) => (weeks[i].active === undefined ? C.hiddenWeek : count.format(weeks[i].active!));

  // The fade look reads week by week from the keyboard too (designer,
  // 2026-11-03): the plot is a slider over the weeks; the arrows, Home and
  // End move the pill a hover would show.
  function step(event: KeyboardEvent<HTMLDivElement>) {
    const from = hovered ?? latestIndex;
    const to =
      event.key === "ArrowLeft" || event.key === "ArrowDown"
        ? from - 1
        : event.key === "ArrowRight" || event.key === "ArrowUp"
          ? from + 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? latestIndex
              : undefined;
    if (to === undefined) return;
    event.preventDefault();
    setHovered(Math.min(latestIndex, Math.max(0, to)));
  }
  const slider =
    look === "fade"
      ? {
          role: "slider",
          tabIndex: 0,
          "aria-label": C.readWeeks,
          "aria-valuemin": 0,
          "aria-valuemax": latestIndex,
          "aria-valuenow": hovered ?? latestIndex,
          "aria-valuetext": `${weekName(hovered ?? latestIndex)}: ${weekFigure(hovered ?? latestIndex)}`,
          onKeyDown: step,
          onFocus: () => setHovered((now) => now ?? latestIndex),
          onBlur: () => setHovered(undefined),
        }
      : {};

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
      <div className="weekly-trend__plot" ref={plotRef} {...slider}>
        {/* A line at each step of the scale, each labelled above its left
            end (designer, 2026-11-03), so the bars have benchmarks between 0
            and the top. */}
        {steps.map((value) => (
          <span key={value} className="weekly-trend__scale" style={{ top: `calc(var(--weekly-trend-plot-top) + ${y(value)}px)` }} aria-hidden="true">
            {count.format(value)}
          </span>
        ))}
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
            {look === "fade"
              ? (["week", "picked", "now"] as const).map((kind) => (
                  <linearGradient key={kind} id={`${hatchId}-${kind}`} x1={0} y1={0} x2={0} y2={1}>
                    <stop offset={0} className={`weekly-trend__stop weekly-trend__stop--${kind}-top`} />
                    <stop offset={1} className={`weekly-trend__stop weekly-trend__stop--${kind}-base`} />
                  </linearGradient>
                ))
              : null}
          </defs>
          {/* The dates chosen: a band behind the weeks they touch. */}
          {highlight
            ? weeks.map((week, i) =>
                inDates[i] ? <rect key={`band-${week.weekOf}`} className="weekly-trend__band" x={pad.left + slot * i} y={0} width={slot} height={base} /> : null,
              )
            : null}
          {steps.map((value) => (
            <line key={value} className="weekly-trend__grid" x1={0} x2={width} y1={y(value)} y2={y(value)} />
          ))}
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
                  // Inline, so the hatching or the fade wins over the bar's fill in
                  // the stylesheet.
                  style={
                    look === "fade"
                      ? { fill: `url(#${hatchId}-${week.partial ? "now" : picked === i ? "picked" : "week"})` }
                      : week.partial
                        ? { fill: `url(#${hatchId}-${tone})` }
                        : undefined
                  }
                />
                {labelled || look === "fade" ? (
                  <text
                    className={["weekly-trend__value", `weekly-trend__value--${tone}`, look === "fade" ? "is-print-only" : null].filter(Boolean).join(" ")} x={x(i) + barWidth / 2} y={base - h - 4} textAnchor="middle">
                    {count.format(week.active)}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        {pickedWeek ? (
          <p
            ref={tipRef}
            className="weekly-trend__tip"
            aria-hidden="true"
            style={
              look === "fade"
                ? // Over the bar picked, its arrow on the bar's top (designer, 2026-11-03).
                  {
                    left: `${((x(shownIndex!) + barWidth / 2) / width) * 100}%`,
                    top: `calc(var(--weekly-trend-plot-top) + ${pickedWeek.active === undefined ? base : y(pickedWeek.active)}px)`,
                  }
                : { left: `${((x(picked!) + barWidth) / width) * 100}%` }
            }
            data-side={
              look === "fade"
                ? // Centred on the bar wherever it fits; leaning in only at an edge.
                  x(shownIndex!) + barWidth / 2 - tipWidth / 2 < -TIP_OVERHANG
                  ? "start"
                  : x(shownIndex!) + barWidth / 2 + tipWidth / 2 > width + TIP_OVERHANG
                    ? "end"
                    : "middle"
                : picked! > latestIndex * 0.66
                  ? "left"
                  : undefined
            }
          >
            {look === "fade" ? (
              <>
                {/* Its dates, Monday to Sunday, or to today for this week
                    (designer, 2026-11-03). */}
                <span>{C.weekRange(dayOf(pickedWeek.weekOf), dayOf(pickedWeek.partial && today ? today : daysOn(pickedWeek.weekOf, 6)))}</span>
                <strong>
                  {pickedWeek.active === undefined ? C.hiddenWeek : count.format(pickedWeek.active)}
                  {pickedWeek.partial && pickedWeek.active !== undefined ? <span className="weekly-trend__tip-so-far"> {C.soFarAfter}</span> : null}
                </strong>
              </>
            ) : (
              <>
                <span>{pickedWeek.partial ? C.thisWeek : `${C.week} ${dayOf(pickedWeek.weekOf)}`}</span>
                <strong>{pickedWeek.active === undefined ? C.hiddenWeek : count.format(pickedWeek.active)}</strong>
              </>
            )}
          </p>
        ) : null}
      </div>

      <div className="weekly-trend__axis" aria-hidden="true">
        <span>{dayOf(weeks[0].weekOf)}</span>
        <span>
          {latest.partial && look === "fade"
            ? today
              ? dayOf(today)
              : C.thisWeek
            : latest.partial
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

/** The scale's gridlines above zero: three or four even steps up to the top,
 *  at round numbers (10, 20, 30; 250, 500, 750, 1,000). */
function scaleSteps(top: number): number[] {
  for (const parts of [3, 4, 5, 2]) {
    const step = top / parts;
    if (Number.isInteger(step) && /^(1|2|25|3|4|5)0*$/.test(String(step))) return Array.from({ length: parts }, (_, i) => step * (i + 1));
  }
  return [top];
}

export default WeeklyTrend;
