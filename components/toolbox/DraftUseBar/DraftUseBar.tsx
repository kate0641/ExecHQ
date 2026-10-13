"use client";

import { useState } from "react";
import { DropdownMenu } from "@/components/form/DropdownMenu";
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
  /** Overrides whether this kind exports: an article exports, a post
   *  doesn't, though both are Thought Leadership. */
  exportable?: boolean;
  /** Puts PDF and Word in a "More" menu, where the bar has room for three
   *  buttons (Concept 1's fixed bar on a phone). */
  exportInMenu?: boolean;
  /** A line under the buttons that stays: "Exports as one page." */
  note?: string;
  /** Opens having just copied (catalogue). */
  justCopied?: boolean;
  className?: string;
}

/**
 * What she does with a draft: copy it (worded for what she'll do with it,
 * "Copy to post on LinkedIn"), export it where that is in scope, and mark it
 * ready. ExecHQ never posts or sends anything; the words say so.
 */
export function DraftUseBar({ kind, ready = false, onCopy, onExport, onMarkReady, onMarkUsed, noStatus = false, exportable: canExport, exportInMenu = false, note, justCopied = false, className }: DraftUseBarProps) {
  const [message, setMessage] = useState(justCopied ? C.copied : "");
  const exportable = (canExport ?? C.exportable[kind]) && onExport;
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
        {exportable && exportInMenu ? (
          <DropdownMenu
            label={C.more}
            icon="download"
            align="end"
            entries={(["PDF", "Word"] as const).map((format) => ({
              type: "item" as const,
              id: format,
              label: format === "PDF" ? C.exportPdf : C.exportWord,
              onSelect: () => {
                onExport(format);
                setMessage(C.exported(format));
              },
            }))}
          />
        ) : exportable ? (
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
      {note ? <p className="draft-use__note">{note}</p> : null}
      {/* Guardrail: she sends or posts it herself, and the bar says so. */}
      {kind === "pitch" || kind === "thought-leadership" ? <p className="draft-use__note">{C.neverPosts}</p> : null}
      <output className="draft-use__message">{message || (ready && !noStatus ? C.ready : "")}</output>
    </div>
  );
}

export default DraftUseBar;
