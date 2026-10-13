import { createElement } from "react";
import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { SourceLabel } from "@/components/briefing/SourceLabel";
import { List } from "@/components/layout/List";
import { TODAYS_READS } from "@/mock/briefing";
import { GOES_WITH, TOOLS, USE_CASE_COPY } from "@/mock/toolbox";
import { ToolUseCase } from "./ToolUseCase";

const noop = () => {};
const goesWith = createElement(List, {
  label: USE_CASE_COPY.goesWith,
  items: [
    { id: "story", primary: "Your leadership story", secondary: `Draft · ${GOES_WITH.drawsOn.pitch}`, leading: { type: "icon", name: "person" } },
    { id: "pitch", primary: "Pitch for the Q1 planning review", secondary: `Waiting to hear · ${GOES_WITH.lastPitch}`, leading: { type: "icon", name: "mic" } },
  ],
});
const pitchChoice = { label: "What are you pitching for?", options: ["Speaking", "Podcast", "Press"], value: "Podcast", onChange: noop, note: USE_CASE_COPY.fromPlan };

export const toolUseCaseStates = defineComponentStates({
  name: "ToolUseCase",
  group: "layout",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "The first screen of every tool (option C): the tool's detailed drawing, then the decision. Its name set large, one sentence on what it makes and one on when to use it, what she'll need, the step on her plan, the tool's first question beside one button that says what it will make (a plan step's answer chosen for her and marked), or, in Concept 1, its answers as rows that each start the tool, and under it what this work goes with: at most two pieces of her work, each with one action. Nothing that sells or ranks. Side by side on web.",
  component: ToolUseCase,
  notApplicable: {
    disabled: "Every answer and the start button are always open to her.",
    ...FIXED_CONTENT,
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Pitch Builder, choice from her plan and what it goes with — default",
      props: { tool: TOOLS.pitch, planStep: "Pitch yourself to a podcast the people above you follow", choice: pitchChoice, startLabel: "Start a podcast pitch", onStart: noop, goesWith, headingLevel: 2 },
    },
    { label: "Picture and decision only", props: { tool: TOOLS["situation-brief"], planStep: "Brief your manager before Thursday’s check-in", onStart: noop, headingLevel: 2 } },
    {
      label: "Started from today's Briefing",
      props: { tool: TOOLS["thought-leadership"], source: createElement(SourceLabel, { read: TODAYS_READS[0] }), choice: { label: "What are you writing?", options: ["LinkedIn post", "Short article", "Long-form article"], value: "LinkedIn post", onChange: noop }, startLabel: "Start a post", onStart: noop, headingLevel: 2 },
    },
    { label: "Nothing it goes with yet — empty", props: { tool: TOOLS.positioning, onStart: noop, headingLevel: 2 } },
    {
      label: "Each answer starts it (Concept 1)",
      props: { tool: TOOLS["situation-brief"], planStep: "Brief your manager before Thursday’s check-in", choice: { label: "What is the moment?", options: ["A review", "A board meeting", "A negotiation", "An executive conversation", "Something else"], value: "A review", onChange: noop, fromPlan: "A review" }, choiceStarts: true, onStart: noop, headingLevel: 2 },
    },
    { label: "Each answer starts it — hover", props: { tool: TOOLS.pitch, choice: { ...pitchChoice, note: undefined, value: "" }, choiceStarts: true, onStart: noop, headingLevel: 2, demo: "hover" } },
    { label: "Each answer starts it — focus", props: { tool: TOOLS.pitch, choice: { ...pitchChoice, note: undefined, value: "" }, choiceStarts: true, onStart: noop, headingLevel: 2, demo: "focus" } },
    { label: "Each answer starts it — pressed", props: { tool: TOOLS.pitch, choice: { ...pitchChoice, note: undefined, value: "" }, choiceStarts: true, onStart: noop, headingLevel: 2, demo: "active" } },
    { label: "Name and what it makes only (Concept 2)", props: { tool: TOOLS["situation-brief"], noStart: true, headingLevel: 2, noPicture: true, brief: true } },
    { label: "Without its own start button", props: { tool: TOOLS.pitch, choice: { ...pitchChoice, note: undefined, value: "" }, noStart: true, headingLevel: 2 } },
    { label: "Situation Brief, a long plan step wraps", props: { tool: TOOLS["situation-brief"], planStep: "Brief your manager before Thursday’s check-in about the planning workstream and what it means for the Q1 review", onStart: noop, headingLevel: 2 } },
  ],
});
