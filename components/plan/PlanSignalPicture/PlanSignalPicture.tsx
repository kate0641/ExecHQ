"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cameOfRows, growthMonths, type CameOfRow, type Offer, type PictureItem } from "@/lib/signal-picture";
import { shortDate, type LoopDate } from "@/lib/loop";
import { SIGNAL_PICTURE_COPY as C } from "@/mock/plan";

/** How the picture draws her record. Each Signals concept has its own, and none ranks or scores her.
 *  - path: a line through time with a circle for each month, her next step ahead.
 *  - cameof: a row for each thing, what she did pointing at what she says came
 *    of it, in her words. No next action and no add button: the page has those. */
export type SignalPictureVariant = "path" | "cameof";

export interface PathNextStep {
  title: string;
  /** Why this step now, in the plan's own words. */
  why: string;
  /** The kind of activity it would add one to, in words. Only steps that add a circle are shown. */
  adds: string;
  href: string;
  /** She has pressed Start or there is work on it: the circle is half full. */
  started: boolean;
  onStart: () => void;
}

export interface PlanSignalPictureProps {
  items: PictureItem[];
  today: LoopDate;
  onEdit: (item: PictureItem) => void;
  onDelete: (item: PictureItem) => void;
  /** A moment to offer the entry flow: a piece she has just published. */
  offer?: Offer;
  onAcceptOffer?: () => void;
  onDismissOffer?: () => void;
  variant: SignalPictureVariant;
  /** The path variant: the day her plan began, and her next step. */
  startedOn?: LoopDate;
  nextStep?: PathNextStep;
  /** Catalogue only: a row opens asking whether to delete. */
  demoDelete?: boolean;
  /** Catalogue only: the next step's reason is open. */
  demoWhy?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * Her private, factual record of what moved, drawn the way each Signals
 * concept draws it. Where an item came from is said in words, and a thing she
 * did is never folded into a count without its label. What came of a thing is
 * only ever her own words, never worked out for her.
 *
 * Nothing here is a number she could mistake for a score: no percentage,
 * grade, gauge or rank, and nothing compared with anyone.
 */
export function PlanSignalPicture({
  items,
  today,
  onEdit,
  onDelete,
  offer,
  onAcceptOffer,
  onDismissOffer,
  variant,
  startedOn,
  nextStep,
  demoDelete,
  demoWhy,
  headingId = "plan-signal-picture",
  className,
}: PlanSignalPictureProps) {
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

function Row({
  item,
  onEdit,
  onDelete,
  showImpact,
  demoDelete,
}: {
  item: PictureItem;
  onEdit: PlanSignalPictureProps["onEdit"];
  onDelete: PlanSignalPictureProps["onDelete"];
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
