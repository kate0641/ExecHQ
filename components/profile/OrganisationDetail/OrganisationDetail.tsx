"use client";

import { useState } from "react";
import { Notice } from "@/components/onboarding/Notice";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import type { Organisation } from "@/mock/account";
import { PROFILE_COPY, PROFILE_PROVISIONAL } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";
import { dayMonthYear } from "../profile-dates";

export interface OrganisationDetailProps {
  /** Undefined when she is not part of one. */
  org?: Organisation;
  onLeave: () => void;
  /** Catalogue only: open on the leave confirmation. */
  startConfirming?: boolean;
  onClose?: () => void;
  headingId?: string;
}

const C = PROFILE_COPY.organisation;

/**
 * The organisation her account came through, if any: who it is, her role,
 * and in plain words what it can and can never see. Leaving asks once.
 * PROVISIONAL: what an organisation sees is open with the client.
 */
export function OrganisationDetail({
  org,
  onLeave,
  startConfirming = false,
  onClose,
  headingId = "organisation-heading",
}: OrganisationDetailProps) {
  const [confirming, setConfirming] = useState(startConfirming);

  if (!org) {
    return (
      <DetailPanel heading={C.heading} headingId={headingId} lead={C.noneLead} onClose={onClose}>
        <p className="detail-panel__body">{C.noneHint}</p>
      </DetailPanel>
    );
  }

  if (confirming) {
    return (
      <DetailPanel heading={C.confirmHeading(org.name)} headingId={headingId} lead={C.confirmBody} onClose={onClose}>
        <div className="detail-panel__actions">
          <Button variant="danger" fullWidth onClick={onLeave}>
            {C.confirm}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setConfirming(false)}>
            {C.keep}
          </Button>
        </div>
      </DetailPanel>
    );
  }

  return (
    <DetailPanel heading={C.heading} headingId={headingId} lead={C.member(org.name)} onClose={onClose}>
      <div className="profile-fact">
        <span className="profile-fact__label">{org.name}</span>
        <span className="profile-fact__value">
          {C.role}: {org.role}
        </span>
        <span className="profile-fact__hint">
          {C.joined} {dayMonthYear(org.joinedOn)}
        </span>
      </div>
      <section aria-labelledby={`${headingId}-sees`}>
        <h3 className="profile-fact__label" id={`${headingId}-sees`}>
          {C.sees}
        </h3>
        <ul className="detail-list">
          {org.sees.map((line) => (
            <li key={line}>
              <Icon name="check" size={16} />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby={`${headingId}-never`}>
        <h3 className="profile-fact__label" id={`${headingId}-never`}>
          {C.never}
        </h3>
        <ul className="detail-list">
          {org.never.map((line) => (
            <li key={line}>
              <Icon name="close" size={16} />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
      <Notice tone="explain" label={PROFILE_PROVISIONAL.label}>
        {PROFILE_PROVISIONAL.organisation}
      </Notice>
      <Button variant="secondary" fullWidth onClick={() => setConfirming(true)}>
        {C.leave}
      </Button>
    </DetailPanel>
  );
}

export default OrganisationDetail;
