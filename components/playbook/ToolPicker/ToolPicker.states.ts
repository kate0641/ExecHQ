import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { ToolPicker } from "./ToolPicker";

const hrefFor = (kind: string) => `/playbook-flow/concept-3?tool=${kind}`;
const lead = { kind: "situation-brief" as const, step: "Brief your manager before Thursday’s check-in", href: "/playbook-flow/concept-3?artifact=check-in-brief", action: "Open your draft" };

export const toolPickerStates = defineComponentStates({
  name: "ToolPicker",
  group: "navigation",
  feature: "Playbook",
  status: "draft",
  flows: ["playbook"],
  description:
    "The four tools, always first on the Playbook: each row the icon, the name and what it makes, with the next step on her plan under them when there is one. On the phone the rows sit in one card, a hairline between them (Concept 2); on web they are the rail down the left of the page (Concept 2, option A).",
  component: ToolPicker,
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Every tool is always open.",
    empty: "There are always four tools.",
    filled: NOT_AN_INPUT,
    "long text": "The four tools' names and lines are fixed, short copy.",
  },
  variants: [
    { label: "Card (Concept 2, phone) — default", props: { layout: "card", hrefFor } },
    { label: "Card with the next step under (Concept 2, phone)", props: { layout: "card", lead, hrefFor } },
    { label: "Card — focus", props: { layout: "card", hrefFor, demo: "focus" } },
    { label: "Rail (Concept 2, web)", props: { layout: "rail", hrefFor } },
    { label: "Rail with the next step under (Concept 2, web)", props: { layout: "rail", lead, hrefFor } },
    { label: "Rail — hover", props: { layout: "rail", hrefFor, demo: "hover" } },
    { label: "Rail — focus", props: { layout: "rail", hrefFor, demo: "focus" } },
    { label: "Rail — pressed", props: { layout: "rail", hrefFor, demo: "active" } },
  ],
});
