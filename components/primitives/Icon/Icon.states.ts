import { defineComponentStates } from "@/components/types";
import { Icon } from "./Icon";

export const iconStates = defineComponentStates({
  name: "Icon",
  group: "primitives",
  status: "draft",
  flows: [],
  description:
    "The prototype's icon set, drawn on a 20×20 grid and stroked in currentColor. Always decorative: every use pairs an icon with a visible or visually-hidden label.",
  component: Icon,
  variants: [
    { label: "Mobile", props: { name: "mobile" } },
    { label: "Tablet", props: { name: "tablet" } },
    { label: "Web", props: { name: "web" } },
    {
      label: "Hub",
      description: "The filled column shows which side the panel opens from.",
      props: { name: "hub" },
    },
    { label: "Chevron", props: { name: "chevron" } },
    { label: "Large — 32px", props: { name: "web", size: 32 } },
    { label: "Small — 14px", props: { name: "mobile", size: 14 } },
  ],
});
