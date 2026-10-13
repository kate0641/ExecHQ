import { createElement, type ComponentProps } from "react";
import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { Button } from "@/components/primitives/Button";
import { DraftToolBar } from "./DraftToolBar";

const noop = () => {};
const tools = [
  { id: "inputs", label: "Inputs", icon: "sliders" as const, onOpen: noop },
  { id: "revise", label: "Revise", icon: "pencil" as const, onOpen: noop },
  { id: "versions", label: "Versions", icon: "clock" as const, onOpen: noop },
];
const base = { label: "Your draft", tools, children: createElement(Button, { variant: "primary", onClick: noop } as unknown as ComponentProps<typeof Button>, "Mark ready") };

export const draftToolBarStates = defineComponentStates({
  name: "DraftToolBar",
  group: "navigation",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "The foot of a draft on a phone or tablet (Toolbox flow Concept 2, option B): Inputs, Revise and Versions as small icons with a word under each, each opening its own sheet, then Mark ready (later I've used this) across the rest of the row.",
  component: DraftToolBar,
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Every tool can always be opened.",
    empty: "A draft always has its three tools.",
    filled: NOT_AN_INPUT,
    "long text": "Fixed one-word labels.",
  },
  variants: [
    { label: "A draft — default", props: base },
    { label: "Revise open", props: { ...base, tools: tools.map((t) => (t.id === "revise" ? { ...t, open: true } : t)) } },
    { label: "Ready: I've used this", props: { ...base, children: createElement(Button, { variant: "primary", onClick: noop } as unknown as ComponentProps<typeof Button>, "I’ve used this") } },
    { label: "Inputs — hover", props: { ...base, demo: "hover" } },
    { label: "Inputs — focus", props: { ...base, demo: "focus" } },
    { label: "Inputs — pressed", props: { ...base, demo: "active" } },
  ],
});
