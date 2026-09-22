import { defineComponentStates } from "@/components/types";
import { TextLink } from "./TextLink";

export const textLinkStates = defineComponentStates({
  name: "TextLink",
  group: "primitives",
  status: "draft",
  flows: [],
  description:
    "Link. Underlined by default so it is identifiable without colour; `quiet` drops the underline for dense lists where the surrounding structure already reads as navigation.",
  component: TextLink,
  variants: [
    { label: "Default", props: { href: "/plan/concept-1", children: "Open the Plan" } },
    {
      label: "Default — hover",
      props: { href: "/plan/concept-1", children: "Open the Plan", className: "is-hover" },
    },
    {
      label: "Default — focus",
      props: { href: "/plan/concept-1", children: "Open the Plan", className: "is-focus" },
    },
    {
      label: "Quiet",
      props: { href: "/toolbox/concept-1", tone: "quiet", children: "Toolbox" },
    },
    {
      label: "Standalone",
      props: {
        href: "/daily-briefing/concept-1",
        tone: "standalone",
        children: "Read today's briefing",
      },
    },
  ],
});
