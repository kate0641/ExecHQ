export interface BriefingPictureProps {
  /** Which of the day's three: sets the tint. */
  place: 1 | 2 | 3;
  publisher: string;
  /**
   * - `lead`: the front page's big picture.
   * - `thumb`: a row's small square.
   * - `reader`: the top of an open read.
   */
  size: "lead" | "thumb" | "reader";
  className?: string;
}

/**
 * Where an article's picture goes in Briefing Concept 2, the news-app front
 * page: a tinted panel naming the publisher. A stand-in: showing a
 * publisher's own photos needs their permission, which is a question for the
 * client. Decorative, so it is hidden from screen readers; the publisher is
 * named in the text beside it.
 */
export function BriefingPicture({ place, publisher, size, className }: BriefingPictureProps) {
  return (
    <span
      className={["briefing-picture", `briefing-picture--${size}`, `briefing-picture--${place}`, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <span className="briefing-picture__name">{publisher}</span>
    </span>
  );
}

export default BriefingPicture;
