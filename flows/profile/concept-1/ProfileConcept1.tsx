"use client";

import { useState } from "react";
import { Input } from "@/components/form/Input";
import { Sheet } from "@/components/layout/Sheet";
import { DeletionDetail } from "@/components/profile/DeletionDetail";
import { DetailPanel } from "@/components/profile/DetailPanel";
import { NOTIFY_TOPICS, NotificationsDetail } from "@/components/profile/NotificationsDetail";
import { OrganizationDetail } from "@/components/profile/OrganizationDetail";
import { SettingsGroup } from "@/components/profile/SettingsGroup";
import { SettingsRow } from "@/components/profile/SettingsRow";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { loopActions, useLoop } from "@/lib/loop-store";
import { fullName, type Account } from "@/mock/account";
import { PROFILE_COPY as C, type ProfileDetailId } from "@/mock/profile";

/**
 * Profile Concept 1 — Grouped.
 *
 * Profile and settings on one page, by decision on 2026-09-28: a settings
 * list in labeled groups, each row ending in its current value. On mobile
 * and tablet a row opens its detail in a sheet; on web the list and the
 * detail sit side by side, with the account open to begin with.
 *
 * Cut on 2026-10-01: the "You" and "Connections" groups, and "What ExecHQ
 * uses". Notifications sits open on the page rather than behind a row, so
 * nothing there is hidden.
 *
 * The account is Maya's, read from the Loop, so what is connected follows
 * the homepage state picked in the dock, and every change made here is kept
 * the way Loop changes are. Signing out and deleting end the page in place,
 * because Login is not built yet; neither is stored.
 */

const PANE_HEADING = "profile-detail-heading";

type Ended = "deleted" | "signed-out" | null;

/** The heading each detail opens with, which also names its sheet. */
function headingOf(id: ProfileDetailId): string {
  switch (id) {
    case "account":
      return C.account.editHeading;
    case "organization":
      return C.organization.heading;
    case "delete":
      return C.delete.heading;
    default:
      return C.title;
  }
}

interface AccountEdit {
  name: string;
  lastName: string;
  email: string;
}

/** Her name and email, open on the page, with Edit. Her role is not here: it
 *  lives on her Plan. */
function AccountSummary({ account, onEdit }: { account: Account; onEdit: () => void }) {
  return (
    <div className="detail-panel">
      <div className="detail-panel__head">
        <h2 className="detail-panel__heading" id="account-heading">
          {C.account.heading}
        </h2>
        <Button variant="secondary" size="sm" onClick={onEdit}>
          {C.account.edit}
          <span className="u-visually-hidden"> your account</span>
        </Button>
      </div>
      <div className="profile-fact">
        <span className="profile-fact__label">{C.account.nameLabel}</span>
        <span className="profile-fact__value">{fullName(account) || C.noName}</span>
      </div>
      <div className="profile-fact">
        <span className="profile-fact__label">{C.account.emailLabel}</span>
        <span className="profile-fact__value">{account.email}</span>
      </div>
    </div>
  );
}

/** Editing her name and email, in a sheet. Remounted whenever they are saved. */
function AccountDetail({
  account,
  onSave,
  onClose,
}: {
  account: Account;
  onSave: (edit: AccountEdit) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(account.name ?? "");
  const [lastName, setLastName] = useState(account.lastName ?? "");
  const [email, setEmail] = useState(account.email);
  const [errors, setErrors] = useState<{ name?: string; lastName?: string; email?: string }>({});
  return (
    <DetailPanel heading={C.account.editHeading} headingId={PANE_HEADING} onClose={onClose}>
      <form
        className="detail-panel__form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const next = {
            name: name.trim() ? undefined : C.account.firstNameMissing,
            lastName: lastName.trim() ? undefined : C.account.lastNameMissing,
            email: !email.trim()
              ? C.account.emailMissing
              : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
                ? undefined
                : C.account.emailInvalid,
          };
          setErrors(next);
          if (next.name || next.lastName || next.email) return;
          onSave({ name: name.trim(), lastName: lastName.trim(), email: email.trim() });
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
          label={C.account.emailLabel}
          type="email"
          value={email}
          error={errors.email}
          autoComplete="email"
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((e) => ({ ...e, email: undefined }));
          }}
        />
        <div className="detail-panel__actions">
          <Button type="submit" fullWidth>
            {C.account.save}
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose}>
            {C.account.cancel}
          </Button>
        </div>
      </form>
    </DetailPanel>
  );
}

export function ProfileConcept1() {
  const loop = useLoop();
  const account = loop.account;

  /** The sheet that is open, on every viewport. */
  const [open, setOpen] = useState<ProfileDetailId | null>(null);
  const [ended, setEnded] = useState<Ended>(null);
  const [message, setMessage] = useState("");

  const [downloading, setDownloading] = useState(false);

  const show = (id: ProfileDetailId) => setOpen(id);
  const close = () => setOpen(null);
  const announce = (text: string) => setMessage(text);

  /** Downloading her data is one tap and no sheet. The prototype saves nothing:
   *  it only says that the file is on its way. */
  function download() {
    setDownloading(true);
    announce(C.rows.exportStarted);
    setTimeout(() => setDownloading(false), 2000);
  }

  function end(how: Exclude<Ended, null>) {
    setOpen(null);
    setEnded(how);
    setTimeout(() => document.getElementById("profile-end-heading")?.focus(), 0);
  }

  function detail(id: ProfileDetailId) {
    const onClose = close;
    switch (id) {
      case "account":
        return (
          <AccountDetail
            key={`${account.name}|${account.lastName}|${account.email}`}
            account={account}
            onClose={onClose}
            onSave={({ name, lastName, email }) => {
              loopActions.updateAccount({ name, lastName, email });
              announce(C.account.saved);
              close();
            }}
          />
        );
      case "organization":
        return (
          <OrganizationDetail
            org={account.org}
            startConfirming
            headingId={PANE_HEADING}
            onClose={onClose}
            onLeave={() => {
              const name = account.org?.name ?? "";
              loopActions.updateAccount({ org: undefined });
              announce(C.organization.left(name));
              close();
            }}
          />
        );
      case "delete":
        return (
          <DeletionDetail
            email={account.email}
            drafts={loop.records.length}
            headingId={PANE_HEADING}
            onClose={onClose}
            onKeep={onClose}
            onExport={download}
            downloading={downloading}
            onDelete={() => end("deleted")}
          />
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

  const R = C.rows;

  return (
    <div className="profile">
      <h1 className="profile__title">{C.title}</h1>
      <div className="profile__layout">
        <div className="profile__list">
          <div className="profile__column">
            <section className="profile__section" aria-labelledby="account-heading">
              <AccountSummary account={account} onEdit={() => show("account")} />
            </section>

            <section className="profile__section" aria-labelledby="notifications-heading">
              <NotificationsDetail
                notify={account.notify}
                onChange={(item, on) => {
                  const notify = { ...account.notify };
                  for (const topic of NOTIFY_TOPICS[item]) notify[topic] = on;
                  loopActions.updateAccount({ notify });
                  const label = C.notifications.items[item].label;
                  announce(on ? C.notifications.savedOn(label) : C.notifications.savedOff(label));
                }}
              />
            </section>

          </div>

          <div className="profile__column">
            {account.org ? (
              <section className="profile__section" aria-labelledby="organization-heading">
                <OrganizationDetail org={account.org} onLeave={() => {}} onRequestLeave={() => show("organization")} />
              </section>
            ) : null}

            <section className="profile__section" aria-labelledby="data-heading">
              <DetailPanel heading={C.groups.data} headingId="data-heading">
                <SettingsGroup label={C.groups.data} headingLevel={3} hideLabel>
                  <SettingsRow
                    kind="action"
                    icon="download"
                    label={R.export}
                    value={downloading ? R.exportWorking : R.exportValue}
                    busy={downloading}
                    onAction={download}
                  />
                </SettingsGroup>
                {/* Set well apart from the download, so the two never read as alike. */}
                <div className="profile__apart">
                  <SettingsGroup label={C.groups.delete} headingLevel={3} hideLabel>
                    <SettingsRow icon="trash" label={R.delete} tone="danger" onOpen={() => show("delete")} />
                  </SettingsGroup>
                </div>
              </DetailPanel>
            </section>

            <Button variant="secondary" fullWidth onClick={() => end("signed-out")}>
              <Icon name="sign-out" size={16} />
              {R.signOut}
            </Button>
          </div>
        </div>

      </div>

      <Sheet open={open !== null} onClose={close} label={open ? headingOf(open) : ""}>
        {open ? detail(open) : null}
      </Sheet>

      <output className="u-visually-hidden">{message}</output>
    </div>
  );
}

export default ProfileConcept1;
