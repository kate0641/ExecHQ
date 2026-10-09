import { createElement as h } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ConciergePanel } from "./ConciergePanel";

const noop = () => {};

const conversation = [
  h(ChatMessage, { key: "a", from: "you" }, "It went well, she asked me to lead the planning workstream"),
  h(ChatMessage, { key: "b", from: "advisor", lead: true }, "Logged, in your words: “It went well, she asked me to lead the planning workstream”"),
];

const start = h(
  "p",
  { className: "concierge-panel__hint" },
  "Where to, or what are you working on? The concept fills this with destinations, your work and suggestions."
);

const long = Array.from({ length: 6 }, (_, i) =>
  h(ChatMessage, { key: i, from: i % 2 ? "advisor" : "you", lead: i % 2 === 1 }, i % 2
    ? "Here’s how I’d approach it, from what you’ve told me. Ask for a piece of work before a title, bring the proof in writing, and find out who else decides."
    : "How do I ask for more scope?")
);

export const conciergePanelStates = defineComponentStates({
  name: "ConciergePanel",
  group: "navigation",
  status: "draft",
  flows: ["navigation"],
  description:
    "The frame of Navigation Concept 1's advisor: an optional row above (the way to the product's places, once she is talking), his name, the conversation, and the composer. A sheet over the phone; a centred card on tablet and web, which the pill grows into.",
  component: ConciergePanel,
  notApplicable: {
    disabled: "The advisor is always available.",
    error: "Nothing is sent anywhere: replies are local, so nothing can fail to arrive.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Card, mid-conversation — default",
      props: { mode: "card", children: conversation, onNew: noop, onClose: noop },
    },
    {
      label: "Sheet, on the phone",
      props: { mode: "sheet", children: conversation, onNew: noop, onClose: noop },
    },
    {
      label: "Sheet, with the places above the head",
      description: "Once she is talking, the concept puts the way to the product's places above the advisor's head, held while the chat scrolls.",
      props: {
        mode: "sheet",
        top: h(
          "ul",
          { className: "concierge-dests", "aria-label": "Go to" },
          ["Home", "Plan", "Signals", "Toolbox", "Briefing"].map((label) =>
            h("li", { key: label }, h("a", { href: "#", className: label === "Plan" ? "concierge-dest is-current" : "concierge-dest" }, label))
          )
        ),
        children: conversation,
        onNew: noop,
        onClose: noop,
      },
    },
    {
      label: "Empty, a new conversation",
      description: "Before anything is asked. The concept puts destinations, your work and suggestions here.",
      props: { mode: "card", children: start, onClose: noop },
    },
    {
      label: "Loading, while he writes",
      description: "The typing message, from ChatMessage.",
      props: {
        mode: "card",
        children: [conversation[0], h(ChatMessage, { key: "t", from: "advisor", lead: true, typing: true })],
        onNew: noop,
        onClose: noop,
      },
    },
    {
      label: "A long conversation scrolls",
      props: { mode: "card", children: long, onNew: noop, onClose: noop },
    },
    { label: "Close — hover", props: { mode: "card", children: conversation, onClose: noop, demo: "hover" } },
    { label: "Close — focus", props: { mode: "card", children: conversation, onClose: noop, demo: "focus" } },
    { label: "Close — pressed", props: { mode: "card", children: conversation, onClose: noop, demo: "active" } },
  ],
});
