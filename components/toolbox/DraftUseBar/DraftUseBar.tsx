"use client";

import { useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { USE_COPY as C } from "@/mock/toolbox";
import type { ArtifactKind } from "@/mock/loop";

export interface DraftUseBarProps {
  kind: ArtifactKind;
  /** The artifact is marked ready: the button says so and stops offering. */
  ready?: boolean;
  onCopy: () => void;
  onExport?: (format: "PDF" | "Word") => void;
  onMarkReady: () => void;
  /** Once ready: she used it ("Mark published"). ExecHQ asks what came of it later. */
  onMarkUsed?: () => void;
  /** Leaves Mark ready out, where the page has its own (Concept 1's bar). */
  noStatus?: boolean;
  /** Opens having just copied (catalogue). */
  justCopied?: boolean;
  className?: string;
}

/**
 * What she does with a draft: copy it (worded for what she'll do with it,
 * "Copy to post on LinkedIn"), export it where that is in scope, and mark it
 * ready. ExecHQ never posts or sends anything; the words say so.
 */
export function DraftUseBar({ kind, ready = false, onCopy, onExport, onMarkReady, onMarkUsed, noStatus = false, justCopied = false, className }: DraftUseBarProps) {
  const [message, setMessage] = useState(justCopied ? C.copied : "");
  const exportable = C.exportable[kind] && onExport;
  return (
    <div className={["draft-use", className].filter(Boolean).join(" ")}>
      <div className="draft-use__buttons">
        <Button
          variant="secondary"
          onClick={() => {
            onCopy();
            setMessage(C.copied);
          }}
        >
          <Icon name="copy" size={16} />
          {C.copyFor[kind]}
        </Button>
        {exportable ? (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                onExport("PDF");
                setMessage(C.exported("PDF"));
              }}
            >
              <Icon name="download" size={16} />
              {C.exportPdf}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                onExport("Word");
                setMessage(C.exported("Word"));
              }}
            >
              <Icon name="download" size={16} />
              {C.exportWord}
            </Button>
          </>
        ) : null}
        {noStatus ? null : ready ? (
          onMarkUsed ? (
            <Button onClick={onMarkUsed}>{C.markUsed(kind)}</Button>
          ) : null
        ) : (
          <Button onClick={onMarkReady}>{C.markReady}</Button>
        )}
      </div>
      <output className="draft-use__message">{message || (ready && !noStatus ? C.ready : "")}</output>
    </div>
  );
}

export default DraftUseBar;
