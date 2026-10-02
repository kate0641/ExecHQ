"use client";

import { useId, useRef } from "react";
import { LinkedInSteps } from "@/components/onboarding/LinkedInSteps";
import { Notice } from "@/components/onboarding/Notice";
import { Button } from "@/components/primitives/Button";
import type { LinkedInStatus } from "@/flows/onboarding/shared";
import { LINKEDIN_UPLOAD } from "@/mock/onboarding";

export interface LinkedInUploadProps {
  status: LinkedInStatus;
  fileName: string | null;
  /** Where "Email me these steps" sends them. */
  email?: string | null;
  /** A file was picked. Only its name is passed on: nothing is read. */
  onChoose: (fileName: string) => void;
  onSendSteps: () => void;
  className?: string;
}

/**
 * The LinkedIn analytics upload, by decision on 2026-09-28. LinkedIn has no
 * connection to make: the user exports a spreadsheet from their analytics
 * page and brings it here. So this is the steps, a real file picker, and the
 * file's status once it is in.
 *
 * Reading happens in the background, so the page holding this never waits on
 * it: the moment a file is chosen, the user can carry on. Exporting is a
 * desktop job, so someone on their phone can email the steps to themselves.
 *
 * Shared by Concepts 1 and 3. In the prototype the picker is real, but the
 * file is never read or sent: only its name is kept, and "reading" is a timer.
 */
export function LinkedInUpload({
  status,
  fileName,
  email,
  onChoose,
  onSendSteps,
  className,
}: LinkedInUploadProps) {
  const copy = LINKEDIN_UPLOAD;
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const hintId = useId();
  const hasFile = status === "reading" || status === "ready" || status === "empty";

  const picker = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      className="u-visually-hidden"
      accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      tabIndex={-1}
      aria-hidden="true"
      onChange={(event) => {
        const file = event.target.files?.[0];
        // Cleared, so choosing the same file again still counts as a choice.
        event.target.value = "";
        if (file) onChoose(file.name);
      }}
    />
  );
  const choose = () => inputRef.current?.click();

  return (
    <div className={["linkedin-upload", className].filter(Boolean).join(" ")}>
      {picker}

      {hasFile ? (
        <div className="linkedin-file">
          <span className="linkedin-file__mark" aria-hidden="true">
            XLSX
          </span>
          <div className="linkedin-file__text">
            <p className="linkedin-file__name">{fileName}</p>
            <output className="linkedin-file__status">
              {status === "reading" ? copy.status.reading : status === "empty" ? copy.status.empty : copy.status.ready}
            </output>
            {status === "reading" ? <span className="linkedin-file__bar" aria-hidden="true" /> : null}
          </div>
        </div>
      ) : (
        <>
          <LinkedInSteps label={copy.stepsLabel} steps={copy.steps} linkNote={copy.linkNote} />

          <details className="linkedin-upload__help">
            <summary>{copy.noExport}</summary>
            <p>{copy.noExportBody}</p>
          </details>

          {status === "wrong-file" || status === "failed" ? (
            <Notice tone="problem" live>
              {status === "wrong-file" ? copy.status.wrongFile : copy.status.failed}
            </Notice>
          ) : null}

          <div className="linkedin-upload__pick">
            <Button variant="primary" fullWidth onClick={choose} aria-describedby={hintId}>
              {status === "wrong-file" || status === "failed" ? copy.tryAgain : copy.upload}
            </Button>
            <p className="linkedin-upload__hint" id={hintId}>
              {copy.uploadHint}
            </p>
          </div>

          {status === "sent" ? (
            <Notice tone="info" live>
              {copy.status.sent(email || "your email")}
            </Notice>
          ) : (
            <Button variant="ghost" size="sm" onClick={onSendSteps}>
              {copy.phone}
            </Button>
          )}
        </>
      )}

      {hasFile ? (
        <Button variant="ghost" size="sm" onClick={choose}>
          {copy.chooseAgain}
        </Button>
      ) : null}
    </div>
  );
}

export default LinkedInUpload;
