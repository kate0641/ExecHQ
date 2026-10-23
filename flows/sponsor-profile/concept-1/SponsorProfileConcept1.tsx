"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/form/Input";
import { SettingsGroup } from "@/components/profile/SettingsGroup";
import { SettingsRow } from "@/components/profile/SettingsRow";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import { conceptHref } from "@/lib/manifest";
import { SPONSOR_PERSON, SPONSOR_PROFILE_COPY as C, abbrevDate, programDay } from "@/mock/enterprise";
import { PROFILE_COPY } from "@/mock/profile";
import { useCohort } from "../../enterprise/useCohort";

/** The dashboard concept chosen (Kate, 2026-10-22). */
const DASHBOARD = conceptHref("enterprise", "concept-1");
/** Where signing out lands (Kate, 2026-10-23). */
const LOGIN = conceptHref("sponsor-login", "concept-1");

/** Their name and job title, changed in place of the group's rows. */
function YouEdit({
  name,
  role,
  onSave,
  onCancel,
}: {
  name: string;
  role: string;
  onSave: (next: { name: string; role: string }) => void;
  onCancel: () => void;
}) {
  const [draftName, setDraftName] = useState(name);
  const [draftRole, setDraftRole] = useState(role);
  const [errors, setErrors] = useState<{ name?: string; role?: string }>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => headingRef.current?.focus(), []);

  return (
    <form
      className="card sponsor-profile__edit"
      noValidate
      aria-labelledby="sponsor-edit-heading"
      onSubmit={(event) => {
        event.preventDefault();
        const next = {
          name: draftName.trim() ? undefined : C.you.nameMissing,
          role: draftRole.trim() ? undefined : C.you.roleMissing,
        };
        setErrors(next);
        if (next.name || next.role) return;
        onSave({ name: draftName.trim(), role: draftRole.trim() });
      }}
    >
      <h3 className="sponsor-profile__edit-heading" id="sponsor-edit-heading" ref={headingRef} tabIndex={-1}>
        {C.you.editHeading}
      </h3>
      <Input
        label={C.you.name}
        value={draftName}
        error={errors.name}
        autoComplete="name"
        onChange={(event) => {
          setDraftName(event.target.value);
          setErrors((e) => ({ ...e, name: undefined }));
        }}
      />
      <Input
        label={C.you.role}
        value={draftRole}
        error={errors.role}
        autoComplete="organization-title"
        onChange={(event) => {
          setDraftRole(event.target.value);
          setErrors((e) => ({ ...e, role: undefined }));
        }}
      />
      <div className="sponsor-profile__edit-actions">
        <Button type="submit">{C.you.save}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          {C.you.cancel}
        </Button>
      </div>
    </form>
  );
}

/** Their cohort at a glance. Changing it happens on the dashboard, where its
 *  code and figures are. */
function CohortGroup() {
  const id = useCohortId();
  const { cohort } = useCohort(id);
  const started = cohort ? programDay(cohort) > 0 && !cohort.fresh : false;
  return (
    <SettingsGroup label={C.cohort.group} hideLabel>
      {cohort ? (
        <>
          <SettingsRow kind="static" label={C.cohort.name} value={cohort.name} />
          <SettingsRow kind="static" label={started ? C.cohort.started : C.cohort.starts} value={abbrevDate(cohort.startsOn)} />
          <SettingsRow kind="static" label={C.cohort.expected} value={String(cohort.expectedSize)} />
          <SettingsRow kind="static" label={C.cohort.code} value={C.cohort.codeValue(cohort.code, cohort.open)} />
        </>
      ) : (
        <SettingsRow kind="static" label={C.cohort.none} description={C.cohort.noneHint} value="" />
      )}
    </SettingsGroup>
  );
}

type SectionId = "you" | "cohort" | "privacy";
const SECTIONS: SectionId[] = ["you", "cohort", "privacy"];

/**
 * Sponsor profile, Concept 1 — Sections.
 *
 * Kate, 2026-10-23, option Sections from
 * https://claude.ai/artifact/F3EcH7M8GsygRqraLPP9DK: the page uses the width,
 * as the participant Profile does on web. A list of sections on the left
 * (Your details, Your cohort, What you can see) with Sign out closing it, and
 * the chosen section on the right. No Signing in section and no Emails.
 * Only the name and job title change here, with one Edit. The cohort is
 * shown, not edited: its code and figures are on the dashboard. What they
 * can see sits beside what participants are told. Sign out goes to the
 * Sponsor login (2026-10-23, stage 2). Nothing is stored.
 */
export function SponsorProfileConcept1() {
  const [person, setPerson] = useState<{ name: string; role: string }>({ name: SPONSOR_PERSON.name, role: SPONSOR_PERSON.role });
  const [section, setSection] = useState<SectionId>("you");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const router = useRouter();
  const paneRef = useRef<HTMLElement>(null);
  const wasEditing = useRef(false);
  const id = useCohortId();
  const { cohort } = useCohort(id);

  // Closing the form returns focus to the Edit button that opened it.
  useEffect(() => {
    if (wasEditing.current && !editing) paneRef.current?.querySelector<HTMLElement>("button.settings-row--action")?.focus();
    wasEditing.current = editing;
  }, [editing]);

  const sections: Record<SectionId, { label: string; sub: string }> = {
    you: { label: C.you.group, sub: person.name },
    cohort: { label: C.cohort.group, sub: cohort ? cohort.name : C.cohort.none },
    privacy: { label: C.privacy.group, sub: C.privacy.sub },
  };

  return (
    <div className="ent-page sponsor-profile">
      <header className="sponsor-profile__head">
        <Link className="sponsor-profile__back" href={DASHBOARD}>
          <Icon name="arrow-left" size={16} />
          {C.back}
        </Link>
        <h1 className="ent-header__name">
          {C.title}
        </h1>
        <p className="ent-header__meta">
          {person.name}
          <span aria-hidden="true"> · </span>
          <span className="u-visually-hidden">, </span>
          {C.lead(person.role, SPONSOR_PERSON.org)}
        </p>
      </header>

      <output className="u-visually-hidden">{status}</output>

      <div className="sponsor-profile__layout">
        <nav className="sponsor-profile__nav" aria-label={C.sectionsLabel}>
          <SettingsGroup label={C.sectionsLabel} hideLabel>
            {SECTIONS.map((sectionId) => (
              <SettingsRow
                key={sectionId}
                label={sections[sectionId].label}
                description={sections[sectionId].sub}
                current={section === sectionId}
                onOpen={() => {
                  setSection(sectionId);
                  setEditing(false);
                }}
              />
            ))}
          </SettingsGroup>
          {/* Sign out closes the list (Kate, 2026-10-23). */}
          <Button className="sponsor-profile__sign-out" variant="secondary" onClick={() => router.push(LOGIN)}>
            <Icon name="sign-out" size={18} />
            {C.signOut.label}
          </Button>
        </nav>

        <section className="sponsor-profile__pane" aria-labelledby="sponsor-pane-heading" ref={paneRef}>
          <h2 className="sponsor-profile__pane-heading" id="sponsor-pane-heading">
            {sections[section].label}
          </h2>

          {section === "you" ? (
            editing ? (
              <YouEdit
                name={person.name}
                role={person.role}
                onCancel={() => setEditing(false)}
                onSave={(next) => {
                  setPerson(next);
                  setEditing(false);
                  setStatus(C.you.saved);
                }}
              />
            ) : (
              <SettingsGroup label={C.you.group} hideLabel>
                <SettingsRow kind="static" label={C.you.name} value={person.name} />
                <SettingsRow kind="static" label={C.you.role} value={person.role} />
                <SettingsRow kind="static" label={C.you.email} value={SPONSOR_PERSON.email} />
                <SettingsRow kind="static" label={C.you.org} value={SPONSOR_PERSON.org} />
                {/* One Edit for the section (Kate, 2026-10-23): the name and
                    job title, the only two that change here. */}
                <SettingsRow kind="action" icon="edit" label={C.you.editLabel} description={C.you.editHint} onAction={() => setEditing(true)} />
              </SettingsGroup>
            )
          ) : null}

          {section === "cohort" ? <CohortGroup /> : null}

          {section === "privacy" ? (
            <div className="card sponsor-profile__privacy">
              <ul className="sponsor-profile__points">
                {C.privacy.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="sponsor-profile__told">
                {C.privacy.told}
                <q>{PROFILE_COPY.organization.member(SPONSOR_PERSON.org)}</q>
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

export default SponsorProfileConcept1;
