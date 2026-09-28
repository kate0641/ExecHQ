import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE } from "@/components/not-applicable";
import { DRAFT_C1, PLAN_TEMPLATES, firstDraftFor } from "@/mock/onboarding";
import { StoryDraft } from "./StoryDraft";

const noop = () => {};
const direction = "C-suite in 3 years";
const answers = { "scope-kind": "a-seat-at-the-top-table", "scope-block": "nobody-sees-my-work" };
const none = { role: "", own: "", result: "" };
const sharpened = { role: "VP of Marketing", own: "brand and demand", result: "grew pipeline 40% in a year" };

const base = {
  label: DRAFT_C1.label,
  text: firstDraftFor(direction, answers, none),
  onSaveEdit: noop,
  usesLabel: DRAFT_C1.usesLabel,
  uses: PLAN_TEMPLATES[0].uses ?? [],
};

export const storyDraftStates = defineComponentStates({
  name: "StoryDraft",
  group: "cards",
  status: "draft",
  flows: ["onboarding"],
  description:
    "The story's first draft in onboarding: one paragraph written from what the user has said, editable in place, with ideas for where to use it. Replaces the builder's four outputs until the user asks for more.",
  component: StoryDraft,
  notApplicable: {
    ...CONTROLS_INSIDE,
    loading:
      "Drawn once the draft exists. The wait before it is GeneratingState's, on the page that holds it.",
    empty: "There is always a draft: it always has the direction, which onboarding requires.",
  },
  variants: [
    { label: "Default", props: base },
    {
      label: "Every question skipped",
      description: "The direction alone: one sentence, and still true.",
      props: { ...base, text: firstDraftFor(direction, {}, none) },
    },
    {
      label: "Sharpened",
      description: "Role, scope and a result added: each one adds a sentence.",
      props: { ...base, label: DRAFT_C1.sharpenedLabel, text: firstDraftFor(direction, answers, sharpened) },
    },
    {
      label: "Long typed direction, wraps",
      props: {
        ...base,
        text: firstDraftFor(
          "I want to move from running campaigns to leading a broader marketing organisation, ideally within the next two years",
          {},
          sharpened
        ),
      },
    },
    {
      label: "Editing, filled with the draft",
      props: { ...base, preview: "editing" as const },
    },
    {
      label: "Saved empty, error",
      description: "An edit cleared to nothing is not saved over the draft.",
      props: { ...base, preview: "error" as const },
    },
  ],
});
