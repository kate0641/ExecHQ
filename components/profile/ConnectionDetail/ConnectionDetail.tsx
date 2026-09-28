"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/form/Input";
import { Notice } from "@/components/onboarding/Notice";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import type { Connection } from "@/mock/account";
import { PROFILE_COPY, PROFILE_PROVISIONAL } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";
import { dayMonthYear } from "../profile-dates";

export interface ConnectionDetailProps {
  connection: Connection;
  /** Connects it, with what it points at: a file name or an address. */
  onConnect: (source: string) => void;
  onRemove: () => void;
  onClose?: () => void;
  headingId?: string;
  /** Catalogue only: open on the remove confirmation. */
  startConfirming?: boolean;
  /** Catalogue only: open with the wrong-file or bad-address error. */
  startError?: boolean;
}

const C = PROFILE_COPY.connection;

/** Accepts "mayachen.com" or "https://mayachen.com/"; returns the bare host
 *  and path, or nothing if it is not an address. */
function cleanAddress(value: string): string | undefined {
  const bare = value.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");
  return /^[^\s/]+\.[a-z]{2,}(\/\S*)?$/i.test(bare) ? bare : undefined;
}

/**
 * One connection, in full: what it shares, word for word, and the way to
 * remove it — or, before it is connected, what it would share and the way
 * to connect it. Removing asks once, and says what goes.
 */
export function ConnectionDetail({
  connection,
  onConnect,
  onRemove,
  onClose,
  headingId = "connection-heading",
  startConfirming = false,
  startError = false,
}: ConnectionDetailProps) {
  const { id, label, connected } = connection;
  const [confirming, setConfirming] = useState(startConfirming);
  const [error, setError] = useState<string | undefined>(
    startError ? (id === "website" ? C.badSite : C.wrongFile) : undefined
  );
  const [address, setAddress] = useState(`https://${C.siteExample}`);
  const fileRef = useRef<HTMLInputElement>(null);

  // Moving between the detail and its confirmation replaces the content, so
  // focus goes to the new heading. Not on first paint.
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) {
      moved.current = true;
      return;
    }
    document.getElementById(headingId)?.focus();
  }, [confirming, headingId]);

  const shares = (
    <div className="connection-shares">
      <p className="connection-shares__label">{connected ? C.shares : C.wouldShare}</p>
      <ul className="connection-shares__list">
        {connection.shares.map((line) => (
          <li key={line}>
            <Icon name={connected ? "check" : "document"} size={16} />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (connected && confirming) {
    return (
      <DetailPanel heading={C.confirmHeading(label)} headingId={headingId} onClose={onClose}>
        <p className="detail-panel__body">{C.confirmBody(connection.source ?? label)}</p>
        <Notice tone="explain" label={PROFILE_PROVISIONAL.label}>
          {PROFILE_PROVISIONAL.revoke}
        </Notice>
        <div className="detail-panel__actions">
          <Button variant="danger" fullWidth onClick={onRemove}>
            {C.remove(label)}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setConfirming(false)}>
            {C.keep}
          </Button>
        </div>
      </DetailPanel>
    );
  }

  if (connected) {
    return (
      <DetailPanel heading={label} headingId={headingId} onClose={onClose}>
        <p className="connection-status">
          <Badge tone="success">{PROFILE_COPY.rows.connected}</Badge>
          <span>{C.since(connection.source ?? "", dayMonthYear(connection.connectedOn ?? ""))}</span>
        </p>
        {shares}
        <div className="detail-panel__actions">
          <Button variant="secondary" fullWidth onClick={() => setConfirming(true)}>
            {C.remove(label)}
          </Button>
        </div>
      </DetailPanel>
    );
  }

  return (
    <DetailPanel heading={C.connect(label)} headingId={headingId} lead={C.why[id]} onClose={onClose}>
      {shares}
      {id === "website" ? (
        <form
          className="detail-panel__form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const clean = cleanAddress(address);
            if (clean) onConnect(clean);
            else setError(C.badSite);
          }}
        >
          <Input
            label={C.siteLabel}
            type="url"
            inputMode="url"
            placeholder={C.sitePlaceholder}
            value={address}
            error={error}
            onChange={(event) => {
              setAddress(event.target.value);
              setError(undefined);
            }}
          />
          <Button type="submit" fullWidth>
            {C.connectSite}
          </Button>
        </form>
      ) : (
        <div className="detail-panel__form">
          <input
            ref={fileRef}
            type="file"
            className="u-visually-hidden"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              if (/\.xlsx?$/i.test(file.name)) onConnect(file.name);
              else setError(C.wrongFile);
            }}
          />
          <button type="button" className="connection-upload" onClick={() => fileRef.current?.click()}>
            <Icon name="attach" size={20} />
            <span className="connection-upload__name">{C.upload}</span>
            <span className="connection-upload__hint">{C.uploadHint}</span>
          </button>
          {error ? (
            <Notice tone="problem" live>
              {error}
            </Notice>
          ) : null}
          <Button variant="secondary" fullWidth onClick={() => onConnect(C.sampleSource)}>
            {C.sample}
          </Button>
        </div>
      )}
    </DetailPanel>
  );
}

export default ConnectionDetail;
