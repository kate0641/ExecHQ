"use client";

import { Suspense, useMemo, useState } from "react";
import { Sheet } from "@/components/layout/Sheet";
import { DraftToolBar } from "@/components/toolbox/DraftToolBar";
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
  // Before the first draft, on a phone or tablet, the questions are on the
  // page and there is no panel (13 Oct): the panel is for changing a draft.
  // On web the panel sits beside where the draft will be, up on the inputs.
  const panelFirst = web;
  const inlineInputs = !hasDraft && !panelFirst;
  // Before the first draft the panel is up on the inputs; after, it rests at
  // peek height, and on a phone or tablet its sheets wait to be opened.
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
    : // Every question on one page (13 Oct): the first one too, as chips;
      // the optional ones behind "Add more detail"; hints as placeholders;
      // what ExecHQ has as one "Built with" line above the button, which is
      // pinned to the foot on a phone or tablet.
      f.inputPanel(f.inputs, {
        collapseOptional: true,
        compact: true,
        builtWith: true,
        actionsClassName: inlineInputs ? "tool-flow__step-actions--pinned" : undefined,
      });

  // In this order (Kate, 13 Oct): what it was built from, changing it, its versions.
  const tabs = hasDraft
    ? [
        { id: "inputs", label: C.inputs, content: given },
        { id: "revise", label: C.revise, content: f.revision(() => setOpen(false)) },
        { id: "versions", label: C.versions, content: f.versions },
      ]
    : [{ id: "inputs", label: C.inputs, content: given }];
  // On a phone or tablet, once there is a draft (option B, 13 Oct): one bar
  // at the foot, the three as icons, each opening its own sheet, then the
  // one thing to do with it. Web keeps the panel beside the draft.
  const toolBar = hasDraft && !web;
  const sheetTab = toolBar && isOpen ? tabs.find((t) => t.id === active) : undefined;
  const ICONS = { inputs: "sliders", revise: "pencil", versions: "clock" } as const;

  return (
    <div className={["tool-flow", "tool-flow--workspace", web ? "tool-flow--split" : null, inlineInputs ? "tool-flow--pinned" : null].filter(Boolean).join(" ")}>
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
            {/* As in Concept 1 (13 Oct): Mark ready then "I've used this";
                Copy and the downloads are in the draft's Actions menu once it
                is ready; no lines under it. On a phone or tablet it rides in
                the tool bar. */}
            {toolBar ? (
              <DraftToolBar
                label={C.draftTools}
                tools={tabs.map((t) => ({
                  id: t.id,
                  label: t.label,
                  icon: ICONS[t.id as keyof typeof ICONS],
                  open: sheetTab?.id === t.id,
                  onOpen: () => {
                    setTab(t.id);
                    setOpen(true);
                  },
                }))}
              >
                {f.useBar({ noNotes: true, copyInMenu: true })}
              </DraftToolBar>
            ) : (
              f.useBar({ noNotes: true, copyInMenu: true, className: "draft-use--single" })
            )}
          </>
        ) : (
          <>
            {/* The start (13 Oct): the tool's name and what it makes; no
                drawing, no "when", no "You'll need", no "Goes with this".
                The questions follow, the first one with them. */}
            {f.useCase({ noStart: true, noGoesWith: true, noPicture: true, brief: true, noChoice: true })}
            {inlineInputs ? (
              <section className="tool-flow__inputs" aria-label={C.inputs}>
                {given}
              </section>
            ) : (
              <p className="tool-flow__placeholder">{C.pinnedEmpty}</p>
            )}
          </>
        )}
      </div>
      {inlineInputs || toolBar ? null : <WorkspacePanel tabs={tabs} active={active} onActive={setTab} open={isOpen} onOpenChange={setOpen} side={web} />}
      {toolBar ? (
        <Sheet open={Boolean(sheetTab)} onClose={() => setOpen(false)} label={sheetTab?.id === "inputs" ? C.builtFrom : (sheetTab?.label ?? "")} className="toolbox-sheet">
          {sheetTab ? (
            <>
              {/* Revise and Versions bring their own headings. */}
              {sheetTab.id === "inputs" ? <h2 className="toolbox-sheet__heading">{C.builtFrom}</h2> : null}
              {sheetTab.content}
            </>
          ) : null}
        </Sheet>
      ) : null}
    </div>
  );
}

/**
 * Toolbox flow, Concept 2 — Document workspace. Before the first draft, every
 * question is on one page under the use case (on web, in the panel beside
 * where the draft will be). Once there is a draft it has the whole screen,
 * and what it was built from, changing it and its versions are three icons
 * in one bar at the foot, each opening its own sheet, beside the one thing to
 * do with it (option B); on the web they are a panel beside the draft.
 */
export function ToolFlowConcept2() {
  return (
    <Suspense fallback={null}>
      <Workspace />
    </Suspense>
  );
}

export default ToolFlowConcept2;
