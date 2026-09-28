import { Notice } from "@/components/onboarding/Notice";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PROFILE_COPY, PROFILE_PROVISIONAL } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";

export interface DeletionDetailProps {
  email: string;
  /** How many drafts she has. */
  drafts: number;
  /** The labels of what is connected now. */
  connections: string[];
  onDelete: () => void;
  /** Keeps the account. In a sheet, closes it. */
  onKeep?: () => void;
  /** Opens the download first. */
  onExport: () => void;
  onClose?: () => void;
  headingId?: string;
}

const C = PROFILE_COPY.delete;

/**
 * Deleting the account: exactly what is removed, read from the account as
 * it is now, with no guilt language and a way to take a copy first.
 * PROVISIONAL: the copy assumes deletion is immediate.
 */
export function DeletionDetail({
  email,
  drafts,
  connections,
  onDelete,
  onKeep,
  onExport,
  onClose,
  headingId = "delete-heading",
}: DeletionDetailProps) {
  const removes = [
    C.removes.account(email),
    C.removes.answers,
    ...(drafts ? [C.removes.drafts(drafts)] : []),
    C.removes.loop,
    ...connections.map(C.removes.connection),
  ];

  return (
    <DetailPanel heading={C.heading} headingId={headingId} lead={C.body} onClose={onClose}>
      <ul className="detail-list detail-list--removes">
        {removes.map((line) => (
          <li key={line}>
            <Icon name="close" size={16} />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <p className="detail-panel__body">
        {C.copyFirst}{" "}
        <button type="button" className="detail-panel__link" onClick={onExport}>
          {PROFILE_COPY.export.heading}
        </button>
      </p>
      <Notice tone="explain" label={PROFILE_PROVISIONAL.label}>
        {PROFILE_PROVISIONAL.delete}
      </Notice>
      <div className="detail-panel__actions">
        <Button variant="danger" fullWidth onClick={onDelete}>
          {C.confirm}
        </Button>
        {onKeep ? (
          <Button variant="secondary" fullWidth onClick={onKeep}>
            {C.keep}
          </Button>
        ) : null}
      </div>
    </DetailPanel>
  );
}

export default DeletionDetail;
