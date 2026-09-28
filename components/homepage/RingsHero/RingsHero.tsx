import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";
import { ringCount, ringText, type Ring, type RingSegment } from "@/lib/rings";
import type { Horizon } from "@/mock/plan-stub";

export interface RingsHeroProps {
  rings: Ring[];
  /** The one action that fills the next segment, if any is left. */
  next?: { ring: Ring; segment: RingSegment };
  /** "Step up · Week 3 of 12". */
  planLine: string;
  /** The plan's formal name, beside it. */
  planName?: string;
  /** A line for the first return, so nearly empty rings read as a start. */
  startNote?: string;
  /** The ring whose actions are showing, if any. */
  open?: Horizon | null;
  onToggle?: (horizon: Horizon) => void;
  /** The id of the panel a ring opens, for aria-controls. */
  detailId?: string;
  startHref: string;
  planHref: string;
  /** Catalogue only: shows one ring in a state a static page can't reach. */
  demo?: { horizon: Horizon; state: "hover" | "focus" | "active" };
  className?: string;
}

/* The drawing works in a 100 × 100 box and scales with CSS. */
const C = 50;
const W = 12;
const R = C - W / 2 - 2;

function point(deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + R * Math.cos(a), C + R * Math.sin(a)];
}

function arc(from: number, to: number): string {
  const [x0, y0] = point(from);
  const [x1, y1] = point(to);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${to - from > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/**
 * One segment. Solid once confirmed; a hollow outline until then, so filled
 * and unfilled differ in shape as well as colour. The next one to fill is
 * outlined in the accent rather than the muted tone.
 */
function Segment({ from, to, whole, filled, next }: { from: number; to: number; whole: boolean; filled: boolean; next: boolean }) {
  const shape = (className: string, width: number) =>
    whole ? (
      <circle className={className} cx={C} cy={C} r={R} strokeWidth={width} />
    ) : (
      <path className={className} d={arc(from, to)} strokeWidth={width} strokeLinecap="round" />
    );
  if (filled) return shape("rings-hero__fill", W);
  return (
    <>
      {shape(next ? "rings-hero__next" : "rings-hero__track", W)}
      {shape("rings-hero__hole", W - 3.2)}
    </>
  );
}

function RingDrawing({ ring, nextId }: { ring: Ring; nextId?: string }) {
  const n = ring.segments.length;
  const span = 360 / n;
  // Room for the round caps at each end of a segment, plus a clear gap.
  const cap = ((W / 2) / (2 * Math.PI * R)) * 360;
  const gap = n > 1 ? 14 : 0;
  return (
    <svg className="rings-hero__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {ring.segments.map((s, i) => (
        <Segment
          key={s.action.id}
          whole={n === 1}
          from={i * span + (gap ? gap / 2 + cap : 0)}
          to={(i + 1) * span - (gap ? gap / 2 + cap : 0)}
          filled={s.filled}
          next={s.action.id === nextId}
        />
      ))}
    </svg>
  );
}

/**
 * The focal point of Homepage Concept 1 — Rings, Row: three rings for the
 * actions the user has accepted, one per horizon, each named where it sits,
 * and the one action that would fill the next segment.
 *
 * Each ring is a button that opens its actions. Each reads out as text
 * ("Short-term: 1 of 2 actions confirmed."), so the drawing is never the only
 * way to know where things stand. Nothing celebrates when a ring fills.
 */
export function RingsHero({
  rings,
  next,
  planLine,
  planName,
  startNote,
  open = null,
  onToggle,
  detailId = "ring-detail",
  startHref,
  planHref,
  demo,
  className,
}: RingsHeroProps) {
  return (
    <section className={["rings-hero", className].filter(Boolean).join(" ")} aria-labelledby="rings-hero-heading">
      <h2 className="u-visually-hidden" id="rings-hero-heading">
        Your plan&rsquo;s actions
      </h2>
      <p className="rings-hero__meta">
        <span>{planLine}</span>
        {planName ? <span>{planName}</span> : null}
      </p>
      {startNote ? <p className="rings-hero__note">{startNote}</p> : null}
      <ul className="rings-hero__row">
        {rings.map((ring) => (
          <li key={ring.horizon}>
            <button
              type="button"
              className={["rings-hero__ring", demo?.horizon === ring.horizon ? `is-${demo.state}` : null]
                .filter(Boolean)
                .join(" ")}
              aria-expanded={open === ring.horizon}
              aria-controls={detailId}
              onClick={() => onToggle?.(ring.horizon)}
            >
              <RingDrawing ring={ring} nextId={next?.segment.action.id} />
              <span className="rings-hero__name" aria-hidden="true">
                {ring.label}
              </span>
              <span className="rings-hero__count" aria-hidden="true">
                {ringCount(ring)}
              </span>
              <span className="u-visually-hidden">{`${ringText(ring)} Show its actions.`}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="rings-hero__focal">
        {next ? (
          <>
            <span className="rings-hero__eyebrow">Next to fill &middot; {next.ring.label}</span>
            <b className="rings-hero__action">{next.segment.action.title}</b>
          </>
        ) : (
          <>
            <span className="rings-hero__eyebrow">All confirmed</span>
            <b className="rings-hero__action">Every action on your plan is in hand</b>
          </>
        )}
      </div>
      <div className="rings-hero__actions">
        {next ? (
          <Link href={startHref} className="rings-hero__pill">
            <Icon name="chevron" size={16} />
            Start it
          </Link>
        ) : null}
        <Link href={planHref} className="rings-hero__pill rings-hero__pill--quiet">
          See your plan
        </Link>
      </div>
    </section>
  );
}

export default RingsHero;
