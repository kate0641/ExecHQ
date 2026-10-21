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

/** Where a post opens when the export gives no link (the stub). */
const FEED = "https://www.linkedin.com/feed/";

/**
 * How far her posts reach and who they reach, from her LinkedIn export, as the onboarding spec puts it
 * (designer with Kate, 2026-10-21; three rows of charts before). Only what the export holds: four totals,
 * her posts that went furthest by date and reach with a link to each (the export gives no titles), and who
 * she is reaching, one kind of demographic at a time. Counts only: no score, no comparison, and nothing
 * says her work caused any of it.
 */
export function LinkedInPicture({ data, initialKind = "location", headingId, className }: LinkedInPictureProps) {
  const autoId = useId();
  const id = headingId ?? `li-${autoId.replace(/:/g, "")}`;
  const [kind, setKind] = useState<Kind>(initialKind);
  const t = totals(data);
  const gain = t.followersNow - t.followersThen;
  const hasFollowers = data.followers.length >= 2;
  const best = topPosts(data.posts, 3);
  const shares = data.audience?.[kind] ?? [];
  const nothing = !hasFollowers && data.posts.length === 0;

  const figures = [
    data.posts.length ? { key: "seen", value: compact(t.impressions), label: C.seen } : null,
    data.membersReached ? { key: "reached", value: compact(data.membersReached), label: C.reached } : null,
    hasFollowers
      ? {
          key: "followers",
          value: t.followersNow.toLocaleString("en-US"),
          label: (
            <>
              {C.followers}
              {gain !== 0 ? (
                <>
                  {" · "}
                  <span className={["li-figure__gain", gain < 0 ? "is-down" : ""].filter(Boolean).join(" ")}>
                    <Icon name={gain > 0 ? "arrow-up" : "arrow-down"} size={16} />
                    {Math.abs(gain).toLocaleString("en-US")}
                  </span>
                  <span className="u-visually-hidden">{C.followersGainHeard(gain)}</span>
                </>
              ) : null}
            </>
          ),
        }
      : null,
    data.posts.length ? { key: "posts", value: String(t.posts), label: C.posts(t.posts) } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  return (
    <section className={["li-picture", className].filter(Boolean).join(" ")} aria-labelledby={id}>
      <div className="li-picture__head">
        <h2 className="li-picture__heading" id={id}>
          {C.heading}
        </h2>
        <p className="li-picture__intro">{C.intro(monthDayYear(data.from), monthDayYear(data.to))}</p>
      </div>

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
                    <span className="li-post__when">
                      {monthDayYear(p.on)}
                      <span className="li-post__seen">{C.seenTimes(p.impressions)}</span>
                    </span>
                    <a className="link li-post__open" href={p.url ?? FEED} target="_blank" rel="noreferrer">
                      {C.open}
                      <span className="u-visually-hidden"> {C.opensNewTab}</span>
                    </a>
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
    </section>
  );
}

export default LinkedInPicture;
