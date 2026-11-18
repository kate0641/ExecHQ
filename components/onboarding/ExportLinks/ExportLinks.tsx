"use client";

import { useState } from "react";

export interface ExportAction {
  label: string;
  /** What is said once it has been done. */
  done: string;
}

export interface ExportLinksProps {
  actions: readonly ExportAction[];
  className?: string;
}

/**
 * Copy, Download and Email, as quiet links, each taking every output at once.
 * Nothing in this prototype leaves the browser, so each one confirms what it
 * would have done and stops. The confirmation is announced politely.
 */
export function ExportLinks({ actions, className }: ExportLinksProps) {
  const [done, setDone] = useState<string | null>(null);
  return (
    <div className={["builder-export", className].filter(Boolean).join(" ")}>
      <div className="builder-export__links">
        {actions.map((action) => (
          <button key={action.label} type="button" onClick={() => setDone(action.done)}>
            {action.label}
          </button>
        ))}
      </div>
      <output className="builder-export__status">{done}</output>
    </div>
  );
}

export default ExportLinks;
