"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/form/Input";
import { SettingsGroup } from "@/components/profile/SettingsGroup";
import { SettingsRow } from "@/components/profile/SettingsRow";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { useCohortId } from "@/lib/cohort-store";
import { conceptHref } from "@/lib/manifest";
import { SPONSOR_PERSON, SPONSOR_PROFILE_COPY as C, abbrevDate, programDay, type SponsorEmailId } from "@/mock/enterprise";
import { PROFILE_COPY } from "@/mock/profile";
import { useCohort } from "../../enterprise/useCohort";

/** The dashboard concept chosen (Kate, 2026-10-22). */
const DASHBOARD = conceptHref("enterprise", "concept-1");

const EMAILS = Object.keys(C.emails.items) as SponsorEmailId[];

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
    <SettingsGroup label={C.cohort.group}>
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
      <SettingsRow icon="chart-bar" label={C.cohort.toDashboard} description={C.cohort.toDashboardHint} href={DASHBOARD} />
    </SettingsGroup>
  );
}

/**
 * Sponsor profile, Concept 1 — One page.
 *
 * No brief (Kate, 2026-10-22: "fairly straightforward and utilitarian"), so
 * it borrows the participant Profile's settings rows and groups: You, Your
 * cohort, Emails, What you can see, and Signing in, in one column at web
 * width. Only the name and job title change here; the work email is how
 * they sign in, so it changes through ExecHQ. The cohort is shown, not
 * edited: its code and figures are on the dashboard. What they can see is
 * said plainly, beside what participants are told, so both sides of the
 * promise sit on one page. Signing out ends the page in place, because the
 * sponsor's sign-in isn't designed; nothing here is stored.
 */
export function SponsorProfileConcept1() {
  const [person, setPerson] = useState<{ name: string; role: string }>({ name: SPONSOR_PERSON.name, role: SPONSOR_PERSON.role });
  const [editing, setEditing] = useState(false);
  const [emails, setEmails] = useState<Record<SponsorEmailId, boolean>>({ ...C.emails.defaults });
  const [status, setStatus] = useState("");
  const [signedOut, setSignedOut] = useState(false);
  const [signedOutAll, setSignedOutAll] = useState(false);
  const editRowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const wasEditing = useRef(false);

  // Closing the form returns focus to the row that opened it.
  useEffect(() => {
    if (wasEditing.current && !editing) editRowRef.current?.querySelector<HTMLElement>(".settings-row")?.focus();
    wasEditing.current = editing;
  }, [editing]);

  // Signing out, and back in, replaces the page: focus goes to its heading.
  const wasSignedOut = useRef(signedOut);
  useEffect(() => {
    if (wasSignedOut.current !== signedOut) titleRef.current?.focus();
    wasSignedOut.current = signedOut;
  }, [signedOut]);

  if (signedOut) {
    return (
      <div className="ent-page ent-page--narrow sponsor-profile">
        <div className="ent-setup__lead">
          <h1 className="ent-header__name" ref={titleRef} tabIndex={-1}>
            {C.signing.ended}
          </h1>
          <p>{C.signing.endedLead}</p>
        </div>
        <Button className="ent-setup__next" onClick={() => setSignedOut(false)}>
          {C.signing.again}
        </Button>
      </div>
    );
  }

  return (
    <div className="ent-page ent-page--narrow sponsor-profile">
      <header className="sponsor-profile__head">
        <Link className="sponsor-profile__back" href={DASHBOARD}>
          <Icon name="arrow-left" size={16} />
          {C.back}
        </Link>
        <h1 className="ent-header__name" ref={titleRef} tabIndex={-1}>
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

      <div ref={editRowRef}>
      <SettingsGroup label={C.you.group}>
        {editing ? (
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
          <>
            <SettingsRow icon="edit" label={C.you.name} value={person.name} onOpen={() => setEditing(true)} />
            <SettingsRow icon="edit" label={C.you.role} value={person.role} onOpen={() => setEditing(true)} />
          </>
        )}
        <SettingsRow kind="static" label={C.you.email} description={C.you.emailHint} value={SPONSOR_PERSON.email} />
        <SettingsRow kind="static" label={C.you.org} value={SPONSOR_PERSON.org} />
      </SettingsGroup>
      </div>

      <CohortGroup />

      <div className="sponsor-profile__with-note">
      <SettingsGroup label={C.emails.group}>
        {EMAILS.map((id) => (
          <SettingsRow
            key={id}
            kind="switch"
            label={C.emails.items[id].label}
            description={C.emails.items[id].hint}
            checked={emails[id]}
            onChange={(checked) => {
              setEmails((current) => ({ ...current, [id]: checked }));
              setStatus((checked ? C.emails.savedOn : C.emails.savedOff)(C.emails.items[id].label));
            }}
          />
        ))}
      </SettingsGroup>
      <p className="sponsor-profile__lead">{C.emails.lead}</p>
      </div>

      <SettingsGroup label={C.privacy.group}>
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
      </SettingsGroup>

      <SettingsGroup label={C.signing.group}>
        <SettingsRow kind="static" label={C.signing.with} description={C.signing.method} value={SPONSOR_PERSON.email} />
        <SettingsRow
          kind="action"
          icon="sign-out"
          label={C.signing.signOutAll}
          description={signedOutAll ? C.signing.signedOutAll : undefined}
          onAction={() => {
            setSignedOutAll(true);
            setStatus(C.signing.signedOutAll);
          }}
        />
        <SettingsRow kind="action" icon="sign-out" label={C.signing.signOut} onAction={() => setSignedOut(true)} />
      </SettingsGroup>
    </div>
  );
}

export default SponsorProfileConcept1;
