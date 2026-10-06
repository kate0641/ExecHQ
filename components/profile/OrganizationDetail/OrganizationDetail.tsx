"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import type { Organization } from "@/mock/account";
import { PROFILE_COPY } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";

export interface OrganizationDetailProps {
  /** Undefined when she is not part of one. */
  org?: Organization;
  onLeave: () => void;
  /** Where the details sit open on the page, Leave hands the asking to the
   *  caller (a small sheet) instead of swapping the page's content. */
  onRequestLeave?: () => void;
  /** Catalogue only: open on the leave confirmation. */
  startConfirming?: boolean;
  onClose?: () => void;
  headingId?: string;
}

const C = PROFILE_COPY.organization;

/** A few fragments as one short line, the first capitalised. */
function sentence(parts: string[]): string {
  return parts.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}.`).join(" ");
}

/**
 * The organization her account came through, if any: who it is, her role,
 * and in plain words what it can and can never see: a summary of everyone in
 * the group as a whole, never her personally. Leaving asks once.
 */
export function OrganizationDetail({
  org,
  onLeave,
  onRequestLeave,
  startConfirming = false,
  onClose,
  headingId = "organization-heading",
}: OrganizationDetailProps) {
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
        <span className="profile-fact__label">{C.never}</span>
        <span className="profile-fact__value">{sentence(org.never)}</span>
      </div>
      <Button variant="secondary" fullWidth onClick={onRequestLeave ?? (() => setConfirming(true))}>
        {C.leave}
      </Button>
    </DetailPanel>
  );
}

export default OrganizationDetail;
