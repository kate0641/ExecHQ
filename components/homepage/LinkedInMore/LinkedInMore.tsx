"use client";

import { useId, useState } from "react";
import { Drawer } from "@/components/layout/Drawer";
import { Button } from "@/components/primitives/Button";
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
  /** Catalogue only: opens the upload, in place, to show what is inside. */
  demoOpen?: boolean;
  className?: string;
}

/**
 * Under the numbers she types, the way to add her LinkedIn analytics export:
 * the same upload the onboarding offers, kept behind a text link that opens it
 * in a drawer so the form stays short. Before a file is in it is an invitation,
 * optional and always for later too. Once one is in it says what she has, and
 * that another upload replaces it, and the link says "newer". LinkedIn has no
 * connection to make: she exports a spreadsheet and brings it here, and the
 * file is never read or sent in the prototype.
 */
export function LinkedInMore({ status, fileName, email, onChoose, onSendSteps, demoOpen, className }: LinkedInMoreProps) {
  const id = useId();
  const [opened, setOpened] = useState(false);
  const open = opened || Boolean(demoOpen);
  const reading = status === "reading";
  const added = status === "ready" || status === "empty";
  const title = reading || added ? C.titleAdded : C.title;
  const file = fileName ?? "";
  const body = reading ? C.bodyReading : status === "ready" ? C.bodyReady(file) : status === "empty" ? C.bodyEmpty(file) : C.body;
  return (
    <section className={["linkedin-more", className].filter(Boolean).join(" ")} aria-labelledby={id}>
      <h3 className="linkedin-more__title" id={id}>
        {title}
      </h3>
      <p className="linkedin-more__body">{body}</p>
      {reading ? null : (
        <button type="button" className="link link--standalone linkedin-more__open" onClick={() => setOpened(true)}>
          {added ? C.openAgain : C.open}
        </button>
      )}
      <Drawer open={open} onClose={() => setOpened(false)} label={title} inline={demoOpen}>
        <div className="linkedin-more__drawer">
          <h2 className="linkedin-more__drawer-title">{title}</h2>
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
