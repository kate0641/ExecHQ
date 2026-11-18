import { defineComponentStates } from "@/components/types";
import { TOUR_COPY } from "@/mock/onboarding";
import { FirstVisitTour } from "./FirstVisitTour";

const noop = () => {};
const base = {
  className: "tour--demo",
  label: TOUR_COPY.label,
  skipLabel: TOUR_COPY.skip,
  onNext: noop,
  onSkip: noop,
};

export const firstVisitTourStates = defineComponentStates({
  name: "FirstVisitTour",
  group: "navigation",
  status: "draft",
  flows: ["homepage"],
  description:
    "One stop of the first-visit tour of Home, after onboarding (Kate, 2026-11-12): the screen dims, one thing is lit with a yellow ring, and a card beside it says what it is. Three stops: the Ask or go pill, Go to, chatting with ExecEngine. Focus goes to the card's button; Escape skips. Drawn here in its own box; in the product it covers the device screen.",
  component: FirstVisitTour,
  notApplicable: {
    loading: "It measures what to light before it draws; nothing is fetched.",
    error: "Nothing can fail: if what to light isn't found, the screen dims without a cutout.",
    filled: "Not an input, so there is nothing to fill in.",
    disabled: "Its two buttons are always available.",
    "long text": "Its words are fixed: three short cards.",
    hover: "Its two buttons are plain: hover changes only the pointer, nothing a still example can show.",
    active: "Its two buttons are plain: pressing changes nothing a still example can show.",
  },
  variants: [
    {
      label: "Stop 1, the pill (card above), focus on Next",
      props: { ...base, rect: { top: 290, left: 16, width: 320, height: 52, radius: 26 }, placement: "above" as const, counter: TOUR_COPY.counter(1, 3), title: TOUR_COPY.steps[0].title, body: TOUR_COPY.steps[0].body, nextLabel: TOUR_COPY.next },
    },
    {
      label: "Stop 2, Go to (card below)",
      props: { ...base, rect: { top: 24, left: 16, width: 320, height: 72, radius: 16 }, placement: "below" as const, counter: TOUR_COPY.counter(2, 3), title: TOUR_COPY.steps[1].title, body: TOUR_COPY.steps[1].body, nextLabel: TOUR_COPY.next },
    },
    {
      label: "Stop 3, the last (Got it)",
      props: { ...base, rect: { top: 200, left: 16, width: 320, height: 120, radius: 16 }, placement: "above" as const, counter: TOUR_COPY.counter(3, 3), title: TOUR_COPY.steps[2].title, body: TOUR_COPY.steps[2].body, nextLabel: TOUR_COPY.done },
    },
    {
      label: "Empty: nothing found to light",
      states: ["empty"],
      props: { ...base, rect: null, placement: "below" as const, counter: TOUR_COPY.counter(1, 3), title: TOUR_COPY.steps[0].title, body: TOUR_COPY.steps[0].body, nextLabel: TOUR_COPY.next },
    },
  ],
});
