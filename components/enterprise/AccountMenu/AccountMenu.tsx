"use client";

import { DropdownMenu } from "@/components/form/DropdownMenu";
import { ACCOUNT_COPY as C, SPONSOR_PERSON } from "@/mock/enterprise";

const noop = () => {};

export interface AccountMenuProps {
  person?: { name: string; initials: string; role: string; org: string };
  /** Catalogue only: opens with the panel showing, in the flow. */
  defaultOpen?: boolean;
  inline?: boolean;
  /** Catalogue only: shows the trigger in a state a static page can't reach. */
  demo?: "hover" | "focus" | "active";
  className?: string;
}

/**
 * The sponsor's account menu at the right of the enterprise header: their
 * initials, opening who is signed in, Your profile and Sign out (Kate,
 * 2026-10-21, option A). It lives in the chrome, so every concept has it.
 * The profile and signing out aren't designed yet, so both say so.
 */
export function AccountMenu({ person = SPONSOR_PERSON, defaultOpen, inline, demo, className }: AccountMenuProps) {
  return (
    <DropdownMenu
      className={["account-menu", className].filter(Boolean).join(" ")}
      label={C.label(person.name)}
      avatar={person.initials}
      align="end"
      defaultOpen={defaultOpen}
      inline={inline}
      demo={demo}
      entries={[
        { type: "heading", id: "who", title: person.name, detail: C.detail(person.role, person.org) },
        { type: "item", id: "profile", label: C.profile, icon: "person", hint: C.notYet, disabled: true, onSelect: noop },
        { type: "separator", id: "s1" },
        { type: "item", id: "sign-out", label: C.signOut, icon: "sign-out", hint: C.notYet, disabled: true, onSelect: noop },
      ]}
    />
  );
}

export default AccountMenu;
