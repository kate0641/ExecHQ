# Home on web: Stay on track's cards

9 November 2026 · Kate Hester

One change to Homepage Concept 4b, **on web only**: Stay on track's cards keep a fixed width and sit side by side, instead of each one stretching to most of the page. The phone and tablet are unchanged, and nothing else on Home changes.

**Before.** Each card took 88% of the row's width on every screen, so the next card peeks in from the edge. On the phone that tells them there is more to swipe to. On web it made each card about 1,000px wide.

**Now, on web.** Each card is exactly as wide as the column the Signal Picture card sits in, so the cards line up with it:

`card width = (row width − 48px) × 3 / 10`, where 48px is the gap between the page's two columns.

The page is at most 1,216px wide, so a card is at most about 350px. The cards sit side by side, 12px apart, starting at the left.

- **Up to three fit.** With more than fit, the row scrolls sideways as before, and the dots under it come back.
- **When every card is in view, the dots are left out.** There is nothing to step through. Measure on every resize and whenever a card's width changes, not only on load.
- **Inside a card,** the content is laid out as it is on the phone at that width. For example, the three answers to "How did it go?" stack.
- **One card** keeps the same width. It does not stretch.

**On the phone and tablet:** unchanged. Each card is 88% of the row, the next one peeks in, and the dots are always there with more than one card.

| Piece | Where it is in the prototype |
| --- | --- |
| Fixed widths on web | `flows/homepage/concept-4b/InProgress.tsx` (the carousel's `fixed` is on for web) |
| The width on Home | `styles/app.css`, `--card-carousel-width` on `.map-home__stay` |
| Dots left out when every card is in view | `components/layout/CardCarousel` (applies wherever the carousel is used) |

## For anyone building the carousel elsewhere

The carousel's fixed width is now set by the page (`--card-carousel-width`), and falls back to 21rem (336px) where a page sets none. A fixed-width carousel takes the full width of its container. Without that it collapses to nothing in a container that shrinks to fit its content. The component catalogue shows the new state as "All in view — fixed widths, no controls".
