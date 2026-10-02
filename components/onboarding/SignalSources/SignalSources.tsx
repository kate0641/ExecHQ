"use client";

import { Icon } from "@/components/primitives/Icon";
import { linkedInIn, type LinkedInUpload } from "@/flows/onboarding/shared";
import { LINKEDIN_UPLOAD, SIGNALS_C1 } from "@/mock/onboarding";

export interface SignalSourcesProps {
  /** The LinkedIn export: its row shows where the upload has got to. */
  linkedin: LinkedInUpload;
  /** LinkedIn's row opens the upload step, which the page holding this
   *  draws: four steps and a picker are too much for a sheet. */
  onOpenLinkedIn: () => void;
  className?: string;
}

/**
 * The signal sources as cards, each with its status. LinkedIn is the only
 * source, by decision on 2026-09-30: the personal website is no longer asked
 * for in onboarding.
 *
 * There is nothing to connect. The page's own button opens the upload step;
 * the card shows the file's progress once there is one: reading, then ready,
 * or that the steps were emailed for later, and opens the step again to
 * manage it. Nothing leaves the browser.
 */
export function SignalSources({ linkedin, onOpenLinkedIn, className }: SignalSourcesProps) {
  const copy = SIGNALS_C1;

  return (
    <div className={["signal-sources", className].filter(Boolean).join(" ")}>
      <ul className="signal-list">
        {copy.sources.map((item) => (
          <li key={item.id}>
            <span className="signal-list__mark" aria-hidden="true">
              {item.mark}
            </span>
            <div className="signal-list__text">
              <p className="signal-list__title">{item.title}</p>
              <p className="signal-list__detail">
                {linkedin.status === "ready"
                  ? item.imported
                  : linkedin.status === "reading"
                    ? LINKEDIN_UPLOAD.status.reading
                    : item.why}
              </p>
            </div>
            {linkedInIn(linkedin) || linkedin.status === "sent" ? (
              <button
                type="button"
                className="signal-list__status"
                data-source={item.id}
                onClick={onOpenLinkedIn}
                aria-label={`${item.title}: ${linkedInShort(linkedin)}. Manage`}
              >
                {linkedInShort(linkedin)}
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="signal-privacy">
        <Icon name="lock" size={16} />
        {copy.privacy}
      </p>
    </div>
  );
}

/** LinkedIn's status, as its row's short label says it. */
function linkedInShort(linkedin: LinkedInUpload): string {
  const short = LINKEDIN_UPLOAD.short;
  if (linkedin.status === "reading") return short.reading;
  if (linkedin.status === "ready") return short.ready;
  if (linkedin.status === "empty") return short.empty;
  return short.sent;
}

export default SignalSources;
