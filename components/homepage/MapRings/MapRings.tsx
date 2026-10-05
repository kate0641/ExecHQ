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

/* The drawing works in a 100 × 100 box and scales with CSS. */
const C0 = 50;
const W = 12;
const R = C0 - W / 2 - 2;

function point(deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C0 + R * Math.cos(a), C0 + R * Math.sin(a)];
}

function arc(from: number, to: number): string {
  const [x0, y0] = point(from);
  const [x1, y1] = point(to);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${to - from > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/**
 * One segment. The three states differ in shape as well as colour: done is
 * solid, in progress is outlined with a pale centre, not started is dashed.
 */
function Segment({ from, to, whole, state }: { from: number; to: number; whole: boolean; state: MapState }) {
  const shape = (className: string, width: number, dashed = false) =>
    whole ? (
      <circle className={className} cx={C0} cy={C0} r={R} strokeWidth={width} strokeDasharray={dashed ? "5 5" : undefined} />
    ) : (
      <path
        className={className}
        d={arc(from, to)}
        strokeWidth={width}
        strokeLinecap={dashed ? "butt" : "round"}
        strokeDasharray={dashed ? "4 4" : undefined}
      />
    );
  if (state === "done") return shape("map-rings__done", W);
  if (state === "in-progress") return <>{shape("map-rings__done", W)}{shape("map-rings__hole", W - 3.4)}</>;
  return shape("map-rings__not", W - 4, true);
}

function Drawing({ ring }: { ring: MapRing }) {
  const segments = ring.segments.length ? ring.segments : null;
  const n = segments?.length ?? 1;
  const span = 360 / n;
  const cap = (W / 2 / (2 * Math.PI * R)) * 360;
  const gap = n > 1 ? 14 : 0;
  return (
    <svg className="map-rings__svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {segments ? (
        segments.map((s, i) => (
          <Segment
            key={s.action.id}
            whole={n === 1}
            from={i * span + gap / 2 + cap / 2}
            to={(i + 1) * span - gap / 2 - cap / 2}
            state={s.state}
          />
        ))
      ) : (
        <Segment from={0} to={360} whole state="not-started" />
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
