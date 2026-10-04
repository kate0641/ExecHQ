"use client";

import { useId, useState } from "react";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import {
  areaName,
  byArea,
  directionOf,
  inWindow,
  newestFirst,
  windowIsFull,
  type AreaGroup,
  type Offer,
  type PictureItem,
} from "@/lib/signal-picture";
import { shortDate, type LoopDate } from "@/lib/loop";
import { SIGNAL_PICTURE_COPY as C, WINDOWS, type WindowDays } from "@/mock/plan";

export interface PlanSignalPictureProps {
  items: PictureItem[];
  today: LoopDate;
  /** Days of record she has. A window longer than this says so. */
  history: number;
  onAdd: () => void;
  onEdit: (item: PictureItem) => void;
  onDelete: (item: PictureItem) => void;
  /** A moment to offer the entry flow: a piece she has just published. */
  offer?: Offer;
  onAcceptOffer?: () => void;
  onDismissOffer?: () => void;
  initialWindow?: WindowDays;
  /** Catalogue only: a row opens asking whether to delete. */
  demoDelete?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * A private, factual record of what moved, embedded in the Plan. Each item
 * says in words where it came from, "Recorded in ExecHQ" or "You added", and
 * the two are never folded into one count without that label. Seven days is
 * each item; thirty groups them by plan area, with the channel as a tag; ninety
 * is the direction of travel for each area, with what is behind it one tap
 * away. A window with too little history says so, and shows what there is.
 *
 * Nothing here is a number she could mistake for a score: no percentage,
 * grade, gauge or rank, and nothing compared with anyone.
 */
export function PlanSignalPicture({
  items,
  today,
  history,
  onAdd,
  onEdit,
  onDelete,
  offer,
  onAcceptOffer,
  onDismissOffer,
  initialWindow = 7,
  demoDelete,
  headingId = "plan-signal-picture",
  className,
}: PlanSignalPictureProps) {
  const [days, setDays] = useState<WindowDays>(initialWindow);
  const full = windowIsFull(history, days);
  const visible = inWindow(items, today, days);

  return (
    <section className={["signal-picture", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="signal-picture__head">
        <h2 className="signal-picture__heading" id={headingId}>
          {C.heading}
        </h2>
        <p className="signal-picture__intro">{C.intro}</p>
        <p className="signal-picture__key">{C.key}</p>
      </div>

      {offer ? (
        <aside className="signal-picture__offer" aria-label={C.add}>
          <p>{C.offer(offer.title)}</p>
          <div className="signal-picture__row-actions">
            <Button variant="primary" size="sm" onClick={onAcceptOffer}>
              {C.offerYes}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDismissOffer}>
              {C.offerNo}
            </Button>
          </div>
        </aside>
      ) : null}

      <ToggleGroup
        label={C.windowLabel}
        labelHidden
        shape="pill"
        size="sm"
        options={WINDOWS.map((w) => ({ value: String(w), label: C.windows[w] }))}
        value={String(days)}
        onChange={(v) => setDays(Number(v) as WindowDays)}
      />

      {!full ? <p className="signal-picture__thin">{C.thin(history, days)}</p> : null}

      {items.length === 0 ? (
        <p className="signal-picture__empty">{C.empty}</p>
      ) : days === 7 ? (
        visible.length ? (
          <ul className="signal-picture__list">
            {newestFirst(visible).map((item) => (
              <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} showArea demoDelete={demoDelete && item.editable} />
            ))}
          </ul>
        ) : (
          <p className="signal-picture__empty">{C.quiet(7)}</p>
        )
      ) : days === 90 && full ? (
        <div className="signal-picture__areas">
          {byArea(visible).map((group) => (
            <Direction key={group.areaId} group={group} today={today} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {visible.length === 0 ? <p className="signal-picture__empty">{C.quiet(90)}</p> : null}
        </div>
      ) : visible.length ? (
        <div className="signal-picture__areas">
          {!full ? <p className="signal-picture__thin-now">{C.thinNow}</p> : null}
          {byArea(visible).map((group) => (
            <Group key={group.areaId} group={group} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <p className="signal-picture__empty">{C.quiet(days)}</p>
      )}

      <div>
        <Button variant="secondary" size="sm" onClick={onAdd}>
          <Icon name="plus" size={14} />
          {C.add}
        </Button>
      </div>
    </section>
  );
}

/** Where an item came from, in words and a mark, never colour alone. */
function Source({ source }: { source: PictureItem["source"] }) {
  return (
    <span className={`signal-picture__source signal-picture__source--${source}`}>
      <Icon name={source === "recorded" ? "document" : "pencil"} size={12} />
      {source === "recorded" ? C.recorded : C.added}
    </span>
  );
}

function Group({
  group,
  onEdit,
  onDelete,
}: {
  group: AreaGroup;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
}) {
  const id = useId();
  return (
    <section className="signal-picture__group" aria-labelledby={id}>
      <h3 className="signal-picture__area" id={id}>
        {group.name}
      </h3>
      <p className="signal-picture__counts">{C.counts(group.recorded.length, group.added.length)}</p>
      <ul className="signal-picture__list">
        {[...group.recorded, ...group.added].map((item) => (
          <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
    </section>
  );
}

function Direction({
  group,
  today,
  onEdit,
  onDelete,
}: {
  group: AreaGroup;
  today: LoopDate;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const word = C.direction[directionOf([...group.recorded, ...group.added], today, 90)];
  return (
    <section className="signal-picture__group" aria-labelledby={id}>
      <h3 className="signal-picture__area" id={id}>
        {C.directionLine(group.name, word)}
      </h3>
      <Button variant="ghost" size="sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? C.hideBehind : C.behind}
        <Icon name={open ? "chevron-up" : "chevron-down"} size={16} />
      </Button>
      {open ? (
        <>
          <p className="signal-picture__counts">{C.counts(group.recorded.length, group.added.length)}</p>
          <ul className="signal-picture__list">
            {[...group.recorded, ...group.added].map((item) => (
              <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function Row({
  item,
  onEdit,
  onDelete,
  showArea,
  demoDelete,
}: {
  item: PictureItem;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
  showArea?: boolean;
  demoDelete?: boolean;
}) {
  const [asking, setAsking] = useState(Boolean(demoDelete));
  return (
    <li className="signal-picture__item">
      <div className="signal-picture__item-top">
        <Source source={item.source} />
        {item.tag ? <Badge tone="neutral">{item.tag}</Badge> : null}
        <span className="signal-picture__date">{shortDate(item.on)}</span>
      </div>
      <p className={item.quote ? "signal-picture__text signal-picture__text--quote" : "signal-picture__text"}>
        {item.quote ? <>“{item.text}”</> : item.text}
      </p>
      {item.link ? (
        <a className="link" href={item.link} target="_blank" rel="noreferrer">
          {C.openLink} <span className="u-visually-hidden">{C.opensNewTab}</span>
        </a>
      ) : null}
      {showArea ? <p className="signal-picture__where">{C.areaOf(areaName(item.areaId))}</p> : null}
      {item.editable ? (
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
