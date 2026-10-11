import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { CONTROLS_INSIDE, FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { SourceLabel } from "@/components/briefing/SourceLabel";
import { TODAYS_READS } from "@/mock/briefing";
import { TOOLS } from "@/mock/toolbox";
import { ToolUseCase } from "./ToolUseCase";

const noop = () => {};

export const toolUseCaseStates = defineComponentStates({
  name: "ToolUseCase",
  group: "layout",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "The first screen of every tool: one sentence on what it makes, one on when to use it, what she'll need and the step on her plan it serves. No feature tour. The same screen for all four tools; only the words differ.",
  component: ToolUseCase,
  notApplicable: {
    ...CONTROLS_INSIDE,
    ...FIXED_CONTENT,
    empty: "Every tool has its use case.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Thought Leadership Builder — default", props: { tool: TOOLS["thought-leadership"], planStep: "Post what you lead on LinkedIn", onStart: noop, headingLevel: 2 } },
    {
      label: "Started from today's Briefing",
      description: "The read arrives with her, labelled as the source.",
      props: { tool: TOOLS["thought-leadership"], source: createElement(SourceLabel, { read: TODAYS_READS[0] }), onStart: noop, headingLevel: 2 },
    },
    { label: "Positioning Builder", props: { tool: TOOLS.positioning, planStep: "Write your bio", onStart: noop, headingLevel: 2 } },
    { label: "Pitch Builder", props: { tool: TOOLS.pitch, onStart: noop, headingLevel: 2 } },
    { label: "Situation Brief, a long plan step wraps", props: { tool: TOOLS["situation-brief"], planStep: "Brief your manager before Thursday’s check-in", onStart: noop, headingLevel: 2 } },
    { label: "Without its own start button", props: { tool: TOOLS.pitch, noStart: true, headingLevel: 2 } },
  ],
});
