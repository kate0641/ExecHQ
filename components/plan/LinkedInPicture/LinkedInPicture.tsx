"use client";

import { useId, useState } from "react";
import { ToggleGroup } from "@/components/form/ToggleGroup";
import { Icon } from "@/components/primitives/Icon";
import { compact, topPosts, totals } from "@/lib/linkedin-export";
import { LINKEDIN_PICTURE_COPY as C, type LinkedInExport } from "@/mock/linkedin-export";
import { monthDayYear } from "./linkedin-dates";

type Kind = keyof typeof C.kinds;

export interface LinkedInPictureProps {
  data: LinkedInExport;
  /** Which demographic shows first: location unless told. */
  initialKind?: Kind;
  headingId?: string;
  className?: string;
}

/** The title with the icon after its last word, the two kept on one line so the icon never sits alone. */
function titleWithIcon(title: string) {
  const at = title.lastIndexOf(" ");
  const head = at < 0 ? "" : title.slice(0, at + 1);
  const last = at < 0 ? title : title.slice(at + 1);
  return (
    <>
      {head}
      <span className="li-post__last">
        {last}
        <Icon name="external-link" size={16} />
      </span>
    </>
  );
}

/** Where a post opens when the export gives no link (the stub). */
const FEED = "https://www.linkedin.com/feed/";

/**
 * How far her posts reach and who they reach, from her LinkedIn export, as the onboarding spec puts it
 * (designer with Kate, 2026-10-21; three rows of charts before). Only what the export holds: four totals,
 * her posts that went furthest by title, date and reach with a link to each, and who
 * she is reaching, one kind of demographic at a time. Counts only: no score, no comparison, and nothing
 * says her work caused any of it.
 */
export function LinkedInPicture({ data, initialKind = "location", headingId, className }: LinkedInPictureProps) {
  const autoId = useId();
  const id = headingId ?? `li-${autoId.replace(/:/g, "")}`;
  const [kind, setKind] = useState<Kind>(initialKind);
  const t = totals(data);
  const hasFollowers = data.followers.length >= 2;
  const best = topPosts(data.posts, 3);
  const shares = data.audience?.[kind] ?? [];
  const nothing = !hasFollowers && data.posts.length === 0;

  const figures = [
    data.posts.length ? { key: "seen", value: compact(t.impressions), label: C.seen } : null,
    data.membersReached ? { key: "reached", value: compact(data.membersReached), label: C.reached } : null,
    // The followers she has now, with no change beside it: this is an overview of her year, not a comparison
    // over time, and only followers could show one (designer, 2026-10-21).
    hasFollowers ? { key: "followers", value: t.followersNow.toLocaleString("en-US"), label: C.followers } : null,
    data.posts.length ? { key: "posts", value: String(t.posts), label: C.posts(t.posts) } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  return (
    <section className={["li-section", className].filter(Boolean).join(" ")} aria-labelledby={id}>
      {/* The heading and its dates sit on the page above the card, as every section's do (designer, 2026-10-21). */}
      <div className="signal-picture__head li-section__head">
        <h2 className="signal-picture__heading" id={id}>
          {C.heading}
        </h2>
        <p className="signal-picture__intro">{C.intro(monthDayYear(data.from), monthDayYear(data.to))}</p>
      </div>
      <div className="li-picture">

      {nothing ? (
        <p className="li-picture__empty">{C.empty}</p>
      ) : (
        <>
          <dl className="li-figures">
            {figures.map((f) => (
              <div key={f.key} className="li-figure">
                <dt className="li-figure__label">{f.label}</dt>
                <dd className="li-figure__value">{f.value}</dd>
              </div>
            ))}
          </dl>

          {best.length ? (
            <section className="li-group" aria-labelledby={`${id}-furthest`}>
              <h3 className="li-group__title" id={`${id}-furthest`}>
                {C.furthest}
              </h3>
              <ul className="li-posts">
                {best.map((p) => (
                  <li key={p.id} className="li-post">
                    {/* The title is the link out, with the external-link icon held to its last word (designer,
                        2026-10-21; a separate icon button before). Under it, when and how far it went. */}
                    <a className="link li-post__title" href={p.url ?? FEED} target="_blank" rel="noreferrer">
                      {titleWithIcon(p.title)}
                      <span className="u-visually-hidden"> {C.opensNewTab}</span>
                    </a>
                    <span className="li-post__meta">
                      {monthDayYear(p.on)} · {C.seenTimes(p.impressions)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {data.audience ? (
            <section className="li-group" aria-labelledby={`${id}-who`}>
              <h3 className="li-group__title" id={`${id}-who`}>
                {C.who}
              </h3>
              <ToggleGroup
                label={C.whoBy}
                labelHidden
                shape="chips"
                size="sm"
                value={kind}
                onChange={(v) => setKind(v as Kind)}
                options={(Object.keys(C.kinds) as Kind[]).map((k) => ({ value: k, label: C.kinds[k] }))}
              />
              <ul className="li-shares">
                {shares.map((s) => (
                  <li key={s.value} className="li-share" aria-label={C.share(s.value, s.percent)}>
                    <span className="li-share__value" aria-hidden="true">
                      {s.value}
                    </span>
                    <span className="li-share__bar" aria-hidden="true">
                      <span style={{ width: `${s.percent}%` }} />
                    </span>
                    <span className="li-share__percent" aria-hidden="true">
                      {s.percent}%
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <p className="li-picture__privacy">{C.privacy}</p>
        </>
      )}
      </div>
    </section>
  );
}

export default LinkedInPicture;
