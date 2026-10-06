import { createElement as h } from "react";
import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT } from "@/components/not-applicable";
import { CardCarousel } from "./CardCarousel";

const card = (title: string, line: string) =>
  h("div", { className: "loop-row" }, h("span", { className: "loop-row__text" }, h("b", null, title), h("span", null, line)));
const three = [
  { id: "a", node: card("Your leadership story", "You used it last Tuesday. What came of it?") },
  { id: "b", node: card("Brief for your manager check-in", "Ready. Have you used it yet?") },
  { id: "c", node: card("Pitch for the Q1 planning review", "I’ll ask what came of it on Friday.") },
];

export const cardCarouselStates = defineComponentStates({
  name: "CardCarousel",
  group: "layout",
  status: "draft",
  flows: ["homepage"],
  description:
    "A row of cards she swipes or steps through, with the next card peeking in. Native scrolling and snapping, so touch, trackpad and keyboard work; Previous and Next, and a count, are there for anyone who cannot swipe. With one card the controls are left out.",
  component: CardCarousel,
  notApplicable: {
    hover: "Its only controls are Buttons, which show their own states.",
    focus: "Its only controls are Buttons, which show their own states.",
    active: "Its only controls are Buttons, which show their own states.",
    loading: "Written from local data: there is nothing to wait for.",
    error: "Nothing can fail.",
    empty: "With no cards the page leaves it out.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Default — three cards, the next peeking", props: { label: "Waiting on you", items: three } },
    {
      label: "Strip — a part for each card, each one a way to jump",
      description: "The place in the row as one thin bar. The count is said to assistive technology only.",
      props: { label: "Waiting on you (strip)", items: three, indicator: "strip" },
    },
    { label: "One card — no controls", props: { label: "Waiting on you (one)", items: three.slice(0, 1) } },
    {
      label: "Disabled — Previous at the first card",
      description: "At the first card Previous is switched off, and at the last Next is.",
      props: { label: "Waiting on you (first)", items: three.slice(0, 2) },
    },
    {
      label: "Long text — a long title wraps",
      props: {
        label: "Waiting on you (long)",
        items: [
          { id: "l", node: card("Your pitch for the Q1 cross-functional planning review across brand, product marketing and communications", "I’ll ask what came of it on Friday.") },
          { id: "m", node: card("Your leadership story", "Ready. Have you used it yet?") },
        ],
      },
    },
  ],
});
