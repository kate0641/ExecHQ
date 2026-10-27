"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { conceptHref } from "@/lib/manifest";
import { PROFILE_LINK_COPY as C, SPONSOR_PERSON } from "@/mock/enterprise";

/** The sponsor profile (Kate, 2026-10-22). */
const PROFILE = conceptHref("sponsor-profile", "concept-1");

export interface ProfileLinkProps {
  person?: { name: string; initials: string };
  /** Catalogue only: shows a state a static page can't reach. */
  demo?: "hover" | "focus" | "active" | "current";
  className?: string;
}

/**
 * The sponsor's initials at the right of the enterprise header, opening
 * their profile (Kate, 2026-10-22: "instead of a dropdown just open the
 * profile"). It replaces the account menu: with Your profile and Sign out
 * its only choices, and Sign out at the foot of the profile, a menu was one
 * step too many. On the profile itself it says so.
 */
export function ProfileLink({ person = SPONSOR_PERSON, demo, className }: ProfileLinkProps) {
  const pathname = usePathname();
  const current = demo === "current" || pathname === PROFILE;
  const state = demo && demo !== "current" ? `is-${demo}` : null;
  return (
    <Link
      href={PROFILE}
      className={["profile-link", state, className].filter(Boolean).join(" ")}
      aria-current={current ? "page" : undefined}
      title={C.title}
    >
      <span aria-hidden="true">{person.initials}</span>
      <span className="u-visually-hidden">{C.label(person.name)}</span>
    </Link>
  );
}

export default ProfileLink;
