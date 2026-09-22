import { defineComponentStates } from "@/components/types";
import { Button } from "./Button";

export const buttonStates = defineComponentStates({
  name: "Button",
  group: "primitives",
  status: "draft",
  flows: [],
  description:
    "Primary action control. Primary carries the single most important action on a surface; secondary and ghost step back from it.",
  component: Button,
  variants: [
    { label: "Primary — default", props: { children: "Save draft" } },
    {
      label: "Primary — hover",
      description: "Shown with .is-hover, the same rule as :hover.",
      props: { children: "Save draft", className: "is-hover" },
    },
    {
      label: "Primary — focus",
      description: "Shown with .is-focus, the same rule as :focus-visible.",
      props: { children: "Save draft", className: "is-focus" },
    },
    {
      label: "Primary — active",
      description: "Shown with .is-active, the same rule as :active.",
      props: { children: "Save draft", className: "is-active" },
    },
    { label: "Primary — disabled", props: { children: "Save draft", disabled: true } },
    { label: "Primary — loading", props: { children: "Saving", loading: true } },
    { label: "Secondary — default", props: { variant: "secondary", children: "Skip for now" } },
    {
      label: "Secondary — hover",
      props: { variant: "secondary", children: "Skip for now", className: "is-hover" },
    },
    {
      label: "Secondary — disabled",
      props: { variant: "secondary", children: "Skip for now", disabled: true },
    },
    { label: "Ghost — default", props: { variant: "ghost", children: "Cancel" } },
    {
      label: "Ghost — hover",
      props: { variant: "ghost", children: "Cancel", className: "is-hover" },
    },
    { label: "Ghost — disabled", props: { variant: "ghost", children: "Cancel", disabled: true } },
    { label: "Small", props: { size: "sm", children: "Edit" } },
    { label: "Full width", props: { fullWidth: true, children: "Show me a first step" } },
  ],
});
