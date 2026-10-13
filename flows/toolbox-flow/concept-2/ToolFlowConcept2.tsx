"use client";

import { Suspense, useMemo, useState } from "react";
import { WorkspacePanel } from "@/components/toolbox/WorkspacePanel";
import { useStepNav } from "@/lib/step-nav";
import { useViewport } from "@/lib/viewport-context";
import { FLOW_COPY as C, SOURCE_LABELS, STEP_BAR_COPY } from "@/mock/toolbox";
import { draftSteps, useToolFlow } from "../useToolFlow";

function Workspace() {
  const f = useToolFlow("concept-2");
  const web = useViewport().viewport === "web";
  const [open, setOpen] = useState<boolean | null>(null);
  const [tab, setTab] = useState<string | null>(null);
  // Once it is ready the draft shows as the page it will copy and download
  // (option C, 13 Oct); changing it brings the working draft back.
  const [changing, setChanging] = useState(false);

  const hasDraft = Boolean(f.draft && f.version);
  // Before the first draft the panel is up on the inputs; after, it rests at peek height.
  const isOpen = open ?? !hasDraft;
  const active = tab ?? (hasDraft ? "revise" : "inputs");

  // The step bar: the start, with the inputs beside it, then the draft on.
  const steps = useMemo(() => [{ id: "start", label: STEP_BAR_COPY.start }, ...draftSteps(f.kind, true)], [f.kind]);
  const current = !hasDraft ? "start" : isOpen && (active === "revise" || active === "versions") ? active : f.stage;
  useStepNav(steps, current, (id) => {
    if (id === "start") {
      f.jumpBefore([], f.inputs.filter((input) => !(input.source && input.kind !== "choice")));
      setOpen(null);
      setTab(null);
      return;
    }
    f.jumpAfter(id === "ready" || id === "used" ? id : "draft");
    setOpen(id === "revise" || id === "versions");
    setTab(id === "versions" ? "versions" : "revise");
  });

  if (f.later) return f.laterNote;

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
    : // The first question is on the use case screen above, so the panel leaves it out.
      // Only what she must answer shows first; the optional questions wait
      // behind "Add more detail", so the panel never reads as a form.
      // Concept 1's cleanup (13 Oct): one instruction line, compact rows for
      // what ExecHQ has, no note under the button.
      f.inputPanel(f.notFirst(f.inputs), { collapseOptional: true, compact: true });

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
            {f.outcome}
            {f.source}
            {f.isReady && !changing ? f.draftAs("page", () => setChanging(true)) : f.draftEditor}
            {f.isReady && changing ? (
              <button type="button" className="tool-flow__done-changing link" onClick={() => setChanging(false)}>
                {C.backToPage}
              </button>
            ) : null}
            {/* As in Concept 1 (13 Oct): one button across the row, Mark ready
                then "I've used this"; Copy and the downloads are in the
                draft's Actions menu once it is ready; no lines under it.
                Revise stays in the panel. */}
            {f.useBar({ noNotes: true, copyInMenu: true, className: "draft-use--single" })}
          </>
        ) : (
          <>
            {/* As in Concept 1 (13 Oct): no "Goes with this", and tapping an
                answer to the first question starts: the panel comes up on
                the rest. */}
            {f.useCase({
              choiceStarts: true,
              noGoesWith: true,
              onStart: () => {
                setTab("inputs");
                setOpen(true);
              },
            })}
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
