import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { TextLink } from "./TextLink";

export const textLinkStates = defineComponentStates({
  name: "TextLink",
  group: "primitives",
  status: "draft",
  flows: [],
  description:
    "Link. Underlined by default so it is identifiable without colour; `quiet` drops the underline for dense lists where the surrounding structure already reads as navigation.",
  component: TextLink,
  notApplicable: {
    disabled: "Links are never disabled: where there is nowhere to go, there is no link.",
    loading: "Following a link has no in-place wait.",
    error: "A link reports no error itself.",
    empty: "Always has link text.",
    filled: NOT_AN_INPUT,
  },
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
