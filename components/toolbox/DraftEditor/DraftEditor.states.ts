import { createElement, Fragment } from "react";
import { defineComponentStates } from "@/components/types";
import { LoopStatus } from "@/components/loop/LoopStatus";
import { SourceLabel } from "@/components/briefing/SourceLabel";
import { createRecord } from "@/lib/loop";
import { TODAYS_READS } from "@/mock/briefing";
import { DRAFT_COPY, REVISION_COPY, TL_VERSIONS } from "@/mock/toolbox";
import { DraftEditor } from "./DraftEditor";

const noop = () => {};
const [v1, v2] = TL_VERSIONS;
const record = createRecord({ id: "tl-post", kind: "thought-leadership", title: "Post: planning season", name: "your post", on: "2026-10-05" });
const header = createElement(LoopStatus, { record });
const base = { label: DRAFT_COPY.label(1), sections: v1.sections, onEditSection: noop, onAnswer: noop, header, intro: DRAFT_COPY.intro };

export const draftEditorStates = defineComponentStates({
  name: "DraftEditor",
  group: "form controls",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "The draft, where she reads and changes it. Always a draft until she marks it ready. Her words and ExecHQ's wording look different (ExecHQ's is quieter with a dotted underline), with a key. What only she knows is a question in the text, never invented, gathered under the draft to answer. Any part can be rewritten in place; once she does, it is hers.",
  component: DraftEditor,
  notApplicable: {
    hover: "Its controls are Buttons and fields, which show their own states.",
    focus: "Its controls are Buttons and fields, which show their own states.",
    active: "Its controls are Buttons and fields, which show their own states.",
    empty: "A draft only exists once it is written; an emptied section shows the error instead.",
  },
  variants: [
    { label: "First draft, from today's Briefing — default", props: { ...base, header: createElement(Fragment, null, header, createElement(SourceLabel, { read: TODAYS_READS[0], size: "compact" })) } },
    { label: "A question answered — filled", props: { ...base, answers: { "What has the workstream changed for those teams?": "Three teams now plan from one calendar instead of three." } } },
    { label: "A section rewritten by her", props: { ...base, edits: { hooks: "New scope is written into the plan. Be in the room when it is." } } },
    { label: "Editing a section", props: { ...base, preview: { editing: "post" } } },
    { label: "Saved empty — error", props: { ...base, preview: { editing: "post", error: true } } },
    { label: "Revising — loading, edit unavailable", props: { ...base, label: DRAFT_COPY.label(2), sections: v2.sections, revising: REVISION_COPY.revising }, states: ["disabled"] },
    { label: "Version 2, long text wraps", props: { ...base, label: DRAFT_COPY.label(2), sections: v2.sections, intro: undefined } },
  ],
});
