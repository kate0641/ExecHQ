import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { ToolIllustration } from "./ToolIllustration";

export const toolIllustrationStates = defineComponentStates({
  name: "ToolIllustration",
  group: "primitives",
  feature: "Playbook",
  status: "draft",
  flows: ["playbook"],
  description:
    "The tools' line drawings, one per tool, shaded, from the ILLUSTRATIONS tokens. An ID card for Positioning Builder, a microphone for Pitch Builder, a clipboard for Situation Brief, a lightbulb for Thought Leadership Builder. Placeholders: the finished drawings come from design.",
  component: ToolIllustration,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Every tool has its drawing.",
    filled: NOT_AN_INPUT,
    "long text": "A drawing has no text.",
  },
  variants: [
    { label: "Situation Brief — default", props: { tool: "situation-brief", size: 150 } },
    { label: "Positioning Builder", props: { tool: "positioning", size: 150 } },
    { label: "Pitch Builder", props: { tool: "pitch", size: 150 } },
    { label: "Thought Leadership Builder", props: { tool: "thought-leadership", size: 150 } },
  ],
});
