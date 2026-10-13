import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { RespondLink } from "./RespondLink";

const href = "/toolbox-flow/concept-1?source=briefing&read=planning-season";

export const respondLinkStates = defineComponentStates({
  name: "RespondLink",
  group: "navigation",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "The way from a read into Thought Leadership Builder: Write a post about this, and what will happen, as one link. Under a read's actions, and at the end of an article read in ExecHQ (Briefing Concept 2). Never a gate.",
  component: RespondLink,
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Every read can always be written about.",
    empty: "Fixed copy: always there.",
    filled: NOT_AN_INPUT,
    "long text": "Fixed copy only; the read's title is never shown here.",
  },
  variants: [
    { label: "Default", props: { href } },
    { label: "Hover", props: { href, demo: "hover" } },
    { label: "Focus", props: { href, demo: "focus" } },
    { label: "Pressed", props: { href, demo: "active" } },
  ],
});
