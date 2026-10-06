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
  growthMonths,
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
export type SignalPictureVariant = "items" | "summary" | "areas" | "path";

/** Her next step, as the path draws it: the next circle, and why. */
export interface PathNextStep {
  title: string;
  /** Why this step now, in the plan's own words. */
  why: string;
  /** The kind of activity it would add one to. Only steps that add a circle are shown. */
  adds: string;
  href: string;
  /** She has pressed Start or there is work on it: the circle is half full. */
  started: boolean;
  onStart: () => void;
}

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
  /** The path variant: the day her plan began, and her next step. */
  startedOn?: LoopDate;
  nextStep?: PathNextStep;
  /** The next action for the whole picture. */
  next?: PictureNext;
  /** The next action for one kind of activity, where she has one. */
  nextByActivity?: Partial<Record<ActivityType, PictureNext>>;
  /** Catalogue only: a row opens asking whether to delete. */
  demoDelete?: boolean;
  /** Catalogue only: the next step's reason is open. */
  demoWhy?: boolean;
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
  startedOn,
  nextStep,
  next,
  nextByActivity,
  demoDelete,
  demoWhy,
  headingId = "plan-signal-picture",
  className,
}: PlanSignalPictureProps) {
  /* She does not pick a window: her history decides it, like Momentum. Each wider view holds the items of the narrower one. */
  const days: WindowDays = history >= 90 ? 90 : history >= 30 ? 30 : 7;
  const full = windowIsFull(history, days);
  const visible = inWindow(items, today, days);

  if (variant === "path") {
    return (
      <PathPicture
        items={items}
        today={today}
        startedOn={startedOn ?? today}
        nextStep={nextStep}
        offer={offer}
        onAcceptOffer={onAcceptOffer}
        onDismissOffer={onDismissOffer}
        onEdit={onEdit}
        onDelete={onDelete}
        demoDelete={demoDelete}
        demoWhy={demoWhy}
        headingId={headingId}
        className={className}
      />
    );
  }

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

/* The path: a line through time, a circle for each month sized by how much she added, and her next step as the next circle. Drawn in a 361 by 140 box and placed by percent, so it scales with the card. */
const PATH_W = 361;
const PATH_H = 140;
const pct = (value: number, of: number) => `${Math.round((value / of) * 1000) / 10}%`;

function PathPicture({
  items,
  today,
  startedOn,
  nextStep,
  offer,
  onAcceptOffer,
  onDismissOffer,
  onEdit,
  onDelete,
  demoDelete,
  demoWhy,
  headingId,
  className,
}: {
  items: PictureItem[];
  today: LoopDate;
  startedOn: LoopDate;
  nextStep?: PathNextStep;
  offer?: Offer;
  onAcceptOffer?: () => void;
  onDismissOffer?: () => void;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
  demoDelete?: boolean;
  demoWhy?: boolean;
  headingId: string;
  className?: string;
}) {
  const G = C.growth;
  const months = growthMonths(items, startedOn, today);
  const [open, setOpen] = useState<number | null>(null);
  const [why, setWhy] = useState(false);
  const gap = (PATH_W - 110) / Math.max(months.length, 1);
  const dots = months.map((m, i) => {
    const n = m.items.length;
    const x = 40 + i * gap + gap / 2;
    const y = 56 + (i % 2 ? 8 : -8);
    return { ...m, n, x, y, r: n ? 12 + 7 * Math.sqrt(n) : 5 };
  });
  const nx = PATH_W - 40;
  const ny = 56;
  let line = `M10 ${dots[0]?.y ?? ny}`;
  let px = 10;
  let py = dots[0]?.y ?? ny;
  for (const d of dots) {
    const mx = (px + d.x) / 2;
    line += ` C${mx} ${py}, ${mx} ${d.y}, ${d.x} ${d.y}`;
    px = d.x;
    py = d.y;
  }
  const ahead = `M${px} ${py} C${(px + nx) / 2} ${py}, ${(px + nx) / 2} ${ny}, ${nx - 16} ${ny}`;
  const opened = open !== null ? dots[open] : undefined;
  const total = items.filter((i) => i.activity !== "inside" && i.on >= startedOn && i.on <= today).length;

  return (
    <section className={["growth-path", className].filter(Boolean).join(" ")} aria-labelledby={headingId}>
      <div className="signal-picture__head">
        <h2 className="signal-picture__heading" id={headingId}>
          {G.heading}
        </h2>
        <p className="signal-picture__intro">{G.intro}</p>
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

      <div className="growth-path__figure">
        <svg className="growth-path__svg" viewBox={`0 0 ${PATH_W} ${PATH_H}`} aria-hidden="true">
          <path className="growth-path__line" d={line} />
          <path className="growth-path__ahead" d={ahead} />
        </svg>
        {dots.map((d, i) =>
          d.n ? (
            <button
              key={i}
              type="button"
              className={["growth-path__dot", open === i ? "is-open" : ""].filter(Boolean).join(" ")}
              style={{ left: pct(d.x, PATH_W), top: pct(d.y, PATH_H), width: `${d.r * 2}px`, height: `${d.r * 2}px` }}
              aria-pressed={open === i}
              aria-label={G.month(d.label, d.n)}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {d.n}
            </button>
          ) : (
            <span key={i} className="growth-path__quiet" style={{ left: pct(d.x, PATH_W), top: pct(d.y, PATH_H) }}>
              <span className="u-visually-hidden">{G.quiet(d.label)}</span>
            </span>
          )
        )}
        {dots.map((d, i) => (
          <span key={`l${i}`} className="growth-path__month" style={{ left: pct(d.x, PATH_W) }} aria-hidden="true">
            {d.label}
          </span>
        ))}
        {nextStep ? (
          <>
            <span
              className={["growth-path__next", nextStep.started ? "is-started" : ""].filter(Boolean).join(" ")}
              style={{ left: pct(nx, PATH_W), top: pct(ny, PATH_H) }}
            >
              <span className="u-visually-hidden">{`${G.nextLabel}: ${nextStep.title}`}</span>
            </span>
            <span className="growth-path__month growth-path__month--next" style={{ left: pct(nx, PATH_W) }} aria-hidden="true">
              {G.next}
            </span>
          </>
        ) : null}
      </div>

      {opened ? (
        <ul className="signal-picture__list">
          {opened.items.map((item) => (
            <Row key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} showImpact demoDelete={demoDelete && item.editable} />
          ))}
        </ul>
      ) : (
        <p className="signal-picture__counts">{total ? G.tap : G.nothing}</p>
      )}

      {nextStep ? (
        <div className="growth-path__caption">
          <p>
            <b>{G.nextCaption}</b> {nextStep.title}. {G.adds(nextStep.adds)}
          </p>
          <div className="growth-path__actions">
            <Link href={nextStep.href} className="link" onClick={nextStep.onStart}>
              {nextStep.started ? G.keep : G.start}
            </Link>
            <Button variant="ghost" size="sm" aria-expanded={why || demoWhy} onClick={() => setWhy((w) => !w)}>
              {G.why}
            </Button>
          </div>
          {why || demoWhy ? <p className="signal-picture__counts">{nextStep.why}</p> : null}
        </div>
      ) : null}
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
