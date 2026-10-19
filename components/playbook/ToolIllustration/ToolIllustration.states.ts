import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { ToolIllustration } from "./ToolIllustration";

export const toolIllustrationStates = defineComponentStates({
  name: "ToolIllustration",
  group: "primitives",
  status: "draft",
  flows: ["playbook"],
  description:
    "The tools' line drawings, one per tool at three levels of detail (detailed for the lead card, simple for a tool card, icon for small places), from the ILLUSTRATIONS tokens. An ID card for Positioning Builder, a microphone for Pitch Builder, a clipboard for Situation Brief, a lightbulb for Thought Leadership Builder. Placeholders: the finished drawings come from design.",
  component: ToolIllustration,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Every tool has its drawing.",
    filled: NOT_AN_INPUT,
    "long text": "A drawing has no text.",
  },
  variants: [
    { label: "Situation Brief, detailed — default", props: { tool: "situation-brief", level: "detailed", size: 150 } },
    { label: "Situation Brief, simple", props: { tool: "situation-brief", level: "simple", size: 80 } },
    { label: "Situation Brief, icon", props: { tool: "situation-brief", level: "icon", size: 26 } },
    { label: "Positioning Builder, detailed", props: { tool: "positioning", level: "detailed", size: 150 } },
    { label: "Pitch Builder, detailed", props: { tool: "pitch", level: "detailed", size: 150 } },
    { label: "Thought Leadership Builder, detailed", props: { tool: "thought-leadership", level: "detailed", size: 150 } },
    { label: "Positioning Builder, simple", props: { tool: "positioning", level: "simple", size: 80 } },
    { label: "Pitch Builder, simple", props: { tool: "pitch", level: "simple", size: 80 } },
    { label: "Thought Leadership Builder, simple", props: { tool: "thought-leadership", level: "simple", size: 80 } },
  ],
});
