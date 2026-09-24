export type WordmarkSize = "md" | "xl";

export interface WordmarkProps {
  /** `md` for chrome headers, `xl` where the wordmark is the first thing on a
   *  screen. */
  size?: WordmarkSize;
  /** A product line after the name, e.g. "Enterprise". Set lighter. */
  suffix?: string;
  /** `span` where the wordmark sits inside a heading. */
  as?: "p" | "span";
  className?: string;
}

/**
 * The ExecHQ wordmark, set in type until a real logo exists.
 *
 * Every place the brand name appears as a mark goes through here, so when the
 * logo lands it is swapped once. Colour is inherited, so the same mark works on
 * the default and the inverse surface.
 *
 * A paragraph rather than a heading: the wordmark names the product, not the
 * page, and a screen's h1 is what it is asking.
 */
export function Wordmark({ size = "md", suffix, className, as: Tag = "p" }: WordmarkProps) {
  return (
    <Tag className={["wordmark", `wordmark--${size}`, className].filter(Boolean).join(" ")}>
      ExecHQ
      {suffix ? <span className="wordmark__suffix"> {suffix}</span> : null}
    </Tag>
  );
}

export default Wordmark;
