"use client";

import { useId, type ReactNode } from "react";
import { Icon } from "@/components/primitives/Icon";
import { FLOW_COPY as C } from "@/mock/toolbox";

export interface PinnedDraftProps {
  /** "First draft", or what the card shows before there is one. */
  label: string;
  /** The draft's first line, collapsed. Empty before there is a draft. */
  /** A line of the draft, collapsed. Her words and ExecHQ's wording keep
   *  their marks here too (a guardrail), so it may be marked-up text. */
  preview?: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  /** The draft itself, expanded (`DraftEditor`, which carries its own label). */
  children?: ReactNode;
  /** On the web the draft sits beside the interview, always open. */
  side?: boolean;
  className?: string;
}

/**
 * Concept 3's draft, pinned above the interview. A phone can't show the
 * conversation and the draft side by side, so the draft is a collapsed card
 * she opens with a tap, and closes to go back to the questions. It fills in as
 * she answers. On the web it sits beside the interview, open.
 */
export function PinnedDraft({ label, preview, expanded, onToggle, children, side = false, className }: PinnedDraftProps) {
  const bodyId = useId();
  const open = side || expanded;
  return (
    <section className={["pinned-draft", side ? "pinned-draft--side" : null, open ? "is-open" : null, className].filter(Boolean).join(" ")} aria-label={label}>
      {side ? (
        // Beside the interview, a written draft carries its own label.
        children ? null : <span className="pinned-draft__label">{label}</span>
      ) : (
        <button type="button" className="pinned-draft__toggle" aria-expanded={expanded} aria-controls={bodyId} onClick={onToggle}>
          <span className="pinned-draft__text">
            <span className="pinned-draft__label">{label}</span>
            <span className="pinned-draft__preview">{preview || C.pinnedEmpty}</span>
          </span>
          <span className="pinned-draft__action">
            {expanded ? C.hideDraft : C.showDraft}
            <Icon name="chevron" size={16} className="pinned-draft__chevron" />
          </span>
        </button>
      )}
      <div className="pinned-draft__body" id={bodyId} hidden={!open}>
        {children ?? <p className="pinned-draft__empty">{C.pinnedEmpty}</p>}
      </div>
    </section>
  );
}

export default PinnedDraft;
