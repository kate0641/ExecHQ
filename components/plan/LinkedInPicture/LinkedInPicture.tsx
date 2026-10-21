"use client";

import { useId, useState, type ChangeEvent, type PointerEvent } from "react";
import { compact, monthlyImpressions, topPosts, totals, type MonthBar } from "@/lib/linkedin-export";
import { Icon } from "@/components/primitives/Icon";
import { monthDayYear } from "./linkedin-dates";
import { LINKEDIN_PICTURE_COPY as C, type LinkedInExport } from "@/mock/linkedin-export";

type RowId = "followers" | "impressions" | "posts";

export interface LinkedInPictureProps {
  data: LinkedInExport;
  /** Which row is open to begin with: followers unless told, or none. */
  initialOpen?: RowId | null;
  /** Catalogue only: shows the readout a static page cannot reach. */
  demoWeek?: number;
  demoMonth?: number;
  headingId?: string;
  className?: string;
}

/* The line is drawn in a 360 by 150 box and placed by percent, so it scales with the card. */
const W = 360;
const H = 150;
// No side margin: the plot runs edge to edge, as wide as the rows' hairlines (designer, 2026-10-20; 14 each
// side before). The end dot hangs past the edge, so the chart doesn't clip it.
const PAD = { left: 0, right: 0, top: 22, bottom: 22 };

/** Where a readout sits against its mark, so it stays inside the card at either edge. */
const align = (at: number) => (at < 0.25 ? "start" : at > 0.75 ? "end" : "mid");
const niceDown = (n: number, step: number) => Math.floor(n / step) * step;
const niceUp = (n: number, step: number) => Math.ceil(n / step) * step;

/**
 * What her LinkedIn analytics export says, drawn plainly and kept quiet: three
 * rows, each a figure with its shape in miniature (followers, impressions,
 * posts). The file it came from is named in the card above it, so it is not named again here. Tap one and its full chart opens beneath it; one is open at a time,
 * and followers is open to begin with. Counts as LinkedIn reports them: no
 * score, no rank, and nothing says her work caused any of it. Every mark has
 * the same readout on hover, touch and keyboard.
 *
 * One hue throughout: there is one story in each chart, so colour has no
 * identity to carry.
 */
export function LinkedInPicture({ data, initialOpen = "followers", demoWeek, demoMonth, headingId, className }: LinkedInPictureProps) {
  const autoId = useId();
  const id = headingId ?? `li-${autoId}`;
  const [open, setOpen] = useState<RowId | null>(initialOpen);
  const t = totals(data);
  const months = monthlyImpressions(data.posts, data.from, data.to);
  const hasFollowers = data.followers.length >= 2;
  const hasPosts = data.posts.length > 0;
  const gain = t.followersNow - t.followersThen;

  const rows: { id: RowId; label: string; sub: string; value: string; body: React.ReactNode }[] = [];
  if (hasFollowers) {
    rows.push({
      id: "followers",
      label: C.followers,
      sub: C.followersSub(gain, monthDayYear(data.from)),
      value: t.followersNow.toLocaleString("en-US"),
      body: (
        // No caption over it: Kate asked for "At the end of each week" to go (2026-10-21).
        <FollowersLine data={data} demoWeek={demoWeek} />
      ),
    });
  }
  if (hasPosts) {
    rows.push(
      {
        id: "impressions",
        label: C.impressions,
        sub: C.impressionsSub,
        value: compact(t.impressions),
        body: (
          <>
            <p className="li-caption">{C.impressionsCaption}</p>
            <MonthColumns months={months} demoMonth={demoMonth} />
          </>
        ),
      },
      {
        id: "posts",
        label: C.posts,
        sub: C.postsSub,
        value: String(t.posts),
        body: (
          <>
            <p className="li-caption">{C.postsCaption}</p>
            <TopPosts data={data} />
          </>
        ),
      }
    );
  }

  return (
    <section className={["li-picture", className].filter(Boolean).join(" ")} aria-labelledby={id}>
      <div className="li-picture__head">
        <h2 className="li-picture__heading" id={id}>
          {C.heading}
        </h2>
        <p className="li-picture__intro">{C.intro(monthDayYear(data.from), monthDayYear(data.to))}</p>
      </div>

      {rows.length === 0 ? (
        <p className="li-picture__empty">{C.empty}</p>
      ) : (
        <div className="li-rows">
          {rows.map((row) => {
            const isOpen = open === row.id;
            return (
              <div key={row.id} className={["li-row", isOpen ? "is-open" : ""].filter(Boolean).join(" ")}>
                <button type="button" className="li-row__head" aria-expanded={isOpen} aria-controls={`${id}-${row.id}`} onClick={() => setOpen(isOpen ? null : row.id)}>
                  <span className="li-row__label">
                    <b>{row.label}</b>
                    <span>{row.sub}</span>
                  </span>
                  <span className="li-row__value">{row.value}</span>
                  {/* Plus to open, minus to close (designer, 2026-10-21; a chevron before). */}
                  <span className="li-row__toggle" aria-hidden="true">
                    <Icon name={isOpen ? "minus" : "plus"} size={20} />
                  </span>
                </button>
                <div className="li-row__body" id={`${id}-${row.id}`} hidden={!isOpen}>
                  {isOpen ? row.body : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* No shapes in miniature on the rows: each row's chart is in its open view, as Followers' is (designer,
   2026-10-21). */

function FollowersLine({ data, demoWeek }: { data: LinkedInExport; demoWeek?: number }) {
  const glow = `li-glow-${useId().replace(/:/g, "")}`;
  const points = data.followers;
  const n = points.length;
  const [active, setActive] = useState<number | null>(null);
  const shown = demoWeek ?? active;

  const counts = points.map((p) => p.count);
  const lo = niceDown(Math.min(...counts), 50);
  const hi = niceUp(Math.max(...counts), 50);
  const x = (i: number) => PAD.left + (i / (n - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - (v - lo) / Math.max(hi - lo, 1)) * (H - PAD.top - PAD.bottom);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(p.count).toFixed(1)}`).join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)} ${y(lo)} L${x(0).toFixed(1)} ${y(lo)} Z`;
  const first = points[0];
  const last = points[n - 1];

  const at = (clientX: number, rect: DOMRect) => {
    const unit = ((clientX - rect.left) / rect.width) * W;
    return Math.max(0, Math.min(n - 1, Math.round(((unit - PAD.left) / (W - PAD.left - PAD.right)) * (n - 1))));
  };
  const onMove = (event: PointerEvent<HTMLDivElement>) => setActive(at(event.clientX, event.currentTarget.getBoundingClientRect()));
  const onScrub = (event: ChangeEvent<HTMLInputElement>) => setActive(Number(event.target.value));
  const spoken = points[shown ?? n - 1];

  return (
    <div className="li-line" onPointerMove={onMove} onPointerDown={onMove} onPointerLeave={() => setActive(null)}>
      {/* The keyboard and touch way through the weeks: a real range control laid over the plot, unseen. */}
      <input
        type="range"
        className="li-line__scrub"
        min={0}
        max={n - 1}
        step={1}
        value={shown ?? n - 1}
        aria-label={C.followersSlider}
        aria-valuetext={C.followersAt(spoken.count, monthDayYear(spoken.on))}
        style={{ left: `${(PAD.left / W) * 100}%`, width: `${((W - PAD.left - PAD.right) / W) * 100}%` }}
        onChange={onScrub}
        onFocus={() => setActive((a) => a ?? n - 1)}
        onBlur={() => setActive(null)}
      />
      <svg className="li-line__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" style={{ "--li-area-gradient": `url(#${glow})` } as React.CSSProperties}>
        {/* Where it is shown with color (the Signal Picture), the area glows from light green into sky blue. */}
        <defs>
          <linearGradient id={glow} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="li-gradient__glow-top" />
            <stop offset="1" className="li-gradient__glow-bottom" />
          </linearGradient>
        </defs>
        <line className="li-grid" x1={PAD.left} x2={W - PAD.right} y1={y(lo)} y2={y(lo)} />
        <line className="li-grid" x1={PAD.left} x2={W - PAD.right} y1={y((lo + hi) / 2)} y2={y((lo + hi) / 2)} />
        <text className="li-axis" x={PAD.left} y={H - 6} textAnchor="start">
          {monthDayYear(first.on)}
        </text>
        <text className="li-axis" x={W - PAD.right} y={H - 6} textAnchor="end">
          {monthDayYear(last.on)}
        </text>
        <path className="li-line__area" d={area} />
        <path className="li-line__path" d={line} />
        {shown === null ? (
          <>
            <circle className="li-dot-ring" cx={x(n - 1)} cy={y(last.count)} r={6} />
            <circle className="li-dot" cx={x(n - 1)} cy={y(last.count)} r={4} />
            <text className="li-value" x={x(n - 1)} y={y(last.count) - 11} textAnchor="end">
              {last.count.toLocaleString("en-US")}
            </text>
            <text className="li-value" x={x(0)} y={y(first.count) - 11} textAnchor="start">
              {first.count.toLocaleString("en-US")}
            </text>
          </>
        ) : (
          <>
            <line className="li-cross" x1={x(shown)} x2={x(shown)} y1={PAD.top} y2={H - PAD.bottom} />
            <circle className="li-dot-ring" cx={x(shown)} cy={y(points[shown].count)} r={6} />
            <circle className="li-dot" cx={x(shown)} cy={y(points[shown].count)} r={4} />
          </>
        )}
      </svg>
      {shown !== null ? (
        <div className={`li-tip li-tip--${align(x(shown) / W)}`} style={{ left: `${(x(shown) / W) * 100}%` }} aria-hidden="true">
          <strong>{points[shown].count.toLocaleString("en-US")}</strong>
          <span>{monthDayYear(points[shown].on)}</span>
        </div>
      ) : null}
    </div>
  );
}

function MonthColumns({ months, demoMonth }: { months: MonthBar[]; demoMonth?: number }) {
  const [active, setActive] = useState<number | null>(null);
  const shown = demoMonth ?? active;
  const max = Math.max(...months.map((m) => m.impressions), 1);
  const peak = months.findIndex((m) => m.impressions === max);
  return (
    <fieldset className="li-columns" style={{ "--li-months": months.length } as React.CSSProperties}>
      <legend className="u-visually-hidden">{C.impressions}</legend>
      {months.map((m, i) => (
        <button
          key={m.key}
          type="button"
          className={["li-col", shown === i ? "is-active" : ""].filter(Boolean).join(" ")}
          aria-label={C.monthsAt(`${m.label} ${m.year}`, m.impressions, m.posts)}
          onPointerEnter={() => setActive(i)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(i)}
          onBlur={() => setActive(null)}
        >
          <span className="li-col__plot" aria-hidden="true">
            {m.impressions > 0 ? (
              <>
                {i === peak ? <span className="li-col__value">{compact(m.impressions)}</span> : null}
                <span className="li-col__bar" style={{ height: `${Math.max((m.impressions / max) * 100, 3)}%` }} />
              </>
            ) : null}
          </span>
          <span className="li-col__label" aria-hidden="true">
            {m.label.slice(0, 1)}
          </span>
        </button>
      ))}
      {shown !== null ? (
        <div className={`li-tip li-tip--${align((shown + 0.5) / months.length)}`} style={{ left: `${((shown + 0.5) / months.length) * 100}%` }} aria-hidden="true">
          <strong>{months[shown].impressions.toLocaleString("en-US")}</strong>
          <span>
            {months[shown].label} {months[shown].year} · {months[shown].posts === 1 ? "1 post" : `${months[shown].posts} posts`}
          </span>
        </div>
      ) : null}
    </fieldset>
  );
}

function TopPosts({ data }: { data: LinkedInExport }) {
  return (
    <ol className="li-top__list">
      {topPosts(data.posts, 3).map((post) => (
        <li key={post.id} className="li-top__item">
          <div className="li-top__text">
            <b>{post.title}</b>
            <span>
              {monthDayYear(post.on)} · {C.reactionsComments(post.reactions, post.comments)}
            </span>
          </div>
          <span className="li-top__value">{post.impressions.toLocaleString("en-US")}</span>
        </li>
      ))}
    </ol>
  );
}

export default LinkedInPicture;
