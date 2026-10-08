import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { BRIEFING_STUB } from "@/mock/homepage";
import { EntryLink } from "./EntryLink";

const plan = {
  href: "/plan/concept-3",
  icon: "flag" as const,
  eyebrow: "Your plan",
  title: "Step up",
  detail: "Toward leading a broader marketing organization",
};

export const entryLinkStates = defineComponentStates({
  name: "EntryLink",
  group: "navigation",
  status: "draft",
  flows: ["homepage"],
  description:
    "A way from the homepage to another destination that says what’s there: what it is, the one thing it leads to, and why it matters. Homepage Concept 1 uses it for the plan, a draft to pick up, and today’s Briefing.",
  component: EntryLink,
  notApplicable: {
    disabled: "Shown only when there is somewhere to go.",
    loading: "Written from local data: there is nothing to wait for.",
    error: "A link: nothing can fail.",
    empty: "Shown only when it has something to say; with nothing, the page leaves it out.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Your plan — default", props: plan },
    {
      label: "Today’s Briefing, with why it matters",
      props: {
        href: "/daily-briefing/concept-1",
        icon: "briefing",
        eyebrow: BRIEFING_STUB.eyebrow(BRIEFING_STUB.reads),
        title: BRIEFING_STUB.lead,
        detail: BRIEFING_STUB.why,
      },
    },
    {
      label: "A draft to pick up",
      props: { href: "/toolbox-flow/concept-1", icon: "draft", eyebrow: "Pick up where you left off", title: "Brief for your manager check-in", detail: "Edited 19 Oct" },
    },
    { label: "Title only", props: { ...plan, detail: undefined } },
    {
      label: "A long title wraps",
      props: { ...plan, title: "Step up", detail: "Toward leading a broader marketing organization across brand, product marketing and communications" },
    },
    { label: "Hover", props: { ...plan, demo: "hover" } },
    { label: "Focus", props: { ...plan, demo: "focus" } },
    { label: "Pressed", props: { ...plan, demo: "active" } },
  ],
});
