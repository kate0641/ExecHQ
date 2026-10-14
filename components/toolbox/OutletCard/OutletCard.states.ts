import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { OUTLETS } from "@/mock/toolbox";
import { OutletCard } from "./OutletCard";

const today = "2026-10-14";
const at = (id: string) => OUTLETS.find((o) => o.id === id)!;
const card = (id: string) => ({ name: at(id).name, outlet: at(id), today });

export const outletCardStates = defineComponentStates({
  name: "OutletCard",
  group: "cards",
  status: "draft",
  flows: ["toolbox-flow"],
  description:
    "Where a pitch goes, above the draft (Kate, 14 Oct): the outlet, what it asks for, the contact, how to send it, and the page it came from with the day it was checked. What the page doesn’t say is a question to her, never a guess. Every outlet here is made up.",
  component: OutletCard,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "It arrives with the draft, which is written after the page is read; the card has nothing to wait for.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "A form, two fields — default", props: card("marketing-leaders-podcast") },
    { label: "Email, with the editor the outlet names", props: card("commercial-leader-quarterly") },
    { label: "Email, no limit", props: card("planning-leaders-conference") },
    { label: "Checked over 30 days ago", props: card("commercial-strategy-summit"), description: "The summit’s page was checked on 2 September." },
    { label: "Deadline passed", props: { ...card("commercial-strategy-summit"), today: "2026-11-20" } },
    { label: "Nothing published about what they want — empty", props: card("scope-and-scale") },
    { label: "No contact published", props: card("field-notes"), description: "The contact is a question to her." },
    {
      label: "No page found — failed to find it",
      props: { name: "The Growth Summit", type: "Speaking" as const, today },
      states: ["error"],
      description: "Somewhere she named that ExecHQ has no page for.",
    },
    { label: "Inside her company", props: card("q1-planning-review") },
    {
      label: "A long name and long asks wrap",
      props: {
        ...card("commercial-strategy-summit"),
        outlet: { ...at("commercial-strategy-summit"), name: "The Commercial Strategy and Revenue Operations Leadership Summit, Europe" },
        today: "2026-10-01",
      },
    },
  ],
});
