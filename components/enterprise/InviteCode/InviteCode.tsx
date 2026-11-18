"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { ENTERPRISE_COPY } from "@/mock/enterprise";

const C = ENTERPRISE_COPY.code;

type Asking = "regenerate" | "close" | null;

export interface InviteCodeProps {
  code: string;
  joined: number;
  expectedSize: number;
  /** Still taking new joiners. */
  open: boolean;
  onRegenerate: () => void;
  onClose: () => void;
  /** `panel` stands on its own; `compact` fits a margin or the foot of a page. */
  layout?: "panel" | "compact";
  /** Leaves out "38 of 50 joined" where the page already shows it. */
  hideJoined?: boolean;
  /** Shows the line that says a new code was just made. */
  justRegenerated?: boolean;
  /** Catalogue only: opens on a confirmation, or as just copied. */
  startAsking?: Exclude<Asking, null>;
  startCopied?: boolean;
  className?: string;
}

/**
 * The cohort's one shared code, and the little a sponsor can do with it: copy
 * it, make a new one, close the cohort to new joiners. How many joined is a
 * count, never a list: there are no per-person codes, so the sponsor cannot
 * learn who joined. Both changes ask once, saying what happens to people
 * already in.
 */
export function InviteCode({
  code,
  joined,
  expectedSize,
  open,
  onRegenerate,
  onClose,
  layout = "panel",
  hideJoined,
  justRegenerated = false,
  startAsking,
  startCopied = false,
  className,
}: InviteCodeProps) {
  const [asking, setAsking] = useState<Asking>(startAsking ?? null);
  const [copied, setCopied] = useState(startCopied);
  const headingId = useId();
  const askRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const wasAsking = useRef(asking !== null);

  // The button that opened a question, or answered it, leaves the page, so
  // focus goes to the question, then back to the actions.
  useEffect(() => {
    if (asking && !wasAsking.current) askRef.current?.focus();
    if (!asking && wasAsking.current) actionsRef.current?.querySelector("button")?.focus();
    wasAsking.current = asking !== null;
  }, [asking]);

  function copy() {
    // Clipboard access can be refused; the code is on screen either way.
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
  }

  const classes = ["invite-code", `invite-code--${layout}`, open ? null : "is-closed", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} aria-labelledby={headingId}>
      <h3 className="invite-code__heading" id={headingId}>
        {C.heading}
      </h3>

      {open ? (
        <>
          <p className="invite-code__code">{code}</p>
          <p className="invite-code__explain">{C.explain}</p>
        </>
      ) : (
        <p className="invite-code__closed">
          <Icon name="lock" size={16} />
          {C.closed}
        </p>
      )}

      {hideJoined ? null : <p className="invite-code__joined">{C.joined(joined, expectedSize)}</p>}

      {asking ? (
        <div className="invite-code__ask">
          <p className="invite-code__ask-heading" ref={askRef} tabIndex={-1}>
            {asking === "regenerate" ? C.regenerateAsk : C.closeAsk}
          </p>
          <p className="invite-code__ask-body">{asking === "regenerate" ? C.regenerateBody : C.closeBody}</p>
          <div className="invite-code__actions">
            <Button
              variant={asking === "close" ? "danger" : "primary"}
              size="sm"
              onClick={() => {
                setAsking(null);
                setCopied(false);
                if (asking === "regenerate") onRegenerate();
                else onClose();
              }}
            >
              {asking === "regenerate" ? C.regenerateConfirm : C.closeConfirm}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setAsking(null)}>
              {C.cancel}
            </Button>
          </div>
        </div>
      ) : open ? (
        <div className="invite-code__actions" ref={actionsRef}>
          <Button variant="primary" size="sm" onClick={copy}>
            <Icon name={copied ? "check" : "copy"} size={16} />
            {copied ? C.copied : C.copy}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setAsking("regenerate")}>
            <Icon name="refresh" size={16} />
            {C.regenerate}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setAsking("close")}>
            {C.close}
          </Button>
        </div>
      ) : null}

      <output className="u-visually-hidden">{copied ? C.copied : justRegenerated ? C.madeNew : ""}</output>
      {justRegenerated && open && !asking ? <p className="invite-code__note">{C.madeNew}</p> : null}
    </section>
  );
}

export default InviteCode;
