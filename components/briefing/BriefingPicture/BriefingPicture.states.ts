import { defineComponentStates } from "@/components/types";
import { NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { BriefingPicture } from "./BriefingPicture";

const publisher = "Marlow Management Review";

export const briefingPictureStates = defineComponentStates({
  name: "BriefingPicture",
  group: "primitives",
  status: "draft",
  flows: ["daily-briefing"],
  description:
    "Where an article's picture goes in Briefing Concept 2, the news app: a tinted panel naming the publisher, one tint for each of the day's three. A stand-in until image rights are settled. Decorative, so hidden from screen readers; the publisher is named in the text beside it. Three sizes: the front page's lead, a row's small square, and the top of an open read.",
  component: BriefingPicture,
  notApplicable: {
    ...NOT_INTERACTIVE,
    loading: "A stand-in panel is drawn in CSS: there is nothing to load.",
    error: "A stand-in panel is drawn in CSS: nothing can fail.",
    empty: "Every read has a publisher to name.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Lead — default", props: { place: 1, publisher, size: "lead" } },
    { label: "Reader, second read", props: { place: 2, publisher: "The Calder Quarterly", size: "reader" } },
    { label: "Thumb, third read", props: { place: 3, publisher: "Ridgeline Leadership Journal", size: "thumb" } },
    { label: "A long publisher name wraps", props: { place: 1, publisher: "The Ridgeline Journal of Leadership, Strategy and Organisational Practice", size: "lead" } },
  ],
});
