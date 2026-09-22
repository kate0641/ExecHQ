"use client";

import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import type { ConnectionState } from "@/flows/onboarding/shared";
import type { ConnectOfferSpec } from "@/mock/onboarding";

export interface ConnectOfferProps {
  offer: ConnectOfferSpec;
  state?: ConnectionState;
  onConnect?: () => void;
  onDecline?: () => void;
  onRetry?: () => void;
  className?: string;
}

/**
 * An optional connection, offered only once the artifact already exists.
 *
 * Declining is a designed outcome, not a dead end: the declined state says the
 * offer stays available and says nothing about what was lost, because nothing
 * was. The PRD is explicit that no path may produce a visibly worse first
 * artifact for declining, and copy that mourns the decline would break that as
 * surely as a degraded draft would.
 *
 * Connect and decline sit at the same size for the same reason the skip path
 * does in StepActions.
 */
export function ConnectOffer({
  offer,
  state = "offered",
  onConnect,
  onDecline,
  onRetry,
  className,
}: ConnectOfferProps) {
  return (
    <div
      className={["connect", `connect--${state}`, className].filter(Boolean).join(" ")}
    >
      <div className="connect__head">
        <span className="connect__mark">
          <Icon name="link" size={18} />
        </span>
        <div className="connect__text">
          <p className="connect__title">{offer.title}</p>
          <p className="connect__body">{offer.body}</p>
        </div>
      </div>

      {state === "offered" ? (
        <div className="connect__actions">
          <Button variant="secondary" size="sm" onClick={onConnect}>
            {offer.connectLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={onDecline}>
            {offer.declineLabel}
          </Button>
        </div>
      ) : null}

      {state === "connected" ? (
        <output className="connect__status">
          <Icon name="check" size={15} />
          Added. Change it whenever it changes.
        </output>
      ) : null}

      {state === "declined" ? (
        <output className="connect__status">
          Not added. It stays here if you want it later.
        </output>
      ) : null}

      {state === "failed" ? (
        <div className="connect__actions">
          <output className="connect__status connect__status--problem">
            That did not connect. Nothing was sent or saved.
          </output>
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default ConnectOffer;
