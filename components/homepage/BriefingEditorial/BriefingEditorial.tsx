"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/primitives/Icon";

export interface BriefingEditorialRead {
  title: string;
  /** The publication it comes from: "The Calder Quarterly". */
  publisher: string;
}

export interface BriefingEditorialProps {
  href: string;
  /** "Today's Briefing". */
  heading?: string;
  /** "Tue 20 Oct · 3 reads". */
  meta: string;
  /** Today's reads, in the Briefing's order. The first leads. */
  reads: BriefingEditorialRead[];
  /** A photograph across the top that fades into the navy, with the words
   *  in white on the navy below it (designer, 2026-10-09). */
  cover?: boolean;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/** How long she has to stop scrolling, with the card in view, before the
 *  shimmer starts. */
const PAUSE_MS = 500;

/**
 * Today's Briefing as a page of reading: the lead read's headline in the
 * serif, the product's one editorial face, under a thin top rule, with its
 * publication under it; the other reads follow as small bullets with theirs,
 * so she knows what today holds. Long headlines end in an ellipsis (the lead
 * after two lines, the others after one), so the card keeps its height; the
 * full words stay in the link's name. It reads as something to read, not
 * something to do, so it stays visibly apart from plan recommendations. The
 * whole card is one link. On web the lead takes the left and the others the
 * right. With `cover`, a photograph runs across the top and fades into the
 * navy.
 */
export function BriefingEditorial({
  href,
  heading = "Today’s Briefing",
  meta,
  reads,
  cover,
  demo,
  className,
}: BriefingEditorialProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [lead, ...others] = reads;

  /* The shimmer waits for her: it plays once, the first time the card is
     mostly on screen and she has stopped scrolling for a moment (designer,
     2026-10-11), so it is seen rather than spent below the fold. */
  useEffect(() => {
    const card = ref.current;
    if (!cover || !card) return;
    let visible = false;
    let timer: number | undefined;
    const wait = () => {
      window.clearTimeout(timer);
      if (visible) timer = window.setTimeout(play, PAUSE_MS);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        wait();
      },
      { threshold: 0.75 },
    );
    function play() {
      card!.dataset.play = "";
      stop();
    }
    function stop() {
      window.clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("scroll", wait, true);
    }
    observer.observe(card);
    document.addEventListener("scroll", wait, { capture: true, passive: true });
    return stop;
  }, [cover]);

  return (
    <Link
      ref={ref}
      href={href}
      className={["briefing-editorial", cover ? "briefing-editorial--cover" : null, demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}
    >
      {cover ? (
        <span className="briefing-editorial__light" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      ) : null}
      <span className="briefing-editorial__top">
        <span className="briefing-editorial__heading">{heading}</span>
        <span className="briefing-editorial__meta">
          {meta}
          <Icon name="chevron" size={16} className="briefing-editorial__go" />
        </span>
      </span>
      <span className="briefing-editorial__body">
        {lead ? (
          <span className="briefing-editorial__first">
            <span className="briefing-editorial__lead">{lead.title}</span>
            <span className="briefing-editorial__source">{lead.publisher}</span>
          </span>
        ) : null}
        {others.length > 0 ? (
          <span className="briefing-editorial__others">
            {others.map((read) => (
              <span key={read.title} className="briefing-editorial__other">
                <span className="briefing-editorial__title">{read.title}</span>
                <span className="briefing-editorial__source">{read.publisher}</span>
              </span>
            ))}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export default BriefingEditorial;
