import { defineComponentStates } from "@/components/types";
import { Input } from "./Input";

export const inputStates = defineComponentStates({
  name: "Input",
  group: "form controls",
  status: "draft",
  flows: [],
  description:
    "Text field. The label is a required prop, so an unlabelled field cannot be built by accident. Errors are wired to the field with aria-describedby and never rely on colour alone.",
  component: Input,
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
        placeholder: "I want to lead a larger marketing organisation",
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
          "I want to lead a larger organisation, with a broader remit than I have now.",
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
      label: "Label hidden",
      props: { label: "Search components", labelHidden: true, placeholder: "Search" },
    },
  ],
});
