import Link from "next/link";
import type { ReactNode } from "react";

export type TextLinkTone = "default" | "quiet" | "standalone";

export interface TextLinkProps {
  href: string;
  children: ReactNode;
  tone?: TextLinkTone;
  className?: string;
  /** Adds an accessible suffix when the link goes somewhere unexpected. */
  srSuffix?: string;
}

/**
 * In-text and standalone link. Wraps next/link so every navigation in the
 * prototype is a real client-side route change, not a page reload.
 */
export function TextLink({
  href,
  children,
  tone = "default",
  className,
  srSuffix,
}: TextLinkProps) {
  const classes = ["link", `link--${tone}`, className].filter(Boolean).join(" ");
  return (
    <Link href={href} className={classes}>
      {children}
      {srSuffix ? <span className="u-visually-hidden"> {srSuffix}</span> : null}
    </Link>
  );
}

export default TextLink;
