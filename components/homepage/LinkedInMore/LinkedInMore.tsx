"use client";

import { useId } from "react";
import { LinkedInUpload } from "@/components/onboarding/LinkedInUpload";
import type { LinkedInStatus } from "@/flows/onboarding/shared";
import { LINKEDIN_MORE_COPY as C } from "@/mock/accounts-stub";

export interface LinkedInMoreProps {
  status: LinkedInStatus;
  fileName: string | null;
  email?: string | null;
  /** A file was picked. Only its name is passed on: nothing is read. */
  onChoose: (fileName: string) => void;
  onSendSteps: () => void;
  /** Catalogue only: opens the upload to show what is inside. */
  demoOpen?: boolean;
  className?: string;
}

/**
 * An invitation, under the numbers she types, to add more LinkedIn data: the
 * same analytics upload the onboarding offers, kept behind a line so the
 * form stays short. Optional and always for later too. LinkedIn has no
 * connection to make: she exports a spreadsheet and brings it here, and the
 * file is never read or sent in the prototype.
 */
export function LinkedInMore({ status, fileName, email, onChoose, onSendSteps, demoOpen, className }: LinkedInMoreProps) {
  const id = useId();
  const open = demoOpen || status !== "none";
  return (
    <section className={["linkedin-more", className].filter(Boolean).join(" ")} aria-labelledby={id}>
      <h3 className="linkedin-more__title" id={id}>
        {C.title}
      </h3>
      <p className="linkedin-more__body">{C.body}</p>
      <details className="linkedin-more__details" open={open || undefined}>
        <summary>{C.open}</summary>
        <LinkedInUpload status={status} fileName={fileName} email={email} onChoose={onChoose} onSendSteps={onSendSteps} />
      </details>
    </section>
  );
}

export default LinkedInMore;
