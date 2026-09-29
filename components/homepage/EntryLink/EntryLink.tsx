import Link from "next/link";
import { Icon, type IconName } from "@/components/primitives/Icon";

export interface EntryLinkProps {
  href: string;
  icon: IconName;
  /** What this is, in small capitals: "Your plan", "Today's Briefing · 3 reads". */
  eyebrow: string;
  /** The one thing it leads to: the plan's name, a headline, a draft. */
  title: string;
  /** Why it matters here, in a line. Optional. */
  detail?: string;
  /** Called when the link is followed, e.g. to close a sheet over it. */
  onClick?: () => void;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * A way from the homepage to another destination that says what's there:
 * what it is, the one thing it leads to, and why it matters. The whole row
 * is the link, marked with a chevron.
 */
export function EntryLink({ href, icon, eyebrow, title, detail, demo, onClick, className }: EntryLinkProps) {
  return (
    <Link href={href} onClick={onClick} className={["entry-link", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")}>
      <span className="entry-link__icon" aria-hidden="true">
        <Icon name={icon} size={20} />
      </span>
      <span className="entry-link__text">
        <span className="entry-link__eyebrow">{eyebrow}</span>
        <b className="entry-link__title">{title}</b>
        {detail ? <span className="entry-link__detail">{detail}</span> : null}
      </span>
      <Icon name="chevron" size={16} className="entry-link__go" />
    </Link>
  );
}

export default EntryLink;
