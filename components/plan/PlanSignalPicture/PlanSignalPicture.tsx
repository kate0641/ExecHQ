"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import {
  areaName,
  byActivity,
  cameOfRows,
  directionOf,
  growthMonths,
  inWindow,
  newestFirst,
  windowIsFull,
  type ActivityGroup,
  type CameOfRow,
  type Offer,
  type PictureItem,
} from "@/lib/signal-picture";
import { shortDate, type LoopDate } from "@/lib/loop";
import { PRESENCE_CARD_COPY } from "@/mock/accounts-stub";
import { ACTIVITY_TYPES, SIGNAL_PICTURE_COPY as C, type ActivityType, type WindowDays } from "@/mock/plan";

/** How the picture shows what came of things and what to do next.
 *  - items: what came of it sits under each thing she did; one next action at the foot.
 *  - map: where she shows up, a dot for each thing in four equal territories,
 *    with her followers above and her next step as a dashed dot.
 *  - cameof: only what she says came of the things she did, in her words,
 *    with what it followed. No next action and no add button: the page has those.
 *  - areas: one card per kind of activity, each with its own next action. */
export type SignalPictureVariant = "items" | "cameof" | "areas" | "path" | "map";

/** Her next step, as the path draws it: the next circle, and why. */
export interface PathNextStep {
  title: string;
  /** Why this step now, in the plan's own words. */
  why: string;
  /** The kind of activity it would add one to, in words. Only steps that add a circle are shown. */
  adds: string;
  /** The same, as the kind the map puts its dot under. */
  activity?: ActivityType;
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
  /** The path and map variants: the day her plan began, and her next step. */
  startedOn?: LoopDate;
  nextStep?: PathNextStep;
  /** The map variant: her followers, what she had of each kind when she started, and a suggestion. */
  hero?: { label: string; now: string | number; then: string | number };
  before?: Partial<Record<ActivityType, number>>;
  tryThis?: { title: string; why: string; label: string; href: string };
  tryLabel?: string;
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
  hero,
  before,
  tryThis,
  tryLabel,
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

  if (variant === "map") {
    return (
      <MapPicture
        items={items}
        today={today}
        startedOn={startedOn ?? today}
        hero={hero}
        before={before}
        nextStep={nextStep}
        tryThis={tryThis}
        tryLabel={tryLabel}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        demoDelete={demoDelete}
        demoWhy={demoWhy}
        headingId={headingId}
        className={className}
      />
    );
  }

  if (variant === "cameof") {
    return (
      <CameOf
        items={items}
        today={today}
        startedOn={startedOn ?? today}
        onEdit={onEdit}
        onDelete={onDelete}
        demoDelete={demoDelete}
        headingId={headingId}
        className={className}
      />
    );
  }

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

      {nextStep ? <NextCaption nextStep={nextStep} demoWhy={demoWhy} /> : null}
    </section>
  );
}

/* The map: four equal territories, a dot for each thing in each. Hollow is what she had when she started, filled is what she has added since, dashed is her next step. A territory is never smaller or behind, and none has a target. */
const MAP_TERRITORIES: ActivityType[] = ["publishing", "speaking", "podcast", "press"];

function MapPicture({
  items,
  today,
  startedOn,
  hero,
  before,
  nextStep,
  tryThis,
  tryLabel,
  onAdd,
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
  hero?: PlanSignalPictureProps["hero"];
  before?: PlanSignalPictureProps["before"];
  nextStep?: PathNextStep;
  tryThis?: PlanSignalPictureProps["tryThis"];
  tryLabel?: string;
  onAdd: () => void;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
  demoDelete?: boolean;
  demoWhy?: boolean;
  headingId: string;
  className?: string;
}) {
  const G = C.map;
  const [open, setOpen] = useState<string | null>(null);
  const since = items
    .filter((i) => i.on >= startedOn && i.on <= today)
    .sort((a, b) => (a.on < b.on ? -1 : a.on > b.on ? 1 : 0));
  const elseItems = since.filter((i) => i.activity === "other");
  const territories = [
    ...MAP_TERRITORIES.map((id) => ({ id, label: ACTIVITY_TYPES.find((t) => t.id === id)?.label ?? id })),
    ...(elseItems.length ? [{ id: "other" as ActivityType, label: G.something }] : []),
  ];
  const gain = hero ? Number(String(hero.now).replace(/,/g, "")) - Number(String(hero.then).replace(/,/g, "")) : 0;
  const opened = since.find((i) => i.id === open);

  return (
    <div className={["map", className].filter(Boolean).join(" ")}>
      <section className="map__card" aria-labelledby={headingId}>
        <div className="signal-picture__head">
          <h2 className="signal-picture__heading" id={headingId}>
            {G.heading}
          </h2>
          <p className="signal-picture__intro">{G.intro}</p>
        </div>
        {hero ? (
          <div className="presence-clean__hero">
            <span className="presence-clean__hero-label">{hero.label}</span>
            <span className="presence-clean__hero-now">{hero.now}</span>
            <span className="presence-clean__hero-sub">
              {gain > 0 ? (
                <>
                  {PRESENCE_CARD_COPY.was(String(hero.then))} · <b>{PRESENCE_CARD_COPY.up(gain.toLocaleString("en-US"))}</b>
                </>
              ) : (
                PRESENCE_CARD_COPY.sameAsStart(String(hero.then))
              )}
            </span>
          </div>
        ) : null}
        <div className="map__grid">
          {territories.map((t) => {
            const had = t.id === "other" ? 0 : (before?.[t.id] ?? 0);
            const added = since.filter((i) => i.activity === t.id);
            const nextHere = nextStep?.activity === t.id;
            const total = had + added.length;
            return (
              <section
                key={t.id}
                className={["map__territory", had + added.length + (nextHere ? 1 : 0) === 0 ? "is-empty" : "", t.id === "other" ? "map__territory--wide" : ""]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={t.label}
              >
                <div className="map__head">
                  <h3 className="map__label">{t.label}</h3>
                  <span className="map__count">
                    {had} → {total}
                  </span>
                </div>
                <ul className="map__dots">
                  {had ? (
                    <li className="map__before">
                      <span className="u-visually-hidden">{G.before(had)}</span>
                      {Array.from({ length: had }, (_, i) => (
                        <span key={i} className="map__dot map__dot--before" aria-hidden="true" />
                      ))}
                    </li>
                  ) : null}
                  {added.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={["map__dot", "map__dot--since", open === item.id ? "is-open" : ""].filter(Boolean).join(" ")}
                        aria-pressed={open === item.id}
                        aria-label={`${item.text}, ${shortDate(item.on)}`}
                        onClick={() => setOpen(open === item.id ? null : item.id)}
                      />
                    </li>
                  ))}
                  {nextHere && nextStep ? (
                    <li>
                      <span className={["map__dot", "map__dot--next", nextStep.started ? "is-started" : ""].filter(Boolean).join(" ")}>
                        <span className="u-visually-hidden">{`${C.growth.nextLabel}: ${nextStep.title}`}</span>
                      </span>
                    </li>
                  ) : null}
                </ul>
              </section>
            );
          })}
        </div>
        <ul className="map__key">
          <li>
            <span className="map__dot map__dot--before map__dot--key" aria-hidden="true" />
            {G.keyBefore}
          </li>
          <li>
            <span className="map__dot map__dot--since map__dot--key" aria-hidden="true" />
            {G.keySince}
          </li>
          {nextStep ? (
            <li>
              <span className="map__dot map__dot--next map__dot--key" aria-hidden="true" />
              {G.keyNext}
            </li>
          ) : null}
        </ul>
        {opened ? (
          <ul className="signal-picture__list">
            <Row item={opened} onEdit={onEdit} onDelete={onDelete} showImpact demoDelete={demoDelete && opened.editable} />
          </ul>
        ) : (
          <p className="signal-picture__counts">{since.length ? G.tap : G.empty}</p>
        )}
        {nextStep ? <NextCaption nextStep={nextStep} demoWhy={demoWhy} /> : null}
        <Button variant="secondary" className="presence-clean__add" onClick={onAdd}>
          <Icon name="plus" size={14} />
          {G.add}
        </Button>
      </section>
      {tryThis ? (
        <section className="presence-clean__try" aria-label={tryLabel ?? "Try this"}>
          <span className="presence-clean__try-label">{tryLabel ?? "Try this"}</span>
          <b>{tryThis.title}</b>
          <p>{tryThis.why}</p>
          <Link href={tryThis.href} className="btn btn--primary btn--md">
            {tryThis.label}
            <Icon name="chevron" size={16} />
          </Link>
        </section>
      ) : null}
    </div>
  );
}

/** The next step as a short caption: what it is, what it adds, Start, and Why one tap away. */
function NextCaption({ nextStep, demoWhy }: { nextStep: PathNextStep; demoWhy?: boolean }) {
  const G = C.growth;
  const [why, setWhy] = useState(false);
  return (
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

/** A row for each thing she did and what she says came of it: what she did in a dark block that points at her words. A thing with no reply shows a quiet dashed block, never a miss. */
function CameOf({
  items,
  today,
  startedOn,
  onEdit,
  onDelete,
  demoDelete,
  headingId,
  className,
}: {
  items: PictureItem[];
  today: LoopDate;
  startedOn: LoopDate;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
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
              <CameOfRowView key={row.id} row={row} onEdit={onEdit} onDelete={onDelete} demoDelete={demoDelete} />
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
  demoDelete,
}: {
  row: CameOfRow;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
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
        <div className="came-of__reply">
          {row.came ? (
            <>
              <span className="u-visually-hidden">{G.cameOfIt}</span>
              {row.came}
            </>
          ) : (
            G.noReply
          )}
        </div>
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
