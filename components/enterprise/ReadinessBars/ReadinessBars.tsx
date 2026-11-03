import { READINESS_COPY as C } from "@/mock/enterprise";

export interface ReadinessBarsProps {
  /** How many gave each answer, lowest first, at the start and now: the
   *  same people. */
  start: number[];
  now: number[];
  className?: string;
}

/**
 * The readiness pulse's spread (Concept 1b, Kate, 2026-10-23), drawn as one
 * group per answer, Not yet to Ready, left to right (designer, 2026-11-03):
 * in each, a stone bar for the start beside a navy one for now, its count
 * above it, so how each answer grew or shrank reads at a glance. Every bar
 * shares one baseline and one scale. Each group's counts are said in words
 * to a screen reader, in place of the drawing.
 */
export function ReadinessBars({ start, now, className }: ReadinessBarsProps) {
  const most = Math.max(1, ...start, ...now);
  const bar = (n: number, when: "start" | "now") => (
    <span className={`readiness-bars__bar readiness-bars__bar--${when}`}>
      <span className="readiness-bars__count">{n.toLocaleString("en-US")}</span>
      <i className="readiness-bars__fill" style={{ height: `calc((100% - var(--readiness-count-room)) * ${n / most})` }} />
    </span>
  );
  return (
    <ul className={["readiness-bars", className].filter(Boolean).join(" ")}>
      {C.scale.map((answer, i) => (
        <li key={answer} className="readiness-bars__group">
          <p className="readiness-bars__answer">{answer}</p>
          <p className="u-visually-hidden">{C.groupLabel(answer, start[i], now[i])}</p>
          <div className="readiness-bars__plot" aria-hidden="true">
            {bar(start[i], "start")}
            {bar(now[i], "now")}
          </div>
          <p className="readiness-bars__when" aria-hidden="true">
            <span>{C.start}</span>
            <span>{C.now}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default ReadinessBars;
