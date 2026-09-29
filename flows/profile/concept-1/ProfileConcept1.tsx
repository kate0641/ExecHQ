"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { Notice } from "@/components/onboarding/Notice";
import { ConnectionDetail } from "@/components/profile/ConnectionDetail";
import { DeletionDetail } from "@/components/profile/DeletionDetail";
import { DetailPanel } from "@/components/profile/DetailPanel";
import { ExportDetail } from "@/components/profile/ExportDetail";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SettingsGroup } from "@/components/profile/SettingsGroup";
import { SettingsRow } from "@/components/profile/SettingsRow";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { loopActions, useLoop } from "@/lib/loop-store";
import { conceptHref } from "@/lib/manifest";
import { useViewport } from "@/lib/viewport-context";
import { fullName, withConnection, type Account, type Connection, type ConnectionId } from "@/mock/account";
import { PROFILE_COPY as C, PROFILE_PROVISIONAL, type ProfileDetailId } from "@/mock/profile";

/**
 * Profile Concept 1 — Grouped.
 *
 * Profile and settings on one page, by decision on 2026-09-28: a settings
 * list in labelled groups, each row ending in its current value. On mobile
 * and tablet a row opens its detail in a sheet; on web the list and the
 * detail sit side by side, with the account open to begin with.
 *
 * The account is Maya's, read from the Loop, so what is connected follows
 * the homepage state picked in the dock, and every change made here is kept
 * the way Loop changes are. Signing out and deleting end the page in place,
 * because Login is not built yet; neither is stored.
 */

const PLAN = conceptHref("plan", "concept-1");
const PANE_HEADING = "profile-detail-heading";

type Ended = "deleted" | "signed-out" | null;

function connectionOf(account: Account, id: ConnectionId): Connection {
  return account.connections.find((c) => c.id === id)!;
}

/** The heading each detail opens with, which also names its sheet. */
function headingOf(id: ProfileDetailId, account: Account): string {
  switch (id) {
    case "account":
      return C.account.heading;
    case "direction":
      return C.direction.heading;
    case "linkedin":
    case "website": {
      const c = connectionOf(account, id);
      return c.connected ? c.label : C.connection.connect(c.label);
    }
    case "export":
      return C.export.heading;
    case "delete":
      return C.delete.heading;
    case "sign-out":
      return C.signOut.heading;
    default:
      return C.title;
  }
}

interface AccountEdit {
  name: string;
  lastName: string;
  jobTitle: string;
}

/** Editing her name and current title. Remounted whenever they are saved. */
function AccountDetail({
  account,
  onSave,
  onClose,
}: {
  account: Account;
  onSave: (edit: AccountEdit) => void;
  onClose?: () => void;
}) {
  const [name, setName] = useState(account.name ?? "");
  const [lastName, setLastName] = useState(account.lastName ?? "");
  const [jobTitle, setJobTitle] = useState(account.jobTitle ?? "");
  const [errors, setErrors] = useState<{ name?: string; lastName?: string }>({});
  return (
    <DetailPanel heading={C.account.heading} headingId={PANE_HEADING} onClose={onClose}>
      <form
        className="detail-panel__form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const next = {
            name: name.trim() ? undefined : C.account.firstNameMissing,
            lastName: lastName.trim() ? undefined : C.account.lastNameMissing,
          };
          setErrors(next);
          if (next.name || next.lastName) return;
          onSave({ name: name.trim(), lastName: lastName.trim(), jobTitle: jobTitle.trim() });
        }}
      >
        <Input
          label={C.account.firstNameLabel}
          value={name}
          error={errors.name}
          autoComplete="given-name"
          onChange={(event) => {
            setName(event.target.value);
            setErrors((e) => ({ ...e, name: undefined }));
          }}
        />
        <Input
          label={C.account.lastNameLabel}
          value={lastName}
          error={errors.lastName}
          autoComplete="family-name"
          onChange={(event) => {
            setLastName(event.target.value);
            setErrors((e) => ({ ...e, lastName: undefined }));
          }}
        />
        <Input
          label={C.account.titleLabel}
          hint={C.account.titleHint}
          value={jobTitle}
          autoComplete="organization-title"
          onChange={(event) => setJobTitle(event.target.value)}
        />
        <div className="profile-fact">
          <span className="profile-fact__label">{C.account.emailLabel}</span>
          <span className="profile-fact__value">{account.email}</span>
          <span className="profile-fact__hint">{C.account.emailHint}</span>
        </div>
        <div className="detail-panel__actions">
          <Button type="submit" fullWidth>
            {C.account.save}
          </Button>
          {onClose ? (
            <Button variant="secondary" fullWidth onClick={onClose}>
              {C.account.cancel}
            </Button>
          ) : null}
        </div>
      </form>
    </DetailPanel>
  );
}

export function ProfileConcept1() {
  const loop = useLoop();
  const { viewport } = useViewport();
  const web = viewport === "web";
  const account = loop.account;
  const plan = account.plan;

  /** The sheet open on mobile and tablet. */
  const [open, setOpen] = useState<ProfileDetailId | null>(null);
  /** The detail in the web pane. */
  const [selected, setSelected] = useState<ProfileDetailId>("account");
  const [ended, setEnded] = useState<Ended>(null);
  const [message, setMessage] = useState("");
  /** Set when the web pane's detail was picked, so its heading takes focus. */
  const [picked, setPicked] = useState(0);

  useEffect(() => {
    if (picked) document.getElementById(PANE_HEADING)?.focus();
  }, [picked]);

  function show(id: ProfileDetailId) {
    if (web) {
      setSelected(id);
      setPicked((n) => n + 1);
    } else {
      setOpen(id);
    }
  }
  const close = () => setOpen(null);
  const announce = (text: string) => setMessage(text);

  function setConnection(id: ConnectionId, source: string | null) {
    const label = connectionOf(account, id).label;
    const connections = source
      ? withConnection(account, id, loop.today, source).connections
      : account.connections.map((c) =>
          c.id === id ? { ...c, connected: false, connectedOn: undefined, source: undefined } : c
        );
    loopActions.updateAccount({ connections });
    announce(source ? C.connection.connectedToast(label) : C.connection.removedToast(label));
  }

  function end(how: Exclude<Ended, null>) {
    setOpen(null);
    setEnded(how);
    setTimeout(() => document.getElementById("profile-end-heading")?.focus(), 0);
  }

  function detail(id: ProfileDetailId, inSheet: boolean) {
    const onClose = inSheet ? close : undefined;
    switch (id) {
      case "account":
        return (
          <AccountDetail
            key={`${account.name}|${account.lastName}|${account.jobTitle}`}
            account={account}
            onClose={onClose}
            onSave={({ name, lastName, jobTitle }) => {
              loopActions.updateAccount({ name, lastName, jobTitle: jobTitle || undefined });
              announce(C.account.saved);
              if (inSheet) close();
            }}
          />
        );
      case "direction":
        return (
          <DetailPanel heading={C.direction.heading} headingId={PANE_HEADING} onClose={onClose}>
            <p className="detail-panel__quote">{`“${account.direction}”`}</p>
            <p className="detail-panel__body">{C.direction.body(plan.name)}</p>
            <Link className="btn btn--primary btn--md btn--full" href={PLAN}>
              <span className="btn__label">{C.direction.toPlan}</span>
            </Link>
          </DetailPanel>
        );
      case "linkedin":
      case "website": {
        const connection = connectionOf(account, id);
        return (
          <ConnectionDetail
            key={`${id}-${connection.connected}`}
            connection={connection}
            headingId={PANE_HEADING}
            onClose={onClose}
            onConnect={(source) => {
              setConnection(id, source);
              setTimeout(() => document.getElementById(PANE_HEADING)?.focus(), 0);
            }}
            onRemove={() => {
              setConnection(id, null);
              setTimeout(() => document.getElementById(PANE_HEADING)?.focus(), 0);
            }}
          />
        );
      }
      case "export":
        return <ExportDetail drafts={loop.records.map((r) => r.title)} headingId={PANE_HEADING} onClose={onClose} />;
      case "delete":
        return (
          <DeletionDetail
            email={account.email}
            drafts={loop.records.length}
            connections={account.connections.filter((c) => c.connected).map((c) => c.label)}
            headingId={PANE_HEADING}
            onClose={onClose}
            onKeep={onClose}
            onExport={() => show("export")}
            onDelete={() => end("deleted")}
          />
        );
      case "sign-out":
        return (
          <DetailPanel
            heading={C.signOut.heading}
            headingId={PANE_HEADING}
            lead={C.signOut.body(account.email)}
            onClose={onClose}
          >
            <div className="detail-panel__actions">
              <Button fullWidth onClick={() => end("signed-out")}>
                {C.signOut.confirm}
              </Button>
              {onClose ? (
                <Button variant="secondary" fullWidth onClick={onClose}>
                  {C.signOut.stay}
                </Button>
              ) : null}
            </div>
          </DetailPanel>
        );
      default:
        return null;
    }
  }

  if (ended) {
    const copy = ended === "deleted" ? C.delete : C.signOut;
    return (
      <div className="profile-end">
        <span className="profile-end__mark">
          <Icon name={ended === "deleted" ? "check" : "sign-out"} size={24} />
        </span>
        <h1 className="profile-end__heading" id="profile-end-heading" tabIndex={-1}>
          {copy.doneHeading}
        </h1>
        <p className="profile-end__body">{copy.doneBody}</p>
        <Button variant={ended === "deleted" ? "secondary" : "primary"} onClick={() => setEnded(null)}>
          {ended === "deleted" ? C.delete.reset : C.signOut.back}
        </Button>
      </div>
    );
  }

  const current = (id: ProfileDetailId) => web && selected === id;
  const R = C.rows;
  const linkedin = connectionOf(account, "linkedin");
  const website = connectionOf(account, "website");

  return (
    <div className="profile">
      <h1 className="profile__title">{C.title}</h1>
      <div className="profile__layout">
        <div className="profile__list">
          <ProfileHeader
            name={fullName(account) || undefined}
            title={account.jobTitle}
            initialOf={account.name}
            noName={C.noName}
            onOpen={() => show("account")}
            current={current("account")}
          />

          <SettingsGroup label={C.groups.you}>
            <SettingsRow
              label={R.direction}
              value={R.directionValue}
              onOpen={() => show("direction")}
              current={current("direction")}
            />
            <SettingsRow label={R.plan} value={R.planValue(plan.name, plan.formalName)} href={PLAN} />
          </SettingsGroup>

          <SettingsGroup label={C.groups.connections}>
            <SettingsRow
              icon="linkedin"
              label={linkedin.label}
              value={linkedin.connected ? R.connected : R.notConnected}
              onOpen={() => show("linkedin")}
              current={current("linkedin")}
            />
            <SettingsRow
              icon="globe"
              label={website.label}
              value={website.connected ? R.connected : R.notConnected}
              onOpen={() => show("website")}
              current={current("website")}
            />
          </SettingsGroup>

          <SettingsGroup label={C.groups.email}>
            <SettingsRow
              kind="switch"
              icon="bell"
              label={R.followUps}
              description={account.emailFollowUps ? C.followUps.on : C.followUps.off}
              checked={account.emailFollowUps}
              onChange={(on) => {
                loopActions.updateAccount({ emailFollowUps: on });
                announce(on ? C.followUps.turnedOn : C.followUps.turnedOff);
              }}
            />
          </SettingsGroup>
          <Notice tone="explain" label={PROFILE_PROVISIONAL.label} className="profile__note">
            {PROFILE_PROVISIONAL.followUps}
          </Notice>

          <SettingsGroup label={C.groups.data}>
            <SettingsRow icon="download" label={R.export} onOpen={() => show("export")} current={current("export")} />
            <SettingsRow
              icon="trash"
              label={R.delete}
              tone="danger"
              onOpen={() => show("delete")}
              current={current("delete")}
            />
          </SettingsGroup>

          <p className="profile__owner">
            <Icon name="lock" size={16} />
            <span>{C.owner}</span>
          </p>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => show("sign-out")}
            aria-current={current("sign-out") ? "true" : undefined}
            data-detail-row
          >
            <Icon name="sign-out" size={16} />
            {R.signOut}
          </Button>
        </div>

        {web ? (
          <section className="profile__pane" aria-label={headingOf(selected, account)}>
            {detail(selected, false)}
          </section>
        ) : null}
      </div>

      {!web ? (
        <Sheet open={open !== null} onClose={close} label={open ? headingOf(open, account) : ""}>
          {open ? detail(open, true) : null}
        </Sheet>
      ) : null}

      <output className="u-visually-hidden">{message}</output>
    </div>
  );
}

export default ProfileConcept1;
