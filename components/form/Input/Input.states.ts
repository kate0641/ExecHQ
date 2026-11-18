import { defineComponentStates } from "@/components/types";
import { Input } from "./Input";

export const inputStates = defineComponentStates({
  name: "Input",
  group: "form controls",
  status: "draft",
  flows: [],
  description:
    "Text field. The label is a required prop, so an unlabelled field cannot be built by accident. Errors are wired to the field with aria-describedby and never rely on color alone.",
  component: Input,
  notApplicable: {
    active: "A text field has no pressed state; focus covers it.",
    loading: "A text field never waits on anything.",
  },
  variants: [
    { label: "Default", props: { label: "Personal email" } },
    {
      label: "Hover",
      props: { label: "Personal email", className: "is-hover" },
    },
    {
      label: "Focus",
      props: { label: "Personal email", className: "is-focus" },
    },
    {
      label: "With hint",
      props: {
        label: "Personal email",
        hint: "A personal address, not a work one. Your employer never sees this account.",
      },
    },
    {
      label: "Filled",
      props: { label: "Personal email", defaultValue: "maya@example.com" },
    },
    { label: "Required", props: { label: "Personal email", required: true } },
    {
      label: "Error",
      props: {
        label: "Personal email",
        defaultValue: "maya@company.com",
        error: "Use a personal email address, not a work one.",
      },
    },
    { label: "Disabled", props: { label: "Personal email", disabled: true } },
    {
      label: "Empty state — placeholder",
      props: {
        label: "What would you like to move toward?",
        placeholder: "I want to lead a larger marketing organization",
      },
    },
    {
      label: "Multiline",
      props: {
        label: "What would you like to move toward?",
        multiline: true,
        hint: "A role, a scope, an aspiration or a challenge. A precise title is optional.",
      },
    },
    {
      label: "Statement",
      description:
        "No box. An underlined line in the serif, for text being composed rather than a form being completed.",
      props: {
        label: "What would you like to move toward?",
        labelHidden: true,
        variant: "statement" as const,
        multiline: true,
        rows: 2,
        defaultValue:
          "I want to lead a larger organization, with a broader remit than I have now.",
      },
    },
    {
      label: "Statement — empty",
      props: {
        label: "What would you like to move toward?",
        labelHidden: true,
        variant: "statement" as const,
        multiline: true,
        rows: 2,
        placeholder: "A role, a scope, an aspiration or a challenge.",
      },
    },
    {
      label: "Pill",
      description: "A rounded field with its label inside the top edge, for a short form like sign in.",
      props: { label: "Your personal email", variant: "pill" as const, type: "email" },
    },
    {
      label: "Pill — filled",
      props: { label: "Your personal email", variant: "pill" as const, type: "email", defaultValue: "maya.chen@example.com" },
    },
    {
      label: "Pill — focus",
      props: { label: "Your personal email", variant: "pill" as const, className: "is-focus" },
    },
    {
      label: "Pill — error",
      props: {
        label: "Your personal email",
        variant: "pill" as const,
        defaultValue: "maya.chen@",
        error: "That doesn\u2019t look like an email address. Check it and try again.",
      },
    },
    {
      label: "Label hidden",
      props: { label: "Search components", labelHidden: true, placeholder: "Search" },
    },
  ],
});
