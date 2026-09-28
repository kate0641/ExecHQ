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
    "The frame of Navigation Concept 1's advisor: his name, the conversation, the composer and the privacy line. A sheet over the phone; a panel docked beside the page on tablet and web.",
  component: ConciergePanel,
  notApplicable: {
    disabled: "The advisor is always available.",
    error: "Nothing is sent anywhere: replies are local, so nothing can fail to arrive.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    {
      label: "Docked, mid-conversation — default",
      props: { mode: "docked", children: conversation, onNew: noop, onClose: noop },
    },
    {
      label: "Sheet, on the phone",
      props: { mode: "sheet", children: conversation, onNew: noop, onClose: noop },
    },
    {
      label: "Empty, a new conversation",
      description: "Before anything is asked. The concept puts destinations, your work and suggestions here.",
      props: { mode: "docked", children: start, onClose: noop },
    },
    {
      label: "Loading, while he writes",
      description: "The typing message, from ChatMessage.",
      props: {
        mode: "docked",
        children: [conversation[0], h(ChatMessage, { key: "t", from: "advisor", lead: true, typing: true })],
        onNew: noop,
        onClose: noop,
      },
    },
    {
      label: "A long conversation scrolls",
      props: { mode: "docked", children: long, onNew: noop, onClose: noop },
    },
    { label: "Close — hover", props: { mode: "docked", children: conversation, onClose: noop, demo: "hover" } },
    { label: "Close — focus", props: { mode: "docked", children: conversation, onClose: noop, demo: "focus" } },
    { label: "Close — pressed", props: { mode: "docked", children: conversation, onClose: noop, demo: "active" } },
  ],
});
