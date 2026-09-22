import { defineComponentStates } from "@/components/types";
import { ToggleGroup } from "./ToggleGroup";

const viewportOptions = [
  { value: "web", label: "Web" },
  { value: "tablet", label: "Tablet" },
  { value: "mobile", label: "Mobile" },
];

export const toggleGroupStates = defineComponentStates({
  name: "ToggleGroup",
  group: "form controls",
  status: "draft",
  flows: [],
  description:
    "Single-select segmented control built on native radio inputs, so arrow-key navigation and screen-reader semantics come from the platform. Used by the viewport toggle.",
  component: ToggleGroup,
  variants: [
    {
      label: "Default",
      props: { label: "Viewport", options: viewportOptions, defaultValue: "web" },
    },
    {
      label: "Second option selected",
      props: { label: "Viewport", options: viewportOptions, defaultValue: "tablet" },
    },
    {
      label: "With a disabled option",
      description:
        "A disabled option always carries a description explaining why, wired up with aria-describedby.",
      props: {
        label: "Viewport",
        defaultValue: "web",
        options: [
          { value: "web", label: "Web" },
          {
            value: "tablet",
            label: "Tablet",
            disabled: true,
            description: "Unavailable: the Enterprise Dashboard is web only.",
          },
          {
            value: "mobile",
            label: "Mobile",
            disabled: true,
            description: "Unavailable: the Enterprise Dashboard is web only.",
          },
        ],
      },
    },
    {
      label: "Label hidden",
      props: {
        label: "Viewport",
        labelHidden: true,
        options: viewportOptions,
        defaultValue: "mobile",
      },
    },
    {
      label: "Small",
      props: {
        label: "Status filter",
        size: "sm",
        defaultValue: "all",
        options: [
          { value: "all", label: "All" },
          { value: "in-review", label: "In review" },
          { value: "approved", label: "Approved only" },
        ],
      },
    },
  ],
});
