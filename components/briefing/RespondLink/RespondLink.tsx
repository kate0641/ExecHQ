import Link from "next/link";
import { Icon } from "@/components/primitives/Icon";
import { BRIEFING_COPY as C } from "@/mock/briefing";

export interface RespondLinkProps {
  /** Thought Leadership Builder, with the read as the source. */
  href: string;
  onClick?: () => void;
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The way from a read into Thought Leadership Builder: "Write a post about
 * this", and what will happen, as one link. Under a read's actions, and at the
 * end of an article read in ExecHQ (Concept 2), where she has just finished
 * it. Never a gate: the read is done whether she writes or not.
 */
export function RespondLink({ href, onClick, demo, className }: RespondLinkProps) {
  return (
    <Link href={href} className={["respond-link", demo ? `is-${demo}` : null, className].filter(Boolean).join(" ")} onClick={onClick}>
      <Icon name="pencil" size={16} />
      <span className="respond-link__text">
        <span className="respond-link__label">{C.respond.action}</span>
        <span className="respond-link__hint">{C.respond.hint}</span>
      </span>
      <Icon name="chevron" size={16} className="respond-link__go" />
    </Link>
  );
}

export default RespondLink;
