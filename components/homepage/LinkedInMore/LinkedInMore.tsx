"use client";

import { useId, useState } from "react";
import { Drawer } from "@/components/layout/Drawer";
import { Button } from "@/components/primitives/Button";
import { LinkedInUpload } from "@/components/onboarding/LinkedInUpload";
import type { LinkedInStatus } from "@/flows/onboarding/shared";
import { LINKEDIN_MORE_COPY as C } from "@/mock/accounts-stub";
import { LINKEDIN_UPLOAD } from "@/mock/onboarding";

export interface LinkedInMoreProps {
  status: LinkedInStatus;
  fileName: string | null;
  email?: string | null;
  /** A file was picked. Only its name is passed on: nothing is read. */
  onChoose: (fileName: string) => void;
  onSendSteps: () => void;
  /** Catalogue only: opens the upload, in place, to show what is inside. */
  demoOpen?: boolean;
  className?: string;
}

/**
 * An invitation, under the numbers she types, to add more LinkedIn data: the
 * same analytics upload the onboarding offers, kept behind a text link that
 * opens it in a drawer so the form stays short. Optional and always for later too. LinkedIn has no
 * connection to make: she exports a spreadsheet and brings it here, and the
 * file is never read or sent in the prototype.
 */
export function LinkedInMore({ status, fileName, email, onChoose, onSendSteps, demoOpen, className }: LinkedInMoreProps) {
  const id = useId();
  const [opened, setOpened] = useState(false);
  const open = opened || Boolean(demoOpen);
  const hasFile = status === "reading" || status === "ready" || status === "empty";
  const fileStatus = status === "reading" ? LINKEDIN_UPLOAD.status.reading : status === "empty" ? LINKEDIN_UPLOAD.status.empty : LINKEDIN_UPLOAD.status.ready;
  return (
    <section className={["linkedin-more", className].filter(Boolean).join(" ")} aria-labelledby={id}>
      <h3 className="linkedin-more__title" id={id}>
        {C.title}
      </h3>
      <p className="linkedin-more__body">{C.body}</p>
      <button type="button" className="link link--standalone linkedin-more__open" onClick={() => setOpened(true)}>
        {C.open}
      </button>
      {hasFile && !open ? (
        <output className="linkedin-more__file">
          {fileName} · {fileStatus}
        </output>
      ) : null}
      <Drawer open={open} onClose={() => setOpened(false)} label={C.title} inline={demoOpen}>
        <div className="linkedin-more__drawer">
          <h2 className="linkedin-more__drawer-title">{C.title}</h2>
          <LinkedInUpload status={status} fileName={fileName} email={email} onChoose={onChoose} onSendSteps={onSendSteps} />
          <Button variant="ghost" onClick={() => setOpened(false)}>
            {C.close}
          </Button>
        </div>
      </Drawer>
    </section>
  );
}

export default LinkedInMore;
