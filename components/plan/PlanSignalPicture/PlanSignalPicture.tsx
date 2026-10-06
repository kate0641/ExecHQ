"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import {
  areaName,
  byActivity,
  directionOf,
  impactsIn,
  inWindow,
  newestFirst,
  windowIsFull,
  type ActivityGroup,
  type Offer,
  type PictureItem,
} from "@/lib/signal-picture";
import { shortDate, type LoopDate } from "@/lib/loop";
import { SIGNAL_PICTURE_COPY as C, type ActivityType, type WindowDays } from "@/mock/plan";

/** How the picture shows what came of things and what to do next.
 *  - items: what came of it sits under each thing she did; one next action at the foot.
 *  - summary: three short lines for the window (what you did, what it led to,
 *    next action), with the items behind a tap.
 *  - areas: one card per kind of activity, each with its own next action. */
export type SignalPictureVariant = "items" | "summary" | "areas";

export interface PictureNext {
  title: string;
  /** Where Start goes: the Toolbox. */
  href: string;
}

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
  variant?: SignalPictureVariant;
  /** The next action for the whole picture. */
  next?: PictureNext;
  /** The next action for one kind of activity, where she has one. */
  nextByActivity?: Partial<Record<ActivityType, PictureNext>>;
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
  variant = "items",
  next,
  nextByActivity,
  demoDelete,
  headingId = "plan-signal-picture",
  className,
}: PlanSignalPictureProps) {
  /* She does not pick a window: her history decides it, like Momentum. Each wider view holds the items of the narrower one. */
  const days: WindowDays = history >= 90 ? 90 : history >= 30 ? 30 : 7;
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

      {items.length ? <p className="signal-picture__window">{full ? C.windowHeading[days] : C.thinNow}</p> : null}

      {items.length === 0 ? (
        <p className="signal-picture__empty">{C.empty}</p>
      ) : variant === "summary" ? (
        <Summary
          visible={visible}
          today={today}
          days={days}
          full={full}
          next={next}
          onEdit={onEdit}
          onDelete={onDelete}
          demoDelete={demoDelete}
        />
      ) : variant === "areas" ? (
        visible.length ? (
          <div className="signal-picture__areas">
            {byActivity(visible).map((group) => (
              <ActivityCard
                key={group.activity}
                group={group}
                today={today}
                days={days}
                full={full}
                next={nextByActivity?.[group.activity]}
                onEdit={onEdit}
                onDelete={onDelete}
                demoDelete={demoDelete}
              />
            ))}
          </div>
        ) : (
          <p className="signal-picture__empty">{C.quiet(days)}</p>
        )
      ) : days === 7 ? (
        visible.length ? (
          <>
            <ul className="signal-picture__list">
              {newestFirst(visible).map((item) => (
                <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} showImpact demoDelete={demoDelete && item.editable} />
              ))}
            </ul>
            <NextCard next={next} />
          </>
        ) : (
          <p className="signal-picture__empty">{C.quiet(7)}</p>
        )
      ) : visible.length ? (
        <>
          <div className="signal-picture__areas">
            {byActivity(visible).map((group) =>
              days === 90 && full ? (
                <Direction key={group.activity} group={group} today={today} onEdit={onEdit} onDelete={onDelete} />
              ) : (
                <Group key={group.activity} group={group} onEdit={onEdit} onDelete={onDelete} />
              )
            )}
          </div>
          <NextCard next={next} />
        </>
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

/** The one thing to do next, with Start opening the Toolbox. */
function NextCard({ next }: { next?: PictureNext }) {
  const id = useId();
  if (!next) return null;
  return (
    <section className="signal-picture__next" aria-labelledby={id}>
      <h3 className="signal-picture__label" id={id}>
        {C.nextLabel}
      </h3>
      <p className="signal-picture__next-title">{next.title}</p>
      <Link href={next.href} className="btn btn--primary btn--md">
        {C.nextStart}
      </Link>
    </section>
  );
}

/** What she reported came of things, in her words, each with the thing it followed. */
function Impacts({ visible, today, days }: { visible: PictureItem[]; today: LoopDate; days: number }) {
  const impacts = impactsIn(visible, today, days);
  if (impacts.length === 0) return <p className="signal-picture__impact-none">{C.windowImpactNone(days)}</p>;
  return (
    <ul className="signal-picture__impacts">
      {impacts.map((i) => (
        <li key={i.id}>
          <span className="signal-picture__text">{i.text}</span>
          <span className="signal-picture__date">{C.after(i.of)}</span>
        </li>
      ))}
    </ul>
  );
}

/** What she did in the window, as a line of counts or, over ninety days, of directions. */
function didLine(visible: PictureItem[], today: LoopDate, days: number, full: boolean): string {
  const groups = byActivity(visible);
  /* Work inside the organisation is Momentum's to count; it leads here only when it is all there is. */
  const outside = groups.filter((g) => g.activity !== "inside");
  return (outside.length ? outside : groups)
    .map((g) => {
      const all = [...g.recorded, ...g.added];
      return days === 90 && full
        ? C.directionLine(g.name, C.direction[directionOf(all, today, 90)])
        : C.countLine(g.name, all.length);
    })
    .join(" · ");
}

function Summary({
  visible,
  today,
  days,
  full,
  next,
  onEdit,
  onDelete,
  demoDelete,
}: {
  visible: PictureItem[];
  today: LoopDate;
  days: number;
  full: boolean;
  next?: PictureNext;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
  demoDelete?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const behindId = useId();
  if (visible.length === 0) return <p className="signal-picture__empty">{C.quiet(days)}</p>;
  return (
    <>
      <div className="signal-picture__summary">
        <div>
          <h3 className="signal-picture__label">{C.didLabel}</h3>
          <p className="signal-picture__text">{didLine(visible, today, days, full)}</p>
        </div>
        <div>
          <h3 className="signal-picture__label">{C.ledLabel}</h3>
          <Impacts visible={visible} today={today} days={days} />
        </div>
        <NextCard next={next} />
      </div>
      <div className="signal-picture__behind">
        <Button variant="ghost" size="sm" aria-expanded={open} aria-controls={behindId} onClick={() => setOpen((o) => !o)}>
          {open ? C.hideBehind : C.behind}
          <Icon name={open ? "chevron-up" : "chevron-down"} size={16} />
        </Button>
        {open ? (
          <ul className="signal-picture__list" id={behindId}>
            {newestFirst(visible).map((item) => (
              <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} demoDelete={demoDelete && item.editable} />
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}

function ActivityCard({
  group,
  today,
  days,
  full,
  next,
  onEdit,
  onDelete,
  demoDelete,
}: {
  group: ActivityGroup;
  today: LoopDate;
  days: number;
  full: boolean;
  next?: PictureNext;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
  demoDelete?: boolean;
}) {
  const id = useId();
  const all = [...group.recorded, ...group.added];
  const word = days === 90 && full ? C.direction[directionOf(all, today, 90)] : undefined;
  return (
    <section className="signal-picture__group signal-picture__group--card" aria-labelledby={id}>
      <h3 className="signal-picture__area" id={id}>
        {word ? C.directionLine(group.name, word) : group.name}
      </h3>
      <p className="signal-picture__counts">{C.counts(group.recorded.length, group.added.length)}</p>
      <ul className="signal-picture__list">
        {all.map((item) => (
          <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} showImpact demoDelete={demoDelete && item.editable} />
        ))}
      </ul>
      <NextCard next={next} />
    </section>
  );
}

function Group({
  group,
  onEdit,
  onDelete,
}: {
  group: ActivityGroup;
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
          <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} showImpact />
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
  group: ActivityGroup;
  today: LoopDate;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const all = [...group.recorded, ...group.added];
  const word = C.direction[directionOf(all, today, 90)];
  const impacts = all.filter((i) => i.impact);
  return (
    <section className="signal-picture__group" aria-labelledby={id}>
      <h3 className="signal-picture__area" id={id}>
        {C.directionLine(group.name, word)}
      </h3>
      {impacts.length ? (
        <ul className="signal-picture__impacts">
          {impacts.map((i) => (
            <li key={i.id}>
              <span className="signal-picture__text">{i.impact}</span>
              <span className="signal-picture__date">{C.after(i.text)}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <Button variant="ghost" size="sm" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? C.hideBehind : C.behind}
        <Icon name={open ? "chevron-up" : "chevron-down"} size={16} />
      </Button>
      {open ? (
        <>
          <p className="signal-picture__counts">{C.counts(group.recorded.length, group.added.length)}</p>
          <ul className="signal-picture__list">
            {all.map((item) => (
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
  showImpact,
  demoDelete,
}: {
  item: PictureItem;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
  showArea?: boolean;
  /** Under the item, what she said came of it, or a way to add it. */
  showImpact?: boolean;
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
      {showImpact && item.impact ? (
        <p className="signal-picture__impact">
          <span className="signal-picture__label">{C.impactHeading}</span>
          {item.impact}
        </p>
      ) : null}
      {showImpact && !item.impact && item.editable ? (
        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
          {C.impactAdd}
        </Button>
      ) : null}
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
