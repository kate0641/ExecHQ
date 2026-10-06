import type { CSSProperties, ReactNode } from "react";
import { mapRingText, type MapRing, type MapState } from "@/lib/map";
import { Icon } from "@/components/primitives/Icon";
import { MAP_COPY as C } from "@/mock/homepage";
import type { Horizon } from "@/mock/plan-stub";

export interface MapRingsProps {
  rings: MapRing[];
  /** The ring whose list is open below. None: no ring is pressed. */
  selected?: Horizon | null;
  onSelect: (horizon: Horizon) => void;
  /** The id of the tray a ring shows, for aria-controls. */
  panelId?: string;
  /** What the tray under the rings shows: the card for the selected ring. Its
   *  notch points up at that ring, so the card and the rings read as one.
   *  Omitted: no tray. */
  children?: ReactNode;
  /** Draws the key above the rings, so it is read before the rings are. */
  legend?: boolean;
  /** Catalogue only: shows one ring in a state a static page can't reach. */
  demo?: { horizon: Horizon; state: "hover" | "focus" | "active" };
  className?: string;
}

/* The drawing works in a 100 × 100 box and scales with CSS. Each action is
   a band with square ends, and a small cut between bands keeps them countable. */
const C0 = 50;
const R = 42;
const W = 10;
const GAP = 6;
/* In progress is drawn as thin slices, each a step further from the done
   colour towards the pale end, so the fade follows the curve of the ring. */
const SLICE = 2;

function arc(from: number, to: number): string {
  const at = (deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `${(C0 + R * Math.cos(a)).toFixed(2)} ${(C0 + R * Math.sin(a)).toFixed(2)}`;
  };
  return `M${at(from)} A${R} ${R} 0 ${to - from > 180 ? 1 : 0} 1 ${at(to)}`;
}

/**
 * One segment. The three states differ in more than hue: done is a solid
 * band, in progress fades from dark to pale along its length, and not started
 * is the pale track.
 */
function Segment({ from, to, state }: { from: number; to: number; state: MapState }) {
  if (state === "done") return <path className="map-rings__done" d={arc(from, to)} strokeWidth={W} />;
  if (state === "not-started") return <path className="map-rings__track" d={arc(from, to)} strokeWidth={W} />;
  const count = Math.max(8, Math.round((to - from) / SLICE));
  const step = (to - from) / count;
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          className="map-rings__fade"
          /* Each slice runs a hair into the next, so no seam shows. */
          d={arc(from + i * step, Math.min(to, from + (i + 1) * step + 0.4))}
          strokeWidth={W}
          style={{ "--fade": `${Math.round((i / (count - 1)) * 100)}%` } as CSSProperties}
        />
      ))}
    </>
  );
}

function Drawing({ ring }: { ring: MapRing }) {
  const segments = ring.segments.length ? ring.segments : null;
  const n = segments?.length ?? 1;
  const span = 360 / n;
  /* A single segment runs all the way round; an arc can't close on itself,
     so it stops just short of the top. */
  const gap = n > 1 ? GAP : 0;
  return (
    <svg className="map-rings__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {segments ? (
        segments.map((s, i) => (
          <Segment
            key={s.action.id}
            from={i * span + gap / 2}
            to={n > 1 ? (i + 1) * span - gap / 2 : 359.9}
            state={s.state}
          />
        ))
      ) : (
        <Segment from={0} to={359.9} state="not-started" />
      )}
    </svg>
  );
}

/**
 * The strip at the top of the homepage: one ring per horizon, one segment per
 * action on her map. Tapping a ring shows that ring's next step in a card
 * under the strip, its notch pointing at the ring, so the strip stays three
 * rings however many actions there are. A ring with every action done
 * carries a check.
 */
export function MapRings({ rings, selected, onSelect, panelId, children, legend, demo, className }: MapRingsProps) {
  const at = rings.findIndex((r) => r.horizon === selected);
  return (
    <div className="map-rings-wrap">
    {legend ? <MapLegend /> : null}
    <ul className={["map-rings", className].filter(Boolean).join(" ")}>
      {rings.map((ring) => (
        <li key={ring.horizon}>
          <button
            type="button"
            className={["map-rings__ring", demo?.horizon === ring.horizon ? `is-${demo.state}` : null].filter(Boolean).join(" ")}
            aria-pressed={selected === ring.horizon}
            data-selected={selected === ring.horizon ? "true" : undefined}
            aria-controls={panelId}
            aria-label={mapRingText(ring)}
            onClick={() => onSelect(ring.horizon)}
          >
            <span className="map-rings__draw">
              <Drawing ring={ring} />
              {ring.complete ? (
                <span className="map-rings__check" aria-hidden="true">
                  <Icon name="check" size={12} />
                </span>
              ) : null}
            </span>
            <span className="map-rings__name" aria-hidden="true">{ring.label}</span>
            <span className="map-rings__count" aria-hidden="true">{C.ringCount(ring.done, ring.segments.length)}</span>
          </button>
        </li>
      ))}
    </ul>
    {children ? (
      <div className="map-tray" id={panelId}>
        {at >= 0 ? <span className="map-tray__notch" style={{ "--at": at } as CSSProperties} aria-hidden="true" /> : null}
        {children}
      </div>
    ) : null}
    </div>
  );
}

/** The key under the strip: what the three shapes mean. */
export function MapLegend() {
  return (
    <p className="map-legend">
      <span><i className="map-legend__key map-legend__key--done" aria-hidden="true" />{C.legend.done}</span>
      <span><i className="map-legend__key map-legend__key--progress" aria-hidden="true" />{C.legend.inProgress}</span>
      <span><i className="map-legend__key map-legend__key--not" aria-hidden="true" />{C.legend.notStarted}</span>
    </p>
  );
}

export default MapRings;
