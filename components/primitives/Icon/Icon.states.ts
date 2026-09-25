import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { Icon } from "./Icon";

export const iconStates = defineComponentStates({
  name: "Icon",
  group: "primitives",
  status: "draft",
  flows: [],
  description:
    "The prototype's icon set, drawn on a 20×20 grid and stroked in currentColor. Always decorative: every use pairs an icon with a visible or visually-hidden label.",
  component: Icon,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always drawn in full; it takes no content.",
    "long text": "Contains no text.",
    filled: NOT_AN_INPUT,
  },
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
    {
      label: "Shield",
      description: "Privacy. Closed, because the promise is that nothing leaves.",
      props: { name: "shield" },
    },
    { label: "Lock", props: { name: "lock" } },
    { label: "Mic", props: { name: "mic" } },
    { label: "Send", props: { name: "send" } },
    { label: "Check", props: { name: "check" } },
    { label: "Document", props: { name: "document" } },
    { label: "Link", props: { name: "link" } },
    { label: "Pencil", props: { name: "pencil" } },
    { label: "Large — 32px", props: { name: "web", size: 32 } },
    { label: "Small — 14px", props: { name: "mobile", size: 14 } },
  ],
});
