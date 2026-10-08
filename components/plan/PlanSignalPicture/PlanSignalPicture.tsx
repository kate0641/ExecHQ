"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { cameOfRows, type CameOfRow, type PictureItem } from "@/lib/signal-picture";
import { shortDate, type LoopDate } from "@/lib/loop";
import { SIGNAL_PICTURE_COPY as C } from "@/mock/plan";

export interface PlanSignalPictureProps {
  items: PictureItem[];
  today: LoopDate;
  /** The day her plan began: only what she did since then is a row. */
  startedOn: LoopDate;
  onEdit: (item: PictureItem) => void;
  onDelete: (item: PictureItem) => void;
  /** The "Nothing reported yet" box on a row is tappable, and says which row. */
  onReport?: (row: CameOfRow) => void;
  /** Catalogue only: a row opens asking whether to delete. */
  demoDelete?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * What came of it: a row for each thing she put out in the world since her plan began, newest first,
 * what she did pointing at what she says came of it, in her words. Never worked out for her, and
 * nothing here is a number she could mistake for a score. No next action and no add button: the page
 * has those.
 */
export function PlanSignalPicture({ items, today, startedOn, onEdit, onDelete, onReport, demoDelete, headingId = "plan-signal-picture", className }: PlanSignalPictureProps) {
  return (
    <CameOf
      items={items}
      today={today}
      startedOn={startedOn}
      onEdit={onEdit}
      onDelete={onDelete}
      onReport={onReport}
      demoDelete={demoDelete}
      headingId={headingId}
      className={className}
    />
  );
}

/** A row for each thing she did and what she says came of it: what she did in a dark block that points at her words. A thing with no reply shows a quiet dashed block, never a miss. */
function CameOf({
  items,
  today,
  startedOn,
  onEdit,
  onDelete,
  onReport,
  demoDelete,
  headingId,
  className,
}: {
  items: PictureItem[];
  today: LoopDate;
  startedOn: LoopDate;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
  onReport?: PlanSignalPictureProps["onReport"];
  demoDelete?: boolean;
  headingId: string;
  className?: string;
}) {
  const G = C.cameOf;
  const [all, setAll] = useState(false);
  const rows = cameOfRows(items, startedOn, today);
  const shown = all ? rows : rows.slice(0, 5);
  return (
    <section className={["came-of", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="signal-picture__head">
        <h2 className="signal-picture__heading" id={headingId}>
          {G.heading}
        </h2>
        <p className="signal-picture__intro">{G.intro}</p>
      </div>
      {rows.length ? (
        <>
          <ul className="came-of__rows">
            {shown.map((row) => (
              <CameOfRowView key={row.id} row={row} onEdit={onEdit} onDelete={onDelete} onReport={onReport} demoDelete={demoDelete} />
            ))}
          </ul>
          {rows.length > 5 ? (
            <Button variant="ghost" size="sm" aria-expanded={all} onClick={() => setAll((v) => !v)}>
              {all ? G.fewer : G.more(rows.length - 5)}
            </Button>
          ) : null}
        </>
      ) : (
        <p className="signal-picture__empty">{G.none}</p>
      )}
    </section>
  );
}

function CameOfRowView({
  row,
  onEdit,
  onDelete,
  onReport,
  demoDelete,
}: {
  row: CameOfRow;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
  onReport?: PlanSignalPictureProps["onReport"];
  demoDelete?: boolean;
}) {
  const G = C.cameOf;
  const [asking, setAsking] = useState(Boolean(demoDelete && row.item?.editable));
  const item = row.item;
  return (
    <li className={["came-of__row", row.came ? "" : "is-quiet"].filter(Boolean).join(" ")}>
      <div className="came-of__flow">
        <div className="came-of__did">
          <span className="came-of__date">{shortDate(row.on)}</span>
          {row.did}
        </div>
        <span className="came-of__tip" aria-hidden="true" />
        {row.came ? (
          <div className="came-of__reply">
            <span className="u-visually-hidden">{G.cameOfIt}</span>
            {row.came}
          </div>
        ) : onReport ? (
          <button type="button" className="came-of__reply came-of__reply--ask" onClick={() => onReport(row)}>
            {G.noReply}
            <span className="came-of__ask-hint">{G.report}</span>
          </button>
        ) : (
          <div className="came-of__reply">{G.noReply}</div>
        )}
      </div>
      {item?.editable ? (
        asking ? (
          <div className="signal-picture__row-actions">
            <span className="signal-picture__ask">{C.deleteAsk}</span>
            <Button variant="secondary" size="sm" onClick={() => onDelete(item)}>
              {C.deleteYes}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAsking(false)}>
              {C.deleteNo}
            </Button>
          </div>
        ) : (
          <div className="signal-picture__row-actions">
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              {C.edit}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setAsking(true)}>
              {C.delete}
            </Button>
          </div>
        )
      ) : null}
    </li>
  );
}

export default PlanSignalPicture;
