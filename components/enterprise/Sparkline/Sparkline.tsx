export interface SparklineProps {
  /** One value a week, oldest first. A missing week, below the minimum
   *  cohort size, breaks the line. */
  values: (number | undefined)[];
  /** Said to a screen reader in place of the drawing. */
  label: string;
  className?: string;
}

const WIDTH = 120;
const HEIGHT = 32;
const PAD = 4;

/**
 * A small line of weekly values beside words that already say which way
 * they moved (2026-10-20): the shape at a glance, no axis, no numbers. The
 * latest week is marked. Nothing is drawn with fewer than two weeks.
 */
export function Sparkline({ values, label, className }: SparklineProps) {
  const shown = values.filter((value): value is number => value !== undefined);
  if (values.length < 2 || shown.length < 2) return null;
  const top = Math.max(...shown);
  const bottom = Math.min(0, ...shown);
  const x = (i: number) => PAD + (i / (values.length - 1)) * (WIDTH - PAD * 2);
  const y = (value: number) => PAD + (1 - (value - bottom) / (top - bottom || 1)) * (HEIGHT - PAD * 2);

  let path = "";
  let drawing = false;
  values.forEach((value, i) => {
    if (value === undefined) {
      drawing = false;
      return;
    }
    path += `${drawing ? "L" : "M"}${x(i).toFixed(1)},${y(value).toFixed(1)}`;
    drawing = true;
  });
  const last = values[values.length - 1];

  return (
    <span className={["sparkline", className].filter(Boolean).join(" ")}>
      <svg className="sparkline__svg" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} aria-hidden="true">
        <path className="sparkline__line" d={path} />
        {last !== undefined ? <circle className="sparkline__dot" cx={x(values.length - 1)} cy={y(last)} r={3} /> : null}
      </svg>
      <span className="u-visually-hidden">{label}</span>
    </span>
  );
}

export default Sparkline;
