"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import type { LibraryItem } from "@/lib/library";
import { ARTIFACT_KINDS } from "@/mock/loop";
import { LIBRARY_COPY, USE_COPY } from "@/mock/playbook";

const C = LIBRARY_COPY.actions;
const D = LIBRARY_COPY.deleteConfirm;

export interface ArtifactActionsProps {
  item: LibraryItem;
  openHref: string;
  /** A new draft made from this one. */
  reuseHref: string;
  onMarkReady: () => void;
  onMarkUsed: () => void;
  onExport: (format: "PDF" | "Word") => void;
  onClose: () => void;
  onDelete: () => void;
  onDismiss?: () => void;
  /** Opens on the delete question (catalogue). */
  startConfirming?: boolean;
  headingId?: string;
  className?: string;
}

/**
 * Everything she can do with an artifact from the library: open it, use it
 * as the start of a new one, move its status on, export it, close it, or
 * delete it. Deleting asks once, and says exactly what else goes with it: its
 * record in ExecHQ, and any items it put on her Signal Picture.
 */
export function ArtifactActions({
  item,
  openHref,
  reuseHref,
  onMarkReady,
  onMarkUsed,
  onExport,
  onClose,
  onDelete,
  onDismiss,
  startConfirming = false,
  headingId,
  className,
}: ArtifactActionsProps) {
  const [confirming, setConfirming] = useState(startConfirming);
  const box = useRef<HTMLDivElement>(null);
  const moved = useRef(false);
  // The list and the question swap places, so focus follows to the heading.
  useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    box.current?.querySelector<HTMLElement>("h2")?.focus();
  }, [confirming]);
  const confirm = (next: boolean) => {
    moved.current = true;
    setConfirming(next);
  };
  const { record } = item;
  const state = record.state;

  if (confirming) {
    return (
      <div className={["artifact-actions", "artifact-actions--confirm", className].filter(Boolean).join(" ")} ref={box}>
        <h2 className="artifact-actions__heading" id={headingId} tabIndex={-1}>
          {D.heading(record.title)}
        </h2>
        <p className="artifact-actions__body">{D.body(item.signalItems)}</p>
        <div className="artifact-actions__buttons">
          <Button variant="danger" fullWidth onClick={onDelete}>
            {D.confirm}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => confirm(false)}>
            {D.keep}
          </Button>
        </div>
      </div>
    );
  }

  const usedLabel = ARTIFACT_KINDS[record.kind].usedLabel;
  return (
    <div className={["artifact-actions", className].filter(Boolean).join(" ")} ref={box}>
      <div className="artifact-actions__head">
        <h2 className="artifact-actions__heading" id={headingId} tabIndex={-1}>
          {record.title}
        </h2>
        {onDismiss ? (
          <Button variant="ghost" size="sm" onClick={onDismiss} aria-label="Close">
            <Icon name="close" size={16} />
          </Button>
        ) : null}
      </div>
      <LoopStatus record={record} />
      <ul className="artifact-actions__list">
        <li>
          <Link href={openHref} className="artifact-actions__item">
            <Icon name="draft" size={16} />
            {C.open}
          </Link>
        </li>
        <li>
          <Link href={reuseHref} className="artifact-actions__item">
            <Icon name="copy" size={16} />
            <span className="artifact-actions__text">
              {C.reuse}
              <span className="artifact-actions__hint">{C.reuseHint}</span>
            </span>
          </Link>
        </li>
        {state === "drafted" || state === "in-progress" ? (
          <li>
            <button type="button" className="artifact-actions__item" onClick={onMarkReady}>
              <Icon name="check" size={16} />
              {USE_COPY.markReady}
            </button>
          </li>
        ) : null}
        {state === "ready" ? (
          <li>
            <button type="button" className="artifact-actions__item" onClick={onMarkUsed}>
              <Icon name="send" size={16} />
              {`Mark ${usedLabel.toLowerCase()}`}
            </button>
          </li>
        ) : null}
        {USE_COPY.exportable[record.kind] ? (
          <>
            <li>
              <button type="button" className="artifact-actions__item" onClick={() => onExport("PDF")}>
                <Icon name="download" size={16} />
                {USE_COPY.exportPdf}
              </button>
            </li>
            <li>
              <button type="button" className="artifact-actions__item" onClick={() => onExport("Word")}>
                <Icon name="download" size={16} />
                {USE_COPY.exportWord}
              </button>
            </li>
          </>
        ) : null}
        {state !== "closed" ? (
          <li>
            <button type="button" className="artifact-actions__item" onClick={onClose}>
              <Icon name="minus" size={16} />
              <span className="artifact-actions__text">
                {C.close}
                <span className="artifact-actions__hint">{C.closeHint}</span>
              </span>
            </button>
          </li>
        ) : null}
        <li>
          <button type="button" className="artifact-actions__item artifact-actions__item--danger" onClick={() => confirm(true)}>
            <Icon name="trash" size={16} />
            {C.delete}
          </button>
        </li>
      </ul>
    </div>
  );
}

export default ArtifactActions;
