import type { ReactNode } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface DetailPanelProps {
  heading: string;
  headingId?: string;
  /** A line under the heading. */
  lead?: ReactNode;
  /** Shows a close button: in a sheet. The web pane has none. */
  onClose?: () => void;
  closeLabel?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * The frame every profile detail sits in, whether it rises as a sheet on
 * mobile and tablet or fills the detail pane on web: a heading, an optional
 * close, and the detail itself.
 */
export function DetailPanel({
  heading,
  headingId,
  lead,
  onClose,
  closeLabel = "Close",
  children,
  className,
}: DetailPanelProps) {
  return (
    <div className={["detail-panel", className].filter(Boolean).join(" ")}>
      <div className="detail-panel__head">
        <h2 className="detail-panel__heading" id={headingId} tabIndex={-1}>
          {heading}
        </h2>
        {onClose ? (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label={closeLabel} className="detail-panel__close">
            <Icon name="close" size={16} />
          </Button>
        ) : null}
      </div>
      {lead ? <p className="detail-panel__lead">{lead}</p> : null}
      {children}
    </div>
  );
}

export default DetailPanel;
