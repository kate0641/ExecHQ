import type { Organization } from "@/mock/account";
import { PROFILE_COPY } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";

export interface OrganizationDetailProps {
  /** Undefined when she is not part of one. */
  org?: Organization;
  onClose?: () => void;
  headingId?: string;
}

const C = PROFILE_COPY.organization;

/** A few fragments as one short line, the first capitalised. */
function sentence(parts: string[]): string {
  return parts.map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}.`).join(" ");
}

/**
 * The organization her account came through, if any: who it is, and in plain
 * words what it can and can never see: totals for everyone in the group as a
 * whole, never her plan or her work. Read only: there is no way to leave an
 * organization from Profile.
 */
export function OrganizationDetail({ org, onClose, headingId = "organization-heading" }: OrganizationDetailProps) {
  if (!org) {
    return (
      <DetailPanel heading={C.heading} headingId={headingId} lead={C.noneLead} onClose={onClose}>
        <p className="detail-panel__body">{C.noneHint}</p>
      </DetailPanel>
    );
  }

  return (
    <DetailPanel heading={C.heading} headingId={headingId} lead={C.member(org.name)} onClose={onClose}>
      <div className="card card--action">
        <div className="profile-fact">
          <span className="profile-fact__label">{C.never}</span>
          <span className="profile-fact__value">{sentence(org.never)}</span>
        </div>
      </div>
    </DetailPanel>
  );
}

export default OrganizationDetail;
