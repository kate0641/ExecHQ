import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import type { MapRing, MapSegment, MapState } from "@/lib/map";
import { MAP_COPY as C } from "@/mock/homepage";
import type { LandscapeAction } from "@/mock/plan-stub";

export interface MapPanelProps {
  ring: MapRing;
  id: string;
  /** Where an action that is started or done leads: its place in the Plan. */
  planHref: string;
  /** An action she has not started was tapped: the page opens its sheet. */
  onOpenAction: (action: LandscapeAction) => void;
  /** She asked for a new one on a complete ring. Omitted when there are no
   *  new ones left to offer, and the panel says so. */
  onAsk?: () => void;
  /** True when there is nothing new to offer after a complete ring. */
  noneLeft?: boolean;
  /** The heading's id, so focus can move to it when the panel opens. */
  headingId?: string;
  className?: string;
}

const STATE_LABEL: Record<MapState, string> = {
  done: C.state.done,
  "in-progress": C.state.inProgress,
  "not-started": C.state.notStarted,
};

function Row({ segment, planHref, onOpenAction }: { segment: MapSegment; planHref: string; onOpenAction: (a: LandscapeAction) => void }) {
  const body = (
    <>
      <span className="map-panel__text">
        <b>{segment.action.title}</b>
        <span>{segment.state === "not-started" ? C.rowRead : C.rowOpen}</span>
      </span>
      <span className={`map-panel__state map-panel__state--${segment.state}`}>{STATE_LABEL[segment.state]}</span>
    </>
  );
  return (
    <li>
      {segment.state === "not-started" ? (
        <button type="button" className="map-panel__row" onClick={() => onOpenAction(segment.action)}>
          {body}
        </button>
      ) : (
        <Link href={planHref} className="map-panel__row">
          {body}
        </Link>
      )}
    </li>
  );
}

/**
 * What is in the ring she tapped, as a list. An action she is on, or has
 * finished, leads to the Plan to learn more. One she has not started opens
 * the sheet where she reads why, then starts it or says it is not for her.
 * On a complete ring she can ask for a new one.
 */
export function MapPanel({ ring, id, planHref, onOpenAction, onAsk, noneLeft, headingId, className }: MapPanelProps) {
  const unstarted = ring.segments.some((s) => s.state === "not-started");
  return (
    <section id={id} className={["map-panel", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <h2 className="map-panel__heading" id={headingId} tabIndex={-1}>
        {ring.label}
      </h2>
      <p className="map-panel__hint">{ring.segments.length ? (unstarted ? C.panelHintUnstarted : C.panelHint) : C.ringEmpty}</p>
      {ring.segments.length ? (
        <ul className="map-panel__list">
          {ring.segments.map((s) => (
            <Row key={s.action.id} segment={s} planHref={planHref} onOpenAction={onOpenAction} />
          ))}
        </ul>
      ) : null}
      {ring.complete ? (
        onAsk ? (
          <Button variant="secondary" fullWidth onClick={onAsk}>
            {C.askNew}
          </Button>
        ) : noneLeft ? (
          <p className="map-panel__hint">{C.askNone}</p>
        ) : null
      ) : null}
    </section>
  );
}

export default MapPanel;
