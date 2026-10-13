import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT } from "@/components/not-applicable";
import { PickUp, type PickUpItem } from "./PickUp";

const latest: PickUpItem = { id: "check-in-brief", href: "#", title: "Brief for your manager check-in", icon: "document", detail: "Draft · 19 Oct" };
const more: PickUpItem[] = [
  { id: "post-planning", href: "#", title: "Post: what three regions taught me about planning", icon: "lightbulb", detail: "Draft · 16 Oct" },
  { id: "podcast-pitch", href: "#", title: "Pitch for the Marketing Leaders podcast", icon: "mic", detail: "Draft · 12 Oct" },
];

export const pickUpStates = defineComponentStates({
  name: "PickUp",
  group: "navigation",
  status: "draft",
  flows: ["toolbox"],
  description:
    "\"Pick up where you left off\" on the Toolbox (Concept 1): a heading, then rows straight on the page with hairlines between, no card. The draft she touched last shows; \"2 more from the last 30 days\" opens the others in place. Only what is still a draft or ready to use counts; with nothing open, the page leaves the section out.",
  component: PickUp,
  notApplicable: {
    ...FIXED_CONTENT,
    disabled: "Every draft can always be opened.",
    empty: "With no open draft the Toolbox leaves the section out, so it is never shown empty.",
    filled: NOT_AN_INPUT,
    hover: "Nothing changes on hover, which carries no meaning on a phone (designer, 11 Oct).",
  },
  variants: [
    { label: "Latest and two more — default", props: { latest, more } },
    { label: "First row — focus", props: { latest, more, demo: "focus" } },
    { label: "Opened, the others showing", props: { latest, more, startOpen: true }, states: ["active"], description: "Pressing the last line opens the others above it; it then reads Show fewer." },
    { label: "Only one in the last 30 days", props: { latest } },
    {
      label: "A long title wraps",
      props: { latest: { ...latest, title: "Brief for the quarterly business review with the CMO and the regional leads" }, more },
      states: ["long text"],
    },
  ],
});
