import { Logo, type LogoTone } from "@/components/primitives/Logo";

export type WordmarkSize = "md" | "xl";

export interface WordmarkProps {
  /** `md` for chrome headers, `xl` where the wordmark is the first thing on a
   *  screen. */
  size?: WordmarkSize;
  /** `dark` on stone and light blue, `light` on any dark surface. */
  tone?: LogoTone;
  /** A product line after the name, e.g. "Enterprise". Set lighter. */
  suffix?: string;
  /** `span` where the wordmark sits inside a heading. */
  as?: "p" | "span";
  className?: string;
}

/**
 * The ExecHQ mark wherever the product shows it: the logo, with an optional
 * product line after it.
 *
 * Every place the brand appears as a mark goes through here. The tone follows
 * the logo's rule: dark on stone and light blue, light on any dark surface.
 *
 * A paragraph rather than a heading: the wordmark names the product, not the
 * page, and a screen's h1 is what it is asking.
 */
export function Wordmark({ size = "md", tone = "dark", suffix, className, as: Tag = "p" }: WordmarkProps) {
  return (
    <Tag className={["wordmark", `wordmark--${size}`, className].filter(Boolean).join(" ")}>
      <Logo tone={tone} size={size} />
      {suffix ? <span className="wordmark__suffix"> {suffix}</span> : null}
    </Tag>
  );
}

export default Wordmark;
