import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import type { MapRing, MapSegment, MapState } from "@/lib/map";
import { MAP_COPY as C } from "@/mock/homepage";
import type { LandscapeAction } from "@/mock/plan-stub";

export interface MapRoundupProps {
  rings: MapRing[];
  /** Where a row leads. On the homepage every row leads to its place in the
   *  Plan. Omit it, or return nothing, for a row that is not a link. */
  hrefFor?: (action: LandscapeAction) => string | undefined;
  /** For an action she has not started and that has no link: tapping it opens
   *  it. The Plan page uses this to open the start-or-skip sheet. Any other
   *  row without a link is a quiet line. */
  onOpen?: (action: LandscapeAction) => void;
  /** The small line under each title. */
  lineFor: (segment: MapSegment) => string | undefined;
  /** She asked for a new one on a complete ring. */
  onAsk?: (ring: MapRing) => void;
  /** True when there is nothing new left to offer after a complete ring. */
  noneLeft?: (ring: MapRing) => boolean;
  /** Prefix for each group's heading id. */
  idPrefix?: string;
  className?: string;
}

const STATE_LABEL: Record<MapState, string> = {
  done: C.state.done,
  "in-progress": C.state.inProgress,
  "not-started": C.state.notStarted,
};

function Row({ segment, href, onOpen, line }: { segment: MapSegment; href?: string; onOpen?: (a: LandscapeAction) => void; line?: string }) {
  const body = (
    <>
      <span className="map-roundup__text">
        <b>{segment.action.title}</b>
        {line ? <span>{line}</span> : null}
      </span>
      <span className={`map-roundup__state map-roundup__state--${segment.state}`}>{STATE_LABEL[segment.state]}</span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="map-roundup__row">
        {body}
      </Link>
    );
  }
  if (onOpen && segment.state === "not-started") {
    return (
      <button type="button" className="map-roundup__row" onClick={() => onOpen(segment.action)}>
        {body}
      </button>
    );
  }
  return <div className="map-roundup__row map-roundup__row--quiet">{body}</div>;
}

/**
 * Every action on her map, grouped under the ring it belongs to, always in
 * view: what she is on, what is done, and what is still ahead. No card
 * around it, so it can grow without feeling cramped. On the homepage each
 * row leads to the Plan, where she reads the context, and starts an action
 * or says it is not for her. A complete ring offers a new one.
 */
export function MapRoundup({ rings, hrefFor, onOpen, lineFor, onAsk, noneLeft, idPrefix = "roundup", className }: MapRoundupProps) {
  return (
    <div className={["map-roundup", className].filter(Boolean).join(" ")}>
      {rings.map((ring) => (
        <section key={ring.horizon} className="map-roundup__group" aria-labelledby={`${idPrefix}-${ring.horizon}`}>
          <h3 className="map-roundup__heading" id={`${idPrefix}-${ring.horizon}`}>
            {ring.label}
          </h3>
          {ring.segments.length ? (
            <ul className="map-roundup__list">
              {ring.segments.map((s) => (
                <li key={s.action.id} id={`action-${s.action.id}`}>
                  <Row segment={s} href={hrefFor?.(s.action)} onOpen={onOpen} line={lineFor(s)} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="map-roundup__empty">{C.ringEmpty}</p>
          )}
          {ring.complete ? (
            onAsk && !noneLeft?.(ring) ? (
              <Button variant="secondary" fullWidth onClick={() => onAsk(ring)}>
                {C.askNew}
              </Button>
            ) : noneLeft?.(ring) ? (
              <p className="map-roundup__empty">{C.askNone}</p>
            ) : null
          ) : null}
        </section>
      ))}
    </div>
  );
}

export default MapRoundup;
