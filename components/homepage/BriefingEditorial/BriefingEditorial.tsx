"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/primitives/Icon";

export interface BriefingEditorialProps {
  href: string;
  /** "Today's Briefing". */
  heading?: string;
  /** "Tue 20 Oct · 3 reads". */
  meta: string;
  /** The lead read's headline, set in the serif. */
  lead: string;
  /** Why it matters to the user, short enough for a tag: "For your Q1
   *  planning review". Left out when no read touches the plan. */
  tag?: string;
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
 * Today's Briefing as a page of reading (Homepage Concept 3, Editorial): the
 * lead headline in the serif, the product's one editorial face, under a thin
 * top rule, with the date and number of reads above and why it matters as a
 * tag. It reads as something to read, not something to do, so it stays
 * visibly apart from plan recommendations. The whole card is the link.
 */
export function BriefingEditorial({
  href,
  heading = "Today’s Briefing",
  meta,
  lead,
  tag,
  cover,
  demo,
  className,
}: BriefingEditorialProps) {
  const ref = useRef<HTMLAnchorElement>(null);

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
        <span className="briefing-editorial__meta">{meta}</span>
      </span>
      <span className="briefing-editorial__lead">{lead}</span>
      <span className="briefing-editorial__foot">
        {tag ? <span className="briefing-editorial__tag">{tag}</span> : <span />}
        <Icon name="chevron" size={16} className="briefing-editorial__go" />
      </span>
    </Link>
  );
}

export default BriefingEditorial;
