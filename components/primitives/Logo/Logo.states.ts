import { defineComponentStates } from "@/components/types";
import { FIXED_CONTENT, NOT_AN_INPUT, NOT_INTERACTIVE } from "@/components/not-applicable";
import { Logo } from "./Logo";

export const logoStates = defineComponentStates({
  name: "Logo",
  group: "primitives",
  status: "draft",
  flows: [],
  description:
    "The ExecHQ logo, in two versions. Dark (gold and navy) sits on stone and blue 100; light (bright yellow and light blue) sits on any dark color. Not yet in the product: the Wordmark still stands in for it.",
  component: Logo,
  notApplicable: {
    ...NOT_INTERACTIVE,
    ...FIXED_CONTENT,
    empty: "Always shows the logo.",
    "long text": "The logo is fixed artwork; it takes no copy.",
    filled: NOT_AN_INPUT,
  },
  variants: [
    { label: "Dark — on stone", props: { tone: "dark" } },
    {
      label: "Light — on dark",
      description: "On navy here; the same on the darkest navy, dark green or stone 900.",
      surface: "inverse",
      props: { tone: "light" },
    },
    { label: "Dark — extra large", props: { tone: "dark", size: "xl" } },
  ],
});
