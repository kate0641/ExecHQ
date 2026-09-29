"use client";

import { useState } from "react";

export interface TrendLineProps {
  /** One series, oldest first. */
  values: readonly number[];
  /** A label per value, for the hover readout: "Week of 12 Oct". */
  labels: readonly string[];
  /** Above the chart: what it measures and over what span. */
  caption: string;
  /** The whole trend in a sentence, for assistive technology. */
  summary: string;
  /** Catalogue only: shows the readout on one point. */
  demoIndex?: number;
  className?: string;
}

const W = 300;
const H = 56;
const PAD = 4;
const fmt = new Intl.NumberFormat("en-GB");

/**
 * A single-series trend: a 2px line over a faint area, the latest value
 * marked, and a crosshair with a readout on hover. One series, so no legend;
 * the caption names it and the summary reads out the change. Numbers only
 * ever say what changed, never why.
 */
export function TrendLine({ values, labels, caption, summary, demoIndex, className }: TrendLineProps) {
  const [at, setAt] = useState<number | null>(demoIndex ?? null);
  const min = Math.min(...values) - 4;
  const max = Math.max(...values) + 2;
  const x = (i: number) => PAD + (i * (W - PAD * 2)) / (values.length - 1);
  const y = (v: number) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(values.length - 1).toFixed(1)} ${H} L${x(0).toFixed(1)} ${H} Z`;
  const last = values.length - 1;

  return (
    <figure className={["trend-line", className].filter(Boolean).join(" ")}>
      <figcaption className="trend-line__caption">{caption}</figcaption>
      <div className="trend-line__plot">
        <span className="u-visually-hidden">{summary}</span>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <line className="trend-line__base" x1="0" y1={H} x2={W} y2={H} />
          <path className="trend-line__area" d={area} />
          <path className="trend-line__line" d={line} />
          <circle className="trend-line__end" cx={x(last)} cy={y(values[last])} r="4" />
          {at !== null ? <line className="trend-line__cross" x1={x(at)} y1="0" x2={x(at)} y2={H} /> : null}
          <rect
            className="trend-line__hit"
            x="0"
            y="0"
            width={W}
            height={H}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const i = Math.round(((e.clientX - r.left) / r.width) * last);
              setAt(Math.max(0, Math.min(last, i)));
            }}
            onPointerLeave={() => setAt(demoIndex ?? null)}
          />
        </svg>
        {at !== null ? (
          <span className="trend-line__tip" style={{ left: `${(x(at) / W) * 100}%` }} aria-hidden="true">
            {labels[at]}: {fmt.format(values[at])}
          </span>
        ) : null}
      </div>
    </figure>
  );
}

export default TrendLine;
