"use client";

import { Suspense, useState } from "react";
import { WorkspacePanel } from "@/components/toolbox/WorkspacePanel";
import { useViewport } from "@/lib/viewport-context";
import { FLOW_COPY as C, SOURCE_LABELS } from "@/mock/toolbox";
import { useToolFlow } from "../useToolFlow";

function Workspace() {
  const f = useToolFlow("concept-2");
  const web = useViewport().viewport === "web";
  const [open, setOpen] = useState<boolean | null>(null);
  const [tab, setTab] = useState<string | null>(null);

  if (f.later) return f.laterNote;

  const hasDraft = Boolean(f.draft && f.version);
  // Before the first draft the panel is up on the inputs; after, it rests at peek height.
  const isOpen = open ?? !hasDraft;
  const active = tab ?? (hasDraft ? "revise" : "inputs");

  const given = f.draft
    ? (
        <dl className="tool-flow__given">
          {f.inputs
            .filter((i) => f.draft?.inputs[i.id])
            .map((i) => (
              <div key={i.id} className="tool-flow__given-row">
                <dt>{i.label}</dt>
                <dd>
                  {f.draft?.inputs[i.id]}
                  {i.source ? <span className="tool-flow__given-source">{SOURCE_LABELS[i.source]}</span> : null}
                </dd>
              </div>
            ))}
        </dl>
      )
    : f.inputPanel();

  const tabs = hasDraft
    ? [
        { id: "revise", label: C.revise, content: f.revision(() => setOpen(false)) },
        { id: "versions", label: C.versions, content: f.versions },
        { id: "inputs", label: C.inputs, content: given },
      ]
    : [{ id: "inputs", label: C.inputs, content: given }];

  return (
    <div className={["tool-flow", "tool-flow--workspace", web ? "tool-flow--split" : null].filter(Boolean).join(" ")}>
      <div className="tool-flow__document">
        {f.header}
        {hasDraft ? (
          <>
            {f.source}
            {f.draftEditor}
            {f.useBar()}
          </>
        ) : (
          <>
            {f.useCase}
            <p className="tool-flow__placeholder">{C.pinnedEmpty}</p>
          </>
        )}
      </div>
      <WorkspacePanel tabs={tabs} active={active} onActive={setTab} open={isOpen} onOpenChange={setOpen} side={web} />
    </div>
  );
}

/**
 * Toolbox flow, Concept 2 — Document workspace. The draft has the whole
 * screen. Inputs, changes and versions live in a panel pulled up from a
 * peek-height bar, up on the inputs until the first draft exists and resting
 * at the bar after; on the web the panel sits beside the draft.
 */
export function ToolFlowConcept2() {
  return (
    <Suspense fallback={null}>
      <Workspace />
    </Suspense>
  );
}

export default ToolFlowConcept2;
