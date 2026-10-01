import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { PROFILE_COPY } from "@/mock/profile";
import { DetailPanel } from "../DetailPanel";

export interface DeletionDetailProps {
  email: string;
  /** How many drafts she has. */
  drafts: number;
  onDelete: () => void;
  /** Keeps the account. In a sheet, closes it. */
  onKeep?: () => void;
  /** Starts the download of her data, so she can take a copy first. */
  onExport: () => void;
  /** The download is under way: the link says so. */
  downloading?: boolean;
  onClose?: () => void;
  headingId?: string;
}

const C = PROFILE_COPY.delete;

/**
 * Deleting the account: exactly what is removed, read from the account as
 * it is now, with no guilt language and a way to take a copy first. The copy
 * assumes deletion is immediate.
 */
export function DeletionDetail({
  email,
  drafts,
  onDelete,
  onKeep,
  onExport,
  downloading = false,
  onClose,
  headingId = "delete-heading",
}: DeletionDetailProps) {
  const removes = [
    C.removes.account(email),
    C.removes.answers,
    ...(drafts ? [C.removes.drafts(drafts)] : []),
    C.removes.loop,
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
        <button
          type="button"
          className="detail-panel__link"
          onClick={onExport}
          aria-busy={downloading ? "true" : undefined}
        >
          {downloading ? PROFILE_COPY.rows.exportWorking : PROFILE_COPY.rows.export}
        </button>
      </p>
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
