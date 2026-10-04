"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface CarouselItem {
  /** Stable, so a card keeps its place and state while others change. */
  id: string;
  node: ReactNode;
  /** Cards in the same group sit together: a mark in the dots shows where one group ends. */
  group?: string;
}

export interface CardCarouselProps {
  /** What the carousel is, for assistive technology: "Waiting on you". */
  label: string;
  items: readonly CarouselItem[];
  previousLabel?: string;
  nextLabel?: string;
  /** Read out and shown between the buttons: "2 of 3". */
  position?: (current: number, total: number) => string;
  /** Where to take the track, by card id. A new `n` takes it there again, even to the same card. */
  goTo?: { id: string; n: number };
  /** Told which card the track has settled on. */
  onCurrent?: (id: string, index: number) => void;
  /** A fixed card width where there is room, in place of most of the row. */
  fixed?: boolean;
  className?: string;
}

/**
 * A row of cards she swipes or steps through, one after another, with the
 * next card peeking in so it is clear there is more. Built on native
 * scrolling and scroll snapping, so touch, trackpad and the keyboard all
 * work without any script. Previous and Next are there for anyone who
 * cannot swipe, and they are the keyboard route along the track.
 *
 * With one card there is nothing to step through, so the controls are left
 * out and the card takes the full width.
 */
export function CardCarousel({
  label,
  items,
  previousLabel = "Previous",
  nextLabel = "Next",
  position = (current, total) => `${current} of ${total}`,
  goTo,
  onCurrent,
  fixed = false,
  className,
}: CardCarouselProps) {
  const track = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const total = items.length;
  const firstId = items[0]?.id;

  // A new card in front, such as the one she has just answered, is where the
  // track goes back to, so she sees what changed.
  useEffect(() => {
    track.current?.scrollTo({ left: 0 });
  }, [firstId]);

  // Taken to a card by someone else, such as a horizon she picked.
  const wanted = goTo?.n;
  useEffect(() => {
    if (!goTo) return;
    const el = track.current;
    const index = items.findIndex((item) => item.id === goTo.id);
    const slide = el?.children[index] as HTMLElement | undefined;
    if (el && slide) el.scrollTo({ left: slide.offsetLeft - el.offsetLeft });
    // Only a new request moves the track.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted]);

  if (total === 0) return null;

  /** The card whose left edge is nearest the track's. */
  function settle() {
    const el = track.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const nearest = slides.reduce(
      (best, slide, i) => (Math.abs(slide.offsetLeft - el.offsetLeft - el.scrollLeft) < Math.abs(slides[best].offsetLeft - el.offsetLeft - el.scrollLeft) ? i : best),
      0
    );
    setCurrent(nearest);
    if (nearest !== current) onCurrent?.(items[nearest]?.id ?? "", nearest);
  }

  function go(to: number) {
    const el = track.current;
    const slide = el?.children[to] as HTMLElement | undefined;
    if (!el || !slide) return;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft });
  }

  return (
    <section className={["card-carousel", fixed ? "card-carousel--fixed" : null, className].filter(Boolean).join(" ")} aria-roledescription="carousel" aria-label={label}>
      <ul className="card-carousel__track" ref={track} onScroll={settle}>
        {items.map((item, i) => (
          <li key={item.id} className="card-carousel__slide" aria-roledescription="slide" aria-label={position(i + 1, total)}>
            {item.node}
          </li>
        ))}
      </ul>
      {total > 1 ? (
        <div className="card-carousel__controls">
          <Button variant="secondary" size="sm" aria-label={previousLabel} disabled={current === 0} onClick={() => go(current - 1)}>
            <Icon name="chevron" size={16} className="card-carousel__back" />
          </Button>
          <span className="card-carousel__position" aria-live="polite">
            <span className="card-carousel__dots" aria-hidden="true">
              {items.map((item, i) => (
                <Fragment key={item.id}>
                  {i > 0 && item.group !== undefined && items[i - 1].group !== item.group ? <b /> : null}
                  <i className={i === current ? "is-now" : undefined} />
                </Fragment>
              ))}
            </span>
            {position(current + 1, total)}
          </span>
          <Button variant="secondary" size="sm" aria-label={nextLabel} disabled={current === total - 1} onClick={() => go(current + 1)}>
            <Icon name="chevron" size={16} />
          </Button>
        </div>
      ) : null}
    </section>
  );
}

export default CardCarousel;
