import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { AccountMenu } from "./AccountMenu";

export const accountMenuStates = defineComponentStates({
  name: "AccountMenu",
  group: "navigation",
  status: "draft",
  flows: ["enterprise"],
  description:
    "The sponsor's account menu at the right of the enterprise header: their initials in a round DropdownMenu button, opening who is signed in, Your profile and Sign out. Neither page behind it is designed yet, so both items are unavailable and say so.",
  component: AccountMenu,
  notApplicable: {
    loading: "Who is signed in is known before the page draws: nothing to wait for.",
    error: "Opening it only shows a list: nothing can fail.",
    empty: "Someone is always signed in on the dashboard.",
    disabled: "The account is always reachable while signed in.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Initials — default", props: {} },
    { label: "Open, showing who is signed in", description: "Press the initials, or Down, to try the keyboard.", props: { defaultOpen: true, inline: true } },
    { label: "Hover", props: { demo: "hover" } },
    { label: "Focus", props: { demo: "focus" } },
    { label: "Pressed", props: { demo: "active" } },
    {
      label: "A long name and role wraps",
      props: {
        defaultOpen: true,
        inline: true,
        person: { name: "Alexandra Montgomery-Whitfield", initials: "AM", role: "Senior Director, Global Leadership and Talent Development", org: "Northgate" },
      },
    },
  ],
});
