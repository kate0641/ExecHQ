"use client";

import { useState } from "react";
import { Notice } from "@/components/onboarding/Notice";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PROFILE_COPY, PROFILE_PROVISIONAL } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";

type Format = keyof typeof PROFILE_COPY.export.formats;

export interface ExportDetailProps {
  /** The titles of her drafts, as the Loop names them. */
  drafts: string[];
  onClose?: () => void;
  headingId?: string;
  /** Catalogue only: open on the ready message. */
  startReady?: boolean;
  startFormat?: Format;
}

const C = PROFILE_COPY.export;
const FORMATS = Object.keys(C.formats) as Format[];

/**
 * Downloading her data: exactly what the file holds, a choice of format,
 * and a plain confirmation. PROVISIONAL: format and scope are open with the
 * client, and the note says so.
 */
export function ExportDetail({
  drafts,
  onClose,
  headingId = "export-heading",
  startReady = false,
  startFormat = "pdf",
}: ExportDetailProps) {
  const [format, setFormat] = useState<Format>(startFormat);
  const [ready, setReady] = useState(startReady);
  const includes = [
    ...(drafts.length ? [C.includes.drafts(drafts)] : []),
    C.includes.loop,
    C.includes.answers,
    C.includes.connections,
  ];

  return (
    <DetailPanel heading={C.heading} headingId={headingId} lead={C.body} onClose={onClose}>
      <ul className="detail-list">
        {includes.map((line) => (
          <li key={line}>
            <Icon name="check" size={16} />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <fieldset className="format-choice">
        <legend className="format-choice__legend">{C.formatLabel}</legend>
        {FORMATS.map((key) => (
          <div key={key} className="format-choice__option">
            <input
              type="radio"
              id={`${headingId}-${key}`}
              name={`${headingId}-format`}
              value={key}
              aria-labelledby={`${headingId}-${key}-name`}
              aria-describedby={`${headingId}-${key}-description`}
              checked={format === key}
              onChange={() => {
                setFormat(key);
                setReady(false);
              }}
            />
            <label className="format-choice__text" htmlFor={`${headingId}-${key}`}>
              <span className="format-choice__name" id={`${headingId}-${key}-name`}>{C.formats[key].name}</span>
              <span className="format-choice__description" id={`${headingId}-${key}-description`}>{C.formats[key].description}</span>
            </label>
          </div>
        ))}
      </fieldset>
      <Notice tone="explain" label={PROFILE_PROVISIONAL.label}>
        {PROFILE_PROVISIONAL.export}
      </Notice>
      {ready ? (
        <Notice tone="success" live>
          {C.ready(C.fileName(format))}
        </Notice>
      ) : null}
      <div className="detail-panel__actions">
        {ready ? (
          onClose ? (
            <Button variant="secondary" fullWidth onClick={onClose}>
              {C.done}
            </Button>
          ) : null
        ) : (
          <Button fullWidth onClick={() => setReady(true)}>
            <Icon name="download" size={16} />
            {C.prepare}
          </Button>
        )}
      </div>
    </DetailPanel>
  );
}

export default ExportDetail;
