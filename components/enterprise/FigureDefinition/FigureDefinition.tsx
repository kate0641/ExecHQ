"use client";

import { useId } from "react";
import { Button } from "@/components/primitives/Button";
import { DATA_POINTS, ENTERPRISE_COPY, WINDOWS, type DataPointId, type WindowId } from "@/mock/enterprise";

const C = ENTERPRISE_COPY.definition;

export interface FigureDefinitionProps {
  id: DataPointId;
  window: WindowId;
  /** Shows a Close button. Left off where the definition sits on the page. */
  onClose?: () => void;
  /** The heading's level, so it sits in the page's outline wherever it is placed. */
  headingLevel?: 2 | 3 | 4;
  headingId?: string;
}

/**
 * What a figure counts, where it comes from, the window it covers, and the
 * privacy rule it is under: one sentence each, plain enough for a talent lead
 * to repeat to their own leadership without ExecHQ in the room.
 */
export function FigureDefinition({ id, window, onClose, headingLevel = 3, headingId }: FigureDefinitionProps) {
  const fallbackId = useId();
  const labelId = headingId ?? fallbackId;
  const point = DATA_POINTS[id];
  const Heading = `h${headingLevel}` as const;
  const windowText = point.sinceLaunch ? C.windowSinceLaunch : C.windowFor(WINDOWS[window].long);

  return (
    <section className="figure-definition" aria-labelledby={labelId}>
      <Heading className="figure-definition__heading" id={labelId}>
        {point.label}
      </Heading>
      <dl className="figure-definition__list">
        <div className="figure-definition__row">
          <dt>{C.counts}</dt>
          <dd>{point.definition}</dd>
        </div>
        <div className="figure-definition__row">
          <dt>{C.source}</dt>
          <dd>{point.source}</dd>
        </div>
        <div className="figure-definition__row">
          <dt>{C.window}</dt>
          <dd>{windowText}</dd>
        </div>
        <div className="figure-definition__row">
          <dt>{C.privacy}</dt>
          <dd>{point.alwaysShown ? C.privacyAlways : C.privacyRule}</dd>
        </div>
      </dl>
      {onClose ? (
        <Button variant="secondary" size="sm" onClick={onClose}>
          {C.close}
        </Button>
      ) : null}
    </section>
  );
}

export default FigureDefinition;
